import React from "react";
import { prisma } from "@/lib/prisma";
import GamesList from "@/components/admin/GamesList";
import CreateGameButton from "@/components/admin/CreateGameButton";

export default async function AdminGames() {
  const games = await prisma.game.findMany({
    include: {
      signups: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          signups: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Games Management</h1>
        <CreateGameButton />
      </div>
      <GamesList games={games} />
    </div>
  );
} 