import React from "react";
import { prisma } from "@/lib/prisma";
import UsersList from "@/components/admin/UsersList";
import AddUserButton from "@/components/admin/AddUserButton";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          gameSignups: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <AddUserButton />
      </div>
      <UsersList users={users} />
    </div>
  );
} 