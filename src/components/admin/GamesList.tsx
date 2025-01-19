"use client";

import React from "react";
import { Game, GameSignup, User } from "@prisma/client";
import Link from "next/link";

interface GamesListProps {
  games: (Game & {
    signups: (GameSignup & {
      user: Pick<User, "id" | "name" | "login">;
    })[];
    _count: {
      signups: number;
    };
  })[];
}

export default function GamesList({ games }: GamesListProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Players
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
          {games.map((game) => (
            <tr key={game.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(game.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{game.location}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {game._count.signups}/{game.maxPlayers}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link
                  href={`/admin/games/${game.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 