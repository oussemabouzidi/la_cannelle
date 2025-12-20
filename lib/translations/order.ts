import type { Language } from '../hooks/useTranslation';

type OrderTranslations = {
  nav: { connect: string };
  buttons: { back: string; next: string; confirm: string; backToHome: string };
  eventType: {
    title: string;
    subtitle: string;
    options: {
      business: { title: string; subtitle: string };
      private: { title: string; subtitle: string };
    };
  };
  serviceType: {
    title: string;
    subtitle: string;
    options: {
      business: { key: string; title: string; description: string }[];
      private: { key: string; title: string; description: string }[];
    };
  };
  eventInfo: {
    title: string;
    subtitle: string;
    date: string;
    time: string;
    guests: string;
    minGuests: string;
    location: string;
  };
  menuSelection: { title: string; subtitle: string };
  productSelection: {
    orderSummary: string;
    starters: string;
    mains: string;
    sides: string;
    desserts: string;
    drinks: string;
    subtitles: {
      starters: string;
      mains: string;
      sides: string;
      desserts: string;
      drinks: string;
    };
  };
  accessories: {
    title: string;
    subtitle: string;
    include: string;
    deliveryDate: string;
    postalCode: string;
    continueWithout: string;
    orderOverview: string;
    items: {
      id: string;
      name: string;
      description: string;
      details?: string;
      price: number;
      unit: string;
      minQuantity?: number;
    }[];
  };
  delivery: {
    title: string;
    subtitle: string;
    contact: { first: string; last: string; email: string; phone: string; company: string };
    requests: string;
  };
  payment: {
    title: string;
    subtitle: string;
    method: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
    name: string;
    terms: string;
    payCta: string;
  };
};

const en: OrderTranslations = {
  nav: { connect: 'Connect' },
  buttons: { back: 'Back', next: 'Next', confirm: 'Confirm', backToHome: 'Back to Home' },
  eventType: {
    title: 'Select your occasion',
    subtitle: 'Tell us what you’re planning',
    options: {
      business: { title: 'Business', subtitle: 'Corporate, meetings, launches' },
      private: { title: 'Private', subtitle: 'Weddings, parties, family events' },
    },
  },
  serviceType: {
    title: 'Choose a service',
    subtitle: 'Pick the format that fits your event',
    options: {
      business: [
        { key: 'buffet', title: 'Buffet', description: 'Flexible self-serve format.' },
        { key: 'plated', title: 'Plated', description: 'Restaurant-style service.' },
        { key: 'fingerfood', title: 'Finger Food', description: 'Light bites for networking.' },
      ],
      private: [
        { key: 'family', title: 'Family Style', description: 'Shared dishes for lively tables.' },
        { key: 'cocktail', title: 'Cocktail', description: 'Elegant canapés and drinks.' },
        { key: 'bbq', title: 'BBQ', description: 'Outdoor and casual experiences.' },
      ],
    },
  },
  eventInfo: {
    title: 'Event details',
    subtitle: 'When and where is your event?',
    date: 'Event Date',
    time: 'Event Time',
    guests: 'Number of Guests',
    minGuests: 'Minimum 11 guests',
    location: 'Postal Code / Location',
  },
  menuSelection: { title: 'Menu selection', subtitle: 'Pick a curated menu' },
  productSelection: {
    orderSummary: 'Order summary',
    starters: 'Starters',
    mains: 'Mains',
    sides: 'Sides',
    desserts: 'Desserts',
    drinks: 'Drinks',
    subtitles: {
      starters: 'Begin with light starters.',
      mains: 'Choose the main dishes.',
      sides: 'Pick sides to complement the menu.',
      desserts: 'Sweet finishes for your guests.',
      drinks: 'Add beverages for everyone.',
    },
  },
  accessories: {
    title: 'Accessories & extras',
    subtitle: 'Add rentals and extras',
    include: 'Include accessories',
    deliveryDate: 'Delivery Date',
    postalCode: 'Postal Code',
    continueWithout: 'Continue without accessories',
    orderOverview: 'Delivery details',
    items: [
      {
        id: 'premium-dinnerware',
        name: 'Premium Dinnerware',
        description: 'Ceramic plate, cutlery, and linen napkin per guest.',
        details: 'Collected after the event.',
        price: 3.0,
        unit: '/ guest',
      },
      {
        id: 'eco-disposables',
        name: 'Eco Disposable Set',
        description: 'Compostable plate, fork, knife, and napkin per guest.',
        details: 'Ideal for outdoor events.',
        price: 1.5,
        unit: '/ guest',
      },
      {
        id: 'glassware',
        name: 'Glassware Set',
        description: 'Water and wine glasses per guest.',
        details: 'Includes wash and pickup.',
        price: 1.8,
        unit: '/ guest',
      },
      {
        id: 'table-linens',
        name: 'Table Linens',
        description: 'Clean white table linen per guest seat.',
        details: 'Pressed and delivered with setup.',
        price: 1.2,
        unit: '/ guest',
      },
      {
        id: 'serving-utensils',
        name: 'Serving Utensils',
        description: 'Serving spoons and tongs for buffet lines.',
        details: 'Included with menu orders.',
        price: 0,
        unit: '',
      },
    ],
  },
  delivery: {
    title: 'Delivery details',
    subtitle: 'How can we reach you?',
    contact: { first: 'First Name', last: 'Last Name', email: 'Email Address', phone: 'Phone Number', company: 'Company (Optional)' },
    requests: 'Special Requests',
  },
  payment: {
    title: 'Payment Details',
    subtitle: 'Secure payment with SSL encryption',
    method: 'Select Payment Method',
    cardNumber: 'Card Number',
    expiry: 'Expiry Date',
    cvc: 'CVC',
    name: 'Name on Card',
    terms: 'I agree to the Terms & Conditions and Privacy Policy.',
    payCta: 'Pay securely',
  },
};

