import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { transactionId, status } = body;

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
      include: { user: true },
    });

    if (status === "COMPLETED" && transaction.type === "GAME_PAYMENT") {
      await prisma.user.update({
        where: { id: transaction.userId },
        data: {
          balance: {
            decrement: transaction.amount,
          },
        },
      });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
