"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Briefcase, Users, Heart, Building2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { servicesTranslations } from '@/lib/translations/services';
import { commonTranslations } from '@/lib/translations/common';

export default function ServicesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    `${isActiveHref(href) ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600'} transition-colors duration-200 text-sm font-medium tracking-wide`;

  const mobileLinkClass = (href: string) =>
    `${isActiveHref(href) ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600'} transition-colors duration-200 text-base font-medium`;

  const handleOrderClick = () => {
    router.push('/order');
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
        
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
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.01em;
        }
        
        .font-display {
          font-family: 'Cormorant Garamond', serif;
          letter-spacing: 0.02em;
        }
        
        .font-elegant {
          font-family: 'Playfair Display', serif;
        }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
      `}</style>

      {/* Premium Navbar */}
      <nav className="fixed top-0 w-full bg-white/98 backdrop-blur-md border-b border-gray-200/50 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <img
                src="/images/logo-removebg-preview.png"
                alt="La Cannelle"
                className="h-24 md:h-28 lg:h-32 w-auto object-contain -my-2 md:-my-3"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              <a href="/home" className={desktopLinkClass('/home')}>{t.nav.home}</a>
              <a href="/services" className={desktopLinkClass('/services')}>{t.nav.services}</a>
              <a href="/menus" className={desktopLinkClass('/menus')}>{t.nav.menus}</a>
              <a href="/contact" className={desktopLinkClass('/contact')}>{t.nav.contact}</a>
              
              <button 
                onClick={toggleLanguage}
                aria-label={language === 'EN' ? commonA11y.switchToGerman : commonA11y.switchToEnglish}
                className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-amber-500 hover:text-amber-600 transition-all duration-300 font-medium flex items-center gap-2.5"
              >
                {language === 'EN' ? (
                  <>
                    <img src="/images/language/Flag_of_United_Kingdom-4096x2048.png" width={24} alt="English" className="rounded" />
                    <span>EN</span>
                  </>
                ) : (
                  <>
                    <img src="/images/language/Flag_of_Germany-4096x2453.png" width={24} alt="Deutsch" className="rounded" />
                    <span>DE</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={handleOrderClick}
                className="px-7 py-2.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
              >
                {t.nav.order}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-6 border-t border-gray-200">
              <div className="flex flex-col gap-5">
                <a href="/home" className={mobileLinkClass('/home')}>{t.nav.home}</a>
                <a href="/services" className={mobileLinkClass('/services')}>{t.nav.services}</a>
                <a href="/menus" className={mobileLinkClass('/menus')}>{t.nav.menus}</a>
                <a href="/contact" className={mobileLinkClass('/contact')}>{t.nav.contact}</a>
                
                <button 
                  onClick={toggleLanguage}
                  className="px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 font-medium flex items-center justify-center gap-2.5"
                >
                  {language === 'EN' ? (
                    <img src="/images/language/Flag_of_United_Kingdom-4096x2048.png" alt="English" className="h-5 w-auto rounded" />
                  ) : (
                    <img src="/images/language/Flag_of_Germany-4096x2453.png" alt="Deutsch" className="h-5 w-auto rounded" />
                  )}
                </button>
                
                <button 
                  onClick={handleOrderClick} 
                  className="px-6 py-3 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-all"
                >
                  {t.nav.order}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Premium */}
      <section className="pt-40 pb-24 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold mb-4">Our Services</p>
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
      <section id="office-catering" className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="text-amber-600" size={28} strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-display">{t.officeCatering.title}</h2>
              <p className="text-lg text-amber-600 font-medium mb-6">{t.officeCatering.subtitle}</p>
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
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-amber-200 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-amber-600"></div>
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
      <section id="event-catering" className="py-24 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-medium text-gray-900 mb-6 font-display">{t.labels.whatWeOffer}</h3>
                <ul className="space-y-4">
                  {t.eventCatering.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-amber-200 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className={`order-1 lg:order-2 transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="text-amber-600" size={28} strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-display">{t.eventCatering.title}</h2>
              <p className="text-lg text-amber-600 font-medium mb-6">{t.eventCatering.subtitle}</p>
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
      <section id="weddings" className="py-24 px-6 lg:px-8 bg-white">
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
              <div className="bg-gradient-to-br from-rose-50 to-amber-50 p-10 rounded-3xl border border-rose-200/50">
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
      <section id="corporate-events" className="py-24 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-medium text-gray-900 mb-6 font-display">{t.labels.whatWeOffer}</h3>
                <ul className="space-y-4">
                  {t.corporateEvents.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-amber-200 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-amber-600"></div>
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
      <section className="py-32 px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-6 font-display">{t.cta.title}</h2>
            <p className="text-xl text-gray-300 mb-10 font-light">{t.cta.subtitle}</p>
            <button
              onClick={() => handleOrderClick()}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-gray-900 rounded-full text-base font-medium transition-all duration-500 hover:bg-gray-100 hover:shadow-2xl hover:scale-105"
            >
              {t.cta.button}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-gray-900 text-white py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <h3 className="text-2xl font-light mb-4 font-display">{t.footer.brandTitle}</h3>
              <p className="text-gray-400 text-sm">{t.footer.brandTagline}</p>
            </div>
            
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{t.footer.quickLinks}</h4>
              <div className="flex flex-col gap-3">
                <a href="/home" className="text-gray-400 hover:text-white transition-colors">{t.nav.home}</a>
                <a href="/services" className="text-gray-400 hover:text-white transition-colors">{t.nav.services}</a>
                <a href="/menus" className="text-gray-400 hover:text-white transition-colors">{t.nav.menus}</a>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors">{t.nav.contact}</a>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{t.footer.contact}</h4>
              <div className="flex flex-col gap-3 text-gray-400">
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
              <div className="text-gray-400 text-sm space-y-1">
                <p>{t.footer.hoursWeekdays}</p>
                <p>{t.footer.hoursSaturday}</p>
                <p>{t.footer.hoursSunday}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
