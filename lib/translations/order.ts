import { commonTranslations } from './common';

// Steps configuration for order page
const stepsConfig = [
  { key: 'eventType', label: 'Event Type' },
  { key: 'service', label: 'Service' },
  { key: 'event', label: 'Event Info' },
  { key: 'menu', label: 'Menu Selection' },
  { key: 'starters', label: 'Starters' },
  { key: 'mains', label: 'Mains' },
  { key: 'sides', label: 'Sides' },
  { key: 'desserts', label: 'Desserts' },
  { key: 'drinks', label: 'Drinks' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'details', label: 'Delivery Details' },
  { key: 'payment', label: 'Payment' }
];

export const orderTranslations = {
  EN: {
    ...commonTranslations.EN,
    steps: stepsConfig.reduce((acc, step) => {
      acc[step.key] = step.label;
      return acc;
    }, {} as Record<string, string>),
    eventType: {
      title: 'Choose your occasion',
      subtitle: 'Select whether this is a business or private event',
      options: {
        business: {
          title: 'Business Event',
          subtitle: 'Teams, clients, fairs'
        },
        private: {
          title: 'Private Occasion',
          subtitle: 'Family and friends celebrations'
        }
      }
    },
    serviceType: {
      title: 'Service focus',
      subtitle: 'Tell us what kind of catering you need next',
      options: {
        business: [
          { key: 'office', title: 'Office Catering', description: 'In-office lunches and meetings' },
          { key: 'corporate', title: 'Corporate Events', description: 'Receptions, galas and client dinners' },
          { key: 'fair', title: 'Event & Fair Catering', description: 'Trade shows and public events' }
        ],
        private: [
          { key: 'wedding', title: 'Wedding', description: 'Ceremony, dinner and brunch' },
          { key: 'party', title: 'Partyservice', description: 'Birthdays and private parties' }
        ]
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
      subtitle: 'Select items from each category',
      orderSummary: 'Order Summary',
      starters: 'Starters',
      mains: 'Main Courses',
      sides: 'Sides',
      desserts: 'Desserts',
      drinks: 'Beverages'
    },
    accessories: {
      title: 'Accessories & Extras',
      subtitle: 'Add finishing touches to your event',
      orderOverview: 'Order Overview',
      deliveryDate: 'Delivery Date',
      postalCode: 'Postal Code',
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
    },
    review: {
      title: 'Review Your Order',
      subtitle: 'Please review all details before confirming',
      orderSummary: 'Order Summary',
      eventDetails: 'Event Details',
      items: 'Items',
      subtotal: 'Subtotal',
      serviceFee: 'Service Fee',
      total: 'Total',
      confirm: 'Confirm Order',
      minOrder: "Minimum order of ƒ'ª388.80 required"
    }
  },
  DE: {
    ...commonTranslations.DE,
    steps: stepsConfig.reduce((acc, step) => {
      acc[step.key] = step.label;
      return acc;
    }, {} as Record<string, string>),
    eventType: {
      title: 'Anlass wählen',
      subtitle: 'Business Event oder privater Anlass auswählen',
      options: {
        business: {
          title: 'Business Event',
          subtitle: 'Teams, Kunden, Messen'
        },
        private: {
          title: 'Privater Anlass',
          subtitle: 'Familie & Freunde feiern'
        }
      }
    },
    serviceType: {
      title: 'Leistung auswählen',
      subtitle: 'Was benötigen Sie als nächstes?',
      options: {
        business: [
          { key: 'office', title: 'Office Catering', description: 'Lunch & Meetings im Büro' },
          { key: 'corporate', title: 'Corporate Events', description: 'Empfänge, Galas, Kundenevents' },
          { key: 'fair', title: 'Event- & Messe-Catering', description: 'Messen und öffentliche Events' }
        ],
        private: [
          { key: 'wedding', title: 'Hochzeit', description: 'Zeremonie, Dinner & Brunch' },
          { key: 'party', title: 'Partyservice', description: 'Geburtstage & private Feiern' }
        ]
      }
    },
    eventInfo: {
      title: 'Veranstaltungsinformation',
      subtitle: 'Erzählen Sie uns von Ihrer Veranstaltung',
      date: 'Lieferdatum',
      time: 'Uhrzeit',
      guests: 'Personenanzahl',
      location: 'Postleitzahl',
      minGuests: 'Mindestens 10 Personen erforderlich'
    },
    menuSelection: {
      title: 'Menü-Auswahl',
      subtitle: 'Wählen Sie Ihr bevorzugtes Menü'
    },
    productSelection: {
      title: 'Menü-Artikel',
      subtitle: 'Wählen Sie Artikel aus jeder Kategorie',
      orderSummary: 'Bestellübersicht',
      starters: 'Vorspeisen',
      mains: 'Hauptgerichte',
      sides: 'Beilagen',
      desserts: 'Nachspeisen',
      drinks: 'Getränke'
    },
    accessories: {
      title: 'Zubehör & Extras',
      subtitle: 'Fügen Sie letzte Details zu Ihrer Veranstaltung hinzu',
      orderOverview: 'Bestellübersicht',
      deliveryDate: 'Lieferdatum',
      postalCode: 'Postleitzahl',
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
      confirm: 'Bestellung bestätigen',
      backToHome: 'Zurück zur Startseite'
    },
    review: {
      title: 'Bestellung überprüfen',
      subtitle: 'Bitte überprüfen Sie alle Details vor der Bestätigung',
      orderSummary: 'Bestellübersicht',
      eventDetails: 'Veranstaltungsdetails',
      items: 'Artikel',
      subtotal: 'Zwischensumme',
      serviceFee: 'Servicegebühr',
      total: 'Gesamt',
      confirm: 'Bestellung bestätigen',
      minOrder: "Mindestbestellung von ƒ'ª388.80 erforderlich"
    }
  }
};
