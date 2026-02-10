"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, Phone, Mail, MapPin, Users, Award, Eye, Target, Building, Flag, Globe, Zap, X, ArrowUpRight, PlayCircle } from 'lucide-react';
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
import SiteHeader from '@/components/site/SiteHeader';
import { createPortal } from 'react-dom';

function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function CateringHomepage() {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const { language, toggleLanguage } = useTranslation('home');
  const t = homeTranslations[language];
  
  const [selectedMenu, setSelectedMenu] = useState<ApiMenu | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [menus, setMenus] = useState<ApiMenu[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const commonNav = commonTranslations[language].nav;
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

  useEffect(() => {
    if (selectedCategory == null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedCategory]);

  const router = useRouter();
  const pathname = usePathname();

  const handleOrderClick = (selectedProducts?: number[]) => {
    const query = selectedProducts?.length ? `?products=${selectedProducts.join(',')}` : '';
    router.push(`/order${query}`);
  };
  
  const handlePlanClick = () => {
    router.push('/contact');
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
    { gradient: 'from-[#A69256]/25 via-white to-[#F2F2F2]', countEn: '12 dishes', countDe: '12 Gerichte' },
    { gradient: 'from-[#404040]/15 via-white to-[#F2F2F2]', countEn: '8 menus', countDe: '8 MenÃƒÂ¼s' },
    { gradient: 'from-[#A6A6A6]/18 via-white to-[#F2F2F2]', countEn: '15 options', countDe: '15 Optionen' },
    { gradient: 'from-[#A69256]/15 via-white to-[#F2F2F2]', countEn: '10 highlights', countDe: '10 Highlights' },
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
    <div className="min-h-screen bg-[#F2F2F2] overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Open+Sans:wght@300;400;500;600;700&display=swap');
        
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
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-500 { animation-delay: 0.5s; }
        .animate-delay-1000 { animation-delay: 1s; }
        
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

      <SiteHeader
        language={language}
        toggleLanguage={toggleLanguage}
        pathname={pathname}
        nav={{
          home: t.nav.home || commonNav.home,
          services: t.nav.services || commonNav.services,
          menus: t.nav.menus || commonNav.menus,
          contact: t.nav.contact || commonNav.contact,
          order: t.nav.order || commonNav.order,
        }}
        a11y={commonA11y}
        onOrderClick={handleOrderClick}
      />

      {/* Hero Section - Premium Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ minHeight: '100svh' }}>
        <div
          className="absolute inset-0 bg-cover bg-center lux-hero-image"
          style={{ backgroundImage: "url('/images/home_image.jpeg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-40 pb-20 sm:pb-28 w-full">
          <div className="grid lg:grid-cols-12 items-center gap-12">
            <div className="lg:col-span-7 text-center lg:text-left">
              <p className={`text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75 mb-5 ${isVisible ? 'animate-fade-in-down lux-type lux-type-run lux-type-caret' : 'opacity-0'}`}>
                Beyond taste
              </p>

              <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-white mb-7 leading-tight font-display">
                  {t.hero.title}
                </h1>
              </div>

              <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                 <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-10 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                   {t.hero.subtitle}
                 </p>
              </div>

              <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <button
                    onClick={handlePlanClick}
                    className="group inline-flex items-center justify-center gap-3 px-9 py-4 bg-[#A69256] text-[#0D0D0D] rounded-full text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-500 hover:brightness-95 hover:shadow-2xl hover:scale-[1.02]"
                  >
                    {t.hero.cta}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </button>

                  <button
                    onClick={() => handleOrderClick()}
                    className="inline-flex items-center justify-center px-9 py-4 rounded-full text-sm font-semibold uppercase tracking-[0.18em] text-white border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-colors"
                  >
                    {commonNav.order}
                  </button>
                </div>
              </div>

              <ul className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-xs font-medium uppercase tracking-[0.22em] text-white/75">
                <li className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]"></span>
                  Crafted menus
                </li>
                <li className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]"></span>
                  Seamless delivery
                </li>
                <li className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]"></span>
                  Premium service
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:block absolute bottom-10 left-1/2 transform -translate-x-1/2 pointer-events-none select-none">
          <div className="flex flex-col items-center gap-2 text-white/70">
            <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
            <div className="w-px h-14 bg-gradient-to-b from-white/70 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Brand Banner (FoodExplorer-inspired marquee) */}
      <section className="bg-black py-10 sm:py-14 border-y border-white/10 lux-reveal" data-lux-delay="60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60 mb-3 lux-reveal lux-type" data-lux-delay="40">
              {t.brandBanner.title}
            </p>
            <div className="w-12 h-px bg-white/20 mx-auto"></div>
          </div>

          <div className="lux-marquee" style={{ ['--lux-marquee-duration' as any]: '30s' }} aria-label={t.brandBanner.title}>
            <div className="lux-marquee-track">
              {brandLogos.map((logo) => (
                <div key={logo.name} className="lux-marquee-item">
                  <img src={logo.src} alt={`${logo.name} logo`} loading="lazy" decoding="async" />
                </div>
              ))}
              {brandLogos.map((logo) => (
                <div key={`${logo.name}-dup`} className="lux-marquee-item" aria-hidden="true">
                  <img src={logo.src} alt="" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Menu Categories - Premium Grid */}
      <section id="collections" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-black/10 lux-reveal" data-lux-delay="40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/60 mb-3">
                {t.quickMenu.title}
              </p>
              <h2 className="text-4xl lg:text-5xl font-semibold text-black mb-4 font-display">
                Curated Collections
              </h2>
              <p className="text-black/70 max-w-xl mx-auto text-base">{t.quickMenu.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.quickMenu.categories.map((category, index) => {
              const Icon = quickMenuIcons[index];
              
              return (
                <button
                  key={index}
                  type="button"
                  className={`group relative bg-white rounded-2xl p-6 sm:p-8 border border-black/10 hover:border-black/20 hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)] transition-all duration-500 cursor-pointer ${isVisible ? 'animate-scale-in' : 'opacity-0'} hover:bg-black`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedCategory(index)}
                >
                  <div className="mb-6">
                    {Icon && <Icon className="text-black/70 mb-4 group-hover:text-white/85 transition-colors" size={32} strokeWidth={1.5} />}
                    <h3 className="text-xl font-semibold text-black mb-2 font-display group-hover:text-white transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-black/70 text-sm leading-relaxed group-hover:text-white/70 transition-colors">
                      {category.description}
                    </p>
                  </div>

                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center">
                      <ChevronRight size={18} className="text-white/85" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Modals remain the same but with updated styling */}
        {selectedCategory === 0 && (
          <BodyPortal>
            <div className="fixed inset-0 bg-[#0D0D0D]/55 supports-[backdrop-filter]:bg-[#0D0D0D]/45 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
             <div className="lux-modal bg-gradient-to-b from-white/80 via-white/75 to-white/70 backdrop-blur-2xl border border-white/35 ring-1 ring-[#A69256]/15 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.38)]">
              <div className="p-5 sm:p-8 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#A69256]/15 rounded-2xl flex items-center justify-center">
                    {quickMenuIcons[selectedCategory] && 
                      React.createElement(quickMenuIcons[selectedCategory], { size: 24, className: "text-[#A69256]" })}
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

              <div className="p-5 sm:p-8 overflow-y-auto max-h-[calc(85vh-120px)]">
                <p className="text-gray-700 mb-8 leading-relaxed">
                  {t.quickMenu.categories[selectedCategory].description}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <Star size={18} className="text-[#A69256]" />
                      {language === 'EN' ? 'Signature Dishes' : 'Signature-Gerichte'}
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-[#A69256] rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Truffle-infused Wild Mushroom Risotto' : 'TrÃƒÂ¼ffel-Wildpilz-Risotto'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-[#A69256] rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Herb-crusted Rack of Lamb' : 'KrÃƒÂ¤uterkruste Lammkarree'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-[#A69256] rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Seared Scallops with Citrus Beurre Blanc' : 'Gebratene Jakobsmuscheln mit Zitrus-Beurre Blanc'}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-lg">
                      <Award size={18} className="text-[#A69256]" />
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
                      <Clock size={18} className="text-[#A69256]" />
                      {language === 'EN' ? 'Preparation Time' : 'Zubereitungszeit'}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {language === 'EN' 
                        ? 'Each signature dish requires 30-45 minutes of meticulous preparation by our master chefs.'
                        : 'Jedes Signature-Gericht erfordert 30-45 Minuten sorgfÃƒÂ¤ltiger Zubereitung durch unsere MeisterkÃƒÂ¶che.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </BodyPortal>
        )}

        {/* Similar modal updates for categories 1, 2, and 3 */}
        {selectedCategory === 1 && (
          <BodyPortal>
            <div className="fixed inset-0 bg-[#0D0D0D]/55 supports-[backdrop-filter]:bg-[#0D0D0D]/45 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
             <div className="lux-modal bg-gradient-to-b from-white/80 via-white/75 to-white/70 backdrop-blur-2xl border border-white/35 ring-1 ring-[#A69256]/15 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.38)]">
              <div className="p-5 sm:p-8 border-b border-gray-200 flex justify-between items-center">
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

              <div className="p-5 sm:p-8 overflow-y-auto max-h-[calc(85vh-120px)]">
                <p className="text-gray-700 mb-8 leading-relaxed">
                  {t.quickMenu.categories[selectedCategory].description}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <ChefHat size={18} className="text-rose-500" />
                      {language === 'EN' ? 'Chef\'s Creations' : 'Kreationen des KÃƒÂ¼chenchefs'}
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Seasonal Market Menu' : 'Saisonale Marktkarte'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Tasting Experience' : 'Degustationserlebnis'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Secret Family Recipes' : 'Geheime Familienrezepte'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </BodyPortal>
        )}

        {selectedCategory === 2 && (
          <BodyPortal>
            <div className="fixed inset-0 bg-[#0D0D0D]/55 supports-[backdrop-filter]:bg-[#0D0D0D]/45 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
             <div className="lux-modal bg-gradient-to-b from-white/80 via-white/75 to-white/70 backdrop-blur-2xl border border-white/35 ring-1 ring-[#A69256]/15 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.38)]">
              <div className="p-5 sm:p-8 border-b border-gray-200 flex justify-between items-center">
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

              <div className="p-5 sm:p-8 overflow-y-auto max-h-[calc(85vh-120px)]">
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
                      <li className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Wagyu Beef Selection' : 'Wagyu-Rindfleisch-Auswahl'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Caviar & Champagne Pairing' : 'Kaviar & Champagner-Paarung'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Aged Gourmet Cheeses' : 'Gereifte Gourmet-KÃƒÂ¤se'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </BodyPortal>
        )}

        {selectedCategory === 3 && (
          <BodyPortal>
            <div className="fixed inset-0 bg-[#0D0D0D]/55 supports-[backdrop-filter]:bg-[#0D0D0D]/45 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
             <div className="lux-modal bg-gradient-to-b from-white/80 via-white/75 to-white/70 backdrop-blur-2xl border border-white/35 ring-1 ring-[#A69256]/15 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.38)]">
              <div className="p-5 sm:p-8 border-b border-gray-200 flex justify-between items-center">
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

              <div className="p-5 sm:p-8 overflow-y-auto max-h-[calc(85vh-120px)]">
                <p className="text-gray-700 mb-8 leading-relaxed">
                  {t.quickMenu.categories[selectedCategory].description}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <Crown size={18} className="text-sky-500" />
                      {language === 'EN' ? 'Royal Offerings' : 'KÃƒÂ¶nigliche Angebote'}
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Gold Leaf Desserts' : 'Goldblatt-Desserts'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Truffle & Foie Gras Menu' : 'TrÃƒÂ¼ffel & Foie Gras MenÃƒÂ¼'}</span>
                      </li>
                      <li className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{language === 'EN' ? 'Vintage Wine Pairing' : 'Jahrgangswein-Paarung'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </BodyPortal>
        )}
      </section>

      {/* Menu Item Modal */}
      {selectedMenuItem && (
        <BodyPortal>
          <div className="fixed inset-0 bg-[#0D0D0D]/55 supports-[backdrop-filter]:bg-[#0D0D0D]/45 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="lux-modal bg-gradient-to-b from-white/80 via-white/75 to-white/70 backdrop-blur-2xl border border-white/35 ring-1 ring-[#A69256]/15 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.38)]">
            <button
              onClick={() => setSelectedMenuItem(null)}
              className="absolute top-6 right-6 z-10 bg-white/75 backdrop-blur-md rounded-full p-3 hover:bg-white/90 transition-colors shadow-lg ring-1 ring-black/10 hover:ring-[#A69256]/20"
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
                    <div className="bg-white text-[#A69256] px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 shadow-lg">
                      <Flame size={16} />
                      {t.menuShowcase.badges.popular}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:w-1/2 p-6 sm:p-10 overflow-y-auto max-h-[90vh] bg-white/35 backdrop-blur-sm lg:border-l border-black/5">
                <p className="text-[#A69256] font-medium text-sm mb-3 uppercase tracking-wider">
                  {selectedMenuItem.category || t.quickMenu.title}
                </p>
                <h2 className="text-3xl font-light text-gray-900 font-display mb-4">
                  {selectedMenuItem.name}
                </h2>
                {selectedMenuItem.price && (
                  <div className="text-2xl font-medium text-[#A69256] mb-6">
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
                          className="px-4 py-2 bg-white/55 backdrop-blur-sm border border-black/10 text-gray-800 rounded-full text-sm"
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
        </BodyPortal>
      )}

      <MenuShowcaseHorizontal 
        limit={6}
        showViewAll={true}
        title={t.menus?.title || "Our Featured Menus"}
        description={t.menus?.description || "Discover our carefully crafted culinary experiences"}
        language={language}
      />

      {/* Passion Section (FoodExplorer-inspired: black/white, airy, minimal) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-14 items-center">
            <div className={`lg:col-span-5 transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="rounded-2xl overflow-hidden ring-1 ring-black/10 shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
                <div className="relative aspect-[3/4]">
                  <img
                    src="/images/chef-passion.jpg"
                    alt="Chef's passion"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
                  <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 backdrop-blur-sm px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
                    <Award size={16} className="text-white/80" />
                    {language === 'DE' ? 'CHEF-LED' : 'CHEF-LED'}
                  </div>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-7 transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/60 mb-5">
                {t.passion.subtitle}
              </p>
              <h2 className="text-4xl lg:text-5xl font-semibold text-black mb-6 font-display leading-tight lux-reveal lux-type" data-lux-delay="80">
                {t.passion.title}
              </h2>
              <p className="text-black/70 leading-relaxed mb-10 text-lg">
                {t.passion.text}
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {t.passion.skills.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-black/10 p-6 hover:border-black/20 transition-colors">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/60">
                      {language === 'DE' ? 'DETAIL' : 'DETAIL'}
                    </p>
                    <p className="mt-3 text-base font-semibold text-black">{item.title}</p>
                    <p className="mt-2 text-sm text-black/70 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values Section (black/white) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-black/10">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/60 mb-3">
              {t.company.subtitle}
            </p>
            <h2 className="text-4xl lg:text-5xl font-semibold text-black mb-4 font-display lux-reveal lux-type" data-lux-delay="60">
              {t.company.title}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <p className="text-black/70 leading-relaxed mb-10 text-lg">
                {t.company.text}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {companyValues.map((value, index) => (
                  <div
                    key={index}
                    className="group rounded-2xl p-6 border border-black/10 bg-white transition-colors duration-300 hover:bg-black hover:border-black"
                  >
                    <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-white/10">
                      <value.icon className="text-black/70 group-hover:text-white/85" size={20} />
                    </div>
                    <h3 className="font-semibold text-black group-hover:text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-black/70 group-hover:text-white/70">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="relative group">
                <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10 shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
                  <img
                    src="/images/restaurant-interior.jpg"
                    alt="Restaurant interior"
                    className="w-full h-72 sm:h-96 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-black text-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/10">
                  <Award className="mx-auto mb-2 text-white/80" size={24} />
                  <p className="text-sm font-semibold">{t.company.badge.title}</p>
                  <p className="text-xs text-white/70">{t.company.badge.subtitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-black/10">
            <h3 className="text-2xl font-semibold text-black text-center mb-12 font-display lux-reveal lux-type" data-lux-delay="40">{t.journey.title}</h3>
            <div className="grid md:grid-cols-4 gap-8">
              {journeyMilestones.map((milestone, index) => (
                <div key={index} className="text-center relative">
                  {index < 3 && (
                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-black/10"></div>
                  )}
                  <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10 ring-1 ring-black/10">
                    <milestone.icon className="text-black/70" size={22} />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/60 mb-2">{milestone.date}</p>
                  <p className="text-black font-semibold">{milestone.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="service-formats" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-black text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60 mb-3">{t.quickMenu.title}</p>
            <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-4 font-display">{t.services.title}</h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">Tailored experiences for every occasion</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.services.items.map((service, index) => (
              <div
                key={index}
                className="group bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white font-display mb-3">{service.title}</h3>
                <p className="text-white/70 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menus Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/60 mb-3">
              {language === 'DE' ? 'MENÜS' : 'MENUS'}
            </p>
            <h2 className="text-4xl lg:text-5xl font-semibold text-black mb-4 font-display">{t.menus.title}</h2>
            <p className="text-black/70 text-lg">{t.menus.description}</p>
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
                className="group bg-white p-6 sm:p-8 rounded-2xl transition-all duration-300 border border-black/10 hover:border-black/20 hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-black font-display">{menu.name}</h3>
                  {menu.price && (
                    <span className="text-black/70 font-semibold">{menu.price}</span>
                  )}
                </div>
                <p className="text-black/70 mb-6 leading-relaxed">{menu.desc}</p>
                <button
                  className="text-black font-semibold inline-flex items-center gap-2 transition-all group-hover:gap-3"
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
      <section id="testimonials" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/60 mb-3">
              {language === 'DE' ? 'FEEDBACK' : 'FEEDBACK'}
            </p>
            <h2 className="text-4xl lg:text-5xl font-semibold text-black mb-4 font-display lux-reveal lux-type" data-lux-delay="60">{t.testimonials.title}</h2>
            <p className="text-black/70 text-lg lux-reveal lux-type" data-lux-delay="120">What our clients say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-black/10 hover:border-black/20 transition-colors"
              >
                <p className="text-black/80 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <p className="text-black font-semibold font-display">{testimonial.name}</p>
                <p className="text-sm text-black/60">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lookbook + Reels */}
      <section id="lookbook" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F2F2F2] border-t border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/60 mb-3">
                {language === 'DE' ? 'LOOKBOOK' : 'LOOKBOOK'}
              </p>
              <h2 className="text-4xl lg:text-5xl font-semibold text-black mb-4 font-display lux-reveal lux-type" data-lux-delay="60">
                {language === 'DE' ? 'Signature Moments' : 'Signature moments'}
              </h2>
              <p className="text-black/70 text-lg lux-reveal lux-type" data-lux-delay="120">
                {language === 'DE'
                  ? 'Ein Einblick in Private Dining, Brand Launches und unvergessliche Feiern.'
                  : 'A glimpse into private dining, brand launches, and unforgettable celebrations.'}
              </p>
            </div>

            <a
              href="https://www.instagram.com/lacannellecatering/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-black/90 transition-colors"
            >
              {language === 'DE' ? 'Reels ansehen' : 'Watch reels'}
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <a
              href="https://www.instagram.com/lacannellecatering/"
              target="_blank"
              rel="noreferrer"
              className="group relative lg:col-span-7 overflow-hidden rounded-3xl border border-black/10 bg-black aspect-[16/10] shadow-[0_24px_70px_rgba(0,0,0,0.12)]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 will-change-transform group-hover:scale-[1.04]"
                style={{ backgroundImage: "url('/images/exclusive-dining.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute left-6 bottom-6 right-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                  {language === 'DE' ? 'Private Dining' : 'Private dining'}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white font-display">
                  {language === 'DE' ? 'Cinematic service, bis ins Detail.' : 'Cinematic service, down to the detail.'}
                </h3>
              </div>
              <div className="absolute top-6 right-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                <PlayCircle size={16} />
                {language === 'DE' ? 'Ansehen' : 'View'}
              </div>
            </a>

            <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {[
                {
                  image: '/images/restaurant-interior.jpg',
                  label: language === 'DE' ? 'Brand Events' : 'Brand events',
                  title: language === 'DE' ? 'Premium Settings. Klare Ästhetik.' : 'Premium settings. Clean aesthetic.',
                },
                {
                  image: '/images/community-feast.jpg',
                  label: language === 'DE' ? 'Celebrations' : 'Celebrations',
                  title: language === 'DE' ? 'Warm, großzügig, unvergesslich.' : 'Warm, generous, unforgettable.',
                },
              ].map((card) => (
                <a
                  key={card.image}
                  href="https://www.instagram.com/lacannellecatering/"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-3xl border border-black/10 bg-black aspect-[16/12] shadow-[0_18px_55px_rgba(0,0,0,0.10)]"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 will-change-transform group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url('${card.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  <div className="absolute left-6 bottom-6 right-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">{card.label}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white font-display">{card.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Concierge CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-black text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60 mb-3">
              {language === 'DE' ? 'CONCIERGE' : 'CONCIERGE'}
            </p>
            <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-5 font-display lux-reveal lux-type" data-lux-delay="60">
              {language === 'DE' ? 'Planung, perfekt umgesetzt.' : 'Planning, perfected.'}
            </h2>
            <p className="text-white/75 text-lg leading-relaxed lux-reveal lux-type" data-lux-delay="120">
              {language === 'DE'
                ? 'Von der Menükuration bis zum Service vor Ort: Wir führen Ihr Event mit ruhiger Präzision — elegant, zuverlässig, diskret.'
                : 'From menu curation to on-site service, we guide your event with calm precision — elegant, reliable, discreet.'}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => router.push('/order')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-black hover:brightness-95 transition-all"
              >
                {language === 'DE' ? 'Jetzt bestellen' : 'Order now'}
                <ChevronRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => router.push('/contact')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-white/10 transition-colors"
              >
                {language === 'DE' ? 'Angebot anfragen' : 'Request a quote'}
                <ArrowUpRight size={18} className="text-white/80" />
              </button>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: language === 'DE' ? 'Antwort in 48h' : '48h response',
                  desc: language === 'DE' ? 'Schnell, verbindlich, persönlich.' : 'Fast, reliable, personal.',
                },
                {
                  title: language === 'DE' ? 'White-glove Service' : 'White-glove service',
                  desc: language === 'DE' ? 'Team, Setup, Ablauf — aus einer Hand.' : 'Team, setup, flow — end to end.',
                },
                {
                  title: language === 'DE' ? 'Saisonale Menüs' : 'Seasonal menus',
                  desc: language === 'DE' ? 'Modern, fein, mit Handschrift.' : 'Modern, refined, signature-led.',
                },
                {
                  title: language === 'DE' ? 'Transparente Angebote' : 'Clear proposals',
                  desc: language === 'DE' ? 'Details, Kosten, Timing — sauber erklärt.' : 'Details, cost, timing — explained.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div
                className="aspect-[4/5] bg-cover bg-center"
                style={{ backgroundImage: "url('/images/restaurant-hero.jpg')" }}
              />
              <div className="absolute left-8 bottom-8 right-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                  {language === 'DE' ? 'Haute Catering' : 'Haute catering'}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white font-display">
                  {language === 'DE' ? 'Modern technique, generous hospitality.' : 'Modern technique, generous hospitality.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-[#F2F2F2] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 lux-reveal" data-lux-delay="80">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-light mb-4 font-display">Gourmet Catering</h3>
              <p className="text-[#F2F2F2]/70 text-sm">{t.footer.tagline}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{t.footer.quickLinksTitle}</h4>
              <div className="flex flex-col gap-3">
                <a href="#services" className="text-[#F2F2F2] hover:text-[#A69256] transition-colors">{t.nav.services}</a>
                <a href="#menus" className="text-[#F2F2F2] hover:text-[#A69256] transition-colors">{t.nav.menus}</a>
                <a href="#contact" className="text-[#F2F2F2] hover:text-[#A69256] transition-colors">{t.nav.contact}</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{t.footer.contactTitle}</h4>
              <div className="flex flex-col gap-3 text-[#F2F2F2]/70">
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
              <div className="text-[#F2F2F2]/70 text-sm space-y-1">
                <p>{t.footer.hours.weekdays}</p>
                <p>{t.footer.hours.saturday}</p>
                <p>{t.footer.hours.sunday}</p>
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
