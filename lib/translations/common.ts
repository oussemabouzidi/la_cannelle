import type { Language } from '../hooks/useTranslation';

type CommonTranslations = Record<Language, {
  nav: {
    home: string;
    about: string;
    services: string;
    menus: string;
    contact: string;
    connect: string;
    order: string;
  };
  footer: {
    quickLinks: string;
    contact: string;
    followUs: string;
  };
  buttons: {
    next: string;
    back: string;
    confirm: string;
    backToHome: string;
  };
}>;

export const commonTranslations: CommonTranslations = {
  EN: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      menus: 'Menus',
      contact: 'Contact',
      connect: 'Connect',
      order: 'Order',
    },
    footer: {
      quickLinks: 'Quick Links',
      contact: 'Contact',
      followUs: 'Follow Us',
    },
    buttons: {
      next: 'Next',
      back: 'Back',
      confirm: 'Confirm',
      backToHome: 'Back to Home',
    },
  },
  DE: {
    nav: {
      home: 'Startseite',
      about: 'Über uns',
      services: 'Dienstleistungen',
      menus: 'Menüs',
      contact: 'Kontakt',
      connect: 'Verbinden',
      order: 'Bestellen',
    },
    footer: {
      quickLinks: 'Schnellzugriff',
      contact: 'Kontakt',
      followUs: 'Folgen Sie uns',
    },
    buttons: {
      next: 'Weiter',
      back: 'Zurück',
      confirm: 'Bestätigen',
      backToHome: 'Zurück zur Startseite',
    },
  },
};
