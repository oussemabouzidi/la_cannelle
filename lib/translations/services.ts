import type { Language } from '../hooks/useTranslation';

const en = {
  labels: {
    whatWeOffer: 'What We Offer:',
  },
  nav: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    menus: 'Menus',
    contact: 'Contact',
    connect: 'Connect',
    order: 'Order Now',
  },
  footer: {
    quickLinks: 'Quick Links',
    contact: 'Contact',
    followUs: 'Follow Us',
    brandTitle: 'La Cannelle',
    brandTagline: 'Creating unforgettable culinary experiences',
    contactPhone: '+49 2133 978 2992',
    contactEmail: 'booking@la-cannelle.com',
    contactAddress: 'Borsigstrasse 2, 41541 Dormagen',
    hoursTitle: 'Hours',
    hoursWeekdays: 'Monday - Friday: 9am - 6pm',
    hoursSaturday: 'Saturday: 10am - 4pm',
    hoursSunday: 'Sunday: Closed',
    copyright: '(c) 2025 La Cannelle Catering. All rights reserved.',
  },
  hero: {
    title: 'Our Services',
    subtitle: 'Tailored catering solutions for every occasion',
  },
  officeCatering: {
    title: 'Office Catering',
    subtitle: 'Fuel Your Team with Excellence',
    description:
      'Keep your team energized and productive with our professional office catering services. From daily lunch deliveries to breakfast meetings and afternoon refreshments, we provide fresh, delicious meals that fit seamlessly into your workday.',
    features: [
      'Daily meal delivery programs',
      'Breakfast meetings and coffee service',
      'Healthy lunch options',
      'Custom dietary accommodations',
      'Flexible scheduling and ordering',
      'Professional presentation',
    ],
  },
  eventCatering: {
    title: 'Event Catering',
    subtitle: 'Memorable Moments, Exceptional Food',
    description:
      "Make your special event unforgettable with our comprehensive event catering services. Whether it's a birthday celebration, anniversary, or any milestone, we create culinary experiences that leave lasting impressions.",
    features: [
      'Customized menus for any occasion',
      'Full-service event coordination',
      'Professional staff and service',
      'Elegant presentation and setup',
      'Accommodates all group sizes',
      'Themed catering options',
    ],
  },
  weddings: {
    title: 'Weddings',
    subtitle: 'Your Perfect Day, Perfectly Catered',
    description:
      'Your wedding day deserves nothing but perfection. Our dedicated wedding catering team works closely with you to create a bespoke dining experience that reflects your style and taste, ensuring every guest is delighted.',
    features: [
      'Personalized menu consultations',
      'Tasting sessions for the couple',
      'Full bar service available',
      'Elegant plating and presentation',
      'Experienced wedding staff',
      'Coordination with venue and vendors',
    ],
  },
  corporateEvents: {
    title: 'Corporate Events',
    subtitle: 'Impress Your Clients and Team',
    description:
      "Elevate your corporate gatherings with our professional catering services. From intimate board meetings to large-scale conferences, we deliver sophisticated dining experiences that reflect your company's excellence.",
    features: [
      'Executive lunch and dinner service',
      'Conference and seminar catering',
      'Product launches and celebrations',
      'Networking events and receptions',
      'Professional presentation',
      'Dietary restrictions accommodated',
    ],
  },
  cta: {
    title: 'Ready to Get Started?',
    subtitle: 'Let us bring your vision to life with exceptional catering',
    button: 'Order Now',
  },
};

