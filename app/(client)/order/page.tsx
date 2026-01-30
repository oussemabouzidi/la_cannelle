"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { ordersApi } from '@/lib/api/orders';
import { menusApi } from '@/lib/api/menus';
import { productsApi } from '@/lib/api/products';
import { accessoriesApi } from '@/lib/api/accessories';
import { systemApi, type ClosedDate } from '@/lib/api/system';
import { servicesApi, type Service } from '@/lib/api/services';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { commonTranslations } from '@/lib/translations/common';
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
  FileText, Shield as ShieldIcon, Receipt, FileText as FileInvoice
} from 'lucide-react';

// ============================================================================
// CONSTANTS & UTILITY FUNCTIONS (Outside components)
// ============================================================================

const GERMAN_STATES = [
  { code: 'BW', nameEn: 'Baden-Wuerttemberg', nameDe: 'Baden-Württemberg' },
  { code: 'BY', nameEn: 'Bavaria', nameDe: 'Bayern' },
  { code: 'BE', nameEn: 'Berlin', nameDe: 'Berlin' },
  { code: 'BB', nameEn: 'Brandenburg', nameDe: 'Brandenburg' },
  { code: 'HB', nameEn: 'Bremen', nameDe: 'Bremen' },
  { code: 'HH', nameEn: 'Hamburg', nameDe: 'Hamburg' },
  { code: 'HE', nameEn: 'Hesse', nameDe: 'Hessen' },
  { code: 'MV', nameEn: 'Mecklenburg-Vorpommern', nameDe: 'Mecklenburg-Vorpommern' },
  { code: 'NI', nameEn: 'Lower Saxony', nameDe: 'Niedersachsen' },
  { code: 'NW', nameEn: 'North Rhine-Westphalia', nameDe: 'Nordrhein-Westfalen' },
  { code: 'RP', nameEn: 'Rhineland-Palatinate', nameDe: 'Rheinland-Pfalz' },
  { code: 'SL', nameEn: 'Saarland', nameDe: 'Saarland' },
  { code: 'SN', nameEn: 'Saxony', nameDe: 'Sachsen' },
  { code: 'ST', nameEn: 'Saxony-Anhalt', nameDe: 'Sachsen-Anhalt' },
  { code: 'SH', nameEn: 'Schleswig-Holstein', nameDe: 'Schleswig-Holstein' },
  { code: 'TH', nameEn: 'Thuringia', nameDe: 'Thüringen' },
];

const MIN_GUESTS = 10;

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

const buildTimeSlots = (intervalMinutes = 15) => {
  const slots: string[] = [];
  for (let total = 0; total < 24 * 60; total += intervalMinutes) {
    const hour = String(Math.floor(total / 60)).padStart(2, '0');
    const minute = String(total % 60).padStart(2, '0');
    slots.push(`${hour}:${minute}`);
  }
  return slots;
};

const normalizeCategoryValue = (value?: string) => (
  value ? value.toLowerCase().replace(/[^a-z]/g, '') : ''
);

const categoryOrder = ['starter', 'main', 'side', 'dessert', 'beverage'];
const stepCategoryKeys = [
  'starter', 'main', 'side', 'dessert', 'beverage',
  'fingerfood', 'canape', 'appetizer', 'salad', 'soup', 'pasta', 'seafood', 'meat',
  'vegetarian', 'vegan', 'glutenfree', 'dairyfree', 'spicy', 'signature', 'seasonal',
  'kidfriendly', 'chefspecial', 'tapas', 'bbq', 'breakfast', 'brunch'
];

// ============================================================================
// EXTRACTED COMPONENTS (Outside OrderPage)
// ============================================================================

declare global {
  interface Window {
    __lacannelleTurnstileSuccess?: (token: string) => void;
    __lacannelleTurnstileExpired?: () => void;
    __lacannelleTurnstileError?: () => void;
  }
}

const TurnstileWidget = ({
  siteKey,
  onToken,
  onExpire,
  onError,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
}) => {
  useEffect(() => {
    window.__lacannelleTurnstileSuccess = (token: string) => onToken(token);
    window.__lacannelleTurnstileExpired = () => onExpire();
    window.__lacannelleTurnstileError = () => onError();

    return () => {
      delete window.__lacannelleTurnstileSuccess;
      delete window.__lacannelleTurnstileExpired;
      delete window.__lacannelleTurnstileError;
    };
  }, [onToken, onExpire, onError]);

  return (
    <div className="space-y-2">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-callback="__lacannelleTurnstileSuccess"
        data-expired-callback="__lacannelleTurnstileExpired"
        data-error-callback="__lacannelleTurnstileError"
      />
    </div>
  );
};

// DatePicker Component
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

