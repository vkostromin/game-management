import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GameDetails from "@/components/admin/GameDetails";
import ParticipantsList from "@/components/admin/ParticipantsList";

interface Props {
  params: {
    gameId: string;
  };
}

export default async function AdminGamePage({ params }: Props) {
  const game = await prisma.game.findUnique({
    where: { id: params.gameId },
    include: {
      signups: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              login: true,
              balance: true,
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
  });

  if (!game) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Game Details</h1>
      <div className="space-y-6">
        <GameDetails game={game} />
        <ParticipantsList gameId={game.id} signups={game.signups} />
      </div>
    </div>
  );
} 