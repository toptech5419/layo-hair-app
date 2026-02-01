"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency, formatCompactNumber } from "@/data/analytics";

interface ChartProps {
  data: any[];
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl">
        <p className="text-white/60 text-sm mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-white font-semibold">
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Revenue Area Chart
export function RevenueChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="date" stroke="#666" fontSize={12} />
        <YAxis
          stroke="#666"
          fontSize={12}
          tickFormatter={(value) => formatCompactNumber(value)}
        />
        <Tooltip
          content={<CustomTooltip formatter={formatCurrency} />}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#FFD700"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          name="Revenue"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Bookings Bar Chart
export function BookingsChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="date" stroke="#666" fontSize={12} />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip
          content={<CustomTooltip />}
        />
        <Bar
          dataKey="bookings"
          fill="#FFD700"
          radius={[4, 4, 0, 0]}
          name="Bookings"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Popular Styles Pie Chart
export function PopularStylesChart({ data }: ChartProps) {
  const COLORS = ["#FFD700", "#FFC107", "#FF9800", "#FF5722", "#E91E63", "#9C27B0"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="bookings"
          nameKey="name"
          label={({ percent }: { percent?: number }) => `${((percent || 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl">
                  <p className="text-white font-semibold">{data.name}</p>
                  <p className="text-white/60 text-sm">{data.bookings} bookings</p>
                  <p className="text-[#FFD700] text-sm">{formatCurrency(data.revenue)}</p>
                </div>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Popular Styles Bar Chart (horizontal)
export function PopularStylesBarChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 10, left: 80, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
        <XAxis type="number" stroke="#666" fontSize={12} />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#666"
          fontSize={12}
          width={75}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl">
                  <p className="text-white font-semibold">{data.name}</p>
                  <p className="text-white/60 text-sm">{data.bookings} bookings</p>
                  <p className="text-[#FFD700] text-sm">{formatCurrency(data.revenue)}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="bookings" fill="#FFD700" radius={[0, 4, 4, 0]} name="Bookings" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Customer Growth Chart
export function CustomerGrowthChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="month" stroke="#666" fontSize={12} />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: "10px" }}
          formatter={(value) => <span className="text-white/70 text-sm">{value}</span>}
        />
        <Bar
          dataKey="newCustomers"
          fill="#FFD700"
          radius={[4, 4, 0, 0]}
          name="New Customers"
        />
        <Bar
          dataKey="returningCustomers"
          fill="#22c55e"
          radius={[4, 4, 0, 0]}
          name="Returning"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Monthly Revenue Trend
export function MonthlyRevenueChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="month" stroke="#666" fontSize={12} />
        <YAxis
          stroke="#666"
          fontSize={12}
          tickFormatter={(value) => formatCompactNumber(value)}
        />
        <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#monthlyGradient)"
          name="Revenue"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Booking Status Pie Chart
export function BookingStatusChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={2}
          dataKey="count"
          nameKey="status"
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl">
                  <p className="text-white font-semibold">{data.status}</p>
                  <p className="text-white/60 text-sm">{data.count} bookings</p>
                </div>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
