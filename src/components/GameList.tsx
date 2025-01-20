"use client";

import React from "react";
import { Game, GameSignup } from "@prisma/client";
import { useSession } from "next-auth/react";

interface GameListProps {
  games: (Game & {
    _count: {
      signups: number;
    };
    signups: GameSignup[];
  })[];
}

export default function GameList({ games }: GameListProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleApply = async (gameId: string) => {
    try {
      const response = await fetch(`/api/games/${gameId}/signup`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to apply");
    }
  };

  const handleCancel = async (gameId: string) => {
    if (!confirm("Are you sure you want to cancel your participation?")) return;
    
    try {
      const response = await fetch(`/api/games/${gameId}/signup`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to cancel");
    }
  };

  const isApplyDisabled = (game: Game & { _count: { signups: number }; signups: GameSignup[] }) => {
    const isFull = game._count.signups >= game.maxPlayers;
    const isPast = new Date(game.date) < new Date();
    const isCancelled = game.status === "CANCELLED";
    
    return (isFull && !hasApplied(game)) || isPast || isCancelled || !userId;
  };

  const hasApplied = (game: Game & { signups: GameSignup[] }) => {
    return game.signups.some(signup => signup.userId === userId);
  };

  const getButtonText = (game: Game & { _count: { signups: number }; signups: GameSignup[] }) => {
    if (!userId) return "Sign in to apply";
    if (hasApplied(game)) return game.status === "OPEN" ? "Cancel" : "Applied";
    if (game._count.signups >= game.maxPlayers) return "Full";
    if (game.status === "CANCELLED") return "Cancelled";
    if (new Date(game.date) < new Date()) return "Past";
    return "Apply";
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <div
          key={game.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{game.location}</h3>
                <p className="text-gray-500">
                  {new Date(game.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  game.status === "OPEN"
                    ? "bg-green-100 text-green-800"
                    : game.status === "FULL"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {game.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {game._count.signups}/{game.maxPlayers} players
              </div>
              <div className="text-sm font-medium">
                {game.pricePerPerson} PLN
              </div>
            </div>
            <button
              onClick={() => hasApplied(game) ? handleCancel(game.id) : handleApply(game.id)}
              disabled={isApplyDisabled(game)}
              className={`mt-4 w-full py-2 px-4 rounded-md ${
                isApplyDisabled(game)
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : hasApplied(game)
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {getButtonText(game)}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 