import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { location, maxPlayers, pricePerPerson, status } = body;

    const game = await prisma.game.update({
      where: { id: params.gameId },
      data: {
        location,
        maxPlayers,
        pricePerPerson,
        status,
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
