"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChefHat, ShoppingCart, Leaf } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Inventory", icon: Home },
    { href: "/recipes", label: "Recipes", icon: ChefHat },
    { href: "/shopping", label: "Shopping", icon: ShoppingCart },
    { href: "/impact", label: "Impact", icon: Leaf },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass pb-safe border-t border-slate-200 dark:border-slate-800 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 w-16 transition-colors duration-200 ${
                isActive ? "text-brand" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? "bg-brand-light/50 dark:bg-brand-dark/30" : ""}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] sm:text-xs font-medium ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
