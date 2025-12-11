"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, Package, Calendar, DollarSign, 
  Users, TrendingUp, Clock, Plus, Edit, Archive, Trash2,
  Search, Filter, Save, XCircle, CheckCircle, AlertCircle,
  Utensils, Wine, Coffee, Dessert, Download, BarChart3, PieChart,
  TrendingDown, TrendingUp as TrendUp, Eye, FileText, Calendar as CalendarIcon
} from 'lucide-react';

import { useRouter } from 'next/navigation';


export default function Reports() {
        const router = useRouter();
    
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('reports');
  const [activeTab, setActiveTab] = useState('revenue');
  const [dateRange, setDateRange] = useState('30d'); // 7d, 30d, 90d, custom
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

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

  // Mock revenue data
  const revenueData = {
    totalRevenue: 28450.75,
    averageOrderValue: 89.50,
    totalOrders: 318,
    growthRate: 12.5,
    dailyRevenue: [
      { date: '2024-11-01', revenue: 1250, orders: 14 },
      { date: '2024-11-02', revenue: 980, orders: 11 },
      { date: '2024-11-03', revenue: 1520, orders: 17 },
      { date: '2024-11-04', revenue: 1100, orders: 12 },
      { date: '2024-11-05', revenue: 1680, orders: 19 },
      { date: '2024-11-06', revenue: 1420, orders: 16 },
      { date: '2024-11-07', revenue: 1950, orders: 22 },
      { date: '2024-11-08', revenue: 2100, orders: 23 },
      { date: '2024-11-09', revenue: 2450, orders: 27 },
      { date: '2024-11-10', revenue: 2300, orders: 25 },
      { date: '2024-11-11', revenue: 1800, orders: 20 },
      { date: '2024-11-12', revenue: 1600, orders: 18 },
      { date: '2024-11-13', revenue: 1750, orders: 19 },
      { date: '2024-11-14', revenue: 1900, orders: 21 },
      { date: '2024-11-15', revenue: 2200, orders: 24 },
      { date: '2024-11-16', revenue: 2500, orders: 28 },
      { date: '2024-11-17', revenue: 2650, orders: 29 },
      { date: '2024-11-18', revenue: 2400, orders: 26 },
      { date: '2024-11-19', revenue: 1950, orders: 22 },
      { date: '2024-11-20', revenue: 2100, orders: 23 },
    ],
    byCategory: [
      { category: 'Main Courses', revenue: 15680, percentage: 55.1 },
      { category: 'Starters', revenue: 4250, percentage: 14.9 },
      { category: 'Desserts', revenue: 3850, percentage: 13.5 },
      { category: 'Beverages', revenue: 2850, percentage: 10.0 },
      { category: 'Wine Pairings', revenue: 1820.75, percentage: 6.4 }
    ],
    byTier: [
      { tier: 'Essential', revenue: 7850, orders: 125 },
      { tier: 'Premium', revenue: 12450, orders: 98 },
      { tier: 'Luxury', revenue: 8150.75, orders: 95 }
    ]
  };

  // Mock popular items data
  const popularItemsData = [
    {
      id: 1,
      name: 'Truffle Mushroom Risotto',
      category: 'Main Course',
      orders: 145,
      revenue: 3480,
      popularity: 95,
      trend: 'up'
    },
    {
      id: 2,
      name: 'Herb-crusted Rack of Lamb',
      category: 'Main Course',
      orders: 98,
      revenue: 3724,
      popularity: 88,
      trend: 'up'
    },
    {
      id: 3,
      name: 'Seared Scallops',
      category: 'Starter',
      orders: 112,
      revenue: 3136,
      popularity: 92,
      trend: 'up'
    },
    {
      id: 4,
      name: 'Chocolate Fondant',
      category: 'Dessert',
      orders: 134,
      revenue: 2144,
      popularity: 90,
      trend: 'stable'
    },
    {
      id: 5,
      name: 'Heirloom Tomato Burrata Salad',
      category: 'Starter',
      orders: 87,
      revenue: 1566,
      popularity: 85,
      trend: 'down'
    },
    {
      id: 6,
      name: 'Premium Wine Pairing',
      category: 'Beverage',
      orders: 76,
      revenue: 2280,
      popularity: 82,
      trend: 'up'
    }
  ];

  // Mock customer analytics
  const customerAnalytics = {
    newCustomers: 45,
    returningCustomers: 273,
    retentionRate: 85.7,
    avgCustomerValue: 104.25
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { id: 'orders', name: 'Orders', icon: Package, path: '/orders' },
    { id: 'menu', name: 'Menu Management', icon: Menu, path: '/menu_management' },
    { id: 'system', name: 'System Control', icon: Clock, path: '/system_control' },
    { id: 'customers', name: 'Customers', icon: Users, path: '/customers' },
    { id: 'reports', name: 'Reports', icon: DollarSign, path: '/reports' }
  ];


  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendUp size={16} className="text-green-500" />;
      case 'down': return <TrendingDown size={16} className="text-red-500" />;
      default: return <BarChart3 size={16} className="text-gray-500" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportData = (type) => {
    // In a real app, this would generate and download CSV/PDF files
    console.log(`Exporting ${type} data for date range: ${dateRange}`);
    alert(`${type.toUpperCase()} data exported successfully!`);
  };

  const RevenueChart = ({ data }) => (
    <div className="bg-white p-6 rounded-2xl border border-stone-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-gray-600">Revenue</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 flex items-end justify-between gap-1">
        {data.dailyRevenue.map((day, index) => {
          const maxRevenue = Math.max(...data.dailyRevenue.map(d => d.revenue));
          const height = (day.revenue / maxRevenue) * 100;
          
          return (
            <div key={day.date} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg transition-all duration-300 hover:from-amber-600 hover:to-amber-500"
                style={{ height: `${height}%` }}
              ></div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(day.date).getDate()}
              </div>
              <div className="text-xs font-medium text-gray-900 mt-1">
                €{day.revenue}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const CategoryBreakdown = ({ data }) => (
    <div className="bg-white p-6 rounded-2xl border border-stone-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Category</h3>
      
      <div className="space-y-4">
        {data.byCategory.map((category, index) => {
          const colors = ['bg-amber-500', 'bg-amber-400', 'bg-amber-300', 'bg-amber-200', 'bg-amber-100'];
          return (
            <div key={category.category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-900">{category.category}</span>
                <span className="text-gray-600">€{category.revenue.toLocaleString()} ({category.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${colors[index]}`}
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const PopularItemsList = ({ items }) => (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Most Popular Items</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Utensils className="text-amber-600" size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTrendColor(item.trend)}`}>
                {getTrendIcon(item.trend)}
                {item.trend === 'up' ? 'Growing' : item.trend === 'down' ? 'Declining' : 'Stable'}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Orders</p>
                <p className="font-semibold text-gray-900">{item.orders}</p>
              </div>
              <div>
                <p className="text-gray-600">Revenue</p>
                <p className="font-semibold text-gray-900">€{item.revenue}</p>
              </div>
              <div>
                <p className="text-gray-600">Popularity</p>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${item.popularity}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-900 text-xs">{item.popularity}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
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
            </div>            <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
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
              <h1 className="text-2xl font-bold text-gray-900 font-elegant">Analytics & Reports</h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
              
              {dateRange === 'custom' && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                </div>
              )}
              
              <button
                onClick={() => exportData('full')}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2 text-sm"
              >
                <Download size={16} />
                Export Data
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Revenue */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                <TrendUp size={20} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">€{revenueData.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-green-600 font-medium">+{revenueData.growthRate}%</span>
                <span className="text-gray-600">vs previous period</span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
                <Package size={20} className="text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{revenueData.totalOrders}</p>
              <p className="text-sm text-gray-600">Average: €{revenueData.averageOrderValue}/order</p>
            </div>

            {/* Customer Metrics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Customer Retention</h3>
                <Users size={20} className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{customerAnalytics.retentionRate}%</p>
              <p className="text-sm text-gray-600">{customerAnalytics.returningCustomers} returning customers</p>
            </div>

            {/* Average Value */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Avg. Customer Value</h3>
                <DollarSign size={20} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">€{customerAnalytics.avgCustomerValue}</p>
              <p className="text-sm text-gray-600">Lifetime value per customer</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 backdrop-blur-sm mb-6">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab('revenue')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'revenue'
                    ? 'text-amber-700 border-b-2 border-amber-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Revenue Reports
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'popular'
                    ? 'text-amber-700 border-b-2 border-amber-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Popular Items
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'export'
                    ? 'text-amber-700 border-b-2 border-amber-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Export Data
              </button>
            </div>

            <div className="p-6">
              {/* Revenue Reports Tab */}
              {activeTab === 'revenue' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RevenueChart data={revenueData} />
                    <CategoryBreakdown data={revenueData} />
                  </div>

                  {/* Additional Revenue Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                      <h4 className="font-semibold text-amber-900 mb-2">Revenue by Menu Tier</h4>
                      <div className="space-y-3">
                        {revenueData.byTier.map((tier) => (
                          <div key={tier.tier} className="flex justify-between items-center">
                            <span className="text-amber-800 font-medium">{tier.tier}</span>
                            <div className="text-right">
                              <p className="font-bold text-amber-900">€{tier.revenue.toLocaleString()}</p>
                              <p className="text-sm text-amber-700">{tier.orders} orders</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">Best Performing Days</h4>
                      <div className="space-y-2">
                        {revenueData.dailyRevenue
                          .sort((a, b) => b.revenue - a.revenue)
                          .slice(0, 3)
                          .map((day, index) => (
                            <div key={day.date} className="flex justify-between items-center">
                              <span className="text-green-800">
                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                              </span>
                              <span className="font-bold text-green-900">€{day.revenue}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Order Analysis</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-800">Peak Hours</span>
                          <span className="font-bold text-blue-900">7:00-9:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">Avg. Prep Time</span>
                          <span className="font-bold text-blue-900">22 min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">Completion Rate</span>
                          <span className="font-bold text-blue-900">98.2%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Popular Items Tab */}
              {activeTab === 'popular' && (
                <div className="space-y-6">
                  <PopularItemsList items={popularItemsData} />

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-stone-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
                      <div className="space-y-4">
                        {revenueData.byCategory.map((category) => (
                          <div key={category.category} className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{category.category}</span>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">€{category.revenue.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{category.percentage}% of total</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-stone-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">New Customers</span>
                          <span className="font-bold text-gray-900">{customerAnalytics.newCustomers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Returning Rate</span>
                          <span className="font-bold text-green-600">{customerAnalytics.retentionRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Avg. Orders per Customer</span>
                          <span className="font-bold text-gray-900">4.2</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Repeat Order Rate</span>
                          <span className="font-bold text-green-600">72%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Data Tab */}
              {activeTab === 'export' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Revenue Export */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="text-amber-600" size={24} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Revenue Reports</h3>
                      <p className="text-sm text-gray-600 mb-4">Export detailed revenue and sales data</p>
                      <button
                        onClick={() => exportData('revenue')}
                        className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Export CSV
                      </button>
                    </div>

                    {/* Orders Export */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="text-blue-600" size={24} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Order History</h3>
                      <p className="text-sm text-gray-600 mb-4">Complete order records and details</p>
                      <button
                        onClick={() => exportData('orders')}
                        className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Export CSV
                      </button>
                    </div>

                    {/* Customer Export */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="text-green-600" size={24} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Customer Data</h3>
                      <p className="text-sm text-gray-600 mb-4">Customer profiles and order history</p>
                      <button
                        onClick={() => exportData('customers')}
                        className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Export CSV
                      </button>
                    </div>

                    {/* Menu Performance */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Utensils className="text-purple-600" size={24} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Menu Performance</h3>
                      <p className="text-sm text-gray-600 mb-4">Item popularity and sales metrics</p>
                      <button
                        onClick={() => exportData('menu')}
                        className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Export CSV
                      </button>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="text-red-600" size={24} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Financial Summary</h3>
                      <p className="text-sm text-gray-600 mb-4">PDF report with charts and insights</p>
                      <button
                        onClick={() => exportData('financial')}
                        className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <FileText size={16} />
                        Export PDF
                      </button>
                    </div>

                    {/* Full Data Export */}
                    <div className="bg-white border border-amber-200 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Download className="text-amber-600" size={24} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Complete Data</h3>
                      <p className="text-sm text-gray-600 mb-4">All data in a single archive</p>
                      <button
                        onClick={() => exportData('full')}
                        className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Export All
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
