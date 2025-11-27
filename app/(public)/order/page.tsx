"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, ChevronLeft, Phone, Mail, MapPin, 
  Clock, Users, Calendar, CreditCard, CheckCircle, 
  Building2, Heart, Briefcase, Star, Plus, Minus, ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/home');
  };

  const handleOrderClick = () => {
    router.push('/order');
  };

  const [orderData, setOrderData] = useState({
    businessType: '',
    serviceType: '',
    eventDate: '',
    eventTime: '',
    guestCount: '',
    location: '',
    menuTier: '',
    selectedDishes: [],
    selectedBeverages: [],
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: ''
    },
    specialRequests: '',
    deliveryOption: 'standard'
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'DE' : 'EN');
  };

  const updateOrderData = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

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
      steps: {
        business: 'Business Type',
        service: 'Service Type',
        event: 'Event Info',
        menu: 'Menu Selection',
        details: 'Details',
        payment: 'Payment'
      },
      businessType: {
        title: 'Select Business Type',
        subtitle: 'Choose your customer type for accurate pricing',
        b2b: {
          title: 'B2B Business',
          subtitle: 'Net + 19% VAT',
          features: ['Invoice billing', 'Corporate pricing', 'Volume discounts']
        },
        b2c: {
          title: 'B2C Private',
          subtitle: 'Brutto + 7% VAT included',
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
        date: 'Event Date',
        time: 'Event Time',
        guests: 'Number of Guests',
        location: 'Event Location',
        minGuests: 'Minimum 5 guests for business, 10 for events'
      },
      menuSelection: {
        title: 'Menu Selection',
        subtitle: 'Choose your menu tier and dishes',
        tiers: {
          essential: {
            name: 'Essential',
            price: 45,
            description: 'Perfect for casual gatherings'
          },
          premium: {
            name: 'Premium',
            price: 75,
            description: 'Our most popular choice'
          },
          luxury: {
            name: 'Luxury',
            price: 120,
            description: 'Ultimate dining experience'
          }
        },
        dishes: [
          { id: 1, name: 'Truffle Mushroom Risotto', category: 'main', price: 24, tier: ['premium', 'luxury'] },
          { id: 2, name: 'Herb-crusted Rack of Lamb', category: 'main', price: 38, tier: ['luxury'] },
          { id: 3, name: 'Seared Scallops', category: 'starter', price: 28, tier: ['premium', 'luxury'] },
          { id: 4, name: 'Heirloom Tomato Salad', category: 'starter', price: 18, tier: ['essential', 'premium', 'luxury'] },
          { id: 5, name: 'Chocolate Fondant', category: 'dessert', price: 16, tier: ['premium', 'luxury'] }
        ],
        beverages: [
          { id: 1, name: 'House Wine Selection', category: 'alcoholic', price: 25 },
          { id: 2, name: 'Premium Cocktails', category: 'alcoholic', price: 12 },
          { id: 3, name: 'Fresh Juices', category: 'non-alcoholic', price: 8 },
          { id: 4, name: 'Sparkling Water', category: 'non-alcoholic', price: 5 }
        ]
      },
      details: {
        title: 'Contact & Details',
        subtitle: 'Finalize your order details',
        contact: 'Contact Information',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        company: 'Company Name',
        requests: 'Special Requests',
        delivery: 'Delivery Options',
        deliveryOptions: {
          standard: 'Standard Delivery (included)',
          express: 'Express Delivery (+€50)',
          setup: 'Full Setup Service (+€100)'
        }
      },
      payment: {
        title: 'Payment & Confirmation',
        subtitle: 'Review and complete your order',
        summary: 'Order Summary',
        subtotal: 'Subtotal',
        vat: 'VAT',
        total: 'Total',
        paymentMethods: {
          card: 'Credit Card',
          transfer: 'Bank Transfer',
          klarna: 'Klarna',
          paypal: 'PayPal'
        },
        confirm: 'Confirm & Pay'
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
      steps: {
        business: 'Unternehmensart',
        service: 'Service Typ',
        event: 'Veranstaltungsinfo',
        menu: 'Menüauswahl',
        details: 'Details',
        payment: 'Zahlung'
      },
      businessType: {
        title: 'Unternehmensart auswählen',
        subtitle: 'Wählen Sie Ihren Kundentyp für genaue Preise',
        b2b: {
          title: 'B2B Unternehmen',
          subtitle: 'Netto + 19% MwSt',
          features: ['Rechnungsstellung', 'Firmenpreise', 'Mengenrabatte']
        },
        b2c: {
          title: 'B2C Privat',
          subtitle: 'Brutto + 7% MwSt inklusive',
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
        date: 'Veranstaltungsdatum',
        time: 'Uhrzeit',
        guests: 'Anzahl der Gäste',
        location: 'Veranstaltungsort',
        minGuests: 'Mindestens 5 Gäste für Business, 10 für Events'
      },
      menuSelection: {
        title: 'Menüauswahl',
        subtitle: 'Wählen Sie Ihre Menü-Stufe und Gerichte',
        tiers: {
          essential: {
            name: 'Essential',
            price: 45,
            description: 'Perfekt für lockere Zusammenkünfte'
          },
          premium: {
            name: 'Premium',
            price: 75,
            description: 'Unsere beliebteste Wahl'
          },
          luxury: {
            name: 'Luxus',
            price: 120,
            description: 'Ultimatives Dining-Erlebnis'
          }
        },
        dishes: [
          { id: 1, name: 'Trüffel Pilz Risotto', category: 'main', price: 24, tier: ['premium', 'luxury'] },
          { id: 2, name: 'Kräuterkrusten Lammrücken', category: 'main', price: 38, tier: ['luxury'] },
          { id: 3, name: 'Gebratene Jakobsmuscheln', category: 'starter', price: 28, tier: ['premium', 'luxury'] },
          { id: 4, name: 'Alte Tomatensorten Salat', category: 'starter', price: 18, tier: ['essential', 'premium', 'luxury'] },
          { id: 5, name: 'Schokoladen-Fondant', category: 'dessert', price: 16, tier: ['premium', 'luxury'] }
        ],
        beverages: [
          { id: 1, name: 'Hauswein Auswahl', category: 'alcoholic', price: 25 },
          { id: 2, name: 'Premium Cocktails', category: 'alcoholic', price: 12 },
          { id: 3, name: 'Frische Säfte', category: 'non-alcoholic', price: 8 },
          { id: 4, name: 'Sprudelwasser', category: 'non-alcoholic', price: 5 }
        ]
      },
      details: {
        title: 'Kontakt & Details',
        subtitle: 'Finalisieren Sie Ihre Bestelldetails',
        contact: 'Kontaktinformation',
        firstName: 'Vorname',
        lastName: 'Nachname',
        email: 'E-Mail-Adresse',
        phone: 'Telefonnummer',
        company: 'Firmenname',
        requests: 'Besondere Wünsche',
        delivery: 'Lieferoptionen',
        deliveryOptions: {
          standard: 'Standard-Lieferung (inklusive)',
          express: 'Express-Lieferung (+€50)',
          setup: 'Komplett-Setup-Service (+€100)'
        }
      },
      payment: {
        title: 'Zahlung & Bestätigung',
        subtitle: 'Überprüfen und schließen Sie Ihre Bestellung ab',
        summary: 'Bestellübersicht',
        subtotal: 'Zwischensumme',
        vat: 'MwSt',
        total: 'Gesamtbetrag',
        paymentMethods: {
          card: 'Kreditkarte',
          transfer: 'Banküberweisung',
          klarna: 'Klarna',
          paypal: 'PayPal'
        },
        confirm: 'Bestätigen & Bezahlen'
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

  const calculatePricing = () => {
    const menuPrice = t.menuSelection.tiers[orderData.menuTier]?.price || 0;
    const guestCount = parseInt(orderData.guestCount) || 0;
    const subtotal = menuPrice * guestCount;
    
    let vatRate = 0;
    let vatAmount = 0;
    let total = 0;

    if (orderData.businessType === 'b2b') {
      vatRate = 19;
      vatAmount = subtotal * 0.19;
      total = subtotal + vatAmount;
    } else {
      vatRate = 7;
      total = subtotal;
      vatAmount = total - (total / 1.07);
    }

    return { subtotal, vatRate, vatAmount, total };
  };

  const { subtotal, vatRate, vatAmount, total } = calculatePricing();

  const Step1 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-elegant">
          {t.businessType.title}
        </h2>
        <p className="text-lg text-gray-600 font-light italic">
          {t.businessType.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {['b2b', 'b2c'].map((type) => (
          <button
            key={type}
            onClick={() => updateOrderData('businessType', type)}
            className={`p-8 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 text-left backdrop-blur-sm bg-white/70 ${
              orderData.businessType === type
                ? 'border-amber-500 bg-amber-50/80 shadow-lg'
                : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-elegant">
              {t.businessType[type].title}
            </h3>
            <p className="text-amber-700 font-semibold mb-4">
              {t.businessType[type].subtitle}
            </p>
            <ul className="space-y-2">
              {t.businessType[type].features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <CheckCircle size={16} className="text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-elegant">
          {t.serviceType.title}
        </h2>
        <p className="text-lg text-gray-600 font-light italic">
          {t.serviceType.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(t.serviceType).filter(([key]) => !['title', 'subtitle'].includes(key)).map(([key, service]) => (
          <button
            key={key}
            onClick={() => updateOrderData('serviceType', key)}
            className={`p-6 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 text-center backdrop-blur-sm bg-white/70 ${
              orderData.serviceType === key
                ? 'border-amber-500 bg-amber-50/80 shadow-lg'
                : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <service.icon size={48} className="text-amber-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-elegant">
              {service.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {service.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-elegant">
          {t.eventInfo.title}
        </h2>
        <p className="text-lg text-gray-600 font-light italic">
          {t.eventInfo.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t.eventInfo.date} *
            </label>
            <input
              type="date"
              value={orderData.eventDate}
              onChange={(e) => updateOrderData('eventDate', e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 backdrop-blur-sm bg-white/70 text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t.eventInfo.time} *
            </label>
            <input
              type="time"
              value={orderData.eventTime}
              onChange={(e) => updateOrderData('eventTime', e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 backdrop-blur-sm bg-white/70 text-gray-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t.eventInfo.guests} *
          </label>
          <input
            type="number"
            min="1"
            value={orderData.guestCount}
            onChange={(e) => updateOrderData('guestCount', e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 backdrop-blur-sm bg-white/70 text-gray-900 placeholder-gray-500"
            placeholder="50"
            required
          />
          <p className="text-sm text-gray-500 mt-2">{t.eventInfo.minGuests}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t.eventInfo.location} *
          </label>
          <input
            type="text"
            value={orderData.location}
            onChange={(e) => updateOrderData('location', e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 backdrop-blur-sm bg-white/70 text-gray-900 placeholder-gray-500"
            placeholder="Enter event address"
            required
          />
        </div>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-elegant">
          {t.menuSelection.title}
        </h2>
        <p className="text-lg text-gray-600 font-light italic">
          {t.menuSelection.subtitle}
        </p>
      </div>

      {/* Menu Tiers */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 font-elegant">Select Menu Tier</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(t.menuSelection.tiers).map(([key, tier]) => (
            <button
              key={key}
              onClick={() => updateOrderData('menuTier', key)}
              className={`p-6 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 text-center backdrop-blur-sm bg-white/70 ${
                orderData.menuTier === key
                  ? 'border-amber-500 bg-amber-50/80 shadow-lg'
                  : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-elegant">{tier.name}</h4>
              <p className="text-2xl font-bold text-amber-700 mb-2">€{tier.price}</p>
              <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
              <div className="text-amber-700 font-semibold">per person</div>
            </button>
          ))}
        </div>
      </div>
{/* Dishes Selection */}
    {orderData.menuTier && (
      <div className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 font-elegant">Select Dishes</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {t.menuSelection.dishes
              .filter(dish => dish.tier.includes(orderData.menuTier))
              .map(dish => (
                <div key={dish.id} className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm bg-white/70 border border-stone-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">{dish.name}</h4>
                    <p className="text-sm text-gray-600">€{dish.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      const isSelected = orderData.selectedDishes.some(d => d.id === dish.id);
                      if (isSelected) {
                        updateOrderData('selectedDishes', orderData.selectedDishes.filter(d => d.id !== dish.id));
                      } else {
                        updateOrderData('selectedDishes', [...orderData.selectedDishes, dish]);
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors backdrop-blur-sm ${
                      orderData.selectedDishes.some(d => d.id === dish.id)
                        ? 'bg-amber-700 text-white'
                        : 'bg-white/70 text-gray-900 border border-stone-300'
                    }`}
                  >
                    {orderData.selectedDishes.some(d => d.id === dish.id) ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Beverages Selection */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 font-elegant">Beverages</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {t.menuSelection.beverages.map(beverage => (
              <div key={beverage.id} className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm bg-white/70 border border-stone-200">
                <div>
                  <h4 className="font-semibold text-gray-900">{beverage.name}</h4>
                  <p className="text-sm text-gray-600">€{beverage.price}</p>
                </div>
                <button
                  onClick={() => {
                    const isSelected = orderData.selectedBeverages.some(b => b.id === beverage.id);
                    if (isSelected) {
                      updateOrderData('selectedBeverages', orderData.selectedBeverages.filter(b => b.id !== beverage.id));
                    } else {
                      updateOrderData('selectedBeverages', [...orderData.selectedBeverages, beverage]);
                    }
                  }}
                  className={`p-2 rounded-lg transition-colors backdrop-blur-sm ${
                    orderData.selectedBeverages.some(b => b.id === beverage.id)
                      ? 'bg-amber-700 text-white'
                      : 'bg-white/70 text-gray-900 border border-stone-300'
                  }`}
                >
                  {orderData.selectedBeverages.some(b => b.id === beverage.id) ? <Minus size={16} /> : <Plus size={16} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);
  const Step5 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-elegant">
          {t.details.title}
        </h2>
        <p className="text-lg text-gray-600 font-light italic">
          {t.details.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t.details.firstName} *
            </label>
            <input
              type="text"
              value={orderData.contactInfo.firstName}
              onChange={(e) => updateOrderData('contactInfo', {
                ...orderData.contactInfo,
                firstName: e.target.value
              })}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 backdrop-blur-sm bg-white/70 text-gray-900 placeholder-gray-500"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t.details.lastName} *
            </label>
            <input
              type="text"
              value={orderData.contactInfo.lastName}
              onChange={(e) => updateOrderData('contactInfo', {
                ...orderData.contactInfo,
                lastName: e.target.value
              })}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 backdrop-blur-sm bg-white/70 text-gray-900 placeholder-gray-500"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t.details.email} *
            </label>
            <input
              type="email"
              value={orderData.contactInfo.email}
              onChange={(e) => updateOrderData('contactInfo', {
                ...orderData.contactInfo,
                email: e.target.value
              })}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 backdrop-blur-sm bg-white/70 text-gray-900 placeholder-gray-500"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t.details.phone} *
            </label>
            <input
              type="tel"
              value={orderData.contactInfo.phone}
              onChange={(e) => updateOrderData('contactInfo', {
                ...orderData.contactInfo,
                phone: e.target.value
              })}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 backdrop-blur-sm bg-white/70 text-gray-900 placeholder-gray-500"
              placeholder="+49 123 456 789"
              required
            />
          </div>
        </div>

        {orderData.businessType === 'b2b' && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t.details.company} *
            </label>
            <input
              type="text"
              value={orderData.contactInfo.company}
              onChange={(e) => updateOrderData('contactInfo', {
                ...orderData.contactInfo,
                company: e.target.value
              })}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 backdrop-blur-sm bg-white/70 text-gray-900 placeholder-gray-500"
              placeholder="Company Name"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t.details.requests}
          </label>
          <textarea
            value={orderData.specialRequests}
            onChange={(e) => updateOrderData('specialRequests', e.target.value)}
            rows="4"
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 resize-none backdrop-blur-sm bg-white/70 text-gray-900 placeholder-gray-500"
            placeholder="Any dietary restrictions or special requirements..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            {t.details.delivery}
          </label>
          <div className="space-y-3">
            {Object.entries(t.details.deliveryOptions).map(([key, option]) => (
              <label key={key} className="flex items-center gap-3 p-4 border border-stone-300 rounded-lg hover:bg-stone-50/50 cursor-pointer transition-colors backdrop-blur-sm bg-white/70">
                <input
                  type="radio"
                  name="delivery"
                  value={key}
                  checked={orderData.deliveryOption === key}
                  onChange={(e) => updateOrderData('deliveryOption', e.target.value)}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="flex-1 text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Step6 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-elegant">
          {t.payment.title}
        </h2>
        <p className="text-lg text-gray-600 font-light italic">
          {t.payment.subtitle}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="rounded-2xl p-6 backdrop-blur-sm bg-white/70 border border-stone-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 font-elegant">
            {t.payment.summary}
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">{t.serviceType[orderData.serviceType]?.title}</span>
              <span className="font-semibold">{orderData.guestCount} guests</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Menu Tier</span>
              <span className="font-semibold">{t.menuSelection.tiers[orderData.menuTier]?.name}</span>
            </div>
            
            <div className="border-t border-stone-300 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">{t.payment.subtotal}</span>
                <span className="font-semibold">€{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">{t.payment.vat} ({vatRate}%)</span>
                <span className="font-semibold">€{vatAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-stone-300 pt-4">
                <span>{t.payment.total}</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 font-elegant">
            Payment Method
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(t.payment.paymentMethods).map(([key, method]) => (
              <button
                key={key}
                className="p-4 border-2 border-stone-300 rounded-lg hover:border-amber-500 hover:bg-amber-50/50 transition-all duration-300 text-center backdrop-blur-sm bg-white/70"
              >
                <CreditCard size={24} className="text-amber-700 mx-auto mb-2" />
                <span className="font-semibold text-gray-900">{method}</span>
              </button>
            ))}
          </div>

          <button className="w-full bg-amber-700 text-white py-4 px-6 rounded-lg font-semibold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center gap-2 backdrop-blur-sm">
            <CheckCircle size={20} />
            {t.payment.confirm}
          </button>
        </div>
      </div>
    </div>
  );

  const steps = [Step1, Step2, Step3, Step4, Step5, Step6];
  const CurrentStep = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100">
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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .font-elegant {
          font-family: 'Playfair Display', serif;
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold text-gray-900 font-elegant italic">
              <img src="/images/logo.png" alt="" className="w-50 h-auto" />
            </div>
            
            <div className="hidden md:flex items-center gap-8">
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
              <button className="px-4 py-2 text-sm border border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 font-medium backdrop-blur-sm bg-white/70">
                {t.nav.connect}
              </button>
            </div>

            <button 
              className="md:hidden transition-transform duration-300 hover:scale-110"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Progress Bar & Navigation Buttons - Fixed at Top */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button - Separate Row */}
          <div className="py-4 border-b border-gray-200">
            <button
              onClick={handleBackToHome}
              className="px-4 py-2 text-gray-700 hover:text-amber-700 rounded-lg font-semibold transition-all duration-300 inline-flex items-center gap-2 backdrop-blur-sm bg-white/70 border border-stone-300 hover:border-amber-300 hover:bg-amber-50/50"
            >
              <ArrowLeft size={18} />
              {t.buttons.backToHome}
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between py-4">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 backdrop-blur-sm ${
                  step <= currentStep
                    ? 'bg-amber-700 border-amber-700 text-white'
                    : 'border-stone-300 bg-white/70 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 6 && (
                  <div className={`flex-1 h-1 transition-all duration-300 backdrop-blur-sm ${
                    step < currentStep ? 'bg-amber-700' : 'bg-stone-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Step Labels */}
          <div className="flex justify-between text-sm text-gray-600 pb-4">
            {Object.values(t.steps).map((stepName, index) => (
              <div
                key={index}
                className={`transition-all duration-300 text-xs ${
                  index + 1 === currentStep ? 'text-amber-700 font-semibold' : ''
                }`}
              >
                {stepName}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center py-4 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 inline-flex items-center gap-2 backdrop-blur-sm ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed bg-white/30'
                  : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50/50 bg-white/70 border border-stone-300'
              }`}
            >
              <ChevronLeft size={18} />
              {t.buttons.back}
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600">Step {currentStep} of 6</span>
            </div>

            <button
              onClick={nextStep}
              className="px-6 py-2 bg-amber-700 text-white rounded-lg font-semibold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center gap-2 backdrop-blur-sm"
            >
              {currentStep === 6 ? t.buttons.confirm : t.buttons.next}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Container - Starts below fixed navigation */}
      <div className="pt-64 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl backdrop-blur-xl bg-white/60 border border-white/20 shadow-2xl overflow-hidden">
            <div className="p-18 max-h-[60vh] overflow-y-auto">
              <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <CurrentStep />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/80 text-white py-12 px-4 sm:px-6 lg:px-8 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">&copy; 2025 La Cannelle Catering. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}