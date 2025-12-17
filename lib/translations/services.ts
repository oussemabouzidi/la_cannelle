import { commonTranslations } from './common';

export const servicesTranslations = {
  EN: {
    ...commonTranslations.EN,
    hero: {
      title: 'Our Services',
      subtitle: 'Tailored catering solutions for every occasion'
    },
    officeCatering: {
      title: 'Office Catering',
      subtitle: 'Fuel Your Team with Excellence',
      description: 'Keep your team energized and productive with our professional office catering services. From daily lunch deliveries to breakfast meetings and afternoon refreshments, we provide fresh, delicious meals that fit seamlessly into your workday.',
      features: [
        'Daily meal delivery programs',
        'Breakfast meetings and coffee service',
        'Healthy lunch options',
        'Custom dietary accommodations',
        'Flexible scheduling and ordering',
        'Professional presentation'
      ]
    },
    eventCatering: {
      title: 'Event Catering',
      subtitle: 'Memorable Moments, Exceptional Food',
      description: 'Make your special occasions unforgettable with our event catering services. Whether it\'s a corporate gathering, private celebration, or milestone event, we deliver culinary excellence that matches the importance of your occasion.',
      features: [
        'Custom menu planning',
        'Full-service event coordination',
        'Professional serving staff',
        'Premium presentation',
        'Flexible event packages',
        'On-site preparation available'
      ]
    },
    weddingCatering: {
      title: 'Wedding Catering',
      subtitle: 'Your Perfect Day, Our Perfect Service',
      description: 'Your wedding day deserves nothing but the best. Our wedding catering services combine elegant presentation, exquisite flavors, and flawless execution to create a dining experience your guests will remember forever.',
      features: [
        'Bridal consultation and menu design',
        'Elegant table settings and presentation',
        'Multiple course options',
        'Wedding cake coordination',
        'Special dietary accommodations',
        'Rehearsal dinner options'
      ]
    },
    // Alias for UI expecting weddings.*
    weddings: {
      title: 'Weddings',
      subtitle: 'Your Perfect Day, Perfectly Catered',
      description: 'Your wedding day deserves nothing but the best. Our wedding catering services combine elegant presentation, exquisite flavors, and flawless execution to create a dining experience your guests will remember forever.',
      features: [
        'Bridal consultation and menu design',
        'Elegant table settings and presentation',
        'Multiple course options',
        'Wedding cake coordination',
        'Special dietary accommodations',
        'Rehearsal dinner options'
      ]
    },
    // Alias used by UI
    weddings: {
      title: 'Weddings',
      subtitle: 'Your Perfect Day, Perfectly Catered',
      description: 'Your wedding day deserves nothing but the best. Our wedding catering services combine elegant presentation, exquisite flavors, and flawless execution to create a dining experience your guests will remember forever.',
      features: [
        'Personalized menu consultations',
        'Tasting sessions for the couple',
        'Full bar service available',
        'Elegant plating and presentation',
        'Experienced wedding staff',
        'Coordination with venue and vendors'
      ]
    },
    corporateCatering: {
      title: 'Corporate Catering',
      subtitle: 'Professional Excellence for Business',
      description: 'Impress clients and motivate your team with our corporate catering solutions. From board meetings to company-wide celebrations, we provide sophisticated dining experiences that reflect your company\'s standards.',
      features: [
        'Executive dining services',
        'Conference and meeting catering',
        'Corporate event planning',
        'Branded presentation options',
        'Volume pricing available',
        'Regular account management'
      ]
    },
    // Alias for UI expecting corporateEvents.*
    corporateEvents: {
      title: 'Corporate Events',
      subtitle: 'Impress Your Clients and Team',
      description: 'Impress clients and motivate your team with our corporate catering solutions. From board meetings to company-wide celebrations, we provide sophisticated dining experiences that reflect your company\'s standards.',
      features: [
        'Executive dining services',
        'Conference and meeting catering',
        'Corporate event planning',
        'Branded presentation options',
        'Volume pricing available',
        'Regular account management'
      ]
    },
    corporateEvents: {
      title: 'Corporate Events',
      subtitle: 'Impress Your Clients and Team',
      description: 'Elevate your corporate gatherings with our professional catering services. From intimate board meetings to large-scale conferences, we deliver sophisticated dining experiences that reflect your company’s excellence.',
      features: [
        'Executive lunch and dinner service',
        'Conference and seminar catering',
        'Product launches and celebrations',
        'Networking events and receptions',
        'Professional presentation',
        'Dietary restrictions accommodated'
      ]
    },
    cta: {
      title: 'Ready to Get Started?',
      subtitle: 'Let us bring your vision to life with exceptional catering',
      button: 'Order Now'
    }
  },
  DE: {
    ...commonTranslations.DE,
    hero: {
      title: 'Unsere Dienstleistungen',
      subtitle: 'Maßgeschneiderte Catering-Lösungen für jeden Anlass'
    },
    officeCatering: {
      title: 'Büro-Catering',
      subtitle: 'Versorgen Sie Ihr Team mit Exzellenz',
      description: 'Halten Sie Ihr Team energiegeladen und produktiv mit unseren professionellen Büro-Catering-Services. Von täglichen Mittagessen-Lieferungen bis hin zu Frühstücksmeetings und Nachmittags-Erfrischungen bieten wir frische, köstliche Mahlzeiten, die nahtlos in Ihren Arbeitstag passen.',
      features: [
        'Tägliche Mahlzeiten-Lieferprogramme',
        'Frühstücksmeetings und Kaffee-Service',
        'Gesunde Mittagsoptionen',
        'Individuelle diätetische Unterkünfte',
        'Flexible Terminplanung und Bestellung',
        'Professionelle Präsentation'
      ]
    },
    eventCatering: {
      title: 'Event-Catering',
      subtitle: 'Unvergessliche Momente, außergewöhnliches Essen',
      description: 'Machen Sie Ihre besonderen Anlässe unvergesslich mit unseren Event-Catering-Services. Ob Firmenfeier, private Feier oder Meilenstein-Event, wir liefern kulinarische Exzellenz, die der Bedeutung Ihres Anlasses entspricht.',
      features: [
        'Individuelle Menüplanung',
        'Vollständige Event-Koordination',
        'Professionelles Servicepersonal',
        'Premium-Präsentation',
        'Flexible Event-Pakete',
        'Vor-Ort-Zubereitung verfügbar'
      ]
    },
    weddingCatering: {
      title: 'Hochzeits-Catering',
      subtitle: 'Ihr perfekter Tag, unser perfekter Service',
      description: 'Ihr Hochzeitstag verdient nur das Beste. Unsere Hochzeits-Catering-Services kombinieren elegante Präsentation, exquisite Aromen und makellose Ausführung, um ein kulinarisches Erlebnis zu schaffen, das Ihre Gäste für immer in Erinnerung behalten werden.',
      features: [
        'Brautberatung und Menüdesign',
        'Elegante Tischdekoration und Präsentation',
        'Mehrere Gänge-Optionen',
        'Hochzeitskuchen-Koordination',
        'Spezielle diätetische Unterkünfte',
        'Probeessen-Optionen'
      ]
    },
    weddings: {
      title: 'Hochzeiten',
      subtitle: 'Ihr perfekter Tag, perfekt betreut',
      description: 'Ihr Hochzeitstag verdient nur das Beste. Unsere Hochzeits-Catering-Services kombinieren elegante Präsentation, exquisite Aromen und makellose Ausführung, um ein kulinarisches Erlebnis zu schaffen, das Ihre Gäste für immer in Erinnerung behalten werden.',
      features: [
        'Brautberatung und Menüdesign',
        'Elegante Tischdekoration und Präsentation',
        'Mehrere Gänge-Optionen',
        'Hochzeitskuchen-Koordination',
        'Spezielle diätetische Unterkünfte',
        'Probeessen-Optionen'
      ]
    },
    weddings: {
      title: 'Hochzeiten',
      subtitle: 'Ihr perfekter Tag, perfekt betreut',
      description: 'Ihr Hochzeitstag verdient nur das Beste. Unsere Hochzeits-Catering-Services kombinieren elegante Präsentation, exquisite Aromen und makellose Ausführung, um ein kulinarisches Erlebnis zu schaffen, das Ihre Gäste für immer in Erinnerung behalten werden.',
      features: [
        'Personalisierte Menüberatung',
        'Verkostungen für das Paar',
        'Vollständiger Barservice verfügbar',
        'Elegante Anrichtung und Präsentation',
        'Erfahrenes Hochzeitsteam',
        'Koordination mit Location und Dienstleistern'
      ]
    },
    corporateCatering: {
      title: 'Firmen-Catering',
      subtitle: 'Professionelle Exzellenz für Unternehmen',
      description: 'Beeindrucken Sie Kunden und motivieren Sie Ihr Team mit unseren Firmen-Catering-Lösungen. Von Vorstandssitzungen bis hin zu firmenweiten Feiern bieten wir anspruchsvolle kulinarische Erlebnisse, die die Standards Ihres Unternehmens widerspiegeln.',
      features: [
        'Executive-Dining-Services',
        'Konferenz- und Meeting-Catering',
        'Firmen-Event-Planung',
        'Markenpräsentations-Optionen',
        'Mengenpreise verfügbar',
        'Regelmäßiges Account-Management'
      ]
    },
    corporateEvents: {
      title: 'Firmenevents',
      subtitle: 'Beeindrucken Sie Kunden und Team',
      description: 'Beeindrucken Sie Kunden und motivieren Sie Ihr Team mit unseren Firmen-Catering-Lösungen. Von Vorstandssitzungen bis hin zu firmenweiten Feiern bieten wir anspruchsvolle kulinarische Erlebnisse, die die Standards Ihres Unternehmens widerspiegeln.',
      features: [
        'Executive-Dining-Services',
        'Konferenz- und Meeting-Catering',
        'Firmen-Event-Planung',
        'Markenpräsentations-Optionen',
        'Mengenpreise verfügbar',
        'Regelmäßiges Account-Management'
      ]
    },
    corporateEvents: {
      title: 'Firmenevents',
      subtitle: 'Beeindrucken Sie Kunden und Team',
      description: 'Beeindrucken Sie Kunden und motivieren Sie Ihr Team mit unseren Firmen-Catering-Lösungen. Von Vorstandssitzungen bis hin zu firmenweiten Feiern bieten wir anspruchsvolle kulinarische Erlebnisse, die die Standards Ihres Unternehmens widerspiegeln.',
      features: [
        'Executive-Dining-Services',
        'Konferenz- und Meeting-Catering',
        'Firmen-Event-Planung',
        'Markenpräsentations-Optionen',
        'Mengenpreise verfügbar',
        'Regelmäßiges Account-Management'
      ]
    },
    cta: {
      title: 'Bereit zu starten?',
      subtitle: 'Lassen Sie uns Ihre Vision mit außergewöhnlichem Catering verwirklichen',
      button: 'Jetzt bestellen'
    }
  }
};