const de: OrderTranslations = {
  nav: { connect: 'Verbinden' },
  buttons: { back: 'Zurück', next: 'Weiter', confirm: 'Bestätigen', backToHome: 'Zurück zur Startseite' },
  eventType: {
    title: 'Anlass wählen',
    subtitle: 'Erzählen Sie uns von Ihrem Event',
    options: {
      business: { title: 'Business', subtitle: 'Corporate, Meetings, Launches' },
      private: { title: 'Privat', subtitle: 'Hochzeiten, Feiern, Familie' },
    },
  },
  serviceType: {
    title: 'Service wählen',
    subtitle: 'Wählen Sie das passende Format',
    options: {
      business: [
        { key: 'buffet', title: 'Buffet', description: 'Flexibles Self-Service Konzept.' },
        { key: 'plated', title: 'Gedecktes Menü', description: 'Service wie im Restaurant.' },
        { key: 'fingerfood', title: 'Fingerfood', description: 'Snacks für Networking.' },
      ],
      private: [
        { key: 'family', title: 'Family Style', description: 'Geteilte Gerichte für große Tafeln.' },
        { key: 'cocktail', title: 'Cocktail', description: 'Elegante Häppchen und Drinks.' },
        { key: 'bbq', title: 'Grill', description: 'Locker und im Freien.' },
      ],
    },
  },
  eventInfo: {
    title: 'Eventdetails',
    subtitle: 'Wann und wo findet es statt?',
    date: 'Datum',
    time: 'Uhrzeit',
    guests: 'Anzahl Gäste',
    minGuests: 'Mindestens 11 Gaeste',
    location: 'Postleitzahl / Ort',
  },
  menuSelection: { title: 'Menüauswahl', subtitle: 'Wählen Sie ein kuratiertes Menü' },
  productSelection: {
    orderSummary: 'Bestellübersicht',
    starters: 'Vorspeisen',
    mains: 'Hauptgänge',
    sides: 'Beilagen',
    desserts: 'Desserts',
    drinks: 'Getränke',
    subtitles: {
      starters: 'Starte mit leichten Vorspeisen.',
      mains: 'Waehle die Hauptgaenge.',
      sides: 'Ergaenze mit passenden Beilagen.',
      desserts: 'Suesser Abschluss fuer deine Gaeste.',
      drinks: 'Fuege Getraenke fuer alle hinzu.',
    },
  },
  accessories: {
    title: 'Extras & Zubehör',
    subtitle: 'Mieten und Extras hinzufügen',
    include: 'Zubehör hinzufügen',
    deliveryDate: 'Lieferdatum',
    postalCode: 'Postleitzahl',
    continueWithout: 'Ohne Zubehör fortfahren',
    orderOverview: 'Lieferdetails',
    items: [
      {
        id: 'premium-dinnerware',
        name: 'Premium Tafelservice',
        description: 'Keramikteller, Besteck und Leinenserviette pro Gast.',
        details: 'Wird nach dem Event abgeholt.',
        price: 3.0,
        unit: '/ Gast',
      },
      {
        id: 'eco-disposables',
        name: 'Oeko Einweg-Set',
        description: 'Kompostierbarer Teller, Gabel, Messer und Serviette pro Gast.',
        details: 'Ideal fuer Outdoor-Events.',
        price: 1.5,
        unit: '/ Gast',
      },
      {
        id: 'glassware',
        name: 'Glas-Set',
        description: 'Wasser- und Weinglaeser pro Gast.',
        details: 'Inklusive Reinigung und Abholung.',
        price: 1.8,
        unit: '/ Gast',
      },
      {
        id: 'table-linens',
        name: 'Tischwaesche',
        description: 'Saubere weisse Tischwaesche pro Sitzplatz.',
        details: 'Gepresst und geliefert.',
        price: 1.2,
        unit: '/ Gast',
      },
      {
        id: 'serving-utensils',
        name: 'Servierbesteck',
        description: 'Servierloeffel und Zangen fuer Buffets.',
        details: 'Im Menue enthalten.',
        price: 0,
        unit: '',
      },
    ],
  },
  delivery: {
    title: 'Lieferdetails',
    subtitle: 'Wie erreichen wir Sie?',
    contact: { first: 'Vorname', last: 'Nachname', email: 'E-Mail', phone: 'Telefonnummer', company: 'Firma (optional)' },
    requests: 'Besondere Wünsche',
  },
  payment: {
    title: 'Zahlungsdetails',
    subtitle: 'Sichere Zahlung mit SSL',
    method: 'Zahlungsmethode auswählen',
    cardNumber: 'Kartennummer',
    expiry: 'Ablaufdatum',
    cvc: 'CVC',
    name: 'Name auf der Karte',
    terms: 'Ich stimme den AGB und der Datenschutzerklärung zu.',
    payCta: 'Sicher bezahlen',
  },
};

export const orderTranslations: Record<Language, OrderTranslations> = {
  EN: en,
  DE: de,
};
