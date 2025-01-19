"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Game } from "@prisma/client";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const paths = pathname.split('/').filter(Boolean);
  const [gameLocation, setGameLocation] = useState<string | null>(null);

  useEffect(() => {
    const gameId = paths[1];
    if (paths[0] === 'games' && gameId?.match(/^[0-9a-f-]{36}$/)) {
      fetch(`/api/games/${gameId}`)
        .then(res => res.json())
        .then((game: Game) => {
          setGameLocation(game.location);
        })
        .catch(console.error);
    }
  }, [paths]);

  const breadcrumbs = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`;
    const isGameDetails = paths[0] === 'games' && index === 1 && path.match(/^[0-9a-f-]{36}$/);
    const label = isGameDetails 
      ? (gameLocation || 'Loading...') 
      : path.charAt(0).toUpperCase() + path.slice(1);
    const isLast = index === paths.length - 1;

    return {
      href,
      label,
      isLast,
    };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link href={isAdminRoute ? "/admin" : "/"} className="hover:text-gray-800">
        <HomeIcon className="w-4 h-4" style={{ width: '24px', height: '24px' }} />
      </Link>
      {breadcrumbs
        .filter((_, index) => !isAdminRoute || index > 0)
        .map(({ href, label, isLast }) => (
          <div key={href} className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-1" style={{ width: '24px', height: '24px' }} />
            {isLast ? (
              <span className="text-gray-800 font-medium">{label}</span>
            ) : (
              <Link href={href} className="hover:text-gray-800">
                {label}
              </Link>
            )}
          </div>
        ))}
    </nav>
  );
} 