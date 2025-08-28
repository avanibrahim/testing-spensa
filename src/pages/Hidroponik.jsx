import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  Gauge,
  Wifi,
  WifiOff,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SensorChart from '@/components/SensorChart';
import DataLogger from '@/components/DataLogger';
import Navbar from '@/components/Navbar';
import useSpreadsheetHidroponik from "@/hooks/useSpreadsheetHidroponik";

// GANTI ID DAN GID SESUAI SHEET HIDROPONIK KAMU!
const SPREADSHEET_ID = "1rL0v_f4yI4cWr6g0uTwHQSqG-ASnI4cnYw0WArDbDx";
const SHEET_GID = 1; // Tab pertama atau sesuai

function parseNumber(val) {
  if (typeof val === "string") {
    const cleaned = val.replace(/[^0-9.,-]/g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return typeof val === "number" ? val : 0;
}

function parseTimestamp(row) {
  if (row["Timestamp (UTC)"] && row["Waktu (WIB)"]) {
    return `${row["Timestamp (UTC)"]}T${row["Waktu (WIB)"]}`;
  }
  return row["Timestamp (UTC)"] || row["Waktu (WIB)"] || new Date().toISOString();
}

const Hidroponik = () => {
  const [isLive, setIsLive] = useState(false);
  const [dummyData, setDummyData] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(0); // Untuk trigger reload
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Untuk loading pertama saja
  const { toast } = useToast();

  // Polling reload saat live (interval 5 detik)
  useEffect(() => {
    let interval;
    if (isLive) {
      setIsInitialLoad(true);
      interval = setInterval(() => {
        setReloadFlag(f => f + 1);
      }, 5000); // 5 detik
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Data dari Sheet (live mode)
  const { data: sheetData, loading } = useSpreadsheetHidroponik(
    SPREADSHEET_ID,
    SHEET_GID,
    reloadFlag
  );

  // Hilangkan loading setelah load awal selesai
  useEffect(() => {
    if (isLive && !loading) setIsInitialLoad(false);
    if (!isLive) setIsInitialLoad(false);
  }, [isLive, loading]);

  // DATA AKHIR: diambil dari sheet jika live, dummy jika tidak
  const mappedData = isLive
    ? sheetData.map(row => ({
        timestamp: parseTimestamp(row),
        suhu: parseNumber(row["Suhu"]),
        flowRate: parseNumber(row["FlowL/M"]),
        pH: parseNumber(row["pH"]),
      }))
    : dummyData;

  // Dummy generator (simulasi)
  useEffect(() => {
    if (!isLive) {
      const interval = setInterval(() => {
        setDummyData(prev => [
          ...prev,
          {
            timestamp: new Date().toISOString(),
            suhu: 5 + Math.random() * 10, // 20-30°C
            flowRate: 1 + Math.random() * 3, // 1-4 L/min
            pH: 5.5 + Math.random() * 2 // 5.5-7.5
          }
        ]);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setDummyData([]); // Kosongkan data dummy saat live
    }
  }, [isLive]);

  // Download CSV sesuai kolom hidroponik
  const handleDownload = () => {
    if (mappedData.length === 0) {
      toast({
        title: 'Gagal',
        description: 'Tidak ada data untuk diunduh',
        variant: 'destructive'
      });
      return;
    }

    const csvData = [
      ['Timestamp', 'Suhu (°C)', 'FlowL/M', 'pH'],
      ...mappedData.map((item) => [
        item.timestamp,
        item.suhu?.toFixed(1),
        item.flowRate?.toFixed(2),
        item.pH?.toFixed(2)
      ])
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hidroponik_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <header>
        <Navbar />
      </header>
      <Helmet>
        <title>Monitoring Hidroponik</title>
      </Helmet>
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-green-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-extrabold text-green-700 flex justify-center items-center gap-3">
              <span className="text-5xl">🌱</span> Monitoring Hidroponik
            </h1>
            <p className="text-gray-700 text-lg mt-2">
              Data yang ditampilkan adalah data Real-Time
            </p>
            <p className="text-green-700 text-base mt-2">
              Tanaman: <span className="font-bold">Pakcoy</span> | Fase:{' '}
              <span className="font-bold">Vegetatif</span>
            </p>
          </motion.div>

          {/* Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-between items-center bg-white shadow rounded-2xl p-4 mb-8"
          >
            <div className="flex items-center space-x-3">
              {isLive ? (
                <Wifi className="text-green-600 h-6 w-6" />
              ) : (
                <WifiOff className="text-red-600 h-6 w-6" />
              )}
              <span className="text-sm font-medium">
                {isLive ? 'Mode Live: ESP32 Terhubung' : 'Mode Simulasi: Data Dummy'}
              </span>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setIsLive(!isLive)}>
                {isLive ? 'Matikan Live' : 'Aktifkan Live'}
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" /> Unduh CSV
              </Button>
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow p-6 flex items-center space-x-4"
            >
              <Thermometer className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-gray-600 text-sm">Suhu</p>
                <p className="text-2xl font-bold text-gray-800">
                  {mappedData.length > 0
                    ? `${mappedData[mappedData.length - 1].suhu?.toFixed(1)}°C`
                    : '--'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow p-6 flex items-center space-x-4"
            >
              <Gauge className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-gray-600 text-sm">Flow Rate</p>
                <p className="text-2xl font-bold text-gray-800">
                  {mappedData.length > 0
                    ? `${mappedData[mappedData.length - 1].flowRate?.toFixed(2)} L/min`
                    : '--'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-2xl shadow p-6 flex items-center space-x-4"
            >
              <Droplets className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-gray-600 text-sm">pH</p>
                <p className="text-2xl font-bold text-gray-800">
                  {mappedData.length > 0
                    ? `${mappedData[mappedData.length - 1].pH?.toFixed(2)}`
                    : '--'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sensor Chart */}
          <SensorChart data={mappedData} isLive={isLive} loading={isInitialLoad && loading && isLive} />

          {/* Data Logger */}
          <div className="mt-10">
            <DataLogger data={mappedData} isLive={isLive} loading={isInitialLoad && loading && isLive} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hidroponik;
