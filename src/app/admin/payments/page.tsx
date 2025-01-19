import { prisma } from "@/lib/prisma";
import PaymentsList from "@/components/admin/PaymentsList";

export default async function AdminPayments() {
  const payments = await prisma.transaction.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payments Management</h1>
      <PaymentsList payments={payments} />
    </div>
  );
} 