import { prisma } from "@/lib/prisma";
import AdminStats from "@/components/admin/AdminStats";
import RecentGames from "@/components/admin/RecentGames";
import PendingPayments from "@/components/admin/PendingPayments";

export default async function AdminDashboard() {
  const stats = await prisma.$transaction([
    prisma.user.count(),
    prisma.game.count(),
    prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: "GAME_PAYMENT",
        status: "COMPLETED",
      },
    }),
  ]);

  const recentGames = await prisma.game.findMany({
    take: 5,
    orderBy: {
      date: "desc",
    },
    include: {
      _count: {
        select: {
          signups: true,
        },
      },
    },
  });

  const pendingPayments = await prisma.transaction.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      user: true,
    },
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <AdminStats
        userCount={stats[0]}
        gameCount={stats[1]}
        totalRevenue={stats[2]._sum.amount || 0}
      />
      <div className="grid grid-cols-1">
        <RecentGames games={recentGames} />
      </div>
        <PendingPayments payments={pendingPayments} />
    </div>
  );
} 