// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, ChevronLeft, Phone, Mail, MapPin, 
  Clock, Users, Calendar, CreditCard, CheckCircle, 
  Building2, Heart, Briefcase, Star, Plus, Minus, ArrowLeft,
  Utensils, Coffee, Wine, Cookie, GlassWater, ShoppingBag,
  Info, ChevronDown, ChevronUp, Truck, Lock,
  Leaf, Fish, Beef, Egg, Milk, Wheat, DollarSign,
  Home, Check, Shield, Package, Sparkles, Award,
  AlertCircle, Truck as TruckIcon, Clock as ClockIcon,
  Calendar as CalendarIcon, MapPin as MapPinIcon,
  FileText, Shield as ShieldIcon, Globe
} from 'lucide-react';

export default function OrderPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [expandedInfo, setExpandedInfo] = useState({});
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [orderSummaryVisible, setOrderSummaryVisible] = useState(true);

  // Menu data
  const menusData = [
    {
      id: 1,
      name: 'Spring Menu',
      description: 'Seasonal spring dishes with fresh ingredients',
      category: 'seasonal',
      type: 'fixed',
      isActive: true,
      startDate: '2024-03-01',
      endDate: '2024-05-31',
      products: [1, 2, 4, 7, 11, 12, 15, 17, 19, 20],
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      price: 85
    },
    {
      id: 2,
      name: 'Premium Tasting',
      description: 'Gourmet tasting experience with wine pairing',
      category: 'luxury',
      type: 'tasting',
      isActive: true,
      price: 120,
      products: [1, 3, 5, 7, 8, 11, 13, 16, 18, 19, 21, 22],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80'
    },
    {
      id: 3,
      name: 'Vegetarian Delight',
      description: 'Exclusively plant-based menu options',
      category: 'vegetarian',
      type: 'themed',
      isActive: false,
      price: 65,
      products: [4, 6, 14, 23, 24, 25],
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80'
    }
  ];

  const menuItemsData = [
    // Starters (1-6)
    {
      id: 1,
      name: 'Truffle Mushroom Risotto',
      description: 'Arborio rice with seasonal wild mushrooms, white truffle oil, and Parmigiano-Reggiano',
      category: 'main',
      menuCategory: 'starters',
      price: 24,
      cost: 8,
      available: true,
      tier: ['premium', 'luxury'],
      preparationTime: 25,
      ingredients: ['Arborio rice', 'Wild mushrooms', 'White truffle oil', 'Parmigiano-Reggiano', 'Vegetable stock'],
      allergens: ['Dairy'],
      productCategories: ['vegetarian', 'signature'],
      menus: [1, 2],
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
    // Mains (7-12)
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
    },
    // Additional Starters (11-15)
    {
      id: 11,
      name: 'Lobster Bisque',
      description: 'Creamy lobster soup with cognac and fresh herbs',
      category: 'starter',
      menuCategory: 'starters',
      price: 22,
      cost: 9,
      available: true,
      tier: ['luxury'],
      preparationTime: 30,
      ingredients: ['Lobster', 'Cream', 'Cognac', 'Fresh herbs', 'Butter'],
      allergens: ['Shellfish', 'Dairy'],
      productCategories: ['seafood', 'soup'],
      menus: [1, 2],
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 82
    },
    {
      id: 12,
      name: 'Carpaccio di Manzo',
      description: 'Thinly sliced raw beef with arugula, parmesan, and lemon dressing',
      category: 'starter',
      menuCategory: 'starters',
      price: 20,
      cost: 7,
      available: true,
      tier: ['premium', 'luxury'],
      preparationTime: 15,
      ingredients: ['Beef tenderloin', 'Arugula', 'Parmesan', 'Lemon', 'Olive oil'],
      allergens: ['Dairy'],
      productCategories: ['meat', 'italian'],
      menus: [1],
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 87
    },
    {
      id: 13,
      name: 'Foie Gras Terrine',
      description: 'Rich duck liver terrine with fig compote and brioche toast',
      category: 'starter',
      menuCategory: 'starters',
      price: 26,
      cost: 10,
      available: true,
      tier: ['luxury'],
      preparationTime: 40,
      ingredients: ['Duck liver', 'Fig compote', 'Brioche', 'Port wine', 'Truffle'],
      allergens: ['Gluten'],
      productCategories: ['luxury', 'gourmet'],
      menus: [2],
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 79
    },
    {
      id: 14,
      name: 'Wild Mushroom Tart',
      description: 'Flaky pastry with wild mushrooms, goat cheese, and thyme',
      category: 'starter',
      menuCategory: 'starters',
      price: 16,
      cost: 5,
      available: true,
      tier: ['essential', 'premium'],
      preparationTime: 25,
      ingredients: ['Wild mushrooms', 'Goat cheese', 'Puff pastry', 'Thyme', 'Garlic'],
      allergens: ['Dairy', 'Gluten'],
      productCategories: ['vegetarian', 'pastry'],
      menus: [3],
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 84
    },
    {
      id: 15,
      name: 'Tuna Tartare',
      description: 'Fresh tuna with avocado, soy-lime dressing, and sesame seeds',
      category: 'starter',
      menuCategory: 'starters',
      price: 24,
      cost: 8,
      available: true,
      tier: ['premium', 'luxury'],
      preparationTime: 20,
      ingredients: ['Fresh tuna', 'Avocado', 'Soy sauce', 'Lime', 'Sesame seeds'],
      allergens: ['Fish', 'Soy'],
      productCategories: ['seafood', 'asian'],
      menus: [1],
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 88
    },
    // Additional Mains (16-20)
    {
      id: 16,
      name: 'Beef Wellington',
      description: 'Beef tenderloin wrapped in puff pastry with mushroom duxelles',
      category: 'main',
      menuCategory: 'mains',
      price: 42,
      cost: 16,
      available: true,
      tier: ['luxury'],
      preparationTime: 50,
      ingredients: ['Beef tenderloin', 'Puff pastry', 'Mushrooms', 'Prosciutto', 'Mustard'],
      allergens: ['Gluten'],
      productCategories: ['meat', 'british', 'signature'],
      menus: [2],
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 91
    },
    {
      id: 17,
      name: 'Duck Confit',
      description: 'Slow-cooked duck leg with cherry sauce and roasted potatoes',
      category: 'main',
      menuCategory: 'mains',
      price: 34,
      cost: 11,
      available: true,
      tier: ['premium', 'luxury'],
      preparationTime: 45,
      ingredients: ['Duck leg', 'Cherries', 'Potatoes', 'Thyme', 'Garlic'],
      allergens: [],
      productCategories: ['meat', 'french'],
      menus: [1],
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 86
    },
    {
      id: 18,
      name: 'Sea Bass en Papillote',
      description: 'Sea bass cooked in parchment with lemon, herbs, and vegetables',
      category: 'main',
      menuCategory: 'mains',
      price: 36,
      cost: 13,
      available: true,
      tier: ['luxury'],
      preparationTime: 30,
      ingredients: ['Sea bass', 'Lemon', 'Fresh herbs', 'Zucchini', 'Bell peppers'],
      allergens: ['Fish'],
      productCategories: ['seafood', 'healthy'],
      menus: [2],
      image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 89
    },
    {
      id: 19,
      name: 'Vegetable Lasagna',
      description: 'Layers of pasta with seasonal vegetables, ricotta, and tomato sauce',
      category: 'main',
      menuCategory: 'mains',
      price: 22,
      cost: 7,
      available: true,
      tier: ['essential', 'premium'],
      preparationTime: 40,
      ingredients: ['Lasagna sheets', 'Ricotta', 'Seasonal vegetables', 'Tomato sauce', 'Mozzarella'],
      allergens: ['Dairy', 'Gluten'],
      productCategories: ['vegetarian', 'italian'],
      menus: [1, 2, 3],
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 83
    },
    {
      id: 20,
      name: 'Chicken Supreme',
      description: 'Pan-seared chicken breast with morel sauce and asparagus',
      category: 'main',
      menuCategory: 'mains',
      price: 28,
      cost: 9,
      available: true,
      tier: ['premium'],
      preparationTime: 30,
      ingredients: ['Chicken breast', 'Morel mushrooms', 'Cream', 'Asparagus', 'White wine'],
      allergens: ['Dairy'],
      productCategories: ['poultry', 'french'],
      menus: [1],
      image: 'https://images.unsplash.com/photo-1604503468505-eb8c8c07bf9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 85
    },
    // Sides (21-24)
    {
      id: 21,
      name: 'Truffle Mashed Potatoes',
      description: 'Creamy mashed potatoes with black truffle and butter',
      category: 'side',
      menuCategory: 'sides',
      price: 12,
      cost: 3,
      available: true,
      tier: ['premium', 'luxury'],
      preparationTime: 25,
      ingredients: ['Potatoes', 'Black truffle', 'Butter', 'Cream', 'Garlic'],
      allergens: ['Dairy'],
      productCategories: ['side', 'luxury'],
      menus: [2],
      image: 'https://images.unsplash.com/photo-1516684669134-de6f1c5c8c40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 82
    },
    {
      id: 22,
      name: 'Grilled Vegetables',
      description: 'Seasonal vegetables grilled with herbs and olive oil',
      category: 'side',
      menuCategory: 'sides',
      price: 10,
      cost: 3,
      available: true,
      tier: ['essential', 'premium'],
      preparationTime: 20,
      ingredients: ['Seasonal vegetables', 'Olive oil', 'Herbs', 'Garlic', 'Lemon'],
      allergens: [],
      productCategories: ['vegetarian', 'healthy'],
      menus: [2],
      image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 78
    },
    {
      id: 23,
      name: 'Creamed Spinach',
      description: 'Fresh spinach cooked with cream, nutmeg, and parmesan',
      category: 'side',
      menuCategory: 'sides',
      price: 9,
      cost: 2,
      available: true,
      tier: ['essential', 'premium'],
      preparationTime: 15,
      ingredients: ['Spinach', 'Cream', 'Nutmeg', 'Parmesan', 'Garlic'],
      allergens: ['Dairy'],
      productCategories: ['vegetarian', 'side'],
      menus: [3],
      image: 'https://images.unsplash.com/photo-1576808216216-9d3e6c0b7f2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 75
    },
    {
      id: 24,
      name: 'Herb-Roasted Potatoes',
      description: 'Baby potatoes roasted with rosemary, garlic, and olive oil',
      category: 'side',
      menuCategory: 'sides',
      price: 8,
      cost: 2,
      available: true,
      tier: ['essential'],
      preparationTime: 30,
      ingredients: ['Baby potatoes', 'Rosemary', 'Garlic', 'Olive oil', 'Sea salt'],
      allergens: [],
      productCategories: ['vegetarian', 'side'],
      menus: [3],
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 80
    },
    // Desserts (25-30)
    {
      id: 25,
      name: 'Crème Brûlée',
      description: 'Vanilla custard with caramelized sugar crust',
      category: 'dessert',
      menuCategory: 'desserts',
      price: 14,
      cost: 3,
      available: true,
      tier: ['essential', 'premium'],
      preparationTime: 35,
      ingredients: ['Cream', 'Egg yolks', 'Vanilla', 'Sugar'],
      allergens: ['Dairy', 'Eggs'],
      productCategories: ['dessert', 'french'],
      menus: [3],
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 88
    },
    {
      id: 26,
      name: 'Apple Tarte Tatin',
      description: 'Upside-down caramelized apple tart with vanilla ice cream',
      category: 'dessert',
      menuCategory: 'desserts',
      price: 16,
      cost: 4,
      available: true,
      tier: ['premium'],
      preparationTime: 40,
      ingredients: ['Apples', 'Butter', 'Sugar', 'Puff pastry', 'Vanilla ice cream'],
      allergens: ['Dairy', 'Gluten'],
      productCategories: ['dessert', 'french'],
      menus: [1],
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 84
    },
    {
      id: 27,
      name: 'Panna Cotta',
      description: 'Italian cooked cream dessert with berry compote',
      category: 'dessert',
      menuCategory: 'desserts',
      price: 13,
      cost: 3,
      available: true,
      tier: ['essential', 'premium'],
      preparationTime: 25,
      ingredients: ['Cream', 'Gelatin', 'Sugar', 'Mixed berries', 'Vanilla'],
      allergens: ['Dairy'],
      productCategories: ['dessert', 'italian'],
      menus: [2],
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 86
    },
    // Drinks (28-32)
    {
      id: 28,
      name: 'House Red Wine',
      description: 'Selected house red wine by the glass',
      category: 'beverage',
      menuCategory: 'drinks',
      price: 9,
      cost: 2,
      available: true,
      tier: ['essential', 'premium', 'luxury'],
      preparationTime: 2,
      ingredients: ['Red wine'],
      allergens: [],
      productCategories: ['drink', 'alcoholic'],
      menus: [],
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 72
    },
    {
      id: 29,
      name: 'House White Wine',
      description: 'Selected house white wine by the glass',
      category: 'beverage',
      menuCategory: 'drinks',
      price: 9,
      cost: 2,
      available: true,
      tier: ['essential', 'premium', 'luxury'],
      preparationTime: 2,
      ingredients: ['White wine'],
      allergens: [],
      productCategories: ['drink', 'alcoholic'],
      menus: [],
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 70
    },
    {
      id: 30,
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice',
      category: 'beverage',
      menuCategory: 'drinks',
      price: 7,
      cost: 1,
      available: true,
      tier: ['essential', 'premium'],
      preparationTime: 5,
      ingredients: ['Fresh oranges'],
      allergens: [],
      productCategories: ['drink', 'non-alcoholic', 'juice'],
      menus: [],
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 68
    },
    {
      id: 31,
      name: 'Espresso',
      description: 'Italian espresso coffee',
      category: 'beverage',
      menuCategory: 'drinks',
      price: 4,
      cost: 0.5,
      available: true,
      tier: ['essential', 'premium', 'luxury'],
      preparationTime: 3,
      ingredients: ['Coffee beans', 'Water'],
      allergens: [],
      productCategories: ['drink', 'coffee'],
      menus: [],
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 90
    },
    {
      id: 32,
      name: 'Craft Cocktails',
      description: 'Selection of signature cocktails',
      category: 'beverage',
      menuCategory: 'drinks',
      price: 14,
      cost: 4,
      available: true,
      tier: ['luxury'],
      preparationTime: 10,
      ingredients: ['Various spirits', 'Fresh fruits', 'Herbs'],
      allergens: [],
      productCategories: ['drink', 'alcoholic', 'cocktail'],
      menus: [2],
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      popularity: 81
    }
  ];

  const [orderData, setOrderData] = useState({
    businessType: '',
    serviceType: '',
    eventDate: '',
    eventTime: '',
    guestCount: '',
    location: '',
    selectedMenu: '',
    selectedStarters: [],
    selectedMains: [],
    selectedSides: [],
    selectedDesserts: [],
    selectedDrinks: [],
    selectedAccessories: [],
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: ''
    },
    specialRequests: '',
    deliveryOption: 'standard',
    postalCode: '',
    deliveryDate: '',
    paymentMethod: '',
    cardDetails: {
      number: '',
      expiry: '',
      cvc: '',
      name: ''
    }
  });

  // Step 1: Business Type
  const Step1 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t.businessType.title}
        </h2>
        <p className="text-gray-600 text-lg">
          {t.businessType.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {['b2b', 'b2c'].map((type) => (
          <button
            key={type}
            onClick={() => updateOrderData('businessType', type)}
            className={`p-8 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
              orderData.businessType === type
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-gray-300 hover:border-amber-400 bg-white'
            }`}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {t.businessType[type].title}
            </h3>
            <p className="text-amber-600 font-semibold text-lg mb-6">
              {t.businessType[type].subtitle}
            </p>
            <ul className="space-y-3">
              {t.businessType[type].features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                  <span className="text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 2: Service Type
  const Step2 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t.serviceType.title}
        </h2>
        <p className="text-gray-600 text-lg">
          {t.serviceType.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(t.serviceType).filter(([key]) => !['title', 'subtitle'].includes(key)).map(([key, service]) => (
          <button
            key={key}
            onClick={() => updateOrderData('serviceType', key)}
            className={`p-6 rounded-xl border-2 transition-all duration-300 text-center hover:shadow-lg ${
              orderData.serviceType === key
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-gray-300 hover:border-amber-400 bg-white'
            }`}
          >
            <div className="p-4 bg-amber-100 rounded-lg mb-4 inline-flex">
              <service.icon size={32} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {service.title}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {service.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 3: Event Information
  const Step3 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t.eventInfo.title}
        </h2>
        <p className="text-gray-600 text-lg">
          {t.eventInfo.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.eventInfo.date} *
            </label>
            <input
              type="date"
              value={orderData.eventDate}
              onChange={(e) => updateOrderData('eventDate', e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 bg-white text-gray-900 placeholder:text-gray-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.eventInfo.time} *
            </label>
            <input
              type="time"
              value={orderData.eventTime}
              onChange={(e) => updateOrderData('eventTime', e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 bg-white text-gray-900 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t.eventInfo.guests} *
          </label>
          <input
            type="number"
            min="10"
            value={orderData.guestCount}
            onChange={(e) => updateOrderData('guestCount', e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 bg-white text-gray-900 placeholder:text-gray-500"
            placeholder="10"
            required
          />
          <p className="text-sm text-gray-600 mt-2">{t.eventInfo.minGuests}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t.eventInfo.location} *
          </label>
          <input
            type="text"
            value={orderData.postalCode}
            onChange={(e) => updateOrderData('postalCode', e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 bg-white text-gray-900 placeholder:text-gray-500"
            placeholder="Enter postal code"
            required
          />
        </div>
      </div>
    </div>
  );

  // Step 4: Menu Selection
  const Step4 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t.menuSelection.title}
        </h2>
        <p className="text-gray-600 text-lg">
          {t.menuSelection.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {menusData.map((menu) => (
          <button
            key={menu.id}
            onClick={() => menu.isActive && updateOrderData('selectedMenu', menu.id)}
            className={`rounded-xl border-2 overflow-hidden transition-all duration-300 text-left hover:shadow-lg ${
              orderData.selectedMenu === menu.id
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : menu.isActive 
                ? 'border-gray-300 hover:border-amber-400 bg-white'
                : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="relative h-48 bg-gray-200">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-full h-full object-cover"
              />
              {!menu.isActive && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-lg px-4 py-2 bg-red-600 rounded-lg">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{menu.name}</h3>
              <p className="text-gray-600 mb-4">{menu.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-amber-600 font-bold text-xl">
                  {menu.price ? `€${menu.price}` : 'Custom Pricing'}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  menu.category === 'seasonal' ? 'bg-green-100 text-green-800' :
                  menu.category === 'luxury' ? 'bg-purple-100 text-purple-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {menu.category}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 5-9: Product Selection by Category
  const Step5 = () => {
    const menuStepMap = {
      5: 'starters',
      6: 'mains',
      7: 'sides',
      8: 'desserts',
      9: 'drinks'
    };
    
    const currentCategory = menuStepMap[currentStep];
    
    const selectedMenu = menusData.find(m => m.id === orderData.selectedMenu);
    const products = menuItemsData
      .filter(item => item.menuCategory === currentCategory)
      .filter(item => !selectedMenu || selectedMenu.products.includes(item.id));
    
    // Calculate totals for order overview
    const calculateSubtotal = () => {
      const menuPrice = selectedMenu?.price || 0;
      const guestCount = parseInt(orderData.guestCount) || 0;
      
      const foodItems = [
        ...orderData.selectedStarters,
        ...orderData.selectedMains,
        ...orderData.selectedSides,
        ...orderData.selectedDesserts,
        ...orderData.selectedDrinks
      ];
      
      const foodSubtotal = foodItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const menuSubtotal = menuPrice * guestCount;
      
      return menuSubtotal > 0 ? menuSubtotal : foodSubtotal;
    };
    
    const calculateAccessoriesSubtotal = () => {
      const guestCount = parseInt(orderData.guestCount) || 0;
      return selectedAccessories.reduce((sum, item) => sum + (item.price * item.quantity * guestCount), 0);
    };
    
    const subtotal = calculateSubtotal();
    const accessoriesSubtotal = calculateAccessoriesSubtotal();
    const flatServiceFee = 48.90;
    const total = subtotal + accessoriesSubtotal + flatServiceFee;
    
    const selectedMenuObj = menusData.find(m => m.id === orderData.selectedMenu);
    
    return (
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Overview - Right Side */}
        <div className="lg:col-span-1 lg:order-2">
          <div className="sticky top-32 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t.productSelection.orderSummary}</h3>
              <button
                onClick={() => setOrderSummaryVisible(!orderSummaryVisible)}
                className="lg:hidden"
              >
                {orderSummaryVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            
            <div className={`${orderSummaryVisible ? 'block' : 'hidden lg:block'} space-y-6`}>
              {/* Event Info Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Event Date:</span>
                  <span className="font-semibold text-gray-900">{orderData.eventDate || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Guests:</span>
                  <span className="font-semibold text-gray-900">{orderData.guestCount || 0} guests</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="font-semibold text-gray-900">{orderData.postalCode || 'Not set'}</span>
                </div>
              </div>
              
              {/* Menu Summary */}
              {selectedMenuObj && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900">{selectedMenuObj.name}</h4>
                    <span className="text-amber-600 font-bold">€{selectedMenuObj.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{selectedMenuObj.description}</p>
                  <div className="text-sm text-gray-700">
                    {subtotal > 0 && (
                      <div className="flex justify-between">
                        <span>Menu Total:</span>
                        <span className="font-medium">€{subtotal.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Items Summary */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">Selected Items</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {[
                    { title: 'Starters', items: orderData.selectedStarters },
                    { title: 'Mains', items: orderData.selectedMains },
                    { title: 'Sides', items: orderData.selectedSides },
                    { title: 'Desserts', items: orderData.selectedDesserts },
                    { title: 'Drinks', items: orderData.selectedDrinks }
                  ].map((section, idx) => (
                    section.items.length > 0 && (
                      <div key={idx} className="mb-3">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">{section.title}</h5>
                        <div className="space-y-2 pl-3">
                          {section.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 truncate max-w-[60%]">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">x{item.quantity}</span>
                                <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              {/* Accessories Summary */}
              {selectedAccessories.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">Accessories</h4>
                  <div className="space-y-2">
                    {selectedAccessories.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">x{item.quantity}</span>
                          <span className="font-medium">€{(item.price * item.quantity * (parseInt(orderData.guestCount) || 0)).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Totals - Fixed to show all values in orange/black */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-black font-medium">Menu/Items Subtotal:</span>
                  <span className="font-bold text-orange-600">€{subtotal.toFixed(2)}</span>
                </div>
                {selectedAccessories.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-black font-medium">Accessories:</span>
                    <span className="font-bold text-orange-600">€{accessoriesSubtotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-black font-medium">Service Fee:</span>
                  <span className="font-bold text-orange-600">€{flatServiceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-300">
                  <span>Total:</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                
                {total < 388.80 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      Minimum order of €388.80 required. Add more items to continue.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Quick Navigation */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">Quick Navigation</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['starters', 'mains', 'sides', 'desserts', 'drinks', 'accessories'].map((cat, idx) => {
                    const stepIndex = stepsConfig.findIndex(s => s.key === cat) + 1;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentStep(stepIndex)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentStep === stepIndex
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Selection - Left Side */}
        <div className="lg:col-span-2 lg:order-1">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Select Your Items
            </h2>
            <p className="text-gray-600 text-lg">
              {t.productSelection.subtitle}
            </p>
          </div>

          <div className="space-y-6">
            {products.map((product) => {
              const quantityKey = `${currentCategory}_${product.id}`;
              const quantityInOrder = getProductQuantityInOrder(currentCategory, product.id);
              const currentQuantity = quantities[quantityKey] || 0;
              
              return (
                <div key={product.id} className="border border-gray-300 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                              {!product.available && (
                                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">
                                  Not Available
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-4">{product.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div className="text-2xl font-bold text-gray-900">€{product.price}</div>
                              <div className="flex flex-wrap items-center gap-2">
                                {product.allergens.map((allergen, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                    {allergen}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => updateQuantity(currentCategory, product.id, Math.max(0, currentQuantity - 1))}
                              className="px-4 py-2 hover:bg-gray-100 transition-colors text-black"
                              disabled={!product.available}
                            >
                              <Minus size={20} strokeWidth={2.5} className="text-black" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentQuantity}
                              onChange={(e) => updateQuantity(currentCategory, product.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center py-2 text-xl font-bold border-x border-gray-300 bg-white text-gray-900"
                              disabled={!product.available}
                            />
                            <button
                              onClick={() => updateQuantity(currentCategory, product.id, currentQuantity + 1)}
                              className="px-4 py-2 hover:bg-gray-100 transition-colors text-black"
                              disabled={!product.available}
                            >
                              <Plus size={20} strokeWidth={2.5} className="text-black" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => addProductToOrder(currentCategory, product)}
                            disabled={currentQuantity <= 0 || !product.available}
                            className={`px-6 py-3 rounded-lg text-base font-semibold transition-colors ${
                              currentQuantity > 0 && product.available
                                ? 'bg-gray-900 text-white hover:bg-black'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {quantityInOrder > 0 ? 'Update Order' : 'Add to Order'}
                          </button>
                        </div>
                        
                        {quantityInOrder > 0 && (
                          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                              <span className="text-amber-800 font-semibold">
                                In order: <span className="text-xl">{quantityInOrder}</span>
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateProductQuantityInOrder(currentCategory, product.id, quantityInOrder - 1)}
                                  className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-800 rounded-full hover:bg-red-200"
                                >
                                  <Minus size={16} strokeWidth={2.5} className="text-black" />
                                </button>
                                <button
                                  onClick={() => updateProductQuantityInOrder(currentCategory, product.id, quantityInOrder + 1)}
                                  className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                                >
                                  <Plus size={16} strokeWidth={2.5} className="text-black" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Step 10: Accessories
  const Step10 = () => {
    const guestCount = parseInt(orderData.guestCount) || 0;
    const flatServiceFee = 48.90;
    const accessoriesSubtotal = selectedAccessories.reduce((sum, item) => {
      return sum + (item.price * item.quantity * guestCount);
    }, 0);
    
    const selectedMenuObj = menusData.find(m => m.id === orderData.selectedMenu);
    const menuSubtotal = selectedMenuObj ? selectedMenuObj.price * guestCount : 0;
    
    const foodItems = [
      ...orderData.selectedStarters,
      ...orderData.selectedMains,
      ...orderData.selectedSides,
      ...orderData.selectedDesserts,
      ...orderData.selectedDrinks
    ];
    
    const foodSubtotal = foodItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = menuSubtotal > 0 ? menuSubtotal : foodSubtotal;
    const currentSubtotal = subtotal + accessoriesSubtotal + flatServiceFee;
    const minimumOrder = 388.80;

    return (
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Overview - Right Side */}
        <div className="lg:col-span-1 lg:order-2">
          <div className="sticky top-32 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t.productSelection.orderSummary}</h3>
            
            <div className="space-y-6">
              {/* Event Info Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Event Date:</span>
                  <span className="font-semibold text-gray-900">{orderData.eventDate || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Guests:</span>
                  <span className="font-semibold text-gray-900">{orderData.guestCount || 0} guests</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="font-semibold text-gray-900">{orderData.postalCode || 'Not set'}</span>
                </div>
              </div>
              
              {/* Items Summary */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">Selected Items</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {[
                    { title: 'Starters', items: orderData.selectedStarters },
                    { title: 'Mains', items: orderData.selectedMains },
                    { title: 'Sides', items: orderData.selectedSides },
                    { title: 'Desserts', items: orderData.selectedDesserts },
                    { title: 'Drinks', items: orderData.selectedDrinks }
                  ].map((section, idx) => (
                    section.items.length > 0 && (
                      <div key={idx} className="mb-3">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">{section.title}</h5>
                        <div className="space-y-2 pl-3">
                          {section.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 truncate max-w-[60%]">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">x{item.quantity}</span>
                                <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              {/* Accessories Summary */}
              {selectedAccessories.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">Accessories</h4>
                  <div className="space-y-2">
                    {selectedAccessories.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">x{item.quantity}</span>
                          <span className="font-medium">€{(item.price * item.quantity * guestCount).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Totals - Fixed to show all values in orange/black */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-black font-medium">Menu/Items Subtotal:</span>
                  <span className="font-bold text-orange-600">€{subtotal.toFixed(2)}</span>
                </div>
                {selectedAccessories.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-black font-medium">Accessories:</span>
                    <span className="font-bold text-orange-600">€{accessoriesSubtotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-black font-medium">Service Fee:</span>
                  <span className="font-bold text-orange-600">€{flatServiceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-300">
                  <span>Total:</span>
                  <span>€{currentSubtotal.toFixed(2)}</span>
                </div>
                
                {currentSubtotal < minimumOrder && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      Minimum order of €{minimumOrder.toFixed(2)} required. Add more items to continue.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Accessories Selection - Left Side */}
        <div className="lg:col-span-2 lg:order-1">
          <div className="space-y-8">
            {/* Updated Category Title Section - More Compact */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Optional Accessories
              </h1>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Select plates, cutlery, and other accessories for your event
              </h2>
            </div>

            <div className="space-y-6">
              {t.accessories.accessories.map((accessory) => {
                const isSelected = selectedAccessories.some(item => item.id === accessory.id);
                const selectedItem = selectedAccessories.find(item => item.id === accessory.id);
                
                return (
                  <div key={accessory.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{accessory.name}</h3>
                            {accessory.price === 0 && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg">
                                Included
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{accessory.description}</p>
                          {accessory.details && (
                            <p className="text-gray-500 text-sm">{accessory.details}</p>
                          )}
                          
                          {accessory.price > 0 ? (
                            <div className="mt-3">
                              <div className="text-lg font-bold text-gray-900">
                                €{accessory.price.toFixed(2)} {accessory.unit}
                              </div>
                              {accessory.minQuantity && (
                                <div className="text-gray-500 text-sm">(min {accessory.minQuantity})</div>
                              )}
                            </div>
                          ) : null}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {isSelected && accessory.price > 0 && (
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                              <button
                                onClick={() => updateAccessoryQuantity(accessory.id, selectedItem.quantity - 1)}
                                className="px-3 py-2 hover:bg-gray-100 text-black"
                              >
                                <Minus size={16} strokeWidth={2.5} className="text-black" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={selectedItem.quantity}
                                onChange={(e) => updateAccessoryQuantity(accessory.id, parseInt(e.target.value) || 1)}
                                className="w-12 text-center py-2 text-base font-bold border-x border-gray-300 text-gray-900"
                              />
                              <button
                                onClick={() => updateAccessoryQuantity(accessory.id, selectedItem.quantity + 1)}
                                className="px-3 py-2 hover:bg-gray-100 text-black"
                              >
                                <Plus size={16} strokeWidth={2.5} className="text-black" />
                              </button>
                            </div>
                          )}
                          
                          <button
                            onClick={() => toggleAccessory(accessory)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                              isSelected
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-gray-900 text-white hover:bg-black'
                            }`}
                          >
                            {isSelected ? 'Remove' : 'Select'}
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleInfo(accessory.id)}
                        className="mt-4 flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-medium"
                      >
                        {expandedInfo[accessory.id] ? 'Less information ▲' : 'More information ▼'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Details */}
            <div className="mt-12 bg-white border border-gray-300 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                {t.accessories.orderOverview}
              </h3>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.accessories.deliveryDate}
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={orderData.deliveryDate}
                        onChange={(e) => updateOrderData('deliveryDate', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
                      />
                      <CalendarIcon className="absolute right-3 top-3.5 text-gray-400" size={20} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.accessories.postalCode}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={orderData.postalCode}
                        onChange={(e) => updateOrderData('postalCode', e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
                        placeholder="Enter postal code"
                      />
                      <MapPinIcon className="absolute right-3 top-3.5 text-gray-400" size={20} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Number of People
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      value={orderData.guestCount}
                      onChange={(e) => updateOrderData('guestCount', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
                      placeholder="10"
                    />
                    <Users className="absolute right-3 top-3.5 text-gray-400" size={20} />
                  </div>
                </div>
              </div>
              
              <button
                onClick={nextStep}
                className="w-full mt-8 bg-gray-900 text-white py-4 px-6 rounded-lg text-base font-semibold hover:bg-black transition-colors"
              >
                {t.accessories.continueWithout}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 11: Delivery Details
  const Step11 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Delivery Details
        </h2>
        <p className="text-gray-600 text-lg">
          Finalize your order details
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={orderData.contactInfo.firstName}
              onChange={(e) => updateOrderData('contactInfo', {
                ...orderData.contactInfo,
                firstName: e.target.value
              })}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={orderData.contactInfo.lastName}
              onChange={(e) => updateOrderData('contactInfo', {
                ...orderData.contactInfo,
                lastName: e.target.value
              })}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={orderData.contactInfo.email}
              onChange={(e) => updateOrderData('contactInfo', {
                ...orderData.contactInfo,
                email: e.target.value
              })}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={orderData.contactInfo.phone}
              onChange={(e) => updateOrderData('contactInfo', {
                ...orderData.contactInfo,
                phone: e.target.value
              })}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
              placeholder="+49 123 456 789"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Company (Optional)
          </label>
          <input
            type="text"
            value={orderData.contactInfo.company}
            onChange={(e) => updateOrderData('contactInfo', {
              ...orderData.contactInfo,
              company: e.target.value
            })}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
            placeholder="Company Name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Special Requests
          </label>
          <textarea
            value={orderData.specialRequests}
            onChange={(e) => updateOrderData('specialRequests', e.target.value)}
            rows="4"
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none text-gray-900 placeholder:text-gray-500"
            placeholder="Any dietary restrictions or special requirements..."
          />
        </div>
      </div>
    </div>
  );

  // Step 12: Payment
  const Step12 = () => {
    // Calculate totals
    const guestCount = parseInt(orderData.guestCount) || 0;
    const flatServiceFee = 48.90;
    const accessoriesSubtotal = selectedAccessories.reduce((sum, item) => {
      return sum + (item.price * item.quantity * guestCount);
    }, 0);
    
    const selectedMenuObj = menusData.find(m => m.id === orderData.selectedMenu);
    const menuSubtotal = selectedMenuObj ? selectedMenuObj.price * guestCount : 0;
    
    const foodItems = [
      ...orderData.selectedStarters,
      ...orderData.selectedMains,
      ...orderData.selectedSides,
      ...orderData.selectedDesserts,
      ...orderData.selectedDrinks
    ];
    
    const foodSubtotal = foodItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = menuSubtotal > 0 ? menuSubtotal : foodSubtotal;
    const total = subtotal + accessoriesSubtotal + flatServiceFee;
    const vatRate = orderData.businessType === 'b2b' ? 0.19 : 0.07;
    const vatAmount = total * vatRate;
    const grandTotal = total + vatAmount;

    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Details
          </h2>
          <p className="text-gray-600 text-lg">
            Secure payment with SSL encryption
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1 lg:order-2">
            <div className="sticky top-32 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-6">
                {/* Event Info - Fixed text color */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900">Event Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-black">
                      <CalendarIcon size={16} className="text-gray-500" />
                      <span className="font-medium">{orderData.eventDate || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-black">
                      <ClockIcon size={16} className="text-gray-500" />
                      <span className="font-medium">{orderData.eventTime || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-black">
                      <Users size={16} className="text-gray-500" />
                      <span className="font-medium">{orderData.guestCount || 0} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-black">
                      <MapPinIcon size={16} className="text-gray-500" />
                      <span className="font-medium">{orderData.postalCode || 'Not set'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-black font-medium">{orderData.contactInfo.firstName} {orderData.contactInfo.lastName}</p>
                    <p className="text-sm text-black font-medium">{orderData.contactInfo.email}</p>
                    <p className="text-sm text-black font-medium">{orderData.contactInfo.phone}</p>
                    {orderData.contactInfo.company && (
                      <p className="text-sm text-black font-medium">{orderData.contactInfo.company}</p>
                    )}
                  </div>
                </div>
                
                {/* Price Breakdown - Fixed to show all values in orange/black */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">Price Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-black font-medium">Menu/Items Subtotal:</span>
                      <span className="font-bold text-orange-600">€{subtotal.toFixed(2)}</span>
                    </div>
                    {selectedAccessories.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-black font-medium">Accessories:</span>
                        <span className="font-bold text-orange-600">€{accessoriesSubtotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-black font-medium">Service Fee:</span>
                      <span className="font-bold text-orange-600">€{flatServiceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-black font-medium">VAT ({vatRate * 100}%):</span>
                      <span className="font-bold text-orange-600">€{vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                      <span>Total:</span>
                      <span>€{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Security Badge */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Shield size={20} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Secure Payment</p>
                      <p className="text-xs text-green-600">SSL Encrypted • GDPR Compliant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form - Left Side */}
          <div className="lg:col-span-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="space-y-6">
                {/* Payment Method Selection - Fixed text color */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { id: 'credit-card', label: 'Credit Card', icon: CreditCard },
                      { id: 'invoice', label: 'Invoice', icon: FileText },
                      { id: 'paypal', label: 'PayPal', icon: null },
                      { id: 'bank-transfer', label: 'Bank Transfer', icon: Building2 }
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => updateOrderData('paymentMethod', method.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                          orderData.paymentMethod === method.id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-300 hover:border-amber-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {method.icon && <method.icon size={24} className="text-gray-600" />}
                          <span className="font-medium text-black">{method.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Credit Card Form */}
                {orderData.paymentMethod === 'credit-card' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Card Number *
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={orderData.cardDetails.number}
                          onChange={(e) => updateOrderData('cardDetails', {
                            ...orderData.cardDetails,
                            number: e.target.value
                          })}
                          className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black placeholder:text-gray-500"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={orderData.cardDetails.expiry}
                          onChange={(e) => updateOrderData('cardDetails', {
                            ...orderData.cardDetails,
                            expiry: e.target.value
                          })}
                          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black placeholder:text-gray-500"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          CVC *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                          <input
                            type="text"
                            value={orderData.cardDetails.cvc}
                            onChange={(e) => updateOrderData('cardDetails', {
                              ...orderData.cardDetails,
                              cvc: e.target.value
                            })}
                            className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black placeholder:text-gray-500"
                            placeholder="123"
                            maxLength="3"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        value={orderData.cardDetails.name}
                        onChange={(e) => updateOrderData('cardDetails', {
                          ...orderData.cardDetails,
                          name: e.target.value
                        })}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black placeholder:text-gray-500"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the Terms & Conditions and Privacy Policy. I understand that this order is subject to our cancellation policy (48 hours notice for full refund).
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={() => {
                    // Handle payment submission
                    alert('Order placed successfully!');
                  }}
                  className="w-full mt-6 bg-amber-600 text-white py-4 px-6 rounded-lg text-base font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Lock size={20} />
                  Pay €{grandTotal.toFixed(2)} Securely
                </button>

                {/* Security Assurance */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-green-600" />
                      <span>SSL Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock size={16} className="text-blue-600" />
                      <span>Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>GDPR Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const stepsConfig = [
    { key: 'business', label: 'Business Type' },
    { key: 'service', label: 'Service Type' },
    { key: 'event', label: 'Event Info' },
    { key: 'menu', label: 'Menu Selection' },
    { key: 'items', label: 'Select Items', icon: Utensils, color: 'text-green-600' },
    { key: 'items', label: 'Select Items', icon: Coffee, color: 'text-red-600' },
    { key: 'items', label: 'Select Items', icon: Utensils, color: 'text-amber-600' },
    { key: 'items', label: 'Select Items', icon: Cookie, color: 'text-pink-600' },
    { key: 'items', label: 'Select Items', icon: Wine, color: 'text-blue-600' },
    { key: 'accessories', label: 'Accessories', icon: ShoppingBag, color: 'text-purple-600' },
    { key: 'details', label: 'Delivery Details' },
    { key: 'payment', label: 'Payment' }
  ];

  const content = {
    EN: {
      nav: {
        about: 'About',
        services: 'Services',
        menus: 'Menus',
        contact: 'Contact',
        connect: 'Connect',
        order: 'Order Now'
      },
      steps: stepsConfig.reduce((acc, step) => {
        acc[step.key] = step.label;
        return acc;
      }, {}),
      businessType: {
        title: 'Select Business Type',
        subtitle: 'Choose your customer type for accurate pricing',
        b2b: {
          title: 'B2B Business',
          subtitle: '19% VAT',
          features: ['Invoice billing', 'Corporate pricing', 'Volume discounts']
        },
        b2c: {
          title: 'B2C Private',
          subtitle: '7% VAT included',
          features: ['Direct payment', 'Private events', 'Personal service']
        }
      },
      serviceType: {
        title: 'Select Service Type',
        subtitle: 'Choose the type of catering service you need',
        office: {
          title: 'Office Catering',
          icon: Building2,
          description: 'Daily meals for your team'
        },
        event: {
          title: 'Event Catering',
          icon: Users,
          description: 'Special events and celebrations'
        },
        wedding: {
          title: 'Wedding Catering',
          icon: Heart,
          description: 'Your perfect wedding day'
        },
        corporate: {
          title: 'Corporate Events',
          icon: Briefcase,
          description: 'Business meetings and conferences'
        }
      },
      eventInfo: {
        title: 'Event Information',
        subtitle: 'Tell us about your event',
        date: 'Delivery Date',
        time: 'Event Time',
        guests: 'Number of People',
        location: 'Postal Code',
        minGuests: 'Minimum 10 guests required'
      },
      menuSelection: {
        title: 'Menu Selection',
        subtitle: 'Choose your preferred menu'
      },
      productSelection: {
        title: 'Menu Items',
        subtitle: 'Add items from each category',
        categories: {
          starters: { name: 'Starters', icon: Utensils, color: 'text-green-600' },
          mains: { name: 'Main Courses', icon: Coffee, color: 'text-red-600' },
          sides: { name: 'Side Dishes', icon: Utensils, color: 'text-amber-600' },
          desserts: { name: 'Desserts', icon: Cookie, color: 'text-pink-600' },
          drinks: { name: 'Drinks', icon: Wine, color: 'text-blue-600' },
          accessories: { name: 'Accessories', icon: ShoppingBag, color: 'text-purple-600' }
        },
        quantity: 'Quantity',
        addToOrder: 'Add',
        remove: 'Remove',
        inOrder: 'In Order',
        totalItems: 'Total Items',
        orderSummary: 'Order Summary'
      },
      accessories: {
        title: 'Optional: Choose Accessories',
        subtitle: 'Plates & Cutlery',
        moreInfo: 'More information',
        orderOverview: 'Order Overview',
        deliveryDate: 'Delivery Date',
        postalCode: 'Postal Code',
        flatFee: 'Flat Service Fee',
        subtotal: 'Subtotal',
        totalDue: 'Total Due',
        minimumOrder: 'Minimum order of €388.80 required',
        continueWithout: 'To Delivery Details without selection',
        accessories: [
          {
            id: 1,
            name: 'Standard Cutlery',
            description: 'Set of knife, fork and/or spoon - based on order.',
            details: 'Rental, incl. cleaning.',
            price: 0,
            type: 'rental',
            unit: 'per portion',
            minQuantity: 1
          },
          {
            id: 2,
            name: 'Dessert Cutlery',
            description: 'Set of dessert fork and/or spoon - based on order.',
            details: 'Rental, incl. cleaning.',
            price: 0,
            type: 'rental',
            unit: 'per portion',
            minQuantity: 1
          },
          {
            id: 3,
            name: 'Dessert Plate',
            description: 'Premium porcelain dessert plates',
            details: 'Elegant design, dishwasher safe',
            price: 2.30,
            type: 'purchase',
            unit: 'per portion',
            minQuantity: 10
          }
        ]
      },
      buttons: {
        next: 'Continue',
        back: 'Back',
        confirm: 'Confirm Order',
        backToHome: 'Back to Home'
      }
    },
    DE: {
      nav: {
        about: 'Über uns',
        services: 'Dienstleistungen',
        menus: 'Menüs',
        contact: 'Kontakt',
        connect: 'Verbinden',
        order: 'Jetzt bestellen'
      },
      steps: stepsConfig.reduce((acc, step) => {
        acc[step.key] = step.label;
        return acc;
      }, {}),
      businessType: {
        title: 'Unternehmensart auswählen',
        subtitle: 'Wählen Sie Ihren Kundentyp für genaue Preise',
        b2b: {
          title: 'B2B Unternehmen',
          subtitle: '19% MwSt',
          features: ['Rechnungsstellung', 'Firmenpreise', 'Mengenrabatte']
        },
        b2c: {
          title: 'B2C Privat',
          subtitle: '7% MwSt inklusive',
          features: ['Direktzahlung', 'Private Veranstaltungen', 'Persönlicher Service']
        }
      },
      serviceType: {
        title: 'Service Typ auswählen',
        subtitle: 'Wählen Sie die Art des Catering-Services',
        office: {
          title: 'Büro-Catering',
          icon: Building2,
          description: 'Tägliche Mahlzeiten für Ihr Team'
        },
        event: {
          title: 'Event-Catering',
          icon: Users,
          description: 'Besondere Veranstaltungen und Feiern'
        },
        wedding: {
          title: 'Hochzeits-Catering',
          icon: Heart,
          description: 'Ihr perfekter Hochzeitstag'
        },
        corporate: {
          title: 'Firmenveranstaltungen',
          icon: Briefcase,
          description: 'Geschäftstreffen und Konferenzen'
        }
      },
      eventInfo: {
        title: 'Veranstaltungsinformation',
        subtitle: 'Erzählen Sie uns von Ihrer Veranstaltung',
        date: 'Lieferdatum',
        time: 'Uhrzeit',
        guests: 'Anzahl der Personen',
        location: 'Postleitzahl',
        minGuests: 'Mindestens 10 Personen erforderlich'
      },
      menuSelection: {
        title: 'Menü-Auswahl',
        subtitle: 'Wählen Sie Ihr bevorzugtes Menü'
      },
      productSelection: {
        title: 'Menüpunkte',
        subtitle: 'Fügen Sie Artikel aus jeder Kategorie hinzu',
        categories: {
          starters: { name: 'Vorspeisen', icon: Utensils, color: 'text-green-600' },
          mains: { name: 'Hauptgerichte', icon: Coffee, color: 'text-red-600' },
          sides: { name: 'Beilagen', icon: Utensils, color: 'text-amber-600' },
          desserts: { name: 'Desserts', icon: Cookie, color: 'text-pink-600' },
          drinks: { name: 'Getränke', icon: Wine, color: 'text-blue-600' },
          accessories: { name: 'Zubehör', icon: ShoppingBag, color: 'text-purple-600' }
        },
        quantity: 'Menge',
        addToOrder: 'Hinzufügen',
        remove: 'Entfernen',
        inOrder: 'In Bestellung',
        totalItems: 'Gesamtartikel',
        orderSummary: 'Bestellübersicht'
      },
      accessories: {
        title: 'Optional: Zubehör wählen',
        subtitle: 'Teller & Besteck',
        moreInfo: 'Mehr Informationen',
        orderOverview: 'Bestellübersicht',
        deliveryDate: 'Lieferdatum',
        postalCode: 'Postleitzahl',
        flatFee: 'Pauschale Servicegebühr',
        subtotal: 'Zwischensumme',
        totalDue: 'Gesamtbetrag',
        minimumOrder: 'Mindestbestellung von €388,80 erforderlich',
        continueWithout: 'Zu Lieferdetails ohne Auswahl',
        accessories: [
          {
            id: 1,
            name: 'Standard Besteck',
            description: 'Set aus Messer, Gabel und/oder Löffel - basierend auf Bestellung.',
            details: 'Miete, inkl. Reinigung.',
            price: 0,
            type: 'rental',
            unit: 'pro Portion',
            minQuantity: 1
          },
          {
            id: 2,
            name: 'Dessertbesteck',
            description: 'Set aus Dessertgabel und/oder -löffel - basierend auf Bestellung.',
            details: 'Miete, inkl. Reinigung.',
            price: 0,
            type: 'rental',
            unit: 'pro Portion',
            minQuantity: 1
          },
          {
            id: 3,
            name: 'Dessertteller',
            description: 'Premium Porzellan Dessertteller',
            details: 'Elegantes Design, spülmaschinenfest',
            price: 2.30,
            type: 'purchase',
            unit: 'pro Portion',
            minQuantity: 10
          }
        ]
      },
      buttons: {
        next: 'Weiter',
        back: 'Zurück',
        confirm: 'Bestellung Bestätigen',
        backToHome: 'Zurück zur Startseite'
      }
    }
  };

  const t = content[language];

  // Helper functions
  const updateOrderData = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep === stepsConfig.length) {
      // Handle final submission
      handleSubmitOrder();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, stepsConfig.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const updateQuantity = (category, productId, quantity) => {
    setQuantities(prev => ({
      ...prev,
      [`${category}_${productId}`]: Math.max(0, quantity)
    }));
  };

  const addProductToOrder = (category, product) => {
    const quantityKey = `${category}_${product.id}`;
    const quantity = quantities[quantityKey] || 1;
    
    if (quantity <= 0) return;

    const productWithQuantity = { ...product, quantity, category };
    
    const categoryKey = `selected${category.charAt(0).toUpperCase() + category.slice(1)}`;
    const updatedSelection = orderData[categoryKey]?.filter(p => p.id !== product.id) || [];
    updateOrderData(categoryKey, [...updatedSelection, productWithQuantity]);
    setQuantities(prev => ({ ...prev, [quantityKey]: 0 }));
  };

  const getProductQuantityInOrder = (category, productId) => {
    const categoryKey = `selected${category.charAt(0).toUpperCase() + category.slice(1)}`;
    const product = orderData[categoryKey]?.find(p => p.id === productId);
    return product ? product.quantity : 0;
  };

  const updateProductQuantityInOrder = (category, productId, newQuantity) => {
    const categoryKey = `selected${category.charAt(0).toUpperCase() + category.slice(1)}`;
    if (newQuantity <= 0) {
      const updatedSelection = orderData[categoryKey]?.filter(p => p.id !== productId) || [];
      updateOrderData(categoryKey, updatedSelection);
      return;
    }

    const updatedSelection = orderData[categoryKey]?.map(product => 
      product.id === productId ? { ...product, quantity: newQuantity } : product
    ) || [];
    
    updateOrderData(categoryKey, updatedSelection);
  };

  const toggleInfo = (id) => {
    setExpandedInfo(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAccessory = (accessory) => {
    setSelectedAccessories(prev => {
      if (prev.some(item => item.id === accessory.id)) {
        return prev.filter(item => item.id !== accessory.id);
      } else {
        return [...prev, { ...accessory, quantity: 1 }];
      }
    });
  };

  const updateAccessoryQuantity = (id, quantity) => {
    if (quantity < 1) {
      setSelectedAccessories(prev => prev.filter(item => item.id !== id));
      return;
    }
    setSelectedAccessories(prev => 
      prev.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const handleSubmitOrder = () => {
    // Calculate totals
    const guestCount = parseInt(orderData.guestCount) || 0;
    const flatServiceFee = 48.90;
    const accessoriesSubtotal = selectedAccessories.reduce((sum, item) => {
      return sum + (item.price * item.quantity * guestCount);
    }, 0);
    
    const selectedMenuObj = menusData.find(m => m.id === orderData.selectedMenu);
    const menuSubtotal = selectedMenuObj ? selectedMenuObj.price * guestCount : 0;
    
    const foodItems = [
      ...orderData.selectedStarters,
      ...orderData.selectedMains,
      ...orderData.selectedSides,
      ...orderData.selectedDesserts,
      ...orderData.selectedDrinks
    ];
    
    const foodSubtotal = foodItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotal = menuSubtotal > 0 ? menuSubtotal : foodSubtotal;
    const total = subtotal + accessoriesSubtotal + flatServiceFee;
    
    if (total < 388.80) {
      alert(`Minimum order of €388.80 required. Your current total is €${total.toFixed(2)}`);
      return;
    }

    // Submit order logic here
    console.log('Order submitted:', {
      ...orderData,
      selectedAccessories,
      total,
      guestCount
    });
    
    alert('Order placed successfully! Redirecting to confirmation...');
    // Redirect to confirmation page
    // window.location.href = '/confirmation';
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBackToHome = () => {
    window.location.href = '/home';
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'DE' : 'EN');
  };

  const getStepComponent = () => {
    const stepComponents = {
      1: Step1,
      2: Step2,
      3: Step3,
      4: Step4,
      5: Step5,
      6: Step5,
      7: Step5,
      8: Step5,
      9: Step5,
      10: Step10,
      11: Step11,
      12: Step12
    };
    return stepComponents[currentStep] || Step1;
  };

  const CurrentStep = getStepComponent();

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        @keyframes fadeInUp {
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
          animation: fadeInUp 0.6s ease-out;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .step-item {
          opacity: 0.4;
          transition: all 0.3s ease;
        }
        
        .step-item:hover {
          opacity: 0.8;
        }
        
        .step-item.active {
          opacity: 1;
        }
        
        .border-3 {
          border-width: 3px;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #d97706;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #b45309;
        }

        /* Ensure input text is visible */
        input, textarea {
          color: #111827 !important;
        }

        input::placeholder, textarea::placeholder {
          color: #6b7280 !important;
        }

        /* Make all minus and plus buttons black */
        button .text-black, svg.text-black {
          color: #000 !important;
        }
        
        /* Ensure icons are black when they have the text-black class */
        .text-black {
          color: #000 !important;
        }
      `}</style>

      {/* Enhanced Top Navigation with Steps */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Language and Connect Row */}
          <div className="flex justify-between items-center py-2">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center text-xs font-medium text-gray-700 hover:text-amber-600 transition-colors"
            >
              <ArrowLeft size={14} className="mr-1" />
              {t.buttons.backToHome}
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 text-xs font-medium border border-amber-300 text-amber-700 bg-amber-50 rounded-md hover:bg-amber-100 transition-colors inline-flex items-center"
              >
                <Globe size={12} className="mr-1" />
                {language === 'EN' ? 'EN' : 'DE'}
              </button>
              <button className="px-3 py-1.5 text-xs font-medium border border-amber-700 text-amber-700 rounded-md hover:bg-amber-50 transition-colors">
                {t.nav.connect}
              </button>
            </div>
          </div>
          
          {/* Steps Progress Bar */}
          <div className="border-t border-gray-100 pt-2 pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-900">
                {stepsConfig[currentStep - 1]?.label}
              </span>
              
              <div className="text-center">
                <span className="text-xs text-gray-700 font-semibold">
                  Step {currentStep} of {stepsConfig.length}
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-1 mt-1">
                  <div 
                    className="bg-amber-600 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / stepsConfig.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md inline-flex items-center transition-colors ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <ChevronLeft size={14} className="mr-1" />
                  {t.buttons.back}
                </button>
                
                <button
                  onClick={nextStep}
                  className="px-4 py-1.5 text-xs font-medium bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors inline-flex items-center shadow-sm"
                >
                  {currentStep === stepsConfig.length ? t.buttons.confirm : t.buttons.next}
                  <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
            
            {/* Steps Navigation */}
            <div className="flex items-center justify-center overflow-x-auto">
              <div className="flex items-center space-x-1">
                {stepsConfig.map((step, index) => {
                  const stepNumber = index + 1;
                  const isCurrent = stepNumber === currentStep;
                  const isCompleted = stepNumber < currentStep;
                  
                  return (
                    <React.Fragment key={step.key}>
                      <button
                        onClick={() => setCurrentStep(stepNumber)}
                        className="flex flex-col items-center min-w-[60px] transition-all duration-300"
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-amber-500 text-white'
                            : isCurrent
                            ? 'bg-amber-600 text-white border-2 border-amber-600'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <Check size={12} />
                          ) : (
                            <span className="font-bold text-xs">{stepNumber}</span>
                          )}
                        </div>
                        <span className={`text-xs font-medium text-center truncate max-w-[60px] ${
                          isCurrent ? 'text-amber-600 font-semibold' : 'text-gray-600'
                        }`}>
                          {step.label}
                        </span>
                      </button>
                      {index < stepsConfig.length - 1 && (
                        <div className={`w-4 h-0.5 ${
                          isCompleted ? 'bg-amber-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-48 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <CurrentStep />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-lg">&copy; 2025 La Cannelle Catering. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
