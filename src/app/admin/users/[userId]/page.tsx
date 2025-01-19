import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserGames from "@/components/admin/UserGames";

interface Props {
  params: {
    userId: string;
  };
}

export default async function UserDetailsPage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      gameSignups: {
        include: {
          game: true,
        },
        orderBy: {
          game: {
            date: 'desc',
          },
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Details: {user.name}</h1>
      <UserGames signups={user.gameSignups} />
    </div>
  );
} 