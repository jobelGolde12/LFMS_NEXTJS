"use client";

import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ReportTrendPoint } from "@/lib/services/dashboard";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface AdminAnalyticsChartProps {
  trend: ReportTrendPoint[];
}

export function AdminAnalyticsChart({ trend }: AdminAnalyticsChartProps) {
  const [range, setRange] = useState<7 | 30 | 90>(30);

  const filtered = useMemo(() => trend.slice(-range), [trend, range]);

  const data = useMemo(
    () => ({
      labels: filtered.map((point) =>
        new Date(point.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
      ),
      datasets: [
        {
          label: "Lost Reports",
          data: filtered.map((point) => point.lost),
          borderColor: "rgb(244, 63, 94)",
          backgroundColor: "rgba(244, 63, 94, 0.16)",
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 2,
        },
        {
          label: "Found Reports",
          data: filtered.map((point) => point.found),
          borderColor: "rgb(16, 185, 129)",
          backgroundColor: "rgba(16, 185, 129, 0.16)",
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 2,
        },
      ],
    }),
    [filtered]
  );

  return (
    <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Reports Analytics</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Lost vs Found trends over time</p>
        </div>
        <div className="inline-flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          {[7, 30, 90].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRange(value as 7 | 30 | 90)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                range === value
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {value}d
            </button>
          ))}
        </div>
      </div>

      <div className="h-[320px] w-full">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
              legend: {
                position: "top",
                labels: { usePointStyle: true, boxWidth: 8 },
              },
            },
            scales: {
              x: {
                grid: { color: "rgba(113,113,122,0.15)" },
                ticks: { color: "rgb(113,113,122)" },
              },
              y: {
                beginAtZero: true,
                ticks: { precision: 0, color: "rgb(113,113,122)" },
                grid: { color: "rgba(113,113,122,0.15)" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
