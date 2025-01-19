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

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const signups = await prisma.gameSignup.findMany({
      where: {
        gameId: params.gameId,
        status: "PENDING",
      },
      include: { user: true },
    });

    // Check all users have sufficient balance
    const insufficientBalanceUsers = signups.filter(
      (signup) => signup.user.balance < amount
    );

    if (insufficientBalanceUsers.length > 0) {
      return NextResponse.json({
        error: `Insufficient balance for users: ${insufficientBalanceUsers
          .map((signup) => signup.user.name)
          .join(", ")}`,
        status: 400,
      });
    }

    // Process payments in a transaction
    const result = await prisma.$transaction(async (tx) => {
      for (const signup of signups) {
        // Create transaction record
        await tx.transaction.create({
          data: {
            userId: signup.userId,
            amount: -amount,
            type: "GAME_PAYMENT",
            status: "COMPLETED",
          },
        });

        // Update user balance
        await tx.user.update({
          where: { id: signup.userId },
          data: {
            balance: {
              decrement: amount,
            },
          },
        });

        // Update signup status
        await tx.gameSignup.update({
          where: { id: signup.id },
          data: {
            status: "CONFIRMED",
          },
        });
      }

      return signups;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing bulk payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
