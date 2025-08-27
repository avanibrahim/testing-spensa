import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";

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

/** Bucketing per interval ms (default 5 detik).
 *  - Group berdasarkan floor(timestamp/interval)*interval
 *  - Hitung rata-rata setiap field numerik per bucket
 *  - Hasil sudah urut ASC
 */
function bucketizeByInterval(data = [], intervalMs = 5000) {
  const FIELDS = ["temperature", "temperatureAir", "humidity", "soilMoisture", "ph", "flowRate"];
  const buckets = new Map();

  for (const item of Array.isArray(data) ? data : []) {
    const t = Date.parse(item?.timestamp);
    if (!Number.isFinite(t)) continue; // skip kalau timestamp invalid
    const key = Math.floor(t / intervalMs) * intervalMs;

    if (!buckets.has(key)) {
      const base = { ts: key };
      for (const f of FIELDS) {
        base[`sum_${f}`] = 0;
        base[`cnt_${f}`] = 0;
      }
      buckets.set(key, base);
    }
    const b = buckets.get(key);
    for (const f of FIELDS) {
      const v = item?.[f];
      if (isNum(v)) {
        b[`sum_${f}`] += v;
        b[`cnt_${f}`] += 1;
      }
    }
  }

  const keys = Array.from(buckets.keys()).sort((a, b) => a - b);
  return keys.map((k) => {
    const b = buckets.get(k);
    const out = { timestamp: k };
    for (const f of ["temperature", "temperatureAir", "humidity", "soilMoisture", "ph", "flowRate"]) {
      const c = b[`cnt_${f}`];
      out[f] = c ? b[`sum_${f}`] / c : null;
    }
    return out;
  });
}

/** SensorChartIrigasi
 *  - Urut data ASC
 *  - Resample per 5 detik (bucketMs)
 *  - Tampilkan 20 bucket terakhir (≈100 detik)
 *  - Ringkasan (mean) dihitung dari bucket, bukan 20 titik mentah
 */
const SensorChartIrigasi = ({
  data = [],
  isLive,
  loading,
  avgWindow = "all",      // "all" atau number (jumlah bucket terakhir)
  bucketMs = 5000,        // interval bucketing (default 5 detik)
  maxBucketsOnChart = 20, // banyaknya bucket yang ditampilkan di chart
}) => {
  // 1) Urutkan kronologis (fallback ke index kalau gagal parse)
  const dataChrono = useMemo(() => {
    const arr = (Array.isArray(data) ? data : []).map((it, i) => ({ ...it, __i: i }));
    arr.sort((a, b) => {
      const ta = Date.parse(a?.timestamp);
      const tb = Date.parse(b?.timestamp);
      const va = Number.isFinite(ta) ? ta : a.__i;
      const vb = Number.isFinite(tb) ? tb : b.__i;
      return va - vb;
    });
    return arr;
  }, [data]);

  // 2) Bucket per 5 detik
  const bucketed = useMemo(() => bucketizeByInterval(dataChrono, bucketMs), [dataChrono, bucketMs]);

  // 3) Data untuk chart = N bucket terakhir
  const chartData = useMemo(() => {
    const sliced = bucketed.slice(-maxBucketsOnChart);
    return sliced.map((item) => ({
      time: toTime(item.timestamp),
      suhuTanah:       isNum(item.temperature)     ? item.temperature     : null,
      suhuUdara:       isNum(item.temperatureAir)  ? item.temperatureAir  : null,
      kelembabanUdara: isNum(item.humidity)        ? item.humidity        : null,
      kelembapanTanah: isNum(item.soilMoisture)    ? item.soilMoisture    : null,
      ph:              isNum(item.ph)              ? item.ph              : null,
      flowRate:        isNum(item.flowRate)        ? item.flowRate        : null,
    }));
  }, [bucketed, maxBucketsOnChart]);

  // 4) Sumber rata-rata (summary) berdasarkan bucket
  const avgSource = useMemo(() => {
    if (avgWindow === "all") return bucketed;
    const n = typeof avgWindow === "number" && avgWindow > 0 ? avgWindow : maxBucketsOnChart;
    return bucketed.slice(-n);
  }, [bucketed, avgWindow, maxBucketsOnChart]);

  const meanSuhuTanah       = useMemo(() => avgSafe(avgSource, "temperature"),     [avgSource]);
  const meanSuhuUdara       = useMemo(() => avgSafe(avgSource, "temperatureAir"),  [avgSource]);
  const meanKelembabanUdara = useMemo(() => avgSafe(avgSource, "humidity"),        [avgSource]);
  const meanKelembapanTanah = useMemo(() => avgSafe(avgSource, "soilMoisture"),    [avgSource]);
  const meanPh              = useMemo(() => avgSafe(avgSource, "ph"),              [avgSource]);
  const meanFlow            = useMemo(() => avgSafe(avgSource, "flowRate"),        [avgSource]);

  // Signature terbaru untuk “paksa” rerender Recharts saat bucket terbaru berubah
  const latestSig = chartData.length
    ? `${chartData[chartData.length - 1].time}|${chartData.length}`
    : "empty";

  const windowLabel =
    avgWindow === "all" ? "semua bucket" : `${avgWindow} bucket terakhir (${(avgWindow || maxBucketsOnChart) * (bucketMs/1000)} dtk)`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-effect p-8 rounded-2xl shadow-xl">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-purple-500 rounded-xl"><TrendingUp className="h-6 w-6 text-white" /></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Grafik Sensor Irigasi Tetes</h2>
          <p className="text-gray-600">
            Disampling tiap {bucketMs / 1000} detik • Rata-rata: {windowLabel}
          </p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="chart-container p-6">
          <ResponsiveContainer width="100%" height={420}>
            {/* key=latestSig → remount saat data terbaru berubah */}
            <LineChart data={chartData} key={latestSig}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left"  orientation="left"  stroke="#6b7280" fontSize={12} label={{ value: "°C / % / pH", angle: -90, position: "insideLeft" }} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={12} label={{ value: "Flow (L/min)", angle: 90, position: "insideRight" }} />
              <Tooltip content={
                ({ active, payload, label }) => {
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
                }
              } />
              <Legend />
              <Line yAxisId="left"  type="monotone" dataKey="suhuUdara"       stroke="#ef4444" strokeWidth={2} dot={false} name="Suhu Udara (°C)" />
              <Line yAxisId="left"  type="monotone" dataKey="kelembabanUdara" stroke="#3b82f6" strokeWidth={2} dot={false} name="Kelembaban Udara (%)" />
              <Line yAxisId="left"  type="monotone" dataKey="kelembapanTanah" stroke="#22c55e" strokeWidth={2} dot={false} name="Kelembapan Tanah (%)" />
              <Line yAxisId="left"  type="monotone" dataKey="suhuTanah"       stroke="#10b981" strokeWidth={2} dot={false} name="Suhu Tanah (°C)" />
              <Line yAxisId="left"  type="monotone" dataKey="ph"              stroke="#8b5cf6" strokeWidth={2} dot={false} name="pH" />
              <Line yAxisId="right" type="monotone" dataKey="flowRate"        stroke="#f59e0b" strokeWidth={2} dot={false} name="Flow Rate (L/min)" />
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

      {/* Summary berdasarkan bucket */}
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
