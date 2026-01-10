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
      business: { key: string; title: string; description: string; image: string }[];
      private: { key: string; title: string; description: string; image: string }[];
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
    dateConstraint: string;
    dateConstraintLarge: string;
  };
  menuSelection: { title: string; subtitle: string };
  menuMinPeoplePrompt: {
    title: string;
    description: (menuMinGuests: number, selectedGuests: number) => string;
    useMenuMin: (menuMinGuests: number) => string;
    keepSelected: (selectedGuests: number) => string;
    cancel: string;
  };
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
    subtitle: "Tell us what you're planning",
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
        { key: 'buffet', title: 'Buffet', description: 'Flexible self-serve format.', image: '/images/mediterranean-buffet.jpg' },
        { key: 'plated', title: 'Plated', description: 'Restaurant-style service.', image: '/images/beef-wellington.jpg' },
        { key: 'fingerfood', title: 'Finger Food', description: 'Light bites for networking.', image: '/images/truffle-arancini.jpg' },
      ],
      private: [
        { key: 'family', title: 'Family Style', description: 'Shared dishes for lively tables.', image: '/images/community-feast.jpg' },
        { key: 'cocktail', title: 'Cocktail', description: 'Elegant canapes and drinks.', image: '/images/chocolate-sphere.jpg' },
        { key: 'bbq', title: 'BBQ', description: 'Outdoor and casual experiences.', image: '/images/lamb.jpg' },
      ],
    },
  },
  eventInfo: {
    title: 'Event details',
    subtitle: 'When and where is your event?',
    date: 'Event Date',
    time: 'Event Time',
    guests: 'Number of Guests',
    minGuests: 'Minimum 10 guests',
    location: 'Postal Code / Location',
    dateConstraint: 'Earliest selectable date is {date} (48h lead time).',
    dateConstraintLarge: 'Earliest selectable date is {date} (72h lead time for groups of 100 or more guests).',
  },
  menuSelection: { title: 'Menu selection', subtitle: 'Pick a curated menu' },
  menuMinPeoplePrompt: {
    title: 'Guest count for this menu',
    description: (menuMinGuests, selectedGuests) =>
      `This menu has a minimum of ${menuMinGuests} guests. Do you want to continue with ${menuMinGuests} guests or keep your selected ${selectedGuests}?`,
    useMenuMin: (menuMinGuests) => `Use ${menuMinGuests} guests (menu minimum)`,
    keepSelected: (selectedGuests) => `Keep ${selectedGuests} guests`,
    cancel: 'Cancel',
  },
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
        name: 'Eco Disposables Set',
        description: 'Compostable plate, fork, knife and napkin per guest.',
        details: 'Great for outdoor events.',
        price: 1.5,
        unit: '/ guest',
      },
      {
        id: 'glassware',
        name: 'Glassware Set',
        description: 'Water and wine glasses per guest.',
        details: 'Includes washing and pickup.',
        price: 1.8,
        unit: '/ guest',
      },
      {
        id: 'table-linens',
        name: 'Table Linens',
        description: 'Clean white table linen per seat.',
        details: 'Pressed and delivered.',
        price: 1.2,
        unit: '/ guest',
      },
      {
        id: 'serving-utensils',
        name: 'Serving Utensils',
        description: 'Serving spoons and tongs for buffets.',
        details: 'Included with menu.',
        price: 0,
        unit: '',
      },
    ],
  },
  delivery: {
    title: 'Delivery details',
    subtitle: 'How can we reach you?',
    contact: { first: 'First Name', last: 'Last Name', email: 'Email', phone: 'Phone', company: 'Company (optional)' },
    requests: 'Special requests',
  },
  payment: {
    title: 'Payment details',
    subtitle: 'Secure payment with SSL',
    method: 'Select payment method',
    cardNumber: 'Card number',
    expiry: 'Expiry date',
    cvc: 'CVC',
    name: 'Name on card',
    terms: 'I agree to the Terms & Conditions and Privacy Policy.',
    payCta: 'Pay securely',
  },
};

