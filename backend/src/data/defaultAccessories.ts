export type DefaultAccessory = {
  nameEn: string;
  nameDe: string;
  descriptionEn: string;
  descriptionDe: string;
  detailsEn?: string | null;
  detailsDe?: string | null;
  unitEn?: string | null;
  unitDe?: string | null;
  price: number;
  image: string;
  isActive: boolean;
};

export const DEFAULT_ACCESSORIES: DefaultAccessory[] = [
  {
    nameEn: 'Premium Porcelain Dinner Plates',
    nameDe: 'Porzellanteller (Premium)',
    descriptionEn: 'Elegant white porcelain plates for formal dining',
    descriptionDe: 'Elegante weiße Porzellanteller für formelle Anlässe',
    detailsEn: 'Set includes dinner plates only',
    detailsDe: 'Set enthält nur Teller',
    unitEn: 'per plate',
    unitDe: 'pro Teller',
    price: 3.5,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    nameEn: 'Stainless Steel Cutlery Set',
    nameDe: 'Edelstahl-Besteckset',
    descriptionEn: 'Complete cutlery set including knife, fork, and spoon',
    descriptionDe: 'Komplettes Besteckset mit Messer, Gabel und Löffel',
    detailsEn: 'Polished stainless steel',
    detailsDe: 'Polierter Edelstahl',
    unitEn: 'per set',
    unitDe: 'pro Set',
    price: 2.75,
    image: 'https://images.unsplash.com/photo-1595435934247-5d33b7f92c70?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    nameEn: 'Linen Napkins',
    nameDe: 'Leinenservietten',
    descriptionEn: 'High-quality linen napkins in various colors',
    descriptionDe: 'Hochwertige Leinenservietten in verschiedenen Farben',
    detailsEn: 'Available in white, black, or beige',
    detailsDe: 'Erhältlich in Weiß, Schwarz oder Beige',
    unitEn: 'per napkin',
    unitDe: 'pro Serviette',
    price: 1.2,
    image: 'https://images.unsplash.com/photo-1583845112203-1aa7e80d8d2c?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    nameEn: 'Wine Glasses',
    nameDe: 'Weingläser',
    descriptionEn: 'Classic crystal-clear wine glasses',
    descriptionDe: 'Klassische, kristallklare Weingläser',
    detailsEn: '12oz capacity',
    detailsDe: 'Fassungsvermögen 350ml',
    unitEn: 'per glass',
    unitDe: 'pro Glas',
    price: 2.25,
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    nameEn: 'Buffet Serving Platters',
    nameDe: 'Buffet-Servierplatten',
    descriptionEn: 'Large oval serving platters for buffet setup',
    descriptionDe: 'Große ovale Servierplatten für Buffet-Aufbau',
    detailsEn: 'Ceramic, heat-resistant',
    detailsDe: 'Keramik, hitzebeständig',
    unitEn: 'per platter',
    unitDe: 'pro Platte',
    price: 8.5,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    nameEn: 'Table Cloths',
    nameDe: 'Tischdecken',
    descriptionEn: 'Elegant table linen for formal events',
    descriptionDe: 'Elegante Tischwäsche für formelle Events',
    detailsEn: 'Various sizes available',
    detailsDe: 'Verschiedene Größen verfügbar',
    unitEn: 'per cloth',
    unitDe: 'pro Tischtuch',
    price: 12,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    nameEn: 'Coffee Cups & Saucers',
    nameDe: 'Kaffeetassen & Untertassen',
    descriptionEn: 'Classic cups and saucers for coffee service',
    descriptionDe: 'Klassische Tassen und Untertassen für den Kaffeeservice',
    detailsEn: 'Porcelain set (cup + saucer)',
    detailsDe: 'Porzellan-Set (Tasse + Untertasse)',
    unitEn: 'per set',
    unitDe: 'pro Set',
    price: 2.1,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    nameEn: 'Chafing Dish Warmers',
    nameDe: 'Warmhaltebehälter (Chafing Dishes)',
    descriptionEn: 'Keep buffet items warm throughout service',
    descriptionDe: 'Hält Buffet-Gerichte während des Services warm',
    detailsEn: 'Includes fuel canisters',
    detailsDe: 'Inkl. Brennpaste',
    unitEn: 'per unit',
    unitDe: 'pro Stück',
    price: 14.5,
    image: 'https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    nameEn: 'Serving Tongs',
    nameDe: 'Servierzangen',
    descriptionEn: 'Stainless steel tongs for buffet and serving stations',
    descriptionDe: 'Edelstahl-Zangen für Buffet- und Servierstationen',
    detailsEn: 'Food-safe, easy grip',
    detailsDe: 'Lebensmittelecht, guter Griff',
    unitEn: 'each',
    unitDe: 'pro Stück',
    price: 1.5,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    nameEn: 'Dessert Plates (Small)',
    nameDe: 'Dessertteller (klein)',
    descriptionEn: 'Small plates for desserts and pastries',
    descriptionDe: 'Kleine Teller für Desserts und Gebäck',
    detailsEn: 'Porcelain, stackable',
    detailsDe: 'Porzellan, stapelbar',
    unitEn: 'per plate',
    unitDe: 'pro Teller',
    price: 2.2,
    image: 'https://images.unsplash.com/photo-1529701870190-9ae4010fd124?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    nameEn: 'Glass Water Carafes',
    nameDe: 'Wasser-Karaffen (Glas)',
    descriptionEn: 'Glass carafes for water service',
    descriptionDe: 'Glaskaraffen für den Wasserservice',
    detailsEn: '1L capacity, easy pour',
    detailsDe: '1L Fassungsvermögen, leichtes Ausgießen',
    unitEn: 'each',
    unitDe: 'pro Stück',
    price: 6.5,
    image: 'https://images.unsplash.com/photo-1528823872057-9c018a7c7606?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    nameEn: 'Ice Buckets',
    nameDe: 'Eiskübel',
    descriptionEn: 'Ice buckets for beverage stations',
    descriptionDe: 'Eiskübel für Getränkestationen',
    detailsEn: 'Includes tongs',
    detailsDe: 'Inkl. Zange',
    unitEn: 'per unit',
    unitDe: 'pro Stück',
    price: 9.9,
    image: 'https://images.unsplash.com/photo-1528824198595-3b3e4b745e73?w=400&h=300&fit=crop',
    isActive: true
  },
  {
    nameEn: 'Paper Cups (Compostable)',
    nameDe: 'Pappbecher (kompostierbar)',
    descriptionEn: 'Compostable cups for hot drinks',
    descriptionDe: 'Kompostierbare Becher für Heißgetränke',
    detailsEn: 'Pack of 50',
    detailsDe: 'Packung mit 50 Stück',
    unitEn: 'each',
    unitDe: 'pro Stück',
    price: 0.18,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop',
    isActive: true
  }
];

