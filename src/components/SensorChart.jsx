import React from "react";
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

// RATA-RATA
function avg(arr, key) {
  if (!arr.length) return 0;
  const sum = arr.reduce((total, item) => total + (Number(item[key]) || 0), 0);
  return sum / arr.length;
}

const SensorChart = ({ data, isLive }) => {
  // MAPPING 20 DATA TERBARU & FORMAT
  const chartData = data
    .slice(-20)
    .map((item) => ({
      time: item["timestamp"]
        ? new Date(item.timestamp).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        : "--",
      suhu: Number(item.suhu) || 0,
      pH: Number(item.pH) || 0,
      flow: Number(item.flowRate) || 0,
    }));

  // Tooltip Custom
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow">
          <p className="font-medium text-gray-800 mb-2">{`Waktu: ${label}`}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === "suhu"
                ? "°C"
                : entry.dataKey === "flow"
                ? " L/min"
                : entry.dataKey === "pH"
                ? ""
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
        <div className="p-3 bg-green-500 rounded-xl">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Grafik Sensor Hidroponik
          </h2>
          <p className="text-gray-600">20 data terakhir</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="chart-container p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis
                dataKey="time"
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#16a34a"
                fontSize={12}
                label={{
                  value: "Suhu (°C) & pH",
                  angle: -90,
                  position: "insideLeft",
                }}
                allowDecimals={true}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#f59e0b"
                fontSize={12}
                label={{
                  value: "Flow (L/min)",
                  angle: 90,
                  position: "insideRight",
                }}
                allowDecimals={true}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="suhu"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="Suhu (°C)"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="pH"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="pH"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="flow"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="FlowL/M"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {isLive ? "Menunggu data dari Spreadsheet..." : "Menunggu data simulasi..."}
          </p>
          <p className="text-gray-400 text-sm">
            {isLive
              ? "Pastikan perangkat ESP32 mengirim data ke spreadsheet."
              : "Data simulasi akan muncul setiap 3 detik."}
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {chartData.length > 0 ? `${avg(chartData, "suhu").toFixed(1)}°C` : "--"}
          </div>
          <div className="text-sm text-green-700">Rata-rata Suhu</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {chartData.length > 0 ? `${avg(chartData, "pH").toFixed(2)}` : "--"}
          </div>
          <div className="text-sm text-purple-700">Rata-rata pH</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {chartData.length > 0 ? `${avg(chartData, "flow").toFixed(2)} L/min` : "--"}
          </div>
          <div className="text-sm text-orange-700">Rata-rata Flow Rate</div>
        </div>
      </div>
    </motion.div>
  );
};

export default SensorChart;
