import { commonTranslations } from './common';

export const connectTranslations = {
  EN: {
    ...commonTranslations.EN,
    hero: {
      title: 'Your Account',
      subtitle: 'Manage your profile, preferences, and event history'
    },
    tabs: {
      profile: 'Profile',
      orders: 'My Orders',
      favorites: 'Favorites',
      payments: 'Payments',
      settings: 'Settings'
    },
    auth: {
      login: {
        title: 'Welcome Back',
        subtitle: 'Sign in to your account',
        email: 'Email Address',
        password: 'Password',
        remember: 'Remember me',
        forgot: 'Forgot password?',
        button: 'Sign In',
        noAccount: 'Don\'t have an account?',
        signUp: 'Sign Up'
      },
      register: {
        title: 'Create Account',
        subtitle: 'Join us for exclusive benefits',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        company: 'Company (Optional)',
        position: 'Position (Optional)',
        terms: 'I agree to the Terms of Service and Privacy Policy',
        button: 'Create Account',
        haveAccount: 'Already have an account?',
        signIn: 'Sign In'
      }
    },
    profile: {
      personal: {
        title: 'Personal Information',
        subtitle: 'Update your personal details',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        company: 'Company',
        position: 'Position'
      },
      preferences: {
        title: 'Preferences',
        subtitle: 'Manage your communication preferences',
        newsletter: 'Email Newsletter',
        sms: 'SMS Notifications',
        reminders: 'Event Reminders',
        dietary: 'Dietary Restrictions',
        allergies: 'Allergies'
      },
      save: 'Save Changes',
      edit: 'Edit Profile'
    },
    orders: {
      title: 'Order History',
      subtitle: 'View your past and upcoming events',
      upcoming: 'Upcoming Events',
      past: 'Past Events',
      noEvents: 'No events scheduled',
      viewDetails: 'View Details',
      status: {
        confirmed: 'Confirmed',
        pending: 'Pending',
        completed: 'Completed',
        cancelled: 'Cancelled'
      }
    },
    favorites: {
      title: 'Favorite Items',
      subtitle: 'Your saved menu selections',
      noFavorites: 'No favorite items yet',
      addFromMenu: 'Add from menu',
      remove: 'Remove'
    },
    payments: {
      title: 'Payment Methods',
      subtitle: 'Manage your payment information',
      addCard: 'Add New Card',
      noCards: 'No payment methods saved',
      default: 'Default',
      setDefault: 'Set as Default',
      remove: 'Remove'
    },
    settings: {
      title: 'Account Settings',
      subtitle: 'Manage your account preferences',
      security: 'Security',
      notifications: 'Notifications',
      privacy: 'Privacy',
      language: 'Language',
      delete: 'Delete Account'
    }
  },
  DE: {
    ...commonTranslations.DE,
    hero: {
      title: 'Ihr Konto',
      subtitle: 'Verwalten Sie Ihr Profil, Präferenzen und Veranstaltungshistorie'
    },
    tabs: {
      profile: 'Profil',
      orders: 'Meine Bestellungen',
      favorites: 'Favoriten',
      payments: 'Zahlungen',
      settings: 'Einstellungen'
    },
    auth: {
      login: {
        title: 'Willkommen zurück',
        subtitle: 'Melden Sie sich bei Ihrem Konto an',
        email: 'E-Mail-Adresse',
        password: 'Passwort',
        remember: 'Angemeldet bleiben',
        forgot: 'Passwort vergessen?',
        button: 'Anmelden',
        noAccount: 'Noch kein Konto?',
        signUp: 'Registrieren'
      },
      register: {
        title: 'Konto erstellen',
        subtitle: 'Werden Sie Mitglied für exklusive Vorteile',
        firstName: 'Vorname',
        lastName: 'Nachname',
        email: 'E-Mail-Adresse',
        phone: 'Telefonnummer',
        password: 'Passwort',
        confirmPassword: 'Passwort bestätigen',
        company: 'Firma (Optional)',
        position: 'Position (Optional)',
        terms: 'Ich stimme den AGB und Datenschutzbestimmungen zu',
        button: 'Konto erstellen',
        haveAccount: 'Bereits ein Konto?',
        signIn: 'Anmelden'
      }
    },
    profile: {
      personal: {
        title: 'Persönliche Informationen',
        subtitle: 'Aktualisieren Sie Ihre persönlichen Daten',
        firstName: 'Vorname',
        lastName: 'Nachname',
        email: 'E-Mail-Adresse',
        phone: 'Telefonnummer',
        company: 'Firma',
        position: 'Position'
      },
      preferences: {
        title: 'Präferenzen',
        subtitle: 'Verwalten Sie Ihre Kommunikationseinstellungen',
        newsletter: 'E-Mail-Newsletter',
        sms: 'SMS-Benachrichtigungen',
        reminders: 'Veranstaltungserinnerungen',
        dietary: 'Diätetische Einschränkungen',
        allergies: 'Allergien'
      },
      save: 'Änderungen speichern',
      edit: 'Profil bearbeiten'
    },
    orders: {
      title: 'Bestellverlauf',
      subtitle: 'Zeigen Sie Ihre vergangenen und bevorstehenden Veranstaltungen an',
      upcoming: 'Bevorstehende Veranstaltungen',
      past: 'Vergangene Veranstaltungen',
      noEvents: 'Keine Veranstaltungen geplant',
      viewDetails: 'Details anzeigen',
      status: {
        confirmed: 'Bestätigt',
        pending: 'Ausstehend',
        completed: 'Abgeschlossen',
        cancelled: 'Storniert'
      }
    },
    favorites: {
      title: 'Favorisierte Artikel',
      subtitle: 'Ihre gespeicherten Menüauswahlen',
      noFavorites: 'Noch keine Favoriten',
      addFromMenu: 'Vom Menü hinzufügen',
      remove: 'Entfernen'
    },
    payments: {
      title: 'Zahlungsmethoden',
      subtitle: 'Verwalten Sie Ihre Zahlungsinformationen',
      addCard: 'Neue Karte hinzufügen',
      noCards: 'Keine Zahlungsmethoden gespeichert',
      default: 'Standard',
      setDefault: 'Als Standard festlegen',
      remove: 'Entfernen'
    },
    settings: {
      title: 'Kontoeinstellungen',
      subtitle: 'Verwalten Sie Ihre Kontoeinstellungen',
      security: 'Sicherheit',
      notifications: 'Benachrichtigungen',
      privacy: 'Datenschutz',
      language: 'Sprache',
      delete: 'Konto löschen'
    }
  }
};
