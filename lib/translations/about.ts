import type { Language } from '../hooks/useTranslation';

type AboutContent = {
  nav: { services: string; menus: string; contact: string; connect: string; order: string };
  hero: { title: string; subtitle: string };
  story: { title: string; content: string[] };
  valuesSection: { title: string; subtitle: string };
  values: {
    passion: { title: string; subtitle: string; description: string };
    exclusivity: { title: string; subtitle: string; description: string };
    company: { title: string; subtitle: string; description: string };
  };
  team: { title: string; items: { name: string; role: string }[] };
  services: { title: string; items: { title: string; description: string }[] };
  contact: { title: string; address: string; phone: string; mobile: string; email: string };
  contactLabels: { address: string; phone: string; email: string };
  cta: { title: string; subtitle: string; button: string };
  quoteModal: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    phone: string;
    eventType: string;
    eventTypePlaceholder: string;
    eventDate: string;
    guests: string;
    message: string;
    submit: string;
    cancel: string;
    eventTypes: string[];
  };
  alerts: { quoteSubmitted: string };
  footer: { quickLinks: string; contact: string; followUs: string };
  body: { style: string };
};

type AboutTranslations = Record<Language, AboutContent>;

export const aboutTranslations: AboutTranslations = {
  EN: {
    nav: { services: 'Services', menus: 'Menus', contact: 'Contact', connect: 'Connect', order: 'Order' },
    hero: { title: 'About Us', subtitle: 'Crafting culinary excellence since our inception' },
    story: {
      title: 'Our Story',
      content: [
        'We partner closely with clients to understand their vision and deliver bespoke experiences.',
        'Chefs craft seasonal menus that balance flavor, presentation, and dietary needs.',
        'From intimate gatherings to large events, every detail is handled with care.',
      ],
    },
    valuesSection: {
      title: 'Our values',
      subtitle: 'What guides our work and guest experience.',
    },
    values: {
      passion: { title: 'Passion', subtitle: 'Heart in every dish', description: 'Love for food and service drives everything we do.' },
      exclusivity: { title: 'Exclusivity', subtitle: 'Private experiences', description: 'Private, bespoke experiences crafted for your occasion.' },
      company: { title: 'Trusted Partner', subtitle: 'Your reliable ally', description: 'A dedicated team focused on your success.' },
    },
    team: {
      title: 'Our Team',
      items: [
        { name: 'Head Chef', role: 'Culinary Direction' },
        { name: 'Event Manager', role: 'Planning & Coordination' },
        { name: 'Pastry Lead', role: 'Desserts & Baking' },
        { name: 'Service Lead', role: 'Front-of-house excellence' },
      ],
    },
    services: {
      title: 'What we offer',
      items: [
        { title: 'Personalized Service', description: 'Tailored menus and attentive coordination.' },
        { title: 'Creative Menus', description: 'Innovative dishes inspired by seasonal ingredients.' },
        { title: 'Reliable Delivery', description: 'Professional team ensuring timely service.' },
      ],
    },
    contact: {
      title: 'Get in touch',
      address: '123 Culinary Street, Food City, FC 12345',
      phone: '+1 (555) 123-4567',
      mobile: '+1 (555) 987-6543',
      email: 'info@catering.com',
    },
    contactLabels: {
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
    },
    cta: {
      title: 'Ready to plan your event?',
      subtitle: "Let's create an unforgettable experience together.",
      button: 'Start Now',
    },
    quoteModal: {
      title: 'Tell us about your event',
      subtitle: 'Share a few details so we can craft the perfect experience',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      eventType: 'Event Type',
      eventTypePlaceholder: 'Select Event Type',
      eventDate: 'Event Date',
      guests: 'Number of Guests',
      message: 'Tell us about your event...',
      submit: 'Submit Request',
      cancel: 'Cancel',
      eventTypes: ['Corporate Event', 'Wedding', 'Private Party', 'Conference', 'Product Launch', 'Other'],
    },
    alerts: {
      quoteSubmitted: 'Thank you for your quote request! We will contact you soon.',
    },
    footer: { quickLinks: 'Quick Links', contact: 'Contact', followUs: 'Follow Us' },
    body: { style: 'classic' },
  },
  DE: {
    nav: { services: 'Dienstleistungen', menus: 'Menues', contact: 'Kontakt', connect: 'Verbinden', order: 'Bestellen' },
    hero: { title: 'Ueber uns', subtitle: 'Kulinarische Exzellenz seit unserer Gruendung' },
    story: {
      title: 'Unsere Geschichte',
      content: [
        'Wir arbeiten eng mit Kunden zusammen, um ihre Vision zu verstehen und massgeschneiderte Erlebnisse zu liefern.',
        'Unsere Kueche erstellt saisonale Menues, die Geschmack, Praesentation und Ernaehrungsbeduerfnisse ausbalancieren.',
        'Von intimen Feiern bis zu grossen Events kuemmern wir uns um jedes Detail.',
      ],
    },
    valuesSection: {
      title: 'Unsere Werte',
      subtitle: 'Was unsere Arbeit und das Gaesteerlebnis leitet.',
    },
    values: {
      passion: { title: 'Leidenschaft', subtitle: 'Herz in jedem Gericht', description: 'Unsere Liebe zu Essen und Service treibt alles an.' },
      exclusivity: { title: 'Exklusivitaet', subtitle: 'Private Erlebnisse', description: 'Private, massgeschneiderte Erlebnisse fuer Ihren Anlass.' },
      company: { title: 'Vertrauenspartner', subtitle: 'Ihr verlaesslicher Partner', description: 'Ein engagiertes Team, das sich auf Ihren Erfolg konzentriert.' },
    },
    team: {
      title: 'Unser Team',
      items: [
        { name: 'Chefkoch', role: 'Kulinarische Leitung' },
        { name: 'Event Manager', role: 'Planung & Koordination' },
        { name: 'Patisserie Lead', role: 'Desserts & Backwaren' },
        { name: 'Serviceleitung', role: 'Service & Gaestebetreuung' },
      ],
    },
    services: {
      title: 'Was wir anbieten',
      items: [
        { title: 'Personalisierter Service', description: 'Individuelle Menues und aufmerksame Koordination.' },
        { title: 'Kreative Menues', description: 'Innovative Gerichte inspiriert von saisonalen Zutaten.' },
        { title: 'Zuverlaessige Lieferung', description: 'Professionelles Team sorgt fuer puenktlichen Service.' },
      ],
    },
    contact: {
      title: 'Kontakt aufnehmen',
      address: 'Kulinarische Strasse 123, Food City, FC 12345',
      phone: '+49 (555) 123-4567',
      mobile: '+49 (555) 987-6543',
      email: 'info@catering.com',
    },
    contactLabels: {
      address: 'Adresse',
      phone: 'Telefon',
      email: 'E-Mail',
    },
    cta: {
      title: 'Bereit fuer Ihr Event?',
      subtitle: 'Lassen Sie uns gemeinsam ein unvergessliches Erlebnis schaffen.',
      button: 'Jetzt starten',
    },
    quoteModal: {
      title: 'Erzaehlen Sie uns von Ihrem Event',
      subtitle: 'Teilen Sie einige Details, damit wir das perfekte Erlebnis gestalten koennen',
      name: 'Vollstaendiger Name',
      email: 'E-Mail-Adresse',
      phone: 'Telefonnummer',
      eventType: 'Veranstaltungstyp',
      eventTypePlaceholder: 'Veranstaltungstyp waehlen',
      eventDate: 'Veranstaltungsdatum',
      guests: 'Anzahl der Gaeste',
      message: 'Erzaehlen Sie uns von Ihrem Event...',
      submit: 'Anfrage senden',
      cancel: 'Abbrechen',
      eventTypes: ['Firmenevent', 'Hochzeit', 'Private Feier', 'Konferenz', 'Produkteinfuehrung', 'Andere'],
    },
    alerts: {
      quoteSubmitted: 'Vielen Dank fuer Ihre Angebotsanfrage! Wir werden Sie bald kontaktieren.',
    },
    footer: { quickLinks: 'Schnellzugriff', contact: 'Kontakt', followUs: 'Folgen Sie uns' },
    body: { style: 'classic' },
  },
};
