import { commonTranslations } from './common';

export const adminTranslations = {
  EN: {
    ...commonTranslations.EN,
    dashboard: {
      title: 'Dashboard',
      orders: {
        total: 'Total Orders',
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed'
      },
      revenue: {
        today: 'Today\'s Revenue',
        week: 'Weekly Revenue',
        month: 'Monthly Revenue',
        growth: 'Growth'
      },
      todaysEvents: 'Today\'s Events',
      recentOrders: 'Recent Orders',
      viewAll: 'View All Orders'
    },
    orders: {
      title: 'Orders Management',
      search: 'Search orders...',
      filters: {
        status: 'All Status',
        date: 'All Dates',
        today: 'Today',
        upcoming: 'Upcoming'
      },
      refresh: 'Refresh',
      columns: {
        orderId: 'Order ID',
        client: 'Client',
        event: 'Event',
        dateTime: 'Date & Time',
        guests: 'Guests',
        total: 'Total',
        status: 'Status',
        actions: 'Actions'
      },
      actions: {
        view: 'View Details',
        complete: 'Mark Complete',
        cancel: 'Cancel Order'
      },
      details: {
        title: 'Order Details',
        clientInfo: 'Client Information',
        eventDetails: 'Event Details',
        orderItems: 'Order Items',
        specialRequests: 'Special Requests',
        statusManagement: 'Status Management',
        cancelOrder: 'Cancel Order',
        cancelReason: 'Reason for cancellation...'
      }
    },
    menuManagement: {
      title: 'Menu Management',
      products: 'Products',
      menus: 'Menus',
      addProduct: 'Add Product',
      addMenu: 'Add Menu',
      search: 'Search...',
      filters: {
        category: 'All Categories',
        menu: 'All Menus',
        status: 'All Status'
      }
    },
    customers: {
      title: 'Customer Management',
      search: 'Search customers...',
      filters: {
        status: 'All Status'
      },
      tabs: {
        list: 'Customer List',
        history: 'Order History'
      },
      promotion: 'Send Promotion'
    },
    reports: {
      title: 'Analytics & Reports',
      tabs: {
        revenue: 'Revenue Reports',
        popular: 'Popular Items',
        export: 'Export Data'
      },
      metrics: {
        totalRevenue: 'Total Revenue',
        totalOrders: 'Total Orders',
        retention: 'Customer Retention',
        avgValue: 'Avg. Customer Value'
      }
    },
    system: {
      title: 'System Control',
      tabs: {
        ordering: 'Ordering Control',
        dates: 'Closed Dates',
        capacity: 'Capacity Limits'
      },
      ordering: {
        status: 'Ordering System Status',
        paused: 'Ordering is currently PAUSED',
        active: 'Ordering is ACTIVE',
        pauseReason: 'Reason for Pause (Optional)',
        resumeOn: 'Resume Ordering On',
        resume: 'Resume Ordering',
        pause: 'Pause Ordering'
      },
      closedDates: {
        add: 'Add Closed Date',
        date: 'Date',
        reason: 'Reason',
        recurring: 'Recurring annually',
        upcoming: 'Upcoming Closed Dates',
        past: 'Past Closed Dates'
      },
      capacity: {
        title: 'Capacity Settings',
        dailyLimit: 'Daily Order Limit',
        perHourLimit: 'Per Hour Limit',
        weekendMultiplier: 'Weekend Capacity Multiplier',
        autoPause: 'Auto-pause when capacity reached',
        current: 'Current Capacity',
        usage: 'Today\'s Usage',
        remaining: 'orders remaining today',
        weekend: 'Weekend Capacity'
      }
    }
  },
  DE: {
    ...commonTranslations.DE,
    dashboard: {
      title: 'Dashboard',
      orders: {
        total: 'Gesamtbestellungen',
        pending: 'Ausstehend',
        confirmed: 'Bestätigt',
        completed: 'Abgeschlossen'
      },
      revenue: {
        today: 'Heutiger Umsatz',
        week: 'Wöchentlicher Umsatz',
        month: 'Monatlicher Umsatz',
        growth: 'Wachstum'
      },
      todaysEvents: 'Heutige Veranstaltungen',
      recentOrders: 'Letzte Bestellungen',
      viewAll: 'Alle Bestellungen anzeigen'
    },
    orders: {
      title: 'Bestellungsverwaltung',
      search: 'Bestellungen suchen...',
      filters: {
        status: 'Alle Status',
        date: 'Alle Daten',
        today: 'Heute',
        upcoming: 'Bevorstehend'
      },
      refresh: 'Aktualisieren',
      columns: {
        orderId: 'Bestell-ID',
        client: 'Kunde',
        event: 'Veranstaltung',
        dateTime: 'Datum & Uhrzeit',
        guests: 'Gäste',
        total: 'Gesamt',
        status: 'Status',
        actions: 'Aktionen'
      },
      actions: {
        view: 'Details anzeigen',
        complete: 'Als abgeschlossen markieren',
        cancel: 'Bestellung stornieren'
      },
      details: {
        title: 'Bestelldetails',
        clientInfo: 'Kundeninformationen',
        eventDetails: 'Veranstaltungsdetails',
        orderItems: 'Bestellartikel',
        specialRequests: 'Besondere Anfragen',
        statusManagement: 'Statusverwaltung',
        cancelOrder: 'Bestellung stornieren',
        cancelReason: 'Grund für Stornierung...'
      }
    },
    menuManagement: {
      title: 'Menüverwaltung',
      products: 'Produkte',
      menus: 'Menüs',
      addProduct: 'Produkt hinzufügen',
      addMenu: 'Menü hinzufügen',
      search: 'Suchen...',
      filters: {
        category: 'Alle Kategorien',
        menu: 'Alle Menüs',
        status: 'Alle Status'
      }
    },
    customers: {
      title: 'Kundenverwaltung',
      search: 'Kunden suchen...',
      filters: {
        status: 'Alle Status'
      },
      tabs: {
        list: 'Kundenliste',
        history: 'Bestellverlauf'
      },
      promotion: 'Aktion senden'
    },
    reports: {
      title: 'Analysen & Berichte',
      tabs: {
        revenue: 'Umsatzberichte',
        popular: 'Beliebte Artikel',
        export: 'Daten exportieren'
      },
      metrics: {
        totalRevenue: 'Gesamtumsatz',
        totalOrders: 'Gesamtbestellungen',
        retention: 'Kundenbindung',
        avgValue: 'Durchschn. Kundenwert'
      }
    },
    system: {
      title: 'Systemsteuerung',
      tabs: {
        ordering: 'Bestellsteuerung',
        dates: 'Geschlossene Daten',
        capacity: 'Kapazitätsgrenzen'
      },
      ordering: {
        status: 'Bestellsystem-Status',
        paused: 'Bestellungen sind derzeit PAUSIERT',
        active: 'Bestellungen sind AKTIV',
        pauseReason: 'Grund für Pause (Optional)',
        resumeOn: 'Bestellungen fortsetzen am',
        resume: 'Bestellungen fortsetzen',
        pause: 'Bestellungen pausieren'
      },
      closedDates: {
        add: 'Geschlossenes Datum hinzufügen',
        date: 'Datum',
        reason: 'Grund',
        recurring: 'Jährlich wiederkehrend',
        upcoming: 'Bevorstehende geschlossene Daten',
        past: 'Vergangene geschlossene Daten'
      },
      capacity: {
        title: 'Kapazitätseinstellungen',
        dailyLimit: 'Tägliches Bestelllimit',
        perHourLimit: 'Pro Stunde Limit',
        weekendMultiplier: 'Wochenend-Kapazitätsmultiplikator',
        autoPause: 'Automatisch pausieren, wenn Kapazität erreicht',
        current: 'Aktuelle Kapazität',
        usage: 'Heutige Nutzung',
        remaining: 'Bestellungen verbleiben heute',
        weekend: 'Wochenend-Kapazität'
      }
    }
  }
};
