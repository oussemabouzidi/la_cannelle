"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, Package, Calendar, DollarSign, 
  Users, TrendingUp, Clock, CheckCircle, AlertCircle, XCircle,
  Search, Filter, Eye, Edit, Archive, RefreshCw, Truck,
  MessageCircle, Phone, Mail, MapPin, User
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/hooks/useTranslation';
import AdminLanguageToggle from '../components/AdminLanguageToggle';
import { ordersApi, Order } from '@/lib/api/orders';


export default function AdminOrders() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const { language, toggleLanguage } = useTranslation('admin');

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
        title: 'Orders Management',
      },
      filters: {
        searchPlaceholder: 'Search orders...',
        allStatus: 'All Status',
        allDates: 'All Dates',
        today: 'Today',
        upcoming: 'Upcoming',
        refresh: 'Refresh',
        refreshing: 'Refreshing...',
      },
      table: {
        title: 'All Orders',
        orderId: 'Order ID',
        client: 'Client',
        event: 'Event',
        dateTime: 'Date & Time',
        guests: 'Guests',
        total: 'Total',
        status: 'Status',
        actions: 'Actions',
        paymentPaid: 'Paid',
        paymentPending: 'Pending',
      },
      modal: {
        title: 'Order Details',
        clientInfo: 'Client Information',
        eventDetails: 'Event Details',
        clientLabel: 'Client',
        eventType: 'Event Type',
        orderItems: 'Order Items',
        quantity: 'Qty',
        total: 'Total',
        specialRequests: 'Special Requests',
        statusManagement: 'Status Management',
        cancelOrder: 'Cancel Order',
        cancelPlaceholder: 'Reason for cancellation...',
        cancelAction: 'Cancel Order & Process Refund',
      },
      status: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        preparation: 'In Preparation',
        delivery: 'Out for Delivery',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
      labels: {
        guests: 'guests',
        emptyState: 'No orders found matching your criteria',
        viewDetails: 'View Details',
        markComplete: 'Mark Complete',
        cancelOrder: 'Cancel Order',
      },
    },
    DE: {
      nav: {
        dashboard: 'ubersicht',
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
        title: 'Bestellverwaltung',
      },
      filters: {
        searchPlaceholder: 'Bestellungen suchen...',
        allStatus: 'Alle Status',
        allDates: 'Alle Daten',
        today: 'Heute',
        upcoming: 'Bevorstehend',
        refresh: 'Aktualisieren',
        refreshing: 'Aktualisiere...',
      },
      table: {
        title: 'Alle Bestellungen',
        orderId: 'Bestell-ID',
        client: 'Kunde',
        event: 'Event',
        dateTime: 'Datum & Uhrzeit',
        guests: 'Gaeste',
        total: 'Gesamt',
        status: 'Status',
        actions: 'Aktionen',
        paymentPaid: 'Bezahlt',
        paymentPending: 'Ausstehend',
      },
      modal: {
        title: 'Bestelldetails',
        clientInfo: 'Kundeninformationen',
        eventDetails: 'Eventdetails',
        clientLabel: 'Kunde',
        eventType: 'Eventtyp',
        orderItems: 'Bestellpositionen',
        quantity: 'Menge',
        total: 'Gesamt',
        specialRequests: 'Besondere Wuensche',
        statusManagement: 'Statusverwaltung',
        cancelOrder: 'Bestellung stornieren',
        cancelPlaceholder: 'Grund fuer die Stornierung...',
        cancelAction: 'Bestellung stornieren und Rueckerstattung ausloesen',
      },
      status: {
        pending: 'Ausstehend',
        confirmed: 'Bestaetigt',
        preparation: 'In Vorbereitung',
        delivery: 'In Lieferung',
        completed: 'Abgeschlossen',
        cancelled: 'Storniert',
      },
      labels: {
        guests: 'Gaeste',
        emptyState: 'Keine Bestellungen gefunden, die den Kriterien entsprechen',
        viewDetails: 'Details ansehen',
        markComplete: 'Als abgeschlossen markieren',
        cancelOrder: 'Bestellung stornieren',
      },
    },
  } as const;
  const t = copy[language] ?? copy.EN;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsSidebarOpen(window.innerWidth >= 1024);
  }, []);

    // Get current active section from pathname (optional, for styling)
  const getActiveSection = () => {
    if (typeof window === 'undefined') return activeSection;
    // This would depend on your current route structure
    // You might need to use usePathname() from 'next/navigation'
    const pathname = window.location.pathname;
    return navigation.find(item => pathname.includes(item.id))?.id || 'dashboard';
  };

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const apiOrders = await ordersApi.getOrders();
      const normalized: LocalOrder[] = apiOrders.map((order: Order) => ({
        id: order.id,
        client: order.clientName,
        contact: order.contactEmail,
        phone: order.phone,
        eventType: order.eventType,
        eventDate: order.eventDate,
        eventTime: order.eventTime,
        guests: order.guests,
        location: order.location,
        menuTier: order.menuTier?.toLowerCase(),
        total: order.total,
        status: order.status.toLowerCase(),
        payment: order.paymentStatus.toLowerCase(),
        specialRequests: order.specialRequests,
        createdAt: order.createdAt,
        dishes: order.items?.map((it) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.price
        })) || [],
        beverages: [],
        cancellationReason: (order as any).cancellationReason ?? null
      }));
      setOrders(normalized);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  type LocalOrder = {
    id: string;
    client: string;
    contact: string;
    phone: string;
    eventType: string;
    eventDate: string;
    eventTime: string;
    guests: number;
    location: string;
    menuTier?: string;
    total: number;
    status: string;
    payment: string;
    specialRequests?: string;
    createdAt?: string;
    dishes?: { name: string; quantity: number; price: number }[];
    beverages?: { name: string; quantity: number; price: number }[];
    cancellationReason?: string | null;
  };

  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const statusOptions = [
    { value: 'pending', label: t.status.pending, color: 'bg-amber-100 text-amber-800' },
    { value: 'confirmed', label: t.status.confirmed, color: 'bg-blue-100 text-blue-800' },
    { value: 'preparation', label: t.status.preparation, color: 'bg-purple-100 text-purple-800' },
    { value: 'delivery', label: t.status.delivery, color: 'bg-indigo-100 text-indigo-800' },
    { value: 'completed', label: t.status.completed, color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: t.status.cancelled, color: 'bg-red-100 text-red-800' }
  ];

  const navigation = [
    { id: 'dashboard', name: t.nav.dashboard, icon: TrendingUp, path: '/dashboard' },
    { id: 'orders', name: t.nav.orders, icon: Package, path: '/orders' },
    { id: 'menu', name: t.nav.menu, icon: Menu, path: '/menu_management' },
    { id: 'system', name: t.nav.system, icon: Clock, path: '/system_control' },
    { id: 'customers', name: t.nav.customers, icon: Users, path: '/customers' },
    // { id: 'reports', name: t.nav.reports, icon: DollarSign, path: '/reports' }
  ];


  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && order.eventDate === new Date().toISOString().split('T')[0]) ||
                       (dateFilter === 'upcoming' && order.eventDate > new Date().toISOString().split('T')[0]);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updated = await ordersApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: updated.status.toLowerCase?.() || newStatus } : prev);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const cancelOrder = (orderId, reason) => {
    // In a real app, this would make an API call
    console.log(`Cancelling order ${orderId} with reason: ${reason}`);
    // Update local state or refetch data
  };

  const OrderDetailsModal = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-300 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 font-elegant">{t.modal.title} - {order.id}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg text-gray-700">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Client Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">{t.modal.clientInfo}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User size={18} className="text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{order.client}</p>
                    <p className="text-sm text-gray-700">{t.modal.clientLabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail size={18} className="text-gray-600" />
                  <p className="text-sm text-gray-900">{order.contact}</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={18} className="text-gray-600" />
                  <p className="text-sm text-gray-900">{order.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">{t.modal.eventDetails}</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{order.eventType}</p>
                    <p className="text-sm text-gray-700">{t.modal.eventType}</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar size={18} className="text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{order.eventDate}</p>
                    <p className="text-sm text-gray-700">{order.eventTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users size={18} className="text-gray-600" />
                  <p className="text-gray-900">{order.guests} {t.labels.guests}</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin size={18} className="text-gray-600 mt-1" />
                  <p className="text-sm text-gray-900">{order.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">{t.modal.orderItems}</h3>
            <div className="space-y-3">
              {order.dishes.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-700">{t.modal.quantity}: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">€{item.price * item.quantity}</p>
                </div>
              ))}
              {order.beverages.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-700">{t.modal.quantity}: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">€{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center p-4 border-t border-gray-300 mt-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-900">{t.modal.total}</p>
              <p className="text-lg font-bold text-gray-900">€{order.total}</p>
            </div>
          </div>

          {/* Special Requests */}
          {order.specialRequests && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-2">{t.modal.specialRequests}</h3>
              <p className="text-gray-900 bg-amber-50 p-4 rounded-lg border border-amber-200">{order.specialRequests}</p>
            </div>
          )}

          {/* Status Management */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">{t.modal.statusManagement}</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(status => (
                <button
                  key={status.value}
                  onClick={() => updateOrderStatus(order.id, status.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                    order.status === status.value 
                      ? `${status.color} border-gray-300` 
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cancellation Section */}
          {order.status !== 'cancelled' && (
            <div className="border-t border-gray-300 pt-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4 border-b pb-2">{t.modal.cancelOrder}</h3>
              <div className="space-y-3">
                <textarea
                  placeholder={t.modal.cancelPlaceholder}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
                  rows={3}
                />
                <button
                  onClick={() => cancelOrder(order.id, 'Client request')}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium border border-red-700"
                >
                  {t.modal.cancelAction}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-300 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-300">
<div className="text-2xl font-bold text-gray-900 font-elegant italic">
              <img src="/images/logo.png" alt="" />
            </div>            <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-200 text-gray-700">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 p-4">
  <div className="space-y-2">
    {navigation.map((item) => (
      <button
        key={item.id}
        onClick={() => handleNavigation(item.path)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border ${
          getActiveSection() === item.id
            ? 'bg-amber-100 text-amber-800 border-amber-300'
            : 'text-gray-800 hover:bg-gray-100 border-transparent hover:border-gray-300'
        }`}
      >
        <item.icon size={20} />
        <span className="font-medium">{item.name}</span>
      </button>
    ))}
  </div>
</nav>

          <div className="p-4 border-t border-gray-300">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center border border-amber-300">
                <Users className="text-amber-800" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{t.admin.user}</p>
                <p className="text-sm text-gray-700">{t.admin.role}</p>
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
        <header className="bg-white border-b border-gray-300">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-200 text-gray-700">
                <Menu size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 font-elegant">{t.header.title}</h1>
            </div>
            <AdminLanguageToggle language={language} onToggle={toggleLanguage} />
          </div>
        </header>

        <main className="p-6">
          {/* Filters and Search */}
          <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-300 mb-6 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder={t.filters.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
              >
                <option value="all">{t.filters.allStatus}</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
              >
                <option value="all">{t.filters.allDates}</option>
                <option value="today">{t.filters.today}</option>
                <option value="upcoming">{t.filters.upcoming}</option>
              </select>

              <button
                onClick={loadOrders}
                className="px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2 border border-amber-700"
              >
                <RefreshCw size={16} />
                {isLoading ? t.filters.refreshing : t.filters.refresh}
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-300 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`} style={{ animationDelay: '200ms' }}>
            <div className="p-6 border-b border-gray-300">
              <h2 className="text-xl font-bold text-gray-900 font-elegant">{t.table.title} ({filteredOrders.length})</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">{t.table.orderId}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">{t.table.client}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">{t.table.event}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">{t.table.dateTime}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">{t.table.guests}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">{t.table.total}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">{t.table.status}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{t.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {filteredOrders.map((order) => {
                    const statusConfig = statusOptions.find(s => s.value === order.status);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">
                          <div className="text-sm font-medium text-gray-900">{order.id}</div>
                          <div className="text-sm text-gray-700">{order.createdAt}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">
                          <div className="text-sm font-medium text-gray-900">{order.client}</div>
                          <div className="text-sm text-gray-700">{order.contact}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">
                          <div className="text-sm text-gray-900">{order.eventType}</div>
                          <div className="text-sm text-gray-700">{order.menuTier}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">
                          <div className="text-sm text-gray-900">{order.eventDate}</div>
                          <div className="text-sm text-gray-700">{order.eventTime}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                          {order.guests}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">
                          <div className="text-sm font-semibold text-gray-900">€{order.total}</div>
                          <div className={`text-xs ${
                            order.payment === 'paid' ? 'text-green-700' : 'text-amber-700'
                          }`}>
                            {order.payment === 'paid' ? t.table.paymentPaid : t.table.paymentPending}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig?.color} border-gray-300`}>
                            {statusConfig?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                              title={t.labels.viewDetails}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="p-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                              title={t.labels.markComplete}
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => cancelOrder(order.id, 'Admin action')}
                              className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                              title={t.labels.cancelOrder}
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 border-t border-gray-300">
                <Package size={48} className="mx-auto text-gray-500 mb-4" />
                <p className="text-gray-700 text-lg">{t.labels.emptyState}</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}
