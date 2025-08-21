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
 * SensorChart
 * - Menampilkan grafik 20 data terakhir
 * - Rata-rata realtime dihitung dari seluruh data, atau window terakhir sesuai prop `avgWindow`
 *   - `avgWindow = 'all'` (default) → rata-rata dari **SELURUH** `data`
 *   - `avgWindow = number` → rata-rata dari N titik terakhir
 */
const SensorChart = ({ data = [], isLive, loading, avgWindow = 'all' }) => {
  // 20 data terakhir untuk grafik
  const chartData = useMemo(() => {
    return data.slice(-20).map((item) => ({
      time: toTime(item?.timestamp),
      suhu: isNum(item?.suhu) ? item.suhu : null,
      pH: isNum(item?.pH) ? item.pH : null,
      flow: isNum(item?.flowRate) ? item.flowRate : null,
    }));
  }, [data]);

  // Sumber data untuk rata-rata (all vs window)
  const avgSource = useMemo(() => {
    if (avgWindow === 'all') return data;
    const n = typeof avgWindow === 'number' && avgWindow > 0 ? avgWindow : 20;
    return data.slice(-n);
  }, [data, avgWindow]);

  // Hitung rata-rata realtime dari sumber yang dipilih
  const meanSuhu = useMemo(() => avgSafe(avgSource, 'suhu'), [avgSource]);
  const meanPh   = useMemo(() => avgSafe(avgSource, 'pH'), [avgSource]);
  const meanFlow = useMemo(() => avgSafe(avgSource, 'flowRate'), [avgSource]);

  // Tooltip Custom
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow">
          <p className="font-medium text-gray-800 mb-2">{`Waktu: ${label}`}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {isNum(entry.value) ? entry.value : "--"}
              {entry.dataKey === "suhu" ? "°C" : entry.dataKey === "flow" ? " L/min" : ""}
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
        <div className="p-3 bg-green-500 rounded-xl">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Grafik Sensor Hidroponik</h2>
          <p className="text-gray-600">20 data terakhir • Rata-rata: {avgWindow === 'all' ? 'semua data' : `${avgWindow} data terakhir`}</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="chart-container p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" orientation="left" stroke="#16a34a" fontSize={12} label={{ value: "Suhu (°C) & pH", angle: -90, position: "insideLeft" }} allowDecimals />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={12} label={{ value: "Flow (L/min)", angle: 90, position: "insideRight" }} allowDecimals />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="suhu" stroke="#22c55e" strokeWidth={2} dot={false} name="Suhu (°C)" />
              <Line yAxisId="left" type="monotone" dataKey="pH" stroke="#8b5cf6" strokeWidth={2} dot={false} name="pH" />
              <Line yAxisId="right" type="monotone" dataKey="flow" stroke="#f59e0b" strokeWidth={2} dot={false} name="FlowL/M" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{isLive ? "Menunggu data dari Spreadsheet..." : "Menunggu data simulasi..."}</p>
          <p className="text-gray-400 text-sm">{isLive ? "Pastikan perangkat ESP32 mengirim data ke spreadsheet." : "Data simulasi akan muncul setiap 3 detik."}</p>
        </div>
      )}

      {/* Summary (Realtime Average) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{fmt(meanSuhu, 1)}°C</div>
          <div className="text-sm text-green-700">Rata-rata Suhu</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{fmt(meanPh, 2)}</div>
          <div className="text-sm text-purple-700">Rata-rata pH</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{fmt(meanFlow, 2)} L/min</div>
          <div className="text-sm text-orange-700">Rata-rata Flow Rate</div>
        </div>
      </div>
    </motion.div>
  );
};

export default SensorChart;
