import { commonTranslations } from './common';

export const contactTranslations = {
  EN: {
    ...commonTranslations.EN,
    hero: {
      title: 'Get in Touch',
      subtitle: 'We\'d love to hear from you'
    },
    form: {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      eventType: 'Event Type',
      eventDate: 'Event Date',
      guests: 'Number of Guests',
      message: 'Message',
      eventTypes: [
        'Corporate Event',
        'Wedding',
        'Private Party',
        'Conference',
        'Product Launch',
        'Other'
      ],
      submit: 'Send Message',
      placeholder: {
        name: 'Enter your name',
        email: 'Enter your email',
        phone: 'Enter your phone number',
        eventType: 'Select event type',
        message: 'Tell us about your event...'
      }
    },
    // Alias to keep components expecting contactForm.* working
    contactForm: {
      title: 'Send Us a Message',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      eventType: 'Event Type',
      eventDate: 'Event Date',
      guests: 'Number of Guests',
      message: 'Message',
      eventTypes: [
        'Corporate Event',
        'Wedding',
        'Private Party',
        'Conference',
        'Product Launch',
        'Other'
      ],
      submit: 'Send Message',
      button: 'Send Message',
      placeholder: {
        name: 'Enter your name',
        email: 'Enter your email',
        phone: 'Enter your phone number',
        eventType: 'Select event type',
        message: 'Tell us about your event...'
      }
    },
    info: {
      title: 'Contact Information',
      phone: {
        label: 'Phone',
        value: '+1 (555) 123-4567'
      },
      email: {
        label: 'Email',
        value: 'info@catering.com'
      },
      address: {
        label: 'Address',
        value: '123 Culinary Street, Food City, FC 12345'
      },
      hours: {
        label: 'Business Hours',
        value: 'Mon-Fri: 9:00 AM - 6:00 PM'
      }
    },
    contactInfo: {
      title: 'Contact Information',
      phone: '+1 (555) 123-4567',
      mobile: '+1 (555) 987-6543',
      email: 'info@catering.com',
      address: '123 Culinary Street, Food City, FC 12345',
      hours: {
        title: 'Business Hours',
        weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
        saturday: 'Saturday: 10:00 AM - 4:00 PM',
        sunday: 'Sunday: Closed'
      }
    },
    success: {
      title: 'Thank You!',
      message: 'We\'ll get back to you soon.'
    }
  },
  DE: {
    ...commonTranslations.DE,
    hero: {
      title: 'Kontaktieren Sie uns',
      subtitle: 'Wir freuen uns von Ihnen zu hören'
    },
    form: {
      name: 'Vollständiger Name',
      email: 'E-Mail-Adresse',
      phone: 'Telefonnummer',
      eventType: 'Veranstaltungstyp',
      eventDate: 'Veranstaltungsdatum',
      guests: 'Anzahl der Gäste',
      message: 'Nachricht',
      eventTypes: [
        'Firmenevent',
        'Hochzeit',
        'Private Feier',
        'Konferenz',
        'Produktvorstellung',
        'Andere'
      ],
      submit: 'Nachricht senden',
      placeholder: {
        name: 'Geben Sie Ihren Namen ein',
        email: 'Geben Sie Ihre E-Mail ein',
        phone: 'Geben Sie Ihre Telefonnummer ein',
        eventType: 'Veranstaltungstyp auswählen',
        message: 'Erzählen Sie uns von Ihrer Veranstaltung...'
      }
    },
    contactForm: {
      title: 'Senden Sie uns eine Nachricht',
      name: 'Vollständiger Name',
      email: 'E-Mail-Adresse',
      phone: 'Telefonnummer',
      eventType: 'Veranstaltungstyp',
      eventDate: 'Veranstaltungsdatum',
      guests: 'Anzahl der Gäste',
      message: 'Nachricht',
      eventTypes: [
        'Firmenevent',
        'Hochzeit',
        'Private Feier',
        'Konferenz',
        'Produktvorstellung',
        'Andere'
      ],
      submit: 'Nachricht senden',
      button: 'Nachricht senden',
      placeholder: {
        name: 'Geben Sie Ihren Namen ein',
        email: 'Geben Sie Ihre E-Mail ein',
        phone: 'Geben Sie Ihre Telefonnummer ein',
        eventType: 'Veranstaltungstyp auswählen',
        message: 'Erzählen Sie uns von Ihrer Veranstaltung...'
      }
    },
    info: {
      title: 'Kontaktinformationen',
      phone: {
        label: 'Telefon',
        value: '+49 123 456 789'
      },
      email: {
        label: 'E-Mail',
        value: 'info@catering.com'
      },
      address: {
        label: 'Adresse',
        value: 'Kulinarische Straße 123, Essen Stadt, 12345'
      },
      hours: {
        label: 'Geschäftszeiten',
        value: 'Mo-Fr: 9:00 - 18:00 Uhr'
      }
    },
    contactInfo: {
      title: 'Kontaktinformationen',
      phone: '+49 123 456 789',
      mobile: '+49 987 654 321',
      email: 'info@catering.com',
      address: 'Kulinarische Straße 123, Essen Stadt, 12345',
      hours: {
        title: 'Geschäftszeiten',
        weekdays: 'Mo-Fr: 9:00 - 18:00 Uhr',
        saturday: 'Samstag: 10:00 - 16:00 Uhr',
        sunday: 'Sonntag: Geschlossen'
      }
    },
    success: {
      title: 'Vielen Dank!',
      message: 'Wir werden uns bald bei Ihnen melden.'
    }
  }
};
