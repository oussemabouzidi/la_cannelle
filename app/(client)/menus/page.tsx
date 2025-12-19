"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Star, Clock, Users, Leaf, Plus, Minus, Heart, Calendar, Users as UsersIcon, Utensils, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { menusApi, type Menu as ApiMenu } from '@/lib/api/menus';
import { productsApi, type Product as ApiProduct } from '@/lib/api/products';
import { commonTranslations } from '@/lib/translations/common';
import { DEFAULT_LANGUAGE, STORAGE_KEY, type Language } from '@/lib/hooks/useTranslation';

export default function MenusPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(20);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenuPlanModal, setShowMenuPlanModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [menus, setMenus] = useState<ApiMenu[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const commonFooter = commonTranslations[language].footer;

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (showMenuPlanModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showMenuPlanModal]);

  const closeModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowMenuPlanModal(false);
      setIsModalClosing(false);
    }, 300);
  };

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
        const [fetchedMenus, fetchedProducts] = await Promise.all([
          menusApi.getMenus({ isActive: true }),
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
        setFetchError('Unable to load menus right now.');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

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

  const productItems = (products.length
    ? products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.menuCategory || product.category || 'general',
        description: product.description,
        price: product.price ?? 0,
        organic: product.ingredients?.some((ing) => ing.toLowerCase().includes('organic')) || false,
        preparation: product.preparationTime ? `${product.preparationTime} min` : 'Prep time varies',
        image: product.image || '/images/home_image.jpeg',
        popularity: product.popularity ?? 80,
        dietary: product.allergens && product.allergens.length ? product.allergens : [],
        chefNote: product.ingredients && product.ingredients.length
          ? `Includes: ${product.ingredients.slice(0, 3).join(', ')}`
          : 'Crafted by our chefs for your event.',
      }))
    : fallbackMenuItems);

  const categoryOptions = menus.length
    ? ['all', ...Array.from(new Set(menus.map((menu) => menu.category || menu.type).filter(Boolean)))]
    : ['all', 'corporate', 'wedding', 'cocktail', 'seasonal', 'premium'];

  const router = useRouter();

  const handleOrderClick = (productIds?: number[]) => {
    const ids = productIds && productIds.length ? productIds : selectedItems.map((item) => item.id);
    const query = ids.length ? `?products=${ids.join(',')}` : '';
    router.push(`/order${query}`);
  };

  const filteredItems = activeCategory === 'all'
    ? productItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : productItems.filter(item =>
        item.category === activeCategory &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const addToMenuPlan = (item) => {
    const existingItem = selectedItems.find(i => i.id === item.id);
    if (existingItem) {
      updateItemQuantity(item.id, existingItem.quantity + 1);
    } else {
      setSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const removeFromMenuPlan = (itemId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromMenuPlan(itemId);
      return;
    }
    setSelectedItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearAllItems = () => {
    setSelectedItems([]);
  };

  const toggleFavorite = (itemId) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const MenuItemCard = ({ item }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-stone-100 overflow-hidden group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {item.organic && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Leaf size={12} />
              Organic
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          onClick={() => toggleFavorite(item.id)}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-300"
        >
          <Heart 
            size={18} 
            className={favorites.includes(item.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-600'} 
          />
        </button>

        {/* Popularity Bar */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between text-white text-xs mb-1">
            <span>Popularity</span>
            <span>{item.popularity}%</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-1.5">
            <div 
              className="bg-amber-400 h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${item.popularity}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-xl font-semibold text-gray-900 font-elegant group-hover:text-amber-700 transition-colors flex-1">
            {item.name}
          </h4>
          <span className="text-2xl font-bold text-amber-700 font-elegant ml-3">
            €{item.price}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 font-light italic leading-relaxed text-sm">
          {item.description}
        </p>

        {/* Dietary Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {item.dietary.map((diet, index) => (
            <span key={index} className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
              {diet}
            </span>
          ))}
        </div>

        {/* Chef's Note */}
        <div className="bg-amber-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-amber-800 italic">
            <strong>Chef's Note:</strong> {item.chefNote}
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => addToMenuPlan(item)}
          className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={16} />
          {t.menuBuilder.addToPlan}
        </button>
      </div>
    </div>
  );

  const MenuBuilderPanel = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 sticky top-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 font-elegant">
        {t.menuBuilder.title}
      </h3>
      
      {/* Guest Count */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t.menuBuilder.guests}
        </label>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setQuantity(prev => Math.max(20, prev - 1))}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity <= 20}
          >
            <Minus size={16} />
          </button>
          <span className="text-lg font-semibold text-gray-900 min-w-8 text-center">
            {quantity}
          </span>
          <button 
            onClick={() => setQuantity(prev => prev + 1)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus size={16} />
          </button>
          <UsersIcon className="text-amber-600 ml-2" size={20} />
        </div>
        <p className="text-xs text-gray-500 mt-1">Minimum 20 guests</p>
      </div>

      {/* Selected Items */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-700">
            {t.menuBuilder.totalItems} ({selectedItems.length})
          </span>
          <span className="text-lg font-bold text-amber-700">
            €{getTotalPrice()}
          </span>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {selectedItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-600">€{item.price} × {item.quantity}</p>
              </div>
              <button 
                onClick={() => removeFromMenuPlan(item.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {selectedItems.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              {t.menuBuilder.noItems}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          onClick={() => setShowMenuPlanModal(true)}
          disabled={selectedItems.length === 0}
          className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Calendar size={16} />
          {t.menuBuilder.viewPlan}
        </button>
        <button
          onClick={() => handleOrderClick(selectedItems.map((item) => item.id))}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
        >
          {t.nav.order}
        </button>
      </div>
    </div>
  );

  const MenuPlanModal = () => (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${showMenuPlanModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${showMenuPlanModal && !isModalClosing ? 'opacity-50' : 'opacity-0'}`}
        onClick={closeModal}
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className={`relative bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto transition-all duration-300 transform ${showMenuPlanModal && !isModalClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 font-elegant">
              {t.menuBuilder.menuPlan}
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-amber-700">
                {t.menuBuilder.totalPrice}: €{getTotalPrice()}
              </span>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Guest Count Display */}
          <div className="bg-amber-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-amber-800">{t.menuBuilder.guests}</p>
                <p className="text-amber-700 font-bold text-lg">{quantity} {language === 'EN' ? 'guests' : 'Gäste'}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-amber-800">{t.menuBuilder.totalPrice}</p>
                <p className="text-amber-700 font-bold text-lg">€{getTotalPrice() * quantity}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-4 mb-6">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center gap-4 flex-1">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.dietary.map((diet, index) => (
                        <span key={index} className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                          {diet}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateItemQuantity(item.id, item.quantity - 1);
                      }}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 active:scale-95"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-lg font-semibold text-gray-900 min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateItemQuantity(item.id, item.quantity + 1);
                      }}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 active:scale-95"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <span className="text-lg font-bold text-amber-700 min-w-20 text-right">
                    €{item.price * item.quantity}
                  </span>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromMenuPlan(item.id);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 active:scale-95"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">{t.menuBuilder.noItems}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAllItems();
              }}
              disabled={selectedItems.length === 0}
              className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.menuBuilder.clearAll}
            </button>
            <button
              onClick={closeModal}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 active:scale-95"
            >
              {t.menuBuilder.close}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOrderClick(selectedItems.map((item) => item.id));
              }}
              disabled={selectedItems.length === 0}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.nav.order}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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

      {/* Menu Plan Modal - Always rendered, controlled by opacity */}
      <MenuPlanModal />

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
              
<button onClick={() => {router.push('/connect')}}  className="px-4 py-2 text-sm border border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 font-medium">
                {t.nav.connect}
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
                <a href="/" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">{t.nav.home}</a>
                <a href="/about" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">{t.nav.about}</a>
                <a href="/services" className="text-gray-900 hover:text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">{t.nav.services}</a>
                <a href="/menus" className="text-amber-700 font-medium transition-all duration-300 transform hover:translate-x-2">{t.nav.menus}</a>
                <a href="/contact" className="text-gray-900 hover:text-amber-700 font-semibold transition-all duration-300 transform hover:translate-x-2">{t.nav.contact}</a>
                <button 
                  onClick={toggleLanguage}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 w-full text-left font-medium transition-all duration-300"
                >
                  {language}
                </button>
                <button className="px-4 py-2 text-sm border border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 font-medium transition-all duration-300">
                  {t.nav.connect}
                </button>
                <button className="px-6 py-2 text-sm bg-amber-700 text-white rounded-lg hover:bg-amber-800 font-medium transition-all duration-300 transform hover:scale-105" onClick={() => handleOrderClick()}>
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
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Menu Builder Panel */}
            <div className="lg:col-span-1">
              <MenuBuilderPanel />
            </div>

            {/* Menu Content */}
            <div className="lg:col-span-3">

              {/* Categories */}
              <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-elegant">
                  {t.categories.title}
                </h2>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categoryOptions.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      activeCategory === category
                        ? 'bg-amber-700 text-white shadow-lg'
                        : 'bg-stone-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700'
                    } ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 100 + 300}ms` }}
                  >
                    {t.categories[category] || category}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className={`transition-all duration-1000 mb-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" size={20} />
                  <input
                    type="text"
                    placeholder={t.menuBuilder.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 text-black"
                  />
                </div>
              </div>

              {fetchError && (
                <p className="text-center text-sm text-red-600 mb-4">{fetchError}</p>
              )}
              {isLoadingData && !products.length && (
                <p className="text-center text-sm text-gray-500 mb-4">Loading menus and products...</p>
              )}

              {/* Menu Items Grid */}
              <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-elegant italic">
                    {t.sampleDishes.title}
                  </h3>
                  <p className="text-gray-600 font-light italic">
                    {t.sampleDishes.subtitle}
                  </p>
                </div>

                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No menu items found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredItems.map((item, index) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            </div>
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
