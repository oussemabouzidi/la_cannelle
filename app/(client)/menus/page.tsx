"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, Phone, Mail, MapPin, Check } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { menusApi, type Menu as ApiMenu } from '@/lib/api/menus';
import { productsApi, type Product as ApiProduct } from '@/lib/api/products';
import { commonTranslations } from '@/lib/translations/common';
import { menusTranslations } from '@/lib/translations/menus';
import { useTranslation } from '@/lib/hooks/useTranslation';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  const { language, toggleLanguage } = useTranslation('menus');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuHighlight | null>(null);
  const [isMenuModalClosing, setIsMenuModalClosing] = useState(false);
  const [menus, setMenus] = useState<ApiMenu[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const commonFooter = commonTranslations[language].footer;
  const commonA11y = commonTranslations[language].accessibility;
  const t = menusTranslations[language];

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

  const handleOrderClick = () => {
    router.push('/order');
  };

  useEffect(() => {
    if (!selectedMenu) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMenu]);

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
        about: 'Ãœber uns',
        services: 'Dienstleistungen',
        menus: 'MenÃ¼s',
        contact: 'Kontakt',
        connect: 'Verbinden',
        order: 'Jetzt bestellen'
      },
      hero: {
        title: 'Unsere MenÃ¼s',
        subtitle: 'SorgfÃ¤ltig zusammengestellte kulinarische Erlebnisse fÃ¼r jeden Anlass'
      },
      categories: {
        title: 'MenÃ¼kategorien',
        all: 'Alle MenÃ¼s',
        corporate: 'Firmenveranstaltungen',
        wedding: 'Hochzeitsfeiern',
        cocktail: 'Cocktail-Partys',
        seasonal: 'Saisonale SpezialitÃ¤ten',
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
        title: 'Erstellen Sie Ihr perfektes MenÃ¼',
        subtitle: 'Kombinieren Sie aus unserer umfangreichen Auswahl',
        guests: 'Anzahl der GÃ¤ste',
        budget: 'Budgetbereich',
        dietary: 'DiÃ¤tvorlieben',
        addToPlan: 'Zum MenÃ¼plan hinzufÃ¼gen',
        viewPlan: 'MenÃ¼plan ansehen',
        totalItems: 'AusgewÃ¤hlte Artikel',
        searchPlaceholder: 'MenÃ¼punkte suchen...',
        menuPlan: 'Ihr MenÃ¼plan',
        totalPrice: 'Gesamtpreis',
        clearAll: 'Alle lÃ¶schen',
        close: 'SchlieÃŸen',
        noItems: 'Noch keine Artikel zum MenÃ¼plan hinzugefÃ¼gt.'
      },
      pricing: {
        title: 'Preisgestaltung',
        subtitle: 'Flexible Optionen fÃ¼r Ihre BedÃ¼rfnisse',
        basic: {
          name: 'Essential',
          price: '€45',
          period: 'pro Person',
          features: [
            '3-GÃ¤nge-MenÃ¼auswahl',
            'Standard-GetrÃ¤nkepaket',
            'Basis-Tischdekoration',
            'Bis zu 50 GÃ¤ste',
            '5-Stunden-Service'
          ]
        },
        premium: {
          name: 'Premium',
          price: '€75',
          period: 'pro Person',
          features: [
            '5-GÃ¤nge-Gourmet-MenÃ¼',
            'Premium-GetrÃ¤nkeauswahl',
            'Elegante Tischdekoration',
            'Bis zu 100 GÃ¤ste',
            '7-Stunden-Service',
            'PersÃ¶nliche MenÃ¼beratung'
          ],
          popular: true
        },
        luxury: {
          name: 'Luxus',
          price: '€120',
          period: 'pro Person',
          features: [
            '7-GÃ¤nge-Individuelles MenÃ¼',
            'Premium-Open-Bar',
            'Blumendekoration',
            'Unbegrenzte GÃ¤ste',
            'GanztÃ¤giger Service',
            'Dedizierter Eventplaner',
            'Live-Kochstationen'
          ]
        }
      },
      cta: {
        title: 'Bereit fÃ¼r Ihr perfektes MenÃ¼?',
        subtitle: 'Lassen Sie uns ein kulinarisches Erlebnis gestalten, das Ihren einzigartigen Stil widerspiegelt',
        button: 'Bestellung starten'
      }
    }
  };

  // Legacy inline translations are unused (kept for now).

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
            products: menu?.menuProducts ?menu.menuProducts.map((mp) => mp.productId) : menu?.products || [],
          }));
        }

        if (productsResult.status === 'fulfilled') {
          nextProducts = productsResult.value || [];
        }

        if (hasMenuError && hasProductsError) {
          setFetchError(t.labels.menusLoadFailed);
        }

        setMenus(nextMenus);
        setProducts(nextProducts);
      } catch {
        setFetchError(t.labels.menusLoadFailed);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [language]);

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
      name: 'Beef Wellington CanapÃ©s',
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
            .map((menuProduct: any) => toHighlightItem(menuProduct.product || productMap.get(menuProduct.productId)))
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
      ?products.map((product) => ({
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
        ?items.slice(0, 3).map((item) => item.name).join(', ')
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
    const priceLabel = typeof menu.price === 'number' ?menu.price.toFixed(2) : '';
    const steps = Array.isArray(menu.steps) ?menu.steps : [];
    const dishesAvailable = Array.isArray(menu.items)
      ?menu.items.length
      : Array.isArray(menu.products)
      ?menu.products.length
      : Array.isArray(menu.menuProducts)
      ?menu.menuProducts.length
      : 0;
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
        className="group flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-left focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
      >
        <div className="relative h-36 shrink-0 bg-gray-100">
          <img src={menu.coverImage} alt={menu.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold font-elegant text-gray-900">{menu.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">{menu.description || ''}</p>
            </div>
            <div className="max-h-28 space-y-2 overflow-hidden text-sm text-gray-700">
              {steps.map((step: any, index: number) => (
                <div key={`${menu.id}-step-${index}`} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check size={12} />
                  </span>
                  <span>{step.included} {step.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Check size={12} />
                </span>
                <span>
                  {dishesAvailable} {t.labels.dishesAvailable}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-200 space-y-1">
            <div className="text-xl font-bold text-gray-900">
              {priceLabel
                ? t.labels.fromPerPerson(priceLabel)
                : t.menuHighlights.viewDetails}
            </div>
            <div className="text-xs text-gray-500">{t.labels.exclVat}</div>
            {menu.minPeople ?(
              <div className="text-sm font-semibold text-gray-700">
                {t.labels.minPeople(menu.minPeople)}
              </div>
            ) : null}
          </div>
          <div className="pt-2">
            <div className="w-full rounded-xl bg-amber-400/80 px-4 py-2.5 text-center text-xs font-semibold text-white">
              {t.labels.selectFood}
            </div>
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
      <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ?'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen && !isMenuModalClosing ?'opacity-60' : 'opacity-0'}`}
          onClick={closeMenuDetails}
        />
        <div
          className={`relative bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto transition-all duration-300 transform ${isOpen && !isMenuModalClosing ?'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
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
            <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 text-white">


              <h3 className="text-3xl font-bold font-elegant mb-2">{selectedMenu?.name}</h3>
              {priceLabel && (
                <p className="text-sm font-semibold text-amber-200">
                  {t.menuHighlights.priceLabel} €{priceLabel}
                </p>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {selectedMenu?.description && (
              <p className="text-gray-700 text-sm leading-relaxed mb-6">{selectedMenu.description}</p>
            )}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">{t.menuHighlights.includes}</h4>
              {items.length > 0 ?(
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <MenuDetailsModal />

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold text-gray-900 font-elegant italic">
              <img
                src="/images/logo-removebg-preview.png"
                alt="La Cannelle"
                className="h-10 sm:h-12 w-auto object-contain"
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
                aria-label={language === 'EN' ? commonA11y.switchToGerman : commonA11y.switchToEnglish}
                className="px-4 py-2 text-sm border border-amber-300 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-300 transform hover:scale-105 font-medium flex items-center gap-2"
              >
                {language === 'EN' ?(
                  <>
                    <span className="text-lg">
                      <img
                        src="/images/language/Flag_of_United_Kingdom-4096x2048.png"
                        width={27}
                        alt={commonA11y.englishFlagAlt}
                      />
                    </span>
                    English
                  </>
                ) : (
                  <>
                    <span className="text-lg">
                      <img
                        src="/images/language/Flag_of_Germany-4096x2453.png"
                        width={25}
                        alt={commonA11y.germanFlagAlt}
                      />
                    </span>
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
              {isMenuOpen ?<X size={24} /> : <Menu size={24} />}
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
                  {language === 'EN' ?(
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
          <div className={`transition-all duration-1000 ${isVisible ?'animate-fade-in-up' : 'opacity-0'}`}>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 font-elegant italic">
              {t.hero.title}
            </h1>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${isVisible ?'animate-fade-in-up' : 'opacity-0'}`}>
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
            <LoadingSpinner className="mb-4" label={t.labels.loadingMenus} />
          )}
          <div className={`transition-all duration-1000 ${isVisible ?'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-[0.2em] text-amber-700 font-semibold">
                {t.menuHighlights.title}
              </p>
              <h2 className="text-3xl font-bold text-gray-900 font-elegant mt-3">
                {t.menuHighlights.subtitle}
              </h2>
            </div>
            {menuHighlights.length === 0 ?(
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{t.labels.noMenusAvailable}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
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
            <div className={`transition-all duration-1000 ${isVisible ?'animate-fade-in-left' : 'opacity-0'}`}>
              <h3 className="text-2xl font-bold mb-4 font-elegant italic">La Cannelle</h3>
              <p className="text-gray-400 italic">{commonFooter.brandTagline}</p>
            </div>
            <div className={`transition-all duration-1000 delay-100 ${isVisible ?'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{commonFooter.quickLinks}</h4>
              <div className="flex flex-col gap-2">
                <a href="/home" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.home}</a>
                <a href="/about" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.about}</a>
                <a href="/services" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.services}</a>
                <a href="/menus" className="text-amber-400 font-semibold transition-all duration-300 transform hover:translate-x-1">{t.nav.menus}</a>
                <a href="/contact" className="text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1">{t.nav.contact}</a>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-200 ${isVisible ?'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{commonFooter.contact}</h4>
              <div className="flex flex-col gap-3 text-gray-400">
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Phone size={18} />
                  <span>{commonFooter.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <Mail size={18} />
                  <span>{commonFooter.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-300">
                  <MapPin size={18} />
                  <span>{commonFooter.contactAddress}</span>
                </div>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${isVisible ?'animate-fade-in-right' : 'opacity-0'}`}>
              <h4 className="font-semibold mb-4 font-elegant">{commonFooter.followUs}</h4>
              <div className="flex flex-col gap-2 text-gray-400">
                <a href="https://www.instagram.com/lacannellecatering/" className="hover:text-white transition-colors duration-300">{commonFooter.social.instagram}</a>
                <a href="https://www.tiktok.com/@lacannellecatering" className="hover:text-white transition-colors duration-300">{commonFooter.social.tiktok}</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>{commonFooter.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


