"use client";

import React from "react";
import { Transaction, User } from "@prisma/client";
import { useState } from "react";

interface PaymentsListProps {
  payments: (Transaction & {
    user: User;
  })[];
}

export default function PaymentsList({ payments: initialPayments }: PaymentsListProps) {
  const [payments, setPayments] = useState(initialPayments);

  const handleUpdateStatus = async (transactionId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId, status }),
      });

      if (!response.ok) throw new Error("Failed to update payment");

      const updatedPayment = await response.json();
      setPayments(payments.map(p => 
        p.id === updatedPayment.id ? updatedPayment : p
      ));
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {payment.user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {payment.amount} PLN
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {payment.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  payment.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : payment.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {payment.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {payment.status === "PENDING" && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(payment.id, "COMPLETED")}
                      className="text-green-600 hover:text-green-900"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(payment.id, "FAILED")}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 