"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, Package, Calendar, DollarSign, 
  Users, TrendingUp, Clock, Plus, Edit, Archive, Trash2,
  Search, Filter, Save, XCircle, CheckCircle, AlertCircle,
  Utensils, Wine, Coffee, Dessert
} from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function AdminMenuManagement() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Get current active section from pathname (optional, for styling)
  const getActiveSection = () => {
    // This would depend on your current route structure
    // You might need to use usePathname() from 'next/navigation'
    const pathname = window.location.pathname;
    return navigation.find(item => pathname.includes(item.id))?.id || 'dashboard';
  };

  // Mock menu items data
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Truffle Mushroom Risotto',
      description: 'Arborio rice with seasonal wild mushrooms, white truffle oil, and Parmigiano-Reggiano',
      category: 'main',
      price: 24,
      cost: 8,
      available: true,
      tier: ['premium', 'luxury'],
      preparationTime: 25,
      ingredients: ['Arborio rice', 'Wild mushrooms', 'White truffle oil', 'Parmigiano-Reggiano', 'Vegetable stock'],
      allergens: ['Dairy'],
      image: '/images/risotto.jpg',
      popularity: 95
    },
    {
      id: 2,
      name: 'Herb-crusted Rack of Lamb',
      description: 'New Zealand lamb with rosemary crust, mint jus, and roasted root vegetables',
      category: 'main',
      price: 38,
      cost: 15,
      available: true,
      tier: ['luxury'],
      preparationTime: 35,
      ingredients: ['New Zealand lamb', 'Fresh rosemary', 'Mint', 'Root vegetables', 'Red wine jus'],
      allergens: [],
      image: '/images/lamb.jpg',
      popularity: 88
    },
    {
      id: 3,
      name: 'Seared Scallops',
      description: 'Day boat scallops with orange reduction, micro greens, and crispy prosciutto',
      category: 'starter',
      price: 28,
      cost: 12,
      available: true,
      tier: ['premium', 'luxury'],
      preparationTime: 20,
      ingredients: ['Fresh scallops', 'Orange', 'Micro greens', 'Prosciutto', 'Butter'],
      allergens: ['Shellfish', 'Dairy'],
      image: '/images/scallops.jpg',
      popularity: 92
    },
    {
      id: 4,
      name: 'Heirloom Tomato Burrata Salad',
      description: 'Colorful heirloom tomatoes with fresh burrata, basil oil, and balsamic reduction',
      category: 'starter',
      price: 18,
      cost: 6,
      available: true,
      tier: ['essential', 'premium', 'luxury'],
      preparationTime: 15,
      ingredients: ['Heirloom tomatoes', 'Burrata cheese', 'Fresh basil', 'Balsamic vinegar', 'Olive oil'],
      allergens: ['Dairy'],
      image: '/images/salad.jpg',
      popularity: 85
    },
    {
      id: 5,
      name: 'Chocolate Fondant',
      description: 'Warm chocolate cake with liquid center and fresh raspberry sauce',
      category: 'dessert',
      price: 16,
      cost: 4,
      available: true,
      tier: ['premium', 'luxury'],
      preparationTime: 18,
      ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Raspberries'],
      allergens: ['Dairy', 'Eggs'],
      image: '/images/fondant.jpg',
      popularity: 90
    },
    {
      id: 6,
      name: 'Classic Caesar Salad',
      description: 'Traditional Caesar salad with romaine lettuce, parmesan, and homemade croutons',
      category: 'starter',
      price: 14,
      cost: 3,
      available: false,
      tier: ['essential'],
      preparationTime: 12,
      ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing', 'Anchovies'],
      allergens: ['Dairy', 'Fish', 'Gluten'],
      image: '/images/caesar.jpg',
      popularity: 78
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories', icon: Utensils },
    { value: 'starter', label: 'Starters', icon: null },
    { value: 'main', label: 'Main Courses', icon: null },
    { value: 'dessert', label: 'Desserts', icon: Dessert },
    { value: 'beverage', label: 'Beverages', icon: Wine }
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
    price: 0,
    cost: 0,
    available: true,
    tier: [],
    preparationTime: 15,
    ingredients: [''],
    allergens: [],
    image: ''
  });

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'available' && item.available) ||
                         (statusFilter === 'unavailable' && !item.available);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // CRUD Operations
  const addMenuItem = () => {
    const item = {
      ...newItem,
      id: Math.max(...menuItems.map(i => i.id)) + 1,
      popularity: Math.floor(Math.random() * 30) + 70
    };
    setMenuItems([...menuItems, item]);
    setNewItem({
      name: '',
      description: '',
      category: 'starter',
      price: 0,
      cost: 0,
      available: true,
      tier: [],
      preparationTime: 15,
      ingredients: [''],
      allergens: [],
      image: ''
    });
    setShowAddForm(false);
  };

  const updateMenuItem = (updatedItem) => {
    setMenuItems(menuItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
  };

  const archiveMenuItem = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: false } : item
    ));
  };

  const deleteMenuItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const restoreMenuItem = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: true } : item
    ));
  };

  const toggleTier = (tier) => {
    setNewItem(prev => ({
      ...prev,
      tier: prev.tier.includes(tier) 
        ? prev.tier.filter(t => t !== tier)
        : [...prev.tier, tier]
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

  const EditFormModal = ({ item, onSave, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 font-elegant">Edit Menu Item</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => onSave({ ...item, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                placeholder="Enter dish name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={item.category}
                onChange={(e) => onSave({ ...item, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              >
                <option value="starter">Starter</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={item.description}
              onChange={(e) => onSave({ ...item, description: e.target.value })}
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
                value={item.price}
                onChange={(e) => onSave({ ...item, price: parseFloat(e.target.value) })}
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
                value={item.cost}
                onChange={(e) => onSave({ ...item, cost: parseFloat(e.target.value) })}
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
                value={item.preparationTime}
                onChange={(e) => onSave({ ...item, preparationTime: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
                placeholder="15"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Menu Tiers</label>
            <div className="flex gap-3">
              {tiers.map(tier => (
                <button
                  key={tier}
                  onClick={() => onSave({
                    ...item,
                    tier: item.tier.includes(tier) 
                      ? item.tier.filter(t => t !== tier)
                      : [...item.tier, tier]
                  })}
                  className={`px-4 py-2 rounded-lg font-medium capitalize ${
                    item.tier.includes(tier)
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
              onClick={() => onSave(item)}
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
  );

  const AddFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 font-elegant">Add New Menu Item</h2>
            <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
              placeholder="Enter image URL (e.g., /images/dish-name.jpg)"
            />
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
                    getActiveSection() === item.id
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
          </div>
        </header>

        <main className="p-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-elegant">All Menu Items</h2>
              <p className="text-gray-600">Manage your catering menu items, pricing, and availability</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Item
            </button>
          </div>

          {/* Filters and Search */}
          <div className={`bg-white rounded-2xl p-6 shadow-sm border border-stone-100 backdrop-blur-sm mb-6 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by dish name or description..."
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
                {filteredItems.length} items found
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl shadow-sm border border-stone-100 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                } ${!item.available ? 'opacity-60' : ''}`}
              >
                {/* Item Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.available ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <XCircle size={16} className="text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2">{item.description}</p>
                </div>

                {/* Item Details */}
                <div className="p-6 space-y-4">
                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">€{item.price}</p>
                      <p className="text-sm text-gray-600">Cost: €{item.cost}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{item.preparationTime} min</p>
                      <p className="text-sm text-gray-600">Prep time</p>
                    </div>
                  </div>

                  {/* Menu Tiers */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Available in:</p>
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
                  <div>
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
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl">
              <Utensils size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No menu items found matching your criteria</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Add Your First Menu Item
              </button>
            </div>
          )}
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
    </div>
  );
}