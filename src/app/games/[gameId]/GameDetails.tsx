"use client";

import { Game, GameSignup } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface GameDetailsProps {
  game: Game & {
    signups: GameSignup[];
    _count: {
      signups: number;
    };
  };
}

export default function GameDetails({ game }: GameDetailsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [userBalance, setUserBalance] = useState<number | null>(null);

  const isApplied = session?.user?.id && game.signups.some(
    signup => signup.userId === session.user.id
  );

  const hasInsufficientBalance = userBalance !== null && userBalance < game.pricePerPerson;

  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/user')
        .then(res => res.json())
        .then(data => {
          if (data.balance !== undefined) {
            setUserBalance(data.balance);
          }
        })
        .catch(error => {
          console.error('Error fetching user balance:', error);
        });
    }
  }, [session?.user?.id]);

  const handleApply = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    try {
      const response = await fetch(`/api/games/${game.id}/signup`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Failed to sign up for the game");
    }
  };

  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{game.location}</h1>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <span className="text-gray-600 w-32">Date: </span>
            <span>{new Date(game.date).toLocaleString()}</span>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-600 w-32">Price: </span>
            <span>{game.pricePerPerson}PLN</span>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-600 w-32">Participants: </span>
            <span>{game._count.signups} / {game.maxPlayers}</span>
          </div>
        </div>

        {session && !isApplied && hasInsufficientBalance && (
          <p className="text-red-600 text-sm mb-2">
            Insufficient balance. You need {game.pricePerPerson}PLN to join this game.
          </p>
        )}

        <button 
          onClick={handleApply}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400"
          disabled={game.status === "FULL" || isApplied || (!!session && hasInsufficientBalance)}
        >
          {game.status === "FULL"
            ? "Game is Full"
            : isApplied
            ? "Already Applied"
            : session && hasInsufficientBalance
            ? "Insufficient Balance"
            : session
            ? "Apply to Join"
            : "Sign in to Join"}
        </button>
      </div>
    </div>
  );
} 