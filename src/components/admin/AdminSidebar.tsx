"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  CreditCardIcon 
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Users", href: "/admin/users", icon: UserGroupIcon },
  { name: "Games", href: "/admin/games", icon: CalendarIcon },
  { name: "Payments", href: "/admin/payments", icon: CreditCardIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex flex-col flex-1 min-h-0">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : ""
                }`}
              >
                <div className="shrink-0" style={{ width: '24px', height: '24px' }}>
                  <item.icon 
                    aria-hidden="true"
                    className="w-full h-full block"
                  />
                </div>
                <span className="ml-3">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 