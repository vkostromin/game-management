"use client";

import React from "react";
import { GameSignup, User } from "@prisma/client";

interface ParticipantsListProps {
  gameId: string;
  signups: (GameSignup & {
    user: Pick<User, "id" | "name" | "login" | "balance">;
  })[];
}

export default function ParticipantsList({
  gameId,
  signups,
}: ParticipantsListProps) {
  const handleRemoveParticipant = async (signupId: string) => {
    if (!confirm("Are you sure you want to remove this participant?")) return;

    try {
      const response = await fetch(`/api/admin/games/${gameId}/signups/${signupId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove participant");

      window.location.reload();
    } catch (error) {
      console.error("Error removing participant:", error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Participants</h2>
      <div className="space-y-4">
        {signups.map((signup) => (
          <div
            key={signup.id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{signup.user.name}</p>
              <p className="text-sm text-gray-500">{signup.user.login}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  signup.status === "CONFIRMED"
                    ? "bg-green-100 text-green-800"
                    : signup.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {signup.status}
              </span>
              <button
                onClick={() => handleRemoveParticipant(signup.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 