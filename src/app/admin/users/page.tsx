import React from "react";
import { prisma } from "@/lib/prisma";
import UsersList from "@/components/admin/UsersList";

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          gameSignups: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <UsersList users={users} />
    </div>
  );
} 