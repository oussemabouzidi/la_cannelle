import type { Language } from '../hooks/useTranslation';

type AdminTranslations = {
  nav: {
    dashboard: string;
    orders: string;
    menu: string;
    customers: string;
    reports: string;
    system: string;
  };
  labels: {
    viewAllOrders: string;
  };
};

export const adminTranslations: Record<Language, AdminTranslations> = {
  EN: {
    nav: {
      dashboard: 'Dashboard',
      orders: 'Orders',
      menu: 'Menu Management',
      customers: 'Customers',
      reports: 'Reports',
      system: 'System Control',
    },
    labels: {
      viewAllOrders: 'View All Orders',
    },
  },
  DE: {
    nav: {
      dashboard: 'Übersicht',
      orders: 'Bestellungen',
      menu: 'Menüverwaltung',
      customers: 'Kunden',
      reports: 'Berichte',
      system: 'Systemsteuerung',
    },
    labels: {
      viewAllOrders: 'Alle Bestellungen ansehen',
    },
  },
};
