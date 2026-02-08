"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Briefcase, Users, Heart, Building2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { servicesTranslations } from '@/lib/translations/services';
import { commonTranslations } from '@/lib/translations/common';
import { ThemeToggle } from '@/components/site/ThemeToggle';

export default function ServicesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const translation = useTranslation('services');
  const t = translation.t as typeof servicesTranslations.EN;
  const { language, toggleLanguage } = translation;
  const commonA11y = commonTranslations[language].accessibility;
  const [isVisible, setIsVisible] = useState(false);

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
    } transition-colors duration-200 text-sm font-medium tracking-wide border-b-2 pb-1 px-1`;

  const mobileLinkClass = (href: string) =>
    `${isActiveHref(href)
      ? 'text-[#A69256] underline decoration-[#A69256] underline-offset-8'
      : 'text-[#404040] dark:text-[#F2F2F2] hover:text-[#A69256]'
    } transition-colors duration-200 text-base font-medium py-2`;

  const handleOrderClick = () => {
    router.push('/order');
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

  return (
    <div className="min-h-screen bg-[#F2F2F2] overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Open+Sans:wght@300;400;500;600;700&display=swap');
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-fade-in-left { animation: fadeInLeft 0.8s ease-out; }
        .animate-fade-in-right { animation: fadeInRight 0.8s ease-out; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out; }
        
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        
        body {
          font-family: 'Open Sans', Lora, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          letter-spacing: 0.01em;
          line-height: 1.75;
        }
        
        .font-display {
          font-family: 'Playfair Display', Georgia, serif;
          letter-spacing: 0.03em;
        }
        
        .font-elegant {
          font-family: 'Playfair Display', Georgia, serif;
        }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
      `}</style>

      {/* Premium Navbar */}
      <nav
        className={`group fixed top-0 w-full bg-white/80 supports-[backdrop-filter]:bg-white/65 backdrop-blur-lg border-b border-black/10 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:overflow-hidden md:transition-[max-height] md:duration-300 md:ease-out dark:bg-[#2C2C2C]/80 dark:supports-[backdrop-filter]:bg-[#2C2C2C]/65 dark:border-white/10 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${
          isNavCollapsed
            ? 'md:max-h-[14px] md:hover:max-h-[112px] md:focus-within:max-h-[112px]'
            : 'md:max-h-[112px]'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-6 lg:px-8 md:transition-opacity md:duration-200 ${
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
                className="h-12 md:h-16 lg:h-[76px] xl:h-[84px] w-auto max-w-[240px] sm:max-w-[300px] md:max-w-[380px] lg:max-w-[480px] xl:max-w-[560px] object-contain dark:invert dark:brightness-200 dark:contrast-125"
              />
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10 lg:gap-12">
              <a href="/home" className={desktopLinkClass('/home')}>{t.nav.home}</a>
              <a href="/services" className={desktopLinkClass('/services')}>{t.nav.services}</a>
              <a href="/menus" className={desktopLinkClass('/menus')}>{t.nav.menus}</a>
              <a href="/contact" className={desktopLinkClass('/contact')}>{t.nav.contact}</a>
              
              <button 
                onClick={toggleLanguage}
                aria-label={language === 'EN' ? commonA11y.switchToGerman : commonA11y.switchToEnglish}
                className="h-10 w-12 rounded-lg border border-[#404040]/25 bg-transparent text-[#404040] hover:border-[#A69256] hover:text-[#A69256] hover:bg-[#A69256]/10 transition-all duration-300 font-medium inline-flex items-center justify-center dark:border-white/15 dark:text-[#F2F2F2] dark:hover:bg-white/10 shrink-0"
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
                className="px-7 py-2.5 text-sm bg-[#A69256] text-[#F2F2F2] rounded-lg hover:bg-[#0D0D0D] transition-all duration-300 font-medium shadow-sm hover:shadow-md"
              >
                {t.nav.order}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-black/5 rounded-lg transition-colors dark:hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} className="text-[#404040] dark:text-[#F2F2F2]" /> : <Menu size={24} className="text-[#404040] dark:text-[#F2F2F2]" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-6 border-t border-black/10 dark:border-white/10">
              <div className="flex flex-col gap-5">
                <a href="/home" className={mobileLinkClass('/home')}>{t.nav.home}</a>
                <a href="/services" className={mobileLinkClass('/services')}>{t.nav.services}</a>
                <a href="/menus" className={mobileLinkClass('/menus')}>{t.nav.menus}</a>
                <a href="/contact" className={mobileLinkClass('/contact')}>{t.nav.contact}</a>
                
                <button
                  onClick={toggleLanguage}
                  className="px-4 py-3 text-sm border border-[#404040]/25 rounded-lg bg-transparent text-[#404040] font-medium flex items-center justify-center gap-2.5 hover:border-[#A69256] hover:text-[#A69256] hover:bg-[#A69256]/10 transition-colors dark:border-white/15 dark:text-[#F2F2F2] dark:hover:bg-white/10"
                >
                  {language === 'EN' ? (
                    <img src="/images/language/Flag_of_United_Kingdom-4096x2048.png" alt="English" className="h-5 w-auto rounded" />
                  ) : (
                    <img src="/images/language/Flag_of_Germany-4096x2453.png" alt="Deutsch" className="h-5 w-auto rounded" />
                  )}
                </button>

                <ThemeToggle className="w-full justify-center" />
                
                <button 
                  onClick={handleOrderClick} 
                  className="px-6 py-3 text-sm bg-[#A69256] text-[#F2F2F2] rounded-lg hover:bg-[#0D0D0D] font-medium transition-all"
                >
                  {t.nav.order}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Premium */}
      <section className="pt-40 pb-24 px-6 lg:px-8 bg-[#F2F2F2] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#A69256]/12 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-xs uppercase tracking-[0.3em] text-[#A69256] font-semibold mb-4">Our Services</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 mb-6 font-display leading-tight">
              {t.hero.title}
            </h1>
          </div>
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Office Catering - Premium Layout */}
      <section id="office-catering" className="py-24 px-6 lg:px-8 bg-white lux-reveal" data-lux-delay="40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-[#A69256]/15 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="text-[#A69256]" size={28} strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-display">{t.officeCatering.title}</h2>
              <p className="text-lg text-[#A69256] font-medium mb-6">{t.officeCatering.subtitle}</p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">{t.officeCatering.description}</p>
              
              {/* Image */}
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <img
                  src="/images/services/office.jpg"
                  alt={t.officeCatering.title}
                  className="w-full h-80 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="bg-gray-50 p-10 rounded-3xl border border-gray-200">
                <h3 className="text-xl font-medium text-gray-900 mb-6 font-display">{t.labels.whatWeOffer}</h3>
                <ul className="space-y-4">
                  {t.officeCatering.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-[#A69256]/15 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#A69256]/25 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#A69256]"></div>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Catering - Premium Layout */}
      <section id="event-catering" className="py-24 px-6 lg:px-8 bg-gray-50 lux-reveal" data-lux-delay="40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-medium text-gray-900 mb-6 font-display">{t.labels.whatWeOffer}</h3>
                <ul className="space-y-4">
                  {t.eventCatering.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-[#A69256]/15 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#A69256]/25 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#A69256]"></div>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className={`order-1 lg:order-2 transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-[#A69256]/15 rounded-2xl flex items-center justify-center mb-6">
                <Users className="text-[#A69256]" size={28} strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-display">{t.eventCatering.title}</h2>
              <p className="text-lg text-[#A69256] font-medium mb-6">{t.eventCatering.subtitle}</p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">{t.eventCatering.description}</p>
              
              {/* Image */}
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <img
                  src="/images/services/event.jpg"
                  alt={t.eventCatering.title}
                  className="w-full h-80 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weddings - Premium Layout */}
      <section id="weddings" className="py-24 px-6 lg:px-8 bg-white lux-reveal" data-lux-delay="40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="text-rose-600" size={28} strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-display">{t.weddings.title}</h2>
              <p className="text-lg text-rose-600 font-medium mb-6">{t.weddings.subtitle}</p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">{t.weddings.description}</p>
              
              {/* Image */}
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <img
                  src="/images/services/weddings.jpg"
                  alt={t.weddings.title}
                  className="w-full h-80 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="bg-gradient-to-br from-[#F2F2F2] to-[#A69256]/10 p-10 rounded-3xl border border-[#A6A6A6]/40">
                <h3 className="text-xl font-medium text-gray-900 mb-6 font-display">{t.labels.whatWeOffer}</h3>
                <ul className="space-y-4">
                  {t.weddings.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-rose-200 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Events - Premium Layout */}
      <section id="corporate-events" className="py-24 px-6 lg:px-8 bg-[#F2F2F2] lux-reveal" data-lux-delay="40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-medium text-gray-900 mb-6 font-display">{t.labels.whatWeOffer}</h3>
                <ul className="space-y-4">
                  {t.corporateEvents.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-[#A69256]/15 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#A69256]/25 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#A69256]"></div>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className={`order-1 lg:order-2 transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="text-blue-600" size={28} strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-display">{t.corporateEvents.title}</h2>
              <p className="text-lg text-blue-600 font-medium mb-6">{t.corporateEvents.subtitle}</p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">{t.corporateEvents.description}</p>
              
              {/* Image */}
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <img
                  src="/images/services/corporate.jpg"
                  alt={t.corporateEvents.title}
                  className="w-full h-80 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-32 px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden lux-reveal" data-lux-delay="40">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#A69256] via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-6 font-display">{t.cta.title}</h2>
            <p className="text-xl text-gray-300 mb-10 font-light">{t.cta.subtitle}</p>
            <button
              onClick={() => handleOrderClick()}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[#A69256] text-[#F2F2F2] rounded-full text-base font-semibold transition-all duration-500 hover:bg-[#0D0D0D] hover:shadow-2xl hover:scale-105"
            >
              {t.cta.button}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-[#404040] text-[#F2F2F2] py-20 px-6 lg:px-8 lux-reveal" data-lux-delay="80">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <h3 className="text-2xl font-light mb-4 font-display">{t.footer.brandTitle}</h3>
              <p className="text-[#F2F2F2]/70 text-sm">{t.footer.brandTagline}</p>
            </div>
            
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{t.footer.quickLinks}</h4>
              <div className="flex flex-col gap-3">
                <a href="/home" className="text-[#F2F2F2] hover:text-[#A69256] transition-colors">{t.nav.home}</a>
                <a href="/services" className="text-[#F2F2F2] hover:text-[#A69256] transition-colors">{t.nav.services}</a>
                <a href="/menus" className="text-[#F2F2F2] hover:text-[#A69256] transition-colors">{t.nav.menus}</a>
                <a href="/contact" className="text-[#F2F2F2] hover:text-[#A69256] transition-colors">{t.nav.contact}</a>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{t.footer.contact}</h4>
              <div className="flex flex-col gap-3 text-[#F2F2F2]/70">
                <div className="flex items-center gap-3">
                  <Phone size={16} />
                  <span className="text-sm">{t.footer.contactPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} />
                  <span className="text-sm">{t.footer.contactEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span className="text-sm">{t.footer.contactAddress}</span>
                </div>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{t.footer.hoursTitle}</h4>
              <div className="text-[#F2F2F2]/70 text-sm space-y-1">
                <p>{t.footer.hoursWeekdays}</p>
                <p>{t.footer.hoursSaturday}</p>
                <p>{t.footer.hoursSunday}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-[#F2F2F2]/60 text-sm">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
