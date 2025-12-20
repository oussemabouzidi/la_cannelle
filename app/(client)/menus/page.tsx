"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { menusApi, type Menu as ApiMenu } from '@/lib/api/menus';
import { productsApi, type Product as ApiProduct } from '@/lib/api/products';
import { commonTranslations } from '@/lib/translations/common';
import { DEFAULT_LANGUAGE, STORAGE_KEY, type Language } from '@/lib/hooks/useTranslation';

type MenuHighlightItem = {
  id: number;
  name: string;
  description?: string;
  image?: string;
};

type MenuHighlight = ApiMenu & {
  items: MenuHighlightItem[];
  coverImage: string;
};

export default function MenusPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuHighlight | null>(null);
  const [isMenuModalClosing, setIsMenuModalClosing] = useState(false);
  const [menus, setMenus] = useState<ApiMenu[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const commonFooter = commonTranslations[language].footer;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const router = useRouter();

  const handleOrderClick = () => {
    router.push('/order');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    const next = stored === 'DE' || stored === 'EN' ? (stored as Language) : DEFAULT_LANGUAGE;
    setLanguage(next);
    localStorage.setItem(STORAGE_KEY, next);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next.toLowerCase();
    }
  }, []);

  useEffect(() => {
    if (!selectedMenu) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMenu]);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'EN' ? 'DE' : 'EN';
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, next);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.lang = next.toLowerCase();
      }
      return next;
    });
  };

  const content: Record<string, any> = {
    EN: {
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        menus: 'Menus',
        contact: 'Contact',
        connect: 'Connect',
        order: 'Order Now'
      },
      hero: {
        title: 'Our Menus',
        subtitle: 'Carefully crafted culinary experiences for every occasion'
      },
      categories: {
        title: 'Menu Categories',
        all: 'All Menus',
        corporate: 'Corporate Events',
        wedding: 'Wedding Celebrations',
        cocktail: 'Cocktail Parties',
        seasonal: 'Seasonal Specials',
        premium: 'Premium Selection'
      },
      sampleDishes: {
        title: 'Signature Creations',
        subtitle: 'A glimpse of our culinary artistry'
      },
      menuHighlights: {
        title: 'Menu Highlights',
        subtitle: 'Explore our signature menus and view the details',
        viewDetails: 'View details',
        includes: 'Includes',
        noItems: 'Menu details available upon request.',
        priceLabel: 'Starting at'
      },
      menuBuilder: {
        title: 'Build Your Perfect Menu',
        subtitle: 'Mix and match from our extensive selection',
        guests: 'Number of Guests',
        budget: 'Budget Range',
        dietary: 'Dietary Preferences',
        addToPlan: 'Add to Menu Plan',
        viewPlan: 'View Menu Plan',
        totalItems: 'Items Selected',
        searchPlaceholder: 'Search menu items...',
        menuPlan: 'Your Menu Plan',
        totalPrice: 'Total Price',
        clearAll: 'Clear All',
        close: 'Close',
        noItems: 'No items added to your menu plan yet.'
      },
      pricing: {
        title: 'Pricing Tiers',
        subtitle: 'Flexible options to suit your needs',
        basic: {
          name: 'Essential',
          price: '€45',
          period: 'per person',
          features: [
            '3-course menu selection',
            'Standard beverage package',
            'Basic table setting',
            'Up to 50 guests',
            '5-hour service'
          ]
        },
        premium: {
          name: 'Premium',
          price: '€75',
          period: 'per person',
          features: [
            '5-course gourmet menu',
            'Premium beverage selection',
            'Elegant table decor',
            'Up to 100 guests',
            '7-hour service',
            'Personal menu consultation'
          ],
          popular: true
        },
        luxury: {
          name: 'Luxury',
          price: '€120',
          period: 'per person',
          features: [
            '7-course bespoke menu',
            'Premium open bar',
            'Floral arrangements',
            'Unlimited guests',
            'Full-day service',
            'Dedicated event planner',
            'Live cooking stations'
          ]
        }
      },
      cta: {
        title: 'Ready to Create Your Perfect Menu?',
        subtitle: 'Let us design a culinary experience that reflects your unique style',
        button: 'Start Your Order'
      }
    },
    DE: {
      nav: {
        home: 'Startseite',
        about: 'Über uns',
        services: 'Dienstleistungen',
        menus: 'Menüs',
        contact: 'Kontakt',
        connect: 'Verbinden',
        order: 'Jetzt bestellen'
      },
      hero: {
        title: 'Unsere Menüs',
        subtitle: 'Sorgfältig zusammengestellte kulinarische Erlebnisse für jeden Anlass'
      },
      categories: {
        title: 'Menükategorien',
        all: 'Alle Menüs',
        corporate: 'Firmenveranstaltungen',
        wedding: 'Hochzeitsfeiern',
        cocktail: 'Cocktail-Partys',
        seasonal: 'Saisonale Spezialitäten',
        premium: 'Premium-Auswahl'
      },
      sampleDishes: {
        title: 'Signature Kreationen',
        subtitle: 'Ein Einblick in unsere kulinarische Kunst'
      },
      menuHighlights: {
        title: 'Menue Highlights',
        subtitle: 'Entdecken Sie unsere Menues und sehen Sie die Details',
        viewDetails: 'Details ansehen',
        includes: 'Enthaelt',
        noItems: 'Details auf Anfrage verfuegbar.',
        priceLabel: 'Ab'
      },
      menuBuilder: {
        title: 'Erstellen Sie Ihr perfektes Menü',
        subtitle: 'Kombinieren Sie aus unserer umfangreichen Auswahl',
        guests: 'Anzahl der Gäste',
        budget: 'Budgetbereich',
        dietary: 'Diätvorlieben',
        addToPlan: 'Zum Menüplan hinzufügen',
        viewPlan: 'Menüplan ansehen',
        totalItems: 'Ausgewählte Artikel',
        searchPlaceholder: 'Menüpunkte suchen...',
        menuPlan: 'Ihr Menüplan',
        totalPrice: 'Gesamtpreis',
        clearAll: 'Alle löschen',
        close: 'Schließen',
        noItems: 'Noch keine Artikel zum Menüplan hinzugefügt.'
      },
      pricing: {
        title: 'Preisgestaltung',
        subtitle: 'Flexible Optionen für Ihre Bedürfnisse',
        basic: {
          name: 'Essential',
          price: '€45',
          period: 'pro Person',
          features: [
            '3-Gänge-Menüauswahl',
            'Standard-Getränkepaket',
            'Basis-Tischdekoration',
            'Bis zu 50 Gäste',
            '5-Stunden-Service'
          ]
        },
        premium: {
          name: 'Premium',
          price: '€75',
          period: 'pro Person',
          features: [
            '5-Gänge-Gourmet-Menü',
            'Premium-Getränkeauswahl',
            'Elegante Tischdekoration',
            'Bis zu 100 Gäste',
            '7-Stunden-Service',
            'Persönliche Menüberatung'
          ],
          popular: true
        },
        luxury: {
          name: 'Luxus',
          price: '€120',
          period: 'pro Person',
          features: [
            '7-Gänge-Individuelles Menü',
            'Premium-Open-Bar',
            'Blumendekoration',
            'Unbegrenzte Gäste',
            'Ganztägiger Service',
            'Dedizierter Eventplaner',
            'Live-Kochstationen'
          ]
        }
      },
      cta: {
        title: 'Bereit für Ihr perfektes Menü?',
        subtitle: 'Lassen Sie uns ein kulinarisches Erlebnis gestalten, das Ihren einzigartigen Stil widerspiegelt',
        button: 'Bestellung starten'
      }
    }
  };

  const t = content[language];

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        setFetchError(null);
        const [menusResult, productsResult] = await Promise.allSettled([
          menusApi.getMenus(),
          productsApi.getProducts({ available: true }),
        ]);

        let nextMenus: ApiMenu[] = [];
        let nextProducts: ApiProduct[] = [];
        const hasMenuError = menusResult.status === 'rejected';
        const hasProductsError = productsResult.status === 'rejected';

        if (menusResult.status === 'fulfilled') {
          nextMenus = (menusResult.value || []).map((menu) => ({
            ...menu,
            products: menu?.menuProducts ? menu.menuProducts.map((mp) => mp.productId) : menu?.products || [],
          }));
        }

        if (productsResult.status === 'fulfilled') {
          nextProducts = productsResult.value || [];
        }

        if (hasMenuError && hasProductsError) {
          setFetchError('Unable to load menus right now.');
        }

        setMenus(nextMenus);
        setProducts(nextProducts);
      } catch {
        setFetchError('Unable to load menus right now.');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const openMenuDetails = (menu: MenuHighlight) => {
    setSelectedMenu(menu);
    setIsMenuModalClosing(false);
  };

  const closeMenuDetails = () => {
    if (!selectedMenu) return;
    setIsMenuModalClosing(true);
    setTimeout(() => {
      setSelectedMenu(null);
      setIsMenuModalClosing(false);
    }, 200);
  };

  const fallbackMenuItems = [
    {
      id: 1,
      name: 'Truffle-infused Wild Mushroom Risotto',
      category: 'corporate',
      description: 'Arborio rice with seasonal wild mushrooms, white truffle oil, and Parmigiano-Reggiano',
      price: 24,
      organic: true,
      preparation: '25 min',
      image: '/images/risotto.jpg',
      popularity: 95,
      dietary: ['Vegetarian', 'Gluten-Free'],
      chefNote: 'Our signature dish featuring imported Italian truffles'
    },
    {
      id: 2,
      name: 'Herb-crusted Rack of Lamb',
      category: 'wedding',
      description: 'New Zealand lamb with rosemary crust, mint jus, and roasted root vegetables',
      price: 38,
      preparation: '35 min',
      image: '/images/lamb.jpg',
      popularity: 88,
      dietary: ['Gluten-Free'],
      chefNote: 'Premium New Zealand lamb with fresh garden herbs'
    },
    {
      id: 3,
      name: 'Seared Scallops with Citrus Beurre Blanc',
      category: 'cocktail',
      description: 'Day boat scallops with orange reduction, micro greens, and crispy prosciutto',
      price: 28,
      organic: true,
      preparation: '20 min',
      image: '/images/scallops.jpg',
      popularity: 92,
      dietary: ['Gluten-Free'],
      chefNote: 'Fresh Atlantic scallops with citrus emulsion'
    },
    {
      id: 4,
      name: 'Heirloom Tomato Burrata Salad',
      category: 'seasonal',
      description: 'Colorful heirloom tomatoes with fresh burrata, basil oil, and balsamic reduction',
      price: 18,
      organic: true,
      preparation: '15 min',
      image: '/images/salad.jpg',
      popularity: 85,
      dietary: ['Vegetarian', 'Gluten-Free'],
      chefNote: 'Farm-fresh heirloom tomatoes with Italian burrata'
    },
    {
      id: 5,
      name: 'Beef Wellington Canapés',
      category: 'premium',
      description: 'Mini beef wellington with mushroom duxelles and puff pastry',
      price: 22,
      preparation: '30 min',
      image: '/images/beef-wellington.jpg',
      popularity: 90,
      dietary: [],
      chefNote: 'Elegant bite-sized version of the classic'
    },
    {
      id: 6,
      name: 'Chocolate Fondant with Raspberry Coulis',
      category: 'wedding',
      description: 'Warm chocolate cake with liquid center and fresh raspberry sauce',
      price: 16,
      preparation: '18 min',
      image: '/images/fondant.jpg',
      popularity: 94,
      dietary: ['Vegetarian'],
      chefNote: 'Decadent chocolate dessert with seasonal berries'
    }
  ];

  const menuHighlights = useMemo(() => {
    const toHighlightItem = (
      item: { id: number; name: string; description?: string; image?: string } | null | undefined
    ): MenuHighlightItem | null => {
      if (!item || item.id == null || !item.name) {
        return null;
      }
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
      };
    };

    if (menus.length) {
      const productMap = new Map(products.map((product) => [product.id, product]));
      return (menus || []).map((menu) => {
        let items: MenuHighlightItem[] = [];
        if (menu.menuProducts && menu.menuProducts.length) {
          items = menu.menuProducts
            .map((menuProduct) => toHighlightItem(menuProduct.product))
            .filter(Boolean) as MenuHighlightItem[];
        } else if (menu.products && menu.products.length) {
          items = menu.products
            .map((id) => toHighlightItem(productMap.get(id)))
            .filter(Boolean) as MenuHighlightItem[];
        }
        const coverImage = menu.image
          || items.find((item) => item.image)?.image
          || '/images/home_image.jpeg';
        return {
          ...menu,
          items,
          coverImage
        };
      });
    }

    const sourceItems = products.length
      ? products.map((product) => ({
          ...product,
          category: product.menuCategory || product.category || 'general',
        }))
      : fallbackMenuItems;

    const groupedItems = sourceItems.reduce((acc, item) => {
      const category = item.category || 'general';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, Array<{ id: number; name: string; description?: string; image?: string; category?: string }>>);

    return Object.entries(groupedItems).map(([category, items], index) => {
      const coverImage = items.find((item) => item.image)?.image || '/images/home_image.jpeg';
      const description = items.length
        ? items.slice(0, 3).map((item) => item.name).join(', ')
        : '';
      return {
        id: -(index + 1),
        name: t.categories[category] || category,
        description,
        category,
        type: category,
        isActive: true,
        items: items
          .map((item) => toHighlightItem(item))
          .filter(Boolean) as MenuHighlightItem[],
        coverImage
      };
    });
  }, [menus, products, language]);

  const MenuHighlightCard = ({ menu }: { menu: MenuHighlight }) => {
    const tags = Array.from(new Set([menu.category, menu.type].filter(Boolean))) as string[];
    const priceLabel = typeof menu.price === 'number' ? menu.price.toFixed(2) : '';
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => openMenuDetails(menu)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openMenuDetails(menu);
          }
        }}
        aria-label={`${t.menuHighlights.viewDetails}: ${menu.name}`}
        className="group relative overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-left focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${menu.coverImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
        <div className="relative p-6 min-h-[220px] flex flex-col justify-end text-white">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-amber-200 mb-3">
              {tags.map((tag) => (
                <span key={`${menu.id}-${tag}`} className="px-2 py-1 bg-white/10 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h3 className="text-2xl font-bold font-elegant mb-2">{menu.name}</h3>
          <p className="text-sm text-white/80 mb-4 max-h-16 overflow-hidden">{menu.description || ''}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-amber-200">
              {priceLabel ? `${t.menuHighlights.priceLabel} €${priceLabel}` : t.menuHighlights.viewDetails}
            </span>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openMenuDetails(menu);
              }}
              className="uppercase tracking-[0.2em] text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors"
              aria-label={`${t.menuHighlights.viewDetails}: ${menu.name}`}
            >
              {t.menuHighlights.viewDetails}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MenuDetailsModal = () => {
    const isOpen = !!selectedMenu;
    const items = selectedMenu?.items ?? [];
    const priceLabel = selectedMenu && typeof selectedMenu.price === 'number'
      ? selectedMenu.price.toFixed(2)
      : '';

    return (
      <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen && !isMenuModalClosing ? 'opacity-60' : 'opacity-0'}`}
          onClick={closeMenuDetails}
        />
        <div
          className={`relative bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto transition-all duration-300 transform ${isOpen && !isMenuModalClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        >
          <div
            className="relative h-56 md:h-72 bg-cover bg-center"
            style={{ backgroundImage: `url('${selectedMenu?.coverImage || '/images/home_image.jpeg'}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none" />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                closeMenuDetails();
              }}
              className="absolute top-4 right-4 z-10 bg-white/90 text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-md transition-colors pointer-events-auto"
              aria-label="Close menu details"
            >
              <X size={18} />
            </button>
            <div className="relative h-full flex flex-col justify-end p-6 text-white">
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-amber-200 mb-3">
                {selectedMenu?.category && (
                  <span className="px-2 py-1 bg-white/10 rounded-full">{selectedMenu.category}</span>
                )}
                {selectedMenu?.type && (
                  <span className="px-2 py-1 bg-white/10 rounded-full">{selectedMenu.type}</span>
                )}
              </div>
              <h3 className="text-3xl font-bold font-elegant mb-2">{selectedMenu?.name}</h3>
              {priceLabel && (
                <p className="text-sm font-semibold text-amber-200">
                  {t.menuHighlights.priceLabel} €{priceLabel}
                </p>
              )}
            </div>
          </div>
          <div className="p-6">
            {selectedMenu?.description && (
              <p className="text-gray-700 text-sm leading-relaxed mb-6">{selectedMenu.description}</p>
            )}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">{t.menuHighlights.includes}</h4>
              {items.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-stone-50 border border-stone-100 rounded-xl p-3">
                      <img
                        src={item.image || '/images/home_image.jpeg'}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-gray-600">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">{t.menuHighlights.noItems}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
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
        
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out;
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

      <MenuDetailsModal />

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold text-gray-900 font-elegant italic">
              <img src="/images/logo.png" alt="" className="w-50 h-auto" />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/home" className="text-gray-900 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">{t.nav.home}</a>
              <a href="/about" className="text-gray-900 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">{t.nav.about}</a>
              <a href="/services" className="text-gray-900 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">{t.nav.services}</a>
              <a href="/menus" className="text-amber-700 transition-all duration-300 transform hover:scale-105 font-medium">{t.nav.menus}</a>
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
                <a href="/" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">{t.nav.home}</a>
                <a href="/about" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">{t.nav.about}</a>
                <a href="/services" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">{t.nav.services}</a>
                <a href="/menus" className="text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">{t.nav.menus}</a>
                <a href="/contact" className="text-gray-900 hover:text-amber-700 font-semibold transition-all duration-300 transform hover:translate-x-2">{t.nav.contact}</a>
                <button 
                  onClick={toggleLanguage}
                  aria-label={language === 'EN' ? 'Switch to German' : 'Switch to English'}
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
                <button
                  onClick={handleOrderClick}
                  className="px-6 py-2 text-sm bg-amber-700 text-white rounded-lg hover:bg-amber-800 font-medium transition-all duration-300 transform hover:scale-105"
                >
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
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {fetchError && menuHighlights.length === 0 && (
            <p className="text-center text-sm text-red-600 mb-4">{fetchError}</p>
          )}
          {isLoadingData && menuHighlights.length === 0 && (
            <p className="text-center text-sm text-gray-500 mb-4">Loading menus...</p>
          )}
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-[0.2em] text-amber-700 font-semibold">
                {t.menuHighlights.title}
              </p>
              <h2 className="text-3xl font-bold text-gray-900 font-elegant mt-3">
                {t.menuHighlights.subtitle}
              </h2>
            </div>
            {menuHighlights.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No menus available right now.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {menuHighlights.map((menu) => (
                  <MenuHighlightCard key={menu.id} menu={menu} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <h3 className="text-2xl font-bold mb-4 font-elegant italic">La Cannelle</h3>
              <p className="text-gray-400 italic">Creating unforgettable culinary experiences</p>
            </div>
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{commonFooter.quickLinks}</h4>
              <div className="flex flex-col gap-2">
                <a href="/home" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.home}</a>
                <a href="/about" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.about}</a>
                <a href="/services" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.services}</a>
                <a href="/menus" className="text-amber-400 font-semibold transition-all duration-300 transform hover:translate-x-1">{t.nav.menus}</a>
                <a href="/contact" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.contact}</a>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{commonFooter.contact}</h4>
              <div className="flex flex-col gap-3 text-gray-400">
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Phone size={18} />
                  <span>02133 978 2992</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Mail size={18} />
                  <span>booking@la-cannelle.com</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <MapPin size={18} />
                  <span>Borsigstraße 2, 41541 Dormagen</span>
                </div>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{commonFooter.followUs}</h4>
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