const de: OrderTranslations = {
  nav: { connect: 'Verbinden' },
  buttons: { back: 'Zurueck', next: 'Weiter', confirm: 'Bestaetigen', backToHome: 'Zurueck zur Startseite' },
  eventType: {
    title: 'Anlass waehlen',
    subtitle: 'Erzaehlen Sie uns von Ihrem Event',
    options: {
      business: { title: 'Business', subtitle: 'Firmenevents, Besprechungen, Produkteinfuehrungen' },
      private: { title: 'Privat', subtitle: 'Hochzeiten, Feiern, Familie' },
    },
  },
  serviceType: {
    title: 'Service waehlen',
    subtitle: 'Waehlen Sie das passende Format',
    options: {
      business: [
        { key: 'buffet', title: 'Buffet', description: 'Flexibles Self-Service Konzept.', image: '/images/mediterranean-buffet.jpg' },
        { key: 'plated', title: 'Gedecktes Menue', description: 'Service wie im Restaurant.', image: '/images/beef-wellington.jpg' },
        { key: 'fingerfood', title: 'Fingerfood', description: 'Snacks fuer Networking.', image: '/images/truffle-arancini.jpg' },
      ],
      private: [
        { key: 'family', title: 'Family Style', description: 'Geteilte Gerichte fuer grosse Tafeln.', image: '/images/community-feast.jpg' },
        { key: 'cocktail', title: 'Cocktail', description: 'Elegante Haeppchen und Drinks.', image: '/images/chocolate-sphere.jpg' },
        { key: 'bbq', title: 'Grill', description: 'Locker und im Freien.', image: '/images/lamb.jpg' },
      ],
    },
  },
  eventInfo: {
    title: 'Eventdetails',
    subtitle: 'Wann und wo findet es statt?',
    date: 'Datum',
    time: 'Uhrzeit',
    guests: 'Anzahl Gaeste',
    minGuests: 'Mindestens 10 Gaeste',
    location: 'Postleitzahl / Ort',
    dateConstraint: 'Erstes auswaehlbares Datum ist {date} (48h Vorlaufzeit).',
    dateConstraintLarge: 'Erstes auswaehlbares Datum ist {date} (72h Vorlaufzeit fuer Gruppen ab 100 Gaesten).',
  },
  menuSelection: { title: 'Menueauswahl', subtitle: 'Waehlen Sie ein kuratiertes Menue' },
  menuMinPeoplePrompt: {
    title: 'Gaesteanzahl fuer dieses Menue',
    description: (menuMinGuests, selectedGuests) =>
      `Dieses Menue hat ein Minimum von ${menuMinGuests} Gaesten. Moechten Sie mit ${menuMinGuests} Gaesten fortfahren oder Ihre Auswahl (${selectedGuests}) behalten?`,
    useMenuMin: (menuMinGuests) => `Mit ${menuMinGuests} Gaesten fortfahren (Menue-Minimum)`,
    keepSelected: (selectedGuests) => `Bei ${selectedGuests} Gaesten bleiben`,
    cancel: 'Abbrechen',
  },
  productSelection: {
    orderSummary: 'Bestelluebersicht',
    starters: 'Vorspeisen',
    mains: 'Hauptgaenge',
    sides: 'Beilagen',
    desserts: 'Desserts',
    drinks: 'Getraenke',
    subtitles: {
      starters: 'Starte mit leichten Vorspeisen.',
      mains: 'Waehle die Hauptgaenge.',
      sides: 'Ergaenze mit passenden Beilagen.',
      desserts: 'Suesser Abschluss fuer deine Gaeste.',
      drinks: 'Fuege Getraenke fuer alle hinzu.',
    },
  },
  accessories: {
    title: 'Extras & Zubehoer',
    subtitle: 'Mieten und Extras hinzufuegen',
    include: 'Zubehoer hinzufuegen',
    deliveryDate: 'Lieferdatum',
    postalCode: 'Postleitzahl',
    continueWithout: 'Ohne Zubehoer fortfahren',
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
    contact: { first: 'Vorname', last: 'Nachname', email: 'E-Mail-Adresse', phone: 'Telefonnummer', company: 'Firma (optional)' },
    requests: 'Besondere Wuensche',
  },
  payment: {
    title: 'Zahlungsdetails',
    subtitle: 'Sichere Zahlung mit SSL',
    method: 'Zahlungsmethode auswaehlen',
    cardNumber: 'Kartennummer',
    expiry: 'Ablaufdatum',
    cvc: 'CVC',
    name: 'Name auf der Karte',
    terms: 'Ich stimme den AGB und der Datenschutzerklaerung zu.',
    payCta: 'Sicher bezahlen',
  },
};

export const orderTranslations: Record<Language, OrderTranslations> = {
  EN: en,
  DE: de,
};
