"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, Package, Calendar, DollarSign, 
  Users, TrendingUp, Clock, Plus, Edit, Archive, Trash2,
  Search, Filter, Save, XCircle, CheckCircle, AlertCircle,
  Utensils, Wine, Coffee, Dessert, Camera, FolderPlus,
  ChevronDown, Layers, Tag, Grid, Eye, List, LayoutGrid
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/hooks/useTranslation';
import AdminLanguageToggle from '../components/AdminLanguageToggle';
import { menusApi } from '@/lib/api/menus';
import { productsApi } from '@/lib/api/products';

type MenuType = {
  id: number;
  name: string;
  description: string;
  category: string;
  type: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  price?: number;
  products: number[];
  image: string;
  minPeople?: number | null;
  steps?: MenuStep[];
};

type MenuStep = {
  label: string;
  included: number;
};

type MenuItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  menuCategory: string;
  price: number;
  cost: number;
  available: boolean;
  tier: string[];
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  productCategories: string[];
  menus: number[];
  image: string;
  popularity: number;
};

type NewItemState = Omit<MenuItem, 'id' | 'popularity'> & {
  id?: number;
  popularity?: number;
};

type NewMenuState = Omit<MenuType, 'id' | 'products'> & {
  id?: number;
  products: number[];
};

