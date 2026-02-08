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
import { ThemeToggle } from '@/components/site/ThemeToggle';

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
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
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
    if (!selectedMenu) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMenu]);

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

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        setFetchError(null);
        const [menusResult, productsResult] = await Promise.allSettled([
          menusApi.getMenus({ includeImages: true }),
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

  const menuHighlights = useMemo(() => {
    const toHighlightItem = (
      item: { id: number; name: string; description?: string; image?: string } | null | undefined
    ): MenuHighlightItem | null => {
      if (!item || item.id == null || !item.name) {
        return null;
      }
      const name = item.name;
      const description = item.description;
      return {
        id: item.id,
        name,
        description,
        image: item.image,
      };
    };

    if (menus.length) {
      const productMap = new Map(products.map((product) => [product.id, product]));
      return (menus || []).map((menu) => {
        const localizedName = menu.name;
        const localizedDescription = menu.description;
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
          name: localizedName,
          description: localizedDescription,
          items,
          coverImage
        };
      });
    }

    const sourceItems = products.length
      ? products.map((product) => {
          const rawCategory = (product.category || '').toString().toLowerCase().replace(/[^a-z]/g, '');
          const categoryMap: Record<string, string> = {
            starter: 'starters',
            starters: 'starters',
            main: 'mains',
            mains: 'mains',
            side: 'sides',
            sides: 'sides',
            dessert: 'desserts',
            desserts: 'desserts',
            beverage: 'drinks',
            beverages: 'drinks',
            drink: 'drinks',
            drinks: 'drinks',
          };
          return {
            ...product,
            category: categoryMap[rawCategory] || 'general',
          };
        })
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
        ? items.slice(0, 3).map((item: any) => (
          item.name
        )).join(', ')
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
    const priceLabel = typeof menu.price === 'number' ? menu.price.toFixed(2) : '';
    const steps = Array.isArray(menu.steps) ? menu.steps : [];
    const dishesAvailable = Array.isArray(menu.items)
      ? menu.items.length
      : Array.isArray(menu.products)
      ? menu.products.length
      : Array.isArray(menu.menuProducts)
      ? menu.menuProducts.length
      : 0;

    const normalizeCategoryValue = (value?: string) => (
      value ? value.toLowerCase().replace(/[^a-z]/g, '') : ''
    );

    const normalizeMenuStepKey = (label?: string) => {
      if (!label) return '';
      const normalized = normalizeCategoryValue(label);
      const aliases: Record<string, string> = {
        starter: 'starter',
        starters: 'starter',
        main: 'main',
        mains: 'main',
        entree: 'main',
        side: 'side',
        sides: 'side',
        dessert: 'dessert',
        desserts: 'dessert',
        drink: 'beverage',
        drinks: 'beverage',
        beverage: 'beverage',
        beverages: 'beverage'
      };
      return aliases[normalized] || normalized;
    };

    const stepLabelFor = (label?: string) => {
      const key = normalizeMenuStepKey(label);
      if (!key) return label || '';
      const labels = language === 'DE'
        ? {
            fingerfood: 'Fingerfood',
            starter: 'Vorspeisen',
            main: 'Hauptgänge',
            side: 'Beilagen',
            dessert: 'Desserts',
            beverage: 'Getränke',
            canape: 'Canape',
            appetizer: 'Vorspeise',
            salad: 'Salat',
            soup: 'Suppe',
            pasta: 'Pasta',
            seafood: 'Meeresfrüchte',
            meat: 'Fleisch',
            vegetarian: 'Vegetarisch',
            vegan: 'Vegan',
            glutenfree: 'Glutenfrei',
            dairyfree: 'Laktosefrei',
            spicy: 'Scharf',
            signature: 'Signature',
            seasonal: 'Saisonal',
            kidfriendly: 'Kinderfreundlich',
            chefspecial: 'Chef-Special',
            tapas: 'Tapas',
            bbq: 'BBQ',
            breakfast: 'Frühstück',
            brunch: 'Brunch'
          }
        : {
            fingerfood: 'Finger Food',
            starter: 'Starters',
            main: 'Mains',
            side: 'Sides',
            dessert: 'Desserts',
            beverage: 'Drinks',
            canape: 'Canape',
            appetizer: 'Appetizer',
            salad: 'Salad',
            soup: 'Soup',
            pasta: 'Pasta',
            seafood: 'Seafood',
            meat: 'Meat',
            vegetarian: 'Vegetarian',
            vegan: 'Vegan',
            glutenfree: 'Gluten-Free',
            dairyfree: 'Dairy-Free',
            spicy: 'Spicy',
            signature: 'Signature',
            seasonal: 'Seasonal',
            kidfriendly: 'Kid-Friendly',
            chefspecial: 'Chef-Special',
            tapas: 'Tapas',
            bbq: 'BBQ',
            breakfast: 'Breakfast',
            brunch: 'Brunch'
          };
      return (labels as any)[key] || (label || '');
    };

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
        className="group flex h-full min-h-[480px] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#A6A6A6] text-left focus:outline-none focus:ring-2 focus:ring-[color:#A69256] cursor-pointer"
      >
        <div className="relative h-56 shrink-0 bg-gray-100 overflow-hidden">
          <img 
            src={menu.coverImage} 
            alt={menu.name} 
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="flex flex-1 flex-col p-8">
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-2xl font-medium font-display text-gray-900 mb-2">{menu.name}</h3>
              <p className="line-clamp-2 text-sm text-gray-600 leading-relaxed">{menu.description || ''}</p>
            </div>
            
            <div className="space-y-3 text-sm text-gray-700">
              {steps.map((step: any, index: number) => (
                <div key={`${menu.id}-step-${index}`} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span className="font-medium">{step.included} {stepLabelFor(step.label)}</span>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#A69256]/15 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-[#A69256]" />
                </div>
                <span className="font-medium">
                  {dishesAvailable} {t.labels.dishesAvailable}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-gray-200 space-y-3">
            {priceLabel && (
              <div>
                <div className="text-2xl font-semibold text-gray-900">
                  €{priceLabel}
                </div>
                <div className="text-xs text-gray-500 mt-1">{t.labels.exclVat}</div>
              </div>
            )}
            {menu.minPeople && (
              <div className="text-sm text-gray-700">
                {t.labels.minPeople(menu.minPeople)}
              </div>
            )}
            
            <button className="w-full rounded-xl bg-[#A69256] hover:bg-[#0D0D0D] px-6 py-3 text-center text-sm font-semibold text-[#F2F2F2] transition-colors duration-300 group-hover:shadow-md">
              {t.labels.selectFood}
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
      <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/45 supports-[backdrop-filter]:bg-black/35 backdrop-blur-md transition-opacity duration-300 ${isOpen && !isMenuModalClosing ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMenuDetails}
        />
        <div
          className={`relative bg-gradient-to-b from-white/85 via-white/80 to-white/75 supports-[backdrop-filter]:bg-white/70 backdrop-blur-xl border border-[#A69256]/25 ring-1 ring-black/5 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.20),0_10px_30px_rgba(166,146,86,0.12)] transition-all duration-300 transform ${isOpen && !isMenuModalClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        >
          <div
            className="relative h-80 bg-cover bg-center"
            style={{ backgroundImage: `url('${selectedMenu?.coverImage || '/images/home_image.jpeg'}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                closeMenuDetails();
              }}
              className="absolute top-6 right-6 z-10 bg-white/60 backdrop-blur-sm text-[#404040]/70 border border-black/10 hover:bg-white/80 hover:text-[#404040] hover:border-[#A69256]/25 rounded-full p-3 shadow-lg transition-all duration-200"
              aria-label="Close menu details"
            >
              <X size={20} />
            </button>
            <div className="relative h-full flex flex-col justify-end p-8 text-white">
              <h3 className="text-4xl lg:text-5xl font-light font-display mb-3">
                {selectedMenu?.name}
              </h3>
              {priceLabel && (
                <p className="text-lg font-medium text-[#A69256]">
                  {t.menuHighlights.priceLabel} €{priceLabel}
                </p>
              )}
            </div>
          </div>
          
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-320px)]">
            {selectedMenu?.description && (
              <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                {selectedMenu.description}
              </p>
            )}
            
            <div>
              <h4 className="text-xl font-medium text-gray-900 mb-6 font-display">{t.menuHighlights.includes}</h4>
              {items.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-white/60 backdrop-blur-sm border border-black/5 rounded-2xl p-4 hover:border-[#A69256]/25 transition-colors">
                      <img
                        src={item.image || '/images/home_image.jpeg'}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">{t.menuHighlights.noItems}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out; }
        
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
      <section className="pt-40 pb-24 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#A69256]/12 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-xs uppercase tracking-[0.3em] text-[#A69256] font-semibold mb-4">Curated Selections</p>
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

      {/* Main Content - Premium Grid */}
      <section className="py-24 px-6 lg:px-8 bg-white lux-reveal" data-lux-delay="40">
        <div className="max-w-7xl mx-auto">
          {fetchError && menuHighlights.length === 0 && (
            <p className="text-center text-red-600 mb-8">{fetchError}</p>
          )}
          {isLoadingData && menuHighlights.length === 0 && (
            <LoadingSpinner className="mb-8" label={t.labels.loadingMenus} />
          )}
          
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-[#A69256] font-semibold mb-3">
                {t.menuHighlights.title}
              </p>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 font-display mb-4">
                {t.menuHighlights.subtitle}
              </h2>
            </div>
            
            {menuHighlights.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">{t.labels.noMenusAvailable}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {menuHighlights.map((menu) => (
                  <MenuHighlightCard key={menu.id} menu={menu} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-[#404040] text-[#F2F2F2] py-20 px-6 lg:px-8 lux-reveal" data-lux-delay="80">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <h3 className="text-2xl font-light mb-4 font-display">La Cannelle</h3>
              <p className="text-[#F2F2F2]/70 text-sm">{commonFooter.brandTagline}</p>
            </div>
            
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{commonFooter.quickLinks}</h4>
              <div className="flex flex-col gap-3">
                <a href="/home" className="text-white hover:text-[#A69256] transition-colors">{t.nav.home}</a>
                <a href="/services" className="text-white hover:text-[#A69256] transition-colors">{t.nav.services}</a>
                <a href="/menus" className="text-white font-semibold">{t.nav.menus}</a>
                <a href="/contact" className="text-white hover:text-[#A69256] transition-colors">{t.nav.contact}</a>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{commonFooter.contact}</h4>
              <div className="flex flex-col gap-3 text-[#F2F2F2]/70">
                <div className="flex items-center gap-3">
                  <Phone size={16} />
                  <span className="text-sm">{commonFooter.contactPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} />
                  <span className="text-sm">{commonFooter.contactEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span className="text-sm">{commonFooter.contactAddress}</span>
                </div>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{commonFooter.followUs}</h4>
              <div className="flex flex-col gap-2 text-[#F2F2F2]/70">
                <a href="https://www.instagram.com/lacannellecatering/" className="hover:text-[#A69256] transition-colors text-sm">{commonFooter.social.instagram}</a>
                <a href="https://www.tiktok.com/@lacannellecatering" className="hover:text-[#A69256] transition-colors text-sm">{commonFooter.social.tiktok}</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-[#F2F2F2]/60 text-sm">
            <p>{commonFooter.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
