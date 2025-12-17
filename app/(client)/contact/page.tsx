"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'DE'>('EN');
  const toggleLanguage = () => setLanguage((prev) => (prev === 'EN' ? 'DE' : 'EN'));
  const translations = {
    EN: {
      nav: { about: 'About', services: 'Services', menus: 'Menus', contact: 'Contact', connect: 'Connect', order: 'Order Now' },
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
      contactForm: {
        title: 'Send Us a Message',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        eventType: 'Event Type',
        eventDate: 'Event Date',
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
      nav: { about: 'Über uns', services: 'Dienstleistungen', menus: 'Menüs', contact: 'Kontakt', connect: 'Verbinden', order: 'Jetzt bestellen' },
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
      contactForm: {
        title: 'Senden Sie uns eine Nachricht',
        name: 'Vollständiger Name',
        email: 'E-Mail-Adresse',
        phone: 'Telefonnummer',
        eventType: 'Veranstaltungstyp',
        eventDate: 'Veranstaltungsdatum',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert(t.success.message);
  };

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
        
        html {
          scroll-behavior: smooth;
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
                <a href="/contact" className="text-amber-700 font-semibold transition-all duration-300 transform hover:translate-x-2">Contact</a>
                <button 
                  onClick={toggleLanguage}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 w-full text-left font-medium transition-all duration-300"
                >
                  {language}
                </button>
                <button className="px-4 py-2 text-sm border border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 font-medium transition-all duration-300">
                  {t.nav.connect}
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
                        onChange={handleInputChange}
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
                        <option value="" className="text-gray-500">Select Event Type</option>
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
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {t.contactForm.guests}
                      </label>
                      <input
                        type="number"
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        min="1"
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
                <button className="w-full bg-white text-amber-700 py-3 px-6 rounded-lg font-semibold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center gap-2 group">
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
                    className="flex-1 bg-gradient-to-br from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {t.social.instagram}
                  </a>
                  <a 
                    href="https://www.tiktok.com/@lacannellecatering" 
                    className="flex-1 bg-black text-white py-3 px-4 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {t.social.tiktok}
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
                Our Location
              </h3>
            </div>
<div className="h-96 bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center relative">
  {/* Fallback content that shows when iframe is loading or if there's an error */}
  <div className="absolute inset-0 flex items-center justify-center bg-amber-100 z-10 iframe-fallback">
    <div className="text-center">
      <MapPin size={48} className="text-amber-700 mx-auto mb-4" />
      <p className="text-xl font-semibold text-gray-900 mb-2">{t.contactInfo.address}</p>
      <p className="text-gray-600">Loading Google Maps...</p>
      <button className="mt-4 bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors">
        Open in Google Maps
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
              <h4 className="font-semibold mb-4 font-elegant">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <a href="/" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">Home</a>
                <a href="/about" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">About</a>
                <a href="/services" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">Services</a>
                <a href="/menus" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">Menus</a>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">Contact</h4>
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
