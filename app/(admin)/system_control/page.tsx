"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, Package, Calendar, DollarSign, 
  Users, TrendingUp, Clock, Plus, Edit, Archive, Trash2,
  Search, Filter, Save, XCircle, CheckCircle, AlertCircle,
  Utensils, Wine, Coffee, Dessert, Pause, Play, Calendar as CalendarIcon,
  Users as UsersIcon, Settings, AlertTriangle, Check
} from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function SystemControl() {
  const router = useRouter();    
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('system');
  const [activeTab, setActiveTab] = useState('ordering');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // System state
  const [systemStatus, setSystemStatus] = useState({
    orderingPaused: false,
    pauseReason: '',
    pauseUntil: '',
    capacityLimit: 50,
    currentReservations: 35
  });

  const handleNavigation = (path) => {
    router.push(path);
  };

  // Get current active section from pathname (optional, for styling)
  const getActiveSection = () => {
    // This would depend on your current route structure
    // You might need to use usePathname() from 'next/navigation'
    const pathname = window.location.pathname;
    return navigation.find(item => pathname.includes(item.id))?.id || 'dashboard';
  };

  // Closed dates
  const [closedDates, setClosedDates] = useState([
    { id: 1, date: '2024-12-25', reason: 'Christmas Day', recurring: true },
    { id: 2, date: '2024-12-31', reason: 'New Years Eve', recurring: true },
    { id: 3, date: '2024-11-15', reason: 'Private Event', recurring: false }
  ]);

  // Capacity settings
  const [capacitySettings, setCapacitySettings] = useState({
    dailyLimit: 100,
    perHourLimit: 25,
    weekendMultiplier: 1.5,
    enableAutoPause: true
  });

  const [newClosedDate, setNewClosedDate] = useState({
    date: '',
    reason: '',
    recurring: false
  });

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { id: 'orders', name: 'Orders', icon: Package, path: '/orders' },
    { id: 'menu', name: 'Menu Management', icon: Menu, path: '/menu_management' },
    { id: 'system', name: 'System Control', icon: Clock, path: '/system_control' },
    { id: 'customers', name: 'Customers', icon: Users, path: '/customers' },
    { id: 'reports', name: 'Reports', icon: DollarSign, path: '/reports' }
  ];

  const toggleOrdering = () => {
    if (systemStatus.orderingPaused) {
      // Resume ordering
      setSystemStatus(prev => ({
        ...prev,
        orderingPaused: false,
        pauseReason: '',
        pauseUntil: ''
      }));
    } else {
      // Pause ordering
      setSystemStatus(prev => ({
        ...prev,
        orderingPaused: true,
        pauseUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Tomorrow
      }));
    }
  };

  const addClosedDate = () => {
    if (newClosedDate.date && newClosedDate.reason) {
      const newDate = {
        id: Math.max(...closedDates.map(d => d.id)) + 1,
        ...newClosedDate
      };
      setClosedDates([...closedDates, newDate]);
      setNewClosedDate({ date: '', reason: '', recurring: false });
    }
  };

  const removeClosedDate = (id) => {
    setClosedDates(closedDates.filter(date => date.id !== id));
  };

  const updateCapacitySettings = (updates) => {
    setCapacitySettings(prev => ({ ...prev, ...updates }));
  };

  const isDateInPast = (dateString) => {
    return new Date(dateString) < new Date().setHours(0, 0, 0, 0);
  };

  const upcomingClosedDates = closedDates.filter(date => !isDateInPast(date.date));
  const pastClosedDates = closedDates.filter(date => isDateInPast(date.date));

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
              <h1 className="text-2xl font-bold text-gray-900 font-elegant">System Control</h1>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-elegant">System Settings</h2>
            <p className="text-gray-600">Manage ordering, business hours, and capacity limits</p>
          </div>

          {/* Control Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 backdrop-blur-sm mb-6">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab('ordering')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'ordering'
                    ? 'text-amber-700 border-b-2 border-amber-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Ordering Control
              </button>
              <button
                onClick={() => setActiveTab('dates')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'dates'
                    ? 'text-amber-700 border-b-2 border-amber-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Closed Dates
              </button>
              <button
                onClick={() => setActiveTab('capacity')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'capacity'
                    ? 'text-amber-700 border-b-2 border-amber-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Capacity Limits
              </button>
            </div>

            <div className="p-6">
              {/* Ordering Control Tab */}
              {activeTab === 'ordering' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Ordering System Status
                      </h3>
                      <p className={`text-sm ${
                        systemStatus.orderingPaused ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {systemStatus.orderingPaused ? 'Ordering is currently PAUSED' : 'Ordering is ACTIVE'}
                      </p>
                      {systemStatus.orderingPaused && systemStatus.pauseReason && (
                        <p className="text-sm text-gray-600 mt-1">Reason: {systemStatus.pauseReason}</p>
                      )}
                    </div>
                    <button
                      onClick={toggleOrdering}
                      className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                        systemStatus.orderingPaused
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {systemStatus.orderingPaused ? <Play size={20} /> : <Pause size={20} />}
                      {systemStatus.orderingPaused ? 'Resume Ordering' : 'Pause Ordering'}
                    </button>
                  </div>

                  {systemStatus.orderingPaused && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Pause Settings</h4>
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Pause (Optional)
                          </label>
                          <input
                            type="text"
                            value={systemStatus.pauseReason}
                            onChange={(e) => setSystemStatus(prev => ({ ...prev, pauseReason: e.target.value }))}
                            placeholder="E.g., Kitchen maintenance, Staff shortage..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Resume Ordering On
                          </label>
                          <input
                            type="date"
                            value={systemStatus.pauseUntil}
                            onChange={(e) => setSystemStatus(prev => ({ ...prev, pauseUntil: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">Important Notice</h4>
                        <p className="text-amber-800 text-sm">
                          When ordering is paused, customers will see a maintenance message and won't be able to place new orders.
                          Existing orders will remain active and can be fulfilled.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Closed Dates Tab */}
              {activeTab === 'dates' && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Closed Date</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={newClosedDate.date}
                          onChange={(e) => setNewClosedDate(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                        <input
                          type="text"
                          value={newClosedDate.reason}
                          onChange={(e) => setNewClosedDate(prev => ({ ...prev, reason: e.target.value }))}
                          placeholder="E.g., Holiday, Private Event..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newClosedDate.recurring}
                          onChange={(e) => setNewClosedDate(prev => ({ ...prev, recurring: e.target.checked }))}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-700">Recurring annually</span>
                      </label>
                      <button
                        onClick={addClosedDate}
                        disabled={!newClosedDate.date || !newClosedDate.reason}
                        className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Add Closed Date
                      </button>
                    </div>
                  </div>

                  {/* Upcoming Closed Dates */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Closed Dates</h3>
                    <div className="space-y-3">
                      {upcomingClosedDates.map((date) => (
                        <div key={date.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-4">
                            <CalendarIcon className="text-gray-400" size={20} />
                            <div>
                              <p className="font-medium text-gray-900">
                                {new Date(date.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <p className="text-sm text-gray-600">{date.reason}</p>
                            </div>
                            {date.recurring && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Recurring
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeClosedDate(date.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      {upcomingClosedDates.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <CalendarIcon size={32} className="mx-auto mb-2 opacity-50" />
                          <p>No upcoming closed dates</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Past Closed Dates */}
                  {pastClosedDates.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Past Closed Dates</h3>
                      <div className="space-y-3">
                        {pastClosedDates.map((date) => (
                          <div key={date.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
                            <div className="flex items-center gap-4">
                              <CalendarIcon className="text-gray-400" size={20} />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {new Date(date.date).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600">{date.reason}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeClosedDate(date.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Capacity Limits Tab */}
              {activeTab === 'capacity' && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Capacity Settings</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Daily Order Limit
                        </label>
                        <input
                          type="number"
                          value={capacitySettings.dailyLimit}
                          onChange={(e) => updateCapacitySettings({ dailyLimit: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                        />
                        <p className="text-sm text-gray-600 mt-1">Maximum orders per day</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Per Hour Limit
                        </label>
                        <input
                          type="number"
                          value={capacitySettings.perHourLimit}
                          onChange={(e) => updateCapacitySettings({ perHourLimit: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                        />
                        <p className="text-sm text-gray-600 mt-1">Maximum orders per hour</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weekend Capacity Multiplier
                      </label>
                      <select
                        value={capacitySettings.weekendMultiplier}
                        onChange={(e) => updateCapacitySettings({ weekendMultiplier: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                      >
                        <option value="1">Same as weekdays</option>
                        <option value="1.25">25% increase</option>
                        <option value="1.5">50% increase</option>
                        <option value="2">100% increase (double)</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={capacitySettings.enableAutoPause}
                        onChange={(e) => updateCapacitySettings({ enableAutoPause: e.target.checked })}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Auto-pause when capacity reached</span>
                        <p className="text-sm text-gray-600">
                          Automatically pause ordering when daily limit is reached
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Capacity Overview */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <UsersIcon className="text-amber-600" size={24} />
                        <h4 className="font-semibold text-amber-900">Current Capacity</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-amber-800">Today's Usage</span>
                            <span className="font-medium text-amber-900">
                              {systemStatus.currentReservations} / {capacitySettings.dailyLimit}
                            </span>
                          </div>
                          <div className="w-full bg-amber-200 rounded-full h-2">
                            <div 
                              className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${(systemStatus.currentReservations / capacitySettings.dailyLimit) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-sm text-amber-700">
                          {capacitySettings.dailyLimit - systemStatus.currentReservations} orders remaining today
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Check className="text-green-600" size={24} />
                        <h4 className="font-semibold text-green-900">Weekend Capacity</h4>
                      </div>
                      <p className="text-lg font-bold text-green-900 mb-2">
                        {Math.floor(capacitySettings.dailyLimit * capacitySettings.weekendMultiplier)} orders
                      </p>
                      <p className="text-sm text-green-700">
                        {capacitySettings.weekendMultiplier === 1 ? 'Same as weekdays' : 
                         `${((capacitySettings.weekendMultiplier - 1) * 100)}% increase on weekends`}
                      </p>
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