"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", totalSales: 4000, creditSales: 2400 },
  { day: "Tue", totalSales: 3000, creditSales: 1398 },
  { day: "Wed", totalSales: 2000, creditSales: 9800 },
  { day: "Thu", totalSales: 2780, creditSales: 3908 },
  { day: "Fri", totalSales: 1890, creditSales: 4800 },
  { day: "Sat", totalSales: 2390, creditSales: 3800 },
  { day: "Sun", totalSales: 3490, creditSales: 4300 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white shadow rounded-2xl p-4 w-full">
      <h2 className="text-lg font-semibold mb-3">Total Revenue</h2>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="greenLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34D399" /> {/* Tailwind green-400 */}
              <stop offset="100%" stopColor="#059669" /> {/* Tailwind green-600 */}
            </linearGradient>
            <linearGradient id="orangeLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FDBA74" /> {/* Tailwind orange-300 */}
              <stop offset="100%" stopColor="#F97316" /> {/* Tailwind orange-500 */}
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="totalSales"
            stroke="url(#greenLine)"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="creditSales"
            stroke="url(#orangeLine)"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