const de: typeof en = {
  labels: {
    whatWeOffer: 'Was wir bieten:',
  },
  nav: {
    home: 'Startseite',
    about: 'Ueber uns',
    services: 'Dienstleistungen',
    menus: 'Menues',
    contact: 'Kontakt',
    connect: 'Verbinden',
    order: 'Jetzt bestellen',
  },
  footer: {
    quickLinks: 'Schnellzugriff',
    contact: 'Kontakt',
    followUs: 'Folgen Sie uns',
    brandTitle: 'La Cannelle',
    brandTagline: 'Unvergessliche kulinarische Erlebnisse',
    contactPhone: '+49 2133 978 2992',
    contactEmail: 'booking@la-cannelle.com',
    contactAddress: 'Borsigstrasse 2, 41541 Dormagen',
    hoursTitle: 'Oeffnungszeiten',
    hoursWeekdays: 'Montag - Freitag: 9:00 - 18:00',
    hoursSaturday: 'Samstag: 10:00 - 16:00',
    hoursSunday: 'Sonntag: Geschlossen',
    copyright: '(c) 2025 La Cannelle Catering. Alle Rechte vorbehalten.',
  },
  hero: {
    title: 'Unsere Dienstleistungen',
    subtitle: 'Massgeschneiderte Catering-Loesungen fuer jeden Anlass',
  },
  officeCatering: {
    title: 'Buero-Catering',
    subtitle: 'Energie fuer Ihr Team durch Exzellenz',
    description:
      'Halten Sie Ihr Team energiegeladen und produktiv mit unseren professionellen Buero-Catering-Dienstleistungen. Von taeglichen Mittagslieferungen bis hin zu Fruehstuecksmeetings und Nachmittagserfrischungen bieten wir frische, koestliche Mahlzeiten, die nahtlos in Ihren Arbeitstag passen.',
    features: [
      'Taegliche Essenslieferprogramme',
      'Fruehstuecksmeetings und Kaffeeservice',
      'Gesunde Mittagsoptionen',
      'Individuelle Ernaehrungsanpassungen',
      'Flexible Planung und Bestellung',
      'Professionelle Praesentation',
    ],
  },
  eventCatering: {
    title: 'Event-Catering',
    subtitle: 'Unvergessliche Momente, aussergewoehnliches Essen',
    description:
      'Machen Sie Ihr besonderes Ereignis unvergesslich mit unseren umfassenden Catering-Dienstleistungen. Ob Geburtstag, Jubilaeum oder ein anderer Meilenstein - wir schaffen kulinarische Erlebnisse, die in Erinnerung bleiben.',
    features: [
      'Individuelle Menues fuer jeden Anlass',
      'Umfassende Event-Koordination',
      'Professionelles Personal und Service',
      'Elegante Praesentation und Aufbau',
      'Fuer alle Gruppengroessen geeignet',
      'Thematische Catering-Optionen',
    ],
  },
  weddings: {
    title: 'Hochzeiten',
    subtitle: 'Ihr perfekter Tag, perfekt bekocht',
    description:
      'Ihr Hochzeitstag verdient Perfektion. Unser engagiertes Team arbeitet eng mit Ihnen zusammen, um ein massgeschneidertes kulinarisches Erlebnis zu gestalten, das Ihren Stil widerspiegelt und jeden Gast begeistert.',
    features: [
      'Personalisierte Menueberatung',
      'Verkostung fuer das Paar',
      'Voller Barservice verfuegbar',
      'Elegantes Anrichten und Praesentation',
      'Erfahrenes Hochzeitspersonal',
      'Koordination mit Location und Dienstleistern',
    ],
  },
  corporateEvents: {
    title: 'Firmenevents',
    subtitle: 'Beeindrucken Sie Kunden und Team',
    description:
      'Werten Sie Ihre Geschaeftstreffen mit unserem professionellen Catering auf. Von Besprechungen im kleinen Kreis bis zu grossen Konferenzen liefern wir anspruchsvolle kulinarische Erlebnisse, die Ihre Unternehmensqualitaet widerspiegeln.',
    features: [
      'Exklusiver Mittag- und Abendservice',
      'Konferenz- und Seminar-Catering',
      'Produktlaunches und Feiern',
      'Networking-Events und Empfaenge',
      'Professionelle Praesentation',
      'Beruecksichtigung von Ernaehrungswuenschen',
    ],
  },
  cta: {
    title: 'Bereit zu starten?',
    subtitle: 'Wir setzen Ihre Vision mit exzellentem Catering um',
    button: 'Jetzt bestellen',
  },
};

export const servicesTranslations: Record<Language, typeof en> = {
  EN: en,
  DE: de,
};
