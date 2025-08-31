
"use client";

import React from "react";

interface StatCardProps {
  title: string;
  amount: number;
  isCurrency?: boolean;
  percentageChange: number; // positive or negative value
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  isCurrency = true,
  percentageChange,
}) => {
  const isPositive = percentageChange >= 0;

  return (
    <div className="bg-white shadow rounded-2xl py-6 px-8 flex flex-col items-start p-5 rounded-3xl">
      <h3 className="text-2xl font-medium text-black">{title}</h3>
      <p className="text-xs text-gray-400 mb-6">In the last 7 days</p>
      <p className="text-4xl font-semibold">
        {isCurrency ? `₦${amount.toLocaleString()}` : amount.toLocaleString()}
      </p>
      <span
        className={`text-sm mt-1 ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? "▲" : "▼"} {Math.abs(percentageChange)}% <span className="text-sm mt-1 text-gray-400">vs last week</span>
      </span> 
    </div>
  );
};

const TotalStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-6">
      <StatCard
        title="Total Sales"
        amount={245000}
        isCurrency
        percentageChange={12.5}
      />
      <StatCard
        title="Credit Sales"
        amount={65000}
        isCurrency
        percentageChange={-4.3}
      />
      <StatCard
        title="Total Products"
        amount={320}
        isCurrency={false}
        percentageChange={8.1}
      />
    </div>
  );
};

export default TotalStats;
