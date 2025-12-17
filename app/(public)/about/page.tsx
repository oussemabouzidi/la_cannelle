"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Star, Users, Heart, Target, Award, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Crown, Building } from 'lucide-react';

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'DE'>('EN');
  const toggleLanguage = () => setLanguage((prev) => (prev === 'EN' ? 'DE' : 'EN'));
  const [isVisible, setIsVisible] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guests: '',
    message: ''
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowQuoteModal(false);
      }
    };

    // Handle escape key to close modal
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowQuoteModal(false);
      }
    };

    if (showQuoteModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showQuoteModal]);

  const handleOrderClick = () => {
    router.push('/order');
  };

  const handleGetQuoteClick = () => {
    setShowQuoteModal(true);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Quote request:', quoteForm);
    
    // For now, we'll just show an alert and close the modal
    alert(language === 'EN' 
      ? 'Thank you for your quote request! We will contact you soon.' 
      : 'Vielen Dank für Ihre Angebotsanfrage! Wir werden Sie bald kontaktieren.'
    );
    setShowQuoteModal(false);
    setQuoteForm({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      guests: '',
      message: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuoteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const translations = {
    EN: {
      nav: { services: 'Services', menus: 'Menus', contact: 'Contact', connect: 'Connect', order: 'Order' },
      hero: { title: 'About Us', subtitle: 'Crafting culinary excellence since our inception' },
      story: {
        title: 'Our Story',
        content: [
          'We partner closely with clients to understand their vision and deliver bespoke experiences.',
          'Chefs craft seasonal menus that balance flavor, presentation, and dietary needs.',
          'From intimate gatherings to large events, every detail is handled with care.'
        ]
      },
      values: {
        passion: { title: 'Passion', description: 'Love for food and service drives everything we do.' },
        exclusivity: { title: 'Exclusivity', description: 'Private, bespoke experiences crafted for your occasion.' },
        company: { title: 'Trusted Partner', description: 'A dedicated team focused on your success.' }
      },
      team: {
        title: 'Our Team',
        items: [
          { name: 'Head Chef', role: 'Culinary Direction' },
          { name: 'Event Manager', role: 'Planning & Coordination' },
          { name: 'Pastry Lead', role: 'Desserts & Baking' }
        ]
      },
      services: {
        title: 'What we offer',
        items: [
          { title: 'Personalized Service', description: 'Tailored menus and attentive coordination.' },
          { title: 'Creative Menus', description: 'Innovative dishes inspired by seasonal ingredients.' },
          { title: 'Reliable Delivery', description: 'Professional team ensuring timely service.' }
        ]
      },
      contact: {
        title: 'Get in touch',
        address: '123 Culinary Street, Food City, FC 12345',
        phone: '+1 (555) 123-4567',
        mobile: '+1 (555) 987-6543',
        email: 'info@catering.com'
      },
      cta: {
        title: 'Ready to plan your event?',
        subtitle: 'Let’s create an unforgettable experience together.',
        button: 'Start Now'
      },
      quoteModal: {
        title: 'Tell us about your event',
        subtitle: 'Share a few details so we can craft the perfect experience',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        eventType: 'Event Type',
        eventDate: 'Event Date',
        guests: 'Number of Guests',
        message: 'Tell us about your event...',
        submit: 'Submit Request',
        cancel: 'Cancel',
        eventTypes: ['Corporate Event', 'Wedding', 'Private Party', 'Conference', 'Product Launch', 'Other']
      },
      body: { style: 'classic' }
    },
    DE: {
      nav: { services: 'Dienstleistungen', menus: 'Menüs', contact: 'Kontakt', connect: 'Verbinden', order: 'Bestellen' },
      hero: { title: 'Über uns', subtitle: 'Kulinarische Exzellenz seit unserer Gründung' },
      story: {
        title: 'Unsere Geschichte',
        content: [
          'Wir arbeiten eng mit Kunden zusammen, um ihre Vision zu verstehen und maßgeschneiderte Erlebnisse zu liefern.',
          'Unsere Küche erstellt saisonale Menüs, die Geschmack, Präsentation und Ernährungsbedürfnisse ausbalancieren.',
          'Von intimen Feiern bis zu großen Events kümmern wir uns um jedes Detail.'
        ]
      },
      values: {
        passion: { title: 'Leidenschaft', description: 'Unsere Liebe zu Essen und Service treibt alles an.' },
        exclusivity: { title: 'Exklusivität', description: 'Private, maßgeschneiderte Erlebnisse für Ihren Anlass.' },
        company: { title: 'Vertrauenspartner', description: 'Ein engagiertes Team, das sich auf Ihren Erfolg konzentriert.' }
      },
      team: {
        title: 'Unser Team',
        items: [
          { name: 'Chefkoch', role: 'Kulinarische Leitung' },
          { name: 'Event Manager', role: 'Planung & Koordination' },
          { name: 'Pâtisserie Lead', role: 'Desserts & Backwaren' }
        ]
      },
      services: {
        title: 'Was wir bieten',
        items: [
          { title: 'Personalisierter Service', description: 'Individuelle Menüs und sorgfältige Koordination.' },
          { title: 'Kreative Menüs', description: 'Innovative Gerichte mit saisonalen Zutaten.' },
          { title: 'Zuverlässige Lieferung', description: 'Professionelles Team für pünktlichen Service.' }
        ]
      },
      contact: {
        title: 'Nehmen Sie Kontakt auf',
        address: 'Kulinarische Straße 123, Essen Stadt, 12345',
        phone: '+49 123 456 789',
        mobile: '+49 987 654 321',
        email: 'info@catering.com'
      },
      cta: {
        title: 'Bereit, Ihr Event zu planen?',
        subtitle: 'Lassen Sie uns gemeinsam ein unvergessliches Erlebnis schaffen.',
        button: 'Jetzt starten'
      },
      quoteModal: {
        title: 'Erzählen Sie uns von Ihrer Veranstaltung',
        subtitle: 'Teilen Sie einige Details, damit wir das perfekte Erlebnis planen können',
        name: 'Vollständiger Name',
        email: 'E-Mail-Adresse',
        phone: 'Telefonnummer',
        eventType: 'Veranstaltungstyp',
        eventDate: 'Veranstaltungsdatum',
        guests: 'Anzahl der Gäste',
        message: 'Erzählen Sie uns von Ihrer Veranstaltung...',
        submit: 'Anfrage senden',
        cancel: 'Abbrechen',
        eventTypes: ['Firmenevent', 'Hochzeit', 'Private Feier', 'Konferenz', 'Produktvorstellung', 'Andere']
      },
      body: { style: 'klassisch' }
    }
  } as const;

  const t = translations[language];

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

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-scale-in pt-24">
          <div 
            ref={modalRef}
            className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900 font-elegant">
                  {t.quoteModal.title}
                </h3>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                {t.quoteModal.subtitle}
              </p>
              
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.quoteModal.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={quoteForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.quoteModal.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={quoteForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.quoteModal.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={quoteForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.quoteModal.eventType}
                  </label>
                  <select
                    name="eventType"
                    value={quoteForm.eventType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  >
                    <option value="">Select Event Type</option>
                    {t.quoteModal.eventTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.quoteModal.eventDate}
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={quoteForm.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.quoteModal.guests}
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={quoteForm.guests}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.quoteModal.message}
                  </label>
                  <textarea
                    name="message"
                    value={quoteForm.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  ></textarea>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t.quoteModal.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
                  >
                    {t.quoteModal.submit}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
              <a href="/about" className="text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">About</a>
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

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 font-elegant">
                {t.story.title}
              </h2>
              <div className="space-y-6">
                {t.story.content.map((paragraph, index) => (
                  <p key={index} className="text-lg text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="bg-gradient-to-br from-amber-100 to-stone-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-amber-700 mb-4 font-elegant">14+</div>
                  <div className="text-xl text-gray-700 font-semibold">Years of Excellence</div>
                  <div className="text-gray-600 mt-2">Serving B2B & Private Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section - Redesigned */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-amber-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-stone-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-elegant">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide our culinary excellence and service</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Exclusivity Card */}
            <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${
              isVisible ? 'animate-scale-in' : 'opacity-0'
            }`}>
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="/images/exclusive-service.jpg" 
                  alt="Exclusive dining experience"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Premium
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors duration-300">
                    <Crown className="text-amber-600" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-elegant">{t.values.exclusivity.title}</h3>
                </div>
                
                <p className="text-sm text-amber-700 font-semibold mb-3 tracking-wider italic">
                  {t.values.exclusivity.subtitle}
                </p>
                
                <p className="text-gray-600 leading-relaxed text-sm">
                  {t.values.exclusivity.description}
                </p>

                {/* Features */}
                <div className="mt-4 space-y-2">
                  {['Personalized Service', 'Custom Menus', 'Private Consultations'].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Passion Card */}
            <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${
              isVisible ? 'animate-scale-in' : 'opacity-0'
            }`} style={{ animationDelay: '200ms' }}>
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="/images/chef-passion.jpg" 
                  alt="Chef's passion for cooking"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Artistry
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors duration-300">
                    <Heart className="text-red-600" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-elegant">{t.values.passion.title}</h3>
                </div>
                
                <p className="text-sm text-red-700 font-semibold mb-3 tracking-wider italic">
                  {t.values.passion.subtitle}
                </p>
                
                <p className="text-gray-600 leading-relaxed text-sm">
                  {t.values.passion.description}
                </p>

                {/* Features */}
                <div className="mt-4 space-y-2">
                  {['Handcrafted Dishes', 'Local Ingredients', 'Creative Innovation'].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Card */}
            <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${
              isVisible ? 'animate-scale-in' : 'opacity-0'
            }`} style={{ animationDelay: '400ms' }}>
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="/images/company-values.jpg" 
                  alt="Professional catering team"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Professional
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                    <Building className="text-blue-600" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-elegant">{t.values.company.title}</h3>
                </div>
                
                <p className="text-sm text-blue-700 font-semibold mb-3 tracking-wider italic">
                  {t.values.company.subtitle}
                </p>
                
                <p className="text-gray-600 leading-relaxed text-sm">
                  {t.values.company.description}
                </p>

                {/* Features */}
                <div className="mt-4 space-y-2">
                  {['Reliable Service', 'Quality Assurance', 'Client Focus'].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className={`mt-16 bg-white rounded-2xl shadow-lg border border-amber-100 p-8 transition-all duration-1000 delay-600 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '15+', label: 'Years Experience' },
                { number: '500+', label: 'Events Catered' },
                { number: '98%', label: 'Client Satisfaction' },
                { number: '50+', label: 'Awards Won' }
              ].map((stat, index) => (
                <div key={index} className="group">
                  <p className="text-3xl font-bold text-amber-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </p>
                  <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center font-elegant">
              {t.team.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.team.items.map((item, index) => (
              <div
                key={index}
                className={`bg-stone-50 rounded-2xl p-6 text-center hover:bg-amber-50 transition-all duration-500 transform hover:-translate-y-2 group ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 150 + 300}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4 group-hover:bg-amber-200 transition-colors">
                  <Star className="text-amber-700" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-elegant">
                  {item.name || item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.role || item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center font-elegant">
              {t.services.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {t.services.items.map((service, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-stone-100 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <div className="flex items-center gap-3">
                  <Star size={20} className="text-amber-500 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">
                    {typeof service === 'string' ? service : service.title}
                  </span>
                </div>
                {typeof service !== 'string' && service.description && (
                  <p className="text-gray-600 mt-2 text-sm">{service.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 font-elegant">
                {t.contact.title}
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg hover:bg-amber-50 transition-colors">
                  <MapPin className="text-amber-700" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">{t.contact.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg hover:bg-amber-50 transition-colors">
                  <Phone className="text-amber-700" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">{t.contact.phone}</p>
                    <p className="text-gray-600 text-sm">{t.contact.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg hover:bg-amber-50 transition-colors">
                  <Mail className="text-amber-700" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">{t.contact.email}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`transition-all  delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2498.8334217314505!2d6.776975276284795!3d51.22214423150265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8cb10fedecbc9%3A0xa3a5e988315ddb33!2sLa%20Cannelle!5e0!3m2!1sfr!2stn!4v1763137870611!5m2!1sfr!2stn" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-100"
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

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-700 to-amber-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-white mb-4 font-elegant italic">
              {t.cta.title}
            </h2>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-xl text-amber-100 mb-8 font-light italic">
              {t.cta.subtitle}
            </p>
          </div>
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
            <button 
              onClick={handleGetQuoteClick}
              className="px-12 py-4 bg-white text-amber-700 rounded-lg text-lg font-semibold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3"
            >
              {t.cta.button}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
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
                <a href="/about" className="text-amber-400 font-semibold transition-all duration-300 transform hover:translate-x-1">About</a>
                <a href="/services" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">Services</a>
                <a href="/menus" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">Menus</a>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">Contact</h4>
              <div className="flex flex-col gap-3 text-gray-400">
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Phone size={18} />
                  <span>{t.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Mail size={18} />
                  <span>{t.contact.email}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <MapPin size={18} />
                  <span>{t.contact.address}</span>
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
