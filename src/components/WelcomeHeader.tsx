"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Session } from "next-auth";

interface WelcomeHeaderProps {
  user?: Session["user"] | null;
}

export default function WelcomeHeader({ user }: WelcomeHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        {user ? `Welcome, ${user.name}!` : "Welcome to Volleyball Manager"}
      </h1>
      <div>
        {user ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-red-600 hover:text-red-800"
          >
            Sign Out
          </button>
        ) : (
          <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800">
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
} 