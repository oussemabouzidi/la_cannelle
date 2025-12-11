"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, Package, Calendar, DollarSign, 
  Users, TrendingUp, Clock, Plus, Edit, Archive, Trash2,
  Search, Filter, Save, XCircle, CheckCircle, AlertCircle,
  Utensils, Wine, Coffee, Dessert, Mail, Phone, MapPin,
  Star, Crown, Gift, Send, MoreVertical, Eye, MessageCircle,
  User // Added User icon
} from 'lucide-react';

import { useRouter } from 'next/navigation';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive';
  tier: 'regular' | 'premium' | 'vip';
  location: string;
  preferences: string[];
  allergies: string[];
  notes: string;
  avatar: string;
}

export default function Customers() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('customers');
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Get current active section from pathname (optional, for styling)
  const getActiveSection = () => {
    if (typeof window === 'undefined') return activeSection;
    // This would depend on your current route structure
    // You might need to use usePathname() from 'next/navigation'
    const pathname = window.location.pathname;
    return navigation.find(item => pathname.includes(item.id))?.id || 'dashboard';
  };

  // Mock customer data with avatar URLs
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2024-01-15',
      totalOrders: 12,
      totalSpent: 1247.50,
      lastOrder: '2024-11-20',
      status: 'active',
      tier: 'premium',
      location: 'New York, NY',
      preferences: ['Italian', 'Vegetarian', 'Desserts'],
      allergies: ['Shellfish'],
      notes: 'Prefers window seating',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 987-6543',
      joinDate: '2023-11-08',
      totalOrders: 8,
      totalSpent: 845.00,
      lastOrder: '2024-11-18',
      status: 'active',
      tier: 'regular',
      location: 'Brooklyn, NY',
      preferences: ['Asian Fusion', 'Spicy'],
      allergies: ['Peanuts'],
      notes: 'Loyal customer - birthday in December',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@email.com',
      phone: '+1 (555) 456-7890',
      joinDate: '2024-03-22',
      totalOrders: 3,
      totalSpent: 285.75,
      lastOrder: '2024-10-15',
      status: 'inactive',
      tier: 'regular',
      location: 'Queens, NY',
      preferences: ['Mexican', 'Gluten-Free'],
      allergies: ['Dairy', 'Gluten'],
      notes: '',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      phone: '+1 (555) 234-5678',
      joinDate: '2022-09-14',
      totalOrders: 25,
      totalSpent: 3120.00,
      lastOrder: '2024-11-21',
      status: 'active',
      tier: 'vip',
      location: 'Manhattan, NY',
      preferences: ['French', 'Steak', 'Wine Pairings'],
      allergies: [],
      notes: 'VIP - corporate client',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '+1 (555) 345-6789',
      joinDate: '2024-06-30',
      totalOrders: 6,
      totalSpent: 520.25,
      lastOrder: '2024-11-19',
      status: 'active',
      tier: 'premium',
      location: 'New Jersey',
      preferences: ['Seafood', 'Healthy'],
      allergies: ['Shellfish'],
      notes: 'Prefers early reservations',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
    }
  ]);

  // Mock order history
  const [orders, setOrders] = useState([
    {
      id: 1001,
      customerId: 1,
      date: '2024-11-20',
      items: ['Truffle Mushroom Risotto', 'Herb-crusted Rack of Lamb', 'Chocolate Fondant'],
      total: 78.00,
      status: 'completed',
      type: 'dine-in'
    },
    {
      id: 1002,
      customerId: 1,
      date: '2024-11-05',
      items: ['Seared Scallops', 'Heirloom Tomato Burrata Salad'],
      total: 46.00,
      status: 'completed',
      type: 'delivery'
    },
    {
      id: 1003,
      customerId: 4,
      date: '2024-11-21',
      items: ['Truffle Mushroom Risotto', 'Seared Scallops', 'Herb-crusted Rack of Lamb', 'Premium Wine Pairing'],
      total: 152.50,
      status: 'completed',
      type: 'dine-in'
    }
  ]);

  // Promotion state
  const [promotion, setPromotion] = useState({
    title: '',
    message: '',
    discount: '',
    validUntil: '',
    recipients: 'all', // 'all', 'active', 'vip', 'selected'
    selectedCustomers: []
  });

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { id: 'orders', name: 'Orders', icon: Package, path: '/orders' },
    { id: 'menu', name: 'Menu Management', icon: Menu, path: '/menu_management' },
    { id: 'system', name: 'System Control', icon: Clock, path: '/system_control' },
    { id: 'customers', name: 'Customers', icon: Users, path: '/customers' },
    { id: 'reports', name: 'Reports', icon: DollarSign, path: '/reports' }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const tiers: Record<'regular' | 'premium' | 'vip', { label: string; color: string }> = {
    regular: { label: 'Regular', color: 'text-gray-600 bg-gray-100' },
    premium: { label: 'Premium', color: 'text-amber-700 bg-amber-100' },
    vip: { label: 'VIP', color: 'text-purple-700 bg-purple-100' }
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCustomerOrders = (customerId: number) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'vip': return <Crown size={16} />;
      case 'premium': return <Star size={16} />;
      default: return null;
    }
  };

  const sendPromotion = () => {
    // In a real app, this would send emails/SMS to selected customers
    console.log('Sending promotion:', promotion);
    setShowPromotionModal(false);
    setPromotion({
      title: '',
      message: '',
      discount: '',
      validUntil: '',
      recipients: 'all',
      selectedCustomers: []
    });
  };

  const CustomerDetailModal = ({ customer, onClose }: { customer: Customer; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar Image */}
              <div className="relative">
                <img 
                  src={customer.avatar} 
                  alt={customer.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2NjYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                {/* Tier Badge */}
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white ${
                  customer.tier === 'vip' ? 'bg-purple-500' :
                  customer.tier === 'premium' ? 'bg-amber-500' :
                  'bg-gray-500'
                }`}>
                  {customer.tier === 'vip' ? (
                    <Crown size={10} className="text-white" />
                  ) : customer.tier === 'premium' ? (
                    <Star size={10} className="text-white" />
                  ) : null}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-elegant">{customer.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${tiers[customer.tier].color} flex items-center gap-1`}>
                    {getTierIcon(customer.tier)}
                    {tiers[customer.tier].label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {customer.status}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Customer Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={16} className="text-gray-600" />
                    <span className="text-gray-900">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={16} className="text-gray-600" />
                    <span className="text-gray-900">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin size={16} className="text-gray-600" />
                    <span className="text-gray-900">{customer.location}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar size={16} className="text-gray-600" />
                    <div>
                      <span className="text-gray-900">Member since {new Date(customer.joinDate).toLocaleDateString()}</span>
                      <p className="text-xs text-gray-600 mt-1">{customer.totalOrders} orders · €{customer.totalSpent} total spent</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences & Notes</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Dietary Preferences</p>
                    <div className="flex flex-wrap gap-1">
                      {customer.preferences.map((pref, index) => (
                        <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                  {customer.allergies.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Allergies</p>
                      <div className="flex flex-wrap gap-1">
                        {customer.allergies.map((allergy, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {customer.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Additional Notes</p>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">{customer.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {getCustomerOrders(customer.id).map((order) => (
                  <div key={order.id} className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{order.items.join(', ')}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{order.type}</span>
                      <span className="font-semibold text-gray-900">€{order.total}</span>
                    </div>
                  </div>
                ))}
                {getCustomerOrders(customer.id).length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <Package size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No orders found</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center gap-2">
                    <MessageCircle size={14} />
                    Send Message
                  </button>
                  <button className="px-4 py-2 bg-white text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium flex items-center gap-2">
                    <Gift size={14} />
                    Send Offer
                  </button>
                  <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-2">
                    <Edit size={14} />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PromotionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 font-elegant">Send Promotion</h2>
            <button onClick={() => setShowPromotionModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Title</label>
            <input
              type="text"
              value={promotion.title}
              onChange={(e) => setPromotion(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Special Offer, Seasonal Discount..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Offer</label>
            <input
              type="text"
              value={promotion.discount}
              onChange={(e) => setPromotion(prev => ({ ...prev, discount: e.target.value }))}
              placeholder="20% OFF, €25 discount, Free dessert..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
            <input
              type="date"
              value={promotion.validUntil}
              onChange={(e) => setPromotion(prev => ({ ...prev, validUntil: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={promotion.message}
              onChange={(e) => setPromotion(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              placeholder="Write your promotion message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Send To</label>
            <div className="space-y-2">
              {['all', 'active', 'vip'].map(recipientType => (
                <label key={recipientType} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="recipients"
                    value={recipientType}
                    checked={promotion.recipients === recipientType}
                    onChange={(e) => setPromotion(prev => ({ ...prev, recipients: e.target.value }))}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-gray-700 capitalize">
                    {recipientType === 'all' ? 'All Customers' :
                     recipientType === 'active' ? 'Active Customers Only' :
                     'VIP Customers Only'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={sendPromotion}
              disabled={!promotion.title || !promotion.discount}
              className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Send Promotion
            </button>
            <button
              onClick={() => setShowPromotionModal(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-lg border-r border-gray-100 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="text-2xl font-bold text-gray-900 font-elegant italic">
              <img src="/images/logo.png" alt="" className="w-50 h-auto" />
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>

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

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Users className="text-amber-700" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Admin User</p>
                <p className="text-sm text-gray-600">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
                <Menu size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 font-elegant">Customer Management</h1>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-elegant">Customers</h2>
              <p className="text-gray-600">Manage customer profiles, view order history, and send promotions</p>
            </div>
            <button
              onClick={() => setShowPromotionModal(true)}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2"
            >
              <Gift size={20} />
              Send Promotion
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 backdrop-blur-sm mb-6">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'list'
                    ? 'text-amber-700 border-b-2 border-amber-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Customer List
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'text-amber-700 border-b-2 border-amber-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Order History
              </button>
            </div>

            <div className="p-6">
              {/* Customer List Tab */}
              {activeTab === 'list' && (
                <div className="space-y-6">
                  {/* Filters and Search */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>

                    <div className="text-sm text-gray-600 flex items-center justify-center">
                      {filteredCustomers.length} customers found
                    </div>
                  </div>

                  {/* Customers Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className={`bg-white rounded-2xl shadow-sm border border-stone-100 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
                          isVisible ? 'animate-fade-in-up' : 'opacity-0'
                        }`}
                      >
                        <div className="p-6">
                          {/* Customer Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img 
                                  src={customer.avatar} 
                                  alt={customer.name}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-200"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2NjYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                                  }}
                                />
                                {/* Tier Badge */}
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-white ${
                                  customer.tier === 'vip' ? 'bg-purple-500' :
                                  customer.tier === 'premium' ? 'bg-amber-500' :
                                  'bg-gray-500'
                                }`} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${tiers[customer.tier].color} flex items-center gap-1`}>
                                    {getTierIcon(customer.tier)}
                                    {tiers[customer.tier].label}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    customer.status === 'active' 
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {customer.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedCustomer(customer)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                          </div>

                          {/* Customer Details */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail size={14} />
                              <span className="truncate">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={14} />
                              <span>{customer.phone}</span>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                              <div className="text-center">
                                <p className="text-lg font-bold text-gray-900">{customer.totalOrders}</p>
                                <p className="text-xs text-gray-600">Orders</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-gray-900">€{customer.totalSpent}</p>
                                <p className="text-xs text-gray-600">Total</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-bold text-gray-900">
                                  {new Date(customer.lastOrder).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                                <p className="text-xs text-gray-600">Last Order</p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-4 mt-4 border-t border-gray-100">
                            <button
                              onClick={() => setSelectedCustomer(customer)}
                              className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                            >
                              <Eye size={14} />
                              View
                            </button>
                            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-1">
                              <MessageCircle size={14} />
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredCustomers.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                      <Users size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 text-lg">No customers found matching your criteria</p>
                    </div>
                  )}
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {orders.map((order) => {
                      const customer = customers.find(c => c.id === order.customerId);
                      return (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                <img 
                                  src={customer?.avatar} 
                                  alt={customer?.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2NjYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                                  }}
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{customer?.name}</p>
                                <p className="text-sm text-gray-600">Order #{order.id}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">€{order.total}</p>
                              <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-700 mb-1">{order.items.join(', ')}</p>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'completed' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {order.status}
                                </span>
                                <span className="text-xs text-gray-600 capitalize">{order.type}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => customer && setSelectedCustomer(customer)}
                              className="px-3 py-1 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {selectedCustomer && (
        <CustomerDetailModal 
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {showPromotionModal && <PromotionModal />}
    </div>
  );
}
