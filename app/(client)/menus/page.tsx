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
    `${isActiveHref(href) ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600'} transition-colors duration-200 text-sm font-medium tracking-wide`;

  const mobileLinkClass = (href: string) =>
    `${isActiveHref(href) ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600'} transition-colors duration-200 text-base font-medium`;

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
        className="group flex h-full min-h-[480px] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-amber-300 text-left focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
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
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-amber-600" />
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
            
            <button className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 px-6 py-3 text-center text-sm font-medium text-white transition-colors duration-300 group-hover:shadow-md">
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
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen && !isMenuModalClosing ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMenuDetails}
        />
        <div
          className={`relative bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl transition-all duration-300 transform ${isOpen && !isMenuModalClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
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
              className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-gray-900 rounded-full p-3 shadow-lg transition-all hover:bg-white"
              aria-label="Close menu details"
            >
              <X size={20} />
            </button>
            <div className="relative h-full flex flex-col justify-end p-8 text-white">
              <h3 className="text-4xl lg:text-5xl font-light font-display mb-3">
                {selectedMenu?.name}
              </h3>
              {priceLabel && (
                <p className="text-lg font-medium text-amber-200">
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
                    <div key={item.id} className="flex gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:border-amber-300 transition-colors">
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
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out; }
        
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
            <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold mb-4">Curated Selections</p>
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
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {fetchError && menuHighlights.length === 0 && (
            <p className="text-center text-red-600 mb-8">{fetchError}</p>
          )}
          {isLoadingData && menuHighlights.length === 0 && (
            <LoadingSpinner className="mb-8" label={t.labels.loadingMenus} />
          )}
          
          <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold mb-3">
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
      <footer className="bg-gray-900 text-white py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <h3 className="text-2xl font-light mb-4 font-display">La Cannelle</h3>
              <p className="text-gray-400 text-sm">{commonFooter.brandTagline}</p>
            </div>
            
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{commonFooter.quickLinks}</h4>
              <div className="flex flex-col gap-3">
                <a href="/home" className="text-gray-400 hover:text-white transition-colors">{t.nav.home}</a>
                <a href="/services" className="text-gray-400 hover:text-white transition-colors">{t.nav.services}</a>
                <a href="/menus" className="text-amber-400 font-semibold">{t.nav.menus}</a>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors">{t.nav.contact}</a>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">{commonFooter.contact}</h4>
              <div className="flex flex-col gap-3 text-gray-400">
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
              <div className="flex flex-col gap-2 text-gray-400">
                <a href="https://www.instagram.com/lacannellecatering/" className="hover:text-white transition-colors text-sm">{commonFooter.social.instagram}</a>
                <a href="https://www.tiktok.com/@lacannellecatering" className="hover:text-white transition-colors text-sm">{commonFooter.social.tiktok}</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>{commonFooter.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
