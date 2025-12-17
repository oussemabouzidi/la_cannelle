"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, User, Lock, Eye, EyeOff, Calendar, Heart, CreditCard, Settings, LogOut, Bell, Shield, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { connectTranslations } from '@/lib/translations/connect';

export default function AccountPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const translation = useTranslation('connect');
  const t = translation.t as typeof connectTranslations.EN;
  const { language, toggleLanguage } = translation;
  const basePreferences = {
    newsletter: false,
    smsNotifications: false,
    eventReminders: false,
  };
  const normalizePreferences = (prefs?: string[] | Record<string, boolean>) => {
    if (!prefs) return { ...basePreferences };
    if (Array.isArray(prefs)) {
      return prefs.reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        { ...basePreferences }
      );
    }
    return { ...basePreferences, ...prefs };
  };
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    location: '',
    preferences: normalizePreferences(),
    allergies: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Load user profile if authenticated
    const loadProfile = async () => {
      if (authApi.isAuthenticated()) {
        try {
          const userProfile = await authApi.getProfile();
          if (userProfile) {
            setProfile({
              firstName: userProfile.firstName || '',
              lastName: userProfile.lastName || '',
              email: userProfile.email || '',
              phone: userProfile.phone || '',
              company: userProfile.company || '',
              position: userProfile.position || '',
              location: userProfile.location || '',
              preferences: normalizePreferences(userProfile.preferences as any),
              allergies: userProfile.allergies || []
            });
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
        }
      }
    };
    loadProfile();
  }, []);

  const router = useRouter();

  const handleOrderClick = () => {
    router.push('/order');
  };

  // Mock data
  const orders = [
    {
      id: 1,
      eventName: 'Corporate Gala Dinner',
      date: '2024-12-15',
      guests: 120,
      status: 'confirmed',
      total: 8450
    },
    {
      id: 2,
      eventName: 'Product Launch Party',
      date: '2024-11-20',
      guests: 80,
      status: 'pending',
      total: 5200
    },
    {
      id: 3,
      eventName: 'Annual Company Celebration',
      date: '2024-10-05',
      guests: 200,
      status: 'completed',
      total: 15200
    }
  ];

  const favorites = [
    {
      id: 1,
      name: 'Truffle-infused Wild Mushroom Risotto',
      category: 'Main Course',
      price: 24
    },
    {
      id: 2,
      name: 'Seared Scallops with Citrus Beurre Blanc',
      category: 'Starter',
      price: 28
    },
    {
      id: 3,
      name: 'Chocolate Fondant with Raspberry Coulis',
      category: 'Dessert',
      price: 16
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      expiry: '12/25',
      default: true
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '8888',
      expiry: '08/24',
      default: false
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await authApi.login({
        email: loginForm.email,
        password: loginForm.password
      });
      if (result) {
        alert('Login successful!');
        // Reload to update UI
        window.location.reload();
      }
    } catch (error: any) {
      alert(error.message || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const result = await authApi.register({
        email: registerForm.email,
        password: registerForm.password,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        phone: registerForm.phone
      });
      if (result) {
        alert('Registration successful!');
        // Switch to login or reload
        window.location.reload();
      }
    } catch (error: any) {
      alert(error.message || 'Registration failed');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        company: profile.company,
        position: profile.position,
        location: profile.location,
        preferences: Object.entries(profile.preferences)
          .filter(([, enabled]) => enabled)
          .map(([key]) => key),
        allergies: profile.allergies
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to update profile');
    }
  };

  const TabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'orders':
        return <OrdersTab />;
      case 'favorites':
        return <FavoritesTab />;
      case 'payments':
        return <PaymentsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <ProfileTab />;
    }
  };

  const ProfileTab = () => (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 font-elegant">
              {t.profile.personal.title}
            </h3>
            <p className="text-gray-600 mt-1">{t.profile.personal.subtitle}</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-300"
          >
            {isEditing ? t.profile.save : t.profile.edit}
          </button>
        </div>

        <form onSubmit={handleProfileUpdate} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.profile.personal.firstName}
            </label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({...profile, firstName: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 disabled:bg-gray-50 text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.profile.personal.lastName}
            </label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile({...profile, lastName: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 disabled:bg-gray-50 text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.profile.personal.email}
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 disabled:bg-gray-50 text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.profile.personal.phone}
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 disabled:bg-gray-50 text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.profile.personal.company}
            </label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile({...profile, company: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 disabled:bg-gray-50 text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.profile.personal.position}
            </label>
            <input
              type="text"
              value={profile.position}
              onChange={(e) => setProfile({...profile, position: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 disabled:bg-gray-50 text-gray-900 bg-white"
            />
          </div>
        </form>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 font-elegant">
          {t.profile.preferences.title}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Communication</h4>
            <div className="space-y-4">
              {Object.entries(profile.preferences).map(([key, value]) => (
                <label key={key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: {...profile.preferences, [key]: e.target.checked}
                    })}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-gray-900">
                    {key === 'newsletter' && t.profile.preferences.newsletter}
                    {key === 'smsNotifications' && t.profile.preferences.sms}
                    {key === 'eventReminders' && t.profile.preferences.reminders}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Dietary & Allergies</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t.profile.preferences.dietary}
                </label>
                <input
                  type="text"
                  placeholder="e.g., Vegetarian, Vegan, Gluten-Free"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t.profile.preferences.allergies}
                </label>
                <input
                  type="text"
                  placeholder="e.g., Nuts, Shellfish, Dairy"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const OrdersTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 font-elegant">
          {t.orders.title}
        </h3>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{order.eventName}</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(order.date).toLocaleDateString()} • {order.guests} guests
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {t.orders.status[order.status]}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-amber-700">${order.total}</span>
                <button className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                  {t.orders.viewDetails}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FavoritesTab = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 font-elegant">
        {t.favorites.title}
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {favorites.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <p className="text-gray-600 text-sm">{item.category}</p>
              </div>
              <button className="text-red-500 hover:text-red-700 transition-colors">
                <Heart size={20} className="fill-current" />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-amber-700">${item.price}</span>
              <button className="text-amber-600 font-semibold hover:text-amber-700 transition-colors text-sm">
                Add to Event
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PaymentsTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 font-elegant">
          {t.payments.title}
        </h3>
        
        <div className="space-y-4 mb-6">
          {paymentMethods.map((card) => (
            <div key={card.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <CreditCard className="text-gray-400" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">
                    {card.type.toUpperCase()} •••• {card.last4}
                  </p>
                  <p className="text-gray-600 text-sm">Expires {card.expiry}</p>
                </div>
                {card.default && (
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-semibold">
                    {t.payments.default}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {!card.default && (
                  <button className="text-amber-600 hover:text-amber-700 transition-colors text-sm">
                    {t.payments.setDefault}
                  </button>
                )}
                <button className="text-red-600 hover:text-red-700 transition-colors text-sm">
                  {t.payments.remove}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors flex items-center justify-center gap-2">
          <CreditCard size={20} />
          {t.payments.addCard}
        </button>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 font-elegant">
          {t.settings.title}
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="text-gray-400" size={20} />
              <span className="font-semibold text-gray-900">{t.settings.security}</span>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="text-gray-400" size={20} />
              <span className="font-semibold text-gray-900">{t.settings.notifications}</span>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Settings className="text-gray-400" size={20} />
              <span className="font-semibold text-gray-900">{t.settings.privacy}</span>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <User className="text-gray-400" size={20} />
              <span className="font-semibold text-gray-900">{t.settings.language}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{language}</span>
              <ChevronRight className="text-gray-400" size={20} />
            </div>
          </div>
          
          <div className="border-t pt-6">
            <button className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
              {t.settings.delete}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
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
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .font-elegant {
          font-family: 'Playfair Display', serif;
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold text-gray-900 font-elegant italic">
              <img src="/images/logo.png" alt="" className="w-50 h-auto" />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/home" className="text-gray-900 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">Home</a>
              <a href="/about" className="text-gray-900 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">About</a>
              <a href="/services" className="text-gray-900 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">{t.nav.services}</a>
              <a href="/menus" className="text-gray-900 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">{t.nav.menus}</a>
              <a href="/contact" className="text-gray-900 hover:text-amber-700 font-semibold transition-all duration-300 transform hover:scale-105">{t.nav.contact}</a>
              <button 
                onClick={toggleLanguage}
                className="px-4 py-2 text-sm border border-amber-300 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-300 transform hover:scale-105 font-medium flex items-center gap-2"
              >
                {language === 'EN' ? (
                  <>
                    <span className="text-lg"><img src="images/language/Flag_of_United_Kingdom-4096x2048.png" width={27} /></span>
                    English
                  </>
                ) : (
                  <>
                    <span className="text-lg"><img src="images/language/Flag_of_Germany-4096x2453.png" width={25} /></span>
                    Deutsch
                  </>
                )}
              </button>
              <button onClick={() => {router.push('/connect')}}  className="px-4 py-2 text-sm border border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 font-medium">
                {t.nav.connect}
              </button>


              <button 
                onClick={handleOrderClick}
                className="px-6 py-2 text-sm bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 font-medium"
              >
                {t.nav.order}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden transition-transform duration-300 hover:scale-110"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in-down">
              <div className="flex flex-col gap-4">
                <a href="/" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">Home</a>
                <a href="/about" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">About</a>
                <a href="/services" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">Services</a>
                <a href="/menus" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">Menus</a>
                <a href="/contact" className="text-gray-900 hover:text-amber-700 font-semibold transition-all duration-300 transform hover:translate-x-2">Contact</a>
                <button 
                  onClick={toggleLanguage}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 w-full text-left font-medium transition-all duration-300"
                >
                  {language}
                </button>
                <button className="px-4 py-2 text-sm border border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 font-medium transition-all duration-300">
                  {t.nav.connect}
                </button>
                <button className="px-6 py-2 text-sm bg-amber-700 text-white rounded-lg hover:bg-amber-800 font-medium transition-all duration-300 transform hover:scale-105" onClick={handleOrderClick}>
                  {t.nav.order}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-stone-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 font-elegant italic">
              {t.hero.title}
            </h1>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-xl text-gray-600 font-light italic max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto gap-1 mb-8 pb-2">
            {['profile', 'orders', 'favorites', 'payments', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-amber-700 text-white shadow-lg'
                    : 'bg-stone-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700'
                }`}
              >
                {t.tabs[tab]}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={`transition-all duration-500 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <TabContent />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <h3 className="text-2xl font-bold mb-4 font-elegant italic">La Cannelle</h3>
              <p className="text-gray-400 italic">Crafting unforgettable culinary experiences since 2010</p>
            </div>
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <a href="/home" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">Home</a>
                <a href="/about" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">About</a>
                <a href="/services" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">Services</a>
                <a href="/menus" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">Menus</a>
                <a href="/contact" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">Contact</a>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">Contact</h4>
              <div className="flex flex-col gap-3 text-gray-400">
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Phone size={18} />
                  <span>02133 978 2992</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Mail size={18} />
                  <span>booking@la-cannelle.com</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <MapPin size={18} />
                  <span>Borsigstraße 2, 41541 Dormagen</span>
                </div>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">Follow Us</h4>
              <div className="flex flex-col gap-2 text-gray-400">
                <a href="https://www.instagram.com/lacannellecatering/" className="hover:text-white transition-colors duration-300">Instagram</a>
                <a href="https://www.tiktok.com/@lacannellecatering" className="hover:text-white transition-colors duration-300">TikTok</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 La Cannelle Catering. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
