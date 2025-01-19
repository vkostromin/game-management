import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GameDetails from "@/app/games/[gameId]/GameDetails";

interface GamePageProps {
  params: {
    gameId: string;
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const game = await prisma.game.findUnique({
    where: {
      id: params.gameId,
    },
    include: {
      signups: true,
      _count: {
        select: {
          signups: true
        }
      }
    }
  });

  if (!game) {
    notFound();
  }

  return <GameDetails game={game} />;
} 