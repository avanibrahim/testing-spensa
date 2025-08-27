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

// Parse timestamp multi-format → return epoch ms atau null
function parseTsToMs(ts) {
  if (!ts && ts !== 0) return null;
  if (typeof ts === "number") {
    // detik vs milidetik
    return ts < 1e11 ? ts * 1000 : ts;
  }
  if (ts instanceof Date && !isNaN(ts.getTime())) return ts.getTime();

  if (typeof ts === "string") {
    const s = ts.trim();

    // Pola Google Apps Script / Sheets: Date(y,m,d,h,mi,s)  (m = 0-based)
    const mDate = s.match(/Date\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+))?\s*\)/i);
    if (mDate) {
      const [, y, mo, d, hh = "0", mi = "0", ss = "0"] = mDate;
      const dt = new Date(+y, +mo, +d, +hh, +mi, +ss, 0); // lokal, bulan sudah 0-based
      return isNaN(dt) ? null : dt.getTime();
    }

    // Bentuk "dd/mm/yyyy hh:mm:ss" atau "dd/mm/yyyy hh.mm.ss" (juga boleh tanpa waktu)
    // dan boleh ada koma setelah tanggal: "dd/mm/yyyy, hh.mm.ss"
    const mDMY = s.match(
      /^\s*(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[ ,T]+(\d{1,2})[:\.](\d{1,2})(?:[:\.](\d{1,2}))?)?\s*$/
    );
    if (mDMY) {
      const [, dd, mm, yyyy, hh = "0", mi = "0", ss = "0"] = mDMY;
      const dt = new Date(+yyyy, +mm - 1, +dd, +hh, +mi, +ss, 0); // lokal
      return isNaN(dt) ? null : dt.getTime();
    }

    // Coba native: ISO/varian lain
    const nd = new Date(s);
    if (!isNaN(nd.getTime())) return nd.getTime();
  }

  return null;
}

const toTime = (ts) => {
  const ms = parseTsToMs(ts);
  if (ms == null) return String(ts ?? "--");
  const d = new Date(ms);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

function avgSafe(arr, key) {
  const vals = arr.map((x) => x?.[key]).filter(isNum);
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/** Group per interval (default 5s) lalu rata-rata setiap field numerik per bucket */
function bucketizeByInterval(data = [], intervalMs = 5000) {
  const FIELDS = ["suhu", "pH", "flowRate"];
  const buckets = new Map();

  for (const item of Array.isArray(data) ? data : []) {
    const t = parseTsToMs(item?.timestamp);
    if (!Number.isFinite(t)) continue;
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
    for (const f of ["suhu", "pH", "flowRate"]) {
      const c = b[`cnt_${f}`];
      out[f] = c ? b[`sum_${f}`] / c : null;
    }
    return out;
  });
}

/**
 * SensorChart
 * - Disampling per 5 detik (bucket 5.000 ms)
 * - Grafik tampil cepat: kalau gagal parse → fallback ke 20 data mentah
 * - Rata-rata realtime dihitung dari bucket (all / N bucket terakhir)
 */
const SensorChart = ({
  data = [],
  isLive,
  loading,
  avgWindow = "all",      // "all" atau number (N bucket terakhir)
  bucketMs = 5000,        // interval bucketing (default 5 detik)
  maxBucketsOnChart = 20, // jumlah bucket di grafik
}) => {
  // 1) Urutkan kronologis (fallback ke index jika gagal parse)
  const dataChrono = useMemo(() => {
    const arr = (Array.isArray(data) ? data : []).map((it, i) => ({ ...it, __i: i }));
    arr.sort((a, b) => {
      const ta = parseTsToMs(a?.timestamp);
      const tb = parseTsToMs(b?.timestamp);
      const va = Number.isFinite(ta) ? ta : a.__i;
      const vb = Number.isFinite(tb) ? tb : b.__i;
      return va - vb;
    });
    return arr;
  }, [data]);

  // 2) Bucket per 5 detik
  const bucketed = useMemo(() => bucketizeByInterval(dataChrono, bucketMs), [dataChrono, bucketMs]);

  // 3) Data untuk chart:
  //    - Pakai bucket (lebih akurat)
  //    - Fallback: kalau bucket kosong, pakai 20 raw terakhir biar nggak “menunggu”
  const chartData = useMemo(() => {
    if (bucketed.length > 0) {
      const sliced = bucketed.slice(-maxBucketsOnChart);
      return sliced.map((item) => ({
        time: toTime(item?.timestamp),
        suhu: isNum(item?.suhu) ? item.suhu : null,
        pH: isNum(item?.pH) ? item.pH : null,
        flow: isNum(item?.flowRate) ? item.flowRate : null,
      }));
    }
    // Fallback raw
    return dataChrono.slice(-20).map((item) => ({
      time: toTime(item?.timestamp),
      suhu: isNum(item?.suhu) ? item.suhu : null,
      pH: isNum(item?.pH) ? item.pH : null,
      flow: isNum(item?.flowRate) ? item.flowRate : null,
    }));
  }, [bucketed, dataChrono, maxBucketsOnChart]);

  // 4) Sumber rata-rata (all vs N bucket terakhir) — kalau bucket kosong, pakai raw
  const avgSource = useMemo(() => {
    const base = bucketed.length ? bucketed : dataChrono;
    if (avgWindow === "all") return base;
    const n = typeof avgWindow === "number" && avgWindow > 0 ? avgWindow : 5;
    return base.slice(-n);
  }, [bucketed, dataChrono, avgWindow]);

  // Hitung rata-rata realtime
  const meanSuhu = useMemo(() => avgSafe(avgSource, "suhu"), [avgSource]);
  const meanPh   = useMemo(() => avgSafe(avgSource, "pH"), [avgSource]);
  const meanFlow = useMemo(() => avgSafe(avgSource, "flowRate"), [avgSource]);

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

  // Signature untuk paksa rerender saat titik terbaru berubah
  const latestSig = chartData.length
    ? `${chartData[chartData.length - 1].time}|${chartData.length}`
    : "empty";

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
          <p className="text-gray-600">
            20 data terakhir • Rata-rata: {avgWindow === "all" ? "semua data" : `${avgWindow} data terakhir`} • Disampling tiap {bucketMs/1000}s
          </p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="chart-container p-6">
          <ResponsiveContainer width="100%" height={400}>
            {/* key=latestSig → remount saat data terbaru berubah */}
            <LineChart data={chartData} key={latestSig}>
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
