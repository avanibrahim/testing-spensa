import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";

// ===== Helpers =====
const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const fmt = (n, d = 2) => (isNum(n) ? Number(n).toFixed(d) : "--");
const toTime = (ts) => {
  if (!ts) return "--";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return String(ts);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

function avgSafe(arr, key) {
  const vals = arr.map((x) => x?.[key]).filter(isNum);
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/**
 * SensorChartIrigasi
 * - Grafik menampilkan 20 data terakhir.
 * - Rata-rata realtime dihitung dari seluruh `data` atau window terakhir (prop `avgWindow`).
 *   - `avgWindow = 'all'` (default) → rata-rata dari semua data yang diterima komponen.
 *   - `avgWindow = number` → rata-rata dari N titik terakhir.
 */
const SensorChartIrigasi = ({ data = [], isLive, loading, avgWindow = 'all' }) => {
  // 20 data terakhir untuk grafik
  const chartData = useMemo(() => {
    return data.slice(-20).map((item) => ({
      time: toTime(item?.timestamp),
      suhuTanah: isNum(item?.temperature) ? item.temperature : null,
      suhuUdara: isNum(item?.temperatureAir) ? item.temperatureAir : null,
      kelembabanUdara: isNum(item?.humidity) ? item.humidity : null,
      kelembapanTanah: isNum(item?.soilMoisture) ? item.soilMoisture : null,
      ph: isNum(item?.ph) ? item.ph : null,
      flowRate: isNum(item?.flowRate) ? item.flowRate : null,
    }));
  }, [data]);

  // Sumber data untuk rata-rata (all vs window N terakhir)
  const avgSource = useMemo(() => {
    if (avgWindow === 'all') return data;
    const n = typeof avgWindow === 'number' && avgWindow > 0 ? avgWindow : 20;
    return data.slice(-n);
  }, [data, avgWindow]);

  // Hitung rata-rata realtime dari sumber yang dipilih
  const meanSuhuTanah     = useMemo(() => avgSafe(avgSource, 'temperature'), [avgSource]);
  const meanSuhuUdara     = useMemo(() => avgSafe(avgSource, 'temperatureAir'), [avgSource]);
  const meanKelembabanUdara = useMemo(() => avgSafe(avgSource, 'humidity'), [avgSource]);
  const meanKelembapanTanah = useMemo(() => avgSafe(avgSource, 'soilMoisture'), [avgSource]);
  const meanPh            = useMemo(() => avgSafe(avgSource, 'ph'), [avgSource]);
  const meanFlow          = useMemo(() => avgSafe(avgSource, 'flowRate'), [avgSource]);

  // Tooltip Custom
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow">
          <p className="font-medium text-gray-800 mb-2">{`Waktu: ${label}`}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {isNum(entry.value) ? entry.value : "--"}
              {entry.dataKey === "suhuTanah" || entry.dataKey === "suhuUdara"
                ? "°C"
                : entry.dataKey === "kelembapanTanah" || entry.dataKey === "kelembabanUdara"
                ? "%"
                : entry.dataKey === "flowRate"
                ? " L/min"
                : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-effect p-8 rounded-2xl shadow-xl"
    >
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-purple-500 rounded-xl">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Grafik Sensor Irigasi Tetes</h2>
          <p className="text-gray-600">20 data terakhir • Rata-rata: {avgWindow === 'all' ? 'semua data' : `${avgWindow} data terakhir`}</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="chart-container p-6">
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" orientation="left" stroke="#6b7280" fontSize={12} label={{ value: "°C / % / pH", angle: -90, position: "insideLeft" }} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={12} label={{ value: "Flow (L/min)", angle: 90, position: "insideRight" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="suhuUdara" stroke="#ef4444" strokeWidth={2} dot={false} name="Suhu Udara (°C)" />
              <Line yAxisId="left" type="monotone" dataKey="kelembabanUdara" stroke="#3b82f6" strokeWidth={2} dot={false} name="Kelembaban Udara (%)" />
              <Line yAxisId="left" type="monotone" dataKey="kelembapanTanah" stroke="#22c55e" strokeWidth={2} dot={false} name="Kelembapan Tanah (%)" />
              <Line yAxisId="left" type="monotone" dataKey="suhuTanah" stroke="#10b981" strokeWidth={2} dot={false} name="Suhu Tanah (°C)" />
              <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#8b5cf6" strokeWidth={2} dot={false} name="pH" />
              <Line yAxisId="right" type="monotone" dataKey="flowRate" stroke="#f59e0b" strokeWidth={2} dot={false} name="Flow Rate (L/min)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{isLive ? "Menunggu data dari Spreadsheet..." : "Menunggu data simulasi..."}</p>
          <p className="text-gray-400 text-sm">{isLive ? "Pastikan perangkat ESP32 mengirim data ke spreadsheet." : "Data simulasi akan muncul setiap 4 detik."}</p>
        </div>
      )}

      {/* Summary (Realtime Average) */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{fmt(meanSuhuTanah, 1)}°C</div>
          <div className="text-sm text-red-700">Suhu Tanah</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{fmt(meanSuhuUdara, 1)}°C</div>
          <div className="text-sm text-yellow-700">Suhu Udara</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{fmt(meanKelembabanUdara, 1)}%</div>
          <div className="text-sm text-blue-700">Kelembaban Udara</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{fmt(meanKelembapanTanah, 1)}%</div>
          <div className="text-sm text-green-700">Kelembapan Tanah</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{fmt(meanPh, 2)}</div>
          <div className="text-sm text-purple-700">pH Tanah</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{fmt(meanFlow, 2)} L/min</div>
          <div className="text-sm text-orange-700">Flow Rate</div>
        </div>
      </div>
    </motion.div>
  );
};

export default SensorChartIrigasi;
