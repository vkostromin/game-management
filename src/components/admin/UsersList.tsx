"use client";

import React from "react";
import { User } from "@prisma/client";
import { useState } from "react";
import Link from "next/link";

interface UsersListProps {
  users: (User & {
    _count: {
      gameSignups: number;
    };
  })[];
}

export default function UsersList({ users }: UsersListProps) {
  const [amounts, setAmounts] = useState<{ [key: string]: string }>({});

  const handleAddMoney = async (userId: string) => {
    const amount = parseFloat(amounts[userId]);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/balance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error("Failed to add money");
      }

      setAmounts(prev => ({ ...prev, [userId]: "" }));
      window.location.reload();
    } catch (error) {
      alert("Failed to add money");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              login
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Balance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Games Played
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Add Money
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link 
                  href={`/admin/users/${user.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {user.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{user.login}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.balance.toFixed(2)} PLN
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user._count.gameSignups}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isAdmin
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.isAdmin ? "Admin" : "User"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={amounts[user.id] || ""}
                    onChange={(e) => setAmounts(prev => ({ ...prev, [user.id]: e.target.value }))}
                    className="w-24 rounded-md border-gray-300 shadow-sm"
                    placeholder="Amount"
                  />
                  <button
                    onClick={() => handleAddMoney(user.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    Add
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 