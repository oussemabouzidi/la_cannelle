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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [menuFilter, setMenuFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<MenuItem | MenuType | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddMenuForm, setShowAddMenuForm] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<MenuType | null>(null);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'menus', 'products'
  const [expandedMenu, setExpandedMenu] = useState<number | null>(null);
  const [selectedMenuForDetail, setSelectedMenuForDetail] = useState<MenuType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { id: 'orders', name: 'Orders', icon: Package, path: '/orders' },
    { id: 'menu', name: 'Menu Management', icon: Menu, path: '/menu_management' },
    { id: 'system', name: 'System Control', icon: Clock, path: '/system_control' },
    { id: 'customers', name: 'Customers', icon: Users, path: '/customers' },
    { id: 'reports', name: 'Reports', icon: DollarSign, path: '/reports' }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const menuCategories = [
    'starters', 'mains', 'sides', 'desserts', 'drinks', 'accessories'
  ];

  // Product categories
  const productCategories = [
    'appetizer', 'salad', 'soup', 'pasta', 'seafood', 'meat',
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'spicy',
    'signature', 'seasonal', 'kid-friendly', 'chef-special'
  ];
  const tiers = ['ESSENTIAL', 'PREMIUM', 'LUXURY'];

  const [menus, setMenus] = useState<MenuType[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

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
    image: menu.image || ''
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
                {menu.isActive ? 'Active' : 'Inactive'}
              </span>
              {menu.price !== undefined && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-semibold">
                  ƒ'ª{menu.price}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {menu.startDate && <p>Starts: {new Date(menu.startDate).toLocaleDateString()}</p>}
              {menu.endDate && <p>Ends: {new Date(menu.endDate).toLocaleDateString()}</p>}
            </div>
          </div>
          <div className="p-6 bg-gray-50">
            <div className="aspect-video w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
              {menu.image ? (
                <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
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

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [menuResponse, productResponse] = await Promise.all([
          menusApi.getMenus(),
          productsApi.getProducts()
        ]);

        setMenus(menuResponse.map(normalizeMenu));
        setMenuItems(productResponse.map(normalizeProduct));
      } catch (err) {
        console.error('Failed to load menus/products', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
    image: ''
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
      const saved = await productsApi.updateProduct(updatedItem.id, updatedItem as any);
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
      }

      setEditingItem(null);
    } catch (err) {
      console.error('Failed to update product', err);
    }
  };

// CRUD Operations for Menus
  const addMenu = async () => {
    try {
      const created = await menusApi.createMenu(newMenu as any);
      const normalized = normalizeMenu(created);
      setMenus([...menus, normalized]);
      resetNewMenuForm();
      setShowAddMenuForm(false);
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

  const deleteMenu = (menuId: number) => {
    // Remove menu from all products first
    const updatedItems = menuItems.map(item => ({
      ...item,
      menus: item.menus.filter(menu => menu !== menuId)
    }));
    setMenuItems(updatedItems);
    
    // Then delete the menu
    setMenus(menus.filter(menu => menu.id !== menuId));
    if (selectedMenu?.id === menuId) {
      setSelectedMenu(null);
    }
    if (selectedMenuForDetail?.id === menuId) {
      setSelectedMenuForDetail(null);
    }
  };

  const archiveMenuItem = (id: number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: false } : item
    ));
  };

  const deleteMenuItem = (id: number) => {
    // Remove item from all menus first
    const updatedMenus = menus.map(menu => ({
      ...menu,
      products: menu.products.filter(productId => productId !== id)
    }));
    setMenus(updatedMenus);
    
    // Then delete the item
    setMenuItems(menuItems.filter(item => item.id !== id));
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
      image: ''
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
              <p className="text-gray-400 text-sm">No Image Available</p>
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
              <h2 className="text-2xl font-bold text-gray-900 font-elegant">Edit Menu Item</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dish Image</label>
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
                        <span className="sr-only">Upload image</span>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Or Enter Image URL</label>
                    <input
                      type="text"
                      value={localItem.image}
                      onChange={(e) => handleLocalSave({ ...localItem, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={localItem.name}
                      onChange={(e) => handleLocalSave({ ...localItem, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                      placeholder="Enter dish name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={localItem.category}
                      onChange={(e) => handleLocalSave({ ...localItem, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                    >
                      <option value="starter">Starter</option>
                      <option value="main">Main Course</option>
                      <option value="dessert">Dessert</option>
                      <option value="beverage">Beverage</option>
                      <option value="side">Side</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Menu Section</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={localItem.description}
                    onChange={(e) => handleLocalSave({ ...localItem, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder="Describe the dish, ingredients, and special features"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price ($)</label>
                    <input
                      type="number"
                      value={localItem.price}
                      onChange={(e) => handleLocalSave({ ...localItem, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)</label>
                    <input
                      type="number"
                      value={localItem.cost}
                      onChange={(e) => handleLocalSave({ ...localItem, cost: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (min)</label>
                    <input
                      type="number"
                      value={localItem.preparationTime}
                      onChange={(e) => handleLocalSave({ ...localItem, preparationTime: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                      placeholder="15"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Product Categories</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-3">Include in Menus</label>
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
                            {menu.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      ))}
                      {menus.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">No menus created yet</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Menu Tiers</label>
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
                    Save Changes
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
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
            <h2 className="text-2xl font-bold text-gray-900 font-elegant">Add New Menu Item</h2>
            <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dish Image</label>
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
                      <span className="sr-only">Upload image</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Or Enter Image URL</label>
                  <input
                    type="text"
                    value={localItem.image}
                    onChange={(e) => setLocalItem({ ...localItem, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={localItem.name}
                    onChange={(e) => setLocalItem({ ...localItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder="Enter dish name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={localItem.category}
                    onChange={(e) => setLocalItem({ ...localItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                  >
                    <option value="starter">Starter</option>
                    <option value="main">Main Course</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                    <option value="side">Side</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Menu Section</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={localItem.description}
                  onChange={(e) => setLocalItem({ ...localItem, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                  placeholder="Describe the dish..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price ($)</label>
                  <input
                    type="number"
                    value={localItem.price}
                    onChange={(e) => setLocalItem({ ...localItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)</label>
                  <input
                    type="number"
                    value={localItem.cost}
                    onChange={(e) => setLocalItem({ ...localItem, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (min)</label>
                  <input
                    type="number"
                    value={localItem.preparationTime}
                    onChange={(e) => setLocalItem({ ...localItem, preparationTime: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder="15"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Product Categories</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-3">Assign to Menus</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-3">Menu Tiers</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-3">Ingredients</label>
                <div className="space-y-3">
                  {localItem.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => updateLocalIngredient(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                        placeholder="e.g., Atlantic salmon, lemon, butter"
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
                  Add Ingredient
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
                  Save Changes
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
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

  useEffect(() => {
    setLocalMenuState(newMenu);
  }, [newMenu]);

  const handleSaveMenu = () => {
    setNewMenu(localMenuState);
    addMenu();
    setShowAddMenuForm(false);
    resetNewMenuForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddMenuForm(false)}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 font-elegant">Create Menu</h2>
          <button onClick={() => setShowAddMenuForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={localMenuState.name}
                onChange={(e) => setLocalMenuState({ ...localMenuState, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                placeholder="Menu name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={localMenuState.category}
                onChange={(e) => setLocalMenuState({ ...localMenuState, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                placeholder="e.g., seasonal, luxury"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <input
                type="text"
                value={localMenuState.type}
                onChange={(e) => setLocalMenuState({ ...localMenuState, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                placeholder="fixed, tasting, themed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (optional)</label>
              <input
                type="number"
                value={localMenuState.price ?? 0}
                onChange={(e) => setLocalMenuState({ ...localMenuState, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={localMenuState.description}
              onChange={(e) => setLocalMenuState({ ...localMenuState, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
              placeholder="Describe this menu"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="menu-active"
              checked={localMenuState.isActive}
              onChange={(e) => setLocalMenuState({ ...localMenuState, isActive: e.target.checked })}
              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="menu-active" className="text-sm text-gray-700">Menu is active</label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSaveMenu}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Menu
            </button>
            <button
              onClick={() => setShowAddMenuForm(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuCard = ({ menu, isSelected }: { menu: MenuType; isSelected: boolean }) => (
  <button
    onClick={() => setSelectedMenu(menu)}
    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
      isSelected ? 'border-amber-400 bg-amber-50 shadow-sm' : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-lg font-semibold text-gray-900">{menu.name}</h4>
      <span className={`px-2 py-1 text-xs rounded-full ${
        menu.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {menu.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
    <p className="text-sm text-gray-600 line-clamp-2">{menu.description}</p>
    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
      <span className="capitalize">{menu.category}</span>
      {menu.price !== undefined ? <span>${menu.price}</span> : <span>Custom</span>}
    </div>
  </button>
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
            {item.available ? 'Available' : 'Unavailable'}
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
            <p className="text-sm text-gray-600">Cost: ${item.cost}</p>
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
          <p className="text-xs text-gray-500 mb-1">Included in menus:</p>
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
                Not in any menu
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
            <span className="text-gray-600">Popularity</span>
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
            Edit
          </button>
          {item.available ? (
            <button
              onClick={() => archiveMenuItem(item.id)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-1"
              title="Archive Item"
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
            title="Delete Item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const ViewModeToggle = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-1 flex items-center">
      <button
        onClick={() => setViewMode('split')}
        className={`px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium ${
          viewMode === 'split' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <LayoutGrid size={16} />
        Split View
      </button>
      <button
        onClick={() => setViewMode('menus')}
        className={`px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium ${
          viewMode === 'menus' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <List size={16} />
        Menus Only
      </button>
      <button
        onClick={() => setViewMode('products')}
        className={`px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium ${
          viewMode === 'products' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Grid size={16} />
        Products Only
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100">
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
              <img src="/images/logo.png" alt="" className="w-50 h-auto" />
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
                <p className="font-semibold text-gray-900">Admin User</p>
                <p className="text-sm text-gray-600">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
                <Menu size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 font-elegant">Menu Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <ViewModeToggle />
              <span className="text-sm text-gray-600">
                Total Products: {menuItems.length} | Menus: {menus.length}
              </span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Header with Add Buttons */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-elegant">Menu Management</h2>
              <p className="text-gray-600">Manage menus, products, categories, and availability</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddMenuForm(true)}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
              >
                <FolderPlus size={20} />
                Add Menu
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2"
              >
                <Plus size={20} />
                Add Product
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
                  placeholder="Search products..."
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
                <option value="all">All Categories</option>
                <option value="starter">Starters</option>
                <option value="main">Main Courses</option>
                <option value="dessert">Desserts</option>
                <option value="beverage">Beverages</option>
                <option value="side">Sides</option>
              </select>

              <select
                value={menuFilter}
                onChange={(e) => setMenuFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              >
                <option value="all">All Menus</option>
                <option value="unassigned">Not in any menu</option>
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
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>

              <div className="text-sm text-gray-600 flex items-center justify-center">
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
                    <h3 className="text-xl font-bold text-gray-900 font-elegant">Menus</h3>
                    <span className="text-sm text-gray-600">{menus.length} menus</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">Click on a menu to view details</p>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-3 max-h-[calc(100vh-300px)] overflow-y-auto">
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
                        <p className="text-gray-500 text-lg">No menus created yet</p>
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
                      <span className="text-sm text-gray-600">Menu Sections:</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[calc(100vh-300px)] overflow-y-auto">
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
                          {selectedMenu ? 'Add Product to Menu' : 'Add Your First Product'}
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
