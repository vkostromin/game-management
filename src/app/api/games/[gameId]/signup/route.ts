import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const game = await prisma.game.findUnique({
      where: { id: params.gameId },
      include: { signups: true },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.balance < game.pricePerPerson) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    if (game.status !== "OPEN") {
      return NextResponse.json({ error: "Game is not open" }, { status: 400 });
    }

    const existingSignup = await prisma.gameSignup.findFirst({
      where: {
        gameId: params.gameId,
        userId: session.user.id,
      },
    });

    if (existingSignup) {
      return NextResponse.json({ error: "Already signed up" }, { status: 400 });
    }

    const signup = await prisma.gameSignup.create({
      data: {
        gameId: params.gameId,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(signup);
  } catch (error) {
    console.error("Error in signup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const game = await prisma.game.findUnique({
      where: { id: params.gameId },
      include: {
        signups: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    if (game.status !== "OPEN") {
      return NextResponse.json(
        { error: "Cannot cancel signup for this game" },
        { status: 400 }
      );
    }

    if (game.signups.length === 0) {
      return NextResponse.json(
        { error: "You are not signed up for this game" },
        { status: 400 }
      );
    }

    await prisma.gameSignup.delete({
      where: {
        id: game.signups[0].id,
      },
    });

    // Update game status if it was full
    if (game.status === "FULL") {
      await prisma.game.update({
        where: { id: params.gameId },
        data: { status: "OPEN" },
      });
    }

    return NextResponse.json({ message: "Signup cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling signup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
