"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Users, Award, Eye, Target, Building, Flag, Globe, Zap } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Star, Crown, Shield, Heart } from 'lucide-react';
import { menusApi, type Menu as ApiMenu } from '@/lib/api/menus';
import { productsApi, type Product } from '@/lib/api/products';
import { useTranslation } from '@/lib/hooks/useTranslation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRef } from 'react';
import { commonTranslations } from '@/lib/translations/common';
import type { Language } from '@/lib/hooks/useTranslation';
import { Clock, ChefHat, Flame } from 'lucide-react';
import { useMemo } from 'react';
import { Check } from 'lucide-react';
import MenuShowcaseHorizontal from '../components/page';
import { homeTranslations } from '@/lib/translations/home';

export default function CateringHomepage() {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const { language, toggleLanguage } = useTranslation('home');
  const t = homeTranslations[language];
  
  const [selectedMenu, setSelectedMenu] = useState<ApiMenu | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [menus, setMenus] = useState<ApiMenu[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const commonA11y = commonTranslations[language].accessibility;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        setIsLoadingData(true);
        setFetchError(null);
        const menusResult = await menusApi.getMenus({ includeImages: true });
        const nextMenus = (menusResult || []).map((menu) => ({
          ...menu,
          products: menu?.menuProducts ? menu.menuProducts.map((mp) => mp.productId) : menu?.products || [],
        }));
        setMenus(nextMenus);
      } catch (error) {
        console.error('Error loading menus:', error);
        setFetchError('Failed to load menu items. Please try again later.');
      } finally {
        setIsLoadingData(false);
      }
    };
    loadMenus();
  }, []);

  useEffect(() => {
    if (!selectedMenu) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMenu]);

  useEffect(() => {
    if (!selectedMenuItem) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMenuItem]);

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

  const handleOrderClick = (selectedProducts?: number[]) => {
    const query = selectedProducts?.length ? `?products=${selectedProducts.join(',')}` : '';
    router.push(`/order${query}`);
  };

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setIsLoadingData(true);
        setFetchError(null);
        const [fetchedMenus, fetchedProducts] = await Promise.all([
          menusApi.getMenus({ isActive: true, includeImages: true }),
          productsApi.getProducts({ available: true }),
        ]);
        const normalizedMenus = (fetchedMenus || []).map((menu) => ({
          ...menu,
          products: menu?.menuProducts ? menu.menuProducts.map((mp) => mp.productId) : menu?.products || [],
        }));
        setMenus(normalizedMenus);
        setProducts(fetchedProducts || []);
      } catch (error) {
        console.error('Failed to fetch menus/products', error);
        setFetchError(t.errors.menusLoadFailed);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadMenuData();
  }, []);

  const brandLogos = [
    { name: 'Montblanc', src: '/images/logos/montblanc.png' },
    { name: 'Omnicom Media Group', src: '/images/logos/omnicom-media-group.png' },
    { name: 'OMG', src: '/images/logos/omg.png' },
    { name: 'DoiT International', src: '/images/logos/doit.png' },
    { name: 'BBDO', src: '/images/logos/bbdo.png' },
    { name: 'IWC Schaffhausen', src: '/images/logos/iwc.png' },
    { name: 'Ruby Hotels', src: '/images/logos/ruby-hotels.svg' },
    { name: 'RIMOWA', src: '/images/logos/rimowa.png' },
    { name: 'Ralph Lauren', src: '/images/logos/ralph-lauren.jpg' },
    { name: 'Samsonite', src: '/images/logos/samsonite.png' },
    { name: 'SABIC', src: '/images/logos/sabic.png' },
  ];

  const quickMenuIcons = [Star, Heart, Shield, Crown];
  const quickMenuCategoryMeta = [
    { gradient: 'from-amber-200 via-amber-100 to-stone-100', countEn: '12 dishes', countDe: '12 Gerichte' },
    { gradient: 'from-rose-200 via-rose-100 to-stone-100', countEn: '8 menus', countDe: '8 Menüs' },
    { gradient: 'from-emerald-200 via-emerald-100 to-stone-100', countEn: '15 options', countDe: '15 Optionen' },
    { gradient: 'from-sky-200 via-sky-100 to-stone-100', countEn: '10 highlights', countDe: '10 Highlights' },
  ];

  const companyValues = [
    { icon: Target, ...t.company.values.mission },
    { icon: Eye, ...t.company.values.vision },
    { icon: Award, ...t.company.values.excellence },
    { icon: Users, ...t.company.values.community },
  ];

  const journeyIcons = [Flag, Award, Globe, Zap];
  const journeyMilestones = t.journey.milestones.map((milestone, index) => ({
    ...milestone,
    icon: journeyIcons[index] ?? Flag,
  }));

  const showcaseItems = (products.length
      ? products.slice(0, 3).map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price !== undefined ? `${product.price.toFixed(2)} EUR` : undefined,
        description: product.description,
        image: product.image,
        popular: product.popularity ? product.popularity >= 80 : false,
        featured: product.popularity ? product.popularity >= 60 : false,
        productIds: [product.id],
      }))
    : t.menuShowcase.items.map((item) => ({
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description,
        image: item.image,
        popular: item.popular,
        featured: item.featured,
      }))) as Array<{
    id?: number;
    name: string;
    category?: string;
    price?: string;
    description?: string;
    image?: string;
    popular?: boolean;
    featured?: boolean;
    productIds?: number[];
  }>;

  const featuredMenus = (menus.length
    ? menus.slice(0, 3).map((menu) => ({
        id: menu.id,
        name: menu.name,
        desc: menu.description || '',
        price: menu.price !== undefined ? `${menu.price.toFixed(2)} EUR` : undefined,
        productIds: menu.products,
      }))
    : t.menus.items.map((item) => ({
        name: item.name,
        desc: item.desc,
      }))) as Array<{
    id?: number;
    name: string;
    desc?: string;
    price?: string;
    productIds?: number[];
  }>;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
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

        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out; }
        .animate-fade-in-left { animation: fadeInLeft 0.8s ease-out; }
        .animate-fade-in-right { animation: fadeInRight 0.8s ease-out; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out; }
        .animate-logo-marquee { animation: marquee 50s linear infinite; will-change: transform; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-500 { animation-delay: 0.5s; }
        .animate-delay-1000 { animation-delay: 1s; }
        
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
        
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-2 { transform: rotateY(2deg); }
        
        html { scroll-behavior: smooth; }
        
        /* Premium text rendering */
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
                onClick={() => handleOrderClick()}
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
                  className="px-6 py-3 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-all" 
                  onClick={() => handleOrderClick()}
                >
                  {t.nav.order}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Premium Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/home_image.jpeg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center pt-32 pb-20">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-white mb-8 leading-tight font-display">
              {t.hero.title}
            </h1>
          </div>
          
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-lg lg:text-xl text-gray-200 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>
          </div>
          
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
            <button
              onClick={() => handleOrderClick()}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-gray-900 rounded-full text-base font-medium transition-all duration-500 hover:bg-amber-50 hover:shadow-2xl hover:scale-105"
            >
              {t.hero.cta}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-white/70">
            <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
            <div className="w-px h-16 bg-gradient-to-b from-white/70 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Brand Trust Section */}
      <section className="bg-gray-50 py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold mb-2">
              {t.brandBanner.title}
            </p>
            <div className="w-12 h-px bg-amber-600 mx-auto"></div>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex w-max items-center gap-20 animate-logo-marquee">
              {[...brandLogos, ...brandLogos].map((logo, idx) => (
                <div
                  key={`${logo.name}-${idx}`}
                  className="flex items-center justify-center h-20 px-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                >
                  <img
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    className="h-12 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Menu Categories - Premium Grid */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold mb-3">
                {t.quickMenu.title}
              </p>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-display">
                Curated Collections
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto text-base">{t.quickMenu.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.quickMenu.categories.map((category, index) => {
              const Icon = quickMenuIcons[index];
              const meta = quickMenuCategoryMeta[index];
              
              return (
                <div
                  key={index}
                  className={`group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-amber-500 hover:shadow-xl transition-all duration-500 cursor-pointer ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedCategory(index)}
                >
                  <div className="mb-6">
                    {Icon && <Icon className="text-amber-600 mb-4" size={32} strokeWidth={1.5} />}
                    <h3 className="text-xl font-medium text-gray-900 mb-2 font-display">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <ChevronRight size={18} className="text-amber-600" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Modals remain the same but with updated styling */}
        {selectedCategory === 0 && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/60 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                    {quickMenuIcons[selectedCategory] && 
                      React.createElement(quickMenuIcons[selectedCategory], { size: 24, className: "text-amber-600" })}
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 font-display">
                    {t.quickMenu.categories[selectedCategory].title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(85vh-120px)]">
                <p className="text-gray-700 mb-8 leading-relaxed">
                  {t.quickMenu.categories[selectedCategory].description}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <Star size={18} className="text-amber-500" />
                      {language === 'EN' ? 'Signature Dishes' : 'Signature-Gerichte'}
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Truffle-infused Wild Mushroom Risotto' : 'Trüffel-Wildpilz-Risotto'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Herb-crusted Rack of Lamb' : 'Kräuterkruste Lammkarree'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Seared Scallops with Citrus Beurre Blanc' : 'Gebratene Jakobsmuscheln mit Zitrus-Beurre Blanc'}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-lg">
                      <Award size={18} className="text-amber-500" />
                      {language === 'EN' ? 'Awards & Recognition' : 'Auszeichnungen'}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {language === 'EN' 
                        ? 'Our signature dishes have been awarded the "Culinary Excellence Award" three years in a row.'
                        : 'Unsere Signature-Gerichte wurden drei Jahre in Folge mit dem "Culinary Excellence Award" ausgezeichnet.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-lg">
                      <Clock size={18} className="text-amber-500" />
                      {language === 'EN' ? 'Preparation Time' : 'Zubereitungszeit'}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {language === 'EN' 
                        ? 'Each signature dish requires 30-45 minutes of meticulous preparation by our master chefs.'
                        : 'Jedes Signature-Gericht erfordert 30-45 Minuten sorgfältiger Zubereitung durch unsere Meisterköche.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Similar modal updates for categories 1, 2, and 3 */}
        {selectedCategory === 1 && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/60 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                    {quickMenuIcons[selectedCategory] && 
                      React.createElement(quickMenuIcons[selectedCategory], { size: 24, className: "text-rose-600" })}
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 font-display">
                    {t.quickMenu.categories[selectedCategory].title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(85vh-120px)]">
                <p className="text-gray-700 mb-8 leading-relaxed">
                  {t.quickMenu.categories[selectedCategory].description}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <ChefHat size={18} className="text-rose-500" />
                      {language === 'EN' ? 'Chef\'s Creations' : 'Kreationen des Küchenchefs'}
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Seasonal Market Menu' : 'Saisonale Marktkarte'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Tasting Experience' : 'Degustationserlebnis'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Secret Family Recipes' : 'Geheime Familienrezepte'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 2 && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/60 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    {quickMenuIcons[selectedCategory] && 
                      React.createElement(quickMenuIcons[selectedCategory], { size: 24, className: "text-emerald-600" })}
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 font-display">
                    {t.quickMenu.categories[selectedCategory].title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(85vh-120px)]">
                <p className="text-gray-700 mb-8 leading-relaxed">
                  {t.quickMenu.categories[selectedCategory].description}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <Shield size={18} className="text-emerald-500" />
                      {language === 'EN' ? 'Premium Guarantee' : 'Premium-Garantie'}
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Wagyu Beef Selection' : 'Wagyu-Rindfleisch-Auswahl'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Caviar & Champagne Pairing' : 'Kaviar & Champagner-Paarung'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Aged Gourmet Cheeses' : 'Gereifte Gourmet-Käse'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 3 && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/60 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center">
                    {quickMenuIcons[selectedCategory] && 
                      React.createElement(quickMenuIcons[selectedCategory], { size: 24, className: "text-sky-600" })}
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 font-display">
                    {t.quickMenu.categories[selectedCategory].title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(85vh-120px)]">
                <p className="text-gray-700 mb-8 leading-relaxed">
                  {t.quickMenu.categories[selectedCategory].description}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <Crown size={18} className="text-sky-500" />
                      {language === 'EN' ? 'Royal Offerings' : 'Königliche Angebote'}
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Gold Leaf Desserts' : 'Goldblatt-Desserts'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Truffle & Foie Gras Menu' : 'Trüffel & Foie Gras Menü'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Vintage Wine Pairing' : 'Jahrgangswein-Paarung'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Menu Item Modal */}
      {selectedMenuItem && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedMenuItem(null)}
              className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors shadow-lg"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 relative">
                <div className="h-80 lg:h-full">
                  <img
                    src={selectedMenuItem.image || '/images/home_image.jpeg'}
                    alt={selectedMenuItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                
                {selectedMenuItem.popular && (
                  <div className="absolute top-6 left-6">
                    <div className="bg-white text-amber-600 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 shadow-lg">
                      <Flame size={16} />
                      {t.menuShowcase.badges.popular}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:w-1/2 p-10 overflow-y-auto max-h-[90vh]">
                <p className="text-amber-600 font-medium text-sm mb-3 uppercase tracking-wider">
                  {selectedMenuItem.category || t.quickMenu.title}
                </p>
                <h2 className="text-3xl font-light text-gray-900 font-display mb-4">
                  {selectedMenuItem.name}
                </h2>
                {selectedMenuItem.price && (
                  <div className="text-2xl font-medium text-amber-600 mb-6">
                    {selectedMenuItem.price}
                  </div>
                )}
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {selectedMenuItem.description}
                </p>

                {selectedMenuItem.ingredients && (
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-900 mb-4 text-lg">
                      {language === 'EN' ? 'Ingredients' : 'Zutaten'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMenuItem.ingredients.map((ingredient: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <MenuShowcaseHorizontal 
        limit={6}
        showViewAll={true}
        title={t.menus?.title || "Our Featured Menus"}
        description={t.menus?.description || "Discover our carefully crafted culinary experiences"}
        language={language}
      />

      {/* Passion Section - Premium */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="max-w-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold mb-4">
                  {t.passion.subtitle}
                </p>
                <h2 className="text-4xl lg:text-5xl font-light text-white mb-6 font-display leading-tight">
                  {t.passion.title}
                </h2>
                <p className="text-gray-300 leading-relaxed mb-10 text-lg">
                  {t.passion.text}
                </p>

                <div className="space-y-6 mb-10">
                  {t.passion.skills.map((item, index) => (
                    <div key={index} className="group">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-200 font-medium">{item.title}</span>
                        <span className="text-amber-400">{90 - index * 8}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${90 - index * 8}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{item.description}</p>
                    </div>
                  ))}
                </div>

                <button className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2">
                  {t.passion.cta}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="relative group">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/chef-passion.jpg"
                    alt="Chef's passion"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="text-center">
                    <Award size={24} className="mx-auto mb-2 text-amber-600" />
                    <p className="text-sm font-semibold text-gray-900">Master Chef</p>
                    <p className="text-xs text-gray-600">15+ Years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold mb-3">
              {t.company.subtitle}
            </p>
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-display">
              {t.company.title}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {t.company.text}
              </p>

              <div className="grid grid-cols-2 gap-6">
                {companyValues.map((value, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                      <value.icon className="text-amber-600" size={20} />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="relative group">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/restaurant-interior.jpg"
                    alt="Restaurant interior"
                    className="w-full h-96 object-cover"
                  />
                </div>

                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-6 shadow-2xl">
                  <Award className="mx-auto mb-2 text-amber-600" size={24} />
                  <p className="text-sm font-semibold text-gray-900">{t.company.badge.title}</p>
                  <p className="text-xs text-gray-600">{t.company.badge.subtitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-light text-gray-900 text-center mb-12 font-display">{t.journey.title}</h3>
            <div className="grid md:grid-cols-4 gap-8">
              {journeyMilestones.map((milestone, index) => (
                <div key={index} className="text-center relative">
                  {index < 3 && (
                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-gray-200"></div>
                  )}
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
                    <milestone.icon className="text-amber-600" size={22} />
                  </div>
                  <p className="text-sm font-semibold text-amber-600 mb-2">{milestone.date}</p>
                  <p className="text-gray-700 font-medium">{milestone.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold mb-3">{t.quickMenu.title}</p>
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-display">{t.services.title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Tailored experiences for every occasion</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.services.items.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-amber-500 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-medium text-gray-900 font-display mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menus Section */}
      <section className="py-24 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-display">{t.menus.title}</h2>
            <p className="text-gray-600 text-lg">{t.menus.description}</p>
          </div>

          {fetchError && !menus.length && (
            <p className="text-center text-red-600 mb-8">{fetchError}</p>
          )}
          {isLoadingData && !menus.length && (
            <LoadingSpinner className="mb-8" label="Loading menus..." />
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {featuredMenus.map((menu, index) => (
              <div
                key={menu.id ?? index}
                className="bg-white p-8 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-medium text-gray-900 font-display">{menu.name}</h3>
                  {menu.price && (
                    <span className="text-amber-600 font-semibold">{menu.price}</span>
                  )}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{menu.desc}</p>
                <button
                  className="text-amber-600 font-medium inline-flex items-center gap-2 hover:gap-3 transition-all group"
                  onClick={() => handleOrderClick(menu.productIds)}
                >
                  {t.menus.cta}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-display">{t.testimonials.title}</h2>
            <p className="text-gray-600 text-lg">What our clients say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl border border-gray-200"
              >
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <p className="text-gray-900 font-medium font-display">{testimonial.name}</p>
                <p className="text-sm text-amber-600">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-light mb-4 font-display">Gourmet Catering</h3>
              <p className="text-gray-400 text-sm">{t.footer.tagline}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{t.footer.quickLinksTitle}</h4>
              <div className="flex flex-col gap-3">
                <a href="#services" className="text-gray-400 hover:text-white transition-colors">{t.nav.services}</a>
                <a href="#menus" className="text-gray-400 hover:text-white transition-colors">{t.nav.menus}</a>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">{t.nav.contact}</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{t.footer.contactTitle}</h4>
              <div className="flex flex-col gap-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <Phone size={16} />
                  <span className="text-sm">{t.footer.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} />
                  <span className="text-sm">{t.footer.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span className="text-sm">{t.footer.contact.location}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{t.footer.hoursTitle}</h4>
              <div className="text-gray-400 text-sm space-y-1">
                <p>{t.footer.hours.weekdays}</p>
                <p>{t.footer.hours.saturday}</p>
                <p>{t.footer.hours.sunday}</p>
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
