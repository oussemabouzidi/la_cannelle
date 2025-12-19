import type { Language } from '../hooks/useTranslation';

const base = {
  nav: { about: 'About', services: 'Services', menus: 'Menus', contact: 'Contact', connect: 'Connect', order: 'Order Now' },
  hero: { title: 'Get in Touch', subtitle: "Let’s create something extraordinary together" },
  quickOrder: {
    title: 'Quick Order',
    subtitle: 'Need immediate assistance? Place a quick order',
    button: 'Quick Order Now',
  },
  social: {
    title: 'Follow Us',
    instagram: 'Instagram',
    tiktok: 'TikTok',
  },
  contactForm: {
    title: 'Send Us a Message',
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    eventType: 'Event Type',
    eventDate: 'Event Date',
    guests: 'Number of Guests',
    message: 'Your Message',
    eventTypes: ['Corporate Event', 'Wedding', 'Private Party', 'Conference', 'Product Launch', 'Other'],
    button: 'Send Message',
    submit: 'Send Message',
  },
  contactInfo: {
    title: 'Contact Information',
    phone: '02133 978 2992',
    mobile: '0163 599 7062',
    email: 'booking@la-cannelle.com',
    address: 'Borsigstraße 2, 41541 Dormagen',
    hours: {
      title: 'Business Hours',
      weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
      saturday: 'Saturday: 10:00 AM - 4:00 PM',
      sunday: 'Sunday: Closed',
    },
  },
  success: { message: 'Thank you for reaching out!' },
};

export const contactTranslations: Record<Language, typeof base> = {
  EN: base,
  DE: {
    ...base,
    nav: { about: 'Über uns', services: 'Dienstleistungen', menus: 'Menüs', contact: 'Kontakt', connect: 'Verbinden', order: 'Jetzt bestellen' },
    hero: { title: 'Kontaktieren Sie uns', subtitle: 'Lassen Sie uns gemeinsam etwas Besonderes schaffen' },
    quickOrder: {
      title: 'Schnellbestellung',
      subtitle: 'Brauchen Sie sofort Hilfe? Geben Sie eine Schnellbestellung auf',
      button: 'Jetzt Schnellbestellen',
    },
    contactForm: {
      ...base.contactForm,
      title: 'Senden Sie uns eine Nachricht',
      name: 'Vollständiger Name',
      email: 'E-Mail-Adresse',
      phone: 'Telefonnummer',
      eventType: 'Veranstaltungstyp',
      eventDate: 'Veranstaltungsdatum',
      guests: 'Anzahl der Gäste',
      message: 'Ihre Nachricht',
      eventTypes: ['Firmenevent', 'Hochzeit', 'Private Feier', 'Konferenz', 'Produktvorstellung', 'Andere'],
      button: 'Nachricht senden',
      submit: 'Nachricht senden',
    },
    contactInfo: {
      ...base.contactInfo,
      title: 'Kontaktinformationen',
      phone: '+49 2133 978 2992',
      mobile: '+49 163 599 7062',
      hours: {
        title: 'Geschäftszeiten',
        weekdays: 'Montag - Freitag: 9:00 - 18:00',
        saturday: 'Samstag: 10:00 - 16:00',
        sunday: 'Sonntag: Geschlossen',
      },
    },
    success: { message: 'Danke für Ihre Nachricht!' },
  },
};
