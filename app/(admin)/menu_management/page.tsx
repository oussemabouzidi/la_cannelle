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

export default function AdminMenuManagement() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [menuFilter, setMenuFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddMenuForm, setShowAddMenuForm] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'menus', 'products'
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [selectedMenuForDetail, setSelectedMenuForDetail] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Menu categories
  const menuCategories = [
    'starters', 'mains', 'sides', 'desserts', 'drinks', 'accessories'
  ];

  // Product categories
  const productCategories = [
    'appetizer', 'salad', 'soup', 'pasta', 'seafood', 'meat',
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'spicy',
    'signature', 'seasonal', 'kid-friendly', 'chef-special'
  ];

  // Mock menus data
  const [menus, setMenus] = useState([
    {
      id: 1,
      name: 'Spring Menu',
      description: 'Seasonal spring dishes with fresh ingredients',
      category: 'seasonal',
      type: 'fixed',
      isActive: true,
      startDate: '2024-03-01',
      endDate: '2024-05-31',
      products: [1, 2, 4, 7], // Product IDs
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80'
    },
    {
      id: 2,
      name: 'Premium Tasting',
      description: 'Gourmet tasting experience with wine pairing',
      category: 'luxury',
      type: 'tasting',
      isActive: true,
      price: 120,
      products: [1, 3, 5, 7, 8],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80'
    },
    {
      id: 3,
      name: 'Vegetarian Delight',
      description: 'Exclusively plant-based menu options',
      category: 'vegetarian',
      type: 'themed',
      isActive: false,
      products: [4, 6],
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80'
    }
  ]);

  // Mock menu items data with categories and menu associations
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Truffle Mushroom Risotto',
      description: 'Arborio rice with seasonal wild mushrooms, white truffle oil, and Parmigiano-Reggiano',
      category: 'main',
      menuCategory: 'mains',
      price: 24,
      cost: 8,
      available: true,
      tier: ['premium', 'luxury'],
      preparationTime: 25,
      ingredients: ['Arborio rice', 'Wild mushrooms', 'White truffle oil', 'Parmigiano-Reggiano', 'Vegetable stock'],
      allergens: ['Dairy'],
      productCategories: ['vegetarian', 'signature'],
      menus: [1, 2], // Menu IDs
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 95
    },
    {
      id: 2,
      name: 'Herb-crusted Rack of Lamb',
      description: 'New Zealand lamb with rosemary crust, mint jus, and roasted root vegetables',
      category: 'main',
      menuCategory: 'mains',
      price: 38,
      cost: 15,
      available: true,
      tier: ['luxury'],
      preparationTime: 35,
      ingredients: ['New Zealand lamb', 'Fresh rosemary', 'Mint', 'Root vegetables', 'Red wine jus'],
      allergens: [],
      productCategories: ['meat', 'chef-special'],
      menus: [1],
      image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 88
    },
    {
      id: 3,
      name: 'Seared Scallops',
      description: 'Day boat scallops with orange reduction, micro greens, and crispy prosciutto',
      category: 'starter',
      menuCategory: 'starters',
      price: 28,
      cost: 12,
      available: true,
      tier: ['premium', 'luxury'],
      preparationTime: 20,
      ingredients: ['Fresh scallops', 'Orange', 'Micro greens', 'Prosciutto', 'Butter'],
      allergens: ['Shellfish', 'Dairy'],
      productCategories: ['seafood', 'spicy'],
      menus: [2],
      image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 92
    },
    {
      id: 4,
      name: 'Heirloom Tomato Burrata Salad',
      description: 'Colorful heirloom tomatoes with fresh burrata, basil oil, and balsamic reduction',
      category: 'starter',
      menuCategory: 'starters',
      price: 18,
      cost: 6,
      available: true,
      tier: ['essential', 'premium', 'luxury'],
      preparationTime: 15,
      ingredients: ['Heirloom tomatoes', 'Burrata cheese', 'Fresh basil', 'Balsamic vinegar', 'Olive oil'],
      allergens: ['Dairy'],
      productCategories: ['vegetarian', 'salad', 'seasonal'],
      menus: [1, 3],
      image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 85
    },
    {
      id: 5,
      name: 'Chocolate Fondant',
      description: 'Warm chocolate cake with liquid center and fresh raspberry sauce',
      category: 'dessert',
      menuCategory: 'desserts',
      price: 16,
      cost: 4,
      available: true,
      tier: ['premium', 'luxury'],
      preparationTime: 18,
      ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Raspberries'],
      allergens: ['Dairy', 'Eggs'],
      productCategories: ['dessert', 'signature'],
      menus: [2],
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 90
    },
    {
      id: 6,
      name: 'Classic Caesar Salad',
      description: 'Traditional Caesar salad with romaine lettuce, parmesan, and homemade croutons',
      category: 'starter',
      menuCategory: 'starters',
      price: 14,
      cost: 3,
      available: false,
      tier: ['essential'],
      preparationTime: 12,
      ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing', 'Anchovies'],
      allergens: ['Dairy', 'Fish', 'Gluten'],
      productCategories: ['salad', 'kid-friendly'],
      menus: [3],
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 78
    },
    {
      id: 7,
      name: 'Grilled Salmon',
      description: 'Atlantic salmon with lemon butter sauce and seasonal vegetables',
      category: 'main',
      menuCategory: 'mains',
      price: 32,
      cost: 12,
      available: true,
      tier: ['premium', 'luxury'],
      preparationTime: 22,
      ingredients: ['Atlantic salmon', 'Lemon', 'Butter', 'Asparagus', 'Baby potatoes'],
      allergens: ['Fish', 'Dairy'],
      productCategories: ['seafood', 'gluten-free'],
      menus: [1, 2],
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 91
    },
    {
      id: 8,
      name: 'Tiramisu',
      description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
      category: 'dessert',
      menuCategory: 'desserts',
      price: 15,
      cost: 4,
      available: true,
      tier: ['essential', 'premium'],
      preparationTime: 30,
      ingredients: ['Mascarpone cheese', 'Ladyfingers', 'Espresso', 'Cocoa powder', 'Eggs'],
      allergens: ['Dairy', 'Eggs'],
      productCategories: ['dessert', 'italian'],
      menus: [2],
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 89
    },
    {
      id: 9,
      name: 'Sparkling Water',
      description: 'Premium Italian sparkling water',
      category: 'beverage',
      menuCategory: 'drinks',
      price: 6,
      cost: 1,
      available: true,
      tier: ['essential', 'premium', 'luxury'],
      preparationTime: 2,
      ingredients: ['Natural spring water'],
      allergens: [],
      productCategories: ['drink', 'non-alcoholic'],
      menus: [],
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 65
    },
    {
      id: 10,
      name: 'Olive Oil Bread Dip',
      description: 'Artisanal bread with herb-infused olive oil',
      category: 'side',
      menuCategory: 'sides',
      price: 8,
      cost: 2,
      available: true,
      tier: ['essential', 'premium'],
      preparationTime: 10,
      ingredients: ['Sourdough bread', 'Extra virgin olive oil', 'Herbs', 'Balsamic vinegar'],
      allergens: ['Gluten'],
      productCategories: ['appetizer', 'vegetarian'],
      menus: [],
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 75
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories', icon: Utensils },
    { value: 'starter', label: 'Starters', icon: null },
    { value: 'main', label: 'Main Courses', icon: null },
    { value: 'dessert', label: 'Desserts', icon: Dessert },
    { value: 'beverage', label: 'Beverages', icon: Wine },
    { value: 'side', label: 'Sides', icon: null }
  ];

  const tiers = ['essential', 'premium', 'luxury'];

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { id: 'orders', name: 'Orders', icon: Package, path: '/orders' },
    { id: 'menu', name: 'Menu Management', icon: Menu, path: '/menu_management' },
    { id: 'system', name: 'System Control', icon: Clock, path: '/system_control' },
    { id: 'customers', name: 'Customers', icon: Users, path: '/customers' },
    { id: 'reports', name: 'Reports', icon: DollarSign, path: '/reports' }
  ];

  const handleNavigation = (path) => {
    router.push(path);
  };

  // New item form state
  const [newItem, setNewItem] = useState({
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
  const [newMenu, setNewMenu] = useState({
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
  const getProductsForSelectedMenu = () => {
    if (!selectedMenu) return menuItems;
    return menuItems.filter(item => selectedMenu.products.includes(item.id));
  };

  // Get products in a specific menu
  const getProductsInMenu = (menuId) => {
    const menu = menus.find(m => m.id === menuId);
    if (!menu) return [];
    return menuItems.filter(item => menu.products.includes(item.id));
  };

  // CRUD Operations for Menu Items
  const addMenuItem = () => {
    const item = {
      ...newItem,
      id: Math.max(...menuItems.map(i => i.id)) + 1,
      popularity: Math.floor(Math.random() * 30) + 70
    };
    setMenuItems([...menuItems, item]);
    
    // Update menus that include this product
    if (newItem.menus.length > 0) {
      const updatedMenus = menus.map(menu => {
        if (newItem.menus.includes(menu.id)) {
          return {
            ...menu,
            products: [...menu.products, item.id]
          };
        }
        return menu;
      });
      setMenus(updatedMenus);
    }
    
    resetNewItemForm();
    setShowAddForm(false);
  };

  const updateMenuItem = (updatedItem) => {
    const oldItem = menuItems.find(item => item.id === updatedItem.id);
    
    setMenuItems(menuItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    
    // Update menu product associations if menus changed
    if (JSON.stringify(oldItem.menus) !== JSON.stringify(updatedItem.menus)) {
      const updatedMenus = menus.map(menu => {
        let products = [...menu.products];
        
        // Remove from menus that no longer include this product
        if (oldItem.menus.includes(menu.id) && !updatedItem.menus.includes(menu.id)) {
          products = products.filter(productId => productId !== updatedItem.id);
        }
        // Add to new menus
        else if (!oldItem.menus.includes(menu.id) && updatedItem.menus.includes(menu.id)) {
          products.push(updatedItem.id);
        }
        
        return { ...menu, products };
      });
      setMenus(updatedMenus);
    }
    
    setEditingItem(null);
  };

  // CRUD Operations for Menus
  const addMenu = () => {
    const menu = {
      ...newMenu,
      id: Math.max(...menus.map(m => m.id)) + 1,
      products: [] // Will be populated when products are added
    };
    setMenus([...menus, menu]);
    resetNewMenuForm();
    setShowAddMenuForm(false);
  };

  const updateMenu = (updatedMenu) => {
    setMenus(menus.map(menu => 
      menu.id === updatedMenu.id ? updatedMenu : menu
    ));
  };

  const toggleMenuActive = (menuId) => {
    setMenus(menus.map(menu => 
      menu.id === menuId ? { ...menu, isActive: !menu.isActive } : menu
    ));
  };

  const deleteMenu = (menuId) => {
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

  const archiveMenuItem = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: false } : item
    ));
  };

  const deleteMenuItem = (id) => {
    // Remove item from all menus first
    const updatedMenus = menus.map(menu => ({
      ...menu,
      products: menu.products.filter(productId => productId !== id)
    }));
    setMenus(updatedMenus);
    
    // Then delete the item
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const restoreMenuItem = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: true } : item
    ));
  };

  // Helper functions
  const toggleTier = (tier) => {
    setNewItem(prev => ({
      ...prev,
      tier: prev.tier.includes(tier) 
        ? prev.tier.filter(t => t !== tier)
        : [...prev.tier, tier]
    }));
  };

  const toggleProductCategory = (category) => {
    setNewItem(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  const toggleMenuAssociation = (menuId) => {
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

  const updateIngredient = (index, value) => {
    const newIngredients = [...newItem.ingredients];
    newIngredients[index] = value;
    setNewItem(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const removeIngredient = (index) => {
    setNewItem(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
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

  const getMenuName = (menuId) => {
    const menu = menus.find(m => m.id === menuId);
    return menu ? menu.name : 'Unknown Menu';
  };

  const viewMenuDetails = (menu) => {
    setSelectedMenuForDetail(menu);
    // If in split view, also select the menu
    if (viewMode === 'split') {
      setSelectedMenu(menu);
    }
  };

  const ImageWithFallback = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      setImgSrc(src);
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

  const EditFormModal = ({ item, onSave, onClose }) => {
    const [localItem, setLocalItem] = useState(item);
    const [localImagePreview, setLocalImagePreview] = useState(item.image);

    const handleLocalSave = (updatedItem) => {
      setLocalItem(updatedItem);
    };

    const handleImageUploadLocal = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setLocalImagePreview(base64String);
          handleLocalSave({ ...localItem, image: base64String });
        };
        reader.readAsDataURL(file);
      }
    };

    const toggleLocalProductCategory = (category) => {
      handleLocalSave({
        ...localItem,
        productCategories: localItem.productCategories.includes(category)
          ? localItem.productCategories.filter(c => c !== category)
          : [...localItem.productCategories, category]
      });
    };

    const toggleLocalMenuAssociation = (menuId) => {
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
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder="Describe the dish, ingredients, and special features"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (€)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost (€)</label>
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

  const AddFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
                      <img 
                        src={imagePreview} 
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
                    value={newItem.image}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
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
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder="Enter dish name (e.g., Grilled Salmon)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
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
                    value={newItem.menuCategory}
                    onChange={(e) => setNewItem({ ...newItem, menuCategory: e.target.value })}
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
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                  placeholder="Describe the dish, ingredients, preparation style, and special features..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (€)</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost (€)</label>
                  <input
                    type="number"
                    value={newItem.cost}
                    onChange={(e) => setNewItem({ ...newItem, cost: parseFloat(e.target.value) })}
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
                    value={newItem.preparationTime}
                    onChange={(e) => setNewItem({ ...newItem, preparationTime: parseInt(e.target.value) })}
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
                          checked={newItem.productCategories.includes(category)}
                          onChange={() => toggleProductCategory(category)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <label 
                          htmlFor={`new-category-${category}`}
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
                          id={`new-menu-${menu.id}`}
                          checked={newItem.menus.includes(menu.id)}
                          onChange={() => toggleMenuAssociation(menu.id)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <label 
                          htmlFor={`new-menu-${menu.id}`}
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
                      onClick={() => toggleTier(tier)}
                      className={`px-4 py-2 rounded-lg font-medium capitalize ${
                        newItem.tier.includes(tier)
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Ingredients</label>
                <div className="space-y-2">
                  {newItem.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                        placeholder="Enter ingredient (e.g., Fresh basil leaves)"
                      />
                      {newItem.ingredients.length > 1 && (
                        <button
                          onClick={() => removeIngredient(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XCircle size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addIngredient}
                    className="px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Ingredient
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addMenuItem}
                  className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Add Menu Item
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

  const AddMenuFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 font-elegant">Add New Menu</h2>
            <button onClick={() => setShowAddMenuForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Menu Name</label>
              <input
                type="text"
                value={newMenu.name}
                onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                placeholder="e.g., Spring Special Menu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Menu Category</label>
              <select
                value={newMenu.category}
                onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              >
                <option value="seasonal">Seasonal</option>
                <option value="luxury">Luxury</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="family">Family</option>
                <option value="business">Business</option>
                <option value="holiday">Holiday</option>
                <option value="tasting">Tasting</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newMenu.description}
              onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
              placeholder="Describe this menu, its theme, and target audience..."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Menu Type</label>
              <select
                value={newMenu.type}
                onChange={(e) => setNewMenu({ ...newMenu, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              >
                <option value="fixed">Fixed Menu</option>
                <option value="tasting">Tasting Menu</option>
                <option value="buffet">Buffet</option>
                <option value="themed">Themed Menu</option>
                <option value="custom">Custom Menu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Menu Price (€)</label>
              <input
                type="number"
                value={newMenu.price}
                onChange={(e) => setNewMenu({ ...newMenu, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                placeholder="0.00 (optional)"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setNewMenu({ ...newMenu, isActive: true })}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    newMenu.isActive
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setNewMenu({ ...newMenu, isActive: false })}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    !newMenu.isActive
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={newMenu.startDate}
                onChange={(e) => setNewMenu({ ...newMenu, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={newMenu.endDate}
                onChange={(e) => setNewMenu({ ...newMenu, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={addMenu}
              className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Create Menu
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

  const MenuDetailModal = ({ menu, onClose }) => {
    const productsInMenu = getProductsInMenu(menu.id);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 font-elegant">{menu.name}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mt-1">{menu.description}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Menu Header */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <ImageWithFallback 
                    src={menu.image}
                    alt={menu.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900 capitalize">{menu.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium text-gray-900 capitalize">{menu.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      menu.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {menu.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-bold text-gray-900">
                      {menu.price > 0 ? `€${menu.price}` : 'Variable Pricing'}
                    </p>
                  </div>
                </div>
                
                {menu.startDate && menu.endDate && (
                  <div>
                    <p className="text-sm text-gray-500">Availability</p>
                    <p className="font-medium text-gray-900">
                      {new Date(menu.startDate).toLocaleDateString()} - {new Date(menu.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Products Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Products in this Menu</h3>
              {productsInMenu.length > 0 ? (
                <div className="space-y-3">
                  {productsInMenu.map(product => (
                    <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback 
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">€{product.price}</p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-white rounded text-xs text-gray-600">
                            {product.preparationTime} min
                          </span>
                          {product.productCategories.slice(0, 2).map(cat => (
                            <span key={cat} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">
                              {cat.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingItem(product);
                          onClose();
                        }}
                        className="px-3 py-1 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No products in this menu</p>
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      onClose();
                    }}
                    className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                  >
                    Add Products
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setEditingItem(menu);
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Edit Menu
              </button>
              <button
                onClick={() => {
                  toggleMenuActive(menu.id);
                  onClose();
                }}
                className={`flex-1 px-4 py-3 rounded-lg font-medium ${
                  menu.isActive
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'border border-green-300 text-green-700 hover:bg-green-50'
                }`}
              >
                {menu.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => {
                  deleteMenu(menu.id);
                  onClose();
                }}
                className="flex-1 px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                Delete Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MenuCard = ({ menu, showActions = true, isSelected = false }) => {
    const productsInMenu = getProductsInMenu(menu.id);
    
    return (
      <div className={`bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md cursor-pointer ${
        isSelected ? 'border-amber-500 shadow-md' : 'border-gray-200'
      }`} onClick={() => viewMenuDetails(menu)}>
        <div className="flex">
          {/* Image on the left */}
          <div className="w-1/3">
            <div className="h-full">
              <ImageWithFallback 
                src={menu.image}
                alt={menu.name}
                className="w-full h-full object-cover rounded-l-xl"
              />
            </div>
          </div>
          
          {/* Content on the right */}
          <div className="w-2/3 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 truncate">{menu.name}</h3>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1">{menu.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  menu.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {menu.isActive ? 'Active' : 'Inactive'}
                </span>
                {menu.price > 0 && (
                  <span className="text-sm font-bold text-gray-900">€{menu.price}</span>
                )}
              </div>
            </div>

            {/* Quick Info Row */}
            <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded capitalize">
                  {menu.category}
                </span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded capitalize">
                  {menu.type}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Package size={12} />
                <span>{productsInMenu.length} items</span>
              </div>
            </div>

            {/* Menu Sections Preview */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(productsInMenu.map(p => p.menuCategory))).slice(0, 3).map(category => (
                  <span key={category} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs capitalize">
                    {category}
                  </span>
                ))}
                {Array.from(new Set(productsInMenu.map(p => p.menuCategory))).length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                    +{Array.from(new Set(productsInMenu.map(p => p.menuCategory))).length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Date Range if available */}
            {menu.startDate && menu.endDate && (
              <div className="text-xs text-gray-500 mb-3">
                {new Date(menu.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(menu.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  viewMenuDetails(menu);
                }}
                className="w-full px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-1"
              >
                <Eye size={12} />
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProductCard = ({ item }) => (
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
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-600">{item.preparationTime} min</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">€{item.price}</p>
            <p className="text-sm text-gray-600">Cost: €{item.cost}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-2 mb-4">{item.description}</p>

        {/* Product Categories */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {item.productCategories.slice(0, 3).map(category => (
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
            {item.menus.slice(0, 2).map(menuId => {
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
                          onClick={() => setShowAddForm(true)}
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
          item={editingItem}
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