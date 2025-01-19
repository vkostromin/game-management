import React from "react";
import { Game } from "@prisma/client";
import Link from "next/link";

interface RecentGamesProps {
  games: (Game & {
    _count: {
      signups: number;
    };
  })[];
}

export default function RecentGames({ games }: RecentGamesProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Games</h2>
      <div className="space-y-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="border-b border-gray-200 pb-4 last:border-0"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{game.location}</p>
                <p className="text-sm text-gray-500">
                  {new Date(game.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {game._count.signups}/{game.maxPlayers}
                </p>
                <p className="text-xs text-gray-500">players</p>
              </div>
            </div>
            <div className="mt-2">
              <Link
                href={`/admin/games/${game.id}`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 