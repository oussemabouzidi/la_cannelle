"use client";


import React, { useState, useEffect } from 'react';

import { Menu, X, ChevronRight, Phone, Mail, MapPin, Users, Award, Eye, Target, Building, Flag, Globe, Zap } from 'lucide-react';

import { usePathname, useRouter } from 'next/navigation';

import { Star, Crown, Shield, Heart } from 'lucide-react';

import { menusApi, type Menu as ApiMenu } from '@/lib/api/menus';

import { productsApi, type Product } from '@/lib/api/products';

import { useTranslation } from '@/lib/hooks/useTranslation';

import LoadingSpinner from '@/components/LoadingSpinner';
import { ChevronLeft } from 'lucide-react';
import { useRef } from 'react';



import { commonTranslations } from '@/lib/translations/common';
import type { Language } from '@/lib/hooks/useTranslation';


import { Clock, ChefHat, Flame } from 'lucide-react';

// Add these imports
import { useMemo } from 'react';
import { Check } from 'lucide-react';
import MenuShowcaseHorizontal from '../components/page';




type HomeTranslation = (typeof import('@/lib/translations/home').homeTranslations)[Language];



export default function CateringHomepage() {

  const scrollContainer = useRef<HTMLDivElement>(null);




  // Add these state variables at the top of your component
const [selectedMenu, setSelectedMenu] = useState<ApiMenu | null>(null);

// Add this useEffect for data fetching
useEffect(() => {
  const loadMenus = async () => {
    try {
      setIsLoadingData(true);
      setFetchError(null);
      
      // Fetch menus from backend
      const menusResult = await menusApi.getMenus({ 
        includeImages: true
      });

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
  const loadMenus = async () => {
    try {
      setIsLoadingData(true);
      setFetchError(null);
      
      // Fetch menus from backend
      const menusResult = await menusApi.getMenus({ 
        includeImages: true,
        
      });

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

// Add this useEffect to handle body overflow when modal is open
useEffect(() => {
  if (!selectedMenu) return;
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [selectedMenu]);


// Add this useEffect to handle body overflow when modal is open
useEffect(() => {
  if (!selectedMenu) return;
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [selectedMenu]);

  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);


  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { t: rawT, language, toggleLanguage } = useTranslation('home');

  const [isVisible, setIsVisible] = useState(false);

  const [menus, setMenus] = useState<ApiMenu[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);

  const [fetchError, setFetchError] = useState<string | null>(null);

  const t = rawT as HomeTranslation;




  const commonA11y = commonTranslations[language].accessibility;
  useEffect(() => {

    setIsVisible(true);

  }, []);



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

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);




  const journeyIcons = [Flag, Award, Globe, Zap];

  const journeyMilestones = t.journey.milestones.map((milestone, index) => ({

    ...milestone,

    icon: journeyIcons[index] ?? Flag,

  }));



  const showcaseItems = (products.length

      ? products.slice(0, 3).map((product) => ({

        id: product.id,

        name: language === 'DE' ? (product.nameDe || product.name) : product.name,

        category: product.category,

        price: product.price !== undefined ? `${product.price.toFixed(2)} EUR` : undefined,

        description: language === 'DE'
          ? (product.descriptionDe || product.description)
          : product.description,

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

        name: language === 'DE' ? (menu.nameDe || menu.name) : menu.name,

        desc: (language === 'DE' ? (menu.descriptionDe || menu.description) : menu.description) || '',
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



        @keyframes marquee {

          0% { transform: translate3d(0, 0, 0); }

          100% { transform: translate3d(-50%, 0, 0); }

        }

        

        @keyframes float {

          0%, 100% {

            transform: translateY(0px);

          }

          50% {

            transform: translateY(-10px);

          }

        }

        

        @keyframes pulse {

          0%, 100% {

            opacity: 1;

          }

          50% {

            opacity: 0.5;

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



        .animate-logo-marquee {

          animation: marquee 50s linear infinite;

          will-change: transform;

        }



        @media (max-width: 768px) {

          .animate-logo-marquee {

            animation-duration: 60s;

          }

        }



        @media (prefers-reduced-motion: reduce) {

          .animate-logo-marquee {

            animation: none;

            transform: translate3d(0, 0, 0);

          }

        }

        

        .animate-float {

          animation: float 3s ease-in-out infinite;

        }

        

        .animate-pulse {

          animation: pulse 2s ease-in-out infinite;

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

        

        .animate-delay-500 {

          animation-delay: 0.5s;

        }

        

        .animate-delay-1000 {

          animation-delay: 1s;

        }

        

        body {

          font-family: 'Inter', sans-serif;

        }

        

        .font-elegant {

          font-family: 'Playfair Display', serif;

        }

        

        /* 3D Perspective */

        .perspective-1000 {

          perspective: 1000px;

        }

        

        .rotate-y-2 {

          transform: rotateY(2deg);

        }

        

        /* Smooth scrolling */

        html {

          scroll-behavior: smooth;

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

              <a href="/about" className={desktopLinkClass('/about')}>{t.nav.about}</a>

              <a href="/services" className={desktopLinkClass('/services')}>{t.nav.services}</a>

              <a href="/menus" className={desktopLinkClass('/menus')}>{t.nav.menus}</a>

              <a href="/contact" className={desktopLinkClass('/contact')}>{t.nav.contact}</a>

              <button

                onClick={toggleLanguage}

                className="px-4 py-2 text-sm border border-amber-300 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-300 transform hover:scale-105 font-medium flex items-center gap-2"

              >

                {language === 'EN' ? (

                  <>

                    <span className="text-lg"><img src="/images/language/Flag_of_United_Kingdom-4096x2048.png" width={27} alt="English flag" /></span>

                    English

                  </>

                ) : (

                  <>

                    <span className="text-lg"><img src="/images/language/Flag_of_Germany-4096x2453.png" width={25} alt="German flag" /></span>

                    Deutsch

                  </>

                )}

              </button>

              <button

                onClick={() => handleOrderClick()}

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

                <button className="px-6 py-2 text-sm bg-amber-700 text-white rounded-lg hover:bg-amber-800 font-medium transition-all duration-300 transform hover:scale-105" onClick={() => handleOrderClick()}>

                  {t.nav.order}

                </button>

              </div>

            </div>

          )}

        </div>

      </nav>



      {/* Hero Banner */}

      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-stone-100">

        {/* Background Image with Overlay */}

        <div

          className="absolute inset-0 bg-cover bg-center bg-no-repeat"

          style={{

            backgroundImage: "url('/images/home_image.jpeg')",

          }}

        >

          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

        </div>



        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>

          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-stone-300/20 rounded-full blur-3xl"></div>

        </div>



        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-elegant italic drop-shadow-lg">

              {t.hero.title}

            </h1>

          </div>

          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>

            <p className="text-xl lg:text-2xl text-amber-100 mb-10 font-light italic drop-shadow-md max-w-3xl mx-auto leading-relaxed">

              {t.hero.subtitle}

            </p>

          </div>

          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>

            <button
              onClick={() => handleOrderClick()}
              className="group w-full sm:w-auto justify-center px-6 sm:px-10 py-4 sm:py-5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-lg font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3 shadow-lg border-2 border-amber-500/30"
            >

              {t.hero.cta}

              <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />

            </button>

          </div>

        </div>

        



        {/* Scroll Indicator */}

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">

          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">

            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>

          </div>

        </div>

      </section>

      {/* Brand Banner */}
      <section className="bg-white py-14 border-t border-gray-100">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-6">

            <p className="text-sm uppercase tracking-[0.2em] text-amber-700 font-semibold">{t.brandBanner.title}</p>

          </div>



          <div className="relative overflow-hidden py-6">

            <div className="flex w-max items-center gap-16 animate-logo-marquee whitespace-nowrap">

              {[...brandLogos, ...brandLogos].map((logo, idx) => (

                <div

                  key={`${logo.name}-${idx}`}

                  className="flex items-center justify-center h-28 md:h-32 px-8 opacity-95 hover:opacity-100 transition-all duration-200"

                >

                  <img

                    src={logo.src}

                    alt={`${logo.name} logo`}

                    className={`h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-200 ${logo.src.endsWith('.svg') ? 'invert' : ''}`}

                    loading="lazy"

                  />

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* Quick Menu Categories */}

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-stone-100/30"></div>
      <div className="absolute top-10 right-10 w-20 h-20 bg-amber-200/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-stone-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 font-elegant">
              {t.quickMenu.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t.quickMenu.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {t.quickMenu.categories.map((category, index) => {
            const Icon = quickMenuIcons[index];
            const meta = quickMenuCategoryMeta[index];
            
            return (
              <div
                key={index}
                className={`group relative bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 cursor-pointer ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => setSelectedCategory(index)}
              >
                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${meta?.gradient || 'from-amber-200 via-amber-100 to-stone-100'} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-500`}></div>

                {/* Icon */}
                <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {Icon ? <Icon className="text-amber-600" size={28} /> : null}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-1 font-elegant">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-xs mb-2">{category.description}</p>

                {/* Click Indicator */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ChevronRight size={16} className="text-amber-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

  {/* Modal/Popup for Category Details - Simplified */}
  {selectedCategory !== null && (
    <>
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0 backdrop-blur-sm bg-white/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl border border-amber-100/50">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-white">
            <div className="flex items-center gap-3">
              <div className="text-amber-600">
                {quickMenuIcons[selectedCategory] && 
                  React.createElement(quickMenuIcons[selectedCategory], { size: 24 })}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 font-elegant">
                {t.quickMenu.categories[selectedCategory].title}
              </h3>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content - Simplified */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="mb-6">
              <p className="text-gray-700 mb-6 bg-amber-50/50 p-4 rounded-lg">
                {t.quickMenu.categories[selectedCategory].description}
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'EN' ? 'What to Expect' : 'Was Sie erwartet'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === 'EN' 
                      ? 'A selection of our finest dishes, carefully prepared with fresh ingredients and traditional techniques.'
                      : 'Eine Auswahl unserer besten Gerichte, sorgfältig mit frischen Zutaten und traditionellen Techniken zubereitet.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'EN' ? 'Highlights' : 'Höhepunkte'}
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      {language === 'EN' ? 'Fresh, seasonal ingredients' : 'Frische, saisonale Zutaten'}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      {language === 'EN' ? 'Chef-recommended options' : 'Von unseren Köchen empfohlene Optionen'}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      {language === 'EN' ? 'Perfect for sharing' : 'Perfekt zum Teilen'}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'EN' ? 'Best Time to Enjoy' : 'Beste Zeit zum Genießen'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === 'EN' 
                      ? 'These dishes are perfect for lunch, dinner, or special occasions. Our chefs recommend pairing with our selected wines.'
                      : 'Diese Gerichte sind perfekt für Mittagessen, Abendessen oder besondere Anlässe. Unsere Köche empfehlen die Kombination mit unseren ausgewählten Weinen.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )}
</section>
      {selectedMenuItem && (
        <>
          {/* Backdrop with blur effect */}
          <div className="fixed inset-0 backdrop-blur-md bg-white/90 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-amber-100/50 animate-scale-in">
              {/* Close Button */}
              <button
                onClick={() => setSelectedMenuItem(null)}
                className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg border border-gray-200"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Modal Content */}
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-1/2 relative">
                  <div className="h-64 lg:h-full">
                    <img
                      src={selectedMenuItem.image || '/images/home_image.jpeg'}
                      alt={selectedMenuItem.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Badges on Image */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {selectedMenuItem.popular && (
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1 shadow-lg">
                        <Flame size={14} />
                        {t.menuShowcase.badges.popular}
                      </div>
                    )}
                    {selectedMenuItem.featured && (
                      <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1 shadow-lg">
                        <Star size={14} />
                        {t.menuShowcase.badges.featured}
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto max-h-[60vh] lg:max-h-[90vh]">
                  <div className="mb-6">
                    <p className="text-amber-600 font-semibold text-sm mb-2">
                      {selectedMenuItem.category || t.quickMenu.title}
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900 font-elegant mb-3">
                      {selectedMenuItem.name}
                    </h2>
                    {selectedMenuItem.price && (
                      <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent mb-4">
                        {selectedMenuItem.price}
                      </div>
                    )}
                    <p className="text-gray-600 mb-6 bg-amber-50/50 p-4 rounded-lg">
                      {selectedMenuItem.description}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {selectedMenuItem.prepTime && (
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg border border-amber-100">
                        <Clock size={18} className="text-amber-600" />
                        <div>
                          <p className="text-xs text-gray-500">Prep Time</p>
                          <p className="font-semibold text-gray-800">{selectedMenuItem.prepTime}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedMenuItem.serves && (
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg border border-amber-100">
                        <Users size={18} className="text-amber-600" />
                        <div>
                          <p className="text-xs text-gray-500">Serves</p>
                          <p className="font-semibold text-gray-800">{selectedMenuItem.serves}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedMenuItem.chef && (
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg border border-amber-100">
                        <ChefHat size={18} className="text-amber-600" />
                        <div>
                          <p className="text-xs text-gray-500">Chef</p>
                          <p className="font-semibold text-gray-800">{selectedMenuItem.chef}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedMenuItem.spiceLevel && (
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg border border-amber-100">
                        <Flame size={18} className="text-amber-600" />
                        <div>
                          <p className="text-xs text-gray-500">Spice Level</p>
                          <p className="font-semibold text-gray-800">{selectedMenuItem.spiceLevel}/5</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ingredients / Highlights */}
                  {selectedMenuItem.ingredients && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">
                        {language === 'EN' ? 'Ingredients' : 'Zutaten'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMenuItem.ingredients.map((ingredient: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full text-sm border border-amber-200"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dietary Info */}
                  {selectedMenuItem.dietary && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">
                        {language === 'EN' ? 'Dietary Information' : 'Ernährungsinformationen'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMenuItem.dietary.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm border border-green-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}



      <MenuShowcaseHorizontal 
        limit={6}
        showViewAll={true}
        title="Our Featured Menus"
        description="Discover our carefully crafted culinary experiences"
      />

      {/* Passion Section - Smaller */}

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-900 to-amber-900 relative overflow-hidden">

        {/* Animated Background */}

        <div className="absolute inset-0">

          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-stone-900 to-stone-900"></div>

        </div>



        <div className="max-w-6xl mx-auto relative">

          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Content */}

            <div className={`transition-all duration-1000 ${isVisible ? 'animate-slide-in-left' : 'opacity-0 translate-x-10'}`}>

              <div className="max-w-md text-white">

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-amber-200 text-xs font-semibold mb-4 border border-white/20">

                  <Heart size={14} />

                  {t.passion.subtitle}

                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 font-elegant leading-tight">

                  {t.passion.title}

                </h2>

                <p className="text-amber-100 leading-relaxed mb-6">

                  {t.passion.text}

                </p>



                {/* Interactive Progress Bars */}

                <div className="space-y-3 mb-6">

                  {t.passion.skills.map((item, index) => (

                    <div key={index} className="group">

                      <div className="flex justify-between text-xs mb-1">

                        <span className="text-amber-200">{item.title}</span>

                      </div>

                      <div className="w-full bg-white/20 rounded-full h-1.5">

                        <div

                          className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000 ease-out group-hover:bg-amber-400"

                          style={{ width: `${90 - index * 8}%` }}

                        ></div>

                      </div>

                      <p className="text-xs text-amber-100/80 mt-2">{item.description}</p>

                    </div>

                  ))}

                </div>



                <button className="px-6 py-3 bg-white text-stone-900 rounded-xl font-semibold hover:bg-amber-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 text-sm">

                  {t.passion.cta}

                  <ChevronRight size={16} />

                </button>

              </div>

            </div>



            {/* Image - Same size as Exclusivity */}

            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'animate-slide-in-right' : 'opacity-0 -translate-x-10'}`}>

              <div className="relative group perspective-1000">

                {/* Main Image with 3D Rotation - Same as Exclusivity */}

                <div className="relative rounded-2xl overflow-hidden shadow-xl transform group-hover:rotate-y-2 transition-transform duration-700">

                  <img

                    src="/images/chef-passion.jpg"

                    alt="Chef's passion"

                    className="w-full h-64 object-cover"

                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent"></div>

                </div>



                {/* Animated Chef Badge - Smaller like Exclusivity */}

                <div className="absolute -top-3 -right-3 bg-amber-600 text-white rounded-xl p-3 shadow-xl transform group-hover:scale-110 transition-transform duration-500">

                  <div className="text-center">

                    <Award size={16} className="mx-auto mb-1" />

                    <p className="text-xs font-bold">Master Chef</p>

                    <p className="text-xs opacity-90">15+ Years</p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* Company Section - Matched to Exclusivity */}

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-white relative overflow-hidden">

        {/* Background Elements - Same as Exclusivity */}

        <div className="absolute top-10 left-8 w-6 h-6 bg-amber-300/30 rounded-full animate-float"></div>

        <div className="absolute top-20 right-12 w-4 h-4 bg-stone-400/20 rounded-full animate-float delay-500"></div>

        <div className="absolute bottom-12 left-12 w-8 h-8 bg-amber-200/40 rounded-full animate-float delay-1000"></div>



        <div className="max-w-6xl mx-auto relative">

          {/* Header - Same as Exclusivity */}

          <div className="text-center mb-8">

            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-amber-700 text-xs font-semibold mb-4 shadow-lg border border-amber-100">

                <Building size={14} />

                {t.company.subtitle}

              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 font-elegant leading-tight">

                {t.company.title}

              </h2>

            </div>

          </div>



          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Content Column - Same layout as Exclusivity */}

            <div className={`transition-all duration-1000 ${isVisible ? 'animate-slide-in-left' : 'opacity-0 translate-x-10'}`}>

              <div className="max-w-md">

                <p className="text-gray-600 leading-relaxed mb-6">

                  {t.company.text}

                </p>



                {/* Values Grid - Compact like Exclusivity stats */}

                <div className="grid grid-cols-2 gap-4 mb-6">

                  {companyValues.map((value, index) => (

                    <div key={index} className="bg-white rounded-lg p-3 shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300 group text-center">

                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-amber-200 transition-colors duration-300">

                        <value.icon className="text-amber-600" size={16} />

                      </div>

                      <h3 className="font-bold text-gray-900 mb-1 text-sm">{value.title}</h3>

                      <p className="text-xs text-gray-600">{value.description}</p>

                    </div>

                  ))}

                </div>

              </div>

            </div>



            {/* Image Column - Same as Exclusivity */}

            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'animate-slide-in-right' : 'opacity-0 -translate-x-10'}`}>

              <div className="relative group perspective-1000">

                {/* Main Image with 3D Rotation - Same as Exclusivity */}

                <div className="relative rounded-2xl overflow-hidden shadow-xl transform group-hover:rotate-y-2 transition-transform duration-700">

                  <img

                    src="/images/restaurant-interior.jpg"

                    alt="Elegant restaurant interior"

                    className="w-full h-64 object-cover"

                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                </div>



                {/* Floating Achievement Badge - Same style as Exclusivity */}

                <div className="absolute -top-3 -right-3 bg-amber-600 text-white rounded-xl p-3 shadow-xl transform group-hover:scale-110 transition-transform duration-500">

                  <div className="text-center">

                    <Award className="mx-auto mb-1" size={16} />

                    <p className="text-xs font-bold">{t.company.badge.title}</p>

                    <p className="text-xs opacity-90">{t.company.badge.subtitle}</p>

                  </div>

                </div>



                {/* Floating Review Card - Smaller and positioned like Exclusivity */}

                <div className="absolute -bottom-3 -left-3 bg-white rounded-xl p-3 shadow-xl border border-amber-100 max-w-xs transform group-hover:scale-105 transition-transform duration-500">

                  <div className="flex items-center gap-2 mb-1">

                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">

                      <Star className="text-amber-600" size={12} />

                    </div>

                    <div>

                      <p className="font-bold text-gray-900 text-xs">4.9/5</p>

                      <p className="text-xs text-amber-600">{t.company.review.ratingLabel}</p>

                    </div>

                  </div>

                  <p className="text-xs text-gray-600 italic">

                    {t.company.review.quote}

                  </p>

                </div>

              </div>

            </div>

          </div>



          {/* Timeline / Milestones - Keep but make more compact */}

          <div className={`bg-white rounded-xl p-6 shadow-lg border border-amber-100 transition-all duration-1000 delay-600 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} mt-8`}>

            <h3 className="text-lg font-bold text-gray-900 text-center mb-4 font-elegant">{t.journey.title}</h3>

            <div className="grid md:grid-cols-4 gap-4 text-center">

              {journeyMilestones.map((milestone, index) => (

                <div key={index} className="relative">

                  {index < 3 && (

                    <div className="hidden md:block absolute top-4 left-1/2 w-full h-0.5 bg-amber-200 -z-10"></div>

                  )}

                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-amber-200 transition-colors duration-300">

                    <milestone.icon className="text-amber-600" size={18} />

                  </div>

                  <p className="text-md font-bold text-amber-600 mb-1">{milestone.date}</p>

                  <p className="text-gray-700 font-medium text-xs">{milestone.title}</p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>



      {/* Services Overview */}

      <section id="services" className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-50 via-white to-amber-50/30">

        <div className="max-w-6xl mx-auto">

          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} text-center`}>

            <p className="inline-flex px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold mb-3">{t.quickMenu.title}</p>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-elegant">{t.services.title}</h2>

            <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-6">Tailored experiences without the heavy layout'pick the format that fits your event.</p>

          </div>

          <div className="grid md:grid-cols-3 gap-4">

            {t.services.items.map((service, index) => (

              <div

                key={index}

                className={`flex flex-col gap-2 bg-white/90 p-4 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'

                  }`}

                style={{ animationDelay: `${index * 120 + 200}ms` }}

              >

                <div className="flex items-center justify-between">

                  <h3 className="text-base font-semibold text-gray-900 font-elegant">{service.title}</h3>

                  <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-1 rounded-full">Premium</span>

                </div>

                <p className="text-gray-600 text-sm leading-snug">{service.description}</p>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* Featured Menus */}

      <section id="menus" className="py-10 px-4 sm:px-6 lg:px-8 bg-white">

        <div className="max-w-6xl mx-auto">

          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} text-center`}>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-elegant">{t.menus.title}</h2>

            <p className="text-sm text-gray-600 mb-4">A quick peek at what's cooking'compact, curated, ready to order.</p>

          </div>



          {fetchError && !menus.length && (

            <p className="text-center text-sm text-red-600 mb-4">{fetchError}</p>

          )}

          {isLoadingData && !menus.length && (

            <LoadingSpinner className="mb-4" label="Loading featured menus..." />

          )}



          <div className="grid md:grid-cols-3 gap-4">

            {featuredMenus.map((menu, index) => (

              <div

                key={menu.id ?? index}

                className={`bg-amber-50/70 p-5 rounded-xl hover:bg-amber-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md border border-amber-100 ${isVisible ? 'animate-scale-in' : 'opacity-0'

                  }`}

                style={{ animationDelay: `${index * 150 + 300}ms` }}

              >

                <div className="flex items-start justify-between gap-3 mb-2">

                  <h3 className="text-lg font-semibold text-gray-900 font-elegant">{menu.name}</h3>

                  {menu.price && <span className="text-xs text-amber-700 font-semibold bg-white px-2 py-1 rounded-full shadow-sm">{menu.price}</span>}

                </div>

                <p className="text-gray-600 mb-3 text-sm leading-snug">{menu.desc}</p>

                {menu.price && <p className="text-amber-700 font-semibold text-sm mb-3">From {menu.price}</p>}

                <button

                  className="text-amber-700 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all duration-200 group text-sm"

                  onClick={() => handleOrderClick(menu.productIds)}

                >

                  {t.menus.cta} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />

                </button>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* Testimonials */}

      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-stone-50">

        <div className="max-w-6xl mx-auto">

          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} text-center`}>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-elegant">{t.testimonials.title}</h2>

            <p className="text-sm text-gray-600 mb-6">Short, sweet notes from recent clients.</p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            {t.testimonials.items.map((testimonial, index) => (

              <div

                key={index}

                className={`bg-white/90 p-4 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'

                  }`}

                style={{ animationDelay: `${index * 120 + 240}ms` }}

              >

                <p className="text-gray-700 mb-3 text-sm leading-relaxed">"{testimonial.quote}"</p>

                <p className="text-gray-900 font-semibold font-elegant text-sm">- {testimonial.name}</p>

                <p className="text-xs text-amber-700">{testimonial.role}</p>

              </div>

            ))}

          </div>

        </div>

      </section>
      {/* Footer */}

      <footer id="contact" className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto">

          <div className="grid md:grid-cols-4 gap-8 mb-8">

            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>

              <h3 className="text-xl font-bold mb-3 font-elegant italic">Gourmet Catering</h3>

              <p className="text-gray-400 italic text-sm">{t.footer.tagline}</p>

            </div>

            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>

              <h4 className="font-semibold mb-3 font-elegant text-sm">{t.footer.quickLinksTitle}</h4>

              <div className="flex flex-col gap-1">

                <a href="#about" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-sm">{t.nav.about}</a>

                <a href="#services" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-sm">{t.nav.services}</a>

                <a href="#menus" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-sm">{t.nav.menus}</a>

                <a href="#contact" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-sm">{t.nav.contact}</a>

              </div>

            </div>

            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>

              <h4 className="font-semibold mb-3 font-elegant text-sm">{t.footer.contactTitle}</h4>

              <div className="flex flex-col gap-2 text-gray-400 text-sm">

                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">

                  <Phone size={16} />

                  <span>{t.footer.contact.phone}</span>

                </div>

                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">

                  <Mail size={16} />

                  <span>{t.footer.contact.email}</span>

                </div>

                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">

                  <MapPin size={16} />

                  <span>{t.footer.contact.location}</span>

                </div>

              </div>

            </div>

            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>

              <h4 className="font-semibold mb-3 font-elegant text-sm">{t.footer.hoursTitle}</h4>

              <p className="text-gray-400 text-sm">{t.footer.hours.weekdays}</p>

              <p className="text-gray-400 text-sm">{t.footer.hours.saturday}</p>

              <p className="text-gray-400 text-sm">{t.footer.hours.sunday}</p>

            </div>

          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">

            <p>{t.footer.copyright}</p>

          </div>

        </div>
      </footer>
    </div>
  );
}