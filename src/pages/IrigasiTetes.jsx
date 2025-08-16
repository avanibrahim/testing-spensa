import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  WifiOff, Wifi, Thermometer, Activity, Droplets,
  Download, CloudRain, Leaf, CheckCircle, Sun,
} from "lucide-react";
import { Link } from "react-router-dom";
import DataLoggerIrigasi from "@/components/DataLoggerIrigasi";
import SensorChartIrigasi from "@/components/SensorChartIrigasi";
import useSpreadsheet from "@/hooks/useSpreadsheet";
import Navbar from "@/components/Navbar";

const SPREADSHEET_ID = "1Y_LrC7kzvRlMPthtowIohP3ubRVGYDLoZEvjR2YPt1g";
const SHEET_GID = 0; // Sheet pertama

function parseNumber(value) {
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.,-]/g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return typeof value === "number" ? value : 0;
}

const IrigasiTetes = () => {
  const [isLive, setIsLive] = useState(false);
  const [dummyData, setDummyData] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(0);

  // Tambahan: hanya show loading saat initial load live
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data: sheetData, loading } = useSpreadsheet(
    SPREADSHEET_ID,
    SHEET_GID,
    reloadFlag
  );

  // Auto-refetch timer mode Live
  useEffect(() => {
    let interval;
    if (isLive) {
      setIsInitialLoad(true); // setiap ganti ke mode live, loading true lagi
      interval = setInterval(() => {
        setReloadFlag(f => f + 1);
      }, 5000); // Refresh setiap 5 detik
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Matikan loading setelah pertama kali load
  useEffect(() => {
    if (isLive && !loading) {
      setIsInitialLoad(false);
    }
    if (!isLive) {
      setIsInitialLoad(false);
    }
  }, [isLive, loading]);

  // Tambah helper di file ini!
function parseTimestamp(row) {
  if (row["Timestamp"] && row["Waktu"]) {
    // Deteksi apakah format sudah ISO
    if (row["Timestamp"].includes('-')) {
      return `${row["Timestamp"]}T${row["Waktu"]}`;
    }
    // Jika format dd/mm/yyyy
    if (row["Timestamp"].includes('/')) {
      const [d, m, y] = row["Timestamp"].split('/');
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}T${row["Waktu"]}`;
    }
  }
  return row["Timestamp"] || row["Waktu"] || new Date().toISOString();
}

// Kemudian di mapping:
const mappedData = isLive
  ? sheetData
      .filter((row) => row["Timestamp"] || row["Waktu"])
      .map((row) => ({
        timestamp: parseTimestamp(row),
          temperature: parseNumber(row["Suhu Tanah"]),
          temperatureAir: parseNumber(row["Suhu Udara"]),
          humidity: parseNumber(row["Kelembaban Udara"]),
          soilMoisture: parseNumber(row["Kelembapan Tanah"]),
          ph: parseNumber(row["pH"]),
          flowRate: parseNumber(row["Flow Rate"]),
         status: row["ESP_ID"] ? "connected" : "disconnected",
        }))
    : dummyData;

  // Log debugging (bisa dihapus kalau sudah yakin jalan)
  useEffect(() => {
    if (isLive && sheetData.length > 0) {
      console.log("=== RAW sheetData[0] ===", sheetData[0]);
      console.log("=== MAPPED mappedData[0] ===", mappedData[0]);
    }
  }, [isLive, sheetData, mappedData]);

  // Dummy data generator saat mode simulasi
  useEffect(() => {
    let interval;
    if (!isLive) {
      interval = setInterval(() => {
        setDummyData((prev) => [
          {
            timestamp: new Date().toISOString(),
            temperature: 25 + Math.random() * 5,
            temperatureAir: 28 + Math.random() * 4,
            humidity: 60 + Math.random() * 10,
            soilMoisture: 35 + Math.random() * 15,
            ph: 6 + Math.random(),
            flowRate: Math.random() * 10,
            status: "dummy",
          },
          ...prev,
        ]);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Download CSV dari data mapped
  const handleDownloadCSV = () => {
    const csv =
      "Timestamp,Suhu Tanah,Suhu Udara,Kelembaban Udara,Kelembapan Tanah,pH,Flow Rate\n" +
      mappedData
        .map((d) =>
          [
            d.timestamp,
            d.temperature?.toFixed(1),
            d.temperatureAir?.toFixed(1),
            d.humidity?.toFixed(1),
            d.soilMoisture?.toFixed(1),
            d.ph?.toFixed(2),
            d.flowRate?.toFixed(2),
          ].join(",")
        )
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data-irigasi.csv";
    link.click();
  };

  const SensorStatusBar = () => {
    const sensors = [
      { name: "Suhu Tanah", icon: Thermometer, color: "red" },
      { name: "Suhu Udara", icon: Sun, color: "yellow" },
      { name: "Kelembaban Udara", icon: CloudRain, color: "blue" },
      { name: "Kelembapan Tanah", icon: Leaf, color: "green" },
      { name: "pH Tanah", icon: Droplets, color: "purple" },
      { name: "Flow", icon: Activity, color: "orange" },
    ];
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {sensors.map((sensor, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className={`flex flex-col items-center justify-center border-2 border-${sensor.color}-300 rounded-xl p-4 bg-white shadow`}
          >
            <sensor.icon className={`w-8 h-8 text-${sensor.color}-500 mb-1`} />
            <span className="text-sm text-gray-700 font-medium">{sensor.name}</span>
            <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section className="py-10 bg-red-100">
      <header>
        <Navbar />
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-red-700 flex justify-center items-center gap-3">
            <span className="text-5xl">🌶️</span> Monitoring Irigasi Tetes
          </h1>
          <p className="text-gray-600">
            Data yang ditampilkan adalah <strong>Real-Time</strong>
          </p>
          <p className="text-red-700 mt-1">
            Tanaman: <strong>Cabai</strong> | Metode: <strong>Irigasi Tetes Otomatis</strong>
          </p>
          <div className="flex justify-center mt-4 gap-4">
            <Link to="/BerandaIrigasi">
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Masuk ke Beranda Irigasi
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white rounded-xl shadow p-4 mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-red-600">
            {isLive ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
            <span className="text-sm font-semibold">
              {isLive ? "Mode Live: Spreadsheet" : "Mode Simulasi: Data Dummy"}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-4 py-2 bg-white border rounded-lg text-green-700 hover:bg-green-50"
            >
              {isLive ? "Matikan Live" : "Aktifkan Live"}
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" /> Unduh CSV
            </button>
          </div>
        </motion.div>

        <SensorStatusBar />
        <SensorChartIrigasi data={mappedData} isLive={isLive} />
        <div className="mt-10">
          <DataLoggerIrigasi
            data={mappedData}
            isLive={isLive}
            loading={isLive && isInitialLoad} // INI KUNCI LOADING HANYA PERTAMA SAJA
          />
        </div>
      </div>
    </section>
  );
};

export default IrigasiTetes;
