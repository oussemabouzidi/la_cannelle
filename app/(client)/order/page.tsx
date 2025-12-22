// @ts-nocheck
"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/api/orders';
import { menusApi } from '@/lib/api/menus';
import { productsApi } from '@/lib/api/products';
import { systemApi, type ClosedDate } from '@/lib/api/system';
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
const GERMAN_STATES = [
  { code: 'BW', name: 'Baden-Wuerttemberg' },
  { code: 'BY', name: 'Bavaria' },
  { code: 'BE', name: 'Berlin' },
  { code: 'BB', name: 'Brandenburg' },
  { code: 'HB', name: 'Bremen' },
  { code: 'HH', name: 'Hamburg' },
  { code: 'HE', name: 'Hesse' },
  { code: 'MV', name: 'Mecklenburg-Vorpommern' },
  { code: 'NI', name: 'Lower Saxony' },
  { code: 'NW', name: 'North Rhine-Westphalia' },
  { code: 'RP', name: 'Rhineland-Palatinate' },
  { code: 'SL', name: 'Saarland' },
  { code: 'SN', name: 'Saxony' },
  { code: 'ST', name: 'Saxony-Anhalt' },
  { code: 'SH', name: 'Schleswig-Holstein' },
  { code: 'TH', name: 'Thuringia' }
];
const MIN_GUESTS = 10;
const MIN_ORDER_TOTAL = 388.80;
const normalizePlaces = (data: any) => {
  const defaultPostCode = data?.['post code'] || '';
  const defaultState = data?.['state'] || '';
  const defaultStateCode = data?.['state abbreviation'] || '';
  return (data?.places || []).map((place: any) => ({
    code: place?.['post code'] || defaultPostCode,
    city: place?.['place name'] || '',
    state: place?.['state'] || defaultState,
    stateCode: place?.['state abbreviation'] || defaultStateCode
  }));
};
const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const parseDateKey = (value: string) => {
  const [year, month, day] = value.split('-').map((part) => parseInt(part, 10));
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};
const isSameDay = (a: Date, b: Date) => {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
};
const DatePicker = ({
  value,
  onChange,
  minDate,
  language,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  minDate: Date;
  language: 'EN' | 'DE';
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const initialDate = value ? parseDateKey(value) : new Date();
    const baseDate = initialDate || new Date();
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  });
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const locale = language === 'DE' ? 'de-DE' : 'en-US';
  const minDateStart = new Date(minDate);
  minDateStart.setHours(0, 0, 0, 0);
  useEffect(() => {
    if (!value) return;
    const parsed = parseDateKey(value);
    if (!parsed) return;
    setCurrentMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
  }, [value]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const monthLabel = currentMonth.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric'
  });
  const dayLabels = language === 'DE'
    ? ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = monthEnd.getDate();
  const startDayIndex = (monthStart.getDay() + 6) % 7;
  const totalCells = startDayIndex + daysInMonth;
  const rows = Math.ceil(totalCells / 7);
  const selectedDate = value ? parseDateKey(value) : null;
  const prevMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
  const canGoPrev = prevMonthEnd >= minDateStart;
  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString(locale)
    : '';
  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full pl-12 pr-4 py-3 text-left text-base border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-300 bg-amber-50/60 text-gray-900 placeholder:text-gray-500 shadow-sm"
      >
        {displayValue || placeholder}
      </button>
      <Calendar className="absolute left-4 top-3.5 text-amber-500" size={20} />
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-amber-200 bg-white shadow-xl p-4 z-20">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              disabled={!canGoPrev}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                canGoPrev ? 'hover:bg-amber-50 text-gray-700' : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-gray-900">{monthLabel}</span>
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-amber-50 text-gray-700"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
            {dayLabels.map((label) => (
              <div key={label} className="text-center font-medium">
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-sm">
            {Array.from({ length: rows * 7 }).map((_, index) => {
              const dayNumber = index - startDayIndex + 1;
              if (dayNumber < 1 || dayNumber > daysInMonth) {
                return <div key={`empty-${index}`} className="h-9" />;
              }
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber);
              const isPast = date < minDateStart;
              const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
              const isToday = isSameDay(date, minDateStart);
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => {
                    if (isPast) return;
                    onChange(formatDateKey(date));
                    setIsOpen(false);
                  }}
                  disabled={isPast}
                  className={`h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isPast
                      ? 'text-gray-300 cursor-not-allowed'
                      : isSelected
                      ? 'bg-amber-600 text-white shadow-md'
                      : isToday
                      ? 'border border-amber-400 text-amber-700'
                      : 'hover:bg-amber-50 text-gray-700'
                  }`}
                >
                  {dayNumber}
                </button>
              );
            })}
          </div>
        </div>
      )}
  </div>
);
};
const buildTimeSlots = (intervalMinutes = 15) => {
  const slots: string[] = [];
  for (let total = 0; total < 24 * 60; total += intervalMinutes) {
    const hour = String(Math.floor(total / 60)).padStart(2, '0');
    const minute = String(total % 60).padStart(2, '0');
    slots.push(`${hour}:${minute}`);
  }
  return slots;
};
const TimePicker = ({
  value,
  onChange,
  language,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  language: 'EN' | 'DE';
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const slots = useMemo(() => buildTimeSlots(15), []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full pl-12 pr-4 py-3 text-left text-base border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-300 bg-amber-50/60 text-gray-900 placeholder:text-gray-500 shadow-sm"
      >
        {value || placeholder}
      </button>
      <Clock className="absolute left-4 top-3.5 text-amber-500" size={20} />
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-amber-200 bg-white shadow-xl p-2 z-20">
          <div className="max-h-56 overflow-y-auto">
            {slots.map((slot) => {
              const isSelected = slot === value;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    onChange(slot);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-amber-600 text-white'
                      : 'text-gray-700 hover:bg-amber-50'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {!slots.length && (
            <div className="px-4 py-3 text-sm text-gray-500">
              {language === 'DE' ? 'Keine Zeiten verfuegbar.' : 'No times available.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const PostalCodeFields = ({
  label,
  required,
  orderData,
  postalCopy,
  cityLookupOptions,
  cityLookupError,
  cityLookupLoading,
  postalLookupError,
  postalLookupLoading,
  handleStateChange,
  handleCityChange,
  handlePostalCodeSelect,
  handlePostalCodeChange,
  lookupPostalCodesByCity,
  lookupPostalCode
}) => (
  <div className="space-y-4">
    {label && (
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}{required ? ' *' : ''}
      </label>
    )}
    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          {postalCopy.state}
        </label>
        <select
          value={orderData.state}
          onChange={(e) => handleStateChange(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
        >
          <option value="">{postalCopy.statePlaceholder}</option>
          {GERMAN_STATES.map((state) => (
            <option key={state.code} value={state.code}>
              {state.code} - {state.name}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          {postalCopy.city}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={orderData.city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
            placeholder={postalCopy.cityPlaceholder}
          />
          <button
            type="button"
            onClick={lookupPostalCodesByCity}
            disabled={cityLookupLoading}
            className={`px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
              cityLookupLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {cityLookupLoading ? postalCopy.searching : postalCopy.findPostal}
          </button>
        </div>
        {cityLookupError && (
          <p className="mt-1 text-sm text-red-600">{cityLookupError}</p>
        )}
      </div>
    </div>
    {cityLookupOptions.length > 0 && (
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          {postalCopy.selectPostal}
        </label>
        <select
          value={orderData.postalCode}
          onChange={(e) => handlePostalCodeSelect(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
        >
          <option value="">{postalCopy.selectPostal}</option>
          {cityLookupOptions.map((option) => (
            <option key={`${option.code}-${option.city}`} value={option.code}>
              {option.code}{option.city ? ` - ${option.city}` : ''}
            </option>
          ))}
        </select>
      </div>
    )}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {postalCopy.postalCode}
      </label>
      <div className="relative">
        <input
          type="text"
          value={orderData.postalCode}
          onChange={(e) => handlePostalCodeChange(e.target.value)}
          onBlur={lookupPostalCode}
          inputMode="numeric"
          pattern="[0-9]{5}"
          maxLength={5}
          autoComplete="postal-code"
          required={required}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
          placeholder={postalCopy.postalPlaceholder}
        />
        <MapPinIcon className="absolute right-3 top-3.5 text-gray-400" size={20} />
      </div>
      <p className={`mt-1 text-xs ${postalLookupError ? 'text-red-600' : 'text-gray-500'}`}>
        {postalLookupLoading ? postalCopy.checking : (postalLookupError || postalCopy.germanyOnly)}
      </p>
    </div>
  </div>
);

export default function OrderPage() {
  const router = useRouter();
  const { t, language, toggleLanguage, setLanguage: setAppLanguage } = useTranslation('order');
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [orderSummaryVisible, setOrderSummaryVisible] = useState(true);
  const [menusData, setMenusData] = useState<any[]>([]);
  const [menuItemsData, setMenuItemsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [closedDates, setClosedDates] = useState<ClosedDate[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [menus, products, status, dates] = await Promise.all([
          menusApi.getMenus({ isActive: true }),
          productsApi.getProducts({ available: true }),
          systemApi.getSystemStatus(),
          systemApi.getClosedDates()
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
        setClosedDates(dates || []);
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
    city: '',
    state: '',
    postalCode: '',
    deliveryDate: '',
    companyInfo: '',
    paymentMethod: '',
    cardDetails: {
      number: '',
      expiry: '',
      cvc: '',
      name: ''
    }
  });
  const [contactErrors, setContactErrors] = useState({ email: '', phone: '' });
  const [companyErrors, setCompanyErrors] = useState({ name: '', info: '' });
  const [guestCountError, setGuestCountError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [bankDetailsOpen, setBankDetailsOpen] = useState(false);
  const [productDetailsOpen, setProductDetailsOpen] = useState(false);
  const [productDetailsItem, setProductDetailsItem] = useState(null);
  const [extraNoticeOpen, setExtraNoticeOpen] = useState(false);
  const [extraNoticeData, setExtraNoticeData] = useState({ label: '', extra: 0 });
  const extraNoticeRef = useRef<Record<string, number>>({});
  const [postalLookupError, setPostalLookupError] = useState('');
  const [postalLookupLoading, setPostalLookupLoading] = useState(false);
  const [cityLookupOptions, setCityLookupOptions] = useState([]);
  const [cityLookupError, setCityLookupError] = useState('');
  const [cityLookupLoading, setCityLookupLoading] = useState(false);
  const validateEmailValue = (value: string) => {
    if (!value) {
      return language === 'DE' ? 'E-Mail ist erforderlich.' : 'Email is required.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return language === 'DE' ? 'Bitte eine gueltige E-Mail eingeben.' : 'Please enter a valid email address.';
    }
    return '';
  };
  const validatePhoneValue = (value: string) => {
    if (!value) {
      return language === 'DE' ? 'Telefonnummer ist erforderlich.' : 'Phone number is required.';
    }
    if (!/^\+?[0-9\s-]{7,15}$/.test(value)) {
      return language === 'DE' ? 'Bitte eine gueltige Telefonnummer eingeben.' : 'Please enter a valid phone number.';
    }
    return '';
  };
  const validateCompanyName = (value: string) => {
    if (orderData.businessType !== 'business') {
      return '';
    }
    return value ? '' : (language === 'DE' ? 'Firmenname ist erforderlich.' : 'Company name is required.');
  };
  const validateCompanyInfo = (value: string) => {
    return '';
  };
  const updateContactInfoField = (field: string, value: string) => {
    updateOrderData('contactInfo', {
      ...orderData.contactInfo,
      [field]: value
    });
    if (field === 'email') {
      setContactErrors((prev) => ({ ...prev, email: validateEmailValue(value.trim()) }));
    }
    if (field === 'phone') {
      setContactErrors((prev) => ({ ...prev, phone: validatePhoneValue(value.trim()) }));
    }
  };
  const updateCompanyName = (value: string) => {
    updateOrderData('contactInfo', {
      ...orderData.contactInfo,
      company: value
    });
    setCompanyErrors((prev) => ({ ...prev, name: validateCompanyName(value.trim()) }));
  };
  const updateCompanyInfo = (value: string) => {
    updateOrderData('companyInfo', value);
    setCompanyErrors((prev) => ({ ...prev, info: '' }));
  };
  const handleContactBlur = (field: 'email' | 'phone') => {
    const value = (orderData.contactInfo[field] || '').trim();
    if (field === 'email') {
      setContactErrors((prev) => ({ ...prev, email: validateEmailValue(value) }));
    }
    if (field === 'phone') {
      setContactErrors((prev) => ({ ...prev, phone: validatePhoneValue(value) }));
    }
  };
  useEffect(() => {
    if (orderData.businessType !== 'business') {
      setCompanyErrors({ name: '', info: '' });
    }
  }, [orderData.businessType]);
  const getGuestCountError = () => (
    language === 'DE'
      ? 'Anzahl der GÃ¤ste muss mindestens 10 sein.'
      : 'Guest count must be 10 or more.'
  );
  const handleGuestCountChange = (value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, '');
    updateOrderData('guestCount', digitsOnly);
    if (!digitsOnly) {
      setGuestCountError('');
      return;
    }
    const nextCount = parseInt(digitsOnly, 10) || 0;
    setGuestCountError(nextCount >= MIN_GUESTS ? '' : getGuestCountError());
    if (orderData.eventDate) {
      const leadTimeDays = nextCount >= 100 ? 3 : 2;
      const earliestDate = new Date();
      earliestDate.setDate(earliestDate.getDate() + leadTimeDays);
      earliestDate.setHours(0, 0, 0, 0);
      const selectedDate = parseDateKey(orderData.eventDate);
      if (selectedDate && selectedDate < earliestDate) {
        updateOrderData('eventDate', '');
      }
    }
  };
  const handlePostalCodeChange = (value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 5);
    updateOrderData('postalCode', digitsOnly);
    setPostalLookupError('');
    setCityLookupError('');
    setCityLookupOptions([]);
  };
  const handlePostalCodeSelect = (value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 5);
    updateOrderData('postalCode', digitsOnly);
    setPostalLookupError('');
  };
  const handleCityChange = (value: string) => {
    updateOrderData('city', value);
    setCityLookupError('');
    setCityLookupOptions([]);
  };
  const handleStateChange = (value: string) => {
    updateOrderData('state', value);
    setCityLookupError('');
    setCityLookupOptions([]);
  };
  const lookupPostalCode = async () => {
    const postalCode = (orderData.postalCode || '').trim();
    if (!postalCode) {
      setPostalLookupError('');
      return;
    }
    if (!/^\d{5}$/.test(postalCode)) {
      setPostalLookupError(
        language === 'DE'
          ? 'Bitte 5-stellige deutsche PLZ eingeben.'
          : 'Enter a 5-digit German postal code.'
      );
      return;
    }
    setPostalLookupLoading(true);
    setPostalLookupError('');
    try {
      const response = await fetch(`https://api.zippopotam.us/de/${postalCode}`);
      if (!response.ok) {
        throw new Error('Postal code not found');
      }
      const data = await response.json();
      const places = normalizePlaces(data);
      if (!orderData.city && places[0]?.city) {
        updateOrderData('city', places[0].city);
      }
      if (!orderData.state && places[0]?.stateCode) {
        updateOrderData('state', places[0].stateCode);
      }
    } catch (error) {
      setPostalLookupError(
        language === 'DE'
          ? 'Postleitzahl nicht gefunden (nur Deutschland).'
          : 'Postal code not found in Germany.'
      );
    } finally {
      setPostalLookupLoading(false);
    }
  };
  const lookupPostalCodesByCity = async () => {
    const stateCode = (orderData.state || '').trim();
    const city = (orderData.city || '').trim();
    if (!stateCode || !city) {
      setCityLookupError(
        language === 'DE'
          ? 'Bitte Bundesland und Stadt angeben.'
          : 'Please select a state and city.'
      );
      setCityLookupOptions([]);
      return;
    }
    setCityLookupLoading(true);
    setCityLookupError('');
    try {
      const queryCity = encodeURIComponent(city.replace(/\s+/g, ' ').toLowerCase());
      const response = await fetch(`https://api.zippopotam.us/de/${stateCode.toLowerCase()}/${queryCity}`);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      const places = normalizePlaces(data);
      const uniqueOptions = [];
      const seenCodes = new Set();
      places.forEach((place) => {
        if (!place.code || seenCodes.has(place.code)) return;
        seenCodes.add(place.code);
        uniqueOptions.push(place);
      });
      setCityLookupOptions(uniqueOptions);
      if (uniqueOptions.length === 1 && uniqueOptions[0].code) {
        updateOrderData('postalCode', uniqueOptions[0].code);
        setPostalLookupError('');
      }
    } catch (error) {
      setCityLookupError(
        language === 'DE'
          ? 'Keine PLZ fuer diese Stadt gefunden.'
          : 'No postal codes found for this city.'
      );
      setCityLookupOptions([]);
    } finally {
      setCityLookupLoading(false);
    }
  };
  const closedDateMap = useMemo(() => {
    const map = new Map<string, ClosedDate>();
    closedDates.forEach((d) => {
      const key = new Date(d.date).toISOString().split('T')[0];
      map.set(key, d);
    });
    return map;
  }, [closedDates]);
  const selectedEventDate = orderData.eventDate || '';
  const selectedEventKey = selectedEventDate
    ? new Date(selectedEventDate).toISOString().split('T')[0]
    : '';
  const closedDateEntry = selectedEventKey ? closedDateMap.get(selectedEventKey) : undefined;
  const isClosedDate = !!closedDateEntry;
  const isOrderingPaused = !!systemStatus?.orderingPaused;
  const orderBlocked = isClosedDate || isOrderingPaused;
  const blockedMessage = useMemo(() => {
    if (isOrderingPaused) {
      const reason = systemStatus?.pauseReason ? ` (${systemStatus.pauseReason})` : '';
      return language === 'DE'
        ? `Bestellungen sind aktuell pausiert${reason}.`
        : `Ordering is currently paused${reason}.`;
    }
    if (isClosedDate) {
      const reason = closedDateEntry?.reason ? ` (${closedDateEntry.reason})` : '';
      return language === 'DE'
        ? `Das gewaehlte Datum ist geschlossen${reason}. Bitte waehlen Sie ein anderes Datum.`
        : `The selected date is closed${reason}. Please choose another date.`;
    }
    return '';
  }, [closedDateEntry, isClosedDate, isOrderingPaused, language, systemStatus?.pauseReason]);
  const categoryOrder = ['starter', 'main', 'side', 'dessert', 'beverage'];
  const stepCategoryKeys = [
    'starter', 'main', 'side', 'dessert', 'beverage',
    'fingerfood', 'canape', 'appetizer', 'salad', 'soup', 'pasta', 'seafood', 'meat',
    'vegetarian', 'vegan', 'glutenfree', 'dairyfree', 'spicy', 'signature', 'seasonal',
    'kidfriendly', 'chefspecial', 'tapas', 'bbq', 'breakfast', 'brunch'
  ];
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
      beverages: 'beverage',
      glutenfree: 'glutenfree',
      dairyfree: 'dairyfree',
      kidfriendly: 'kidfriendly',
      chefspecial: 'chefspecial'
    };
    const resolved = aliases[normalized] || normalized;
    return stepCategoryKeys.includes(resolved) ? resolved : '';
  };
  const categoryMeta = useMemo(() => ({
    starter: { label: t.productSelection?.starters || 'Starters', icon: Utensils, color: 'text-green-600' },
    main: { label: t.productSelection?.mains || 'Mains', icon: Coffee, color: 'text-red-600' },
    side: { label: t.productSelection?.sides || 'Sides', icon: Utensils, color: 'text-amber-600' },
    dessert: { label: t.productSelection?.desserts || 'Desserts', icon: Cookie, color: 'text-pink-600' },
    beverage: { label: t.productSelection?.drinks || 'Drinks', icon: Wine, color: 'text-blue-600' },
    fingerfood: { label: 'Fingerfood', icon: Utensils, color: 'text-amber-700' },
    canape: { label: 'Canape', icon: Utensils, color: 'text-amber-700' },
    appetizer: { label: 'Appetizer', icon: Utensils, color: 'text-amber-700' },
    salad: { label: 'Salad', icon: Leaf, color: 'text-green-700' },
    soup: { label: 'Soup', icon: Utensils, color: 'text-orange-600' },
    pasta: { label: 'Pasta', icon: Utensils, color: 'text-orange-700' },
    seafood: { label: 'Seafood', icon: Fish, color: 'text-sky-600' },
    meat: { label: 'Meat', icon: Beef, color: 'text-red-700' },
    vegetarian: { label: 'Vegetarian', icon: Leaf, color: 'text-green-700' },
    vegan: { label: 'Vegan', icon: Leaf, color: 'text-emerald-700' },
    glutenfree: { label: 'Gluten-Free', icon: Wheat, color: 'text-amber-700' },
    dairyfree: { label: 'Dairy-Free', icon: Milk, color: 'text-indigo-600' },
    spicy: { label: 'Spicy', icon: AlertCircle, color: 'text-red-600' },
    signature: { label: 'Signature', icon: Award, color: 'text-amber-600' },
    seasonal: { label: 'Seasonal', icon: Sparkles, color: 'text-amber-600' },
    kidfriendly: { label: 'Kid-Friendly', icon: Heart, color: 'text-pink-600' },
    chefspecial: { label: 'Chef-Special', icon: Star, color: 'text-amber-600' },
    tapas: { label: 'Tapas', icon: Utensils, color: 'text-amber-700' },
    bbq: { label: 'BBQ', icon: Utensils, color: 'text-red-700' },
    breakfast: { label: 'Breakfast', icon: Egg, color: 'text-yellow-700' },
    brunch: { label: 'Brunch', icon: Egg, color: 'text-yellow-700' }
  }), [t]);
  const postalCopy = useMemo(() => ({
    state: language === 'DE' ? 'Bundesland' : 'State',
    statePlaceholder: language === 'DE' ? 'Bundesland waehlen' : 'Select state',
    city: language === 'DE' ? 'Stadt' : 'City',
    cityPlaceholder: language === 'DE' ? 'z.B. Berlin' : 'e.g. Berlin',
    findPostal: language === 'DE' ? 'PLZ suchen' : 'Find postal codes',
    searching: language === 'DE' ? 'Suche...' : 'Searching...',
    selectPostal: language === 'DE' ? 'Postleitzahl waehlen' : 'Select postal code',
    postalCode: language === 'DE' ? 'Postleitzahl' : 'Postal Code',
    postalPlaceholder: language === 'DE' ? 'z.B. 10115' : 'e.g. 10115',
    germanyOnly: language === 'DE' ? 'Nur Deutschland (5-stellig).' : 'Germany only (5 digits).',
    checking: language === 'DE' ? 'Pruefe...' : 'Checking...'
  }), [language]);
  const postalFieldProps = {
    orderData,
    postalCopy,
    cityLookupOptions,
    cityLookupError,
    cityLookupLoading,
    postalLookupError,
    postalLookupLoading,
    handleStateChange,
    handleCityChange,
    handlePostalCodeSelect,
    handlePostalCodeChange,
    lookupPostalCodesByCity,
    lookupPostalCode
  };
  const dynamicMenuSteps = useMemo(() => {
    const selectedMenu = menusData.find(
      m => m.id === orderData.selectedMenu || m.id === Number(orderData.selectedMenu)
    );
    const rawSteps = Array.isArray(selectedMenu?.steps) ? selectedMenu.steps : [];
    const mapped = rawSteps
      .map((step: any, index: number) => {
        const categoryKey = normalizeMenuStepKey(step?.label);
        if (!categoryKey || !categoryMeta[categoryKey]) return null;
        const rawLabel = (step?.label || '').trim();
        const normalizedLabel = normalizeCategoryValue(rawLabel);
        const label = rawLabel && normalizedLabel === categoryKey
          ? categoryMeta[categoryKey].label
          : rawLabel || categoryMeta[categoryKey].label;
        return {
          key: `menu-step-${index}`,
          categoryKey,
          label,
          icon: categoryMeta[categoryKey].icon,
          color: categoryMeta[categoryKey].color,
          included: Number.isFinite(step?.included) ? step.included : 0
        };
      })
      .filter(Boolean) as Array<{ key: string; categoryKey: string; label: string; icon: any; color: string; included: number }>;
    if (mapped.length) return mapped;
    return categoryOrder.map((key) => ({
      key,
      categoryKey: key,
      label: categoryMeta[key].label,
      icon: categoryMeta[key].icon,
      color: categoryMeta[key].color,
      included: 0
    }));
  }, [menusData, orderData.selectedMenu, categoryMeta, categoryOrder]);
  const nonCoreStepCategories = useMemo(() => {
    const set = new Set<string>();
    dynamicMenuSteps.forEach((step) => {
      const key = step.categoryKey || step.key;
      if (!categoryOrder.includes(key)) {
        set.add(key);
      }
    });
    return set;
  }, [dynamicMenuSteps, categoryOrder]);
  const activeCategoryKeys = useMemo(() => {
    const unique = new Set<string>();
    dynamicMenuSteps.forEach(step => unique.add(step.categoryKey || step.key));
    return Array.from(unique);
  }, [dynamicMenuSteps]);
  const stepLabelByKey = useMemo(() => {
    const labels: Record<string, string> = {};
    dynamicMenuSteps.forEach((step) => {
      labels[step.categoryKey || step.key] = step.label;
    });
    return labels;
  }, [dynamicMenuSteps]);
  const stepsConfig = useMemo(() => ([
    { key: 'event', label: language === 'DE' ? 'Eventdetails' : 'Event Details' },
    { key: 'menu', label: language === 'DE' ? 'Menue' : 'Menu Selection' },
    ...dynamicMenuSteps,
    { key: 'accessories', label: language === 'DE' ? 'Zubehoer' : 'Accessories', icon: ShoppingBag, color: 'text-purple-600' },
    { key: 'checkout', label: language === 'DE' ? 'Lieferung & Zahlung' : 'Delivery & Payment' }
  ]), [language, dynamicMenuSteps]);
  const firstProductStepIndex = stepsConfig.findIndex(
    step => activeCategoryKeys.includes((step as any).categoryKey || '')
  ) + 1;
  const blockAfterStep = firstProductStepIndex > 0 ? firstProductStepIndex : stepsConfig.length;
  const shouldBlockProgress = isOrderingPaused || (isClosedDate && currentStep >= blockAfterStep);
  const selectionKeyByCategory: Record<string, string> = {
    starter: 'selectedStarters',
    main: 'selectedMains',
    side: 'selectedSides',
    dessert: 'selectedDesserts',
    beverage: 'selectedDrinks'
  };
  const getAllSelectedItems = () => ([
    ...orderData.selectedStarters,
    ...orderData.selectedMains,
    ...orderData.selectedSides,
    ...orderData.selectedDesserts,
    ...orderData.selectedDrinks
  ]);
  const matchesStepCategory = (item: any, categoryKey: string) => {
    const normalizedCategory = normalizeCategoryValue(item.category);
    const categoryTags = Array.isArray(item.productCategories)
      ? item.productCategories.map(normalizeCategoryValue)
      : [];
    if (categoryOrder.includes(categoryKey)) {
      if (normalizedCategory !== categoryKey) return false;
      if (!nonCoreStepCategories.size) return true;
      const hasTaggedStep = categoryTags.some(tag => nonCoreStepCategories.has(tag));
      return !hasTaggedStep;
    }
    return categoryTags.includes(categoryKey);
  };
  const getItemsForStepCategory = (categoryKey: string) => {
    const allItems = getAllSelectedItems();
    return allItems.filter((item) => matchesStepCategory(item, categoryKey));
  };
  const includedByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    dynamicMenuSteps.forEach((step) => {
      const categoryKey = step.categoryKey || step.key;
      map[categoryKey] = (map[categoryKey] || 0) + Math.max(0, Number(step.included) || 0);
    });
    return map;
  }, [dynamicMenuSteps]);
  const cumulativeIncludedByStep = useMemo(() => {
    const running: Record<string, number> = {};
    const cumulative: Record<string, number> = {};
    stepsConfig.forEach((step) => {
      const categoryKey = (step as any).categoryKey;
      if (!categoryKey) return;
      running[categoryKey] = (running[categoryKey] || 0) + Math.max(0, Number((step as any).included) || 0);
      cumulative[step.key] = running[categoryKey];
    });
    return cumulative;
  }, [stepsConfig]);
  const getCategorySelectionCount = (categoryKey: string) => {
    const items = getItemsForStepCategory(categoryKey);
    return items.length;
  };
  const getCategoryExtrasSubtotal = (categoryKey: string) => {
    const items = getItemsForStepCategory(categoryKey);
    const included = Math.max(0, Number(includedByCategory[categoryKey]) || 0);
    let remaining = included;
    const sorted = [...items].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    return sorted.reduce((sum, item) => {
      if (remaining > 0) {
        remaining -= 1;
        return sum;
      }
      return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
    }, 0);
  };
  const getFoodExtrasSubtotal = () => {
    return activeCategoryKeys.reduce((sum, key) => sum + getCategoryExtrasSubtotal(key), 0);
  };
  const getCategorySummaryRows = () => activeCategoryKeys.map((key) => {
    const included = Math.max(0, Number(includedByCategory[key]) || 0);
    const selected = getCategorySelectionCount(key);
    const extra = Math.max(0, selected - included);
    const extraCost = getCategoryExtrasSubtotal(key);
    return {
      key,
      label: stepLabelByKey[key] || categoryMeta[key]?.label || key,
      included,
      selected,
      extra,
      extraCost
    };
  }).filter(row => row.included > 0 || row.selected > 0);
  const getOrderTotals = () => {
    const guestCount = parseInt(orderData.guestCount, 10) || 0;
    const flatServiceFee = 48.90;
    const accessoriesSubtotal = selectedAccessories.reduce((sum, item) => {
      return sum + (item.price * item.quantity * guestCount);
    }, 0);
    const selectedMenuObj = menusData.find(
      m => m.id === orderData.selectedMenu || m.id === Number(orderData.selectedMenu)
    );
    const menuSubtotal = selectedMenuObj ? selectedMenuObj.price * guestCount : 0;
    const foodExtrasSubtotal = getFoodExtrasSubtotal();
    const subtotal = menuSubtotal + foodExtrasSubtotal;
    const total = subtotal + accessoriesSubtotal + flatServiceFee;
    return {
      guestCount,
      subtotal,
      total,
      menuSubtotal,
      foodSubtotal: foodExtrasSubtotal
    };
  };
  useEffect(() => {
    setCurrentStep(prev => (prev > stepsConfig.length ? stepsConfig.length : prev));
  }, [stepsConfig.length]);
  const getStepValidationError = (step: number) => {
    const guestCount = parseInt(orderData.guestCount, 10) || 0;
    const hasValidGuestCount = guestCount >= MIN_GUESTS;
    const hasValidPostal = /^\d{5}$/.test(orderData.postalCode || '');
    const totals = getOrderTotals();
    const contactEmail = (orderData.contactInfo.email || '').trim();
    const contactPhone = (orderData.contactInfo.phone || '').trim();
    const companyName = (orderData.contactInfo.company || '').trim();
    const emailError = validateEmailValue(contactEmail);
    const phoneError = validatePhoneValue(contactPhone);
    const stepKey = stepsConfig[step - 1]?.key;
    const stepCategory = (stepsConfig[step - 1] as any)?.categoryKey || '';
    if (activeCategoryKeys.includes(stepCategory)) {
      const requiredCount = Math.max(0, Number(cumulativeIncludedByStep[stepKey]) || 0);
      if (requiredCount > 0) {
        const selectedCount = getCategorySelectionCount(stepCategory);
        if (selectedCount < requiredCount) {
          return language === 'DE'
            ? `Bitte mindestens ${requiredCount} Gerichte in ${stepsConfig[step - 1]?.label} waehlen.`
            : `Please select at least ${requiredCount} dishes for ${stepsConfig[step - 1]?.label}.`;
        }
      }
      return '';
    }
    switch (stepKey) {
      case 'event':
        if (!orderData.businessType) {
          return language === 'DE' ? 'Bitte Anlass waehlen.' : 'Please select an event type.';
        }
        if (!orderData.serviceType) {
          return language === 'DE' ? 'Bitte eine Leistung waehlen.' : 'Please select a service type.';
        }
        if (!orderData.eventDate) {
          return language === 'DE' ? 'Bitte Datum waehlen.' : 'Please select an event date.';
        }
        if (!orderData.eventTime) {
          return language === 'DE' ? 'Bitte Uhrzeit waehlen.' : 'Please select an event time.';
        }
        if (!hasValidGuestCount) {
          return getGuestCountError();
        }
        if (!hasValidPostal) {
          return language === 'DE'
            ? 'Bitte 5-stellige deutsche PLZ eingeben.'
            : 'Enter a 5-digit German postal code.';
        }
        return '';
      case 'menu':
        return orderData.selectedMenu
          ? ''
          : (language === 'DE' ? 'Bitte ein Menue waehlen.' : 'Please select a menu.');
      case 'accessories':
        if (!hasValidGuestCount) {
          return getGuestCountError();
        }
        if (totals.total < MIN_ORDER_TOTAL) {
          return language === 'DE'
            ? `Mindestbestellwert ${MIN_ORDER_TOTAL.toFixed(2)} erreicht nicht.`
            : `Minimum order of ${MIN_ORDER_TOTAL.toFixed(2)} required.`;
        }
        return '';
      case 'checkout':
        if (!orderData.contactInfo.firstName?.trim()) {
          return language === 'DE' ? 'Vorname ist erforderlich.' : 'First name is required.';
        }
        if (!orderData.contactInfo.lastName?.trim()) {
          return language === 'DE' ? 'Nachname ist erforderlich.' : 'Last name is required.';
        }
        if (orderData.businessType === 'business' && !companyName) {
          return language === 'DE' ? 'Firmenname ist erforderlich.' : 'Company name is required.';
        }
        if (emailError) {
          return emailError;
        }
        if (phoneError) {
          return phoneError;
        }
        if (totals.total < MIN_ORDER_TOTAL) {
          return language === 'DE'
            ? `Mindestbestellwert ${MIN_ORDER_TOTAL.toFixed(2)} erreicht nicht.`
            : `Minimum order of ${MIN_ORDER_TOTAL.toFixed(2)} required.`;
        }
        if (!orderData.paymentMethod) {
          return language === 'DE' ? 'Bitte Zahlungsmethode waehlen.' : 'Please select a payment method.';
        }
        if (!termsAccepted) {
          return language === 'DE'
            ? 'Bitte AGB und Datenschutz akzeptieren.'
            : 'Please accept the terms and privacy policy.';
        }
        if (orderData.paymentMethod === 'credit-card') {
          const { number, expiry, cvc, name } = orderData.cardDetails;
          const digitsOnly = number.replace(/\s+/g, '');
          const expiryValid = /^\d{2}\/\d{2}$/.test(expiry);
          if (!digitsOnly || digitsOnly.length < 12 || !expiryValid || cvc.length < 3 || !name.trim()) {
            return language === 'DE'
              ? 'Bitte gueltige Kartendaten eingeben.'
              : 'Please enter valid card details.';
          }
        }
        return '';
      default:
        return '';
    }
  };
  const applyValidationErrors = (step: number) => {
    const stepKey = stepsConfig[step - 1]?.key;
    if (stepKey === 'event' || stepKey === 'accessories') {
      const guestCount = parseInt(orderData.guestCount, 10) || 0;
      setGuestCountError(guestCount >= MIN_GUESTS ? '' : getGuestCountError());
      if (stepKey === 'event' && !/^\d{5}$/.test(orderData.postalCode || '')) {
        setPostalLookupError(
          language === 'DE'
            ? 'Bitte 5-stellige deutsche PLZ eingeben.'
            : 'Enter a 5-digit German postal code.'
        );
      }
    }
    if (stepKey === 'checkout') {
      const contactEmail = (orderData.contactInfo.email || '').trim();
      const contactPhone = (orderData.contactInfo.phone || '').trim();
      setContactErrors({
        email: validateEmailValue(contactEmail),
        phone: validatePhoneValue(contactPhone)
      });
      if (orderData.businessType === 'business') {
        setCompanyErrors({
          name: validateCompanyName((orderData.contactInfo.company || '').trim()),
          info: ''
        });
      } else {
        setCompanyErrors({ name: '', info: '' });
      }
      if (!termsAccepted) {
        setTermsError(
          language === 'DE'
            ? 'Bitte AGB und Datenschutz akzeptieren.'
            : 'Please accept the terms and privacy policy.'
        );
      }
    }
  };
  const getFirstInvalidStep = (maxStep: number) => {
    for (let step = 1; step <= maxStep; step += 1) {
      const error = getStepValidationError(step);
      if (error) {
        return { step, error };
      }
    }
    return null;
  };
  const validateStepsUpTo = (maxStep: number) => {
    const invalid = getFirstInvalidStep(maxStep);
    if (invalid) {
      applyValidationErrors(invalid.step);
      showNotification('error', invalid.error, 3000);
      if (invalid.step !== currentStep) {
        setCurrentStep(invalid.step);
      }
      return false;
    }
    return true;
  };
  const handleStepChange = (targetStep: number) => {
    if (targetStep <= currentStep) {
      setCurrentStep(targetStep);
      return;
    }
    if (shouldBlockProgress) {
      showNotification('error', blockedMessage, 3000);
      return;
    }
    if (!validateStepsUpTo(targetStep - 1)) {
      return;
    }
    setCurrentStep(targetStep);
  };
  const canNavigateToStep = (targetStep: number) => {
    if (targetStep <= currentStep) {
      return true;
    }
    if (shouldBlockProgress) {
      return false;
    }
    return !getFirstInvalidStep(targetStep - 1);
  };
  const canProceedToNext = !getFirstInvalidStep(currentStep);
  const renderSummaryNav = () => (
    <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-amber-200">
      <button
        onClick={prevStep}
        disabled={currentStep === 1}
        className={`px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center transition-colors ${
          currentStep === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'
        }`}
      >
        <ChevronLeft size={16} className="mr-1" />
        {t.buttons.back}
      </button>
      <button
        onClick={nextStep}
        disabled={shouldBlockProgress || !canProceedToNext}
        className={`px-5 py-2 text-sm font-semibold rounded-lg inline-flex items-center shadow-sm transition-colors ${
          shouldBlockProgress || !canProceedToNext
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-amber-600 text-white hover:bg-amber-700'
        }`}
      >
        {currentStep === stepsConfig.length ? t.buttons.confirm : t.buttons.next}
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );

  // Step 1: Event Details
  const Step1 = () => {
    const guestCountNumeric = parseInt(orderData.guestCount, 10) || 0;
    const leadTimeDays = guestCountNumeric >= 100 ? 3 : 2;
    const earliestDate = new Date();
    earliestDate.setDate(earliestDate.getDate() + leadTimeDays);
    earliestDate.setHours(0, 0, 0, 0);
    const locale = language === 'DE' ? 'de-DE' : 'en-US';
    const earliestDateLabel = earliestDate.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const constraintTemplate = leadTimeDays > 2 ? t.eventInfo.dateConstraintLarge : t.eventInfo.dateConstraint;
    const constraintText = constraintTemplate.replace('{date}', earliestDateLabel);
    const serviceOptions = t.serviceType?.options?.[orderData.businessType] || [];
    return (
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1.05fr,1fr]">
          <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t.eventType?.title}</h2>
                <p className="text-sm text-gray-500">{t.eventType?.subtitle}</p>
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-amber-500">Step 1</span>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {['business', 'private'].map((type) => {
                const option = t.eventType?.options?.[type] || {};
                return (
                <button
                  key={type}
                  onClick={() => {
                    updateOrderData('businessType', type);
                    updateOrderData('serviceType', '');
                  }}
                  className={`flex flex-col justify-between rounded-xl border-2 px-4 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                    orderData.businessType === type
                      ? 'border-amber-500 bg-amber-50 shadow-md shadow-amber-100'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{option.title}</h3>
                    <p className="text-amber-600 font-semibold text-sm">{option.subtitle}</p>
                  </div>
                </button>
              )})}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-amber-50/60 to-white p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t.serviceType?.title}</h2>
                <p className="text-sm text-gray-500">{t.serviceType?.subtitle}</p>
              </div>
              {orderData.businessType && (
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-amber-600">{orderData.businessType}</span>
              )}
            </div>
            {orderData.businessType ? (
              <div className="grid gap-3">
                {(serviceOptions || []).map((service) => (
                  <button
                    key={service.key}
                    onClick={() => {
                      updateOrderData('serviceType', service.key);
                    }}
                    className={`group flex items-center gap-4 rounded-xl border-2 px-4 py-3 text-left transition-all duration-300 hover:shadow-md ${
                      orderData.serviceType === service.key
                        ? 'border-amber-500 bg-white shadow-lg'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-amber-100 bg-amber-50/60">
                      <img
                        src={service.image}
                        alt={service.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                    <Briefcase size={24} className="text-amber-500" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600">
                {language === 'DE'
                  ? 'Bitte wÃ¤hlen Sie zuerst einen Anlass.'
                  : 'Please choose an occasion first.'}
              </div>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">{t.eventInfo.date} *</label>
              <DatePicker
                value={orderData.eventDate}
                onChange={(value) => updateOrderData('eventDate', value)}
                minDate={earliestDate}
                language={language}
                placeholder={language === 'DE' ? 'Datum waehlen' : 'Select date'}
              />
              <p className="text-xs text-gray-500">{constraintText}</p>
              {isClosedDate && (
                <p className="text-sm text-red-600">{blockedMessage}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">{t.eventInfo.time} *</label>
              <TimePicker
                value={orderData.eventTime}
                onChange={(value) => updateOrderData('eventTime', value)}
                language={language}
                placeholder={language === 'DE' ? 'Uhrzeit waehlen' : 'Select time'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">{t.eventInfo.guests} *</label>
              <input
                type="text"
                value={orderData.guestCount || ''}
                onChange={(e) => handleGuestCountChange(e.target.value)}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full px-4 py-3 text-base border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-300 bg-amber-50/60 text-gray-900 placeholder:text-gray-500 shadow-sm"
                placeholder="10"
                required
              />
              <p className="text-xs text-gray-600">{t.eventInfo.minGuests}</p>
              {guestCountError && (
                <p className="text-xs text-red-600">{guestCountError}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.eventInfo.location} *
            </label>
            <PostalCodeFields {...postalFieldProps} label="" required />
          </div>
        </div>
      </div>
    );
  };
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
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {menusData.map((menu) => {
          const steps = Array.isArray(menu.steps) ? menu.steps : [];
          const dishesAvailable = Array.isArray(menu.products)
            ? menu.products.length
            : Array.isArray(menu.menuProducts)
            ? menu.menuProducts.length
            : 0;
          const cardClassName =
            'rounded-3xl border border-gray-200 overflow-hidden transition-all duration-300 text-left bg-white shadow-sm hover:shadow-xl ' +
            (orderData.selectedMenu === menu.id
              ? 'border-amber-500 ring-2 ring-amber-200'
              : menu.isActive
              ? 'hover:border-amber-300'
              : 'bg-gray-50 opacity-70 cursor-not-allowed');
          return (
            <button
              key={menu.id}
              onClick={() => menu.isActive && updateOrderData('selectedMenu', menu.id)}
              className={cardClassName}
            >
              <div className="relative h-44 bg-gray-200">
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
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{menu.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{menu.description}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  {steps.map((step: any, index: number) => (
                    <div key={`${menu.id}-step-${index}`} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Check size={12} />
                      </span>
                      <span>{step.included} {step.label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Check size={12} />
                    </span>
                    <span>{dishesAvailable} dishes available</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 space-y-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {menu.price ? 'From £' + menu.price + '/person' : 'Custom Pricing'}
                  </div>
                  <div className="text-xs text-gray-500">Excl. VAT</div>
                  {menu.minPeople ? (
                    <div className="text-sm font-semibold text-gray-700">{menu.minPeople} Person Minimum</div>
                  ) : null}
                </div>
                <div className="pt-2">
                  <div className="w-full rounded-xl bg-amber-400/80 px-4 py-3 text-center text-sm font-semibold text-white">
                    Select Food
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
  // Step 5-9: Product Selection by Category
  const Step5 = () => {
    const stepKey = stepsConfig[currentStep - 1]?.key;
    const stepCategory = (stepsConfig[currentStep - 1] as any)?.categoryKey || '';
    const currentCategory = activeCategoryKeys.includes(stepCategory) ? stepCategory : '';
    if (!currentCategory) {
      return null;
    }
    
    const selectedMenu = menusData.find(
      m => m.id === orderData.selectedMenu || m.id === Number(orderData.selectedMenu)
    );
    const products = menuItemsData
      .filter(item => matchesStepCategory(item, currentCategory))
      .filter(item => {
        if (!selectedMenu) return true;
        const productIds = selectedMenu.products || [];
        return productIds.includes(item.id);
      });
    const includedTotal = Math.max(0, Number(includedByCategory[currentCategory]) || 0);
    const stepIncluded = Math.max(0, Number((stepsConfig[currentStep - 1] as any)?.included) || 0);
    const requiredCount = Math.max(0, Number(cumulativeIncludedByStep[stepKey]) || 0);
    const selectedCount = getCategorySelectionCount(currentCategory);
    const extraCount = Math.max(0, selectedCount - includedTotal);
    const categoryTitle = stepsConfig[currentStep - 1]?.label
      || categoryMeta[currentCategory]?.label
      || currentCategory?.charAt(0).toUpperCase() + currentCategory?.slice(1);
    const categorySubtitle = t.productSelection?.subtitles?.[currentCategory] || '';
    // Calculate totals for order overview
    const calculateSubtotal = () => {
      const menuPrice = selectedMenu?.price || 0;
      const guestCount = parseInt(orderData.guestCount) || 0;
      const foodSubtotal = getFoodExtrasSubtotal();
      const menuSubtotal = menuPrice * guestCount;
      
      return menuSubtotal + foodSubtotal;
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
          <div className="sticky top-32 rounded-2xl border border-amber-100/60 bg-white p-6 shadow-lg shadow-amber-100/40">
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
              <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-800">{t.eventInfo.date}:</span>
                  <span className="font-semibold text-gray-900">{orderData.eventDate || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-800">{t.eventInfo.guests}:</span>
                  <span className="font-semibold text-gray-900">{orderData.guestCount || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-800">{t.eventInfo.location}:</span>
                  <span className="font-semibold text-gray-900">
                    {orderData.postalCode || 'Not set'}{orderData.postalCode && orderData.city ? ` (${orderData.city})` : ''}
                  </span>
                </div>
              </div>
              
              {/* Menu Summary */}
              {selectedMenuObj && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900">{selectedMenuObj.name}</h4>
                    <span className="text-amber-700 font-bold">£{selectedMenuObj.price}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{selectedMenuObj.description}</p>
                  <div className="text-sm text-gray-800">
                    {subtotal > 0 && (
                      <div className="flex justify-between">
                        <span>Menu Total:</span>
                        <span className="font-semibold text-gray-900">£{subtotal.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Items Summary */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">Selected Items</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {activeCategoryKeys.map((key) => {
                    const items = getItemsForStepCategory(key);
                    const title = stepLabelByKey[key] || categoryMeta[key]?.label || key;
                    if (!items.length) return null;
                    return (
                      <div key={key} className="mb-3">
                        <h5 className="text-sm font-semibold text-gray-800 mb-2">{title}</h5>
                        <div className="space-y-2 pl-3">
                          {items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-800 truncate max-w-[60%]">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">x{item.quantity}</span>
                                <span className="font-semibold text-gray-900">£{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              

              {/* Included vs Extras */}
              {getCategorySummaryRows().length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">Included vs Extras</h4>
                  <div className="space-y-3">
                    {getCategorySummaryRows().map((row) => (
                      <div key={`summary-${row.key}`} className="rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800">{row.label}</span>
                          <span className="text-xs text-gray-500">Included {row.included}</span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                          <span>Selected: {row.selected}</span>
                          <span>Extras: {row.extra}</span>
                          <span className="text-right">Extras cost: £{row.extraCost.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Accessories Summary */}
              {selectedAccessories.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">Accessories</h4>
                  <div className="space-y-2">
                    {selectedAccessories.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-800">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">x{item.quantity}</span>
                          <span className="font-semibold text-gray-900">£{(item.price * item.quantity * (parseInt(orderData.guestCount) || 0)).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Totals - Fixed to show all values in orange/black */}
              <div className="pt-4 border-t border-gray-200">
                <div className="rounded-lg border border-amber-100 bg-amber-50/70 p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900 font-semibold">Menu + Extras Subtotal:</span>
                    <span className="font-bold text-amber-700">£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900 font-semibold">Extras (paid):</span>
                    <span className="font-bold text-amber-700">£{getFoodExtrasSubtotal().toFixed(2)}</span>
                  </div>
                  {selectedAccessories.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 font-semibold">Accessories:</span>
                      <span className="font-bold text-amber-700">£{accessoriesSubtotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900 font-semibold">Service Fee:</span>
                    <span className="font-bold text-amber-700">£{flatServiceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-amber-200">
                    <span>Total:</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                  {renderSummaryNav()}
                </div>
                {total < MIN_ORDER_TOTAL && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      Minimum order of £{MIN_ORDER_TOTAL.toFixed(2)} required. Add more items to continue.
                    </p>
                  </div>
                )}
              </div>
              {/* Quick Navigation */}
              {/* Quick Navigation */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">Quick Navigation</h4>
                <div className="grid grid-cols-2 gap-2">
                  {dynamicMenuSteps.map((step) => {
                    const stepIndex = stepsConfig.findIndex(s => s.key === step.key) + 1;
                    return (
                      <button
                        key={step.key}
                        onClick={() => handleStepChange(stepIndex)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentStep === stepIndex
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {step.label}
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
            {categoryTitle}
          </h2>
          {categorySubtitle && (
            <p className="text-gray-600 text-lg">
              {categorySubtitle}
            </p>
          )}
          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-amber-100 bg-amber-50/70 px-4 py-2 text-sm text-amber-700">
            <span className="font-semibold">Included (this step): {stepIncluded}</span>
            <span className="text-amber-300">|</span>
            <span className="font-semibold">Required so far: {requiredCount}</span>
            <span className="text-amber-300">|</span>
            <span className="font-semibold">Selected: {selectedCount}</span>
            <span className="text-amber-300">|</span>
            <span className={`font-semibold ${extraCount > 0 ? 'text-amber-900' : ''}`}>
              Extra: {extraCount}
            </span>
          </div>
          {extraCount > 0 && (
            <p className="mt-2 text-xs text-amber-700">Extras beyond the included count are charged.</p>
          )}
        </div>
          <div className="space-y-6">
            {products.map((product) => {
              const quantityKey = `${currentCategory}_${product.id}`;
              const quantityInOrder = getProductQuantityInOrder(currentCategory, product);
              const minQuantity = getMinOrderQuantity(product);
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
                              <div className="text-2xl font-bold text-gray-900">£{product.price}</div>
                              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Min {minQuantity}</div>
                              <div className="flex flex-wrap items-center gap-2">
                                {product.allergens.map((allergen, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                    {allergen}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setProductDetailsItem(product);
                              setProductDetailsOpen(true);
                            }}
                            className="ml-4 shrink-0 px-4 py-2 text-sm font-semibold rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                          >
                            More info
                          </button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => updateQuantity(currentCategory, product.id, currentQuantity - 1, minQuantity)}
                              className="px-4 py-2 hover:bg-gray-100 transition-colors text-black"
                              disabled={!product.available}
                            >
                              <Minus size={20} strokeWidth={2.5} className="text-black" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentQuantity}
                              onChange={(e) => updateQuantity(currentCategory, product.id, parseInt(e.target.value, 10) || 0, minQuantity)}
                              className="w-16 text-center py-2 text-xl font-bold border-x border-gray-300 bg-white text-gray-900"
                              disabled={!product.available}
                            />
                            <button
                              onClick={() => updateQuantity(currentCategory, product.id, currentQuantity + 1, minQuantity)}
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
                                  onClick={() => updateProductQuantityInOrder(currentCategory, product, quantityInOrder - 1)}
                                  className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-800 rounded-full hover:bg-red-200"
                                >
                                  <Minus size={16} strokeWidth={2.5} className="text-black" />
                                </button>
                                <button
                                  onClick={() => updateProductQuantityInOrder(currentCategory, product, quantityInOrder + 1)}
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

    const foodSubtotal = getFoodExtrasSubtotal();
    const subtotal = menuSubtotal + foodSubtotal;
    const currentSubtotal = subtotal + accessoriesSubtotal + flatServiceFee;
    const minimumOrder = MIN_ORDER_TOTAL;
    const accessoriesList = Array.isArray(t.accessories?.items) ? t.accessories.items : [];
    return (
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Overview - Right Side */}
        <div className="lg:col-span-1 lg:order-2">
          <div className="sticky top-32 rounded-2xl border border-amber-100/60 bg-white p-6 shadow-lg shadow-amber-100/40">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t.productSelection.orderSummary}</h3>
            
            <div className="space-y-6">
              {/* Event Info Summary */}
              <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-800">{t.eventInfo.date}:</span>
                  <span className="font-semibold text-gray-900">{orderData.eventDate || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-800">{t.eventInfo.guests}:</span>
                  <span className="font-semibold text-gray-900">{orderData.guestCount || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-800">{t.eventInfo.location}:</span>
                  <span className="font-semibold text-gray-900">
                    {orderData.postalCode || 'Not set'}{orderData.postalCode && orderData.city ? ` (${orderData.city})` : ''}
                  </span>
                </div>
              </div>
              
              {/* Items Summary */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">Selected Items</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {activeCategoryKeys.map((key) => {
                    const items = getItemsForStepCategory(key);
                    const title = stepLabelByKey[key] || categoryMeta[key]?.label || key;
                    if (!items.length) return null;
                    return (
                      <div key={key} className="mb-3">
                        <h5 className="text-sm font-semibold text-gray-800 mb-2">{title}</h5>
                        <div className="space-y-2 pl-3">
                          {items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-800 truncate max-w-[60%]">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">x{item.quantity}</span>
                                <span className="font-semibold text-gray-900">£{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              

              {/* Included vs Extras */}
              {getCategorySummaryRows().length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">Included vs Extras</h4>
                  <div className="space-y-3">
                    {getCategorySummaryRows().map((row) => (
                      <div key={`summary-${row.key}`} className="rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800">{row.label}</span>
                          <span className="text-xs text-gray-500">Included {row.included}</span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                          <span>Selected: {row.selected}</span>
                          <span>Extras: {row.extra}</span>
                          <span className="text-right">Extras cost: £{row.extraCost.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Accessories Summary */}
              {selectedAccessories.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">Accessories</h4>
                  <div className="space-y-2">
                    {selectedAccessories.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-800">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">x{item.quantity}</span>
                          <span className="font-semibold text-gray-900">£{(item.price * item.quantity * guestCount).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Totals - Fixed to show all values in orange/black */}
              <div className="pt-4 border-t border-gray-200">
                <div className="rounded-lg border border-amber-100 bg-amber-50/70 p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900 font-semibold">Menu + Extras Subtotal:</span>
                    <span className="font-bold text-amber-700">£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900 font-semibold">Extras (paid):</span>
                    <span className="font-bold text-amber-700">£{getFoodExtrasSubtotal().toFixed(2)}</span>
                  </div>
                  {selectedAccessories.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 font-semibold">Accessories:</span>
                      <span className="font-bold text-amber-700">£{accessoriesSubtotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900 font-semibold">Service Fee:</span>
                    <span className="font-bold text-amber-700">£{flatServiceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-amber-200">
                    <span>Total:</span>
                    <span>£{currentSubtotal.toFixed(2)}</span>
                  </div>
                  {renderSummaryNav()}
                </div>
                {currentSubtotal < minimumOrder && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      Minimum order of £{minimumOrder.toFixed(2)} required. Add more items to continue.
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
              {accessoriesList.map((accessory) => {
                const isSelected = selectedAccessories.some(item => item.id === accessory.id);
                const selectedItem = selectedAccessories.find(item => item.id === accessory.id);
                const minQuantity = getAccessoryMinQuantity(accessory);
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
                                £{accessory.price.toFixed(2)} {accessory.unit}
                              </div>
                              <div className="text-xs font-semibold text-amber-700 mt-1">
                                Min {minQuantity}
                              </div>
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
                                min={minQuantity}
                                value={selectedItem.quantity}
                                onChange={(e) => {
                                  const nextValue = parseInt(e.target.value, 10);
                                  updateAccessoryQuantity(
                                    accessory.id,
                                    Number.isFinite(nextValue) ? nextValue : minQuantity
                                  );
                                }}
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
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8">
              <button
                onClick={nextStep}
                disabled={shouldBlockProgress || !canProceedToNext}
                className={`w-full py-4 px-6 rounded-lg text-base font-semibold transition-colors ${
                  shouldBlockProgress || !canProceedToNext
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-black'
                }`}
              >
                {t.accessories.continueWithout}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // Step 11: Delivery + Payment
  const Step11 = () => (
    <div className="space-y-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Delivery & Payment
        </h2>
        <p className="text-gray-600 text-lg">
          Confirm your delivery contact and complete payment
        </p>
      </div>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-amber-100 bg-white shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <TruckIcon size={20} className="text-amber-600" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delivery Contact</h3>
                <p className="text-sm text-gray-600">Who should we reach on delivery day?</p>
              </div>
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
                    onChange={(e) => updateContactInfoField('email', e.target.value)}
                    onBlur={() => handleContactBlur('email')}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
                    placeholder="john@example.com"
                    required
                  />
                  {contactErrors.email && (
                    <p className="mt-2 text-sm text-red-600">{contactErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={orderData.contactInfo.phone}
                    onChange={(e) => updateContactInfoField('phone', e.target.value)}
                    onBlur={() => handleContactBlur('phone')}
                    inputMode="tel"
                    pattern="^\\+?[0-9\\s-]{7,15}$"
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
                    placeholder="+49 123 456 789"
                    required
                  />
                  {contactErrors.phone && (
                    <p className="mt-2 text-sm text-red-600">{contactErrors.phone}</p>
                  )}
                </div>
              </div>
              {orderData.businessType === 'business' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {language === 'DE' ? 'Firmenname *' : 'Company Name *'}
                    </label>
                    <input
                      type="text"
                      value={orderData.contactInfo.company}
                      onChange={(e) => updateCompanyName(e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
                      placeholder={language === 'DE' ? 'Firmenname' : 'Company name'}
                      required
                    />
                    {companyErrors.name && (
                      <p className="mt-2 text-sm text-red-600">{companyErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {language === 'DE' ? 'Firmeninformationen (optional)' : 'Company Information (optional)'}
                    </label>
                    <textarea
                      value={orderData.companyInfo}
                      onChange={(e) => updateCompanyInfo(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none text-gray-900 placeholder:text-gray-500"
                      placeholder={language === 'DE' ? 'z.B. Branche, Groesse, Standort' : 'e.g. industry, size, location'}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={18} className="text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900">Special Requests</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Share dietary restrictions, setup notes, or timing details.
            </p>
            <textarea
              value={orderData.specialRequests}
              onChange={(e) => updateOrderData('specialRequests', e.target.value)}
              rows="4"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none text-gray-900 placeholder:text-gray-500"
              placeholder="Any dietary restrictions or special requirements..."
            />
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <MapPinIcon size={18} className="text-amber-600" />
              <h3 className="text-lg font-bold text-gray-900">Delivery Overview</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-gray-500" />
                <span className="font-semibold">Date:</span>
                <span>{orderData.eventDate || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon size={16} className="text-gray-500" />
                <span className="font-semibold">Time:</span>
                <span>{orderData.eventTime || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <span className="font-semibold">Guests:</span>
                <span>{orderData.guestCount || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon size={16} className="text-gray-500" />
                <span className="font-semibold">Location:</span>
                <span>
                  {orderData.postalCode || 'Not set'}
                  {orderData.postalCode && orderData.city ? ` (${orderData.city})` : ''}
                </span>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-amber-200 bg-white/70 p-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-amber-600" />
                <span>Delivery windows are confirmed after payment.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-10 border-t border-amber-100">
        <Step12 />
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
    
    const foodSubtotal = getFoodExtrasSubtotal();
    const subtotal = menuSubtotal + foodSubtotal;
    const total = subtotal + accessoriesSubtotal + flatServiceFee;
    const vatRate = orderData.businessType === 'business' ? 0.19 : 0.07;
    const vatAmount = total * vatRate;
    const grandTotal = total + vatAmount;
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-amber-100 bg-white shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Lock size={20} className="text-amber-600" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
          </div>
          <p className="text-gray-600">
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
                        {orderData.guestCount || 0} {language === 'DE' ? 'GÃ¤ste' : 'guests'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-black">
                      <MapPinIcon size={16} className="text-gray-500" />
                      <span className="font-medium">
                        {orderData.postalCode || 'Not set'}{orderData.postalCode && orderData.city ? ` (${orderData.city})` : ''}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900 font-semibold">{orderData.contactInfo.firstName} {orderData.contactInfo.lastName}</p>
                    <p className="text-sm text-gray-900 font-semibold">{orderData.contactInfo.email}</p>
                    <p className="text-sm text-gray-900 font-semibold">{orderData.contactInfo.phone}</p>
                    {orderData.businessType === 'business' && orderData.contactInfo.company && (
                      <p className="text-sm text-gray-900 font-semibold">
                        {language === 'DE' ? 'Firma:' : 'Company:'} {orderData.contactInfo.company}
                      </p>
                    )}
                    {orderData.businessType === 'business' && orderData.companyInfo && (
                      <p className="text-sm text-gray-900 font-semibold">
                        {language === 'DE' ? 'Firmeninfo:' : 'Company Info:'} {orderData.companyInfo}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Price Breakdown - Fixed to show all values in orange/black */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">Price Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 font-semibold">Menu + Extras Subtotal:</span>
                      <span className="font-bold text-amber-700">£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 font-semibold">Extras (paid):</span>
                      <span className="font-bold text-amber-700">£{getFoodExtrasSubtotal().toFixed(2)}</span>
                    </div>
                    {selectedAccessories.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-900 font-semibold">Accessories:</span>
                        <span className="font-bold text-amber-700">£{accessoriesSubtotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 font-semibold">Service Fee:</span>
                      <span className="font-bold text-amber-700">£{flatServiceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 font-semibold">VAT ({(vatRate * 100).toFixed(2)}%):</span>
                      <span className="font-bold text-amber-700">£{vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                      <span>Total:</span>
                      <span>£{grandTotal.toFixed(2)}</span>
                    </div>
                    {renderSummaryNav()}
                  </div>
                </div>

                {/* Included vs Extras */}
                {getCategorySummaryRows().length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">Included vs Extras</h4>
                    <div className="space-y-3">
                      {getCategorySummaryRows().map((row) => (
                        <div key={`summary-${row.key}`} className="rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-800">{row.label}</span>
                            <span className="text-xs text-gray-500">Included {row.included}</span>
                          </div>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                            <span>Selected: {row.selected}</span>
                            <span>Extras: {row.extra}</span>
                            <span className="text-right">Extras cost: £{row.extraCost.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Security Badge */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Shield size={20} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Secure Payment</p>
                      <p className="text-xs text-green-600">SSL Encrypted â€¢ GDPR Compliant</p>
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Select Payment Method</h3>
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-[0.2em]">Step 3</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[
                      {
                        id: 'credit-card',
                        label: 'Credit Card',
                        description: 'Instant confirmation and secure checkout.',
                        icon: CreditCard,
                        badge: 'Fast'
                      },
                      {
                        id: 'paypal',
                        label: 'PayPal',
                        description: 'Use your PayPal balance or linked card.',
                        icon: null,
                        badge: 'Popular'
                      },
                      {
                        id: 'bank-transfer',
                        label: 'Bank Transfer',
                        description: 'We will display our bank details.',
                        icon: Building2,
                        badge: 'Manual'
                      }
                    ].map((method) => {
                      const isSelected = orderData.paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          onClick={() => {
                            updateOrderData('paymentMethod', method.id);
                            if (method.id === 'bank-transfer') {
                              setBankDetailsOpen(true);
                            }
                          }}
                          className={`group rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50 shadow-md shadow-amber-100'
                              : 'border-gray-200 hover:border-amber-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                                isSelected ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {method.icon ? <method.icon size={22} /> : <span className="text-sm font-bold">PP</span>}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-base font-semibold text-gray-900">{method.label}</span>
                                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                                    {method.badge}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{method.description}</p>
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle size={20} className="text-amber-600" />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                            <span>{isSelected ? 'Selected' : 'Tap to select'}</span>
                            <span className="text-amber-600 group-hover:text-amber-700">Details</span>
                          </div>
                        </button>
                      );
                    })}
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
                  <div className="flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50/70 p-4">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        if (e.target.checked) {
                          setTermsError('');
                        }
                      }}
                    />
                    <div>
                      <label htmlFor="terms" className="text-sm text-gray-900 leading-relaxed">
                        I agree to the Terms & Conditions and Privacy Policy. I understand that this order is subject to our cancellation policy (48 hours notice for full refund).
                      </label>
                      <button
                        type="button"
                        onClick={() => setTermsModalOpen(true)}
                        className="mt-2 text-xs font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-4"
                      >
                        Read full Terms and Conditions
                      </button>
                    </div>
                  </div>
                  {termsError && (
                    <p className="mt-2 text-sm text-red-600">{termsError}</p>
                  )}
                </div>
                {orderBlocked && (
                  <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {blockedMessage}
                  </div>
                )}
                {/* Submit Button */}
                <button
                  onClick={() => {
                    if (!validateStepsUpTo(stepsConfig.length)) {
                      return;
                    }
                    handleSubmitOrder();
                  }}
                  disabled={orderBlocked}
                  className="w-full mt-6 bg-amber-600 text-white py-4 px-6 rounded-lg text-base font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Lock size={20} />
                  Pay £{grandTotal.toFixed(2)} Securely
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
    if (shouldBlockProgress) {
      showNotification('error', blockedMessage, 3000);
      return;
    }
    if (!validateStepsUpTo(currentStep)) {
      return;
    }
    if (currentStep === stepsConfig.length) {
      handleSubmitOrder();
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, stepsConfig.length));
  };
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  const getMinOrderQuantity = (product) => {
    const minValue = Number(product?.minOrderQuantity);
    return Number.isFinite(minValue) && minValue > 0 ? minValue : 5;
  };
  const getAccessoryMinQuantity = (accessory) => Math.max(1, Number(accessory?.minQuantity) || 1);
  const updateQuantity = (category, productId, quantity, minQuantity = 1) => {
    const parsedQuantity = Number.isFinite(quantity) ? quantity : 0;
    const clamped = parsedQuantity <= 0 ? 0 : Math.max(minQuantity, parsedQuantity);
    setQuantities(prev => ({
      ...prev,
      [`${category}_${productId}`]: clamped
    }));
  };
  const showNotification = (type: 'success' | 'error', message: string, duration = 2500) => {
    setNotification({ type, message });
    if (duration > 0) {
      setTimeout(() => setNotification(null), duration);
    }
  };
  const getSelectionKey = (categoryKey: string, product?: any) => {
    const normalizedProductCategory = normalizeCategoryValue(product?.category);
    return selectionKeyByCategory[normalizedProductCategory]
      || selectionKeyByCategory[categoryKey]
      || '';
  };
  const addProductToOrder = (category, product) => {
    const quantityKey = `${category}_${product.id}`;
    const minQuantity = getMinOrderQuantity(product);
    const requestedQuantity = quantities[quantityKey] || 0;
    const quantity = requestedQuantity <= 0 ? minQuantity : Math.max(minQuantity, requestedQuantity);
    const productWithQuantity = { ...product, quantity, category };
    
    const categoryKey = getSelectionKey(category, product);
    if (!categoryKey) return;
    const updatedSelection = orderData[categoryKey]?.filter(p => p.id !== product.id) || [];
    updateOrderData(categoryKey, [...updatedSelection, productWithQuantity]);
    setQuantities(prev => ({ ...prev, [quantityKey]: 0 }));
  };
  const getProductQuantityInOrder = (category, product) => {
    const categoryKey = getSelectionKey(category, product);
    if (!categoryKey) return 0;
    const selected = orderData[categoryKey]?.find(p => p.id === product.id);
    return selected ? selected.quantity : 0;
  };
  const updateProductQuantityInOrder = (category, product, newQuantity) => {
    const categoryKey = getSelectionKey(category, product);
    if (!categoryKey) return;
    const selectedProduct = orderData[categoryKey]?.find(p => p.id === product.id);
    const minQuantity = getMinOrderQuantity(selectedProduct);
    if (newQuantity <= 0 || newQuantity < minQuantity) {
      const updatedSelection = orderData[categoryKey]?.filter(p => p.id !== product.id) || [];
      updateOrderData(categoryKey, updatedSelection);
      return;
    }
    const updatedSelection = orderData[categoryKey]?.map(item =>
      item.id === product.id ? { ...item, quantity: newQuantity } : item
    ) || [];
    
    updateOrderData(categoryKey, updatedSelection);
  };
  const toggleAccessory = (accessory) => {
    const minQuantity = getAccessoryMinQuantity(accessory);
    setSelectedAccessories(prev => {
      if (prev.some(item => item.id === accessory.id)) {
        return prev.filter(item => item.id !== accessory.id);
      }
      return [...prev, { ...accessory, quantity: minQuantity }];
    });
  };
  const updateAccessoryQuantity = (id, quantity) => {
    setSelectedAccessories(prev => {
      const current = prev.find(item => item.id === id);
      const minQuantity = getAccessoryMinQuantity(current);
      const parsedQuantity = Number.isFinite(quantity) ? quantity : minQuantity;
      if (parsedQuantity <= 0) {
        return prev.filter(item => item.id !== id);
      }
      const clamped = Math.max(minQuantity, parsedQuantity);
      return prev.map(item => item.id === id ? { ...item, quantity: clamped } : item);
    });
  };
  const handleSubmitOrder = async () => {
    // Check if ordering is paused
    if (systemStatus?.orderingPaused) {
      showNotification('error', language === 'DE'
        ? 'Bestellungen sind aktuell pausiert. Bitte spaeter erneut versuchen.'
        : 'Ordering is currently paused. Please try again later.', 3000);
      return;
    }
    if (isClosedDate) {
      showNotification('error', language === 'DE'
        ? 'Das ausgewaehlte Datum ist geschlossen. Bitte waehlen Sie ein anderes Datum.'
        : 'The selected date is closed. Please choose another date.', 3000);
      return;
    }
    const contactEmail = (orderData.contactInfo.email || '').trim();
    const contactPhone = (orderData.contactInfo.phone || '').trim();
    const emailError = validateEmailValue(contactEmail);
    const phoneError = validatePhoneValue(contactPhone);
    setContactErrors({ email: emailError, phone: phoneError });
    if (emailError || phoneError) {
      showNotification('error', language === 'DE'
        ? 'Bitte gueltige Kontaktdaten angeben.'
        : 'Please provide valid contact details.', 3000);
      return;
    }
    const companyName = (orderData.contactInfo.company || '').trim();
    const companyInfo = (orderData.companyInfo || '').trim();
    const baseRequests = (orderData.specialRequests || '').trim();
    const companyDetailParts = [];
    if (orderData.businessType === 'business') {
      if (companyName) companyDetailParts.push(`Company: ${companyName}`);
      if (companyInfo) companyDetailParts.push(`Company Info: ${companyInfo}`);
    }
    const companyDetails = companyDetailParts.join('\n');
    const mergedRequests = [companyDetails, baseRequests].filter(Boolean).join('\n\n');
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
    
    const foodSubtotal = getFoodExtrasSubtotal();
    const subtotal = menuSubtotal + foodSubtotal;
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
        contactEmail,
        phone: contactPhone,
        eventType: orderData.serviceType || orderData.businessType || 'Custom',
        eventDate: orderData.eventDate || new Date().toISOString(),
        eventTime: orderData.eventTime || '',
        guests: guestCount,
        location: orderData.location || orderData.postalCode || '',
        menuTier: orderData.menuTier,
        specialRequests: mergedRequests,
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
    const stepKey = stepsConfig[currentStep - 1]?.key;
    const stepCategory = (stepsConfig[currentStep - 1] as any)?.categoryKey || '';
    if (stepKey === 'event') return Step1;
    if (stepKey === 'menu') return Step4;
    if (stepKey === 'accessories') return Step10;
    if (stepKey === 'checkout') return Step11;
    if (activeCategoryKeys.includes(stepCategory)) return Step5;
    return Step1;
  };
  const renderCurrentStep = getStepComponent();
  const currentStepKey = stepsConfig[currentStep - 1]?.key;
  const currentStepCategory = (stepsConfig[currentStep - 1] as any)?.categoryKey || '';
  useEffect(() => {
    if (!currentStepCategory || !activeCategoryKeys.includes(currentStepCategory)) return;
    const includedTotal = Math.max(0, Number(includedByCategory[currentStepCategory]) || 0);
    const selectedCount = getCategorySelectionCount(currentStepCategory);
    const extraCount = Math.max(0, selectedCount - includedTotal);
    const previous = extraNoticeRef.current[currentStepCategory] || 0;
    if (includedTotal > 0 && previous === 0 && extraCount > 0) {
      const label = stepsConfig[currentStep - 1]?.label
        || categoryMeta[currentStepCategory]?.label
        || currentStepCategory?.charAt(0).toUpperCase() + currentStepCategory?.slice(1);
      setExtraNoticeData({ label, extra: extraCount });
      setExtraNoticeOpen(true);
    }
    extraNoticeRef.current[currentStepCategory] = extraCount;
  }, [
    currentStepCategory,
    activeCategoryKeys,
    includedByCategory,
    stepsConfig,
    categoryMeta,
    orderData.selectedStarters,
    orderData.selectedMains,
    orderData.selectedSides,
    orderData.selectedDesserts,
    orderData.selectedDrinks
  ]);
  const showHeaderNav = !currentStepKey
    || currentStepKey === 'event'
    || currentStepKey === 'menu'
    || (activeCategoryKeys.includes(currentStepCategory) && !orderSummaryVisible);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`px-4 py-3 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {notification.message}
          </div>
        </div>
      )}
      {termsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Terms and Conditions</h3>
              <button
                type="button"
                onClick={() => setTermsModalOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 max-h-[65vh] overflow-y-auto text-sm text-gray-700 leading-relaxed space-y-4">
              <p>
                Please review the full terms below. These terms are provided for convenience and should be updated to match your official policy.
              </p>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Booking and Payment</h4>
                <p>
                  Orders are confirmed once payment is received. Prices include the selected items and services listed in your order summary.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Cancellations</h4>
                <p>
                  Cancellations made at least 48 hours before the scheduled event are eligible for a full refund. Late cancellations may be subject to fees.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Delivery</h4>
                <p>
                  Delivery windows are confirmed after payment and may vary based on scheduling availability and location.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Privacy</h4>
                <p>
                  We only use your information to fulfill your order and communicate about your event. Please contact us for data requests.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setTermsModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {bankDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Bank Transfer Details</h3>
              <button
                type="button"
                onClick={() => setBankDetailsOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 text-sm text-gray-700">
              <div className="rounded-lg border border-amber-100 bg-amber-50/70 p-4">
                <p className="font-semibold text-gray-900">Please use these details for your transfer:</p>
                <p className="mt-2 text-xs text-gray-600">Use your order ID as the payment reference.</p>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <span className="text-gray-500">Account Name</span>
                  <span className="font-semibold text-gray-900">La Cannelle Catering</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <span className="text-gray-500">IBAN</span>
                  <span className="font-semibold text-gray-900">DE00 0000 0000 0000 0000 00</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <span className="text-gray-500">BIC/SWIFT</span>
                  <span className="font-semibold text-gray-900">DEUTDEFFXXX</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <span className="text-gray-500">Bank</span>
                  <span className="font-semibold text-gray-900">Your Bank Name</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setBankDetailsOpen(false)}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {productDetailsOpen && productDetailsItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Product details</h3>
              <button
                type="button"
                onClick={() => {
                  setProductDetailsOpen(false);
                  setProductDetailsItem(null);
                }}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-5">
              <div className="grid gap-5 md:grid-cols-[180px,1fr]">
                <div className="w-full h-40 rounded-xl bg-gray-100 overflow-hidden">
                  {productDetailsItem.image ? (
                    <img
                      src={productDetailsItem.image}
                      alt={productDetailsItem.name || 'Product image'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center text-gray-500 text-sm">
                      No image
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{productDetailsItem.name}</h4>
                    <p className="text-gray-600 mt-2">{productDetailsItem.description || 'No description available.'}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    <div className="rounded-lg border border-gray-200 p-3">
                      <p className="text-gray-500">Price</p>
                      <p className="text-base font-semibold text-gray-900">£{productDetailsItem.price}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3">
                      <p className="text-gray-500">Minimum order</p>
                      <p className="text-base font-semibold text-gray-900">{getMinOrderQuantity(productDetailsItem)}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3">
                      <p className="text-gray-500">Preparation time</p>
                      <p className="text-base font-semibold text-gray-900">
                        {productDetailsItem.preparationTime ? `${productDetailsItem.preparationTime} min` : 'Not specified'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3">
                      <p className="text-gray-500">Availability</p>
                      <p className="text-base font-semibold text-gray-900">
                        {productDetailsItem.available ? 'Available' : 'Not available'}
                      </p>
                    </div>
                  </div>
                  {Array.isArray(productDetailsItem.ingredients) && productDetailsItem.ingredients.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Ingredients</p>
                      <div className="flex flex-wrap gap-2">
                        {productDetailsItem.ingredients.map((ingredient, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {Array.isArray(productDetailsItem.allergens) && productDetailsItem.allergens.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Allergens</p>
                      <div className="flex flex-wrap gap-2">
                        {productDetailsItem.allergens.map((allergen, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded">
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setProductDetailsOpen(false);
                  setProductDetailsItem(null);
                }}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {extraNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Extras notice</h3>
              <button
                type="button"
                onClick={() => setExtraNoticeOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 text-sm text-gray-700 space-y-3">
              <p>
                You have selected more dishes than the included amount for <span className="font-semibold">{extraNoticeData.label}</span>.
              </p>
              <div className="rounded-lg border border-amber-100 bg-amber-50/70 p-4">
                <p className="text-sm text-amber-800 font-semibold">Extra dishes: {extraNoticeData.extra}</p>
                <p className="text-xs text-amber-700 mt-1">Extras will be added to your total.</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setExtraNoticeOpen(false)}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700"
              >
                Ok, got it
              </button>
            </div>
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
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Language Row */}
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
            </div>
          </div>
          
          {/* Steps Progress Bar */}
          <div className="border-t border-gray-100 pt-2 pb-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-900">
                {stepsConfig[currentStep - 1]?.label}
              </span>
              {showHeaderNav && (
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
                    disabled={shouldBlockProgress || !canProceedToNext}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors inline-flex items-center shadow-sm ${
                      shouldBlockProgress || !canProceedToNext
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                  >
                    {currentStep === stepsConfig.length ? t.buttons.confirm : t.buttons.next}
                    <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
              )}
            </div>
            {/* Steps Navigation */}
            <div className="flex items-center justify-center gap-2 px-2 flex-nowrap overflow-hidden">
              {stepsConfig.map((step, index) => {
                const stepNumber = index + 1;
                const isCurrent = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                const canNavigate = canNavigateToStep(stepNumber);
                return (
                  <React.Fragment key={step.key}>
                    <button
                      type="button"
                      onClick={() => handleStepChange(stepNumber)}
                      disabled={!canNavigate}
                      className={`flex flex-col items-center min-w-0 px-1 transition-all duration-300 ${
                        !canNavigate ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-1 transition-colors ${
                          isCompleted
                            ? 'border-amber-500 bg-amber-500'
                            : 'border-amber-500 bg-white'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <span
                        className={`hidden sm:block text-[11px] font-semibold text-center whitespace-nowrap ${
                          isCurrent || isCompleted ? 'text-amber-600' : 'text-gray-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </button>
                    {index < stepsConfig.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 min-w-[50px] max-w-[130px] rounded-full transition-colors duration-300 ${
                          stepNumber < currentStep ? 'bg-amber-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <main className="flex-1">
        <div className="pt-48 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {orderBlocked && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {blockedMessage}
              </div>
            )}
            <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {renderCurrentStep ? renderCurrentStep() : null}
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







