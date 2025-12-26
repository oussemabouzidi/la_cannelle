"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { commonTranslations } from '@/lib/translations/common';

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage } = useTranslation('contact');
  const translations = {
    EN: {
      nav: { home: 'Home', about: 'About', services: 'Services', menus: 'Menus', contact: 'Contact', connect: 'Connect', order: 'Order Now' },
      hero: { title: 'Get in Touch', subtitle: "Let's create something extraordinary together" },
      quickOrder: {
        title: 'Quick Order',
        subtitle: 'Need immediate assistance? Place a quick order',
        button: 'Quick Order Now',
      },
      social: {
        title: 'Follow Us',
        instagram: 'Instagram',
        tiktok: 'TikTok',
      },
      location: {
        title: 'Our Location',
        loading: 'Loading Google Maps...',
        openMap: 'Open in Google Maps',
      },
      contactForm: {
        title: 'Send Us a Message',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        eventType: 'Event Type',
        eventTypePlaceholder: 'Select Event Type',
        eventDate: 'Event Date',
        invalidEventDate: 'Please choose today or a future date.',
        guests: 'Number of Guests',
        message: 'Your Message',
        eventTypes: ['Corporate Event', 'Wedding', 'Private Party', 'Conference', 'Product Launch', 'Other'],
        button: 'Send Message',
        submit: 'Send Message',
      },
      contactInfo: {
        title: 'Contact Information',
        phone: '02133 978 2992',
        mobile: '0163 599 7062',
        email: 'booking@la-cannelle.com',
        address: 'Borsigstraße 2, 41541 Dormagen',
        hours: {
          title: 'Business Hours',
          weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
          saturday: 'Saturday: 10:00 AM - 4:00 PM',
          sunday: 'Sunday: Closed',
        },
      },
      success: { message: 'Thank you for reaching out!' },
    },
    DE: {
      nav: { home: 'Startseite', about: 'Über uns', services: 'Dienstleistungen', menus: 'Menüs', contact: 'Kontakt', connect: 'Verbinden', order: 'Jetzt bestellen' },
      hero: { title: 'Kontaktieren Sie uns', subtitle: 'Lassen Sie uns gemeinsam etwas Besonderes schaffen' },
      quickOrder: {
        title: 'Schnellbestellung',
        subtitle: 'Brauchen Sie sofort Hilfe? Geben Sie eine Schnellbestellung auf',
        button: 'Jetzt Schnellbestellen',
      },
      social: {
        title: 'Folgen Sie uns',
        instagram: 'Instagram',
        tiktok: 'TikTok',
      },
      location: {
        title: 'Unser Standort',
        loading: 'Google Maps wird geladen...',
        openMap: 'In Google Maps oeffnen',
      },
      contactForm: {
        title: 'Senden Sie uns eine Nachricht',
        name: 'Vollständiger Name',
        email: 'E-Mail-Adresse',
        phone: 'Telefonnummer',
        eventType: 'Veranstaltungstyp',
        eventTypePlaceholder: 'Veranstaltungstyp waehlen',
        eventDate: 'Veranstaltungsdatum',
        invalidEventDate: 'Bitte waehlen Sie heute oder ein zukuenftiges Datum.',
        guests: 'Anzahl der Gäste',
        message: 'Ihre Nachricht',
        eventTypes: ['Firmenevent', 'Hochzeit', 'Private Feier', 'Konferenz', 'Produktvorstellung', 'Andere'],
        button: 'Nachricht senden',
        submit: 'Nachricht senden',
      },
      contactInfo: {
        title: 'Kontaktinformationen',
        phone: '+49 2133 978 2992',
        mobile: '+49 163 599 7062',
        email: 'booking@la-cannelle.com',
        address: 'Borsigstraße 2, 41541 Dormagen',
        hours: {
          title: 'Geschäftszeiten',
          weekdays: 'Montag - Freitag: 9:00 - 18:00',
          saturday: 'Samstag: 10:00 - 16:00',
          sunday: 'Sonntag: Geschlossen',
        },
      },
      success: { message: 'Danke für Ihre Nachricht!' },
    },
  } as const;
  const t = translations[language] || translations.EN;
  const commonFooter = commonTranslations[language].footer;
  const [isVisible, setIsVisible] = useState(false);
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
      alert(language === 'DE' ? 'Bitte geben Sie eine gueltige E-Mail-Adresse ein.' : 'Please enter a valid email address.');
      return;
    }
    const phoneValue = formData.phone.trim();
    if (phoneValue && !/^\+?[0-9\s-]{7,15}$/.test(phoneValue)) {
      alert(language === 'DE' ? 'Bitte geben Sie eine gültige Telefonnummer ein.' : 'Please enter a valid phone number.');
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
      alert(language === 'DE' ? 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut.' : 'Failed to send. Please try again.');
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

  // Translations moved to lib/translations/contact.ts
  const _removedContent = {
    EN: {
      nav: {
        about: 'About',
        services: 'Services',
        menus: 'Menus',
        contact: 'Contact',
        connect: 'Connect',
        order: 'Order Now'
      },
      hero: {
        title: 'Get In Touch',
        subtitle: "Let's create something extraordinary together"
      },
      contactForm: {
        title: 'Send Us a Message',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        eventType: 'Event Type',
        eventDate: 'Event Date',
        guests: 'Number of Guests',
        message: 'Your Message',
        eventTypes: [
          'Corporate Event',
          'Wedding',
          'Private Party',
          'Conference',
          'Product Launch',
          'Other'
        ],
        button: 'Send Message'
      },
      contactInfo: {
        title: 'Contact Information',
        phone: '02133 978 2992',
        mobile: '0163 599 7062',
        email: 'booking@la-cannelle.com',
        address: 'Borsigstraße 2, 41541 Dormagen',
        hours: {
          title: 'Business Hours',
          weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
          saturday: 'Saturday: 10:00 AM - 4:00 PM',
          sunday: 'Sunday: Closed'
        }
      },
      quickOrder: {
        title: 'Quick Order',
        subtitle: 'Need immediate assistance? Place a quick order',
        button: 'Quick Order Now'
      },
      social: {
        title: 'Follow Us',
        instagram: 'Instagram',
        tiktok: 'TikTok'
      }
    },
    DE: {
      nav: {
        about: 'Über uns',
        services: 'Dienstleistungen',
        menus: 'Menüs',
        contact: 'Kontakt',
        connect: 'Verbinden',
        order: 'Jetzt bestellen'
      },
      hero: {
        title: 'Kontaktieren Sie Uns',
        subtitle: 'Lassen Sie uns gemeinsam etwas Außergewöhnliches schaffen'
      },
      contactForm: {
        title: 'Senden Sie Uns eine Nachricht',
        name: 'Vollständiger Name',
        email: 'E-Mail-Adresse',
        phone: 'Telefonnummer',
        eventType: 'Veranstaltungstyp',
        eventTypePlaceholder: 'Veranstaltungstyp waehlen',
        eventDate: 'Veranstaltungsdatum',
        guests: 'Anzahl der Gäste',
        message: 'Ihre Nachricht',
        eventTypes: [
          'Firmenveranstaltung',
          'Hochzeit',
          'Private Feier',
          'Konferenz',
          'Produkteinführung',
          'Andere'
        ],
        button: 'Nachricht Senden'
      },
      contactInfo: {
        title: 'Kontaktinformationen',
        phone: '02133 978 2992',
        mobile: '0163 599 7062',
        email: 'booking@la-cannelle.com',
        address: 'Borsigstraße 2, 41541 Dormagen',
        hours: {
          title: 'Öffnungszeiten',
          weekdays: 'Montag - Freitag: 9:00 - 18:00 Uhr',
          saturday: 'Samstag: 10:00 - 16:00 Uhr',
          sunday: 'Sonntag: Geschlossen'
        }
      },
      quickOrder: {
        title: 'Schnellbestellung',
        subtitle: 'Brauchen Sie sofortige Hilfe? Geben Sie eine Schnellbestellung auf',
        button: 'Jetzt Schnellbestellung'
      },
      social: {
        title: 'Folgen Sie Uns',
        instagram: 'Instagram',
        tiktok: 'TikTok'
      }
    }
  };

  const router = useRouter();

const handleOrderClick = () => {
  router.push('/order');
};

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
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold text-gray-900 font-elegant italic">
              <img src="/images/logo-removebg-preview.png" alt="" className="w-50 h-auto" />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/home" className="text-gray-900 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">{t.nav.home}</a>
              <a href="/about" className="text-gray-900 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">{t.nav.about}</a>
              <a href="/services" className="text-gray-900 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">{t.nav.services}</a>
              <a href="/menus" className="text-gray-900 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">{t.nav.menus}</a>
              <a href="/contact" className="text-amber-700 font-semibold transition-all duration-300 transform hover:scale-105">{t.nav.contact}</a>
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
                <a href="/" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">{t.nav.home}</a>
                <a href="/about" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">{t.nav.about}</a>
                <a href="/services" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">{t.nav.services}</a>
                <a href="/menus" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">{t.nav.menus}</a>
                <a href="/contact" className="text-amber-700 font-semibold transition-all duration-300 transform hover:translate-x-2">{t.nav.contact}</a>
                <button 
                  onClick={toggleLanguage}
                  aria-label={language === 'EN' ? 'Switch to German' : 'Switch to English'}
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
                        placeholder="John Smith"
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
                        placeholder="john@example.com"
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
                        placeholder="+49 123 456 789"
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
                        placeholder="50"
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
                      placeholder="Tell us about your event and any special requirements..."
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

              {/* Social Media */}
              <div className={`bg-white rounded-2xl p-6 border border-stone-200 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`} style={{ animationDelay: '600ms' }}>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-elegant">
                  {t.social.title}
                </h3>
                <div className="flex gap-4">
                  <a 
                    href="https://www.instagram.com/lacannellecatering/" 
                    className="flex-1 text-white py-3 px-4 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2"
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

      {/* Google Map Section */}
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
<div className="h-96 bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center relative">
  {/* Fallback content that shows when iframe is loading or if there's an error */}
  <div className="absolute inset-0 flex items-center justify-center bg-amber-100 z-10 iframe-fallback">
    <div className="text-center">
      <MapPin size={48} className="text-amber-700 mx-auto mb-4" />
      <p className="text-xl font-semibold text-gray-900 mb-2">{t.contactInfo.address}</p>
      <p className="text-gray-600">{t.location.loading}</p>
      <button className="mt-4 bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors">
        {t.location.openMap}
      </button>
    </div>
  </div>
  
  {/* Google Maps iframe with correct JSX attributes */}
  <iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2498.8334217314505!2d6.776975276284795!3d51.22214423150265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8cb10fedecbc9%3A0xa3a5e988315ddb33!2sLa%20Cannelle!5e0!3m2!1sfr!2stn!4v1763137870611!5m2!1sfr!2stn" 
    width="100%" 
    height="100%" 
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="absolute inset-0 z-20"
    onLoad={() => {
      // Hide fallback when iframe loads
      const fallback = document.querySelector('.iframe-fallback') as HTMLElement | null;
      if (fallback) {
        fallback.style.display = 'none';
      }
    }}
    onError={() => {
      // Keep fallback visible if iframe fails to load
      console.error('Google Maps failed to load');
    }}
  ></iframe>
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
              <p className="text-gray-400 italic">Crafting unforgettable culinary experiences since 2010</p>
            </div>
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{commonFooter.quickLinks}</h4>
              <div className="flex flex-col gap-2">
                <a href="/" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.home}</a>
                <a href="/about" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.about}</a>
                <a href="/services" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.services}</a>
                <a href="/menus" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.menus}</a>
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
                  Instagram
                </a>
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
