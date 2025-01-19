import React from "react";
import { Game, GameSignup } from "@prisma/client";
import { Session } from "next-auth";
import Link from "next/link";

interface GameListProps {
  games: (Game & {
    signups: GameSignup[];
    _count: {
      signups: number;
    };
  })[];
  currentUser?: Session["user"] | null;
}

export default function GameList({ games, currentUser }: GameListProps) {
  return (
    <div className="grid gap-6 mt-6">
      {games.map((game) => (
        <Link href={`/games/${game.id}`} key={game.id}>
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{game.location}</h3>
                <p className="text-gray-500">{new Date(game.date).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {game._count.signups}/{game.maxPlayers}
                </span>
                {currentUser?.id && (
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    game.signups.some(signup => signup.userId === currentUser.id)
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {game.signups.some(signup => signup.userId === currentUser.id)
                      ? "Applied"
                      : "Not Applied"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 