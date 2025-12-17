"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Users, Clock, Award, Eye, Target, Building, Flag, Globe, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Star, Crown, Shield, Heart, Quote } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import type { homeTranslations } from '@/lib/translations/home';

export default function CateringHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t: rawT, language, toggleLanguage } = useTranslation('home');
  const [isVisible, setIsVisible] = useState(false);
  const t = rawT as (typeof homeTranslations)['EN'];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const router = useRouter();

  const handleOrderClick = () => {
    router.push('/order');
  };
  const brandLogos = [
    { name: 'Montblanc', src: '/public/images/logos/montblanc.png' },
    { name: 'Omnicom Media Group', src: '/public/images/logos/omnicom-media-group.png' },
    { name: 'OMG', src: '/public/images/logos/omg.png' },
    { name: 'DoiT International', src: '/public/images/logos/doit.png' },
    { name: 'BBDO', src: '/public/images/logos/bbdo.png' },
    { name: 'IWC Schaffhausen', src: '/public/images/logos/iwc.png' },
    { name: 'Ruby Hotels', src: '/public/images/logos/ruby-hotels.svg' },
    { name: 'RIMOWA', src: '/public/images/logos/rimowa.png' },
    { name: 'Ralph Lauren', src: '/public/images/logos/ralph-lauren.png' },
    { name: 'Samsonite', src: '/public/images/logos/samsonite.png' },
    { name: 'SABIC', src: '/public/images/logos/sabic.png' },
  ];

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

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
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
          animation: marquee 30s linear infinite;
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
              <img src="/images/logo.png" alt="" className="w-50 h-auto" />
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/home" className="text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">Home</a>
              <a href="/about" className="text-gray-900 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">About</a>
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
                <button className="px-6 py-2 text-sm bg-amber-700 text-white rounded-lg hover:bg-amber-800 font-medium transition-all duration-300 transform hover:scale-105" onClick={handleOrderClick}>
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
            <button onClick={() => handleOrderClick()} className="group px-10 py-5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-lg font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl inline-flex items-center gap-3 shadow-lg border-2 border-amber-500/30">
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



      {/* Quick Menu Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-stone-100/30"></div>
        <div className="absolute top-10 right-10 w-20 h-20 bg-amber-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-stone-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-10">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 font-elegant">Our Specialties</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Discover our carefully crafted menu categories for every occasion</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Finger Food",
                icon: "ðŸ¤",
                count: "25+ Items",
                gradient: "from-amber-500 to-orange-500",
                description: "Elegant bite-sized delights"
              },
              {
                name: "Desserts",
                icon: "ðŸ°",
                count: "15+ Varieties",
                gradient: "from-pink-500 to-rose-500",
                description: "Sweet endings to perfection"
              },
              {
                name: "Buffet",
                icon: "ðŸ¥˜",
                count: "8+ Themes",
                gradient: "from-emerald-500 to-teal-500",
                description: "Grand culinary experiences"
              },
              {
                name: "Special Occasions",
                icon: "ðŸŽ‰",
                count: "Custom",
                gradient: "from-purple-500 to-indigo-500",
                description: "Tailored for your events"
              }
            ].map((category, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-1 font-elegant">{category.name}</h3>
                <p className="text-gray-600 text-xs mb-2">{category.description}</p>
                <p className="text-amber-600 font-semibold text-xs">{category.count}</p>
                
                {/* Hover Arrow */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ChevronRight size={16} className="text-amber-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusivity Section - Smaller */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-50 to-amber-50 relative overflow-hidden">
        {/* 3D Floating Elements */}
        <div className="absolute top-10 left-8 w-6 h-6 bg-amber-300/30 rounded-full animate-float"></div>
        <div className="absolute top-20 right-12 w-4 h-4 bg-stone-400/20 rounded-full animate-float delay-500"></div>
        <div className="absolute bottom-12 left-12 w-8 h-8 bg-amber-200/40 rounded-full animate-float delay-1000"></div>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-slide-in-left' : 'opacity-0 translate-x-10'}`}>
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-amber-700 text-xs font-semibold mb-4 shadow-lg border border-amber-100">
                  <Crown size={14} />
                  {t.exclusivity.subtitle}
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 font-elegant leading-tight">
                  {t.exclusivity.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.exclusivity.text}
                </p>
                
                {/* Interactive Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { number: "500+", label: "Events" },
                    { number: "98%", label: "Satisfaction" },
                    { number: "24/7", label: "Support" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className="bg-white rounded-lg p-3 shadow-lg border border-amber-100 group-hover:shadow-xl transition-all duration-300">
                        <p className="text-lg font-bold text-amber-600 mb-1">{stat.number}</p>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Image with 3D Effect */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'animate-slide-in-right' : 'opacity-0 -translate-x-10'}`}>
              <div className="relative group perspective-1000">
                {/* Main Image with 3D Rotation */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl transform group-hover:rotate-y-2 transition-transform duration-700">
                  <img 
                    src="/images/home_image.jpeg" 
                    alt="Friends enjoying a lively catering spread"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-3 -right-3 bg-white rounded-xl p-3 shadow-xl border border-amber-100 transform group-hover:scale-110 transition-transform duration-500">
                  <div className="flex items-center gap-2">
                    <Star className="text-amber-600" size={16} />
                    <div>
                      <p className="font-bold text-gray-900 text-xs">Premium</p>
                      <p className="text-xs text-amber-600">Service</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Menu Showcase - Smaller */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 font-elegant">Signature Creations</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Experience our most sought-after culinary masterpieces</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Truffle Arancini",
                category: "Finger Food",
                price: "â‚¬24",
                image: "/images/truffle-arancini.jpg",
                description: "Crispy risotto balls with black truffle",
                popular: true
              },
              {
                name: "Chocolate Sphere",
                category: "Desserts",
                price: "â‚¬18",
                image: "/images/chocolate-sphere.jpg",
                description: "Molten chocolate with gold leaf",
                featured: true
              },
              {
                name: "Mediterranean Buffet",
                category: "Buffet",
                price: "â‚¬45",
                image: "/images/mediterranean-buffet.jpg",
                description: "Fresh flavors from the Mediterranean coast"
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  
                  {/* Badges */}
                  {item.popular && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Popular
                    </div>
                  )}
                  {item.featured && (
                    <div className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="font-bold text-gray-900 text-sm">{item.price}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 font-elegant">{item.name}</h3>
                  </div>
                  <p className="text-amber-600 text-xs font-semibold mb-2">{item.category}</p>
                  <p className="text-gray-600 text-xs mb-3">{item.description}</p>
                  
                  {/* Interactive Button */}
                  <button className="w-full bg-amber-50 text-amber-700 py-2 rounded-lg font-semibold hover:bg-amber-100 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2 text-sm">
                    View Details
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 shadow-lg text-sm">
              Explore Full Menu
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Passion Section - Smaller */}
{/* Passion Section - Matched to Exclusivity */}
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
            {[
              { skill: "Culinary Innovation", percentage: 95 },
              { skill: "Ingredient Quality", percentage: 98 },
              { skill: "Customer Satisfaction", percentage: 96 }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-200">{item.skill}</span>
                  <span className="text-white font-semibold">{item.percentage}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div 
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000 ease-out group-hover:bg-amber-400"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <button className="px-6 py-3 bg-white text-stone-900 rounded-xl font-semibold hover:bg-amber-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 text-sm">
            Our Story
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
            {[
              {
                icon: Target,
                title: "Our Mission",
                description: "Exceptional culinary experiences"
              },
              {
                icon: Eye,
                title: "Our Vision",
                description: "Trusted luxury dining worldwide"
              },
              {
                icon: Award,
                title: "Excellence",
                description: "Highest standards in every dish"
              },
              {
                icon: Users,
                title: "Community",
                description: "Building lasting relationships"
              }
            ].map((value, index) => (
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
              <p className="text-xs font-bold">Since 2008</p>
              <p className="text-xs opacity-90">Established</p>
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
                <p className="text-xs text-amber-600">Rating</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 italic">
              "Unforgettable dining experience."
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Timeline / Milestones - Keep but make more compact */}
    <div className={`bg-white rounded-xl p-6 shadow-lg border border-amber-100 transition-all duration-1000 delay-600 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} mt-8`}>
      <h3 className="text-lg font-bold text-gray-900 text-center mb-4 font-elegant">Our Journey</h3>
      <div className="grid md:grid-cols-4 gap-4 text-center">
        {[
          { year: "2008", event: "Founded", icon: Flag },
          { year: "2012", event: "Michelin Star", icon: Award },
          { year: "2018", event: "Expansion", icon: Globe },
          { year: "2024", event: "Innovation", icon: Zap }
        ].map((milestone, index) => (
          <div key={index} className="relative">
            {index < 3 && (
              <div className="hidden md:block absolute top-4 left-1/2 w-full h-0.5 bg-amber-200 -z-10"></div>
            )}
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-amber-200 transition-colors duration-300">
              <milestone.icon className="text-amber-600" size={18} />
            </div>
            <p className="text-md font-bold text-amber-600 mb-1">{milestone.year}</p>
            <p className="text-gray-700 font-medium text-xs">{milestone.event}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Services Overview */}
      <section id="services" className="py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-elegant">{t.services.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.services.items.map((service, index) => (
              <div 
                key={index} 
                className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 border border-stone-100 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100 + 300}ms` }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-elegant">{service.name}</h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menus */}
      <section id="menus" className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-elegant">{t.menus.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.menus.items.map((menu, index) => (
              <div 
                key={index} 
                className={`bg-amber-50 p-6 rounded-lg hover:bg-amber-100 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-lg ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 150 + 300}ms` }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-elegant">{menu.name}</h3>
                <p className="text-gray-600 mb-4 text-sm font-light italic">{menu.desc}</p>
                <button className="text-amber-700 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 group text-sm">
                  Learn More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-elegant">{t.testimonials.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.testimonials.items.map((testimonial, index) => (
              <div 
                key={index} 
                className={`bg-white p-6 rounded-lg shadow-sm border border-stone-100 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100 + 300}ms` }}
              >
                <p className="text-gray-600 mb-4 italic text-sm">"{testimonial.text}"</p>
                <p className="text-gray-900 font-semibold font-elegant text-sm">â€” {testimonial.author}</p>
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
              <p className="text-gray-400 italic text-sm">Creating unforgettable culinary experiences</p>
            </div>
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-3 font-elegant text-sm">Quick Links</h4>
              <div className="flex flex-col gap-1">
                <a href="#about" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-sm">About</a>
                <a href="#services" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-sm">Services</a>
                <a href="#menus" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-sm">Menus</a>
                <a href="#contact" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-sm">Contact</a>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-3 font-elegant text-sm">Contact</h4>
              <div className="flex flex-col gap-2 text-gray-400 text-sm">
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Phone size={16} />
                  <span>+123 456 7890</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Mail size={16} />
                  <span>info@catering.com</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <MapPin size={16} />
                  <span>Your Location</span>
                </div>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-3 font-elegant text-sm">Hours</h4>
              <p className="text-gray-400 text-sm">Monday - Friday: 9am - 6pm</p>
              <p className="text-gray-400 text-sm">Saturday: 10am - 4pm</p>
              <p className="text-gray-400 text-sm">Sunday: Closed</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Gourmet Catering. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
