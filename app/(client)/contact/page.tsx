"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { commonTranslations } from '@/lib/translations/common';
import { contactTranslations } from '@/lib/translations/contact';

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/lacannellecatering/';

const normalizeInstagramPermalink = (url: string) => {
  const trimmed = (url || '').trim();
  if (!trimmed) return '';
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
};

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t: rawT, language, toggleLanguage } = useTranslation('contact');

  // Cast to the correct type
  const t = rawT as typeof contactTranslations.EN;
  const commonNav = commonTranslations[language].nav;
  const commonFooter = commonTranslations[language].footer;
  const commonA11y = commonTranslations[language].accessibility;
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  const instagramPostUrls = (process.env.NEXT_PUBLIC_INSTAGRAM_POST_URLS || '')
    .split(',')
    .map((value) => normalizeInstagramPermalink(value))
    .filter(Boolean);

  const instagramPosts: Array<{
    id: string;
    permalink: string;
    caption?: string;
    media_url?: string;
    timestamp?: number;
  }> = instagramPostUrls.map((permalink, index) => ({
    id: `ig-${index}`,
    permalink,
    caption: '',
    media_url: '',
    timestamp: undefined
  }));
  const hasInstagramPosts = instagramPosts.length > 0;
  const loadingInstagram = false;
  const firstInstagramPost = instagramPosts[0];

  const isActiveHref = (href: string) => {
    if (href === '/home') return pathname === '/' || pathname === '/home';
    return pathname === href;
  };

  const desktopLinkClass = (href: string) =>
    `${isActiveHref(href) ? 'text-amber-700 font-semibold' : 'text-gray-900 hover:text-amber-700 font-medium'} transition-all duration-300 transform hover:scale-105`;

  const mobileLinkClass = (href: string) =>
    `${isActiveHref(href) ? 'text-amber-700 font-semibold' : 'text-gray-900 hover:text-amber-700 font-medium'} transition-all duration-300 transform hover:translate-x-2`;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guests: '',
    message: ''
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const updateFormValue = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    updateFormValue(e.target.name, e.target.value);
  };

  const toDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateInputValue = (value: string) => {
    if (!value) return null;
    const [yearStr, monthStr, dayStr] = value.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number((dayStr || '').slice(0, 2));
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const isDateInPast = (value: string) => {
    const parsed = parseDateInputValue(value);
    if (!parsed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return parsed.getTime() < today.getTime();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValue = formData.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      alert(t.alerts.invalidEmail);
      return;
    }
    const phoneValue = formData.phone.trim();
    if (phoneValue && !/^\+?[0-9\s-]{7,15}$/.test(phoneValue)) {
      alert(t.alerts.invalidPhone);
      return;
    }
    if (formData.eventDate && isDateInPast(formData.eventDate)) {
      alert(t.contactForm.invalidEventDate);
      return;
    }

    const response = await apiClient.post('/contact', {
      ...formData,
      language
    });
    if (response.error) {
      alert(t.alerts.failedToSend);
      return;
    }
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      guests: '',
      message: ''
    });
    alert(t.success.message);
  };

  const todayDateValue = toDateInputValue(new Date());
  const eventDateError = formData.eventDate && isDateInPast(formData.eventDate)
    ? t.contactForm.invalidEventDate
    : '';

  const router = useRouter();

  const handleOrderClick = () => {
    router.push('/order');
  };

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp?: number) => {
    if (!timestamp) return 'Recently';
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return 'Recently';
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
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
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out;
        }
        
        .animate-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animate-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animate-delay-300 {
          animation-delay: 0.3s;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .font-elegant {
          font-family: 'Playfair Display', serif;
        }

        .contact-date-input {
          color-scheme: light;
          background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%);
        }

        .contact-date-input::-webkit-calendar-picker-indicator {
          filter: invert(55%) sepia(47%) saturate(430%) hue-rotate(2deg) brightness(96%) contrast(90%);
          opacity: 0.85;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        .instagram-post {
          position: relative;
        }
        
        .instagram-post::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(0deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 0.5rem;
        }
        
        .instagram-post:hover::after {
          opacity: 1;
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold text-gray-900 font-elegant italic">
              <img
                src="/images/logo-removebg-preview.png"
                alt="La Cannelle"
                className="h-16 sm:h-[72px] md:h-[80px] w-[180px] sm:w-[220px] md:w-[260px] lg:w-[320px] object-cover object-center"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/home" className={desktopLinkClass('/home')}>{commonNav.home}</a>
              <a href="/services" className={desktopLinkClass('/services')}>{commonNav.services}</a>
              <a href="/menus" className={desktopLinkClass('/menus')}>{commonNav.menus}</a>
              <a href="/contact" className={desktopLinkClass('/contact')}>{commonNav.contact}</a>
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
                <a href="/home" className={mobileLinkClass('/home')}>{commonNav.home}</a>
                <a href="/about" className={mobileLinkClass('/about')}>{commonNav.about}</a>
                <a href="/services" className={mobileLinkClass('/services')}>{commonNav.services}</a>
                <a href="/menus" className={mobileLinkClass('/menus')}>{commonNav.menus}</a>
                <a href="/contact" className={mobileLinkClass('/contact')}>{commonNav.contact}</a>
                <button 
                  onClick={toggleLanguage}
                  aria-label={language === 'EN' ? commonA11y.switchToGerman : commonA11y.switchToEnglish}
                  className="px-4 py-2 text-sm border border-amber-300 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 w-full font-medium transition-all duration-300 flex items-center justify-center"
                >
                  {language === 'EN' ? (
                    <img
                      src="/images/language/Flag_of_United_Kingdom-4096x2048.png"
                      alt="English flag"
                      className="h-5 w-auto"
                    />
                  ) : (
                    <img
                      src="/images/language/Flag_of_Germany-4096x2453.png"
                      alt="German flag"
                      className="h-5 w-auto"
                    />
                  )}
                </button>
                <button className="px-6 py-2 text-sm bg-amber-700 text-white rounded-lg hover:bg-amber-800 font-medium transition-all duration-300 transform hover:scale-105">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className={`bg-white rounded-2xl shadow-lg p-8 border border-stone-100 ${
                isVisible ? 'animate-fade-in-left' : 'opacity-0'
              }`}>
                <div className="flex items-center gap-3 mb-8">
                  <MessageCircle className="text-amber-700" size={32} />
                  <h2 className="text-3xl font-bold text-gray-900 font-elegant">
                    {t.contactForm.title}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {t.contactForm.name} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 text-gray-900 bg-white placeholder-gray-500"
                        placeholder={t.placeholders.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {t.contactForm.email} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 text-gray-900 bg-white placeholder-gray-500"
                        placeholder={t.placeholders.email}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {t.contactForm.phone}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^0-9+\s-]/g, '');
                          updateFormValue('phone', sanitized);
                        }}
                        inputMode="tel"
                        pattern="^\\+?[0-9\\s-]{7,15}$"
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 text-gray-900 bg-white placeholder-gray-500"
                        placeholder={t.placeholders.phone}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {t.contactForm.eventType} *
                      </label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 text-gray-900 bg-white"
                      >
                        <option value="" className="text-gray-500">{t.contactForm.eventTypePlaceholder}</option>
                        {t.contactForm.eventTypes.map((type, index) => (
                          <option key={index} value={type} className="text-gray-900">{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {t.contactForm.eventDate}
                      </label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        min={todayDateValue}
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 text-gray-900 bg-amber-50/60 contact-date-input"
                      />
                      {eventDateError && (
                        <p className="mt-2 text-sm text-red-600">{eventDateError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {t.contactForm.guests}
                      </label>
                      <input
                        type="text"
                        name="guests"
                        value={formData.guests}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[^0-9]/g, '');
                          updateFormValue('guests', sanitized);
                        }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 text-gray-900 bg-white placeholder-gray-500"
                        placeholder={t.placeholders.guests}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {t.contactForm.message} *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 resize-none text-gray-900 bg-white placeholder-gray-500"
                      placeholder={t.placeholders.message}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-700 text-white py-4 px-6 rounded-lg font-semibold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center gap-2 group"
                  >
                    <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                    {t.contactForm.button}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information & Quick Order */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className={`bg-stone-50 rounded-2xl p-6 border border-stone-200 ${
                isVisible ? 'animate-fade-in-right' : 'opacity-0'
              }`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 font-elegant">
                  {t.contactInfo.title}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-white rounded-lg hover:bg-amber-50 transition-colors group">
                    <Phone className="text-amber-700 group-hover:scale-110 transition-transform" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">{t.contactInfo.phone}</p>
                      <p className="text-sm text-gray-600">{t.contactInfo.mobile}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-white rounded-lg hover:bg-amber-50 transition-colors group">
                    <Mail className="text-amber-700 group-hover:scale-110 transition-transform" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">{t.contactInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 bg-white rounded-lg hover:bg-amber-50 transition-colors group">
                    <MapPin className="text-amber-700 group-hover:scale-110 transition-transform mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">{t.contactInfo.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 bg-white rounded-lg hover:bg-amber-50 transition-colors group">
                    <Clock className="text-amber-700 group-hover:scale-110 transition-transform mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">{t.contactInfo.hours.title}</p>
                      <p className="text-sm text-gray-600">{t.contactInfo.hours.weekdays}</p>
                      <p className="text-sm text-gray-600">{t.contactInfo.hours.saturday}</p>
                      <p className="text-sm text-gray-600">{t.contactInfo.hours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Order CTA */}
              <div className={`bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-6 text-white ${
                isVisible ? 'animate-scale-in' : 'opacity-0'
              }`} style={{ animationDelay: '400ms' }}>
                <h3 className="text-2xl font-bold mb-3 font-elegant">
                  {t.quickOrder.title}
                </h3>
                <p className="text-amber-100 mb-6 font-light">
                  {t.quickOrder.subtitle}
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/order')}
                  className="w-full bg-white text-amber-700 py-3 px-6 rounded-lg font-semibold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center gap-2 group"
                >
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  {t.quickOrder.button}
                </button>
              </div>

              {/* Instagram Section */}
              <div className={`bg-white rounded-2xl p-6 border border-stone-200 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`} style={{ animationDelay: '600ms' }}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 font-elegant flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full" style={{ 
                    background: 'linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' 
                  }}>
                    <svg className="h-6 w-6 p-1" fill="white" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                    </svg>
                  </div>
                  {t.social.title}
                </h3>
                
                <div className="space-y-6">
                  {/* Instagram Profile Preview */}
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-amber-50 rounded-xl border border-pink-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-amber-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">LC</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">@lacannellecatering</h4>
                        <p className="text-sm text-gray-600">Premium Catering & Events</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-bold text-gray-900">125</p>
                        <p className="text-gray-600">Posts</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-900">2.4K</p>
                        <p className="text-gray-600">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-900">312</p>
                        <p className="text-gray-600">Following</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Posts Grid */}
                  {loadingInstagram ? (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Loading Instagram posts...</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
                        ))}
                      </div>
                    </div>
                  ) : hasInstagramPosts && instagramPosts.length > 0 ? (
                    <>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Recent Posts</h4>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {instagramPosts.slice(0, 2).map((post) => (
                            <div
                              key={post.id}
                              className="rounded-lg overflow-hidden border border-stone-200 bg-white"
                            >
                              <iframe
                                title={`Instagram post ${post.permalink}`}
                                src={`${post.permalink}embed`}
                                className="w-full"
                                style={{ height: 540 }}
                                loading="lazy"
                                allow="encrypted-media; picture-in-picture"
                              />
                              <div className="px-4 py-3 border-t border-stone-200 text-sm">
                                <a
                                  href={post.permalink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-4"
                                >
                                  View on Instagram -&gt;
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Latest Post Preview */}
                      {firstInstagramPost && (
                        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                          <div className="rounded-lg overflow-hidden border border-stone-200 bg-white">
                            <iframe
                              title={`Instagram post ${firstInstagramPost.permalink}`}
                              src={`${firstInstagramPost.permalink}embed`}
                              className="w-full"
                              style={{ height: 540 }}
                              loading="lazy"
                              allow="encrypted-media; picture-in-picture"
                            />
                          </div>

                          <div className="text-right mt-3">
                            <a
                              href={firstInstagramPost.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-700 hover:text-amber-800 font-medium text-sm"
                            >
                              View on Instagram →
                            </a>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-amber-500 flex items-center justify-center mx-auto mb-4">
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                        </svg>
                      </div>
                      <p className="text-gray-600 mb-4">Follow us on Instagram to see our latest creations!</p>
                    </div>
                  )}

                  {/* Follow Button */}
                  <a 
                    href={INSTAGRAM_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-white py-3 px-4 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' }}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.75 6a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 17.75 6z" />
                    </svg>
                    {t.social.instagram}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section - UPDATED to handle ad blockers better */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`} style={{ animationDelay: '800ms' }}>
            <div className="p-6 border-b border-stone-200">
              <h3 className="text-2xl font-bold text-gray-900 font-elegant flex items-center gap-3">
                <MapPin className="text-amber-700" size={24} />
                {t.location.title}
              </h3>
            </div>
            <div className="h-96 bg-gradient-to-br from-amber-100 to-stone-200">
              {/* Always show map link, hide iframe if blocked */}
              <div className="h-full w-full relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2498.8334217314505!2d6.776975276284795!3d51.22214423150265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8cb10fedecbc9%3A0xa3a5e988315ddb33!2sLa%20Cannelle!5e0!3m2!1sfr!2stn!4v1763137870611!5m2!1sfr!2stn" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 z-10"
                  title="Google Maps location"
                  onError={() => {
                    // If iframe fails, show the link instead
                    const iframe = document.querySelector('iframe[title="Google Maps location"]') as HTMLElement;
                    if (iframe) {
                      iframe.style.display = 'none';
                    }
                    const link = document.querySelector('.map-link-fallback') as HTMLElement;
                    if (link) {
                      link.style.display = 'flex';
                    }
                  }}
                ></iframe>
                
                {/* Fallback that shows if iframe is blocked */}
                <div className="map-link-fallback hidden absolute inset-0 bg-amber-100 z-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin size={48} className="text-amber-700 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-900 mb-2">{t.contactInfo.address}</p>
                    <p className="text-gray-600 mb-4">View location on Google Maps:</p>
                    <a 
                      href="https://maps.google.com/?q=Borsigstraße+2,+41541+Dormagen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors"
                    >
                      {t.location.openMap}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <h3 className="text-2xl font-bold mb-4 font-elegant italic">La Cannelle</h3>
              <p className="text-gray-400 italic">{commonFooter.brandTagline}</p>
            </div>
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{commonFooter.quickLinks}</h4>
              <div className="flex flex-col gap-2">
                <a href="/" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{commonNav.home}</a>
                <a href="/about" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{commonNav.about}</a>
                <a href="/services" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{commonNav.services}</a>
                <a href="/menus" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{commonNav.menus}</a>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{commonFooter.contact}</h4>
              <div className="flex flex-col gap-3 text-gray-400">
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Phone size={18} />
                  <span>{t.contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Mail size={18} />
                  <span>{t.contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <MapPin size={18} />
                  <span>{t.contactInfo.address}</span>
                </div>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{commonFooter.followUs}</h4>
              <div className="flex flex-col gap-2 text-gray-400">
                <a href="https://www.instagram.com/lacannellecatering/" className="hover:text-white transition-colors duration-300 inline-flex items-center gap-2">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.75 6a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 17.75 6z" />
                  </svg>
                  {commonFooter.social.instagram}
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>{commonFooter.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
