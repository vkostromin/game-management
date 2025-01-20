import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GameList from "@/components/GameList";
import WelcomeHeader from "@/components/WelcomeHeader";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  const games = await prisma.game.findMany({
    include: {
      signups: true,
      _count: {
        select: {
          signups: true
        }
      }
    },
    orderBy: {
      date: "desc",
    },
  });

  return (
    <main>
      <WelcomeHeader user={session?.user} />
      <GameList games={games} currentUser={session?.user} />
    </main>
  );
} 