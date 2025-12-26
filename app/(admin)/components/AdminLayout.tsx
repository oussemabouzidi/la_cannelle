"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Users } from 'lucide-react';

export type AdminNavItem = {
  id: string;
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

type AdminLayoutProps = {
  navigation: AdminNavItem[];
  title: string;
  adminUserLabel: string;
  adminRoleLabel: string;
  languageToggle: React.ReactNode;
  locale?: string;
  headerMeta?: React.ReactNode;
  children: React.ReactNode;
};

export default function AdminLayout({
  navigation,
  title,
  adminUserLabel,
  adminRoleLabel,
  languageToggle,
  locale = 'en-US',
  headerMeta,
  children
}: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsSidebarOpen(window.innerWidth >= 1024);
  }, []);

  const activeId = useMemo(() => {
    const match = navigation.find((item) => pathname?.startsWith(item.path));
    return match?.id || navigation[0]?.id || '';
  }, [navigation, pathname]);

  const formattedDate = useMemo(() => {
    try {
      return new Date().toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return new Date().toDateString();
    }
  }, [locale]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        .font-elegant {
          font-family: 'Playfair Display', serif;
        }
      `}</style>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-lg border-r border-gray-100 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="text-2xl font-bold text-gray-900 font-elegant italic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-removebg-preview.png" alt="" className="w-50 h-auto" />
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    type="button"
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Users className="text-amber-700" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{adminUserLabel}</p>
                <p className="text-sm text-gray-600">{adminRoleLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                type="button"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 font-elegant">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
              {headerMeta ?? <div className="text-sm text-gray-600">{formattedDate}</div>}
              {languageToggle}
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

