// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ordersApi } from '@/lib/api/orders';
import { menusApi } from '@/lib/api/menus';
import { productsApi } from '@/lib/api/products';
import { systemApi } from '@/lib/api/system';
import { useTranslation } from '@/lib/hooks/useTranslation';
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
  const { t, language, toggleLanguage, setLanguage: setAppLanguage } = useTranslation('order');
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [expandedInfo, setExpandedInfo] = useState({});
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [orderSummaryVisible, setOrderSummaryVisible] = useState(true);
  const [menusData, setMenusData] = useState<any[]>([]);
  const [menuItemsData, setMenuItemsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [menus, products, status] = await Promise.all([
          menusApi.getMenus({ isActive: true }),
          productsApi.getProducts({ available: true }),
          systemApi.getSystemStatus()
        ]);

        // Normalize shape so the client has product ids and menu ids available
        const normalizedMenus = (menus || []).map((menu: any) => ({
          ...menu,
          products: menu?.menuProducts
            ? menu.menuProducts.map((mp: any) => mp.productId)
            : menu?.products || []
        }));

        const normalizedProducts = (products || []).map((product: any) => ({
          ...product,
          menus: product?.menuProducts
            ? product.menuProducts.map((mp: any) => mp.menuId)
            : product?.menus || []
        }));

        setMenusData(normalizedMenus);
        setMenuItemsData(normalizedProducts);
        setSystemStatus(status);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

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

  const stepsConfig = useMemo(() => [
    { key: 'eventType', label: language === 'DE' ? 'Anlass' : 'Event Type' },
    { key: 'service', label: language === 'DE' ? 'Leistung' : 'Service' },
    { key: 'event', label: language === 'DE' ? 'Eventdaten' : 'Event Info' },
    { key: 'menu', label: language === 'DE' ? 'Menü' : 'Menu Selection' },
    { key: 'starters', label: t.productSelection?.starters || 'Starters', icon: Utensils, color: 'text-green-600' },
    { key: 'mains', label: t.productSelection?.mains || 'Mains', icon: Coffee, color: 'text-red-600' },
    { key: 'sides', label: t.productSelection?.sides || 'Sides', icon: Utensils, color: 'text-amber-600' },
    { key: 'desserts', label: t.productSelection?.desserts || 'Desserts', icon: Cookie, color: 'text-pink-600' },
    { key: 'drinks', label: t.productSelection?.drinks || 'Drinks', icon: Wine, color: 'text-blue-600' },
    { key: 'accessories', label: language === 'DE' ? 'Zubehör' : 'Accessories', icon: ShoppingBag, color: 'text-purple-600' },
    { key: 'details', label: language === 'DE' ? 'Lieferdetails' : 'Delivery Details' },
    { key: 'payment', label: language === 'DE' ? 'Zahlung' : 'Payment' }
  ], [language, t]);

  // Step 1: Event Type
  const Step1 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t.eventType?.title}
        </h2>
        <p className="text-gray-600 text-lg">
          {t.eventType?.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {['business', 'private'].map((type) => {
          const option = t.eventType?.options?.[type] || {};
          return (
          <button
            key={type}
            onClick={() => {
              updateOrderData('businessType', type);
              updateOrderData('serviceType', '');
              setCurrentStep(2);
            }}
            className={`p-8 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
              orderData.businessType === type
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-gray-300 hover:border-amber-400 bg-white'
            }`}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {option.title}
            </h3>
            <p className="text-amber-600 font-semibold text-lg mb-6">
              {option.subtitle}
            </p>
          </button>
        )})}
      </div>
    </div>
  );

  // Step 2: Service Type
  const Step2 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t.serviceType?.title}
        </h2>
        <p className="text-gray-600 text-lg">
          {t.serviceType?.subtitle}
        </p>
      </div>

      {orderData.businessType ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(t.serviceType?.options?.[orderData.businessType] || []).map((service) => (
            <button
              key={service.key}
              onClick={() => {
                updateOrderData('serviceType', service.key);
                setCurrentStep(3);
              }}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-center hover:shadow-lg ${
                orderData.serviceType === service.key
                  ? 'border-amber-500 bg-amber-50 shadow-md'
                  : 'border-gray-300 hover:border-amber-400 bg-white'
              }`}
            >
              <div className="p-4 bg-amber-100 rounded-lg mb-4 inline-flex">
                <Briefcase size={32} className="text-amber-600" />
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
      ) : (
        <div className="text-center text-gray-600">
          {language === 'DE'
            ? 'Bitte wählen Sie zuerst einen Anlass.'
            : 'Please choose an occasion first.'}
        </div>
      )}
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
              <div className="relative group">
                <input
                  type="date"
                  value={orderData.eventDate}
                  onChange={(e) => updateOrderData('eventDate', e.target.value)}
                  min={today}
                  className="w-full pl-12 pr-4 py-3 text-base border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-300 bg-amber-50/60 text-gray-900 placeholder:text-gray-500 shadow-sm"
                  required
                />
                <Calendar className="absolute left-4 top-3.5 text-amber-500" size={20} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t.eventInfo.time} *
              </label>
              <div className="relative group">
                <input
                  type="time"
                  value={orderData.eventTime}
                  onChange={(e) => updateOrderData('eventTime', e.target.value)}
                  step="900"
                  className="w-full pl-12 pr-4 py-3 text-base border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-300 bg-amber-50/60 text-gray-900 placeholder:text-gray-500 shadow-sm"
                  required
                />
                <Clock className="absolute left-4 top-3.5 text-amber-500" size={20} />
              </div>
            </div>
          </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t.eventInfo.guests} *
          </label>
          <input
            type="text"
            value={orderData.guestCount || ''}
            onChange={(e) => updateOrderData('guestCount', e.target.value.replace(/[^0-9]/g, ''))}
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full px-4 py-3 text-base border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-300 bg-amber-50/60 text-gray-900 placeholder:text-gray-500 shadow-sm"
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
            inputMode="numeric"
            autoComplete="postal-code"
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 bg-white text-gray-900 placeholder:text-gray-500 shadow-sm"
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
              {menu.image ? (
                <img
                  src={menu.image}
                  alt={menu.name || 'Menu image'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center text-gray-500 text-sm">
                  No image
                </div>
              )}
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
    
    const selectedMenu = menusData.find(
      m => m.id === orderData.selectedMenu || m.id === Number(orderData.selectedMenu)
    );
    const products = menuItemsData
      .filter(item => item.menuCategory === currentCategory)
      .filter(item => {
        if (!selectedMenu) return true;
        const productIds = selectedMenu.products || [];
        return productIds.includes(item.id);
      });
    
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
    
    const selectedMenuObj = menusData.find(
      m => m.id === orderData.selectedMenu || m.id === Number(orderData.selectedMenu)
    );
    
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
                  <span className="font-medium text-gray-700">{t.eventInfo.date}:</span>
                  <span className="font-semibold text-gray-900">{orderData.eventDate || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{t.eventInfo.guests}:</span>
                  <span className="font-semibold text-gray-900">{orderData.guestCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{t.eventInfo.location}:</span>
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
              {t.productSelection?.title || 'Select Your Items'}
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
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name || 'Product image'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center text-gray-500 text-sm">
                            No image
                          </div>
                        )}
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
    
    const selectedMenuObj = menusData.find(
      m => m.id === orderData.selectedMenu || m.id === Number(orderData.selectedMenu)
    );
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
                  <span className="font-medium text-gray-700">{t.eventInfo.date}:</span>
                  <span className="font-semibold text-gray-900">{orderData.eventDate || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{t.eventInfo.guests}:</span>
                  <span className="font-semibold text-gray-900">{orderData.guestCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{t.eventInfo.location}:</span>
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
                        min={today}
                        className="w-full px-4 py-3 text-base border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-gray-900 placeholder:text-gray-500 bg-amber-50/60"
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
                        inputMode="numeric"
                        autoComplete="postal-code"
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
                      type="text"
                      value={orderData.guestCount || ''}
                      onChange={(e) => updateOrderData('guestCount', e.target.value.replace(/[^0-9]/g, ''))}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="w-full px-4 py-3 text-base border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-gray-900 placeholder:text-gray-500 bg-amber-50/60"
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
    
    const selectedMenuObj = menusData.find(
      m => m.id === orderData.selectedMenu || m.id === Number(orderData.selectedMenu)
    );
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
    const vatRate = orderData.businessType === 'business' ? 0.19 : 0.07;
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
                      <span className="font-medium">
                        {orderData.guestCount || 0} {language === 'DE' ? 'Gäste' : 'guests'}
                      </span>
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

  const showNotification = (type: 'success' | 'error', message: string, duration = 2500) => {
    setNotification({ type, message });
    if (duration > 0) {
      setTimeout(() => setNotification(null), duration);
    }
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

  const handleSubmitOrder = async () => {
    // Check if ordering is paused
    if (systemStatus?.orderingPaused) {
      showNotification('error', 'Ordering is currently paused. Please try again later.', 3000);
      return;
    }

    // Calculate totals
    const guestCount = parseInt(orderData.guestCount) || 0;
    const flatServiceFee = 48.90;
    const accessoriesSubtotal = selectedAccessories.reduce((sum, item) => {
      return sum + (item.price * item.quantity * guestCount);
    }, 0);
    
    const selectedMenuObj = menusData.find(
      m => m.id === orderData.selectedMenu || m.id === Number(orderData.selectedMenu)
    );
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
    
    // Prepare order items
    const orderItems = foodItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name
    }));

    try {
      const order = await ordersApi.createOrder({
        clientName: `${orderData.contactInfo.firstName || ''} ${orderData.contactInfo.lastName || ''}`.trim() || 'Guest',
        contactEmail: orderData.contactInfo.email || '',
        phone: orderData.contactInfo.phone || '',
        eventType: orderData.serviceType || orderData.businessType || 'Custom',
        eventDate: orderData.eventDate || new Date().toISOString(),
        eventTime: orderData.eventTime || '',
        guests: guestCount,
        location: orderData.location || orderData.postalCode || '',
        menuTier: orderData.menuTier,
        specialRequests: orderData.specialRequests,
        businessType: orderData.businessType,
        serviceType: orderData.serviceType,
        postalCode: orderData.postalCode,
        items: orderItems,
        subtotal: subtotal,
        serviceFee: flatServiceFee,
        total: total
      });
      
      showNotification('success', 'Order placed successfully! Order ID: ' + order.id, 2000);
      setTimeout(() => {
        window.location.href = '/home';
      }, 2000);
    } catch (error: any) {
      showNotification('error', 'Failed to place order: ' + (error.message || 'Unknown error'), 3500);
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBackToHome = () => {
    window.location.href = '/home';
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`px-4 py-3 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {notification.message}
          </div>
        </div>
      )}
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
                  {language === 'DE'
                    ? `Schritt ${currentStep} von ${stepsConfig.length}`
                    : `Step ${currentStep} of ${stepsConfig.length}`}
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
      <main className="flex-1">
        <div className="pt-48 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <CurrentStep />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-lg">&copy; 2025 La Cannelle Catering. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
