"use client";

import React, { useState } from "react";
import { Game, GameSignup, User, GameStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

interface GameDetailsProps {
  game: Game & {
    signups: (GameSignup & {
      user: Pick<User, "id" | "name" | "login" | "balance">;
    })[];
    _count: {
      signups: number;
    };
  };
}

export default function GameDetails({ game }: GameDetailsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    location: game.location,
    maxPlayers: game.maxPlayers,
    pricePerPerson: game.pricePerPerson,
    status: game.status,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/games/${game.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update game");

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this game?")) return;

    try {
      const response = await fetch(`/api/admin/games/${game.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (!response.ok) throw new Error("Failed to cancel game");

      router.refresh();
    } catch (error) {
      console.error("Error cancelling game:", error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Players
            </label>
            <input
              type="number"
              value={formData.maxPlayers}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxPlayers: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              min="1"
              max="18"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price per Person (PLN)
            </label>
            <input
              type="number"
              value={formData.pricePerPerson}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricePerPerson: parseFloat(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as GameStatus,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="OPEN">Open</option>
              <option value="FULL">Full</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">{game.location}</h2>
              <p className="text-gray-500">
                {new Date(game.date).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                game.status === "OPEN"
                  ? "bg-green-100 text-green-800"
                  : game.status === "FULL"
                  ? "bg-yellow-100 text-yellow-800"
                  : game.status === "CANCELLED"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {game.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Players</p>
              <p className="font-medium">
                {game._count.signups}/{game.maxPlayers}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price per Person</p>
              <p className="font-medium">{game.pricePerPerson} PLN</p>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            {game.status !== "CANCELLED" && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
              >
                Cancel Game
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 