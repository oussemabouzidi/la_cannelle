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
    `${isActiveHref(href) ? 'text-amber-700 font-semibold' : 'text-gray-900 hover:text-amber-700 font-medium'} transition-all duration-300 transform hover:scale-105`;

  const mobileLinkClass = (href: string) =>
    `${isActiveHref(href) ? 'text-amber-700 font-semibold' : 'text-gray-900 hover:text-amber-700 font-medium'} transition-all duration-300 transform hover:translate-x-2`;

  const handleOrderClick = () => {
    router.push('/order');
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Translations are in lib/translations/services.ts
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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out;
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
              <a href="/home" className={desktopLinkClass('/home')}>{t.nav.home}</a>
              <a href="/services" className={desktopLinkClass('/services')}>{t.nav.services}</a>
              <a href="/menus" className={desktopLinkClass('/menus')}>{t.nav.menus}</a>
              <a href="/contact" className={desktopLinkClass('/contact')}>{t.nav.contact}</a>
              <button 
  onClick={toggleLanguage}
  aria-label={language === 'EN' ? commonA11y.switchToGerman : commonA11y.switchToEnglish}
  className="px-4 py-2 text-sm border border-amber-300 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-300 transform hover:scale-105 font-medium flex items-center gap-2"
>
  {language === 'EN' ? (
    <>
      <span className="text-lg"><img src="images/language/Flag_of_United_Kingdom-4096x2048.png" width={27} alt={commonA11y.englishFlagAlt} /></span>
      English
    </>
  ) : (
    <>
      <span className="text-lg"><img src="images/language/Flag_of_Germany-4096x2453.png" width={25} alt={commonA11y.germanFlagAlt} /></span>
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
                <a href="/home" className={mobileLinkClass('/home')}>{t.nav.home}</a>
                <a href="/about" className={mobileLinkClass('/about')}>{t.nav.about}</a>
                <a href="/services" className={mobileLinkClass('/services')}>{t.nav.services}</a>
                <a href="/menus" className={mobileLinkClass('/menus')}>{t.nav.menus}</a>
                <a href="/contact" className={mobileLinkClass('/contact')}>{t.nav.contact}</a>
                <button 
                  onClick={toggleLanguage}
                  aria-label={language === 'EN' ? commonA11y.switchToGerman : commonA11y.switchToEnglish}
                  className="px-4 py-2 text-sm border border-amber-300 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 w-full font-medium transition-all duration-300 flex items-center justify-center"
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
                <button onClick={handleOrderClick} className="px-6 py-2 text-sm bg-amber-700 text-white rounded-lg hover:bg-amber-800 font-medium transition-all duration-300 transform hover:scale-105">
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



      {/* Office Catering */}
      <section id="office-catering" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: "url('/images/services/office.jpg')",
          }}
        ></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                <Briefcase className="text-amber-700" size={32} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-elegant italic">{t.officeCatering.title}</h2>
              <p className="text-lg text-amber-700 font-semibold mb-4 italic">{t.officeCatering.subtitle}</p>
              <p className="text-gray-600 leading-relaxed mb-6 font-light">{t.officeCatering.description}</p>
              
              {/* Image Placeholder */}
              <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 h-48 overflow-hidden">
                  <img
                    src="/images/services/office.jpg"
                    alt={t.officeCatering.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-amber-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-elegant italic">{t.labels.whatWeOffer}</h3>
                <ul className="space-y-3">
                  {t.officeCatering.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <ChevronRight className="text-amber-700 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" size={20} />
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Catering */}
      <section id="event-catering" className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: "url('/images/services/event.jpg')",
          }}
        ></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`order-2 md:order-1 transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-amber-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-elegant italic">{t.labels.whatWeOffer}</h3>
                <ul className="space-y-3">
                  {t.eventCatering.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <ChevronRight className="text-amber-700 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" size={20} />
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className={`order-1 md:order-2 transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                <Users className="text-amber-700" size={32} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-elegant italic">{t.eventCatering.title}</h2>
              <p className="text-lg text-amber-700 font-semibold mb-4 italic">{t.eventCatering.subtitle}</p>
              <p className="text-gray-600 leading-relaxed mb-6 font-light">{t.eventCatering.description}</p>
              
              {/* Image Placeholder */}
              <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gradient-to-br from-amber-200 to-amber-300 h-48 overflow-hidden">
                  <img
                    src="/images/services/event.jpg"
                    alt={t.eventCatering.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weddings */}
      <section id="weddings" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: "url('/images/services/weddings.jpg')",
          }}
        ></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                <Heart className="text-amber-700" size={32} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-elegant italic">{t.weddings.title}</h2>
              <p className="text-lg text-amber-700 font-semibold mb-4 italic">{t.weddings.subtitle}</p>
              <p className="text-gray-600 leading-relaxed mb-6 font-light">{t.weddings.description}</p>
              
              {/* Image Placeholder */}
              <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gradient-to-br from-pink-100 to-amber-100 h-48 overflow-hidden">
                  <img
                    src="/images/services/weddings.jpg"
                    alt={t.weddings.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-amber-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-elegant italic">{t.labels.whatWeOffer}</h3>
                <ul className="space-y-3">
                  {t.weddings.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <ChevronRight className="text-amber-700 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" size={20} />
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Events */}
      <section id="corporate-events" className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: "url('/images/services/corporate.jpg')",
          }}
        ></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`order-2 md:order-1 transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-amber-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-elegant italic">{t.labels.whatWeOffer}</h3>
                <ul className="space-y-3">
                  {t.corporateEvents.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <ChevronRight className="text-amber-700 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" size={20} />
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className={`order-1 md:order-2 transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                <Building2 className="text-amber-700" size={32} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-elegant italic">{t.corporateEvents.title}</h2>
              <p className="text-lg text-amber-700 font-semibold mb-4 italic">{t.corporateEvents.subtitle}</p>
              <p className="text-gray-600 leading-relaxed mb-6 font-light">{t.corporateEvents.description}</p>
              
              {/* Image Placeholder */}
              <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gradient-to-br from-blue-100 to-amber-100 h-48 overflow-hidden">
                  <img
                    src="/images/services/corporate.jpg"
                    alt={t.corporateEvents.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-700 to-amber-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-white mb-4 font-elegant italic">{t.cta.title}</h2>
            <p className="text-xl text-amber-100 mb-8 font-light italic">{t.cta.subtitle}</p>
            <button
              onClick={()=> handleOrderClick()}
              className="group w-full sm:w-auto justify-center px-6 sm:px-10 py-4 bg-white text-amber-700 rounded-lg text-lg font-semibold hover:bg-amber-50 transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-xl hover:shadow-2xl duration-300"
            >
              {t.cta.button}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <h3 className="text-2xl font-bold mb-4 font-elegant italic">{t.footer.brandTitle}</h3>
              <p className="text-gray-400 italic">{t.footer.brandTagline}</p>
            </div>
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{t.footer.quickLinks}</h4>
              <div className="flex flex-col gap-2">
                <a href="#about" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.about}</a>
                <a href="#services" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.services}</a>
                <a href="#menus" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.menus}</a>
                <a href="#contact" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.contact}</a>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{t.footer.contact}</h4>
              <div className="flex flex-col gap-3 text-gray-400">
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Phone size={18} />
                  <span>{t.footer.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Mail size={18} />
                  <span>{t.footer.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <MapPin size={18} />
                  <span>{t.footer.contactAddress}</span>
                </div>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{t.footer.hoursTitle}</h4>
              <p className="text-gray-400">{t.footer.hoursWeekdays}</p>
              <p className="text-gray-400">{t.footer.hoursSaturday}</p>
              <p className="text-gray-400">{t.footer.hoursSunday}</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
