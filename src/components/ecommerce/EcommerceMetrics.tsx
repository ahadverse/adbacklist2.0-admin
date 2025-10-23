"use client";
import React from "react";
import { FaBlog, FaListAlt, FaMoneyBill } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";


export interface DashboardStats {
  allUsers: number;
  allPost: number;
  premiumPost: number;
  allBlogs: number;
  allCredits: number;
  allTodayTrans: number;
  todayTransAmount: number;
  totalTransctions: number;
}

interface EcommerceMetricsProps {
  stats: DashboardStats;
}

export const EcommerceMetrics = ({ stats }: EcommerceMetricsProps) => {
  if (!stats) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No stats available
      </div>
    );
  }

  const metrics = [
    {
      label: "Total Users",
      value: stats.allUsers,
      icon: <FaBlog className="text-blue-600 size-6" />,
    },
    {
      label: "All Posts",
      value: stats.allPost,
      icon: <FaListAlt className="text-amber-600 size-6" />,
    },
    {
      label: "Premium Posts",
      value: stats.premiumPost,
      icon: <FaBlog className="text-violet-600 size-6" />,
    },
    {
      label: "All Blogs",
      value: stats.allBlogs,
      icon: <FaBlog className="text-emerald-600 size-6" />,
    },
    {
      label: "Total Credits",
      value: stats.allCredits,
      icon: <FaMoneyBill className="text-green-700 size-6" />,
    },
    {
      label: "Today’s Transactions",
      value: stats.allTodayTrans,
      icon: <BsCurrencyDollar className="text-orange-600 size-6" />,
    },
    {
      label: "Today’s Transaction Amount",
      value: stats.todayTransAmount,
      icon: <BsCurrencyDollar className="text-rose-600 size-6" />,
    },
    {
      label: "Total Transaction Amount",
      value: stats.totalTransctions,
      icon: <BsCurrencyDollar className="text-indigo-700 size-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
      {metrics.map((item, idx) => (
        <MetricCard key={idx} {...item} />
      ))}
    </div>
  );
};

const MetricCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
      {icon}
    </div>

    <div className="mt-4">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <h4 className="mt-2 font-bold text-gray-800 text-xl dark:text-white/90">
        {value?.toLocaleString?.() ?? value}
      </h4>
    </div>
  </div>
);
