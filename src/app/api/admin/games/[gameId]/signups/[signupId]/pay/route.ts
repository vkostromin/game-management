import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { gameId: string; signupId: string } }
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

    const signup = await prisma.gameSignup.findUnique({
      where: { id: params.signupId },
      include: { user: true },
    });

    if (!signup) {
      return NextResponse.json({ error: "Signup not found" }, { status: 404 });
    }

    if (signup.user.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Process payment in a transaction
    const result = await prisma.$transaction(async (tx) => {
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
      const updatedSignup = await tx.gameSignup.update({
        where: { id: params.signupId },
        data: {
          status: "CONFIRMED",
        },
        include: {
          user: true,
        },
      });

      return updatedSignup;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
