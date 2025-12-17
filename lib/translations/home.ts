import { commonTranslations } from './common';

export const homeTranslations = {
  EN: {
    ...commonTranslations.EN,
    hero: {
      title: 'Culinary Excellence for Your Special Moments',
      subtitle: 'Creating unforgettable experiences through exceptional catering',
      cta: 'Order Now',
    },
    quickMenu: {
      title: 'Our Specialties',
      description: 'Discover our carefully crafted menu categories for every occasion',
      categories: [
        {
          name: 'Finger Food',
          count: '25+ Items',
          gradient: 'from-amber-500 to-orange-500',
          description: 'Elegant bite-sized delights',
        },
        {
          name: 'Desserts',
          count: '15+ Varieties',
          gradient: 'from-pink-500 to-rose-500',
          description: 'Sweet endings to perfection',
        },
        {
          name: 'Buffet',
          count: '8+ Themes',
          gradient: 'from-emerald-500 to-teal-500',
          description: 'Grand culinary experiences',
        },
        {
          name: 'Special Occasions',
          count: 'Custom',
          gradient: 'from-purple-500 to-indigo-500',
          description: 'Tailored for your events',
        },
      ],
    },
    exclusivity: {
      title: 'EXCLUSIVITY',
      subtitle: 'YOUR SPECIFICATIONS | OUR EXPERTISE | THE IMPLEMENTATION',
      text: 'Every event demands full concentration, respect and dedication. Preferences are colorful and already different today than yesterday. Benefit from our experience, let yourself be convinced and trust in our abilities. Together we realize your event.',
      stats: [
        { number: '500+', label: 'Events' },
        { number: '98%', label: 'Satisfaction' },
        { number: '24/7', label: 'Support' },
      ],
      badge: {
        title: 'Premium',
        subtitle: 'Service',
      },
    },
    menuShowcase: {
      title: 'Signature Creations',
      description: 'Experience our most sought-after culinary masterpieces',
      items: [
        {
          name: 'Truffle Arancini',
          category: 'Finger Food',
          price: '€24',
          image: '/images/truffle-arancini.jpg',
          description: 'Crispy risotto balls with black truffle',
          popular: true,
        },
        {
          name: 'Chocolate Sphere',
          category: 'Desserts',
          price: '€18',
          image: '/images/chocolate-sphere.jpg',
          description: 'Molten chocolate with gold leaf',
          featured: true,
        },
        {
          name: 'Mediterranean Buffet',
          category: 'Buffet',
          price: '€45',
          image: '/images/mediterranean-buffet.jpg',
          description: 'Fresh flavors from the Mediterranean coast',
        },
      ],
      badges: {
        popular: 'Popular',
        featured: 'Featured',
      },
      viewDetails: 'View Details',
      exploreFull: 'Explore Full Menu',
    },
    passion: {
      title: 'PASSION',
      subtitle: 'ELEMENTAL | AUTHENTIC | DELICATE',
      text: 'We constantly reinvent ourselves, exceed all standards and create unforgettable moments. Our dishes are created from natural ingredients, with love for detail and full dedication. The selection of the best products, experience, pulse of the time, craftsmanship and passion are elemental for success.',
      skills: [
        { skill: 'Culinary Innovation', percentage: 95 },
        { skill: 'Ingredient Quality', percentage: 98 },
        { skill: 'Customer Satisfaction', percentage: 96 },
      ],
      cta: 'Our Story',
    },
    company: {
      title: 'COMPANY',
      subtitle: 'INVITATION | IMPLEMENTATION | IMAGE',
      text: "You invite and from there our participation begins until perfection. Whether standing reception, gala dinner, company celebration, product launch or company party. It's about you and your company, the reputation you represent and the lasting impression you leave behind.",
      values: {
        mission: { title: 'Our Mission', description: 'Exceptional culinary experiences' },
        vision: { title: 'Our Vision', description: 'Trusted luxury dining worldwide' },
        excellence: { title: 'Excellence', description: 'Highest standards in every dish' },
        community: { title: 'Community', description: 'Building lasting relationships' },
      },
      badge: {
        title: 'Since 2008',
        subtitle: 'Established',
      },
      review: {
        ratingLabel: 'Rating',
        quote: '"Unforgettable dining experience."',
      },
    },
    journey: {
      title: 'Our Journey',
      milestones: [
        { year: '2008', event: 'Founded' },
        { year: '2012', event: 'Michelin Star' },
        { year: '2018', event: 'Expansion' },
        { year: '2024', event: 'Innovation' },
      ],
    },
    services: {
      title: 'Our Services',
      items: [
        { name: 'Corporate Events', desc: 'Professional catering for business occasions' },
        { name: 'Private Celebrations', desc: 'Personalized menus for special moments' },
        { name: 'Gala Dinners', desc: 'Elegant dining experiences' },
        { name: 'Cocktail Receptions', desc: 'Sophisticated cocktail events' },
      ],
    },
    menus: {
      title: 'Featured Menus',
      cta: 'Learn More',
      items: [
        { name: 'Seasonal Selection', desc: 'Fresh ingredients from local sources' },
        { name: 'Gourmet Collection', desc: 'Refined dishes for discerning palates' },
        { name: 'Traditional Favorites', desc: 'Classic recipes with modern accents' },
      ],
    },
    testimonials: {
      title: 'What Our Clients Say',
      items: [
        { text: 'Exceptional quality and service. Every detail was perfect for our corporate event.', author: 'Sarah M.' },
        { text: 'The attention to detail and flavors exceeded all our expectations.', author: 'Michael K.' },
        { text: 'Professional, creative, and absolutely delicious. Highly recommended!', author: 'Anna L.' },
      ],
    },
    brandBanner: {
      title: 'Trusted By',
    },
    footer: {
      tagline: 'Creating unforgettable culinary experiences',
      quickLinksTitle: 'Quick Links',
      contactTitle: 'Contact',
      hoursTitle: 'Hours',
      contact: {
        phone: '+123 456 7890',
        email: 'info@catering.com',
        location: 'Your Location',
      },
      hours: {
        weekdays: 'Monday - Friday: 9am - 6pm',
        saturday: 'Saturday: 10am - 4pm',
        sunday: 'Sunday: Closed',
      },
      copyright: '© 2025 Gourmet Catering. All rights reserved.',
    },
  },
  DE: {
    ...commonTranslations.DE,
    hero: {
      title: 'Kulinarische Exzellenz für Ihre besonderen Momente',
      subtitle: 'Unvergessliche Erlebnisse durch außergewöhnliches Catering',
      cta: 'Jetzt bestellen',
    },
    quickMenu: {
      title: 'Unsere Spezialitäten',
      description: 'Entdecken Sie unsere sorgfältig zusammengestellten Menükategorien für jeden Anlass',
      categories: [
        {
          name: 'Fingerfood',
          count: '25+ Häppchen',
          gradient: 'from-amber-500 to-orange-500',
          description: 'Elegante Häppchen in einem Biss',
        },
        {
          name: 'Desserts',
          count: '15+ Variationen',
          gradient: 'from-pink-500 to-rose-500',
          description: 'Süße Abschlüsse in Perfektion',
        },
        {
          name: 'Buffet',
          count: '8+ Themen',
          gradient: 'from-emerald-500 to-teal-500',
          description: 'Große kulinarische Erlebnisse',
        },
        {
          name: 'Besondere Anlässe',
          count: 'Individuell',
          gradient: 'from-purple-500 to-indigo-500',
          description: 'Maßgeschneidert für Ihre Events',
        },
      ],
    },
    exclusivity: {
      title: 'EXKLUSIVITÄT',
      subtitle: 'IHRE VORGABEN | UNSERE EXPERTISE | DIE UMSETZUNG',
      text: 'Jede Veranstaltung verlangt volle Konzentration, Respekt und Hingabe. Vorlieben sind vielfältig und heute schon anders als gestern. Profitieren Sie von unserer Erfahrung, lassen Sie sich überzeugen und vertrauen Sie auf unser Können. Gemeinsam realisieren wir Ihre Veranstaltung.',
      stats: [
        { number: '500+', label: 'Events' },
        { number: '98%', label: 'Zufriedenheit' },
        { number: '24/7', label: 'Betreuung' },
      ],
      badge: {
        title: 'Premium',
        subtitle: 'Service',
      },
    },
    menuShowcase: {
      title: 'Signaturkreationen',
      description: 'Erleben Sie unsere gefragtesten kulinarischen Meisterwerke',
      items: [
        {
          name: 'Trüffel-Arancini',
          category: 'Fingerfood',
          price: '24 €',
          image: '/images/truffle-arancini.jpg',
          description: 'Knusprige Risotto-Bällchen mit schwarzem Trüffel',
          popular: true,
        },
        {
          name: 'Schokoladen-Sphäre',
          category: 'Desserts',
          price: '18 €',
          image: '/images/chocolate-sphere.jpg',
          description: 'Flüssige Schokolade mit Blattgold',
          featured: true,
        },
        {
          name: 'Mediterranes Buffet',
          category: 'Buffet',
          price: '45 €',
          image: '/images/mediterranean-buffet.jpg',
          description: 'Frische Aromen der Mittelmeerküste',
        },
      ],
      badges: {
        popular: 'Beliebt',
        featured: 'Empfohlen',
      },
      viewDetails: 'Details ansehen',
      exploreFull: 'Gesamtes Menü entdecken',
    },
    passion: {
      title: 'LEIDENSCHAFT',
      subtitle: 'ELEMENTAR | AUTHENTISCH | DELIKAT',
      text: 'Wir erfinden uns ständig neu, übertreffen alle Standards und schaffen unvergessliche Momente. Unsere Gerichte entstehen aus natürlichen Zutaten, mit Liebe zum Detail und voller Hingabe. Die Auswahl bester Produkte, Erfahrung, Zeitgeist, Handwerk und Leidenschaft sind elementar für den Erfolg.',
      skills: [
        { skill: 'Kulinarische Innovation', percentage: 95 },
        { skill: 'Zutatenqualität', percentage: 98 },
        { skill: 'Kundenzufriedenheit', percentage: 96 },
      ],
      cta: 'Unsere Geschichte',
    },
    company: {
      title: 'UNTERNEHMEN',
      subtitle: 'EINLADUNG | UMSETZUNG | IMAGE',
      text: 'Sie laden ein und ab dort beginnt unsere Teilnahme bis zur Perfektion. Ob Stehempfang, Galadinner, Firmenfest, Produktenthüllung oder Firmenfeier. Es geht um Sie und Ihr Unternehmen, den Ruf den Sie vertreten und den bleibenden Eindruck den Sie hinterlassen.',
      values: {
        mission: { title: 'Unsere Mission', description: 'Außergewöhnliche kulinarische Erlebnisse' },
        vision: { title: 'Unsere Vision', description: 'Vertrauenswürdige Fine Dining weltweit' },
        excellence: { title: 'Exzellenz', description: 'Höchste Standards in jedem Gericht' },
        community: { title: 'Gemeinschaft', description: 'Dauerhafte Beziehungen aufbauen' },
      },
      badge: {
        title: 'Seit 2008',
        subtitle: 'Etabliert',
      },
      review: {
        ratingLabel: 'Bewertung',
        quote: '„Unvergessliches kulinarisches Erlebnis.“',
      },
    },
    journey: {
      title: 'Unser Werdegang',
      milestones: [
        { year: '2008', event: 'Gegründet' },
        { year: '2012', event: 'Michelin-Stern' },
        { year: '2018', event: 'Expansion' },
        { year: '2024', event: 'Innovation' },
      ],
    },
    services: {
      title: 'Unsere Dienstleistungen',
      items: [
        { name: 'Firmenveranstaltungen', desc: 'Professionelles Catering für geschäftliche Anlässe' },
        { name: 'Private Feiern', desc: 'Personalisierte Menüs für besondere Momente' },
        { name: 'Galadinner', desc: 'Elegante Dining-Erlebnisse' },
        { name: 'Stehempfänge', desc: 'Anspruchsvolle Cocktail-Events' },
      ],
    },
    menus: {
      title: 'Ausgewählte Menüs',
      cta: 'Mehr erfahren',
      items: [
        { name: 'Saisonale Auswahl', desc: 'Frische Zutaten aus lokalen Quellen' },
        { name: 'Gourmet-Kollektion', desc: 'Raffinierte Gerichte für anspruchsvolle Gaumen' },
        { name: 'Traditionelle Favoriten', desc: 'Klassische Rezepte mit modernen Akzenten' },
      ],
    },
    testimonials: {
      title: 'Was unsere Kunden sagen',
      items: [
        { text: 'Außergewöhnliche Qualität und Service. Jedes Detail war perfekt für unsere Firmenveranstaltung.', author: 'Sarah M.' },
        { text: 'Die Liebe zum Detail und die Aromen übertrafen alle unsere Erwartungen.', author: 'Michael K.' },
        { text: 'Professionell, kreativ und absolut köstlich. Sehr empfehlenswert!', author: 'Anna L.' },
      ],
    },
    brandBanner: {
      title: 'Vertraut von',
    },
    footer: {
      tagline: 'Unvergessliche kulinarische Erlebnisse schaffen',
      quickLinksTitle: 'Schnellzugriff',
      contactTitle: 'Kontakt',
      hoursTitle: 'Öffnungszeiten',
      contact: {
        phone: '+123 456 7890',
        email: 'info@catering.com',
        location: 'Ihr Standort',
      },
      hours: {
        weekdays: 'Montag - Freitag: 9–18 Uhr',
        saturday: 'Samstag: 10–16 Uhr',
        sunday: 'Sonntag: Geschlossen',
      },
      copyright: '© 2025 Gourmet Catering. Alle Rechte vorbehalten.',
    },
  },
};