export default function AdminMenuManagement() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [menuFilter, setMenuFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('available');
  const [editingItem, setEditingItem] = useState<MenuItem | MenuType | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddMenuForm, setShowAddMenuForm] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<MenuType | null>(null);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'menus', 'products'
  const [expandedMenu, setExpandedMenu] = useState<number | null>(null);
  const [selectedMenuForDetail, setSelectedMenuForDetail] = useState<MenuType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { language, toggleLanguage } = useTranslation('admin');
  const locale = language === 'DE' ? 'de-DE' : 'en-US';
  const copy = {
    EN: {
      nav: {
        dashboard: 'Dashboard',
        orders: 'Orders',
        menu: 'Menu Management',
        system: 'System Control',
        customers: 'Customers',
        reports: 'Reports',
      },
      admin: {
        user: 'Admin User',
        role: 'Administrator',
      },
      header: {
        title: 'Menu Management',
        subtitle: 'Manage menus, products, categories, and availability',
        totalProducts: 'Total Products',
        totalMenus: 'Menus',
      },
      menu: {
        starts: 'Starts',
        ends: 'Ends',
        noImage: 'No image',
        noImageAvailable: 'No Image Available',
        editItem: 'Edit Menu Item',
        addItem: 'Add New Menu Item',
        dishImage: 'Dish Image',
        menuImage: 'Menu Image',
        uploadImage: 'Upload image',
        imageUrl: 'Or Enter Image URL',
        name: 'Name',
        category: 'Category',
        menuSection: 'Menu Section',
        type: 'Type',
        description: 'Description',
        sellingPrice: 'Selling Price ($)',
        cost: 'Cost ($)',
        prepTime: 'Prep Time (min)',
        productCategories: 'Product Categories',
        includeMenus: 'Include in Menus',
        assignMenus: 'Assign to Menus',
        menuTiers: 'Menu Tiers',
        menuSteps: 'Menu steps',
        stepLabel: 'Step name',
        includedDishes: 'Included dishes',
        addStep: 'Add step',
        minPeople: 'Minimum people',
        minPeopleLabel: 'Minimum people',
        dishesAvailable: 'Dishes available',
        ingredients: 'Ingredients',
        noMenusYet: 'No menus created yet',
        createMenu: 'Create Menu',
        editMenu: 'Edit Menu',
        priceOptional: 'Price (optional)',
        menuActive: 'Menu is active',
        custom: 'Custom',
        costLabel: 'Cost',
        includedInMenus: 'Included in menus:',
        popularity: 'Popularity',
        menusTitle: 'Menus',
        menuHint: 'Click on a menu to view details',
        only: 'Only',
        menuSections: 'Menu Sections:',
        splitView: 'Split View',
        productsOnly: 'Products Only',
      },
      actions: {
        active: 'Active',
        inactive: 'Inactive',
        available: 'Available',
        unavailable: 'Unavailable',
        saveChanges: 'Save Changes',
        saveMenu: 'Save Menu',
        cancel: 'Cancel',
        addIngredient: 'Add Ingredient',
        edit: 'Edit',
        addMenu: 'Add Menu',
        addProduct: 'Add Product',
        addProductToMenu: 'Add Product to Menu',
        addFirstProduct: 'Add Your First Product',
        deleteMenuTitle: 'Delete menu',
        editMenuTitle: 'Edit menu',
        archiveItemTitle: 'Archive Item',
        deleteItemTitle: 'Delete Item',
      },
      filters: {
        allCategories: 'All Categories',
        starters: 'Starters',
        mains: 'Main Courses',
        desserts: 'Desserts',
        beverages: 'Beverages',
        sides: 'Sides',
        allMenus: 'All Menus',
        unassigned: 'Not in any menu',
        allStatus: 'All Status',
        available: 'Available',
        unavailable: 'Unavailable',
        searchProducts: 'Search products...',
      },
      categories: {
        starter: 'Starter',
        main: 'Main Course',
        dessert: 'Dessert',
        beverage: 'Beverage',
        side: 'Side',
      },
      placeholders: {
        imageUrl: 'https://example.com/image.jpg',
        dishName: 'Enter dish name',
        dishDescription: 'Describe the dish, ingredients, and special features',
        price: '0.00',
        prepTime: '15',
        ingredients: 'e.g., Atlantic salmon, lemon, butter',
        menuName: 'Menu name',
        menuCategory: 'e.g., seasonal, luxury',
        menuType: 'fixed, tasting, themed',
        menuDescription: 'Describe this menu',
        stepLabel: 'e.g., Starters',
      },
    },
    DE: {
      nav: {
        dashboard: 'Ubersicht',
        orders: 'Bestellungen',
        menu: 'Menueverwaltung',
        system: 'Systemsteuerung',
        customers: 'Kunden',
        reports: 'Berichte',
      },
      admin: {
        user: 'Admin Benutzer',
        role: 'Administrator',
      },
      header: {
        title: 'Menueverwaltung',
        subtitle: 'Menues, Produkte, Kategorien und Verfuegbarkeit verwalten',
        totalProducts: 'Produkte gesamt',
        totalMenus: 'Menues',
      },
      menu: {
        starts: 'Startet',
        ends: 'Endet',
        noImage: 'Kein Bild',
        noImageAvailable: 'Kein Bild verfuegbar',
        editItem: 'Menuepunkt bearbeiten',
        addItem: 'Neuen Menuepunkt hinzufuegen',
        dishImage: 'Gerichtebild',
        menuImage: 'Menuebild',
        uploadImage: 'Bild hochladen',
        imageUrl: 'Oder Bild-URL eingeben',
        name: 'Name',
        category: 'Kategorie',
        menuSection: 'Menueabschnitt',
        type: 'Typ',
        description: 'Beschreibung',
        sellingPrice: 'Verkaufspreis ($)',
        cost: 'Kosten ($)',
        prepTime: 'Vorbereitungszeit (Min)',
        productCategories: 'Produktkategorien',
        includeMenus: 'In Menues aufnehmen',
        assignMenus: 'Menues zuordnen',
        menuTiers: 'Menue-Stufen',
        menuSteps: 'Menue-Schritte',
        stepLabel: 'Schrittname',
        includedDishes: 'Enthaltene Gerichte',
        addStep: 'Schritt hinzufuegen',
        minPeople: 'Mindestpersonen',
        minPeopleLabel: 'Mindestpersonen',
        dishesAvailable: 'Verfuegbare Gerichte',
        ingredients: 'Zutaten',
        noMenusYet: 'Noch keine Menues erstellt',
        createMenu: 'Menue erstellen',
        editMenu: 'Menue bearbeiten',
        priceOptional: 'Preis (optional)',
        menuActive: 'Menue ist aktiv',
        custom: 'Individuell',
        costLabel: 'Kosten',
        includedInMenus: 'In Menues enthalten:',
        popularity: 'Beliebtheit',
        menusTitle: 'Menues',
        menuHint: 'Klicke auf ein Menue, um Details zu sehen',
        only: 'Nur',
        menuSections: 'Menueabschnitte:',
        splitView: 'Geteilte Ansicht',
        productsOnly: 'Nur Produkte',
      },
      actions: {
        active: 'Aktiv',
        inactive: 'Inaktiv',
        available: 'Verfuegbar',
        unavailable: 'Nicht verfuegbar',
        saveChanges: 'Aenderungen speichern',
        saveMenu: 'Menue speichern',
        cancel: 'Abbrechen',
        addIngredient: 'Zutat hinzufuegen',
        edit: 'Bearbeiten',
        addMenu: 'Menue hinzufuegen',
        addProduct: 'Produkt hinzufuegen',
        addProductToMenu: 'Produkt zum Menue hinzufuegen',
        addFirstProduct: 'Erstes Produkt hinzufuegen',
        deleteMenuTitle: 'Menue loeschen',
        editMenuTitle: 'Menue bearbeiten',
        archiveItemTitle: 'Artikel archivieren',
        deleteItemTitle: 'Artikel loeschen',
      },
      filters: {
        allCategories: 'Alle Kategorien',
        starters: 'Vorspeisen',
        mains: 'Hauptgerichte',
        desserts: 'Desserts',
        beverages: 'Getraenke',
        sides: 'Beilagen',
        allMenus: 'Alle Menues',
        unassigned: 'In keinem Menue',
        allStatus: 'Alle Status',
        available: 'Verfuegbar',
        unavailable: 'Nicht verfuegbar',
        searchProducts: 'Produkte suchen...',
      },
      categories: {
        starter: 'Vorspeise',
        main: 'Hauptgericht',
        dessert: 'Dessert',
        beverage: 'Getraenk',
        side: 'Beilage',
      },
      placeholders: {
        imageUrl: 'https://example.com/image.jpg',
        dishName: 'Gerichtname eingeben',
        dishDescription: 'Gericht, Zutaten und Besonderheiten beschreiben',
        price: '0.00',
        prepTime: '15',
        ingredients: 'z.B. Atlantischer Lachs, Zitrone, Butter',
        menuName: 'Menue-Name',
        menuCategory: 'z.B. saisonal, luxus',
        menuType: 'fest, tasting, thematisch',
        menuDescription: 'Dieses Menue beschreiben',
        stepLabel: 'z.B. Vorspeisen',
      },
    },
  } as const;
  const t = copy[language] ?? copy.EN;

  const navigation = [
    { id: 'dashboard', name: t.nav.dashboard, icon: TrendingUp, path: '/dashboard' },
    { id: 'orders', name: t.nav.orders, icon: Package, path: '/orders' },
    { id: 'menu', name: t.nav.menu, icon: Menu, path: '/menu_management' },
    { id: 'system', name: t.nav.system, icon: Clock, path: '/system_control' },
    { id: 'customers', name: t.nav.customers, icon: Users, path: '/customers' },
    // { id: 'reports', name: t.nav.reports, icon: DollarSign, path: '/reports' }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsSidebarOpen(window.innerWidth >= 1024);
  }, []);

  const menuCategories = [
    'starters', 'mains', 'sides', 'desserts', 'drinks', 'accessories'
  ];
  const menuStepCategories = [
    { value: 'starter', label: 'Starter' },
    { value: 'main', label: 'Main' },
    { value: 'side', label: 'Side' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'fingerfood', label: 'Fingerfood' },
    { value: 'canape', label: 'Canape' },
    { value: 'appetizer', label: 'Appetizer' },
    { value: 'salad', label: 'Salad' },
    { value: 'soup', label: 'Soup' },
    { value: 'pasta', label: 'Pasta' },
    { value: 'seafood', label: 'Seafood' },
    { value: 'meat', label: 'Meat' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten-Free' },
    { value: 'dairy-free', label: 'Dairy-Free' },
    { value: 'spicy', label: 'Spicy' },
    { value: 'signature', label: 'Signature' },
    { value: 'seasonal', label: 'Seasonal' },
    { value: 'kid-friendly', label: 'Kid-Friendly' },
    { value: 'chef-special', label: 'Chef-Special' },
    { value: 'tapas', label: 'Tapas' },
    { value: 'bbq', label: 'BBQ' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'brunch', label: 'Brunch' }
  ];

  const defaultMenuSteps: MenuStep[] = [
    { label: 'fingerfood', included: 0 },
    { label: 'starter', included: 0 },
    { label: 'main', included: 0 },
    { label: 'side', included: 0 },
    { label: 'dessert', included: 0 }
  ];

  const buildDefaultMenuSteps = () => defaultMenuSteps.map(step => ({ ...step }));

  // Product categories
  const productCategories = [
    'fingerfood', 'canape', 'appetizer', 'salad', 'soup', 'pasta', 'seafood', 'meat',
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'spicy', 'signature', 'seasonal',
    'kid-friendly', 'chef-special', 'tapas', 'bbq', 'breakfast', 'brunch'
  ];
  const tiers = ['ESSENTIAL', 'PREMIUM', 'LUXURY'];

  const [menus, setMenus] = useState<MenuType[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingMenu, setEditingMenu] = useState<MenuType | null>(null);

  const normalizeMenu = (menu: any): MenuType => ({
    id: menu.id,
    name: menu.name,
    description: menu.description || '',
    category: (menu.category || '').toLowerCase(),
    type: menu.type || '',
    isActive: !!menu.isActive,
    startDate: menu.startDate || undefined,
    endDate: menu.endDate || undefined,
    price: menu.price ?? undefined,
    products: menu.menuProducts
      ? menu.menuProducts.map((mp: any) => mp.productId)
      : menu.products || [],
    image: menu.image || '',
    minPeople: menu.minPeople ?? null,
    steps: Array.isArray(menu.steps)
      ? menu.steps.map((step: any) => ({
          label: typeof step?.label === 'string' ? step.label : '',
          included: Number.isFinite(step?.included) ? step.included : 0
        })).filter((step: MenuStep) => step.label)
      : []
  });

  const MenuDetailModal = ({ menu, onClose }: { menu: MenuType; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div>
            <p className="text-xs uppercase text-amber-600 font-semibold">{menu.category}</p>
            <h2 className="text-2xl font-bold text-gray-900">{menu.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-6 space-y-3">
            <p className="text-gray-700 leading-relaxed">{menu.description || 'No description provided.'}</p>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-semibold">
                {menu.type || 'Unspecified'}
              </span>
              <span className={`px-3 py-1 rounded-full font-semibold ${menu.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {menu.isActive ? t.actions.active : t.actions.inactive}
              </span>
              {menu.price !== undefined && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-semibold">
                  £{menu.price}
                </span>
              )}
            </div>
            {menu.minPeople ? (
              <div className="text-sm text-gray-600">{t.menu.minPeopleLabel}: {menu.minPeople}</div>
            ) : null}
            {menu.steps && menu.steps.length > 0 && (
              <div className="mt-2">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">{t.menu.menuSteps}</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {menu.steps.map((step, index) => (
                    <li key={`step-${index}`} className="flex items-center justify-between">
                      <span>{step.label}</span>
                      <span className="font-semibold text-gray-900">{step.included}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  {t.menu.dishesAvailable}: {menu.products?.length ?? 0}
                </p>
              </div>
            )}
            <div className="text-sm text-gray-600 space-y-1">
              {menu.startDate && <p>{t.menu.starts}: {new Date(menu.startDate).toLocaleDateString(locale)}</p>}
              {menu.endDate && <p>{t.menu.ends}: {new Date(menu.endDate).toLocaleDateString(locale)}</p>}
            </div>
          </div>
          <div className="p-6 bg-gray-50">
            <div className="aspect-video w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
              {menu.image ? (
                <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">{t.menu.noImage}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const normalizeProduct = (product: any): MenuItem => ({
    id: product.id,
    name: product.name,
    description: product.description || '',
    category: (product.category || '').toLowerCase(),
    menuCategory: product.menuCategory || '',
    price: product.price ?? 0,
    cost: product.cost ?? 0,
    available: !!product.available,
    tier: Array.isArray(product.tier) ? product.tier : product.tier ? [product.tier] : [],
    preparationTime: product.preparationTime ?? 0,
    ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
    allergens: Array.isArray(product.allergens) ? product.allergens : [],
    productCategories: Array.isArray(product.productCategories) ? product.productCategories : [],
    menus: product.menus
      ? product.menus
      : product.menuProducts
      ? product.menuProducts.map((mp: any) => mp.menuId)
      : [],
    image: product.image || '',
    popularity: product.popularity ?? 0
  });

  const showNotification = (type: 'success' | 'error', message: string, duration = 2500) => {
    setNotification({ type, message });
    if (duration > 0) {
      setTimeout(() => setNotification(null), duration);
    }
  };

  const syncSelectedMenus = (nextMenus: MenuType[]) => {
    if (selectedMenu) {
      const updatedMenu = nextMenus.find(menu => menu.id === selectedMenu.id) || null;
      setSelectedMenu(updatedMenu);
    }
    if (selectedMenuForDetail) {
      const updatedDetailMenu = nextMenus.find(menu => menu.id === selectedMenuForDetail.id) || null;
      setSelectedMenuForDetail(updatedDetailMenu);
    }
  };

  // Load data from backend
  const loadMenusAndProducts = async () => {
    try {
      setIsLoading(true);
      const [menuResponse, productResponse] = await Promise.all([
        menusApi.getMenus(),
        productsApi.getProducts()
      ]);

      const normalizedMenus = menuResponse.map(normalizeMenu);
      setMenus(normalizedMenus);
      setMenuItems(productResponse.map(normalizeProduct));
      syncSelectedMenus(normalizedMenus);
    } catch (err) {
      console.error('Failed to load menus/products', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenusAndProducts();
  }, []);

const [newItem, setNewItem] = useState<NewItemState>({
    name: '',
    description: '',
    category: 'starter',
    menuCategory: 'starters',
    price: 0,
    cost: 0,
    available: true,
    tier: [],
    preparationTime: 15,
    ingredients: [''],
    allergens: [],
    productCategories: [],
    menus: [],
    image: ''
  });

  // New menu form state
  const [newMenu, setNewMenu] = useState<NewMenuState>({
    name: '',
    description: '',
    category: 'seasonal',
    type: 'fixed',
    isActive: true,
    startDate: '',
    endDate: '',
    price: 0,
    products: [],
    image: '',
    minPeople: null,
    steps: buildDefaultMenuSteps()
  });

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesMenu = menuFilter === 'all' || 
                       (menuFilter === 'unassigned' && item.menus.length === 0) ||
                       item.menus.includes(parseInt(menuFilter));
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'available' && item.available) ||
                         (statusFilter === 'unavailable' && !item.available);

    return matchesSearch && matchesCategory && matchesMenu && matchesStatus;
  });

  // Get products for selected menu
  const getProductsForSelectedMenu = (): MenuItem[] => {
    if (!selectedMenu) return menuItems;
    return menuItems.filter(item => selectedMenu.products.includes(item.id));
  };

  // Get products in a specific menu
  const getProductsInMenu = (menuId: number): MenuItem[] => {
    const menu = menus.find(m => m.id === menuId);
    if (!menu) return [];
    return menuItems.filter(item => menu.products.includes(item.id));
  };

  // CRUD Operations for Menu Items
  const addMenuItem = async (itemData?: NewItemState | MenuItem) => {
    const base = itemData || newItem;
    try {
      const created = await productsApi.createProduct(base as any);
      const normalized = normalizeProduct(created);
      setMenuItems([...menuItems, normalized]);

      if (base.menus && (base.menus as number[]).length > 0) {
        const updatedMenus = menus.map(menu => {
          if ((base.menus as number[]).includes(menu.id)) {
            return { ...menu, products: [...menu.products, normalized.id] };
          }
          return menu;
        });
        setMenus(updatedMenus);
      }

      resetNewItemForm();
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to create product', err);
    }
  };

  const updateMenuItem = async (updatedItem: MenuItem) => {
    const oldItem = menuItems.find(item => item.id === updatedItem.id);
    if (!oldItem) return;
    try {
      const payload = { ...updatedItem, menuIds: updatedItem.menus };
      const saved = await productsApi.updateProduct(updatedItem.id, payload as any);
      const normalized = normalizeProduct(saved);

      setMenuItems(menuItems.map(item =>
        item.id === normalized.id ? normalized : item
      ));

      if (JSON.stringify(oldItem.menus) !== JSON.stringify(normalized.menus)) {
        const updatedMenus = menus.map(menu => {
          let products = [...menu.products];
          if (oldItem.menus.includes(menu.id) && !normalized.menus.includes(menu.id)) {
            products = products.filter(productId => productId !== normalized.id);
          } else if (!oldItem.menus.includes(menu.id) && normalized.menus.includes(menu.id)) {
            products.push(normalized.id);
          }
          return { ...menu, products };
        });
        setMenus(updatedMenus);
        syncSelectedMenus(updatedMenus);
      }

      setEditingItem(null);
      showNotification('success', language === 'DE' ? 'Produkt aktualisiert.' : 'Product updated.');
    } catch (err) {
      console.error('Failed to update product', err);
      const message = err instanceof Error ? err.message : 'Unable to update product.';
      showNotification('error', language === 'DE' ? 'Produkt konnte nicht aktualisiert werden.' : message);
    }
  };

// CRUD Operations for Menus
  const addMenu = async (menuData?: NewMenuState | MenuType) => {
    try {
      const payload = menuData || newMenu;
      const created = await menusApi.createMenu(payload as any);
      await loadMenusAndProducts();
      setShowAddMenuForm(false);
      if (!menuData) {
        resetNewMenuForm();
      }
    } catch (err) {
      console.error('Failed to create menu', err);
    }
  };

  const updateMenu = async (updatedMenu: MenuType) => {
    try {
      const saved = await menusApi.updateMenu(updatedMenu.id, updatedMenu as any);
      const normalized = normalizeMenu(saved);
      setMenus(menus.map(menu =>
        menu.id === normalized.id ? normalized : menu
      ));
      await loadMenusAndProducts();
    } catch (err) {
      console.error('Failed to update menu', err);
    }
  };

const toggleMenuActive = async (menuId: number) => {
    const target = menus.find(m => m.id === menuId);
    if (!target) return;
    try {
      const saved = await menusApi.updateMenu(menuId, { ...target, isActive: !target.isActive } as any);
      const normalized = normalizeMenu(saved);
      setMenus(menus.map(menu => menu.id === menuId ? normalized : menu));
    } catch (err) {
      console.error('Failed to toggle menu', err);
    }
  };

  const deleteMenu = async (menuId: number) => {
    try {
      await menusApi.deleteMenu(menuId);
      await loadMenusAndProducts();
      if (selectedMenu?.id === menuId) {
        setSelectedMenu(null);
      }
      if (selectedMenuForDetail?.id === menuId) {
        setSelectedMenuForDetail(null);
      }
    } catch (err) {
      console.error('Failed to delete menu', err);
    }
  };

  const archiveMenuItem = (id: number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: false } : item
    ));
  };

  const deleteMenuItem = async (id: number) => {
    try {
      const result = await productsApi.deleteProduct(id);
      // Remove item from all menus first
      const updatedMenus = menus.map(menu => ({
        ...menu,
        products: menu.products.filter(productId => productId !== id)
      }));
      setMenus(updatedMenus);
      syncSelectedMenus(updatedMenus);

      // Then delete the item locally
      setMenuItems(menuItems.filter(item => item.id !== id));
      if (result.archived) {
        showNotification('success', language === 'DE'
          ? 'Produkt archiviert (bereits in Bestellungen).'
          : 'Product archived (already in orders).');
      } else {
        showNotification('success', language === 'DE'
          ? 'Produkt geloescht.'
          : 'Product deleted.');
      }
    } catch (err) {
      console.error('Failed to delete product', err);
      const message = err instanceof Error ? err.message : 'Unable to delete product right now.';
      showNotification('error', language === 'DE' ? 'Produkt konnte nicht geloescht werden.' : message);
    }
  };

  const restoreMenuItem = (id: number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: true } : item
    ));
  };

  // Helper functions
  const toggleTier = (tier: string) => {
    setNewItem(prev => ({
      ...prev,
      tier: prev.tier.includes(tier) 
        ? prev.tier.filter(t => t !== tier)
        : [...prev.tier, tier]
    }));
  };

  const handleNavigation = (path: string) => {
    setActiveSection(path.replace('/', '') || 'menu');
    router.push(path);
  };

  const toggleProductCategory = (category: string) => {
    setNewItem(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  const toggleMenuAssociation = (menuId: number) => {
    setNewItem(prev => ({
      ...prev,
      menus: prev.menus.includes(menuId)
        ? prev.menus.filter(id => id !== menuId)
        : [...prev.menus, menuId]
    }));
  };

  const addIngredient = () => {
    setNewItem(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...newItem.ingredients];
    newIngredients[index] = value;
    setNewItem(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const removeIngredient = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = typeof reader.result === 'string' ? reader.result : '';
        setImagePreview(base64String);
        if (editingItem) {
          setEditingItem({ ...editingItem, image: base64String });
        } else {
          setNewItem({ ...newItem, image: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetNewItemForm = () => {
    setNewItem({
      name: '',
      description: '',
      category: 'starter',
      menuCategory: 'starters',
      price: 0,
      cost: 0,
      available: true,
      tier: [],
      preparationTime: 15,
      ingredients: [''],
      allergens: [],
      productCategories: [],
      menus: [],
      image: ''
    });
    setImagePreview('');
  };

  const resetNewMenuForm = () => {
    setNewMenu({
      name: '',
      description: '',
      category: 'seasonal',
      type: 'fixed',
      isActive: true,
      startDate: '',
      endDate: '',
      price: 0,
      products: [],
      image: '',
      minPeople: null,
      steps: buildDefaultMenuSteps()
    });
  };

  const getMenuName = (menuId: number) => {
    const menu = menus.find(m => m.id === menuId);
    return menu ? menu.name : 'Unknown Menu';
  };

  const viewMenuDetails = (menu: MenuType) => {
    setSelectedMenuForDetail(menu);
    // If in split view, also select the menu
    if (viewMode === 'split') {
      setSelectedMenu(menu);
    }
  };

  const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    const placeholder = '/images/placeholder.png';
    const safeSrc = src && src.trim() ? src : placeholder;
    const [imgSrc, setImgSrc] = useState(safeSrc);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      setImgSrc(src && src.trim() ? src : placeholder);
      setHasError(false);
    }, [src]);

    return (
      <div className={`relative ${className}`}>
        {hasError ? (
          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center">
            <div className="text-center">
              <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{t.menu.noImageAvailable}</p>
            </div>
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
          />
        )}
      </div>
    );
  };

  const EditFormModal = ({ item, onSave, onClose }: { item: MenuItem; onSave: (updatedItem: MenuItem) => void; onClose: () => void }) => {
    const [localItem, setLocalItem] = useState<MenuItem>(item);
    const [localImagePreview, setLocalImagePreview] = useState(item.image);

    const handleLocalSave = (updatedItem: MenuItem) => {
      setLocalItem(updatedItem);
    };

    const handleImageUploadLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = typeof reader.result === 'string' ? reader.result : '';
          setLocalImagePreview(base64String);
          handleLocalSave({ ...localItem, image: base64String });
        };
        reader.readAsDataURL(file);
      }
    };

    const toggleLocalProductCategory = (category: string) => {
      handleLocalSave({
        ...localItem,
        productCategories: localItem.productCategories.includes(category)
          ? localItem.productCategories.filter(c => c !== category)
          : [...localItem.productCategories, category]
      });
    };

    const toggleLocalMenuAssociation = (menuId: number) => {
      handleLocalSave({
        ...localItem,
        menus: localItem.menus.includes(menuId)
          ? localItem.menus.filter(id => id !== menuId)
          : [...localItem.menus, menuId]
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 font-elegant">{t.menu.editItem}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.dishImage}</label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="aspect-square w-full overflow-hidden rounded-lg mb-4">
                      {localImagePreview ? (
                        <img 
                          src={localImagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                          <Camera className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block">
                        <span className="sr-only">{t.menu.uploadImage}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUploadLocal}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.imageUrl}</label>
                    <input
                      type="text"
                      value={localItem.image}
                      onChange={(e) => handleLocalSave({ ...localItem, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                      placeholder={t.placeholders.imageUrl}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.name}</label>
                    <input
                      type="text"
                      value={localItem.name}
                      onChange={(e) => handleLocalSave({ ...localItem, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                      placeholder={t.placeholders.dishName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.category}</label>
                    <select
                      value={localItem.category}
                      onChange={(e) => handleLocalSave({ ...localItem, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                    >
                      <option value="starter">{t.categories.starter}</option>
                      <option value="main">{t.categories.main}</option>
                      <option value="dessert">{t.categories.dessert}</option>
                      <option value="beverage">{t.categories.beverage}</option>
                      <option value="side">{t.categories.side}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.menuSection}</label>
                    <select
                      value={localItem.menuCategory}
                      onChange={(e) => handleLocalSave({ ...localItem, menuCategory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                    >
                      {menuCategories.map(category => (
                        <option key={category} value={category} className="capitalize">
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.description}</label>
                  <textarea
                    value={localItem.description}
                    onChange={(e) => handleLocalSave({ ...localItem, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.dishDescription}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.sellingPrice}</label>
                    <input
                      type="number"
                      value={localItem.price}
                      onChange={(e) => handleLocalSave({ ...localItem, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                      placeholder={t.placeholders.price}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.cost}</label>
                    <input
                      type="number"
                      value={localItem.cost}
                      onChange={(e) => handleLocalSave({ ...localItem, cost: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                      placeholder={t.placeholders.price}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.prepTime}</label>
                    <input
                      type="number"
                      value={localItem.preparationTime}
                      onChange={(e) => handleLocalSave({ ...localItem, preparationTime: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                      placeholder={t.placeholders.prepTime}
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">{t.menu.productCategories}</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                      {productCategories.map(category => (
                        <div key={category} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`category-${category}`}
                            checked={localItem.productCategories.includes(category)}
                            onChange={() => toggleLocalProductCategory(category)}
                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                          />
                          <label 
                            htmlFor={`category-${category}`}
                            className="text-sm text-gray-700 capitalize cursor-pointer"
                          >
                            {category.replace('-', ' ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">{t.menu.includeMenus}</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                      {menus.map(menu => (
                        <div key={menu.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`menu-${menu.id}`}
                            checked={localItem.menus.includes(menu.id)}
                            onChange={() => toggleLocalMenuAssociation(menu.id)}
                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                          />
                          <label 
                            htmlFor={`menu-${menu.id}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {menu.name}
                          </label>
                          <span className={`text-xs px-2 py-1 rounded ${
                            menu.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {menu.isActive ? t.actions.active : t.actions.inactive}
                          </span>
                        </div>
                      ))}
                      {menus.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">{t.menu.noMenusYet}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">{t.menu.menuSteps}</label>
                  <div className="space-y-3 rounded-lg border border-gray-200 p-3 bg-gray-50">
                    {localItem.menus.length === 0 && (
                      <p className="text-sm text-gray-500">{t.filters.unassigned}</p>
                    )}
                    {localItem.menus.map((menuId: number) => {
                      const menu = menus.find(m => m.id === menuId);
                      if (!menu) return null;
                      const steps = Array.isArray(menu.steps) ? menu.steps : [];
                      return (
                        <div key={menuId} className="rounded-lg border border-gray-200 bg-white p-3">
                          <p className="text-sm font-semibold text-gray-900 mb-2">{menu.name}</p>
                          {steps.length > 0 ? (
                            <div className="space-y-1 text-sm text-gray-700">
                              {steps.map((step: MenuStep, index: number) => (
                                <div key={`menu-${menuId}-step-${index}`} className="flex items-center justify-between">
                                  <span>{step.label}</span>
                                  <span className="font-semibold text-gray-900">{step.included}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">{t.menu.noMenusYet}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">{t.menu.menuTiers}</label>
                  <div className="flex gap-3">
                    {tiers.map(tier => (
                      <button
                        key={tier}
                        onClick={() => handleLocalSave({
                          ...localItem,
                          tier: localItem.tier.includes(tier) 
                            ? localItem.tier.filter(t => t !== tier)
                            : [...localItem.tier, tier]
                        })}
                        className={`px-4 py-2 rounded-lg font-medium capitalize ${
                          localItem.tier.includes(tier)
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => onSave(localItem)}
                    className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {t.actions.saveChanges}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    {t.actions.cancel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  
const AddFormModal = () => {
  const [localItem, setLocalItem] = useState<NewItemState>(newItem);

  useEffect(() => {
    setLocalItem(newItem);
  }, [newItem]);

  const updateLocalIngredient = (index: number, value: string) => {
    const next = [...localItem.ingredients];
    next[index] = value;
    setLocalItem({ ...localItem, ingredients: next });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 font-elegant">{t.menu.addItem}</h2>
            <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.dishImage}</label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="aspect-square w-full overflow-hidden rounded-lg mb-4">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                        <Camera className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block">
                      <span className="sr-only">{t.menu.uploadImage}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.imageUrl}</label>
                  <input
                    type="text"
                    value={localItem.image}
                    onChange={(e) => setLocalItem({ ...localItem, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.imageUrl}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.name}</label>
                  <input
                    type="text"
                    value={localItem.name}
                    onChange={(e) => setLocalItem({ ...localItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.dishName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.category}</label>
                  <select
                    value={localItem.category}
                    onChange={(e) => setLocalItem({ ...localItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                  >
                    <option value="starter">{t.categories.starter}</option>
                    <option value="main">{t.categories.main}</option>
                    <option value="dessert">{t.categories.dessert}</option>
                    <option value="beverage">{t.categories.beverage}</option>
                    <option value="side">{t.categories.side}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.menuSection}</label>
                  <select
                    value={localItem.menuCategory}
                    onChange={(e) => setLocalItem({ ...localItem, menuCategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                  >
                    {menuCategories.map(category => (
                      <option key={category} value={category} className="capitalize">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.description}</label>
                <textarea
                  value={localItem.description}
                  onChange={(e) => setLocalItem({ ...localItem, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                  placeholder={t.placeholders.dishDescription}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.sellingPrice}</label>
                  <input
                    type="number"
                    value={localItem.price}
                    onChange={(e) => setLocalItem({ ...localItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.price}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.cost}</label>
                  <input
                    type="number"
                    value={localItem.cost}
                    onChange={(e) => setLocalItem({ ...localItem, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.price}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.prepTime}</label>
                  <input
                    type="number"
                    value={localItem.preparationTime}
                    onChange={(e) => setLocalItem({ ...localItem, preparationTime: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.prepTime}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">{t.menu.productCategories}</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                    {productCategories.map(category => (
                      <div key={category} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`new-category-${category}`}
                          checked={localItem.productCategories.includes(category)}
                          onChange={(e) => {
                            const updatedCategories = e.target.checked
                              ? [...localItem.productCategories, category]
                              : localItem.productCategories.filter(c => c !== category);
                            setLocalItem({ ...localItem, productCategories: updatedCategories });
                          }}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor={`new-category-${category}`} className="text-sm text-gray-700 capitalize cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">{t.menu.assignMenus}</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                    {menus.map(menu => (
                      <div key={menu.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`new-menu-${menu.id}`}
                          checked={localItem.menus.includes(menu.id)}
                          onChange={(e) => {
                            const updatedMenus = e.target.checked
                              ? [...localItem.menus, menu.id]
                              : localItem.menus.filter(id => id !== menu.id);
                            setLocalItem({ ...localItem, menus: updatedMenus });
                          }}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor={`new-menu-${menu.id}`} className="text-sm text-gray-700 cursor-pointer">
                          {menu.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t.menu.menuTiers}</label>
                <div className="flex gap-3">
                  {tiers.map(tier => (
                    <button
                      key={tier}
                      className={`px-4 py-2 rounded-lg font-medium capitalize ${
                        localItem.tier.includes(tier)
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() =>
                        setLocalItem(prev => ({
                          ...prev,
                          tier: prev.tier.includes(tier)
                            ? prev.tier.filter(t => t !== tier)
                            : [...prev.tier, tier]
                        }))
                      }
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t.menu.ingredients}</label>
                <div className="space-y-3">
                  {localItem.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => updateLocalIngredient(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                        placeholder={t.placeholders.ingredients}
                      />
                      {localItem.ingredients.length > 1 && (
                        <button
                          onClick={() =>
                            setLocalItem(prev => ({
                              ...prev,
                              ingredients: prev.ingredients.filter((_, i) => i !== index)
                            }))
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove ingredient"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setLocalItem(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }))}
                  className="mt-2 px-4 py-2 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Plus size={16} />
                  {t.actions.addIngredient}
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setNewItem(localItem);
                    addMenuItem(localItem);
                    setShowAddForm(false);
                    resetNewItemForm();
                  }}
                  className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {t.actions.saveChanges}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  {t.actions.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddMenuFormModal = () => {
  const [localMenuState, setLocalMenuState] = useState<NewMenuState>(newMenu);
  const [localMenuImagePreview, setLocalMenuImagePreview] = useState(localMenuState.image);

  useEffect(() => {
    setLocalMenuState(newMenu);
  }, [newMenu]);

  useEffect(() => {
    setLocalMenuImagePreview(localMenuState.image || '');
  }, [localMenuState.image]);

  const handleMenuImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = typeof reader.result === 'string' ? reader.result : '';
        setLocalMenuImagePreview(base64String);
        setLocalMenuState({ ...localMenuState, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateMenuStep = (index: number, updates: Partial<MenuStep>) => {
    const nextSteps = [...(localMenuState.steps || [])];
    nextSteps[index] = { ...nextSteps[index], ...updates };
    setLocalMenuState({ ...localMenuState, steps: nextSteps });
  };

  const addMenuStep = () => {
    setLocalMenuState({
      ...localMenuState,
      steps: [...(localMenuState.steps || []), { label: '', included: 0 }]
    });
  };

  const removeMenuStep = (index: number) => {
    const nextSteps = [...(localMenuState.steps || [])];
    nextSteps.splice(index, 1);
    setLocalMenuState({ ...localMenuState, steps: nextSteps });
  };

  const handleSaveMenu = () => {
    addMenu(localMenuState);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddMenuForm(false)}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 font-elegant">{t.menu.createMenu}</h2>
          <button onClick={() => setShowAddMenuForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.menu.menuImage}</label>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-white border border-gray-200">
                {localMenuImagePreview ? (
                  <img src={localMenuImagePreview} alt="Menu preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-10 h-10 text-gray-300" />
                  </div>
                )}
              </div>
              <label className="block mt-3">
                <span className="sr-only">{t.menu.uploadImage}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMenuImageUpload}
                  className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
              </label>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.imageUrl}</label>
                <input
                  type="text"
                  value={localMenuState.image}
                  onChange={(e) => setLocalMenuState({ ...localMenuState, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                  placeholder={t.placeholders.imageUrl}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.name}</label>
                  <input
                    type="text"
                    value={localMenuState.name}
                    onChange={(e) => setLocalMenuState({ ...localMenuState, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.menuName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.category}</label>
                  <input
                    type="text"
                    value={localMenuState.category}
                    onChange={(e) => setLocalMenuState({ ...localMenuState, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.menuCategory}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.type}</label>
                  <input
                    type="text"
                    value={localMenuState.type}
                    onChange={(e) => setLocalMenuState({ ...localMenuState, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.menuType}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.priceOptional}</label>
                  <input
                    type="number"
                    value={localMenuState.price ?? 0}
                    onChange={(e) => setLocalMenuState({ ...localMenuState, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.price}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.minPeople}</label>
                  <input
                    type="number"
                    value={localMenuState.minPeople ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setLocalMenuState({
                        ...localMenuState,
                        minPeople: value === '' ? null : parseInt(value, 10)
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.description}</label>
                <textarea
                  value={localMenuState.description}
                  onChange={(e) => setLocalMenuState({ ...localMenuState, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                  placeholder={t.placeholders.menuDescription}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.menuSteps}</label>
                <div className="space-y-3">
                  {(localMenuState.steps || []).map((step, index) => (
                    <div key={`step-${index}`} className="grid grid-cols-12 gap-3 items-center">
                      <select
                        value={step.label}
                        onChange={(e) => updateMenuStep(index, { label: e.target.value })}
                        className="col-span-7 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                      >
                        <option value="">{t.placeholders.stepLabel}</option>
                        {menuStepCategories.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={step.included}
                        onChange={(e) => updateMenuStep(index, { included: parseInt(e.target.value, 10) || 0 })}
                        className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => removeMenuStep(index)}
                        className="col-span-2 p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label={t.actions.deleteItemTitle}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMenuStep}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
                  >
                    <Plus size={16} />
                    {t.menu.addStep}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t.menu.dishesAvailable}: {localMenuState.products?.length ?? 0}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <input
                  type="checkbox"
                  id="menu-active"
                  checked={localMenuState.isActive}
                  onChange={(e) => setLocalMenuState({ ...localMenuState, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="menu-active" className="text-sm text-gray-700">{t.menu.menuActive}</label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveMenu}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {t.actions.saveMenu}
                </button>
                <button
                  onClick={() => setShowAddMenuForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  {t.actions.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditMenuFormModal = ({ menu }: { menu: MenuType }) => {
  const [localMenuState, setLocalMenuState] = useState<MenuType>(menu);
  const [localMenuImagePreview, setLocalMenuImagePreview] = useState(menu.image || '');

  useEffect(() => {
    setLocalMenuState({
      ...menu,
      steps: menu.steps && menu.steps.length > 0 ? menu.steps : buildDefaultMenuSteps()
    });
  }, [menu]);

  useEffect(() => {
    setLocalMenuImagePreview(localMenuState.image || '');
  }, [localMenuState.image]);

  const handleMenuImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = typeof reader.result === 'string' ? reader.result : '';
        setLocalMenuImagePreview(base64String);
        setLocalMenuState({ ...localMenuState, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateMenuStep = (index: number, updates: Partial<MenuStep>) => {
    const nextSteps = [...(localMenuState.steps || [])];
    nextSteps[index] = { ...nextSteps[index], ...updates };
    setLocalMenuState({ ...localMenuState, steps: nextSteps });
  };

  const addMenuStep = () => {
    setLocalMenuState({
      ...localMenuState,
      steps: [...(localMenuState.steps || []), { label: '', included: 0 }]
    });
  };

  const removeMenuStep = (index: number) => {
    const nextSteps = [...(localMenuState.steps || [])];
    nextSteps.splice(index, 1);
    setLocalMenuState({ ...localMenuState, steps: nextSteps });
  };

  const handleSaveMenu = async () => {
    await updateMenu({ ...localMenuState });
    setEditingMenu(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setEditingMenu(null)}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 font-elegant">{t.menu.editMenu}</h2>
          <button onClick={() => setEditingMenu(null)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.menu.menuImage}</label>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-white border border-gray-200">
                {localMenuImagePreview ? (
                  <img src={localMenuImagePreview} alt="Menu preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-10 h-10 text-gray-300" />
                  </div>
                )}
              </div>
              <label className="block mt-3">
                <span className="sr-only">{t.menu.uploadImage}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMenuImageUpload}
                  className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
              </label>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.imageUrl}</label>
                <input
                  type="text"
                  value={localMenuState.image}
                  onChange={(e) => setLocalMenuState({ ...localMenuState, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                  placeholder={t.placeholders.imageUrl}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.name}</label>
                  <input
                    type="text"
                    value={localMenuState.name}
                    onChange={(e) => setLocalMenuState({ ...localMenuState, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.menuName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.category}</label>
                  <input
                    type="text"
                    value={localMenuState.category}
                    onChange={(e) => setLocalMenuState({ ...localMenuState, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.menuCategory}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.type}</label>
                  <input
                    type="text"
                    value={localMenuState.type}
                    onChange={(e) => setLocalMenuState({ ...localMenuState, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.menuType}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.priceOptional}</label>
                  <input
                    type="number"
                    value={localMenuState.price ?? 0}
                    onChange={(e) => setLocalMenuState({ ...localMenuState, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder={t.placeholders.price}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.minPeople}</label>
                  <input
                    type="number"
                    value={localMenuState.minPeople ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setLocalMenuState({
                        ...localMenuState,
                        minPeople: value === '' ? null : parseInt(value, 10)
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.description}</label>
                <textarea
                  value={localMenuState.description}
                  onChange={(e) => setLocalMenuState({ ...localMenuState, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                  placeholder={t.placeholders.menuDescription}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.menu.menuSteps}</label>
                <div className="space-y-3">
                  {(localMenuState.steps || []).map((step, index) => (
                    <div key={`step-${index}`} className="grid grid-cols-12 gap-3 items-center">
                      <select
                        value={step.label}
                        onChange={(e) => updateMenuStep(index, { label: e.target.value })}
                        className="col-span-7 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                      >
                        <option value="">{t.placeholders.stepLabel}</option>
                        {menuStepCategories.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={step.included}
                        onChange={(e) => updateMenuStep(index, { included: parseInt(e.target.value, 10) || 0 })}
                        className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => removeMenuStep(index)}
                        className="col-span-2 p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label={t.actions.deleteItemTitle}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMenuStep}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
                  >
                    <Plus size={16} />
                    {t.menu.addStep}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t.menu.dishesAvailable}: {localMenuState.products?.length ?? 0}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <input
                  type="checkbox"
                  id="menu-active-edit"
                  checked={localMenuState.isActive}
                  onChange={(e) => setLocalMenuState({ ...localMenuState, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="menu-active-edit" className="text-sm text-gray-700">{t.menu.menuActive}</label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveMenu}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {t.actions.saveMenu}
                </button>
                <button
                  onClick={() => setEditingMenu(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  {t.actions.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuCard = ({ menu, isSelected }: { menu: MenuType; isSelected: boolean }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => setSelectedMenu(isSelected ? null : menu)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setSelectedMenu(isSelected ? null : menu);
      }
    }}
    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
      isSelected ? 'border-amber-400 bg-amber-50 shadow-sm' : 'border-gray-200 hover-border-amber-300 hover:bg-amber-50'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-lg font-semibold text-gray-900">{menu.name || 'Untitled menu'}</h4>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          menu.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {menu.isActive ? t.actions.active : t.actions.inactive}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteMenu(menu.id);
          }}
          className="p-2 rounded-full hover:bg-red-50 text-red-600 border border-red-200 shadow-sm"
          title={t.actions.deleteMenuTitle}
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditingMenu(menu);
          }}
          className="p-2 rounded-full hover:bg-amber-50 text-amber-700 border border-amber-200 shadow-sm"
          title={t.actions.editMenuTitle}
        >
          <Edit size={16} />
        </button>
      </div>
    </div>
    <p className="text-sm text-gray-600 line-clamp-2">{menu.description || 'No description'}</p>
    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
      <span className="capitalize">{menu.category || 'uncategorized'}</span>
      {menu.price !== undefined ? <span>${menu.price}</span> : <span>{t.menu.custom}</span>}
    </div>
  </div>
);

const ProductCard = ({ item }: { item: MenuItem }) => (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-stone-100 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      } ${!item.available ? 'opacity-60' : ''}`}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <ImageWithFallback 
          src={item.image}
          alt={item.name}
          className="w-full h-full"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium capitalize text-gray-700">
            {item.category}
          </span>
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium capitalize text-gray-700">
            {item.menuCategory}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {item.available ? t.actions.available : t.actions.unavailable}
          </span>
        </div>
      </div>

      {/* Item Details */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600 capitalize">{item.category}</span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-600">{item.preparationTime} min</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${item.price}</p>
            <p className="text-sm text-gray-600">{t.menu.costLabel}: ${item.cost}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-2 mb-4">{item.description}</p>

        {/* Product Categories */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {item.productCategories.slice(0, 3).map((category: string) => (
              <span key={category} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">
                {category.replace('-', ' ')}
              </span>
            ))}
            {item.productCategories.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                +{item.productCategories.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Menu Associations */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">{t.menu.includedInMenus}</p>
          <div className="flex flex-wrap gap-1">
            {item.menus.slice(0, 2).map((menuId: number) => {
              const menu = menus.find(m => m.id === menuId);
              return menu ? (
                <span key={menuId} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs">
                  {menu.name}
                </span>
              ) : null;
            })}
            {item.menus.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                +{item.menus.length - 2}
              </span>
            )}
            {item.menus.length === 0 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                {t.filters.unassigned}
              </span>
            )}
          </div>
        </div>

        {/* Menu Tiers */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {tiers.map(tier => (
              <span
                key={tier}
                className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                  item.tier.includes(tier)
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tier}
              </span>
            ))}
          </div>
        </div>

        {/* Popularity */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">{t.menu.popularity}</span>
            <span className="font-medium text-gray-900">{item.popularity}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${item.popularity}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => setEditingItem(item)}
            className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
          >
            <Edit size={14} />
            {t.actions.edit}
          </button>
          {item.available ? (
            <button
              onClick={() => archiveMenuItem(item.id)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-1"
              title={t.actions.archiveItemTitle}
            >
              <Archive size={14} />
            </button>
          ) : (
            <button
              onClick={() => restoreMenuItem(item.id)}
              className="px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium flex items-center gap-1"
              title="Restore Item"
            >
              <CheckCircle size={14} />
            </button>
          )}
          <button
            onClick={() => deleteMenuItem(item.id)}
            className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            title={t.actions.deleteItemTitle}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const ViewModeToggle = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-1 flex flex-wrap items-center gap-1">
      <button
        onClick={() => setViewMode('split')}
        className={`px-2 py-2 rounded-md flex items-center gap-2 text-xs sm:text-sm font-medium ${
          viewMode === 'split' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <LayoutGrid size={16} />
        {t.menu.splitView}
      </button>
      <button
        onClick={() => setViewMode('menus')}
        className={`px-2 py-2 rounded-md flex items-center gap-2 text-xs sm:text-sm font-medium ${
          viewMode === 'menus' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <List size={16} />
        {t.menu.menusTitle} {t.menu.only}
      </button>
      <button
        onClick={() => setViewMode('products')}
        className={`px-2 py-2 rounded-md flex items-center gap-2 text-xs sm:text-sm font-medium ${
          viewMode === 'products' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Grid size={16} />
        {t.menu.productsOnly}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100">
      {notification && (
        <div className="fixed top-6 right-6 z-50">
          <div className={`px-4 py-3 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {notification.message}
          </div>
        </div>
      )}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .font-elegant {
          font-family: 'Playfair Display', serif;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-lg border-r border-gray-100 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="text-2xl font-bold text-gray-900 font-elegant italic">
              <img src="/images/logo-removebg-preview.png" alt="" className="w-50 h-auto" />
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Users className="text-amber-700" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{t.admin.user}</p>
                <p className="text-sm text-gray-600">{t.admin.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
                <Menu size={20} />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-elegant">{t.header.title}</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:justify-end lg:gap-4">
              <ViewModeToggle />
              <AdminLanguageToggle language={language} onToggle={toggleLanguage} />
              <span className="text-sm text-gray-600">
                {t.header.totalProducts}: {menuItems.length} | {t.header.totalMenus}: {menus.length}
              </span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Header with Add Buttons */}
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-elegant">{t.header.title}</h2>
              <p className="text-gray-600">{t.header.subtitle}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowAddMenuForm(true)}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
              >
                <FolderPlus size={20} />
                {t.actions.addMenu}
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2"
              >
                <Plus size={20} />
                {t.actions.addProduct}
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm mb-6 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t.filters.searchProducts}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              >
                <option value="all">{t.filters.allCategories}</option>
                <option value="starter">{t.filters.starters}</option>
                <option value="main">{t.filters.mains}</option>
                <option value="dessert">{t.filters.desserts}</option>
                <option value="beverage">{t.filters.beverages}</option>
                <option value="side">{t.filters.sides}</option>
              </select>

              <select
                value={menuFilter}
                onChange={(e) => setMenuFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              >
                <option value="all">{t.filters.allMenus}</option>
                <option value="unassigned">{t.filters.unassigned}</option>
                {menus.map(menu => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              >
                <option value="all">{t.filters.allStatus}</option>
                <option value="available">{t.filters.available}</option>
                <option value="unavailable">{t.filters.unavailable}</option>
              </select>

              <div className="text-sm text-gray-600 flex items-center justify-start md:justify-center md:col-span-5 lg:col-span-1">
                {filteredItems.length} products found
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Menus Panel - Left */}
            {(viewMode === 'split' || viewMode === 'menus') && (
              <div className={`bg-white rounded-2xl shadow-sm border border-stone-100 backdrop-blur-sm ${
                viewMode === 'split' ? 'lg:w-1/3' : 'w-full'
              }`}>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 font-elegant">{t.menu.menusTitle}</h3>
                    <span className="text-sm text-gray-600">{menus.length} menus</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{t.menu.menuHint}</p>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-3 max-h-none overflow-visible lg:max-h-[calc(100vh-300px)] lg:overflow-y-auto">
                    {menus.map(menu => (
                      <MenuCard 
                        key={menu.id} 
                        menu={menu}
                        isSelected={selectedMenu?.id === menu.id}
                      />
                    ))}
                    {menus.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <Layers size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">{t.menu.noMenusYet}</p>
                        <button
                          onClick={() => setShowAddMenuForm(true)}
                          className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2 mx-auto"
                        >
                          <FolderPlus size={20} />
                          Create Your First Menu
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Products Panel - Right */}
            {(viewMode === 'split' || viewMode === 'products') && (
              <div className={`bg-white rounded-2xl shadow-sm border border-stone-100 backdrop-blur-sm ${
                viewMode === 'split' ? 'lg:w-2/3' : 'w-full'
              }`}>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 font-elegant">
                      {selectedMenu ? `${selectedMenu.name} - Products` : 'All Products'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{t.menu.menuSections}</span>
                      <div className="flex flex-wrap gap-1">
                        {menuCategories.slice(0, 3).map(category => (
                          <span key={category} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs capitalize">
                            {category}
                          </span>
                        ))}
                        {menuCategories.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                            +{menuCategories.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {selectedMenu 
                      ? `Showing ${getProductsForSelectedMenu().length} products in this menu`
                      : `Showing ${filteredItems.length} products`
                    }
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-h-none overflow-visible lg:max-h-[calc(100vh-300px)] lg:overflow-y-auto">
                    {(selectedMenu ? getProductsForSelectedMenu() : filteredItems).map((item, index) => (
                      <ProductCard key={item.id} item={item} />
                    ))}
                    
                    {(selectedMenu ? getProductsForSelectedMenu() : filteredItems).length === 0 && (
                      <div className="md:col-span-3 text-center py-12">
                        <Utensils size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">
                          {selectedMenu 
                            ? 'No products in this menu yet' 
                            : 'No products found matching your criteria'
                          }
                        </p>
                        <button
                          onClick={() => {
                            resetNewItemForm();
                            setShowAddForm(true);
                          }}
                          className="mt-4 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2 mx-auto"
                        >
                          <Plus size={20} />
                          {selectedMenu ? t.actions.addProductToMenu : t.actions.addFirstProduct}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {editingItem && (
        <EditFormModal 
          item={editingItem as MenuItem}
          onSave={updateMenuItem}
          onClose={() => setEditingItem(null)}
        />
      )}

      {showAddForm && <AddFormModal />}
      {showAddMenuForm && <AddMenuFormModal />}
      {editingMenu && <EditMenuFormModal menu={editingMenu} />}
      
      {/* Menu Detail Modal */}
      {selectedMenuForDetail && (
        <MenuDetailModal 
          menu={selectedMenuForDetail}
          onClose={() => setSelectedMenuForDetail(null)}
        />
      )}
    </div>
  );
}
