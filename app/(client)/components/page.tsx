"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { menusApi, type Menu as ApiMenu } from '@/lib/api/menus';
import { productsApi, type Product as ApiProduct } from '@/lib/api/products';
import { useTranslation } from '@/lib/hooks/useTranslation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { menusTranslations } from '@/lib/translations/menus';
import { homeTranslations } from '@/lib/translations/home';

type MenuHighlightItem = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  price?: number;
};

type MenuHighlight = ApiMenu & {
  items: MenuHighlightItem[];
  coverImage: string;
  isPopular?: boolean;
  isFeatured?: boolean;
};

interface MenuShowcaseHorizontalProps {
  limit?: number;
  showViewAll?: boolean;
  title?: string;
  description?: string;
  language?: 'EN' | 'DE';
}

export default function MenuShowcaseHorizontal({
  limit = 6,
  showViewAll = true,
  title,
  description,
  language: propLanguage,
}: MenuShowcaseHorizontalProps) {
  const { language: contextLanguage } = useTranslation('menus');
  const language = propLanguage || contextLanguage;
  
  const [selectedMenu, setSelectedMenu] = useState<MenuHighlight | null>(null);
  const [isMenuModalClosing, setIsMenuModalClosing] = useState(false);
  const [menus, setMenus] = useState<ApiMenu[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const menuT = menusTranslations[language];
  const homeT = homeTranslations[language];

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
          setFetchError(menuT.labels?.menusLoadFailed || homeT.errors?.menusLoadFailed || 'Failed to load menu items');
        }

        setMenus(nextMenus);
        setProducts(nextProducts);
      } catch {
        setFetchError(menuT.labels?.menusLoadFailed || homeT.errors?.menusLoadFailed || 'Failed to load menu items');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [language]);

  const menuHighlights = useMemo(() => {
    const toHighlightItem = (
      item: { id: number; name: string; description?: string; image?: string; price?: number } | null | undefined
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
        price: item.price,
      };
    };

    if (menus.length) {
      const productMap = new Map(products.map((product) => [product.id, product]));
      const processedMenus = (menus || []).map((menu) => {
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
        const coverImage = menu.image || '/images/home_image.jpeg';
        return {
          ...menu,
          name: localizedName,
          description: localizedDescription,
          items,
          coverImage,
          isPopular: menu.popularity ? menu.popularity >= 80 : false,
          isFeatured: menu.popularity ? menu.popularity >= 60 : false,
        };
      });
      
      return limit ? processedMenus.slice(0, limit) : processedMenus;
    }

    const fallbackMenuItems = {
      EN: [
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
      ],
      DE: [
        {
          id: 1,
          name: 'Trüffel-Wildpilz-Risotto',
          category: 'corporate',
          description: 'Arborio-Reis mit saisonalen Wildpilzen, weißem Trüffelöl und Parmigiano-Reggiano',
          price: 24,
          organic: true,
          preparation: '25 min',
          image: '/images/risotto.jpg',
          popularity: 95,
          dietary: ['Vegetarisch', 'Glutenfrei'],
          chefNote: 'Unser Signature-Gericht mit importierten italienischen Trüffeln'
        },
        {
          id: 2,
          name: 'Kräuterkruste Lammkarree',
          category: 'wedding',
          description: 'Neuseeländisches Lamm mit Rosmarinkruste, Minzjus und geröstetem Wurzelgemüse',
          price: 38,
          preparation: '35 min',
          image: '/images/lamb.jpg',
          popularity: 88,
          dietary: ['Glutenfrei'],
          chefNote: 'Premium-Lamm aus Neuseeland mit frischen Gartenkräutern'
        },
        {
          id: 3,
          name: 'Gebratene Jakobsmuscheln mit Zitrus-Beurre Blanc',
          category: 'cocktail',
          description: 'Frische Jakobsmuscheln mit Orangensoße, Mikrogrün und knusprigem Prosciutto',
          price: 28,
          organic: true,
          preparation: '20 min',
          image: '/images/scallops.jpg',
          popularity: 92,
          dietary: ['Glutenfrei'],
          chefNote: 'Frische Atlantik-Jakobsmuscheln mit Zitrus-Emulsion'
        },
        {
          id: 4,
          name: 'Alte Tomatensorten Burrata Salat',
          category: 'seasonal',
          description: 'Bunte alte Tomatensorten mit frischer Burrata, Basilikumöl und Balsamico-Reduktion',
          price: 18,
          organic: true,
          preparation: '15 min',
          image: '/images/salad.jpg',
          popularity: 85,
          dietary: ['Vegetarisch', 'Glutenfrei'],
          chefNote: 'Frische alte Tomatensorten vom Bauernhof mit italienischer Burrata'
        },
        {
          id: 5,
          name: 'Beef Wellington Canapés',
          category: 'premium',
          description: 'Mini Beef Wellington mit Pilz-Duxelles und Blätterteig',
          price: 22,
          preparation: '30 min',
          image: '/images/beef-wellington.jpg',
          popularity: 90,
          dietary: [],
          chefNote: 'Elegante mundgerechte Version des Klassikers'
        },
        {
          id: 6,
          name: 'Schokoladen-Fondant mit Himbeer-Coulis',
          category: 'wedding',
          description: 'Warmer Schokoladenkuchen mit flüssigem Kern und frischer Himbeersauce',
          price: 16,
          preparation: '18 min',
          image: '/images/fondant.jpg',
          popularity: 94,
          dietary: ['Vegetarisch'],
          chefNote: 'Üppiges Schokoladendessert mit saisonalen Beeren'
        }
      ]
    };

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
      : fallbackMenuItems[language] || fallbackMenuItems.EN;

    const groupedItems = sourceItems.reduce((acc, item) => {
      const category = item.category || 'general';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, Array<{ id: number; name: string; description?: string; image?: string; category?: string }>>);

    const result = Object.entries(groupedItems).map(([category, items], index) => {
      const coverImage = items.find((item) => item.image)?.image || '/images/home_image.jpeg';
      const description = items.length
        ? items.slice(0, 3).map((item: any) => (
          item.name
        )).join(', ')
        : '';
      return {
        id: -(index + 1),
        name: menuT.categories?.[category] || category,
        description,
        category,
        type: category,
        isActive: true,
        items: items
          .map((item) => toHighlightItem(item))
          .filter(Boolean) as MenuHighlightItem[],
        coverImage,
        isPopular: index < 2,
        isFeatured: index < 3,
      };
    });
    
    return limit ? result.slice(0, limit) : result;
  }, [menus, products, language, limit, menuT.categories]);

  useEffect(() => {
    if (!selectedMenu) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMenu]);

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
              aria-label={language === 'DE' ? 'Menüdetails schließen' : 'Close menu details'}
            >
              <X size={18} />
            </button>
            <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 text-white">
              <h3 className="text-3xl font-bold font-elegant mb-2">
                {selectedMenu?.name}
              </h3>
              {priceLabel && (
                <p className="text-sm font-semibold text-amber-200">
                  {menuT.menuHighlights?.priceLabel || homeT.menus?.priceLabel || (language === 'DE' ? 'Ab' : 'Starting at')} €{priceLabel}
                </p>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {selectedMenu?.description && (
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                {selectedMenu.description}
              </p>
            )}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {menuT.menuHighlights?.includes || homeT.menus?.includes || (language === 'DE' ? 'Enthält' : 'Includes')}
              </h4>
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
                <p className="text-sm text-gray-500">
                  {menuT.menuHighlights?.noItems || homeT.menus?.noItems || (language === 'DE' ? 'Menüdetails auf Anfrage erhältlich.' : 'Menu details available upon request.')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 font-elegant">
            {title || menuT.menuHighlights?.title || homeT.menus?.title || (language === 'DE' ? 'Unsere Menüs' : 'Our Menus')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {description || menuT.menuHighlights?.subtitle || homeT.menus?.description || (language === 'DE' ? 'Entdecken Sie unsere ausgewählten Menüs und sehen Sie die Details' : 'Explore our signature menus and view the details')}
          </p>
        </div>

        {fetchError && menuHighlights.length === 0 && (
          <p className="text-center text-sm text-red-600 mb-4">{fetchError}</p>
        )}
        
        {isLoadingData && menuHighlights.length === 0 && (
          <LoadingSpinner 
            className="mb-4" 
            label={menuT.labels?.loadingMenus || homeT.menus?.loading || (language === 'DE' ? 'Menüs werden geladen...' : 'Loading menus...')} 
          />
        )}

        <div className="relative">
          <div className="flex overflow-x-auto pb-6 space-x-6 scrollbar-hide">
            {menuHighlights.map((menu, index) => {
              const firstImage = menu.coverImage || '/images/home_image.jpeg';
              
              const displayPrice = menu.price 
                ? `€${menu.price.toFixed(2)}`
                : menu.items?.length 
                  ? `€${(menu.items.reduce((sum, item) => sum + (item.price || 0), 0)).toFixed(2)}`
                  : null;

              return (
                <div
                  key={menu.id}
                  className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={firstImage}
                      alt={menu.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                    {menu.isPopular && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {menuT.menuShowcase?.badges?.popular || homeT.menuShowcase?.badges?.popular || (language === 'DE' ? 'Beliebt' : 'Popular')}
                      </div>
                    )}
                    {menu.isFeatured && (
                      <div className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {menuT.menuShowcase?.badges?.featured || homeT.menuShowcase?.badges?.featured || (language === 'DE' ? 'Empfohlen' : 'Featured')}
                      </div>
                    )}

                    {displayPrice && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <span className="font-bold text-gray-900 text-sm">{displayPrice}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 font-elegant line-clamp-1">
                        {menu.name}
                      </h3>
                    </div>
                    <p className="text-amber-600 text-xs font-semibold mb-2">
                      {menu.category || menu.type || menuT.categories?.all || homeT.menus?.categoryAll || (language === 'DE' ? 'Menü' : 'Menu')}
                    </p>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                      {menu.description}
                    </p>

                    <button
                      className="w-full bg-amber-50 text-amber-700 py-2 rounded-lg font-semibold hover:bg-amber-100 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2 text-sm"
                      onClick={() => openMenuDetails(menu)}
                    >
                      {menuT.menuShowcase?.viewDetails || homeT.menus?.viewDetails || (language === 'DE' ? 'Details anzeigen' : 'View Details')}
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            {menuHighlights.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300"
              />
            ))}
          </div>
        </div>

        {showViewAll && menuHighlights.length > 0 && (
          <div className="text-center mt-8">
            <button 
              className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 shadow-lg text-sm"
              onClick={() => window.location.href = '/menus'}
            >
              {menuT.menuShowcase?.exploreFull || homeT.menus?.exploreFull || (language === 'DE' ? 'Vollständige Menüsammlung erkunden' : 'Explore Full Menu Collection')}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {selectedMenu && <MenuDetailsModal />}
    </section>
  );
}
