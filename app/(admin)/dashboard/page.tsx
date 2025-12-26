"use client";

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/hooks/useTranslation';
import AdminLanguageToggle from '../components/AdminLanguageToggle';
import AdminLayout from '../components/AdminLayout';

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Package, Calendar, DollarSign, 
  Users, TrendingUp, Clock, CheckCircle, AlertCircle,
  Plus, MoreVertical, Edit, Archive,
  Settings,
  LayoutGrid,
  Tag,
  Award,
  CreditCard,
  Mail,
  FileText,
  Calculator,
  User,
  Building,
  Bell,
  Zap,
  LogOut,
  BarChart3,
  ShoppingBag
} from 'lucide-react';
import { dashboardApi, DashboardStats } from '@/lib/api/dashboard';

export default function AdminDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const router = useRouter();
  const { language, toggleLanguage } = useTranslation('admin');
  const locale = language === 'DE' ? 'de-DE' : 'en-US';

  const copy = {
    EN: {
      nav: {
        dashboard: 'Dashboard',
        orders: 'Orders',
        menu: 'Menu Management',
        accessories: 'Accessories',
        system: 'System Control',
        customers: 'Customers',
        reports: 'Reports',
      },
      admin: {
        user: 'Admin User',
        role: 'Administrator',
      },
      header: {
        title: 'Dashboard',
      },
      stats: {
        totalOrders: 'Total Orders',
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed',
        todayRevenue: "Today's Revenue",
        weeklyRevenue: 'Weekly Revenue',
        monthlyRevenue: 'Monthly Revenue',
        growthLabel: 'from yesterday',
      },
      sections: {
        todaysEvents: "Today's Events",
        recentOrders: 'Recent Orders',
      },
      labels: {
        guests: 'guests',
        viewAllOrders: 'View All Orders',
      },
      status: {
        confirmed: 'Confirmed',
        pending: 'Pending',
        completed: 'Completed',
        cancelled: 'Cancelled',
        preparation: 'In Preparation',
        delivery: 'Out for Delivery',
      },
    },
    DE: {
      nav: {
        dashboard: 'Ubersicht',
        orders: 'Bestellungen',
        menu: 'Menueverwaltung',
        accessories: 'Zubehoer',
        system: 'Systemsteuerung',
        customers: 'Kunden',
        reports: 'Berichte',
      },
      admin: {
        user: 'Admin Benutzer',
        role: 'Administrator',
      },
      header: {
        title: 'Ubersicht',
      },
      stats: {
        totalOrders: 'Gesamtbestellungen',
        pending: 'Ausstehend',
        confirmed: 'Bestaetigt',
        completed: 'Abgeschlossen',
        todayRevenue: 'Heutiger Umsatz',
        weeklyRevenue: 'Wochenumsatz',
        monthlyRevenue: 'Monatsumsatz',
        growthLabel: 'seit gestern',
      },
      sections: {
        todaysEvents: 'Heutige Events',
        recentOrders: 'Letzte Bestellungen',
      },
      labels: {
        guests: 'Gäste',
        viewAllOrders: 'Alle Bestellungen ansehen',
      },
      status: {
        confirmed: 'Bestaetigt',
        pending: 'Ausstehend',
        completed: 'Abgeschlossen',
        cancelled: 'Storniert',
        preparation: 'In Vorbereitung',
        delivery: 'In Lieferung',
      },
    },
  } as const;
  const t = copy[language] ?? copy.EN;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await dashboardApi.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
        setLoadError('Unable to load dashboard data right now.');
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const navigation = [
    { id: 'dashboard', name: t.nav.dashboard, icon: TrendingUp, path: '/dashboard' },
    { id: 'orders', name: t.nav.orders, icon: Package, path: '/orders' },
    { id: 'menu', name: t.nav.menu, icon: Menu, path: '/menu_management' },
    { id: 'accessories', name: t.nav.accessories, icon: ShoppingBag, path: '/accessories' },
    { id: 'system', name: t.nav.system, icon: Clock, path: '/system_control' },
    { id: 'customers', name: t.nav.customers, icon: Users, path: '/customers' },
    { id: 'reports', name: t.nav.reports, icon: BarChart3, path: '/reports' }
  ];
  const data = dashboardData;
  const formatNumber = (value?: number) => (
    typeof value === 'number' ? value.toLocaleString(locale) : '--'
  );
  const todaysEvents = data?.todaysEvents ?? [];
  const recentOrders = data?.recentOrders ?? [];

  return (
    <AdminLayout
      navigation={navigation}
      title={t.header.title}
      adminUserLabel={t.admin.user}
      adminRoleLabel={t.admin.role}
      languageToggle={<AdminLanguageToggle language={language} onToggle={toggleLanguage} />}
      locale={locale}
    >
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out;
        }
      `}</style>

          {loadError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}
          {isLoading && !loadError && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
              Loading dashboard data...
            </div>
          )}
          {!isLoading && !loadError && !data && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
              No dashboard data available yet.
            </div>
          )}
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Orders */}
            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.stats.totalOrders}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{formatNumber(data?.orders.total)}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Package className="text-amber-700" size={24} />
                </div>
              </div>
              <div className="flex gap-4 mt-4 text-xs">
                <span className="text-blue-600">{t.stats.pending}: {formatNumber(data?.orders.pending)}</span>
                <span className="text-green-600">{t.stats.confirmed}: {formatNumber(data?.orders.confirmed)}</span>
                <span className="text-gray-600">{t.stats.completed}: {formatNumber(data?.orders.completed)}</span>
              </div>
            </div>

            {/* Today's Revenue */}
            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`} style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.stats.todayRevenue}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">€{formatNumber(data?.revenue.today)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-green-700" size={24} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm text-green-600">
                <TrendingUp size={16} />
                <span>
                  {typeof data?.revenue.growth === 'number'
                    ? `+${data.revenue.growth}% ${t.stats.growthLabel}`
                    : '--'}
                </span>
              </div>
            </div>

            {/* Weekly Revenue */}
            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`} style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.stats.weeklyRevenue}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">€{formatNumber(data?.revenue.week)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-blue-700" size={24} />
                </div>
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`} style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.stats.monthlyRevenue}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">€{formatNumber(data?.revenue.month)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-purple-700" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Events */}
            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`} style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 font-elegant">{t.sections.todaysEvents}</h2>
                <Calendar className="text-gray-400" size={20} />
              </div>
              
              <div className="space-y-4">
                {todaysEvents.length === 0 ? (
                  <p className="text-sm text-gray-500">No events scheduled for today.</p>
                ) : (
                  todaysEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-amber-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          event.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-500'
                        }`}></div>
                        <div>
                          <p className="font-semibold text-gray-900">{event.client}</p>
                          <p className="text-sm text-gray-600">{event.time} - {event.guests} {t.labels.guests}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status[event.status as keyof typeof t.status] ?? event.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`} style={{ animationDelay: '500ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 font-elegant">{t.sections.recentOrders}</h2>
                <Package className="text-gray-400" size={20} />
              </div>
              
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-sm text-gray-500">No recent orders yet.</p>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-amber-50 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">€{formatNumber(order.amount)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {t.status[order.status as keyof typeof t.status] ?? order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <button
                onClick={() => router.push('/orders')}
                className="w-full mt-6 py-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                {t.labels.viewAllOrders}
              </button>
            </div>
          </div>

    </AdminLayout>
  );
}
