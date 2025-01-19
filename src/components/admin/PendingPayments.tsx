import React from "react";
import { Transaction, User } from "@prisma/client";

interface PendingPaymentsProps {
  payments: (Transaction & {
    user: User;
  })[];
}

export default function PendingPayments({ payments }: PendingPaymentsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Pending Payments</h2>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="border-b border-gray-200 pb-4 last:border-0"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{payment.user.name}</p>
                <p className="text-sm text-gray-500">
                  {payment.type === "GAME_PAYMENT" ? "Game Payment" : payment.type}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{payment.amount} PLN</p>
                <p className="text-xs text-gray-500">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 