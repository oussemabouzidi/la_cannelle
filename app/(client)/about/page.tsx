"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Star, Users, Heart, Target, Award, Clock } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Crown, Building } from 'lucide-react';
import { commonTranslations } from '@/lib/translations/common';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { aboutTranslations } from '@/lib/translations/about';
import { ThemeToggle } from '@/components/site/ThemeToggle';

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const { t: rawT, language, toggleLanguage } = useTranslation('about');
  const [isVisible, setIsVisible] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const t = rawT as typeof aboutTranslations.EN;
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
  const pathname = usePathname();

  const isActiveHref = (href: string) => {
    if (href === '/home') return pathname === '/' || pathname === '/home';
    return pathname === href;
  };

  const desktopLinkClass = (href: string) =>
    `${isActiveHref(href)
      ? 'text-[#A69256] border-[#A69256]'
      : 'text-[#404040] dark:text-[#F2F2F2] border-transparent hover:text-[#A69256] hover:border-[#A69256]'
    } transition-colors duration-300 text-sm font-medium tracking-wide border-b-2 pb-1 px-1`;

  const mobileLinkClass = (href: string) =>
    `${isActiveHref(href)
      ? 'text-[#A69256] underline decoration-[#A69256] underline-offset-8'
      : 'text-[#404040] dark:text-[#F2F2F2] hover:text-[#A69256]'
    } transition-colors duration-300 text-base font-medium py-2`;

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
    alert(t.alerts.quoteSubmitted);
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia?.('(hover: hover)').matches) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setIsNavCollapsed(window.scrollY > 32);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

    type AboutContent = {
    nav: { services: string; menus: string; contact: string; connect: string; order: string };
    hero: { title: string; subtitle: string };
    story: { title: string; content: string[] };
    values: {
      passion: { title: string; subtitle: string; description: string };
      exclusivity: { title: string; subtitle: string; description: string };
      company: { title: string; subtitle: string; description: string };
    };
    valuesSection: { title: string; subtitle: string };
    team: { title: string; items: { name: string; role: string }[] };
    services: { title: string; items: { title: string; description: string }[] };
    contact: { title: string; address: string; phone: string; mobile: string; email: string };
    contactLabels: { address: string; phone: string; email: string };
    cta: { title: string; subtitle: string; button: string };
    quoteModal: {
      title: string;
      subtitle: string;
      name: string;
      email: string;
      phone: string;
      eventType: string;
      eventTypePlaceholder: string;
      eventDate: string;
      guests: string;
      message: string;
      submit: string;
      cancel: string;
      eventTypes: string[];
    };
    footer: { quickLinks: string; contact: string; followUs: string };
    body: { style: string };
  };

  const translations: Record<'EN' | 'DE', AboutContent> = {
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
        passion: { title: 'Passion', subtitle: 'Heart in every dish', description: 'Love for food and service drives everything we do.' },
        exclusivity: { title: 'Exclusivity', subtitle: 'Private experiences', description: 'Private, bespoke experiences crafted for your occasion.' },
        company: { title: 'Trusted Partner', subtitle: 'Your reliable ally', description: 'A dedicated team focused on your success.' }
      },
      valuesSection: {
        title: 'Our Values',
        subtitle: 'The principles that guide our culinary excellence and service'
      },
      team: {
        title: 'Our Team',
        items: [
          { name: 'Head Chef', role: 'Culinary Direction' },
          { name: 'Event Manager', role: 'Planning & Coordination' },
          { name: 'Pastry Lead', role: 'Desserts & Baking' },
          { name: 'Service Lead', role: 'Front-of-house excellence' }
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
      contactLabels: {
        address: 'Address',
        phone: 'Phone',
        email: 'Email'
      },
      cta: {
        title: 'Ready to plan your event?',
        subtitle: "Let's create an unforgettable experience together.",
        button: 'Start Now'
      },
      quoteModal: {
        title: 'Tell us about your event',
        subtitle: 'Share a few details so we can craft the perfect experience',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        eventType: 'Event Type',
        eventTypePlaceholder: 'Select Event Type',
        eventDate: 'Event Date',
        guests: 'Number of Guests',
        message: 'Tell us about your event...',
        submit: 'Submit Request',
        cancel: 'Cancel',
        eventTypes: ['Corporate Event', 'Wedding', 'Private Party', 'Conference', 'Product Launch', 'Other']
      },
      footer: {
        quickLinks: 'Quick Links',
        contact: 'Contact',
        followUs: 'Follow Us'
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
        passion: { title: 'Leidenschaft', subtitle: 'Herz in jedem Gericht', description: 'Unsere Liebe zu Essen und Service treibt alles an.' },
        exclusivity: { title: 'Exklusivität', subtitle: 'Private Erlebnisse', description: 'Private, maßgeschneiderte Erlebnisse für Ihren Anlass.' },
        company: { title: 'Vertrauenspartner', subtitle: 'Ihr verlässlicher Partner', description: 'Ein engagiertes Team, das sich auf Ihren Erfolg konzentriert.' }
      },
      valuesSection: {
        title: 'Unsere Werte',
        subtitle: 'Die Prinzipien, die unsere kulinarische Exzellenz und unseren Service leiten'
      },
      team: {
        title: 'Unser Team',
        items: [
          { name: 'Chefkoch', role: 'Kulinarische Leitung' },
          { name: 'Event Manager', role: 'Planung & Koordination' },
          { name: 'Patisserie Lead', role: 'Desserts & Backwaren' },
          { name: 'Serviceleitung', role: 'Service & Gästebetreuung' }
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
      contactLabels: {
        address: 'Adresse',
        phone: 'Telefon',
        email: 'E-Mail'
      },
      cta: {
        title: 'Bereit, Ihr Event zu planen?',
        subtitle: 'Lassen Sie uns gemeinsam ein unvergessliches Erlebnis schaffen.',
        button: 'Jetzt starten'
      },
      quoteModal: {
        title: 'Erzählen Sie uns von Ihrer Veranstaltung',
        subtitle: 'Teilen Sie Details, damit wir das perfekte Erlebnis planen können',
        name: 'Vollständiger Name',
        email: 'E-Mail-Adresse',
        phone: 'Telefonnummer',
        eventType: 'Veranstaltungstyp',
        eventTypePlaceholder: 'Veranstaltungstyp wählen',
        eventDate: 'Veranstaltungsdatum',
        guests: 'Anzahl der Gäste',
        message: 'Erzählen Sie uns von Ihrer Veranstaltung...',
        submit: 'Anfrage senden',
        cancel: 'Abbrechen',
        eventTypes: ['Firmenevent', 'Hochzeit', 'Private Feier', 'Konferenz', 'Produktvorstellung', 'Andere']
      },
      footer: {
        quickLinks: 'Schnellzugriff',
        contact: 'Kontakt',
        followUs: 'Folgen Sie uns'
      },
      body: { style: 'klassisch' }
    }
  };

  const commonNav = commonTranslations[language].nav;
  const commonA11y = commonTranslations[language].accessibility;

  return (
    <div className="min-h-screen bg-[#F2F2F2] overflow-x-hidden">
      {/* Add animations and fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Open+Sans:wght@300;400;500;600;700&display=swap');
        
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
          font-family: 'Open Sans', Lora, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          letter-spacing: 0.01em;
          line-height: 1.75;
        }
        
        .font-elegant {
          font-family: 'Playfair Display', Georgia, serif;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center z-[100] p-4 sm:p-6 overflow-y-auto animate-scale-in">
          <div 
            ref={modalRef}
            className="bg-[#F9F9F9] rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto ring-1 ring-black/5"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-[#404040] font-elegant">
                  {t.quoteModal.title}
                </h3>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-[#A6A6A6] hover:text-[#A69256] transition-colors p-1 rounded-full hover:bg-[#A69256]/10"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-[#404040]/75 mb-6">
                {t.quoteModal.subtitle}
              </p>
              
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#404040] mb-1">
                    {t.quoteModal.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={quoteForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-[#A6A6A6] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-[color:#A69256] focus:border-transparent text-[#404040]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#404040] mb-1">
                    {t.quoteModal.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={quoteForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-[#A6A6A6] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-[color:#A69256] focus:border-transparent text-[#404040]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#404040] mb-1">
                    {t.quoteModal.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={quoteForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#A6A6A6] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-[color:#A69256] focus:border-transparent text-[#404040]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#404040] mb-1">
                    {t.quoteModal.eventType}
                  </label>
                  <select
                    name="eventType"
                    value={quoteForm.eventType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-[#A6A6A6] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-[color:#A69256] focus:border-transparent text-[#404040]"
                  >
                    <option value="">{t.quoteModal.eventTypePlaceholder}</option>
                    {t.quoteModal.eventTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#404040] mb-1">
                    {t.quoteModal.eventDate}
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={quoteForm.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#A6A6A6] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-[color:#A69256] focus:border-transparent text-[#404040]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#404040] mb-1">
                    {t.quoteModal.guests}
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={quoteForm.guests}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-[#A6A6A6] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-[color:#A69256] focus:border-transparent text-[#404040]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#404040] mb-1">
                    {t.quoteModal.message}
                  </label>
                  <textarea
                    name="message"
                    value={quoteForm.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-[#A6A6A6] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-[color:#A69256] focus:border-transparent text-[#404040]"
                  ></textarea>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(false)}
                    className="flex-1 px-4 py-2 border border-[#A6A6A6] text-[#404040] rounded-lg hover:bg-[#404040] hover:text-[#F2F2F2] transition-colors"
                  >
                    {t.quoteModal.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#A69256] text-[#F2F2F2] rounded-lg hover:bg-[#0D0D0D] transition-colors"
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
      <nav
        className={`group fixed top-0 w-full bg-white/80 supports-[backdrop-filter]:bg-white/65 backdrop-blur-lg border-b border-black/10 z-50 animate-fade-in-down shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:overflow-hidden md:transition-[max-height] md:duration-300 md:ease-out dark:bg-[#2C2C2C]/80 dark:supports-[backdrop-filter]:bg-[#2C2C2C]/65 dark:border-white/10 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${
          isNavCollapsed
            ? 'md:max-h-[14px] md:hover:max-h-[112px] md:focus-within:max-h-[112px]'
            : 'md:max-h-[112px]'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:transition-opacity md:duration-200 ${
            isNavCollapsed
              ? 'md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto'
              : ''
          }`}
        >
          <div className="flex justify-between items-center h-16 md:h-20">
            <a
              href="/home"
              aria-label="Go to Home"
              className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A69256]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#2C2C2C]"
            >
              <img
                src="/images/logo-removebg-preview.png"
                alt="La Cannelle"
                className="h-12 sm:h-14 md:h-16 lg:h-[76px] xl:h-[84px] w-auto max-w-[240px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[520px] xl:max-w-[600px] object-contain dark:invert dark:brightness-200 dark:contrast-125"
              />
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              <a href="/home" className={desktopLinkClass('/home')}>{commonNav.home}</a>
              <a href="/about" className={desktopLinkClass('/about')}>{commonNav.about}</a>
              <a href="/services" className={desktopLinkClass('/services')}>{t.nav.services}</a>
              <a href="/menus" className={desktopLinkClass('/menus')}>{t.nav.menus}</a>
              <a href="/contact" className={desktopLinkClass('/contact')}>{t.nav.contact}</a>
              <button 
                onClick={toggleLanguage}
                aria-label={language === 'EN' ? commonA11y.switchToGerman : commonA11y.switchToEnglish}
                className="h-10 w-12 rounded-lg border border-[#404040]/25 bg-transparent text-[#404040] hover:border-[#A69256] hover:text-[#A69256] hover:bg-[#A69256]/10 transition-all duration-300 transform hover:scale-105 font-medium inline-flex items-center justify-center dark:border-white/15 dark:text-[#F2F2F2] dark:hover:bg-white/10 shrink-0"
              >
                {language === 'EN' ? (
                  <img src="/images/language/Flag_of_United_Kingdom-4096x2048.png" width={24} alt={commonA11y.englishFlagAlt} className="rounded" />
                ) : (
                  <img src="/images/language/Flag_of_Germany-4096x2453.png" width={24} alt={commonA11y.germanFlagAlt} className="rounded" />
                )}
              </button>

              <ThemeToggle />
              <button 
                onClick={handleOrderClick}
                className="px-6 py-2 text-sm bg-[#A69256] text-[#F2F2F2] rounded-lg hover:bg-[#0D0D0D] transition-all duration-300 transform hover:scale-105 font-medium"
              >
                {t.nav.order}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden transition-transform duration-300 hover:scale-110 text-[#404040] dark:text-[#F2F2F2]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-black/10 animate-fade-in-down dark:border-white/10">
              <div className="flex flex-col gap-4">
                <a href="/home" className={mobileLinkClass('/home')}>{commonNav.home}</a>
                <a href="/about" className={mobileLinkClass('/about')}>{commonNav.about}</a>
                <a href="/services" className={mobileLinkClass('/services')}>{commonNav.services}</a>
                <a href="/menus" className={mobileLinkClass('/menus')}>{commonNav.menus}</a>
                <a href="/contact" className={mobileLinkClass('/contact')}>{commonNav.contact}</a>
                <button 
                  onClick={toggleLanguage}
                  aria-label={language === 'EN' ? commonA11y.switchToGerman : commonA11y.switchToEnglish}
                  className="px-4 py-2 text-sm border border-[#404040]/25 rounded-lg bg-transparent text-[#404040] hover:border-[#A69256] hover:text-[#A69256] hover:bg-[#A69256]/10 w-full font-medium transition-all duration-300 flex items-center justify-center dark:border-white/15 dark:text-[#F2F2F2] dark:hover:bg-white/10"
                >
                  {language === 'EN' ? (
                    <img
                      src="/images/language/Flag_of_United_Kingdom-4096x2048.png"
                      alt={commonA11y.englishFlagAlt}
                      className="h-5 w-auto"
                    />
                  ) : (
                    <img
                      src="/images/language/Flag_of_Germany-4096x2453.png"
                      alt={commonA11y.germanFlagAlt}
                      className="h-5 w-auto"
                    />
                  )}
                </button>

                <ThemeToggle className="w-full justify-center" />
                <button onClick={handleOrderClick} className="px-6 py-2 text-sm bg-[#A69256] text-[#F2F2F2] rounded-lg hover:bg-[#0D0D0D] font-medium transition-all duration-300 transform hover:scale-105">
                  {t.nav.order}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#F2F2F2] relative overflow-hidden">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white lux-reveal" data-lux-delay="40">
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
              <div className="bg-white/70 rounded-2xl p-8 h-96 flex items-center justify-center border border-[#A6A6A6]/40">
                <div className="text-center">
                  <div className="text-6xl font-bold text-[#A69256] mb-4 font-elegant">14+</div>
                  <div className="text-xl text-gray-700 font-semibold">Years of Excellence</div>
                  <div className="text-gray-600 mt-2">Serving B2B & Private Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section - Redesigned */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F2F2F2] relative overflow-hidden lux-reveal" data-lux-delay="40">
        {/* Background Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-[#A69256]/15 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-stone-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-elegant">{t.valuesSection.title}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t.valuesSection.subtitle}</p>
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
                <div className="absolute top-4 left-4 bg-[#A69256] text-[#F2F2F2] px-3 py-1 rounded-full text-sm font-semibold">
                  Premium
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#A69256]/15 rounded-xl flex items-center justify-center group-hover:bg-[#A69256]/25 transition-colors duration-300">
                    <Crown className="text-[#A69256]" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-elegant">{t.values.exclusivity.title}</h3>
                </div>
                
                <p className="text-sm text-[#A69256] font-semibold mb-3 tracking-wider italic">
                  {t.values.exclusivity.subtitle}
                </p>
                
                <p className="text-gray-600 leading-relaxed text-sm">
                  {t.values.exclusivity.description}
                </p>

                {/* Features */}
                <div className="mt-4 space-y-2">
                  {['Personalized Service', 'Custom Menus', 'Private Consultations'].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-[#A69256] rounded-full"></div>
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
          <div className={`mt-16 bg-white rounded-2xl shadow-lg border border-[#A6A6A6]/40 p-8 transition-all duration-1000 delay-600 ${
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
                  <p className="text-3xl font-bold text-[#A69256] mb-2 group-hover:scale-110 transition-transform duration-300">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white lux-reveal" data-lux-delay="40">
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
                className={`bg-stone-50 rounded-2xl p-6 text-center hover:bg-[#A69256]/10 transition-all duration-500 transform hover:-translate-y-2 group ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 150 + 300}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#A69256]/15 rounded-full mb-4 group-hover:bg-[#A69256]/25 transition-colors">
                  <Star className="text-[#A69256]" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-elegant">
                  {item.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50 lux-reveal" data-lux-delay="40">
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
                  <Star size={20} className="text-[#A69256] flex-shrink-0" />
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white lux-reveal" data-lux-delay="40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 font-elegant">
                {t.contact.title}
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg hover:bg-[#A69256]/10 transition-colors">
                  <MapPin className="text-[#A69256]" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">{t.contactLabels.address}</p>
                    <p className="text-gray-600">{t.contact.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg hover:bg-[#A69256]/10 transition-colors">
                  <Phone className="text-[#A69256]" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">{t.contactLabels.phone}</p>
                    <p className="text-gray-600">{t.contact.phone}</p>
                    <p className="text-gray-600 text-sm">{t.contact.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg hover:bg-[#A69256]/10 transition-colors">
                  <Mail className="text-[#A69256]" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">{t.contactLabels.email}</p>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#404040] to-[#0D0D0D] relative overflow-hidden lux-reveal" data-lux-delay="40">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-white mb-4 font-elegant italic">
              {t.cta.title}
            </h2>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-xl text-[#A6A6A6] mb-8 font-light italic">
              {t.cta.subtitle}
            </p>
          </div>
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
            <button 
              onClick={handleGetQuoteClick}
              className="group w-full sm:w-auto justify-center px-6 sm:px-12 py-4 bg-[#A69256] text-[#F2F2F2] rounded-lg text-lg font-semibold hover:bg-[#0D0D0D] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3"
            >
              {t.cta.button}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#404040] text-[#F2F2F2] py-16 px-4 sm:px-6 lg:px-8 lux-reveal" data-lux-delay="80">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <h3 className="text-2xl font-bold mb-4 font-elegant italic">La Cannelle</h3>
              <p className="text-[#F2F2F2]/70 italic">Crafting unforgettable culinary experiences since 2010</p>
            </div>
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{t.footer.quickLinks}</h4>
              <div className="flex flex-col gap-2">
                <a href="/home" className="text-white hover:text-[#A69256] transition-all duration-300 transform hover:translate-x-1">{commonNav.home}</a>
                <a href="/about" className="text-white font-semibold transition-all duration-300 transform hover:translate-x-1">{commonNav.about}</a>
                <a href="/services" className="text-white hover:text-[#A69256] transition-all duration-300 transform hover:translate-x-1">{commonNav.services}</a>
                <a href="/menus" className="text-white hover:text-[#A69256] transition-all duration-300 transform hover:translate-x-1">{commonNav.menus}</a>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{t.footer.contact}</h4>
              <div className="flex flex-col gap-3 text-[#F2F2F2]/70">
                <div className="flex items-center gap-2 hover:text-[#A69256] transition-colors duration-300">
                  <Phone size={18} />
                  <span>{t.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-[#A69256] transition-colors duration-300">
                  <Mail size={18} />
                  <span>{t.contact.email}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-[#A69256] transition-colors duration-300">
                  <MapPin size={18} />
                  <span>{t.contact.address}</span>
                </div>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{t.footer.followUs}</h4>
              <div className="flex flex-col gap-2 text-[#F2F2F2]/70">
                <a href="https://www.instagram.com/lacannellecatering/" className="hover:text-[#A69256] transition-colors duration-300">Instagram</a>
                <a href="https://www.tiktok.com/@lacannellecatering" className="hover:text-[#A69256] transition-colors duration-300">TikTok</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-[#F2F2F2]/60">
            <p>&copy; 2025 La Cannelle Catering. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


