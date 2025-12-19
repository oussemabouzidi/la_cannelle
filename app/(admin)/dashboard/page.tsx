"use client";

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/hooks/useTranslation';
import AdminLanguageToggle from '../components/AdminLanguageToggle';

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, Package, Calendar, DollarSign, 
  Users, TrendingUp, Clock, CheckCircle, AlertCircle,
  Plus, MoreVertical, Eye, Edit, Archive,
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
  BarChart3
} from 'lucide-react';
import { dashboardApi, DashboardStats } from '@/lib/api/dashboard';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { language, toggleLanguage } = useTranslation('admin');
  const locale = language === 'DE' ? 'de-DE' : 'en-US';

  const copy = {
    EN: {
      nav: {
        dashboard: 'Dashboard',
        orders: 'Orders',
        menu: 'Menu Management',
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
        dashboard: 'Uebersicht',
        orders: 'Bestellungen',
        menu: 'Menueverwaltung',
        system: 'Systemsteuerung',
        customers: 'Kunden',
        reports: 'Berichte',
      },
      admin: {
        user: 'Admin Benutzer',
        role: 'Administrator',
      },
      header: {
        title: 'Uebersicht',
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
        guests: 'Gaeste',
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

  // Get current active section from pathname (optional, for styling)
  const getActiveSection = () => {
    if (typeof window === 'undefined') return activeSection;
    // This would depend on your current route structure
    // You might need to use usePathname() from 'next/navigation'
    const pathname = window.location.pathname;
    return navigation.find(item => pathname.includes(item.id))?.id || 'dashboard';
  };


  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsSidebarOpen(window.innerWidth >= 1024);
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardApi.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
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
    { id: 'system', name: t.nav.system, icon: Clock, path: '/system_control' },
    { id: 'customers', name: t.nav.customers, icon: Users, path: '/customers' },
    { id: 'reports', name: t.nav.reports, icon: DollarSign, path: '/reports' }
  ];
  const data: DashboardStats = dashboardData ?? {
    orders: { total: 0, pending: 0, confirmed: 0, completed: 0 },
    revenue: { today: 0, week: 0, month: 0, growth: 0 },
    todaysEvents: [],
    recentOrders: []
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100">
      {/* Add animations and fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
        
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
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .font-elegant {
          font-family: 'Playfair Display', serif;
        }
      `}</style>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-lg border-r border-gray-100 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="text-2xl font-bold text-gray-900 font-elegant italic">
              <img src="/images/logo.png" alt="" className="w-50 h-auto" />
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
<nav className="flex-1 p-4">
  <div className="space-y-2">
    {navigation.map((item) => (
      <button
        key={item.id}
        onClick={() => handleNavigation(item.path)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          getActiveSection() === item.id
            ? 'bg-amber-100 text-amber-700 border border-amber-200'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <item.icon size={20} />
        <span className="font-medium">{item.name}</span>
      </button>
    ))}
  </div>
</nav>

          {/* Admin Info */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Users className="text-amber-700" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{t.admin.user}</p>
                <p className="text-sm text-gray-600">{t.admin.role}</p>
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

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 font-elegant">
                {t.header.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString(locale, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <AdminLanguageToggle language={language} onToggle={toggleLanguage} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Orders */}
            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.stats.totalOrders}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{data.orders.total}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Package className="text-amber-700" size={24} />
                </div>
              </div>
              <div className="flex gap-4 mt-4 text-xs">
                <span className="text-blue-600">{t.stats.pending}: {data.orders.pending}</span>
                <span className="text-green-600">{t.stats.confirmed}: {data.orders.confirmed}</span>
                <span className="text-gray-600">{t.stats.completed}: {data.orders.completed}</span>
              </div>
            </div>

            {/* Today's Revenue */}
            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`} style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.stats.todayRevenue}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">€{data.revenue.today.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-green-700" size={24} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm text-green-600">
                <TrendingUp size={16} />
                <span>+{data.revenue.growth}% {t.stats.growthLabel}</span>
              </div>
            </div>

            {/* Weekly Revenue */}
            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`} style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.stats.weeklyRevenue}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">€{data.revenue.week.toLocaleString()}</p>
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
                  <p className="text-3xl font-bold text-gray-900 mt-2">€{data.revenue.month.toLocaleString()}</p>
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
                {data.todaysEvents.map((event, index) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-amber-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        event.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-500'
                      }`}></div>
                      <div>
                        <p className="font-semibold text-gray-900">{event.client}</p>
                        <p className="text-sm text-gray-600">{event.time} • {event.guests} {t.labels.guests}</p>
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
                ))}
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
                {data.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-amber-50 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">€{order.amount}</p>
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
                        <button className="p-1 hover:bg-white rounded transition-colors">
                          <Eye size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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

        </main>
      </div>
    </div>
  );
}
