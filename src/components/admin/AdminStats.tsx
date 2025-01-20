import React from "react";

interface AdminStatsProps {
  userCount: number;
  gameCount: number;
  totalRevenue: number;
}

export default function AdminStats({
  userCount,
  gameCount,
  totalRevenue,
}: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
        <p className="mt-2 text-3xl font-semibold">{userCount}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Games</h3>
        <p className="mt-2 text-3xl font-semibold">{gameCount}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Balance</h3>
        <p className="mt-2 text-3xl font-semibold">
          {totalRevenue.toFixed(2)} PLN
        </p>
      </div>
    </div>
  );
} 