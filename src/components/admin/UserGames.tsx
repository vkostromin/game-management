import React from "react";
import { Game, GameSignup } from "@prisma/client";
import Link from "next/link";

interface UserGamesProps {
  signups: (GameSignup & {
    game: Game;
  })[];
}

export default function UserGames({ signups }: UserGamesProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Games History</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {signups.map((signup) => (
          <div key={signup.id} className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <Link 
                  href={`/admin/games/${signup.game.id}`}
                  className="text-lg font-medium text-blue-600 hover:text-blue-800"
                >
                  {signup.game.location}
                </Link>
                <p className="text-sm text-gray-500">
                  {new Date(signup.game.date).toLocaleDateString()}
                </p>
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
                <span className="text-sm text-gray-500">
                  {signup.game.pricePerPerson} PLN
                </span>
              </div>
            </div>
          </div>
        ))}
        {signups.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No games found
          </div>
        )}
      </div>
    </div>
  );
} 