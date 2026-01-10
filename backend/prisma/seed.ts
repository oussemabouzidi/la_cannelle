import { PrismaClient, UserRole, ProductCategory, MenuTier } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('ðŸŒ± Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@catering.com' },
    update: {},
    create: {
      email: 'admin@catering.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN
    }
  });
  console.log('âœ… Created admin user:', admin.email);

  // Create sample client
  const clientPassword = await bcrypt.hash('client123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      password: clientPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 (555) 123-4567',
      company: 'Acme Corporation',
      position: 'Event Manager',
      role: UserRole.CLIENT,
      preferences: ['Italian', 'Vegetarian'] as any,
      allergies: ['Shellfish'] as any
    }
  });
  console.log('âœ… Created client user:', client.email);

  // Create products
  const products = [
    {
      name: 'Truffle Mushroom Risotto',
      description: 'Arborio rice with seasonal wild mushrooms, white truffle oil, and Parmigiano-Reggiano',
      category: ProductCategory.MAIN,
      price: 24,
      cost: 8,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Arborio rice', 'Wild mushrooms', 'White truffle oil', 'Parmigiano-Reggiano', 'Vegetable stock'] as any,
      allergens: ['Dairy'] as any,
      productCategories: ['vegetarian', 'signature'] as any,
      popularity: 95
    },
    {
      name: 'Herb-crusted Rack of Lamb',
      description: 'New Zealand lamb with rosemary crust, mint jus, and roasted root vegetables',
      category: ProductCategory.MAIN,
      price: 38,
      cost: 15,
      available: true,
      tier: [MenuTier.LUXURY] as any,
      ingredients: ['New Zealand lamb', 'Fresh rosemary', 'Mint', 'Root vegetables', 'Red wine jus'] as any,
      allergens: [] as any,
      productCategories: ['meat', 'chef-special'] as any,
      popularity: 88
    },
    {
      name: 'Seared Scallops',
      description: 'Day boat scallops with orange reduction, micro greens, and crispy prosciutto',
      category: ProductCategory.STARTER,
      price: 28,
      cost: 12,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Fresh scallops', 'Orange', 'Micro greens', 'Prosciutto', 'Butter'] as any,
      allergens: ['Shellfish', 'Dairy'] as any,
      productCategories: ['seafood', 'spicy'] as any,
      popularity: 92
    },
    {
      name: 'Heirloom Tomato Burrata Salad',
      description: 'Colorful heirloom tomatoes with fresh burrata, basil oil, and balsamic reduction',
      category: ProductCategory.STARTER,
      price: 18,
      cost: 6,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Heirloom tomatoes', 'Burrata cheese', 'Fresh basil', 'Balsamic vinegar', 'Olive oil'] as any,
      allergens: ['Dairy'] as any,
      productCategories: ['vegetarian', 'salad', 'seasonal'] as any,
      popularity: 85
    },
    {
      name: 'Chocolate Fondant',
      description: 'Warm chocolate cake with liquid center and fresh raspberry sauce',
      category: ProductCategory.DESSERT,
      price: 16,
      cost: 4,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Raspberries'] as any,
      allergens: ['Dairy', 'Eggs'] as any,
      productCategories: ['dessert', 'signature'] as any,
      popularity: 90
    },
    {
      name: 'Grilled Salmon',
      description: 'Atlantic salmon with lemon butter sauce and seasonal vegetables',
      category: ProductCategory.MAIN,
      price: 32,
      cost: 12,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Atlantic salmon', 'Lemon', 'Butter', 'Asparagus', 'Baby potatoes'] as any,
      allergens: ['Fish', 'Dairy'] as any,
      productCategories: ['seafood', 'gluten-free'] as any,
      popularity: 91
    },
    {
      name: 'Smoked Salmon Canape',
      description: 'Rye crisp with smoked salmon, dill cream, and capers',
      category: ProductCategory.STARTER,
      price: 6,
      cost: 2,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Rye crisp', 'Smoked salmon', 'Dill cream', 'Capers'] as any,
      allergens: ['Fish', 'Dairy'] as any,
      productCategories: ['canape', 'fingerfood', 'seafood'] as any,
      popularity: 80
    },
    {
      name: 'Mini Beef Sliders',
      description: 'Brioche sliders with cheddar, pickles, and house sauce',
      category: ProductCategory.STARTER,
      price: 7,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Beef', 'Brioche', 'Cheddar', 'Pickles', 'House sauce'] as any,
      allergens: ['Dairy', 'Wheat'] as any,
      productCategories: ['fingerfood', 'bbq', 'meat'] as any,
      popularity: 86
    },
    {
      name: 'Patatas Bravas',
      description: 'Crispy potatoes with spicy tomato sauce and garlic aioli',
      category: ProductCategory.SIDE,
      price: 9,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Potatoes', 'Tomatoes', 'Garlic', 'Olive oil', 'Paprika'] as any,
      allergens: [] as any,
      productCategories: ['tapas', 'spicy', 'vegetarian'] as any,
      popularity: 82
    },
    {
      name: 'Seasonal Garden Salad',
      description: 'Mixed greens with citrus vinaigrette and toasted seeds',
      category: ProductCategory.SIDE,
      price: 11,
      cost: 4,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Mixed greens', 'Citrus', 'Seeds', 'Olive oil'] as any,
      allergens: [] as any,
      productCategories: ['salad', 'vegan', 'seasonal'] as any,
      popularity: 78
    },
    {
      name: 'Butternut Squash Soup',
      description: 'Velvety squash soup with nutmeg and toasted pepitas',
      category: ProductCategory.STARTER,
      price: 12,
      cost: 4,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Butternut squash', 'Onion', 'Vegetable stock', 'Nutmeg'] as any,
      allergens: [] as any,
      productCategories: ['soup', 'vegetarian'] as any,
      popularity: 74
    },
    {
      name: 'Herbed Pasta Primavera',
      description: 'Pasta with seasonal vegetables, herbs, and olive oil',
      category: ProductCategory.MAIN,
      price: 20,
      cost: 7,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Pasta', 'Seasonal vegetables', 'Herbs', 'Olive oil'] as any,
      allergens: ['Wheat'] as any,
      productCategories: ['pasta', 'vegetarian'] as any,
      popularity: 81
    },
    {
      name: 'Citrus Mocktail',
      description: 'Sparkling citrus blend with mint and ginger',
      category: ProductCategory.BEVERAGE,
      price: 6,
      cost: 1,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Citrus', 'Mint', 'Ginger', 'Sparkling water'] as any,
      allergens: [] as any,
      productCategories: ['signature', 'seasonal'] as any,
      popularity: 69
    },
    {
      name: 'Mini Cheesecake Bites',
      description: 'Vanilla cheesecake bites with berry compote',
      category: ProductCategory.DESSERT,
      price: 10,
      cost: 3,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Cream cheese', 'Vanilla', 'Eggs', 'Berries'] as any,
      allergens: ['Dairy', 'Eggs'] as any,
      productCategories: ['dessert', 'kid-friendly'] as any,
      popularity: 84
    },
    {
      name: 'Tomato Basil Bruschetta',
      description: 'Grilled baguette with marinated tomatoes and basil',
      category: ProductCategory.STARTER,
      price: 5,
      cost: 1.5,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Baguette', 'Tomatoes', 'Basil', 'Olive oil'] as any,
      allergens: ['Wheat'] as any,
      productCategories: ['fingerfood', 'vegetarian', 'canape'] as any,
      popularity: 76
    },
    {
      name: 'Crispy Chicken Bites',
      description: 'Golden fried chicken bites with paprika aioli',
      category: ProductCategory.STARTER,
      price: 8,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Chicken', 'Breadcrumbs', 'Paprika', 'Aioli'] as any,
      allergens: ['Eggs', 'Wheat'] as any,
      productCategories: ['fingerfood', 'bbq', 'meat'] as any,
      popularity: 83
    },
    {
      name: 'Veggie Spring Rolls',
      description: 'Crispy rolls with cabbage, carrot, and sweet chili dip',
      category: ProductCategory.STARTER,
      price: 7,
      cost: 2.5,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Cabbage', 'Carrot', 'Rice paper', 'Sweet chili'] as any,
      allergens: [] as any,
      productCategories: ['fingerfood', 'vegan', 'tapas'] as any,
      popularity: 79
    },
    {
      name: 'Roasted Beet Salad',
      description: 'Roasted beets with goat cheese, arugula, and walnuts',
      category: ProductCategory.STARTER,
      price: 14,
      cost: 5,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Beets', 'Goat cheese', 'Arugula', 'Walnuts'] as any,
      allergens: ['Dairy', 'Nuts'] as any,
      productCategories: ['salad', 'vegetarian', 'seasonal'] as any,
      popularity: 77
    },
    {
      name: 'Braised Beef Short Rib',
      description: 'Slow-braised beef with red wine jus and herbs',
      category: ProductCategory.MAIN,
      price: 36,
      cost: 14,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Beef short rib', 'Red wine', 'Herbs', 'Stock'] as any,
      allergens: [] as any,
      productCategories: ['meat', 'chef-special'] as any,
      popularity: 89
    },
    {
      name: 'Lemon Herb Chicken',
      description: 'Roasted chicken with lemon, garlic, and thyme',
      category: ProductCategory.MAIN,
      price: 22,
      cost: 8,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Chicken', 'Lemon', 'Garlic', 'Thyme'] as any,
      allergens: [] as any,
      productCategories: ['meat', 'gluten-free'] as any,
      popularity: 80
    },
    {
      name: 'Coconut Chickpea Curry',
      description: 'Creamy coconut curry with chickpeas and vegetables',
      category: ProductCategory.MAIN,
      price: 19,
      cost: 6,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Chickpeas', 'Coconut milk', 'Vegetables', 'Spices'] as any,
      allergens: [] as any,
      productCategories: ['vegan', 'spicy'] as any,
      popularity: 73
    },
    {
      name: 'Garlic Mashed Potatoes',
      description: 'Creamy mashed potatoes with roasted garlic',
      category: ProductCategory.SIDE,
      price: 8,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Potatoes', 'Garlic', 'Butter'] as any,
      allergens: ['Dairy'] as any,
      productCategories: ['comfort', 'vegetarian'] as any,
      popularity: 75
    },
    {
      name: 'Roasted Seasonal Vegetables',
      description: 'Seasonal vegetables with olive oil and herbs',
      category: ProductCategory.SIDE,
      price: 9,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Seasonal vegetables', 'Olive oil', 'Herbs'] as any,
      allergens: [] as any,
      productCategories: ['vegan', 'seasonal'] as any,
      popularity: 71
    },
    {
      name: 'Tiramisu Cups',
      description: 'Coffee-soaked ladyfingers with mascarpone cream',
      category: ProductCategory.DESSERT,
      price: 12,
      cost: 4,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Mascarpone', 'Espresso', 'Ladyfingers'] as any,
      allergens: ['Dairy', 'Eggs', 'Wheat'] as any,
      productCategories: ['dessert', 'signature'] as any,
      popularity: 87
    },
    {
      name: 'Fresh Fruit Tart',
      description: 'Shortcrust tart with pastry cream and fresh fruit',
      category: ProductCategory.DESSERT,
      price: 11,
      cost: 4,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Pastry cream', 'Seasonal fruit', 'Shortcrust'] as any,
      allergens: ['Dairy', 'Eggs', 'Wheat'] as any,
      productCategories: ['dessert', 'seasonal'] as any,
      popularity: 78
    },
    {
      name: 'Cucumber Mint Sparkler',
      description: 'Crisp cucumber, mint, and sparkling water',
      category: ProductCategory.BEVERAGE,
      price: 5,
      cost: 1,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Cucumber', 'Mint', 'Sparkling water'] as any,
      allergens: [] as any,
      productCategories: ['refreshing', 'seasonal'] as any,
      popularity: 68
    },
    {
      name: 'Iced Peach Tea',
      description: 'Chilled black tea with peach and citrus',
      category: ProductCategory.BEVERAGE,
      price: 5,
      cost: 1,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Black tea', 'Peach', 'Citrus'] as any,
      allergens: [] as any,
      productCategories: ['refreshing'] as any,
      popularity: 67
    },
    {
      name: 'Mini Caprese Skewers',
      description: 'Mozzarella, tomato, and basil skewers with balsamic glaze',
      category: ProductCategory.STARTER,
      price: 6,
      cost: 2,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Mozzarella', 'Cherry tomatoes', 'Basil', 'Balsamic glaze'] as any,
      allergens: ['Dairy'] as any,
      productCategories: ['fingerfood', 'vegetarian', 'canape'] as any,
      popularity: 79
    },
    {
      name: 'Stuffed Mini Peppers',
      description: 'Sweet peppers stuffed with herbed cream cheese',
      category: ProductCategory.STARTER,
      price: 7,
      cost: 2.5,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Mini peppers', 'Cream cheese', 'Herbs'] as any,
      allergens: ['Dairy'] as any,
      productCategories: ['fingerfood', 'vegetarian'] as any,
      popularity: 74
    },
    {
      name: 'Shrimp Cocktail Cups',
      description: 'Chilled shrimp with classic cocktail sauce',
      category: ProductCategory.STARTER,
      price: 9,
      cost: 4,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Shrimp', 'Cocktail sauce', 'Lemon'] as any,
      allergens: ['Shellfish'] as any,
      productCategories: ['fingerfood', 'seafood'] as any,
      popularity: 82
    },
    {
      name: 'Greek Mezze Platter',
      description: 'Hummus, olives, feta, and pita bread',
      category: ProductCategory.SIDE,
      price: 13,
      cost: 5,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Hummus', 'Olives', 'Feta', 'Pita'] as any,
      allergens: ['Dairy', 'Wheat'] as any,
      productCategories: ['tapas', 'vegetarian'] as any,
      popularity: 76
    },
    {
      name: 'BBQ Pulled Pork Sliders',
      description: 'Slow-cooked pork with BBQ sauce on mini buns',
      category: ProductCategory.MAIN,
      price: 18,
      cost: 7,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Pork', 'BBQ sauce', 'Buns'] as any,
      allergens: ['Wheat'] as any,
      productCategories: ['bbq', 'meat'] as any,
      popularity: 85
    },
    {
      name: 'Seared Tuna Steak',
      description: 'Sesame-crusted tuna with soy ginger glaze',
      category: ProductCategory.MAIN,
      price: 29,
      cost: 12,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Tuna', 'Sesame', 'Soy', 'Ginger'] as any,
      allergens: ['Fish', 'Sesame', 'Soy'] as any,
      productCategories: ['seafood', 'chef-special'] as any,
      popularity: 88
    },
    {
      name: 'Herb Roasted Turkey',
      description: 'Roasted turkey breast with sage and thyme',
      category: ProductCategory.MAIN,
      price: 21,
      cost: 8,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Turkey', 'Sage', 'Thyme'] as any,
      allergens: [] as any,
      productCategories: ['meat'] as any,
      popularity: 78
    },
    {
      name: 'Wild Rice Pilaf',
      description: 'Wild rice with herbs and toasted almonds',
      category: ProductCategory.SIDE,
      price: 9,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Wild rice', 'Herbs', 'Almonds'] as any,
      allergens: ['Nuts'] as any,
      productCategories: ['vegetarian'] as any,
      popularity: 70
    },
    {
      name: 'Truffle Mac and Cheese',
      description: 'Creamy mac and cheese with truffle oil',
      category: ProductCategory.SIDE,
      price: 12,
      cost: 4,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Pasta', 'Cheddar', 'Truffle oil'] as any,
      allergens: ['Dairy', 'Wheat'] as any,
      productCategories: ['comfort', 'vegetarian'] as any,
      popularity: 86
    },
    {
      name: 'Vanilla Panna Cotta',
      description: 'Silky panna cotta with berry coulis',
      category: ProductCategory.DESSERT,
      price: 10,
      cost: 3,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Cream', 'Vanilla', 'Berries'] as any,
      allergens: ['Dairy'] as any,
      productCategories: ['dessert'] as any,
      popularity: 81
    },
    {
      name: 'Lemon Tart',
      description: 'Tangy lemon tart with buttery crust',
      category: ProductCategory.DESSERT,
      price: 9,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Lemon', 'Butter', 'Flour'] as any,
      allergens: ['Dairy', 'Wheat', 'Eggs'] as any,
      productCategories: ['dessert'] as any,
      popularity: 77
    },
    {
      name: 'Berry Parfait',
      description: 'Layered yogurt, granola, and fresh berries',
      category: ProductCategory.DESSERT,
      price: 8,
      cost: 2.5,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Yogurt', 'Granola', 'Berries'] as any,
      allergens: ['Dairy', 'Wheat'] as any,
      productCategories: ['dessert', 'kid-friendly'] as any,
      popularity: 72
    },
    {
      name: 'Ginger Lemonade',
      description: 'Fresh lemonade with ginger and mint',
      category: ProductCategory.BEVERAGE,
      price: 5,
      cost: 1,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      ingredients: ['Lemon', 'Ginger', 'Mint', 'Water'] as any,
      allergens: [] as any,
      productCategories: ['refreshing'] as any,
      popularity: 66
    },
    {
      name: 'Sparkling Apple Cider',
      description: 'Chilled sparkling apple cider',
      category: ProductCategory.BEVERAGE,
      price: 6,
      cost: 1.2,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      ingredients: ['Apple cider', 'Sparkling water'] as any,
      allergens: [] as any,
      productCategories: ['seasonal'] as any,
      popularity: 70
    }
  ];

  const createdProducts = [];
  const getDefaultMinOrderQuantity = (product: any) => {
    const tags = Array.isArray(product.productCategories) ? product.productCategories.map((tag: string) => tag.toLowerCase()) : [];
    if (tags.some((tag: string) => ['fingerfood', 'canape', 'tapas'].includes(tag))) return 10;
    switch (product.category) {
      case ProductCategory.MAIN:
        return 5;
      case ProductCategory.SIDE:
        return 6;
      case ProductCategory.DESSERT:
        return 8;
      case ProductCategory.BEVERAGE:
        return 10;
      case ProductCategory.STARTER:
      default:
        return 8;
    }
  };
  for (const productData of products) {
    const minOrderQuantity =
  Number.isFinite((productData as any).minOrderQuantity)
    ? (productData as any).minOrderQuantity
    : getDefaultMinOrderQuantity(productData);

    const normalizedProductData = productData as any;
    const product = await prisma.product.create({
      data: {
        ...normalizedProductData,
        minOrderQuantity
      }
    });
    createdProducts.push(product);
  }
  console.log(`âœ… Created ${createdProducts.length} products`);

  // Create system status
  await prisma.systemStatus.upsert({
    where: { id: 1 },
    update: {},
    create: {
      orderingPaused: false,
      capacityLimit: 50,
      currentReservations: 2,
      dailyLimit: 100,
      perHourLimit: 25,
      weekendMultiplier: 1.5,
      enableAutoPause: true
    }
  });
  console.log('âœ… Created system status');


  // Create accessories (used in order page step 10)
  const accessories = [
    {
      nameEn: 'Premium Porcelain Dinner Plates',
      nameDe: 'Porzellanteller (Premium)',
      descriptionEn: 'Elegant white porcelain plates for formal dining',
      descriptionDe: 'Elegante weiÃŸe Porzellanteller fÃ¼r formelle AnlÃ¤sse',
      detailsEn: 'Set includes dinner plates only',
      detailsDe: 'Set enthÃ¤lt nur Teller',
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
      descriptionDe: 'Komplettes Besteckset mit Messer, Gabel und LÃ¶ffel',
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
      detailsDe: 'ErhÃ¤ltlich in WeiÃŸ, Schwarz oder Beige',
      unitEn: 'per napkin',
      unitDe: 'pro Serviette',
      price: 1.2,
      image: 'https://images.unsplash.com/photo-1583845112203-1aa7e80d8d2c?w=400&h=300&fit=crop',
      isActive: true
    },
    {
      nameEn: 'Wine Glasses',
      nameDe: 'WeinglÃ¤ser',
      descriptionEn: 'Classic crystal-clear wine glasses',
      descriptionDe: 'Klassische, kristallklare WeinglÃ¤ser',
      detailsEn: '12oz capacity',
      detailsDe: 'FassungsvermÃ¶gen 350ml',
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
      descriptionDe: 'GroÃŸe ovale Servierplatten fÃ¼r Buffet-Aufbau',
      detailsEn: 'Ceramic, heat-resistant',
      detailsDe: 'Keramik, hitzebestÃ¤ndig',
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
      descriptionDe: 'Elegante TischwÃ¤sche fÃ¼r formelle Events',
      detailsEn: 'Various sizes available',
      detailsDe: 'Verschiedene GrÃ¶ÃŸen verfÃ¼gbar',
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
      descriptionDe: 'Klassische Tassen und Untertassen fÃ¼r den Kaffeeservice',
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
      nameDe: 'WarmhaltebehÃ¤lter (Chafing Dish)',
      descriptionEn: 'Keep buffet food warm throughout the event',
      descriptionDe: 'HÃ¤lt Buffet-Speisen wÃ¤hrend des Events warm',
      detailsEn: 'Includes stand + fuel holder (fuel not included)',
      detailsDe: 'Inkl. Gestell + Brennpastenhalter (Brennpaste nicht inkl.)',
      unitEn: 'per unit',
      unitDe: 'pro StÃ¼ck',
      price: 18.0,
      image: 'https://images.unsplash.com/photo-1598514982840-1d5b8f6b7c15?w=400&h=300&fit=crop',
      isActive: true
    },
    {
      nameEn: 'Serving Tongs',
      nameDe: 'Servierzangen',
      descriptionEn: 'Stainless steel tongs for buffet and serving stations',
      descriptionDe: 'Edelstahl-Zangen fÃ¼r Buffet- und Servierstationen',
      detailsEn: 'Food-safe, easy grip',
      detailsDe: 'Lebensmittelecht, guter Griff',
      unitEn: 'each',
      unitDe: 'pro StÃ¼ck',
      price: 1.5,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
      isActive: true
    },
    {
      nameEn: 'Dessert Plates (Small)',
      nameDe: 'Dessertteller (klein)',
      descriptionEn: 'Small plates for desserts and pastries',
      descriptionDe: 'Kleine Teller fÃ¼r Desserts und GebÃ¤ck',
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
      descriptionDe: 'Glaskaraffen fÃ¼r den Wasserservice',
      detailsEn: '1L capacity, easy pour',
      detailsDe: '1L FassungsvermÃ¶gen, leichtes AusgieÃŸen',
      unitEn: 'each',
      unitDe: 'pro StÃ¼ck',
      price: 6.5,
      image: 'https://images.unsplash.com/photo-1528823872057-9c018a7c7606?w=400&h=300&fit=crop',
      isActive: true
    },
    {
      nameEn: 'Ice Buckets',
      nameDe: 'EiskÃ¼bel',
      descriptionEn: 'Ice buckets for beverage stations',
      descriptionDe: 'EiskÃ¼bel fÃ¼r GetrÃ¤nkestationen',
      detailsEn: 'Includes tongs',
      detailsDe: 'Inkl. Zange',
      unitEn: 'per unit',
      unitDe: 'pro StÃ¼ck',
      price: 9.9,
      image: 'https://images.unsplash.com/photo-1528824198595-3b3e4b745e73?w=400&h=300&fit=crop',
      isActive: true
    },
    {
      nameEn: 'Paper Cups (Compostable)',
      nameDe: 'Pappbecher (kompostierbar)',
      descriptionEn: 'Compostable cups for hot drinks',
      descriptionDe: 'Kompostierbare Becher fÃ¼r HeiÃŸgetrÃ¤nke',
      detailsEn: 'Pack of 50',
      detailsDe: 'Packung mit 50 StÃ¼ck',
      unitEn: 'each',
      unitDe: 'pro StÃ¼ck',
      price: 0.18,
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop',
      isActive: true
    }
  ];

  let createdAccessories = 0;
  for (const accessory of accessories) {
    const existing = await prisma.accessory.findFirst({ where: { nameEn: accessory.nameEn } });
    if (existing) {
      await prisma.accessory.update({ where: { id: existing.id }, data: accessory });
    } else {
      await prisma.accessory.create({ data: accessory });
      createdAccessories += 1;
    }
  }
  console.log(`ãƒ. Seeded accessories (created ${createdAccessories})`);

  // Seed services (used for business/private occasion selection)
  const services = [
    {
      name: 'Office Catering',
      occasion: 'BUSINESS',
      description: 'Breakfast meetings, lunch delivery, and ongoing office catering.',
      image: 'https://images.unsplash.com/photo-1555992336-03a23c7b20a6?w=800&fit=crop',
      isActive: true
    },
    {
      name: 'Corporate Events',
      occasion: 'BUSINESS',
      description: 'Professional catering for meetings, conferences, and launches.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&fit=crop',
      isActive: true
    },
    {
      name: 'Event Catering',
      occasion: 'PRIVATE',
      description: 'Birthdays, anniversaries, and private celebrations.',
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&fit=crop',
      isActive: true
    },
    {
      name: 'Weddings',
      occasion: 'PRIVATE',
      description: 'Bespoke wedding menus, service, and coordination.',
      image: 'https://images.unsplash.com/photo-1523438097201-fb5f1f6b227b?w=800&fit=crop',
      isActive: true
    }
  ] as const;

  let createdServices = 0;
  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: {
        name: service.name,
        occasion: service.occasion,
      },
    });
    if (existing) {
      await prisma.service.update({ where: { id: existing.id }, data: service as any });
    } else {
      await prisma.service.create({ data: service as any });
      createdServices += 1;
    }
  }
  console.log(`èŒ»?. Seeded services (created ${createdServices})`);

  // Create closed dates
const closedDates = [
  { date: new Date('2024-12-25'), reason: 'Christmas Day', recurring: true },
  { date: new Date('2024-12-31'), reason: 'New Years Eve', recurring: true }
];

for (const cd of closedDates) {
  await prisma.closedDate.upsert({
    where: { date: cd.date },
    update: {},
    create: cd
  });
}

console.log('âœ… Created closed dates');


}

main()
  .catch((e) => {
    console.error('âŒ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
