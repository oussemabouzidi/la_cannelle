import type { Language } from '../hooks/useTranslation';

type MenusTranslations = {
  nav: { home: string; about: string; services: string; menus: string; contact: string; connect: string; order: string };
  hero: { title: string; subtitle: string };
  categories: Record<string, string>;
  menuHighlights: {
    title: string;
    subtitle: string;
    viewDetails: string;
    includes: string;
    noItems: string;
    priceLabel: string;
  };
  labels: {
    dishesAvailable: string;
    exclVat: string;
    minPeople: (count: number) => string;
    fromPerPerson: (price: string) => string;
    selectFood: string;
    loadingMenus: string;
    noMenusAvailable: string;
    menusLoadFailed: string;
  };
};

const base: Pick<MenusTranslations, 'nav' | 'hero'> = {
  nav: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    menus: 'Menus',
    contact: 'Contact',
    connect: 'Connect',
    order: 'Order Now',
  },
  hero: {
    title: 'Our Menus',
    subtitle: 'Carefully crafted culinary experiences for every occasion',
  },
};

export const menusTranslations: Record<Language, MenusTranslations> = {
  EN: {
    ...base,
    categories: {
      general: 'General',
      starters: 'Starters',
      mains: 'Mains',
      sides: 'Sides',
      desserts: 'Desserts',
      drinks: 'Drinks',
    },
    menuHighlights: {
      title: 'Menu Highlights',
      subtitle: 'Explore our signature menus and view the details',
      viewDetails: 'View details',
      includes: 'Includes',
      noItems: 'Menu details available upon request.',
      priceLabel: 'Starting at',
    },
    labels: {
      dishesAvailable: 'dishes available',
      exclVat: 'Excl. VAT',
      minPeople: (count) => `${count} guest minimum`,
      fromPerPerson: (price) => `From EUR ${price}/person`,
      selectFood: 'Select Food',
      loadingMenus: 'Loading menus...',
      noMenusAvailable: 'No menus available right now.',
      menusLoadFailed: 'Unable to load menus right now.',
    },
  },
  DE: {
    nav: {
      home: 'Startseite',
      about: 'Ueber uns',
      services: 'Dienstleistungen',
      menus: 'Menues',
      contact: 'Kontakt',
      connect: 'Verbinden',
      order: 'Jetzt bestellen',
    },
    hero: {
      title: 'Unsere Menues',
      subtitle: 'Sorgfaeltig gestaltete kulinarische Erlebnisse fuer jeden Anlass',
    },
    categories: {
      general: 'Allgemein',
      starters: 'Vorspeisen',
      mains: 'Hauptgaenge',
      sides: 'Beilagen',
      desserts: 'Desserts',
      drinks: 'Getraenke',
    },
    menuHighlights: {
      title: 'Menue Highlights',
      subtitle: 'Entdecken Sie unsere Menues und sehen Sie die Details',
      viewDetails: 'Details ansehen',
      includes: 'Enthaelt',
      noItems: 'Menue-Details sind auf Anfrage verfuegbar.',
      priceLabel: 'Ab',
    },
    labels: {
      dishesAvailable: 'Gerichte verfuegbar',
      exclVat: 'zzgl. MwSt.',
      minPeople: (count) => `${count} Personen Minimum`,
      fromPerPerson: (price) => `Ab EUR ${price}/Person`,
      selectFood: 'Speisen auswaehlen',
      loadingMenus: 'Menues werden geladen...',
      noMenusAvailable: 'Aktuell sind keine Menues verfuegbar.',
      menusLoadFailed: 'Menues konnten gerade nicht geladen werden.',
    },
  },
};
