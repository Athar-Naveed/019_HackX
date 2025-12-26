"use client";

import { getStats } from "@/handlers/stats/statsHandler";
import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import dayjs from "dayjs";

interface InventoryType {
  createdAt: string;
  updatedAt: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productUnit: string;
  priceUnit: string;
  organizationId: string;
}

interface OrderType {
  createdAt: string;
  updatedAt: string;
  // other order fields
}

interface TransactionType {
  txnAmount: number;
  expenseType: "Earning" | "Spending";
  createdAt: string;
}

interface StatsType {
  inventories: InventoryType[];
  orders: OrderType[];
  pockets: any[];
  transactions: TransactionType[];
}

const Metrics = () => {
  const [stats, setStats] = useState<StatsType>({
    inventories: [],
    orders: [],
    pockets: [],
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "month" | "quarter" | "year"
  >("year");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const resp = await getStats();

        const safeData: StatsType = {
          inventories: Array.isArray(resp?.data?.inventories)
            ? resp.data.inventories
            : [],
          orders: Array.isArray(resp?.data?.orders) ? resp.data.orders : [],
          pockets: Array.isArray(resp?.data?.pockets) ? resp.data.pockets : [],
          transactions: Array.isArray(resp?.data?.transactions)
            ? resp.data.transactions
            : [],
        };

        setStats(safeData);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({
          inventories: [],
          orders: [],
          pockets: [],
          transactions: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Aggregate inventories and orders by day
  const aggregateByDay = (data: { createdAt: string }[]) => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const day = dayjs(item.createdAt).format("YYYY-MM-DD");
      counts[day] = (counts[day] || 0) + 1;
    });
    return Object.keys(counts).map((day) => ({
      day,
      count: counts[day],
    }));
  };

  const inventoryData = aggregateByDay(stats.inventories ?? []);
  const orderData = aggregateByDay(stats.orders ?? []);

  const allDays = Array.from(
    new Set([
      ...inventoryData.map((d) => d.day),
      ...orderData.map((d) => d.day),
    ])
  ).sort();

  const chartData = allDays.map((day) => ({
    day,
    inventories: inventoryData.find((d) => d.day === day)?.count || 0,
    orders: orderData.find((d) => d.day === day)?.count || 0,
  }));

  // Aggregate transactions
  const earnings = (stats.transactions ?? []).filter(
    (t) => t.expenseType === "Earning"
  );

  const spendings = (stats.transactions ?? []).filter(
    (t) => t.expenseType === "Spending"
  );

  const aggregateByPeriod = (
    transactions: TransactionType[],
    period: "month" | "quarter" | "year"
  ) => {
    const grouped: Record<string, { earnings: number; spendings: number }> = {};
    transactions.forEach((txn) => {
      let key = "";
      const date = dayjs(txn.createdAt);
      if (period === "month") key = date.format("YYYY-MM");
      if (period === "quarter")
        key = `${date.year()}-Q${Math.floor(date.month() / 3) + 1}`;
      if (period === "year") key = date.format("YYYY");
      if (!grouped[key]) grouped[key] = { earnings: 0, spendings: 0 };
      if (txn.expenseType === "Earning") {
        grouped[key].earnings += txn.txnAmount;
      } else {
        grouped[key].spendings += txn.txnAmount;
      }
    });
    return Object.keys(grouped)
      .sort()
      .map((key) => ({
        period: key,
        earnings: grouped[key].earnings,
        spendings: grouped[key].spendings,
      }));
  };

  const financeChartData = useMemo(() => {
    return aggregateByPeriod([...earnings, ...spendings], selectedPeriod);
  }, [stats.transactions, selectedPeriod]);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Dashboard Metrics
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-gray-500 dark:text-gray-300">
            Total Inventories
          </h3>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.inventories.length}
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-gray-500 dark:text-gray-300">Total Orders</h3>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.orders.length}
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-gray-500 dark:text-gray-300">Total Pockets</h3>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.pockets.length}
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-gray-500 dark:text-gray-300">
            Total Transactions (Amount)
          </h3>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            PKR{" "}
            {stats.transactions
              .reduce((sum, txn) => sum + txn.txnAmount, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>

      {/* Day-wise Bar Chart */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
          Inventories & Orders (Day-wise)
        </h3>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Bar dataKey="inventories" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Earnings & Spendings */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-700 dark:text-gray-300 font-medium">
            Earnings vs Spendings
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod("month")}
              className={`px-3 py-1 rounded ${
                selectedPeriod === "month"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPeriod("quarter")}
              className={`px-3 py-1 rounded ${
                selectedPeriod === "quarter"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setSelectedPeriod("year")}
              className={`px-3 py-1 rounded ${
                selectedPeriod === "year"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={financeChartData}>
              <XAxis dataKey="period" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                formatter={(value: number | undefined) =>
                  value ? `PKR ${value.toLocaleString()}` : "PKR 0"
                }
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#22C55E"
                strokeWidth={2}
                name="Earnings"
              />
              <Line
                type="monotone"
                dataKey="spendings"
                stroke="#EF4444"
                strokeWidth={2}
                name="Spendings"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Metrics;
