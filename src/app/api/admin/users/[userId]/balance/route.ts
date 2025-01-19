import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
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

    // Create transaction and update user balance in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: params.userId,
          amount,
          type: "DEPOSIT",
          status: "COMPLETED",
        },
      });

      // Update user balance
      const user = await tx.user.update({
        where: { id: params.userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return user;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error adding money:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