// TimePicker Component
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
              {language === 'DE' ? 'Keine Zeiten verfügbar.' : 'No times available.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// PostalCodeFields Component
const PostalCodeFields = ({
  label,
  required,
  isDE,
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
}: any) => (
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
              {state.code} - {isDE ? state.nameDe : state.nameEn}
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
          {cityLookupOptions.map((option: any) => (
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

// ============================================================================
// MAIN ORDERPAGE COMPONENT
// ============================================================================

export default function OrderPage() {
  const router = useRouter();
  const { t, language, toggleLanguage, setLanguage: setAppLanguage } = useTranslation('order');
  const commonA11y = commonTranslations[language].accessibility;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
  const isCaptchaEnabled = Boolean(turnstileSiteKey);
  
  // ============================================================================
  // STATE HOOKS (All at top level, unconditional)
  // ============================================================================
  const [currentStep, setCurrentStep] = useState(1);
  const [currentMenuSubStep, setCurrentMenuSubStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [selectedAccessories, setSelectedAccessories] = useState<any[]>([]);
  const [accessoryDraftQuantities, setAccessoryDraftQuantities] = useState<Record<number, number>>({});
  const [orderSummaryVisible, setOrderSummaryVisible] = useState(true);
  const [menusData, setMenusData] = useState<any[]>([]);
  const [menuItemsData, setMenuItemsData] = useState<any[]>([]);
  const [accessoriesData, setAccessoriesData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>({
    businessType: '',
    serviceType: '',
    serviceId: '',
    eventDate: '',
    eventTime: '',
    guestCount: '',
    location: '',
    selectedMenu: '',
    selectedFingerfoods: [],
    selectedStarters: [],
    selectedSoups: [],
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
  const [pendingMenuId, setPendingMenuId] = useState<number | ''>('');
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [closedDates, setClosedDates] = useState<ClosedDate[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [contactErrors, setContactErrors] = useState({ email: '', phone: '' });
  const [companyErrors, setCompanyErrors] = useState({ name: '', info: '' });
  const [guestCountError, setGuestCountError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [bankDetailsOpen, setBankDetailsOpen] = useState(false);
  const [productDetailsOpen, setProductDetailsOpen] = useState(false);
  const [productDetailsItem, setProductDetailsItem] = useState<any>(null);
  const [extraNoticeOpen, setExtraNoticeOpen] = useState(false);
  const [extraNoticeData, setExtraNoticeData] = useState({ label: '', extra: 0 });
  const [minPeoplePromptOpen, setMinPeoplePromptOpen] = useState(false);
  const [minPeoplePromptMenu, setMinPeoplePromptMenu] = useState<any>(null);
  const [minPeoplePromptGuestCount, setMinPeoplePromptGuestCount] = useState<number>(0);
  const [postalLookupError, setPostalLookupError] = useState('');
  const [postalLookupLoading, setPostalLookupLoading] = useState(false);
  const [cityLookupOptions, setCityLookupOptions] = useState<any[]>([]);
  const [cityLookupError, setCityLookupError] = useState('');
  const [cityLookupLoading, setCityLookupLoading] = useState(false);
  const [showMenuSelection, setShowMenuSelection] = useState(!orderData.selectedMenu && !pendingMenuId);
  
  const extraNoticeRef = useRef<Record<string, number>>({});
  const hasLoadedInitialMenus = useRef(false);
  
  // ============================================================================
  // MEMOIZED VALUES (All at top level, unconditional)
  // ============================================================================
  
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const ui = useMemo(() => {
    const isDE = language === 'DE';
    return {
      close: isDE ? 'Schließen' : 'Close',
      moreInfo: isDE ? 'Mehr Infos' : 'More info',
      noImage: isDE ? 'Kein Bild' : 'No image',
      notAvailable: isDE ? 'Nicht verfügbar' : 'Not Available',
      addToOrder: isDE ? 'Zur Bestellung hinzufügen' : 'Add to Order',
      updateOrder: isDE ? 'Bestellung aktualisieren' : 'Update Order',
      remove: isDE ? 'Entfernen' : 'Remove',
      dishesAvailable: isDE ? 'Gerichte verfügbar' : 'dishes available',
      fromPerGuest: (price: any) => isDE ? `Ab €${price}/Gast` : `From €${price}/guest`,
      customPricing: isDE ? 'Preis auf Anfrage' : 'Custom Pricing',
      exclVat: isDE ? 'zzgl. MwSt.' : 'Excl. VAT',
      guestMinimum: (count: any) => isDE ? `${count} Gäste Minimum` : `${count} Guest Minimum`,
      selectFood: isDE ? 'Speisen auswählen' : 'Select Food',
      optionalAccessoriesTitle: isDE ? 'Optionales Zubehör' : 'Optional Accessories',
      optionalAccessoriesSubtitle: isDE
        ? 'Wählen Sie Teller, Besteck und weiteres Zubehör für Ihr Event'
        : 'Select plates, cutlery, and other accessories for your event',
      optionalAccessoriesHint: isDE
        ? 'Keine Auswahl erforderlich – wählen Sie nur, was Sie brauchen'
        : 'No selection required - choose only what you need',
      continueWithoutAccessories: isDE ? 'Weiter ohne Zubehör' : 'Continue without accessories',
      deliveryPaymentTitle: isDE ? 'Lieferung & Zahlung' : 'Delivery & Payment',
      deliveryPaymentSubtitle: isDE
        ? 'Bestätigen Sie Ihre Lieferdaten und schließen Sie die Zahlung ab'
        : 'Confirm your delivery contact and complete payment',
      deliveryContactTitle: isDE ? 'Lieferkontakt' : 'Delivery Contact',
      deliveryContactSubtitle: isDE ? 'Wen sollen wir am Liefertag erreichen?' : 'Who should we reach on delivery day?',
      productDetailsTitle: isDE ? 'Produktdetails' : 'Product details',
      noDescription: isDE ? 'Keine Beschreibung verfügbar.' : 'No description available.',
      price: isDE ? 'Preis' : 'Price',
      notSpecified: isDE ? 'Nicht angegeben' : 'Not specified',
      availability: isDE ? 'Verfügbarkeit' : 'Availability',
      available: isDE ? 'Verfügbar' : 'Available',
      notAvailableShort: isDE ? 'Nicht verfügbar' : 'Not available',
      ingredients: isDE ? 'Zutaten' : 'Ingredients',
      allergens: isDE ? 'Allergene' : 'Allergens',
      bankTransferTitle: isDE ? 'Banküberweisung' : 'Bank Transfer Details',
      bankTransferIntro: isDE ? 'Bitte nutzen Sie diese Daten für Ihre Überweisung:' : 'Please use these details for your transfer:',
      bankTransferReference: isDE ? 'Verwenden Sie Ihre Bestellnummer als Verwendungszweck.' : 'Use your order ID as the payment reference.',
      accountName: isDE ? 'Kontoinhaber' : 'Account Name',
      bank: isDE ? 'Bank' : 'Bank',
      yourBankName: isDE ? 'Ihre Bank' : 'Your Bank Name',
      invoiceTitle: isDE ? 'Rechnung' : 'Invoice',
      invoiceDescription: isDE 
        ? 'Sie erhalten eine Rechnung per E-Mail innerhalb von 24 Stunden nach Ihrer Bestellung.'
        : 'You will receive an invoice via email within 24 hours of placing your order.',
      invoiceTerms: isDE 
        ? 'Zahlbar innerhalb von 14 Tagen nach Erhalt der Rechnung.'
        : 'Payable within 14 days of receiving the invoice.',
      confirmOrder: isDE ? 'Bestellung bestätigen' : 'Confirm Order',
      orderSubmitted: isDE ? 'Bestellung abgeschickt' : 'Order Submitted',
      orderSubmittedMessage: isDE
        ? 'Vielen Dank! Ihre Bestellung wurde erhalten. Sie erhalten in Kürze eine Bestätigungs-E-Mail mit allen Details.'
        : 'Thank you! Your order has been received. You will receive a confirmation email shortly with all the details.',
      paymentMethod: isDE ? 'Zahlungsmethode' : 'Payment Method',
    };
  }, [language]);
  
  const postalCopy = useMemo(() => ({
    state: language === 'DE' ? 'Bundesland' : 'State',
    statePlaceholder: language === 'DE' ? 'Bundesland wählen' : 'Select state',
    city: language === 'DE' ? 'Stadt' : 'City',
    cityPlaceholder: language === 'DE' ? 'z.B. Berlin' : 'e.g. Berlin',
    findPostal: language === 'DE' ? 'PLZ suchen' : 'Find postal codes',
    searching: language === 'DE' ? 'Suche...' : 'Searching...',
    selectPostal: language === 'DE' ? 'Postleitzahl wählen' : 'Select postal code',
    postalCode: language === 'DE' ? 'Postleitzahl' : 'Postal Code',
    postalPlaceholder: language === 'DE' ? 'z.B. 10115' : 'e.g. 10115',
    germanyOnly: language === 'DE' ? 'Nur Deutschland (5-stellig).' : 'Germany only (5 digits).',
    checking: language === 'DE' ? 'Prüfe...' : 'Checking...'
  }), [language]);
  
  const categoryMeta = useMemo(() => ({
    starter: { label: t.productSelection?.starters || 'Starters', icon: Utensils, color: 'text-green-600' },
    main: { label: t.productSelection?.mains || 'Mains', icon: Coffee, color: 'text-red-600' },
    side: { label: t.productSelection?.sides || 'Sides', icon: Utensils, color: 'text-amber-600' },
    dessert: { label: t.productSelection?.desserts || 'Desserts', icon: Cookie, color: 'text-pink-600' },
    beverage: { label: t.productSelection?.drinks || 'Drinks', icon: Wine, color: 'text-blue-600' },
    fingerfood: { label: language === 'DE' ? 'Fingerfood' : 'Finger Food', icon: Utensils, color: 'text-amber-700' },
    canape: { label: language === 'DE' ? 'Canape' : 'Canape', icon: Utensils, color: 'text-amber-700' },
    appetizer: { label: language === 'DE' ? 'Vorspeise' : 'Appetizer', icon: Utensils, color: 'text-amber-700' },
    salad: { label: language === 'DE' ? 'Salat' : 'Salad', icon: Leaf, color: 'text-green-700' },
    soup: { label: language === 'DE' ? 'Suppe' : 'Soup', icon: Utensils, color: 'text-orange-600' },
    pasta: { label: language === 'DE' ? 'Pasta' : 'Pasta', icon: Utensils, color: 'text-orange-700' },
    seafood: { label: language === 'DE' ? 'Meeresfrüchte' : 'Seafood', icon: Fish, color: 'text-sky-600' },
    meat: { label: language === 'DE' ? 'Fleisch' : 'Meat', icon: Beef, color: 'text-red-700' },
    vegetarian: { label: language === 'DE' ? 'Vegetarisch' : 'Vegetarian', icon: Leaf, color: 'text-green-700' },
    vegan: { label: language === 'DE' ? 'Vegan' : 'Vegan', icon: Leaf, color: 'text-emerald-700' },
    glutenfree: { label: language === 'DE' ? 'Glutenfrei' : 'Gluten-Free', icon: Wheat, color: 'text-amber-700' },
    dairyfree: { label: language === 'DE' ? 'Laktosefrei' : 'Dairy-Free', icon: Milk, color: 'text-indigo-600' },
    spicy: { label: language === 'DE' ? 'Scharf' : 'Spicy', icon: AlertCircle, color: 'text-red-600' },
    signature: { label: language === 'DE' ? 'Signature' : 'Signature', icon: Award, color: 'text-amber-600' },
    seasonal: { label: language === 'DE' ? 'Saisonal' : 'Seasonal', icon: Sparkles, color: 'text-amber-600' },
    kidfriendly: { label: language === 'DE' ? 'Kinderfreundlich' : 'Kid-Friendly', icon: Heart, color: 'text-pink-600' },
    chefspecial: { label: language === 'DE' ? 'Chef-Special' : 'Chef-Special', icon: Star, color: 'text-amber-600' },
    tapas: { label: 'Tapas', icon: Utensils, color: 'text-amber-700' },
    bbq: { label: language === 'DE' ? 'BBQ' : 'BBQ', icon: Utensils, color: 'text-red-700' },
    breakfast: { label: language === 'DE' ? 'Frühstück' : 'Breakfast', icon: Egg, color: 'text-yellow-700' },
    brunch: { label: language === 'DE' ? 'Brunch' : 'Brunch', icon: Egg, color: 'text-yellow-700' }
  }), [t, language]);
  
  // ============================================================================
  // EFFECT HOOKS (All at top level, unconditional)
  // ============================================================================
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  useEffect(() => {
    const isAnyModalOpen = termsModalOpen || bankDetailsOpen || productDetailsOpen || extraNoticeOpen || minPeoplePromptOpen;
    if (!isAnyModalOpen) return;
    if (typeof document === 'undefined') return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [termsModalOpen, bankDetailsOpen, productDetailsOpen, extraNoticeOpen, minPeoplePromptOpen]);
  
  useEffect(() => {
    if (orderData.businessType !== 'business') {
      setCompanyErrors({ name: '', info: '' });
    }
  }, [orderData.businessType]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [menus, products, accessories, status, dates, services] = await Promise.all([
          menusApi.getMenus({ isActive: true, includeImages: true }),
          productsApi.getProducts({ available: true }),
          accessoriesApi.getAccessories({ isActive: true }),
          systemApi.getSystemStatus(),
          systemApi.getClosedDates(),
          servicesApi.getServices({ isActive: true })
        ]);
        
        const normalizeMenus = (menus: any[]) =>
          (menus || []).map((menu: any) => ({
            ...menu,
            products: menu?.menuProducts ? menu.menuProducts.map((mp: any) => mp.productId) : menu?.products || [],
            serviceIds: menu?.menuServices ? menu.menuServices.map((ms: any) => ms.serviceId) : menu?.serviceIds || [],
            services: menu?.menuServices ? menu.menuServices.map((ms: any) => ms.service) : menu?.services || []
          }));
          
        const normalizedMenus = normalizeMenus(menus || []);
        const normalizedProducts = (products || []).map((product: any) => {
          const stepCategory = normalizeMenuStepKey(product?.category) || normalizeCategoryValue(product?.category);
          return {
            ...product,
            category: stepCategory || product?.category,
            menus: product?.menuProducts
              ? product.menuProducts.map((mp: any) => mp.menuId)
              : product?.menus || []
          };
        });
        
        setMenusData(normalizedMenus);
        hasLoadedInitialMenus.current = true;
        setMenuItemsData(normalizedProducts);
        setAccessoriesData(accessories || []);
        setServicesData(services || []);
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
  
  useEffect(() => {
    if (!hasLoadedInitialMenus.current) return;

    const fetchMenusForService = async () => {
      try {
        const serviceId = orderData.serviceId ? Number(orderData.serviceId) : undefined;
        const menus = await menusApi.getMenus({ isActive: true, serviceId, includeImages: true });
        
        const normalizeMenus = (menus: any[]) =>
          (menus || []).map((menu: any) => ({
            ...menu,
            products: menu?.menuProducts ? menu.menuProducts.map((mp: any) => mp.productId) : menu?.products || [],
            serviceIds: menu?.menuServices ? menu.menuServices.map((ms: any) => ms.serviceId) : menu?.serviceIds || [],
            services: menu?.menuServices ? menu.menuServices.map((ms: any) => ms.service) : menu?.services || []
          }));
          
        const normalizedMenus = normalizeMenus(menus || []);
        setMenusData(normalizedMenus);

        if (orderData.selectedMenu) {
          const selectedId = Number(orderData.selectedMenu);
          const exists = normalizedMenus.some((menu: any) => Number(menu.id) === selectedId);
          if (!exists) {
            setOrderData((prev: any) => ({
              ...prev,
              selectedMenu: '',
              selectedFingerfoods: [],
              selectedStarters: [],
              selectedSoups: [],
              selectedMains: [],
              selectedSides: [],
              selectedDesserts: [],
              selectedDrinks: []
            }));
            setPendingMenuId('');
          }
        }
      } catch (error) {
        console.error('Failed to load menus for service:', error);
      }
    };

    fetchMenusForService();
  }, [orderData.serviceId]);
  
  useEffect(() => {
    if (!orderData.selectedMenu) {
      setPendingMenuId('');
      return;
    }
    setPendingMenuId(Number(orderData.selectedMenu));
  }, [orderData.selectedMenu]);
  
  useEffect(() => {
    setShowMenuSelection(!orderData.selectedMenu && !pendingMenuId);
  }, [orderData.selectedMenu, pendingMenuId]);
  
  useEffect(() => {
    const guestCount = parseInt(orderData.guestCount, 10) || 0;
    if (!guestCount) return;
    setSelectedAccessories((prev) => prev.map((item) => {
      if (item?.quantityMode === 'FIXED' || item?.quantityMode === 'CLIENT') return item;
      if (item?.quantityMode !== 'GUEST_COUNT') return item;
      const targetQuantity = (() => {
        const base = guestCount > 0 ? guestCount : MIN_GUESTS;
        const activeMenuId = pendingMenuId
          ? Number(pendingMenuId)
          : orderData.selectedMenu
          ? Number(orderData.selectedMenu)
          : null;
        const selectedMenuObj = activeMenuId != null
          ? menusData.find((m: any) => Number(m.id) === activeMenuId)
          : null;
        const menuMinPeople = selectedMenuObj?.minPeople == null ? 0 : Number(selectedMenuObj.minPeople) || 0;
        return Math.max(MIN_GUESTS, base, menuMinPeople);
      })();
      return item.quantity === targetQuantity ? item : { ...item, quantity: targetQuantity };
    }));
  }, [orderData.guestCount, orderData.selectedMenu, pendingMenuId, menusData]);
  
  // ============================================================================
  // HELPER FUNCTIONS (Inside component, but no hooks)
  // ============================================================================
  
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

    // Handle labels like "Fingerfood Basic", "Canape Premium", etc.
    // (normalizeCategoryValue removes spaces/dashes, so we match by substring.)
    const substringAliases: Array<[string, string]> = [
      ['fingerfood', 'fingerfood'],
      ['canape', 'canape'],
      ['appetizer', 'appetizer'],
      ['salad', 'salad'],
      ['soup', 'soup'],
      ['pasta', 'pasta'],
      ['seafood', 'seafood'],
      ['meat', 'meat'],
      ['vegetarian', 'vegetarian'],
      ['vegan', 'vegan'],
      ['glutenfree', 'glutenfree'],
      ['dairyfree', 'dairyfree'],
      ['spicy', 'spicy'],
      ['signature', 'signature'],
      ['seasonal', 'seasonal'],
      ['kidfriendly', 'kidfriendly'],
      ['chefspecial', 'chefspecial'],
      ['tapas', 'tapas'],
      ['bbq', 'bbq'],
      ['breakfast', 'breakfast'],
      ['brunch', 'brunch']
    ];

    for (const [needle, mapped] of substringAliases) {
      if (resolved.includes(needle)) return mapped;
    }

    return resolved || '';
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
  const shouldBlockProgress = isOrderingPaused || (isClosedDate && currentStep >= 1);
  
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
        ? `Das gewählte Datum ist geschlossen${reason}. Bitte wählen Sie ein anderes Datum.`
        : `The selected date is closed${reason}. Please choose another date.`;
    }
    return '';
  }, [closedDateEntry, isClosedDate, isOrderingPaused, language, systemStatus?.pauseReason]);
  
  // ============================================================================
  // DYNAMIC CALCULATIONS
  // ============================================================================
  
  const dynamicMenuSteps = useMemo(() => {
    if (!orderData.selectedMenu && !pendingMenuId) return [];
    
    const selectedMenu = menusData.find(
      m => m.id === orderData.selectedMenu || m.id === Number(orderData.selectedMenu) || m.id === pendingMenuId
    );
    
    if (!selectedMenu) return [];
    
    const rawSteps = Array.isArray(selectedMenu?.steps) ? selectedMenu.steps : [];
    const mapped = rawSteps
      .map((step: any, index: number) => {
        const categoryKey = normalizeMenuStepKey(step?.label);
        if (!categoryKey) return null;
        const rawLabel = (step?.label || '').trim();
        const normalizedLabel = normalizeCategoryValue(rawLabel);
        const meta = (categoryMeta as any)?.[categoryKey];
        const label = rawLabel && normalizedLabel === categoryKey && meta?.label
          ? meta.label
          : (rawLabel || meta?.label || categoryKey);
        return {
          key: `menu-step-${index}`,
          categoryKey,
          label,
          icon: meta?.icon || Package,
          color: meta?.color || 'text-gray-600',
          included: (() => {
            const parsed = Number(step?.included);
            return Number.isFinite(parsed) ? parsed : 0;
          })()
        };
      })
      .filter(Boolean) as Array<{ key: string; categoryKey: string; label: string; icon: any; color: string; included: number }>;
    
    if (mapped.length) return mapped;
    
    // Default categories if no steps defined
    return categoryOrder.map((key) => ({
      key,
      categoryKey: key,
      label: categoryMeta[key].label,
      icon: categoryMeta[key].icon,
      color: categoryMeta[key].color,
      included: 0
    }));
  }, [menusData, orderData.selectedMenu, pendingMenuId, categoryMeta, categoryOrder]);
  
  const stepsConfig = useMemo(() => ([
    { key: 'event', label: language === 'DE' ? 'Eventdetails' : 'Event Details' },
    { key: 'menu', label: language === 'DE' ? 'Menüauswahl' : 'Menu Selection' },
    { key: 'accessories', label: language === 'DE' ? 'Zubehör' : 'Accessories', icon: ShoppingBag, color: 'text-purple-600' },
    { key: 'checkout', label: language === 'DE' ? 'Lieferung & Zahlung' : 'Delivery & Payment' }
  ]), [language]);
  
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
  
  const selectionKeyByCategory: Record<string, string> = {
    fingerfood: 'selectedFingerfoods',
    starter: 'selectedStarters',
    soup: 'selectedSoups',
    main: 'selectedMains',
    side: 'selectedSides',
    dessert: 'selectedDesserts',
    beverage: 'selectedDrinks'
  };
  
  const getAllSelectedItems = () => ([
    ...orderData.selectedFingerfoods,
    ...orderData.selectedStarters,
    ...orderData.selectedSoups,
    ...orderData.selectedMains,
    ...orderData.selectedSides,
    ...orderData.selectedDesserts,
    ...orderData.selectedDrinks
  ]);

  const getAllSelectedItemsFor = (data: any) => ([
    ...(data?.selectedFingerfoods || []),
    ...(data?.selectedStarters || []),
    ...(data?.selectedSoups || []),
    ...(data?.selectedMains || []),
    ...(data?.selectedSides || []),
    ...(data?.selectedDesserts || []),
    ...(data?.selectedDrinks || [])
  ]);
  
  const matchesStepCategory = (item: any, categoryKey: string) => {
    const normalizedCategory = normalizeCategoryValue(item.category);
    if (normalizedCategory === categoryKey) return true;
    const normalizedCustom = normalizeCategoryValue(item?.customCategory);
    return Boolean(normalizedCustom) && normalizedCustom === categoryKey;
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
  
  const getCategorySelectionCount = (categoryKey: string) => {
    const items = getItemsForStepCategory(categoryKey);
    return items.length;
  };
  
  const getCategoryExtrasSubtotal = (categoryKey: string) => {
    const items = getItemsForStepCategory(categoryKey);
    const guestCount = parseInt(orderData.guestCount, 10) || 0;
    const includedCount = Math.max(0, Number(includedByCategory[categoryKey]) || 0);

    // IMPORTANT: Use selection order (stable) for included vs extra items.
    // First `includedCount` items are included in the base menu price.
    const includedItems = includedCount > 0 ? items.slice(0, includedCount) : [];
    const extraItems = includedCount > 0 ? items.slice(includedCount) : items;

    const includedExtras = includedItems.reduce((sum, item) => {
      const price = Number(item?.price) || 0;
      const quantity = Number(item?.quantity) || 0;
      const extraPortions = Math.max(0, quantity - guestCount);
      return sum + price * extraPortions;
    }, 0);

    const extras = extraItems.reduce((sum, item) => {
      const price = Number(item?.price) || 0;
      const quantity = Number(item?.quantity) || 0;
      return sum + price * quantity;
    }, 0);

    return includedExtras + extras;
  };

  const getChargeForItemInCategory = (categoryKey: string, item: any) => {
    const guestCount = parseInt(orderData.guestCount, 10) || 0;
    const items = getItemsForStepCategory(categoryKey);
    const includedCount = Math.max(0, Number(includedByCategory[categoryKey]) || 0);

    // Same rule as getCategoryExtrasSubtotal(): selection order decides which are included.
    const index = items.findIndex((entry) => Number(entry?.id) === Number(item?.id));
    const isIncluded = includedCount > 0 && index >= 0 && index < includedCount;

    const price = Number(item?.price) || 0;
    const quantity = Number(item?.quantity) || 0;
    const chargedQuantity = isIncluded ? Math.max(0, quantity - guestCount) : quantity;

    return {
      isIncluded,
      chargedQuantity,
      chargedTotal: price * chargedQuantity
    };
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
      return sum + (item.price * item.quantity);
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
  
  // ============================================================================
  // EVENT HANDLERS & VALIDATION FUNCTIONS
  // ============================================================================
  
  const validateEmailValue = (value: string) => {
    if (!value) {
      return language === 'DE' ? 'E-Mail ist erforderlich.' : 'Email is required.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return language === 'DE' ? 'Bitte eine gültige E-Mail eingeben.' : 'Please enter a valid email address.';
    }
    return '';
  };
  
  const validatePhoneValue = (value: string) => {
    if (!value) {
      return language === 'DE' ? 'Telefonnummer ist erforderlich.' : 'Phone number is required.';
    }
    if (!/^\+?[0-9\s-]{7,15}$/.test(value)) {
      return language === 'DE' ? 'Bitte eine gültige Telefonnummer eingeben.' : 'Please enter a valid phone number.';
    }
    return '';
  };
  
  const validateCompanyName = (value: string) => {
    if (orderData.businessType !== 'business') {
      return '';
    }
    return value ? '' : (language === 'DE' ? 'Firmenname ist erforderlich.' : 'Company name is required.');
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
  
  const getGuestCountError = () => (
    language === 'DE'
      ? 'Anzahl der Gäste muss mindestens 10 sein.'
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
  
  const closeMinPeoplePrompt = () => {
    setMinPeoplePromptOpen(false);
    setMinPeoplePromptMenu(null);
    setMinPeoplePromptGuestCount(0);
  };
  
  const openMinPeoplePrompt = (menu: any, guestCount: number) => {
    setMinPeoplePromptMenu(menu);
    setMinPeoplePromptGuestCount(guestCount);
    setMinPeoplePromptOpen(true);
  };
  
  const finalizeMenuSelection = (menu: any) => {
    setQuantities({});
    extraNoticeRef.current = {};
    setPendingMenuId(menu.id);
    setOrderData((prev: any) => {
      const previousSelected = prev.selectedMenu ? Number(prev.selectedMenu) : null;
      if (previousSelected === Number(menu.id)) {
        return { ...prev, selectedMenu: Number(menu.id) };
      }
      return {
        ...prev,
        selectedMenu: Number(menu.id),
        selectedFingerfoods: [],
        selectedStarters: [],
        selectedSoups: [],
        selectedMains: [],
        selectedSides: [],
        selectedDesserts: [],
        selectedDrinks: []
      };
    });
    setCurrentStep(2);
  };
  
  const handleMenuCardClick = (menu: any) => {
    if (!menu.isActive) return;
    
    const isBlocked = isOrderingPaused || (isClosedDate && currentStep >= 1);
    if (isBlocked) {
      showNotification('error', blockedMessage, 3000);
      return;
    }
    
    if (!validateStepsUpTo(currentStep - 1)) {
      return;
    }

    const guestCount = parseInt(orderData.guestCount, 10) || 0;
    const menuMinPeople = Number(menu.minPeople) || 0;
    if (guestCount > 0 && menuMinPeople > guestCount) {
      openMinPeoplePrompt(menu, guestCount);
      return;
    }

    finalizeMenuSelection(menu);
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
      const uniqueOptions: any[] = [];
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
          ? 'Keine PLZ für diese Stadt gefunden.'
          : 'No postal codes found for this city.'
      );
      setCityLookupOptions([]);
    } finally {
      setCityLookupLoading(false);
    }
  };
  
  const updateOrderData = (field: string, value: any) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getEffectiveGuestCount = () => {
    const guestCount = parseInt(orderData.guestCount, 10) || 0;
    const base = guestCount > 0 ? guestCount : MIN_GUESTS;

    const activeMenuId = pendingMenuId
      ? Number(pendingMenuId)
      : orderData.selectedMenu
      ? Number(orderData.selectedMenu)
      : null;

    const selectedMenuObj = activeMenuId != null
      ? menusData.find((m: any) => Number(m.id) === activeMenuId)
      : null;

    const menuMinPeople = selectedMenuObj?.minPeople == null ? 0 : Number(selectedMenuObj.minPeople) || 0;
    return Math.max(MIN_GUESTS, base, menuMinPeople);
  };
  
  const getMinOrderQuantity = (_product: any) => {
    // In the order flow, the "quantity" for dishes should follow the guest count (and menu minPeople),
    // not the legacy product minOrderQuantity (often 5).
    return getEffectiveGuestCount();
  };
  
  const updateQuantity = (category: string, productId: number, quantity: number, minQuantity = 1) => {
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
    return selectionKeyByCategory[categoryKey]
      || selectionKeyByCategory[normalizedProductCategory]
      || '';
  };
  
  const addProductToOrder = (category: string, product: any) => {
    const quantityKey = `${category}_${product.id}`;
    const minQuantity = getMinOrderQuantity(product);
    const requestedQuantity = quantities[quantityKey] || 0;
    const quantityInOrder = getProductQuantityInOrder(category, product);
    const defaultQuantity = quantityInOrder > 0 ? quantityInOrder : getEffectiveGuestCount();
    const quantity = requestedQuantity <= 0 ? defaultQuantity : Math.max(minQuantity, requestedQuantity);
    const productWithQuantity = { ...product, quantity, category };
    
    const categoryKey = getSelectionKey(category, product);
    if (!categoryKey) return;
    const updatedSelection = orderData[categoryKey]?.filter((p: any) => p.id !== product.id) || [];
    const nextSelection = [...updatedSelection, productWithQuantity];
    const nextOrderData = { ...orderData, [categoryKey]: nextSelection };

    const included = Math.max(0, Number(includedByCategory[category]) || 0);
    if (included > 0) {
      const nextSelectedCount = getAllSelectedItemsFor(nextOrderData).filter((item) => matchesStepCategory(item, category)).length;
      const extra = Math.max(0, nextSelectedCount - included);
      if (extra > 0 && extraNoticeRef.current[category] !== extra) {
        extraNoticeRef.current[category] = extra;
        setExtraNoticeData({
          label: stepLabelByKey[category] || categoryMeta[category]?.label || category,
          extra
        });
        setExtraNoticeOpen(true);
      }
    }

    updateOrderData(categoryKey, nextSelection);
    setQuantities(prev => ({ ...prev, [quantityKey]: 0 }));
  };
  
  const getProductQuantityInOrder = (category: string, product: any) => {
    const categoryKey = getSelectionKey(category, product);
    if (!categoryKey) return 0;
    const selected = orderData[categoryKey]?.find((p: any) => p.id === product.id);
    return selected ? selected.quantity : 0;
  };
  
  const updateProductQuantityInOrder = (category: string, product: any, newQuantity: number) => {
    const categoryKey = getSelectionKey(category, product);
    if (!categoryKey) return;
    const selectedProduct = orderData[categoryKey]?.find((p: any) => p.id === product.id);
    const minQuantity = getMinOrderQuantity(selectedProduct);
    if (newQuantity <= 0 || newQuantity < minQuantity) {
      const updatedSelection = orderData[categoryKey]?.filter((p: any) => p.id !== product.id) || [];
      updateOrderData(categoryKey, updatedSelection);
      return;
    }
    const updatedSelection = orderData[categoryKey]?.map((item: any) =>
      item.id === product.id ? { ...item, quantity: newQuantity } : item
    ) || [];
    
    updateOrderData(categoryKey, updatedSelection);
  };
  
    const sanitizeAccessoryQuantity = (quantity: any) => {
      const parsed = typeof quantity === 'number' ? quantity : Number(quantity);
      const parsedQuantity = Number.isFinite(parsed) ? Math.max(1, Math.trunc(parsed)) : 1;
      return parsedQuantity;
    };

    const toggleAccessory = (accessory: any) => {
      const wasSelected = selectedAccessories.some((item) => item.id === accessory.id);
      const getAccessoryTargetQuantity = (value: any) => {
        const guestTarget = getEffectiveGuestCount();
        const quantityMode =
          value?.quantityMode === 'FIXED'
            ? 'FIXED'
            : value?.quantityMode === 'CLIENT'
            ? 'CLIENT'
            : 'GUEST_COUNT';

        if (quantityMode === 'FIXED') {
          const fixedQuantity = value?.fixedQuantity == null ? 0 : Number(value.fixedQuantity);
          const fixedTarget = Math.max(0, Math.trunc(fixedQuantity));
          return Math.max(1, fixedTarget || 1);
        }

        if (quantityMode === 'CLIENT') {
          return 1;
        }

        return guestTarget;
      };
      const targetQuantity = getAccessoryTargetQuantity(accessory);
      setSelectedAccessories(prev => {
        if (prev.some(item => item.id === accessory.id)) {
          return prev.filter(item => item.id !== accessory.id);
      }
      return [...prev, { ...accessory, quantity: targetQuantity }];
    });

      setAccessoryDraftQuantities((prev) => {
        if (wasSelected) {
          const { [accessory.id]: _removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [accessory.id]: sanitizeAccessoryQuantity(targetQuantity) };
      });
  };
  
  const updateAccessoryQuantity = (id: number, quantity: number) => {
    setAccessoryDraftQuantities((prev) => ({ ...prev, [id]: sanitizeAccessoryQuantity(quantity) }));
  };

  const confirmAccessoryQuantity = (id: number) => {
    const draft = accessoryDraftQuantities[id];
    if (draft == null) return;
    setSelectedAccessories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: sanitizeAccessoryQuantity(draft) } : item))
    );
  };
  
  const getMenuRequiredCountUpToSubStep = (categoryKey: string, subStepIndex: number) => {
    if (!categoryKey) return 0;
    if (!Array.isArray(dynamicMenuSteps) || dynamicMenuSteps.length === 0) return 0;
    const maxIndex = Math.min(dynamicMenuSteps.length - 1, Math.max(0, subStepIndex));
    let required = 0;
    for (let i = 0; i <= maxIndex; i += 1) {
      const step = dynamicMenuSteps[i];
      const stepCategoryKey = step?.categoryKey || step?.key;
      if (!stepCategoryKey) continue;
      if (stepCategoryKey !== categoryKey) continue;
      required += Math.max(0, Number(step?.included) || 0);
    }
    return required;
  };

  const getFirstInvalidMenuSubStep = (maxSubStepIndex: number) => {
    if (!Array.isArray(dynamicMenuSteps) || dynamicMenuSteps.length === 0) return null;
    const maxIndex = Math.min(dynamicMenuSteps.length - 1, Math.max(0, maxSubStepIndex));

    for (let i = 0; i <= maxIndex; i += 1) {
      const step = dynamicMenuSteps[i];
      const categoryKey = step?.categoryKey || step?.key;
      if (!categoryKey) continue;

      const required = getMenuRequiredCountUpToSubStep(categoryKey, i);
      if (required <= 0) continue;

      const selected = getCategorySelectionCount(categoryKey);
      if (selected < required) {
        return { subStep: i, categoryKey, selected, required };
      }
    }

    return null;
  };

  const getMenuStepCompletionErrorMessage = (invalid: { categoryKey: string; selected: number; required: number }) => {
    const label = stepLabelByKey[invalid.categoryKey] || categoryMeta[invalid.categoryKey]?.label || invalid.categoryKey;
    const missing = Math.max(0, invalid.required - invalid.selected);
    return language === 'DE'
      ? `Bitte wählen Sie noch ${missing} Artikel für "${label}" (${invalid.selected}/${invalid.required}).`
      : `Please select ${missing} more item(s) for "${label}" (${invalid.selected}/${invalid.required}).`;
  };

  const validateMenuSubStepsUpTo = (maxSubStepIndex: number) => {
    const invalid = getFirstInvalidMenuSubStep(maxSubStepIndex);
    if (!invalid) return true;

    setShowMenuSelection(false);
    setCurrentMenuSubStep(invalid.subStep);
    showNotification('error', getMenuStepCompletionErrorMessage(invalid), 3000);
    return false;
  };

  const getStepValidationError = (step: number) => {
    const guestCount = parseInt(orderData.guestCount, 10) || 0;
    const hasValidGuestCount = guestCount >= MIN_GUESTS;
    const hasValidPostal = /^\d{5}$/.test(orderData.postalCode || '');
    const contactEmail = (orderData.contactInfo.email || '').trim();
    const contactPhone = (orderData.contactInfo.phone || '').trim();
    const companyName = (orderData.contactInfo.company || '').trim();
    const emailError = validateEmailValue(contactEmail);
    const phoneError = validatePhoneValue(contactPhone);
    const stepKey = stepsConfig[step - 1]?.key;
    
    switch (stepKey) {
      case 'event':
        if (!orderData.businessType) {
          return language === 'DE' ? 'Bitte Anlass wählen.' : 'Please select an event type.';
        }
        if (!orderData.eventDate) {
          return language === 'DE' ? 'Bitte Datum wählen.' : 'Please select an event date.';
        }
        if (!orderData.eventTime) {
          return language === 'DE' ? 'Bitte Uhrzeit wählen.' : 'Please select an event time.';
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
        if (!orderData.selectedMenu && !pendingMenuId) {
          return language === 'DE' ? 'Bitte ein Menü wählen.' : 'Please select a menu.';
        }
        {
          const invalidMenu = getFirstInvalidMenuSubStep(dynamicMenuSteps.length - 1);
          if (invalidMenu) return getMenuStepCompletionErrorMessage(invalidMenu);
        }
        return '';
      case 'accessories':
        if (!hasValidGuestCount) {
          return getGuestCountError();
        }
        {
          const hasPendingAccessoryQuantity = selectedAccessories.some((item: any) => {
            if (item?.quantityMode !== 'CLIENT') return false;
            const draft = accessoryDraftQuantities[item.id];
            return sanitizeAccessoryQuantity(draft ?? item.quantity) !== sanitizeAccessoryQuantity(item.quantity);
          });
          if (hasPendingAccessoryQuantity) {
            return language === 'DE'
              ? 'Bitte bestätigen Sie die Zubehör-Mengen, bevor Sie fortfahren.'
              : 'Please confirm the accessory quantities before continuing.';
          }
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
        // For business orders, we don't require payment method selection
        if (orderData.businessType !== 'business') {
          if (!orderData.paymentMethod) {
            return language === 'DE' ? 'Bitte Zahlungsmethode wählen.' : 'Please select a payment method.';
          }
          if (orderData.paymentMethod === 'credit-card') {
            const { number, expiry, cvc, name } = orderData.cardDetails;
            const digitsOnly = number.replace(/\s+/g, '');
            const expiryValid = /^\d{2}\/\d{2}$/.test(expiry);
            if (!digitsOnly || digitsOnly.length < 12 || !expiryValid || cvc.length < 3 || !name.trim()) {
              return language === 'DE'
                ? 'Bitte gültige Kartendaten eingeben.'
                : 'Please enter valid card details.';
            }
          }
        }
        if (!termsAccepted) {
          return language === 'DE'
            ? 'Bitte AGB und Datenschutz akzeptieren.'
            : 'Please accept the terms and privacy policy.';
        }
        if (isCaptchaEnabled && !captchaToken) {
          return language === 'DE'
            ? 'Bitte Captcha bestätigen.'
            : 'Please complete the captcha.';
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
    if (stepKey === 'menu') {
      const shouldShowMenuSelection = !orderData.selectedMenu && !pendingMenuId;
      setShowMenuSelection(shouldShowMenuSelection);
      if (shouldShowMenuSelection) {
        setCurrentMenuSubStep(0);
        return;
      }
      const invalidSubStep = getFirstInvalidMenuSubStep(dynamicMenuSteps.length - 1);
      if (invalidSubStep) setCurrentMenuSubStep(invalidSubStep.subStep);
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
      if (isCaptchaEnabled) {
        setCaptchaError(
          captchaToken
            ? ''
            : (language === 'DE' ? 'Bitte Captcha bestätigen.' : 'Please complete the captcha.')
        );
      } else {
        setCaptchaError('');
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
    
    const isBlocked = isOrderingPaused || (isClosedDate && currentStep >= 1);
    if (isBlocked) {
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
    
    const isBlocked = isOrderingPaused || (isClosedDate && currentStep >= 1);
    if (isBlocked) {
      return false;
    }
    return !getFirstInvalidStep(targetStep - 1);
  };
  
  const canProceedToNext = !getFirstInvalidStep(currentStep);
  
  const nextStep = () => {
    const isBlocked = isOrderingPaused || (isClosedDate && currentStep >= 1);
    if (isBlocked) {
      showNotification('error', blockedMessage, 3000);
      return;
    }

    if (!validateStepsUpTo(currentStep)) {
      return;
    }
    
    if (currentStep === 2 && pendingMenuId) {
      setQuantities({});
      setOrderData((prev: any) => {
        const previousSelected = prev.selectedMenu ? Number(prev.selectedMenu) : null;
        if (previousSelected === Number(pendingMenuId)) {
          return { ...prev, selectedMenu: Number(pendingMenuId) };
        }
        return {
          ...prev,
          selectedMenu: Number(pendingMenuId),
          selectedFingerfoods: [],
          selectedStarters: [],
          selectedSoups: [],
          selectedMains: [],
          selectedSides: [],
          selectedDesserts: [],
          selectedDrinks: []
        };
      });
    }
    
    if (currentStep === stepsConfig.length) {
      handleSubmitOrder();
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, stepsConfig.length));
  };
  
  const prevStep = () => {
    if (currentStep === 2 && currentMenuSubStep > 0) {
      setCurrentMenuSubStep(currentMenuSubStep - 1);
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };
  
  const handleSubmitOrder = async () => {
    // Check if ordering is paused
    if (systemStatus?.orderingPaused) {
      showNotification('error', language === 'DE'
        ? 'Bestellungen sind aktuell pausiert. Bitte später erneut versuchen.'
        : 'Ordering is currently paused. Please try again later.', 3000);
      return;
    }
    
    if (isClosedDate) {
      showNotification('error', language === 'DE'
        ? 'Das ausgewählte Datum ist geschlossen. Bitte wählen Sie ein anderes Datum.'
        : 'The selected date is closed. Please choose another date.', 3000);
      return;
    }

    if (!validateStepsUpTo(stepsConfig.length)) {
      return;
    }

    const contactEmail = (orderData.contactInfo.email || '').trim();
    const contactPhone = (orderData.contactInfo.phone || '').trim();
    const emailError = validateEmailValue(contactEmail);
    const phoneError = validatePhoneValue(contactPhone);
    setContactErrors({ email: emailError, phone: phoneError });
    
    if (emailError || phoneError) {
      showNotification('error', language === 'DE'
        ? 'Bitte gültige Kontaktdaten angeben.'
        : 'Please provide valid contact details.', 3000);
      return;
    }
    
    const companyName = (orderData.contactInfo.company || '').trim();
    const companyInfo = (orderData.companyInfo || '').trim();
    const baseRequests = (orderData.specialRequests || '').trim();
    
    const companyDetailParts: string[] = [];
    if (orderData.businessType === 'business') {
      if (companyName) companyDetailParts.push(`Company: ${companyName}`);
      if (companyInfo) companyDetailParts.push(`Company Info: ${companyInfo}`);
    }
    const companyDetails = companyDetailParts.join('\n');
    
    const accessoriesLines = selectedAccessories
      .map((item: any) => `- ${item.name} x${item.quantity} (€${Number(item.price).toFixed(2)} each)`)
      .join('\n');
    const accessoriesDetails = accessoriesLines ? `Accessories:\n${accessoriesLines}` : '';
    
    const mergedRequests = [companyDetails, accessoriesDetails, baseRequests].filter(Boolean).join('\n\n');
    
    // Calculate totals
    const guestCount = parseInt(orderData.guestCount) || 0;
    const flatServiceFee = 48.90;
    const accessoriesSubtotal = selectedAccessories.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const selectedMenuObj = menusData.find(
      m => m.id === orderData.selectedMenu || m.id === Number(orderData.selectedMenu)
    );
    const menuSubtotal = selectedMenuObj ? selectedMenuObj.price * guestCount : 0;
    
    const foodItems = [
      ...orderData.selectedFingerfoods,
      ...orderData.selectedStarters,
      ...orderData.selectedSoups,
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
    
    // For business orders, set payment method to 'invoice'
    const paymentMethod = orderData.businessType === 'business' ? 'invoice' : orderData.paymentMethod;
    
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
        specialRequests: mergedRequests,
        businessType: orderData.businessType,
        serviceType: orderData.serviceType,
        serviceId: orderData.serviceId ? Number(orderData.serviceId) : undefined,
        postalCode: orderData.postalCode,
        captchaToken: isCaptchaEnabled ? captchaToken : undefined,
        items: orderItems,
        subtotal: subtotal,
        serviceFee: flatServiceFee,
        total: total,
      });
      
      if (orderData.businessType === 'business') {
        showNotification('success', language === 'DE'
          ? 'Bestellung erfolgreich aufgegeben! Sie erhalten in Kürze eine Rechnung per E-Mail.'
          : 'Order placed successfully! You will receive an invoice via email shortly.', 3000);
      } else {
        showNotification('success', 'Order placed successfully! Order ID: ' + order.id, 2000);
      }
      
      setTimeout(() => {
        window.location.href = '/home';
      }, 2000);
    } catch (error: any) {
      showNotification('error', 'Failed to place order: ' + (error.message || 'Unknown error'), 3500);
    }
  };
  
  const handleBackToHome = () => {
    window.location.href = '/home';
  };
  
  // ============================================================================
  // RENDER FUNCTIONS (No hooks inside)
  // ============================================================================
  
  const renderSummaryNav = () => {
    const isBlocked = isOrderingPaused || (isClosedDate && currentStep >= 1);
    
    return (
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
          disabled={isBlocked}
          className={`px-5 py-2 text-sm font-semibold rounded-lg inline-flex items-center shadow-sm transition-colors ${
            isBlocked
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          {currentStep === stepsConfig.length ? ui.confirmOrder : t.buttons.next}
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    );
  };
  
  // ============================================================================
  // STEP COMPONENTS (Defined as simple render functions, not components with hooks)
  // ============================================================================
  
  const renderStep1 = () => {
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

    const occasion = orderData.businessType === 'business'
      ? 'BUSINESS'
      : orderData.businessType === 'private'
      ? 'PRIVATE'
      : '';
    const occasionServices = (servicesData || [])
      .filter((service) => service.isActive)
      .filter((service) => !occasion || service.occasion === occasion || service.occasion === 'BOTH');
    
    const fixedServices = occasionServices.map(service => {
      if (language === 'DE' && service.nameDe === 'Büffet') {
        return { ...service, nameDe: 'Buffet' };
      }
      if (service.name === 'Büffet') {
        return { ...service, name: 'Buffet' };
      }
      return service;
    });

    const handleServiceClick = (service: any) => {
      const serviceName = language === 'DE' ? (service.nameDe || service.name) : service.name;
      const isCurrentlySelected = String(orderData.serviceId) === String(service.id);
      
      if (isCurrentlySelected) {
        updateOrderData('serviceId', '');
        updateOrderData('serviceType', '');
      } else {
        updateOrderData('serviceId', service.id);
        updateOrderData('serviceType', serviceName);
      }
    };

    const postalFieldProps = {
      isDE: language === 'DE',
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

    return (
      <div className="space-y-6">
        <div className="grid gap-4">
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
                    updateOrderData('serviceId', '');
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

          {orderData.businessType && (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === 'DE' ? 'Service ausw\u00e4hlen' : 'Choose a service'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === 'DE'
                      ? 'W\u00e4hlen Sie eine Dienstleistung passend zum Anlass.'
                      : 'Pick a service that matches your occasion.'}
                  </p>
                </div>
              </div>

              {fixedServices.length === 0 ? (
                <div className="text-sm text-gray-600">
                  {language === 'DE' ? 'Keine Services verf\u00fcgbar.' : 'No services available.'}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {fixedServices.map((service) => {
                    const selected = String(orderData.serviceId) === String(service.id);
                    const serviceName = language === 'DE' ? (service.nameDe || service.name) : service.name;
                    const serviceDescription = language === 'DE' ? (service.descriptionDe || service.description) : service.description;
                    
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleServiceClick(service)}
                        className={`group text-center rounded-xl border overflow-hidden transition-all ${
                          selected 
                            ? 'border-amber-500 ring-2 ring-amber-200 bg-amber-50' 
                            : 'border-gray-200 hover:border-amber-300 hover:shadow-sm bg-white'
                        }`}
                      >
                        <div className="h-20 bg-gray-100">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={serviceName}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="p-3">
                          <div className="font-semibold text-gray-900 flex items-center justify-center gap-1">
                            {serviceName}
                            {selected && (
                              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                          
                          {selected && serviceDescription && (
                            <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100 animate-fadeIn">
                              {serviceDescription}
                            </div>
                          )}
                          
                          {!selected && serviceDescription && (
                            <div className="text-xs text-gray-400 mt-2 italic">
                              {language === 'DE' ? 'Klicken zum Auswählen' : 'Click to select'}
                            </div>
                          )}
                          
                          {!serviceDescription && (
                            <div className="text-xs text-gray-400 mt-2 italic">
                              {language === 'DE' ? 'Keine Beschreibung verfügbar' : 'No description available'}
                            </div>
                          )}
                          
                          {selected && (
                            <div className="text-xs text-amber-600 mt-2 font-medium">
                              {language === 'DE' ? 'Erneut klicken zum Abwählen' : 'Click again to deselect'}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              
              {orderData.serviceId && (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-amber-800 mb-1">
                          {language === 'DE' ? 'Ausgewählter Service' : 'Selected Service'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            updateOrderData('serviceId', '');
                            updateOrderData('serviceType', '');
                          }}
                          className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {language === 'DE' ? 'Abwählen' : 'Deselect'}
                        </button>
                      </div>
                      {(() => {
                        const selectedService = fixedServices.find(
                          (service: any) => String(service.id) === String(orderData.serviceId)
                        );
                        if (selectedService) {
                          const description = language === 'DE' 
                            ? (selectedService.descriptionDe || selectedService.description)
                            : selectedService.description;
                          
                          if (description) {
                            return (
                              <p className="text-sm text-amber-700">
                                {description}
                              </p>
                            );
                          }
                        }
                        return (
                          <p className="text-sm text-amber-600 italic">
                            {language === 'DE' 
                              ? 'Keine weitere Beschreibung verfügbar.' 
                              : 'No further description available.'}
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
                placeholder={language === 'DE' ? 'Datum wählen' : 'Select date'}
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
                placeholder={language === 'DE' ? 'Uhrzeit wählen' : 'Select time'}
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
  
  const renderStep2MenuSelection = () => {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t.menuSelection.title}
          </h2>
          <p className="text-gray-600 text-lg">
            {t.menuSelection.subtitle}
          </p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
          {menusData.map((menu) => {
            const steps = Array.isArray(menu.steps) ? menu.steps : [];
            const dishesAvailable = Array.isArray(menu.products)
              ? menu.products.length
              : Array.isArray(menu.menuProducts)
              ? menu.menuProducts.length
              : 0;
            const cardClassName =
              'w-full max-w-[26rem] h-[34rem] rounded-3xl border border-gray-200 overflow-hidden transition-all duration-300 text-left bg-white shadow-sm hover:shadow-xl flex flex-col ' +
              ((pendingMenuId ? Number(pendingMenuId) : orderData.selectedMenu ? Number(orderData.selectedMenu) : null) === Number(menu.id)
                ? 'border-amber-500 ring-2 ring-amber-200'
                : menu.isActive
                ? 'hover:border-amber-300'
                : 'bg-gray-50 opacity-70 cursor-not-allowed');
            return (
                  <button
                    key={menu.id}
                    type="button"
                    onClick={() => handleMenuCardClick(menu)}
                    className={cardClassName}
                  >
                <div className="relative h-44 min-h-44 bg-gray-200 flex-none">
                  {menu.image ? (
                    <img
                      src={menu.image}
                      alt={menu.name || 'Menu image'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center text-gray-500 text-sm">
                      {ui.noImage}
                    </div>
                  )}
                  {!menu.isActive && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg px-4 py-2 bg-red-600 rounded-lg">
                        {language === 'DE' ? 'Derzeit nicht verfügbar' : 'Currently Unavailable'}
                      </span>
                    </div>
                  )}
                </div>
                  <div className="p-6 flex flex-col gap-4 flex-1 min-h-0">
                    <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {menu.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 max-h-12 overflow-hidden">
                      {menu.description}
                    </p>
                    </div>
                  <div className="space-y-2 text-sm text-gray-700 flex-1 min-h-0 overflow-y-auto pr-1">
                    {steps.map((step: any, index: number) => (
                      <div key={`${menu.id}-step-${index}`} className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                          <Check size={12} />
                        </span>
                        <span>
                          {step.included}{' '}
                          {(() => {
                            const key = normalizeMenuStepKey(step.label);
                            return key && categoryMeta[key] ? categoryMeta[key].label : step.label;
                          })()}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Check size={12} />
                      </span>
                      <span>{dishesAvailable} {ui.dishesAvailable}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 space-y-1 mt-auto">
                    <div className="text-2xl font-bold text-gray-900">
                      {menu.price ? ui.fromPerGuest(menu.price) : ui.customPricing}
                    </div>
                    <div className="text-xs text-gray-500">{ui.exclVat}</div>
                    {menu.minPeople ? (
                      <div className="text-sm font-semibold text-gray-700">{ui.guestMinimum(menu.minPeople)}</div>
                    ) : null}
                  </div>
                  <div className="pt-2">
                    <div className="w-full rounded-xl bg-amber-400/80 px-4 py-3 text-center text-sm font-semibold text-white">
                      {ui.selectFood}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        </div>
     );
  };
  
  const renderStep2MenuItems = () => {
    const currentCategory = dynamicMenuSteps[currentMenuSubStep]?.categoryKey || '';
    
    if (!currentCategory) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'DE' ? 'Menüauswahl abgeschlossen' : 'Menu Selection Complete'}
          </h3>
          <button
            onClick={() => setCurrentStep(3)}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
          >
            {language === 'DE' ? 'Weiter zu Zubehör' : 'Continue to Accessories'}
          </button>
        </div>
      );
    }
    
    const activeMenuId = pendingMenuId ? Number(pendingMenuId) : orderData.selectedMenu ? Number(orderData.selectedMenu) : null;
    const selectedMenu = menusData.find(
      (m: any) => (activeMenuId != null) && Number(m.id) === activeMenuId
    );
    
    const products = menuItemsData
      .filter((item: any) => matchesStepCategory(item, currentCategory))
      .filter((item: any) => {
        if (!selectedMenu) return true;
        const productIds = selectedMenu.products || [];
        return productIds.includes(item.id);
      });
    
    const includedTotal = Math.max(0, Number(includedByCategory[currentCategory]) || 0);
    const stepIncluded = Math.max(0, Number(dynamicMenuSteps[currentMenuSubStep]?.included) || 0);
    const selectedCount = getCategorySelectionCount(currentCategory);
    const extraCount = Math.max(0, selectedCount - includedTotal);
    
    const categoryTitle = dynamicMenuSteps[currentMenuSubStep]?.label
      || categoryMeta[currentCategory]?.label
      || currentCategory?.charAt(0).toUpperCase() + currentCategory?.slice(1);
    
    const nextSubStep = () => {
      if (!validateMenuSubStepsUpTo(currentMenuSubStep)) {
        return;
      }
      if (currentMenuSubStep < dynamicMenuSteps.length - 1) {
        setCurrentMenuSubStep(currentMenuSubStep + 1);
      } else {
        setCurrentStep(3);
      }
    };
    
    const prevSubStep = () => {
      if (currentMenuSubStep > 0) {
        setCurrentMenuSubStep(currentMenuSubStep - 1);
      } else {
        setShowMenuSelection(true);
      }
    };
    
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
              {selectedMenu && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900">{selectedMenu.name}</h4>
                    <span className="text-amber-700 font-bold">€{selectedMenu.price}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{selectedMenu.description}</p>
                </div>
              )}
              
              {/* Category Sub-steps Navigation */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">
                  {language === 'DE' ? 'Menükategorien' : 'Menu Categories'}
                </h4>
                <div className="space-y-2">
                  {dynamicMenuSteps.map((step, index) => {
                    const isCurrent = index === currentMenuSubStep;
                    const isCompleted = index < currentMenuSubStep;
                    const Icon = step.icon;
                    
                    return (
                      <button
                        key={step.key}
                        onClick={() => {
                          if (index <= currentMenuSubStep) {
                            setCurrentMenuSubStep(index);
                            return;
                          }
                          if (!validateMenuSubStepsUpTo(index - 1)) {
                            return;
                          }
                          setCurrentMenuSubStep(index);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isCurrent
                            ? 'bg-amber-100 border border-amber-300'
                            : isCompleted
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCurrent ? 'bg-amber-600' : isCompleted ? 'bg-green-600' : 'bg-gray-300'
                          }`}>
                            <Icon size={16} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className={`font-medium ${isCurrent ? 'text-amber-800' : 'text-gray-700'}`}>
                                {step.label}
                              </span>
                              {isCompleted && (
                                <Check size={16} className="text-green-600" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {language === 'DE' ? 'Inklusive:' : 'Included:'} {step.included}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
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
                          {items.map((item: any, itemIdx: number) => (
                            <div key={itemIdx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-800 truncate max-w-[60%]">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">x{item.quantity}</span>
                                <span className="font-semibold text-gray-900">€{getChargeForItemInCategory(key, item).chargedTotal.toFixed(2)}</span>
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
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">
                    {language === 'DE' ? 'Inklusive vs. Extras' : 'Included vs Extras'}
                  </h4>
                  <div className="space-y-3">
                    {getCategorySummaryRows().map((row) => (
                      <div key={`summary-${row.key}`} className="rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800">{row.label}</span>
                          <span className="text-xs text-gray-500">
                            {(language === 'DE' ? 'Inklusive' : 'Included')} {row.included}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                          <span>{(language === 'DE' ? 'Ausgewählt' : 'Selected')}: {row.selected}</span>
                          <span>{(language === 'DE' ? 'Extras' : 'Extras')}: {row.extra}</span>
                          <span className="text-right">
                            {(language === 'DE' ? 'Extrakkosten' : 'Extras cost')}: €{row.extraCost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between gap-3">
                  <button
                    onClick={prevSubStep}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {language === 'DE' ? 'Zurück' : 'Back'}
                  </button>
                  <button
                    onClick={nextSubStep}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                  >
                    {currentMenuSubStep === dynamicMenuSteps.length - 1
                      ? (language === 'DE' ? 'Weiter zu Zubehör' : 'Continue to Accessories')
                      : (language === 'DE' ? 'Weiter' : 'Next')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Selection - Left Side */}
        <div className="lg:col-span-2 lg:order-1">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {categoryTitle}
                </h2>
                <p className="text-gray-600">
                  {language === 'DE' 
                    ? `Wählen Sie aus den verfügbaren Optionen für ${categoryTitle.toLowerCase()}`
                    : `Select from available options for ${categoryTitle.toLowerCase()}`
                  }
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {currentMenuSubStep + 1} / {dynamicMenuSteps.length}
              </div>
            </div>
            
            <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-amber-100 bg-amber-50/70 px-4 py-2 text-sm text-amber-700">
              <span className="font-semibold">Included: {stepIncluded}</span>
              <span className="text-amber-300">|</span>
              <span className="font-semibold">Selected: {selectedCount}</span>
              <span className="text-amber-300">|</span>
              <span className={`font-semibold ${extraCount > 0 ? 'text-amber-900' : ''}`}>
                Extra: {extraCount}
              </span>
            </div>
            {extraCount > 0 && (
              <p className="mt-2 text-xs text-amber-700">
                {language === 'DE' 
                  ? 'Extras über die enthaltene Menge hinaus werden berechnet.'
                  : 'Extras beyond the included count are charged.'}
              </p>
            )}
          </div>
          
          <div className="space-y-6">
            {products.map((product: any) => {
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
                            {ui.noImage}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {product.name}
                              </h3>
                              {!product.available && (
                                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">
                                  {ui.notAvailable}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-4">
                              {product.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div className="text-2xl font-bold text-gray-900">€{product.price}</div>
                              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                                {language === 'DE' ? 'Anzahl der Gaeste' : 'Number of Guests'} {minQuantity}
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                {(language === 'DE' && Array.isArray(product.allergensDe) && product.allergensDe.length > 0 ? product.allergensDe : product.allergens).map((allergen: string, idx: number) => (
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
                            {ui.moreInfo}
                          </button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => {
                                const base = currentQuantity > 0 ? currentQuantity : (quantityInOrder > 0 ? quantityInOrder : 0);
                                updateQuantity(currentCategory, product.id, base - 1, minQuantity);
                              }}
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
                              onClick={() => {
                                const base = currentQuantity > 0 ? currentQuantity : (quantityInOrder > 0 ? quantityInOrder : 0);
                                updateQuantity(currentCategory, product.id, base + 1, minQuantity);
                              }}
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
                            {quantityInOrder > 0 ? ui.updateOrder : ui.addToOrder}
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
            
            {products.length === 0 && (
              <div className="text-center py-12 border border-gray-200 rounded-xl bg-gray-50">
                <p className="text-gray-600">
                  {language === 'DE' 
                    ? `Keine ${categoryTitle.toLowerCase()} verfügbar für dieses Menü.`
                    : `No ${categoryTitle.toLowerCase()} available for this menu.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderStep2 = () => {
    if (showMenuSelection) {
      return renderStep2MenuSelection();
    }
    return renderStep2MenuItems();
  };
  
  const renderStep3 = () => {
    const guestCount = parseInt(orderData.guestCount) || 0;
    const flatServiceFee = 48.90;
    const accessoriesSubtotal = selectedAccessories.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const selectedMenuObj = menusData.find(
      (m: any) => m.id === orderData.selectedMenu || m.id === Number(orderData.selectedMenu)
    );
    const menuSubtotal = selectedMenuObj ? selectedMenuObj.price * guestCount : 0;
    
    const foodSubtotal = getFoodExtrasSubtotal();
    const subtotal = menuSubtotal + foodSubtotal;
    const currentSubtotal = subtotal + accessoriesSubtotal + flatServiceFee;
    
    const dbAccessories = (accessoriesData || []).map((a: any) => {
      const fallbackUnit = language === 'DE' ? 'pro Stk' : 'each';
      return {
        id: a.id,
        name: language === 'DE' ? (a.nameDe || a.nameEn) : a.nameEn,
        description: language === 'DE' ? (a.descriptionDe || a.descriptionEn) : a.descriptionEn,
        details: language === 'DE' ? (a.detailsDe || a.detailsEn) : a.detailsEn,
        price: Number(a.price) || 0,
        unit: (language === 'DE' ? (a.unitDe || a.unitEn) : a.unitEn) || fallbackUnit,
        quantityMode: a.quantityMode === 'FIXED' ? 'FIXED' : a.quantityMode === 'CLIENT' ? 'CLIENT' : 'GUEST_COUNT',
        fixedQuantity: a.fixedQuantity == null ? null : Number(a.fixedQuantity),
        image: a.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
      };
    });
    
    const legacyAccessories = [
      {
        id: 1,
        name: language === 'DE' ? 'Porzellanteller (Premium)' : 'Premium Porcelain Dinner Plates',
        description: language === 'DE'
          ? 'Elegante weiße Porzellanteller für formelle Anlässe'
          : 'Elegant white porcelain plates for formal dining',
        details: language === 'DE' ? 'Set enthält nur Teller' : 'Set includes dinner plates only',
        price: 3.50,
        unit: language === 'DE' ? 'pro Teller' : 'per plate',
        quantityMode: 'GUEST_COUNT',
        fixedQuantity: null,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
      },
      {
        id: 2,
        name: language === 'DE' ? 'Edelstahl-Besteckset' : 'Stainless Steel Cutlery Set',
        description: language === 'DE'
          ? 'Komplettes Besteckset mit Messer, Gabel und Löffel'
          : 'Complete cutlery set including knife, fork, and spoon',
        details: language === 'DE' ? 'Polierter Edelstahl' : 'Polished stainless steel',
        price: 2.75,
        unit: language === 'DE' ? 'pro Set' : 'per set',
        quantityMode: 'GUEST_COUNT',
        fixedQuantity: null,
        image: 'https://images.unsplash.com/photo-1595435934247-5d33b7f92c70?w=400&h=300&fit=crop'
      },
      {
        id: 3,
        name: language === 'DE' ? 'Leinenservietten' : 'Linen Napkins',
        description: language === 'DE'
          ? 'Hochwertige Leinenservietten in verschiedenen Farben'
          : 'High-quality linen napkins in various colors',
        details: language === 'DE' ? 'Erhältlich in Weiß, Schwarz oder Beige' : 'Available in white, black, or beige',
        price: 1.20,
        unit: language === 'DE' ? 'pro Serviette' : 'per napkin',
        quantityMode: 'GUEST_COUNT',
        fixedQuantity: null,
        image: 'https://images.unsplash.com/photo-1583845112203-1aa7e80d8d2c?w=400&h=300&fit=crop'
      },
      {
        id: 4,
        name: language === 'DE' ? 'Weingläser' : 'Wine Glasses',
        description: language === 'DE' ? 'Klassische, kristallklare Weingläser' : 'Classic crystal-clear wine glasses',
        details: language === 'DE' ? 'Fassungsvermögen 350ml' : '12oz capacity',
        price: 2.25,
        unit: language === 'DE' ? 'pro Glas' : 'per glass',
        quantityMode: 'GUEST_COUNT',
        fixedQuantity: null,
        image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop'
      },
      {
        id: 5,
        name: language === 'DE' ? 'Buffet-Servierplatten' : 'Buffet Serving Platters',
        description: language === 'DE'
          ? 'Große ovale Servierplatten für Buffet-Aufbau'
          : 'Large oval serving platters for buffet setup',
        details: language === 'DE' ? 'Keramik, hitzebeständig' : 'Ceramic, heat-resistant',
        price: 8.50,
        unit: language === 'DE' ? 'pro Platte' : 'per platter',
        quantityMode: 'GUEST_COUNT',
        fixedQuantity: null,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
      },
      {
        id: 6,
        name: language === 'DE' ? 'Tischdecken' : 'Table Cloths',
        description: language === 'DE'
          ? 'Elegante Tischwäsche für formelle Events'
          : 'Elegant table linen for formal events',
        details: language === 'DE' ? 'Verschiedene Größen verfügbar' : 'Various sizes available',
        price: 12.00,
        unit: language === 'DE' ? 'pro Tischtuch' : 'per cloth',
        quantityMode: 'GUEST_COUNT',
        fixedQuantity: null,
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop'
      }
    ];
    
    const realisticAccessories = dbAccessories.length ? dbAccessories : legacyAccessories;
    
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
                          {items.map((item: any, itemIdx: number) => (
                            <div key={itemIdx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-800 truncate max-w-[60%]">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">x{item.quantity}</span>
                                <span className="font-semibold text-gray-900">€{getChargeForItemInCategory(key, item).chargedTotal.toFixed(2)}</span>
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
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">
                    {language === 'DE' ? 'Inklusive vs. Extras' : 'Included vs Extras'}
                  </h4>
                  <div className="space-y-3">
                    {getCategorySummaryRows().map((row) => (
                      <div key={`summary-${row.key}`} className="rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800">{row.label}</span>
                          <span className="text-xs text-gray-500">
                            {(language === 'DE' ? 'Inklusive' : 'Included')} {row.included}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                          <span>{(language === 'DE' ? 'Ausgewählt' : 'Selected')}: {row.selected}</span>
                          <span>{(language === 'DE' ? 'Extras' : 'Extras')}: {row.extra}</span>
                          <span className="text-right">
                            {(language === 'DE' ? 'Extrakkosten' : 'Extras cost')}: €{row.extraCost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Accessories Summary */}
              {selectedAccessories.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 mb-3">
                    {language === 'DE' ? 'Zubehör' : 'Accessories'}
                  </h4>
                  <div className="space-y-2">
                    {selectedAccessories.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-800">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">x{item.quantity}</span>
                          <span className="font-semibold text-gray-900">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Totals */}
              <div className="pt-4 border-t border-gray-200">
                <div className="rounded-lg border border-amber-100 bg-amber-50/70 p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900 font-semibold">
                      {language === 'DE' ? 'Menü + Extras Zwischensumme:' : 'Menu + Extras Subtotal:'}
                    </span>
                    <span className="font-bold text-amber-700">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900 font-semibold">
                      {language === 'DE' ? 'Extras (kostenpflichtig):' : 'Extras (paid):'}
                    </span>
                    <span className="font-bold text-amber-700">€{getFoodExtrasSubtotal().toFixed(2)}</span>
                  </div>
                  {selectedAccessories.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 font-semibold">{language === 'DE' ? 'Zubehör:' : 'Accessories:'}</span>
                      <span className="font-bold text-amber-700">€{accessoriesSubtotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900 font-semibold">{language === 'DE' ? 'Servicegebühr:' : 'Service Fee:'}</span>
                    <span className="font-bold text-amber-700">€{flatServiceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-amber-200">
                    <span>{language === 'DE' ? 'Gesamt:' : 'Total:'}</span>
                    <span>€{currentSubtotal.toFixed(2)}</span>
                  </div>
                  {renderSummaryNav()}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Accessories Selection - Left Side */}
        <div className="lg:col-span-2 lg:order-1">
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {ui.optionalAccessoriesTitle}
              </h1>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                {ui.optionalAccessoriesSubtitle}
              </h2>
              <div className="inline-flex items-center justify-center gap-3 rounded-full bg-amber-50/70 px-4 py-2 text-sm text-amber-700">
                <Info size={16} />
                <span>{ui.optionalAccessoriesHint}</span>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAccessories([]);
                    setAccessoryDraftQuantities({});
                    nextStep();
                  }}
                  className="px-6 py-3 rounded-lg text-base font-semibold bg-gray-900 text-white hover:bg-black transition-colors"
                >
                  {ui.continueWithoutAccessories}
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {realisticAccessories.map((accessory: any) => {
                const isSelected = selectedAccessories.some((item: any) => item.id === accessory.id);
                const selectedItem = selectedAccessories.find((item: any) => item.id === accessory.id);
                const quantityMode = accessory.quantityMode === 'FIXED'
                  ? 'FIXED'
                  : accessory.quantityMode === 'CLIENT'
                  ? 'CLIENT'
                  : 'GUEST_COUNT';
                const baseQuantity = quantityMode === 'FIXED'
                  ? Math.max(1, Math.max(0, Math.trunc(Number(accessory.fixedQuantity) || 0)) || 1)
                  : quantityMode === 'CLIENT'
                  ? 1
                  : Math.max(1, guestCount || MIN_GUESTS);
                const confirmedQuantity = isSelected
                  ? sanitizeAccessoryQuantity(selectedItem?.quantity ?? baseQuantity)
                  : baseQuantity;
                const draftQuantity = isSelected && quantityMode === 'CLIENT'
                  ? sanitizeAccessoryQuantity(accessoryDraftQuantities[accessory.id] ?? confirmedQuantity)
                  : confirmedQuantity;
                const hasPendingDraft = isSelected && quantityMode === 'CLIENT' && draftQuantity !== confirmedQuantity;
                const displayQuantity = isSelected ? confirmedQuantity : baseQuantity;
                const quantityLabel = quantityMode === 'FIXED'
                  ? (language === 'DE' ? 'fest' : 'fixed')
                  : quantityMode === 'CLIENT'
                  ? (language === 'DE' ? 'vom Kunden' : 'client')
                  : (language === 'DE' ? 'entspricht Gaesten' : 'matches guests');
                const unitPrice = Number(accessory?.price) || 0;
                
                return (
                  <div key={accessory.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Image Column */}
                        <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src={accessory.image}
                            alt={accessory.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        
                        {/* Content Column */}
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{accessory.name}</h3>
                              </div>
                              <p className="text-gray-600 mb-2">{accessory.description}</p>
                              {accessory.details && (
                                <p className="text-gray-500 text-sm">{accessory.details}</p>
                              )}
                              
                              <div className="mt-3">
                                <div className="text-lg font-bold text-gray-900">
                                  €{unitPrice.toFixed(2)} {accessory.unit}
                                </div>
                                <div className="text-xs font-semibold text-amber-700 mt-1">
                                  {language === 'DE' ? 'Menge' : 'Quantity'}: {displayQuantity} ({quantityLabel}) | {language === 'DE' ? 'Gesamt' : 'Total'}: €{(unitPrice * displayQuantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                            
                            {/* Selection Controls */}
                            <div className="w-full flex flex-col sm:flex-row sm:flex-wrap sm:justify-end items-stretch sm:items-center gap-2">
                              {isSelected && (
                                <div className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
                                  {language === 'DE' ? 'Menge' : 'Qty'}: {confirmedQuantity}
                                </div>
                              )}
                              {isSelected && quantityMode === 'CLIENT' ? (
                                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                  <div className="flex w-full sm:w-auto items-stretch border border-gray-300 rounded-lg overflow-hidden bg-white">
                                    <button
                                      type="button"
                                      onClick={() => updateAccessoryQuantity(accessory.id, Math.max(1, draftQuantity - 1))}
                                      className="px-3 py-2 hover:bg-gray-100 transition-colors text-black"
                                    >
                                      <Minus size={18} strokeWidth={2.5} className="text-black" />
                                    </button>
                                    <input
                                      type="number"
                                      min={1}
                                      value={String(draftQuantity)}
                                      onChange={(e) => {
                                        const next = parseInt(e.target.value, 10);
                                        updateAccessoryQuantity(accessory.id, Number.isFinite(next) ? Math.max(1, next) : 1);
                                      }}
                                      className="w-16 sm:w-20 text-center py-2 text-base font-bold border-x border-gray-300 bg-white text-gray-900"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => updateAccessoryQuantity(accessory.id, draftQuantity + 1)}
                                      className="px-3 py-2 hover:bg-gray-100 transition-colors text-black"
                                    >
                                      <Plus size={18} strokeWidth={2.5} className="text-black" />
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => confirmAccessoryQuantity(accessory.id)}
                                    disabled={!hasPendingDraft}
                                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2 ${
                                      hasPendingDraft
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                                  >
                                    <Check size={16} />
                                    {language === 'DE' ? 'Bestätigen' : 'Confirm'}
                                  </button>
                                </div>
                              ) : null}
                              <button
                                onClick={() => toggleAccessory(accessory)}
                                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                                  isSelected
                                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                    : 'bg-gray-900 text-white hover:bg-black'
                                }`}
                              >
                                {isSelected ? ui.remove : ui.addToOrder}
                              </button>
                            </div>
                          </div>
                          
                          {/* Quantity display when selected */}
                          {isSelected && (
                            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center justify-between">
                                <span className="text-green-800 font-semibold">
                                  {language === 'DE' ? 'Hinzugefuegt' : 'Added'}:{' '}
                                  <span className="text-lg">
                                    {confirmedQuantity} {language === 'DE' ? 'Stk' : 'pcs'}
                                  </span>
                                </span>
                                <span className="text-green-900 font-bold">
                                  {language === 'DE' ? 'Gesamt' : 'Total'}: €{((Number(selectedItem?.price) || 0) * confirmedQuantity).toFixed(2)}
                                </span>
                              </div>
                              {hasPendingDraft && (
                                <div className="mt-2 text-xs text-amber-800 font-medium">
                                  {language === 'DE'
                                    ? `Neue Menge (${draftQuantity}) noch nicht bestätigt.`
                                    : `New quantity (${draftQuantity}) not confirmed yet.`}
                                </div>
                              )}
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
      </div>
    );
  };
  
  const renderStep4 = () => {
    const guestCount = parseInt(orderData.guestCount) || 0;
    const flatServiceFee = 48.90;
    const accessoriesSubtotal = selectedAccessories.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const selectedMenuObj = menusData.find(
      (m: any) => m.id === orderData.selectedMenu || m.id === Number(orderData.selectedMenu)
    );
    const menuSubtotal = selectedMenuObj ? selectedMenuObj.price * guestCount : 0;
    
    const foodSubtotal = getFoodExtrasSubtotal();
    const subtotal = menuSubtotal + foodSubtotal;
    const total = subtotal + accessoriesSubtotal + flatServiceFee;
    const vatRate = orderData.businessType === 'business' ? 0.19 : 0.07;
    const vatAmount = total * vatRate;
    const grandTotal = total + vatAmount;
    
    const renderPaymentStep = () => {
      if (orderData.businessType === 'business') {
        // Business orders - Invoice only
        return (
          <div className="space-y-8">
            <div className="rounded-2xl border border-amber-100 bg-white shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-2">
                <FileInvoice size={20} className="text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">{ui.invoiceTitle}</h2>
              </div>
              <p className="text-gray-600">{ui.invoiceDescription}</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Order Summary - Right Side */}
              <div className="lg:col-span-1 lg:order-2">
                <div className="sticky top-32 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t.productSelection.orderSummary}</h3>
                  
                  <div className="space-y-6">
                    {/* Event Info */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900">{t.eventInfo.title}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-black">
                          <CalendarIcon size={16} className="text-gray-500" />
                          <span className="font-medium">{orderData.eventDate || ui.notSpecified}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-black">
                          <ClockIcon size={16} className="text-gray-500" />
                          <span className="font-medium">{orderData.eventTime || ui.notSpecified}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-black">
                          <Users size={16} className="text-gray-500" />
                          <span className="font-medium">
                            {orderData.guestCount || 0} {language === 'DE' ? 'Gäste' : 'guests'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-black">
                          <MapPinIcon size={16} className="text-gray-500" />
                          <span className="font-medium">
                            {orderData.postalCode || ui.notSpecified}{orderData.postalCode && orderData.city ? ` (${orderData.city})` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3">
                        {language === 'DE' ? 'Kontaktinformationen' : 'Contact Information'}
                      </h4>
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
                    
                    {/* Price Breakdown */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3">
                        {language === 'DE' ? 'Preisaufstellung' : 'Price Breakdown'}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900 font-semibold">
                            {language === 'DE' ? 'Menü + Extras Zwischensumme:' : 'Menu + Extras Subtotal:'}
                          </span>
                          <span className="font-bold text-amber-700">€{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900 font-semibold">
                            {language === 'DE' ? 'Extras (kostenpflichtig):' : 'Extras (paid):'}
                          </span>
                          <span className="font-bold text-amber-700">€{getFoodExtrasSubtotal().toFixed(2)}</span>
                        </div>
                        {selectedAccessories.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-900 font-semibold">{language === 'DE' ? 'Zubehör:' : 'Accessories:'}</span>
                            <span className="font-bold text-amber-700">€{accessoriesSubtotal.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900 font-semibold">{language === 'DE' ? 'Servicegebühr:' : 'Service Fee:'}</span>
                          <span className="font-bold text-amber-700">€{flatServiceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900 font-semibold">
                            {language === 'DE'
                              ? `MwSt (${(vatRate * 100).toFixed(2)}%):`
                              : `VAT (${(vatRate * 100).toFixed(2)}%):`}
                          </span>
                          <span className="font-bold text-amber-700">€{vatAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                          <span>{language === 'DE' ? 'Gesamt:' : 'Total:'}</span>
                          <span>€{grandTotal.toFixed(2)}</span>
                        </div>
                        <div className="pt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FileInvoice size={16} className="text-amber-600" />
                            <span className="font-semibold">{language === 'DE' ? 'Zahlungsmethode:' : 'Payment Method:'} {language === 'DE' ? 'Rechnung' : 'Invoice'}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{ui.invoiceTerms}</p>
                        </div>
                        {renderSummaryNav()}
                      </div>
                    </div>
                    
                    {/* Invoice Assurance */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                        <FileInvoice size={20} className="text-amber-600" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">
                            {language === 'DE' ? 'Rechnung wird per E-Mail versendet' : 'Invoice will be sent via email'}
                          </p>
                          <p className="text-xs text-amber-600">
                            {language === 'DE'
                              ? 'Innerhalb von 24 Stunden nach Bestellung'
                              : 'Within 24 hours of order placement'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Invoice Information - Left Side */}
              <div className="lg:col-span-2 lg:order-1">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                  <div className="space-y-6">
                    {/* Invoice Details */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{ui.invoiceTitle}</h3>
                        <span className="text-xs font-semibold text-amber-600 uppercase tracking-[0.2em]">
                          {language === 'DE' ? 'Für Unternehmen' : 'For Businesses'}
                        </span>
                      </div>
                      
                      <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-6 mb-6">
                        <div className="flex items-start gap-3">
                          <FileInvoice size={24} className="text-amber-600 mt-1" />
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">
                              {language === 'DE' ? 'Rechnungsprozess' : 'Invoice Process'}
                            </h4>
                            <ul className="space-y-3 text-gray-700">
                              <li className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check size={12} className="text-green-600" />
                                </div>
                                <span>{language === 'DE' ? 'Sie erhalten eine Rechnung per E-Mail innerhalb von 24 Stunden nach Ihrer Bestellung.' : 'You will receive an invoice via email within 24 hours of placing your order.'}</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check size={12} className="text-green-600" />
                                </div>
                                <span>{language === 'DE' ? 'Die Rechnung enthält alle Bestelldetails und unsere Bankverbindung.' : 'The invoice includes all order details and our bank account information.'}</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check size={12} className="text-green-600" />
                                </div>
                                <span>{language === 'DE' ? 'Zahlbar innerhalb von 14 Tagen nach Rechnungserhalt.' : 'Payable within 14 days of receiving the invoice.'}</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check size={12} className="text-green-600" />
                                </div>
                                <span>{language === 'DE' ? 'Alle Preise verstehen sich zzgl. der gesetzlichen MwSt.' : 'All prices are exclusive of applicable VAT.'}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Verification */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          {language === 'DE' ? 'Rechnungsadresse prüfen' : 'Verify Billing Address'}
                        </h4>
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <span className="text-gray-600">{language === 'DE' ? 'Firmenname' : 'Company Name'}</span>
                            <span className="font-semibold text-gray-900">{orderData.contactInfo.company || 'Nicht angegeben'}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <span className="text-gray-600">Email</span>
                            <span className="font-semibold text-gray-900">{orderData.contactInfo.email}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <span className="text-gray-600">{language === 'DE' ? 'Telefon' : 'Phone'}</span>
                            <span className="font-semibold text-gray-900">{orderData.contactInfo.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
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
                            {language === 'DE' 
                              ? 'Ich stimme den AGB und der Datenschutzerklärung zu. Ich bestätige, dass ich die Rechnungsbedingungen verstanden habe (zahlbar innerhalb von 14 Tagen).'
                              : 'I agree to the Terms & Conditions and Privacy Policy. I confirm that I understand the invoice terms (payable within 14 days).'}
                          </label>
                          <button
                            type="button"
                            onClick={() => setTermsModalOpen(true)}
                            className="mt-2 text-xs font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-4"
                          >
                          {language === 'DE' ? 'AGB & Bedingungen lesen' : 'Read full Terms and Conditions'}
                          </button>
                        </div>
                      </div>
                      {termsError && (
                        <p className="mt-2 text-sm text-red-600">{termsError}</p>
                      )}
                    </div>

                    {isCaptchaEnabled && (
                      <div className="pt-6 border-t border-gray-200">
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {language === 'DE' ? 'Sicherheitsprüfung' : 'Security check'}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {language === 'DE' ? 'Bitte bestätigen Sie, dass Sie kein Bot sind.' : 'Please confirm you are not a bot.'}
                          </p>
                        </div>
                        <TurnstileWidget
                          siteKey={turnstileSiteKey}
                          onToken={(token) => {
                            setCaptchaToken(token);
                            setCaptchaError('');
                          }}
                          onExpire={() => {
                            setCaptchaToken('');
                            setCaptchaError(language === 'DE' ? 'Captcha ist abgelaufen. Bitte erneut bestätigen.' : 'Captcha expired. Please complete it again.');
                          }}
                          onError={() => {
                            setCaptchaToken('');
                            setCaptchaError(language === 'DE' ? 'Captcha konnte nicht geladen werden. Bitte Seite neu laden.' : 'Captcha failed to load. Please reload the page.');
                          }}
                        />
                        {captchaError && (
                          <p className="mt-2 text-sm text-red-600">{captchaError}</p>
                        )}
                      </div>
                    )}
                    
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
                      disabled={orderBlocked || (isCaptchaEnabled && !captchaToken)}
                      className="w-full mt-6 bg-amber-600 text-white py-4 px-6 rounded-lg text-base font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <FileInvoice size={20} />
                      {ui.confirmOrder}
                    </button>
                    
                    {/* Business Assurance */}
                    <div className="text-center pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-amber-600" />
                          <span>{language === 'DE' ? 'Für Unternehmen' : 'For Businesses'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileInvoice size={16} className="text-blue-600" />
                          <span>{language === 'DE' ? 'Rechnung' : 'Invoice'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-600" />
                          <span>VAT {vatRate * 100}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        // Private orders - Original payment methods
        return (
          <div className="space-y-8">
            <div className="rounded-2xl border border-amber-100 bg-white shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-2">
                <Lock size={20} className="text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">{t.payment.title}</h2>
              </div>
              <p className="text-gray-600">{t.payment.subtitle}</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Order Summary - Right Side */}
              <div className="lg:col-span-1 lg:order-2">
                <div className="sticky top-32 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t.productSelection.orderSummary}</h3>
                  
                  <div className="space-y-6">
                    {/* Event Info */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900">{t.eventInfo.title}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-black">
                          <CalendarIcon size={16} className="text-gray-500" />
                          <span className="font-medium">{orderData.eventDate || ui.notSpecified}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-black">
                          <ClockIcon size={16} className="text-gray-500" />
                          <span className="font-medium">{orderData.eventTime || ui.notSpecified}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-black">
                          <Users size={16} className="text-gray-500" />
                          <span className="font-medium">
                            {orderData.guestCount || 0} {language === 'DE' ? 'Gäste' : 'guests'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-black">
                          <MapPinIcon size={16} className="text-gray-500" />
                          <span className="font-medium">
                            {orderData.postalCode || ui.notSpecified}{orderData.postalCode && orderData.city ? ` (${orderData.city})` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3">
                        {language === 'DE' ? 'Kontaktinformationen' : 'Contact Information'}
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-900 font-semibold">{orderData.contactInfo.firstName} {orderData.contactInfo.lastName}</p>
                        <p className="text-sm text-gray-900 font-semibold">{orderData.contactInfo.email}</p>
                        <p className="text-sm text-gray-900 font-semibold">{orderData.contactInfo.phone}</p>
                      </div>
                    </div>
                    
                    {/* Price Breakdown */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3">
                        {language === 'DE' ? 'Preisaufstellung' : 'Price Breakdown'}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900 font-semibold">
                            {language === 'DE' ? 'Menü + Extras Zwischensumme:' : 'Menu + Extras Subtotal:'}
                          </span>
                          <span className="font-bold text-amber-700">€{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900 font-semibold">
                            {language === 'DE' ? 'Extras (kostenpflichtig):' : 'Extras (paid):'}
                          </span>
                          <span className="font-bold text-amber-700">€{getFoodExtrasSubtotal().toFixed(2)}</span>
                        </div>
                        {selectedAccessories.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-900 font-semibold">{language === 'DE' ? 'Zubehör:' : 'Accessories:'}</span>
                            <span className="font-bold text-amber-700">€{accessoriesSubtotal.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900 font-semibold">{language === 'DE' ? 'Servicegebühr:' : 'Service Fee:'}</span>
                          <span className="font-bold text-amber-700">€{flatServiceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900 font-semibold">
                            {language === 'DE'
                              ? `MwSt (${(vatRate * 100).toFixed(2)}%):`
                              : `VAT (${(vatRate * 100).toFixed(2)}%):`}
                          </span>
                          <span className="font-bold text-amber-700">€{vatAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                          <span>{language === 'DE' ? 'Gesamt:' : 'Total:'}</span>
                          <span>€{grandTotal.toFixed(2)}</span>
                        </div>
                        {renderSummaryNav()}
                      </div>
                    </div>
                    
                    {/* Security Badge */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Shield size={20} className="text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            {language === 'DE' ? 'Sichere Zahlung' : 'Secure Payment'}
                          </p>
                          <p className="text-xs text-green-600">
                            {language === 'DE'
                              ? 'SSL-verschluesselt \u2022 DSGVO-konform'
                              : 'SSL Encrypted \u2022 GDPR Compliant'}
                          </p>
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
                    {/* Payment Method Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{t.payment.method}</h3>
                        <span className="text-xs font-semibold text-amber-600 uppercase tracking-[0.2em]">
                          {language === 'DE' ? 'Schritt 3' : 'Step 3'}
                        </span>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {[
                          {
                            id: 'credit-card',
                            label: language === 'DE' ? 'Kreditkarte' : 'Credit Card',
                            description: language === 'DE' ? 'Sofortige Bestätigung und sicherer Checkout.' : 'Instant confirmation and secure checkout.',
                            icon: CreditCard,
                            badge: language === 'DE' ? 'Schnell' : 'Fast'
                          },
                          {
                            id: 'paypal',
                            label: 'PayPal',
                            description: language === 'DE' ? 'Nutzen Sie PayPal-Guthaben oder die verknüpfte Karte.' : 'Use your PayPal balance or linked card.',
                            icon: null,
                            badge: language === 'DE' ? 'Beliebt' : 'Popular'
                          },
                          {
                            id: 'bank-transfer',
                            label: language === 'DE' ? 'Banküberweisung' : 'Bank Transfer',
                            description: language === 'DE' ? 'Wir zeigen Ihnen unsere Bankdaten an.' : 'We will display our bank details.',
                            icon: Building2,
                            badge: language === 'DE' ? 'Manuell' : 'Manual'
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
                              <div className="flex items-start justify-between mb-3 gap-3">
                                <div className="flex min-w-0 flex-1 items-start gap-3">
                                  <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                    isSelected ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {method.icon ? <method.icon size={22} /> : <span className="text-sm font-bold">PP</span>}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                      <span className="min-w-0 break-words text-base font-semibold leading-snug text-gray-900">
                                        {method.label}
                                      </span>
                                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                                        {method.badge}
                                      </span>
                                    </div>
                                    <p className="mt-0.5 break-words text-sm leading-snug text-gray-600">
                                      {method.description}
                                    </p>
                                  </div>
                                </div>
                                {isSelected && (
                                  <CheckCircle size={20} className="text-amber-600" />
                                )}
                              </div>
                              <div className="flex min-w-0 items-center justify-between gap-3 text-xs font-medium text-gray-500">
                                <span className="min-w-0 break-words">
                                  {isSelected
                                    ? (language === 'DE' ? 'Ausgewählt' : 'Selected')
                                    : (language === 'DE' ? 'Antippen zum Auswählen' : 'Tap to select')}
                                </span>
                                <span className="shrink-0 text-amber-600 group-hover:text-amber-700">Details</span>
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
                              maxLength={19}
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
                              maxLength={5}
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
                                maxLength={3}
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
                          {language === 'DE' ? 'AGB & Bedingungen lesen' : 'Read full Terms and Conditions'}
                          </button>
                        </div>
                      </div>
                      {termsError && (
                        <p className="mt-2 text-sm text-red-600">{termsError}</p>
                      )}
                    </div>
                    
                    {isCaptchaEnabled && (
                      <div className="pt-6 border-t border-gray-200">
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {language === 'DE' ? 'Sicherheitsprüfung' : 'Security check'}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {language === 'DE' ? 'Bitte bestätigen Sie, dass Sie kein Bot sind.' : 'Please confirm you are not a bot.'}
                          </p>
                        </div>
                        <TurnstileWidget
                          siteKey={turnstileSiteKey}
                          onToken={(token) => {
                            setCaptchaToken(token);
                            setCaptchaError('');
                          }}
                          onExpire={() => {
                            setCaptchaToken('');
                            setCaptchaError(language === 'DE' ? 'Captcha ist abgelaufen. Bitte erneut bestätigen.' : 'Captcha expired. Please complete it again.');
                          }}
                          onError={() => {
                            setCaptchaToken('');
                            setCaptchaError(language === 'DE' ? 'Captcha konnte nicht geladen werden. Bitte Seite neu laden.' : 'Captcha failed to load. Please reload the page.');
                          }}
                        />
                        {captchaError && (
                          <p className="mt-2 text-sm text-red-600">{captchaError}</p>
                        )}
                      </div>
                    )}
                    
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
                      disabled={orderBlocked || (isCaptchaEnabled && !captchaToken)}
                      className="w-full mt-6 bg-amber-600 text-white py-4 px-6 rounded-lg text-base font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
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
      }
    };
    
    return (
      <div className="space-y-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {ui.deliveryPaymentTitle}
          </h2>
          <p className="text-gray-600 text-lg">
            {ui.deliveryPaymentSubtitle}
          </p>
        </div>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-amber-100 bg-white shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <TruckIcon size={20} className="text-amber-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{ui.deliveryContactTitle}</h3>
                  <p className="text-sm text-gray-600">{ui.deliveryContactSubtitle}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.delivery.contact.first} *
                    </label>
                    <input
                      type="text"
                      value={orderData.contactInfo.firstName}
                      onChange={(e) => updateOrderData('contactInfo', {
                        ...orderData.contactInfo,
                        firstName: e.target.value
                      })}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
                      placeholder={language === 'DE' ? 'Max' : 'John'}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.delivery.contact.last} *
                    </label>
                    <input
                      type="text"
                      value={orderData.contactInfo.lastName}
                      onChange={(e) => updateOrderData('contactInfo', {
                        ...orderData.contactInfo,
                        lastName: e.target.value
                      })}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
                      placeholder={language === 'DE' ? 'Mustermann' : 'Doe'}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.delivery.contact.email} *
                    </label>
                    <input
                      type="email"
                      value={orderData.contactInfo.email}
                      onChange={(e) => updateContactInfoField('email', e.target.value)}
                      onBlur={() => handleContactBlur('email')}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder:text-gray-500"
                      placeholder={language === 'DE' ? 'max@example.com' : 'john@example.com'}
                      required
                    />
                    {contactErrors.email && (
                      <p className="mt-2 text-sm text-red-600">{contactErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {t.delivery.contact.phone} *
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
                        rows={4}
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
                <h3 className="text-lg font-bold text-gray-900">
                  {language === 'DE' ? 'Besondere Wuensche' : 'Special Requests'}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {language === 'DE'
                    ? 'Teilen Sie Ernährungswünsche, Hinweise zum Aufbau oder Zeitdetails.'
                    : 'Share dietary restrictions, setup notes, or timing details.'}
              </p>
              <textarea
                value={orderData.specialRequests}
                onChange={(e) => updateOrderData('specialRequests', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none text-gray-900 placeholder:text-gray-500"
                placeholder={language === 'DE'
                  ? 'Ernährungswünsche oder besondere Anforderungen...'
                  : 'Any dietary restrictions or special requirements...'}
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <MapPinIcon size={18} className="text-amber-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  {language === 'DE' ? 'Lieferübersicht' : 'Delivery Overview'}
                </h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} className="text-gray-500" />
                  <span className="font-semibold">{t.eventInfo.date}:</span>
                  <span>{orderData.eventDate || ui.notSpecified}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon size={16} className="text-gray-500" />
                  <span className="font-semibold">{t.eventInfo.time}:</span>
                  <span>{orderData.eventTime || ui.notSpecified}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-500" />
                  <span className="font-semibold">{t.eventInfo.guests}:</span>
                  <span>{orderData.guestCount || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon size={16} className="text-gray-500" />
                  <span className="font-semibold">{t.eventInfo.location}:</span>
                  <span>
                    {orderData.postalCode || ui.notSpecified}
                    {orderData.postalCode && orderData.city ? ` (${orderData.city})` : ''}
                  </span>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-amber-200 bg-white/70 p-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Info size={14} className="text-amber-600" />
                  <span>
                    {language === 'DE'
                      ? 'Lieferzeitfenster werden nach Zahlung bestätigt.'
                      : 'Delivery windows are confirmed after payment.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-amber-100">
          {renderPaymentStep()}
        </div>
      </div>
    );
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };
  
  // ============================================================================
  // MODAL COMPONENTS
  // ============================================================================
  
  const renderMinPeoplePrompt = () => {
    if (!minPeoplePromptOpen || !minPeoplePromptMenu) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">{t.menuMinPeoplePrompt.title}</h3>
            <button
              type="button"
              onClick={closeMinPeoplePrompt}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              aria-label={ui.close}
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-5 flex-1 overflow-y-auto text-sm text-gray-700 leading-relaxed space-y-4">
            <p className="font-semibold text-gray-900">{minPeoplePromptMenu.name}</p>
            <p>
              {t.menuMinPeoplePrompt.description(
                Number(minPeoplePromptMenu.minPeople) || 0,
                minPeoplePromptGuestCount
              )}
            </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                const menuMin = Number(minPeoplePromptMenu.minPeople) || 0;
                closeMinPeoplePrompt();
                if (menuMin > 0) {
                  handleGuestCountChange(String(menuMin));
                }
                finalizeMenuSelection(minPeoplePromptMenu);
              }}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700"
            >
              {t.menuMinPeoplePrompt.useMenuMin(Number(minPeoplePromptMenu.minPeople) || 0)}
            </button>
            <button
              type="button"
              onClick={() => {
                closeMinPeoplePrompt();
                finalizeMenuSelection(minPeoplePromptMenu);
              }}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50"
            >
              {t.menuMinPeoplePrompt.keepSelected(minPeoplePromptGuestCount)}
            </button>
            <button
              type="button"
              onClick={closeMinPeoplePrompt}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {t.menuMinPeoplePrompt.cancel}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderTermsModal = () => {
    if (!termsModalOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">
              {language === 'DE' ? 'AGB & Bedingungen' : 'Terms and Conditions'}
            </h3>
            <button
              type="button"
              onClick={() => setTermsModalOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-5 flex-1 overflow-y-auto text-sm text-gray-700 leading-relaxed space-y-4">
            <p>
              {language === 'DE'
                ? 'Bitte lesen Sie die folgenden Bedingungen. Dieser Text dient als Beispiel und sollte an Ihre offiziellen Richtlinien angepasst werden.'
                : 'Please review the full terms below. These terms are provided for convenience and should be updated to match your official policy.'}
            </p>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                {language === 'DE' ? 'Buchung und Zahlung' : 'Booking and Payment'}
              </h4>
              <p>
                {language === 'DE'
                  ? 'Bestellungen werden bestätigt, sobald die Zahlung eingegangen ist. Preise beinhalten die ausgewählten Speisen und Leistungen in Ihrer Bestellübersicht.'
                  : 'Orders are confirmed once payment is received. Prices include the selected items and services listed in your order summary.'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                {language === 'DE' ? 'Stornierungen' : 'Cancellations'}
              </h4>
              <p>
                {language === 'DE'
                  ? 'Stornierungen mindestens 48 Stunden vor dem Termin können voll erstattet werden. Spätere Stornierungen können mit Gebühren verbunden sein.'
                  : 'Cancellations made at least 48 hours before the scheduled event are eligible for a full refund. Late cancellations may be subject to fees.'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                {language === 'DE' ? 'Lieferung' : 'Delivery'}
              </h4>
              <p>
                {language === 'DE'
                  ? 'Lieferzeitfenster werden nach Zahlung bestätigt und können je nach Verfügbarkeit und Standort variieren.'
                  : 'Delivery windows are confirmed after payment and may vary based on scheduling availability and location.'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                {language === 'DE' ? 'Datenschutz' : 'Privacy'}
              </h4>
              <p>
                {language === 'DE'
                  ? 'Wir verwenden Ihre Angaben ausschließlich zur Abwicklung Ihrer Bestellung und zur Kommunikation rund um Ihr Event. Kontaktieren Sie uns für Datenanfragen.'
                  : 'We only use your information to fulfill your order and communicate about your event. Please contact us for data requests.'}
              </p>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => setTermsModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700"
            >
              {ui.close}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderBankDetailsModal = () => {
    if (!bankDetailsOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">{ui.bankTransferTitle}</h3>
            <button
              type="button"
              onClick={() => setBankDetailsOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-5 flex-1 overflow-y-auto space-y-4 text-sm text-gray-700">
            <div className="rounded-lg border border-amber-100 bg-amber-50/70 p-4">
              <p className="font-semibold text-gray-900">{ui.bankTransferIntro}</p>
              <p className="mt-2 text-xs text-gray-600">{ui.bankTransferReference}</p>
            </div>
            <div className="grid gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 rounded-lg border border-gray-200 p-3">
                <span className="text-gray-500">{ui.accountName}</span>
                <span className="font-semibold text-gray-900 break-all sm:text-right">La Cannelle Catering</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 rounded-lg border border-gray-200 p-3">
                <span className="text-gray-500">IBAN</span>
                <span className="font-semibold text-gray-900 break-all sm:text-right">DE00 0000 0000 0000 0000 00</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 rounded-lg border border-gray-200 p-3">
                <span className="text-gray-500">BIC/SWIFT</span>
                <span className="font-semibold text-gray-900 break-all sm:text-right">DEUTDEFFXXX</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 rounded-lg border border-gray-200 p-3">
                <span className="text-gray-500">{ui.bank}</span>
                <span className="font-semibold text-gray-900 break-words sm:text-right">{ui.yourBankName}</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => setBankDetailsOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700"
            >
              {ui.close}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderProductDetailsModal = () => {
    if (!productDetailsOpen || !productDetailsItem) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">{ui.productDetailsTitle}</h3>
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
          <div className="px-5 py-5 flex-1 overflow-y-auto">
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
                    {ui.noImage}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {productDetailsItem.name}
                  </h4>
                  <p className="text-gray-600 mt-2">
                    {productDetailsItem.description || ui.noDescription}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="rounded-lg border border-gray-200 p-3">
                    <p className="text-gray-500">{ui.price}</p>
                    <p className="text-base font-semibold text-gray-900">€{productDetailsItem.price}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <p className="text-gray-500">{language === 'DE' ? 'Anzahl der Gaeste' : 'Number of Guests'}</p>
                    <p className="text-base font-semibold text-gray-900">{getMinOrderQuantity(productDetailsItem)}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <p className="text-gray-500">{ui.availability}</p>
                    <p className="text-base font-semibold text-gray-900">
                      {productDetailsItem.available ? ui.available : ui.notAvailableShort}
                    </p>
                  </div>
                </div>
                {(() => {
                  const ingredients = language === 'DE' && Array.isArray(productDetailsItem.ingredientsDe) && productDetailsItem.ingredientsDe.length > 0
                    ? productDetailsItem.ingredientsDe
                    : productDetailsItem.ingredients;
                  if (!Array.isArray(ingredients) || ingredients.length === 0) return null;
                  return (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">{ui.ingredients}</p>
                    <div className="flex flex-wrap gap-2">
                      {ingredients.map((ingredient: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                  );
                })()}
                {(() => {
                  const allergens = language === 'DE' && Array.isArray(productDetailsItem.allergensDe) && productDetailsItem.allergensDe.length > 0
                    ? productDetailsItem.allergensDe
                    : productDetailsItem.allergens;
                  if (!Array.isArray(allergens) || allergens.length === 0) return null;
                  return (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">{ui.allergens}</p>
                    <div className="flex flex-wrap gap-2">
                      {allergens.map((allergen: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded">
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                  );
                })()}
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
              {ui.close}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderExtraNoticeModal = () => {
    if (!extraNoticeOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">
              {language === 'DE' ? 'Hinweis zu Extras' : 'Extras notice'}
            </h3>
            <button
              type="button"
              onClick={() => setExtraNoticeOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-5 flex-1 overflow-y-auto text-sm text-gray-700 space-y-3">
            <p>
              {language === 'DE' ? (
                <>
                  Sie haben mehr Gerichte als die enthaltene Menge für{' '}
                  <span className="font-semibold">{extraNoticeData.label}</span> ausgewählt.
                </>
              ) : (
                <>
                  You have selected more dishes than the included amount for{' '}
                  <span className="font-semibold">{extraNoticeData.label}</span>.
                </>
              )}
            </p>
            <div className="rounded-lg border border-amber-100 bg-amber-50/70 p-4">
              <p className="text-sm text-amber-800 font-semibold">
                {language === 'DE' ? 'Extra Gerichte:' : 'Extra dishes:'} {extraNoticeData.extra}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                {language === 'DE' ? 'Extras werden zu Ihrer Gesamtsumme hinzugefuegt.' : 'Extras will be added to your total.'}
              </p>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => setExtraNoticeOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700"
            >
              {language === 'DE' ? 'Verstanden' : 'Ok, got it'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`px-4 py-3 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {notification.message}
          </div>
        </div>
      )}
      
      {renderMinPeoplePrompt()}
      {renderTermsModal()}
      {renderBankDetailsModal()}
      {renderProductDetailsModal()}
      {renderExtraNoticeModal()}
      
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
                aria-label={language === 'EN' ? commonA11y.switchToGerman : commonA11y.switchToEnglish}
                className="px-3 py-1.5 text-xs font-medium border border-amber-300 text-amber-700 bg-amber-50 rounded-md hover:bg-amber-100 transition-colors inline-flex items-center"
              >
                <img
                  src={
                    language === 'EN'
                      ? '/images/language/Flag_of_United_Kingdom-4096x2048.png'
                      : '/images/language/Flag_of_Germany-4096x2453.png'
                  }
                  alt={language === 'EN' ? commonA11y.englishFlagAlt : commonA11y.germanFlagAlt}
                  className="h-3.5 w-auto mr-1"
                />
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
                 disabled={isOrderingPaused || (isClosedDate && currentStep >= 1)}
                 className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors inline-flex items-center shadow-sm ${
                   isOrderingPaused || (isClosedDate && currentStep >= 1)
                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     : 'bg-amber-600 text-white hover:bg-amber-700'
                 }`}
               >
                 {currentStep === stepsConfig.length ? ui.confirmOrder : t.buttons.next}
                 <ChevronRight size={14} className="ml-1" />
               </button>
              </div>
            </div>
            
            {/* Steps Navigation - Only 4 main steps now */}
            <div className="flex items-center justify-start sm:justify-center gap-2 px-2 flex-nowrap overflow-x-auto overscroll-x-contain">
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
                            : isCurrent
                            ? 'border-amber-500 bg-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isCompleted ? (
                          <Check size={12} className="text-white" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <span
                        className={`hidden sm:block text-[11px] font-semibold text-center whitespace-nowrap ${
                          isCurrent ? 'text-amber-600' : isCompleted ? 'text-amber-600' : 'text-gray-500'
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
            
            {/* Menu Sub-steps Indicator (only shown when in menu step) */}
            {currentStep === 2 && dynamicMenuSteps.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-center gap-1 flex-wrap">
                  {dynamicMenuSteps.map((step, index) => {
                    const isCurrent = index === currentMenuSubStep;
                    const isCompleted = index < currentMenuSubStep;
                    const Icon = step.icon;
                    
                    return (
                      <React.Fragment key={step.key}>
                        <button
                          type="button"
                          onClick={() => {
                            if (index <= currentMenuSubStep) {
                              setCurrentMenuSubStep(index);
                              return;
                            }
                            if (!validateMenuSubStepsUpTo(index - 1)) {
                              return;
                            }
                            setCurrentMenuSubStep(index);
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            isCurrent
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : isCompleted
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          <Icon size={12} className={isCurrent ? 'text-amber-600' : isCompleted ? 'text-green-600' : 'text-gray-500'} />
                          <span>{step.label}</span>
                          {isCompleted && (
                            <Check size={10} className="text-green-600 ml-1" />
                          )}
                        </button>
                        {index < dynamicMenuSteps.length - 1 && (
                          <div className={`h-0.5 w-4 rounded-full ${
                            index < currentMenuSubStep ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      
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
              {renderCurrentStep()}
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
