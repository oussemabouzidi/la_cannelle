import type { Language } from '../hooks/useTranslation';

type MenusTranslations = {
  nav: { about: string; services: string; menus: string; contact: string; connect: string; order: string };
  hero: { title: string; subtitle: string };
};

const base: MenusTranslations = {
  nav: {
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
  EN: base,
  DE: {
    nav: {
      about: 'Über uns',
      services: 'Dienstleistungen',
      menus: 'Menüs',
      contact: 'Kontakt',
      connect: 'Verbinden',
      order: 'Jetzt bestellen',
    },
    hero: {
      title: 'Unsere Menüs',
      subtitle: 'Sorgfältig gestaltete kulinarische Erlebnisse für jeden Anlass',
    },
  },
};
