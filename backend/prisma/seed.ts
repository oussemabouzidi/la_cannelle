import { PrismaClient, UserRole, ProductCategory, MenuTier } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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
  console.log('✅ Created admin user:', admin.email);

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
  console.log('✅ Created client user:', client.email);

  // Create products
  const products = [
    {
      name: 'Truffle Mushroom Risotto',
      description: 'Arborio rice with seasonal wild mushrooms, white truffle oil, and Parmigiano-Reggiano',
      category: ProductCategory.MAIN,
      menuCategory: 'mains',
      price: 24,
      cost: 8,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 25,
      ingredients: ['Arborio rice', 'Wild mushrooms', 'White truffle oil', 'Parmigiano-Reggiano', 'Vegetable stock'] as any,
      allergens: ['Dairy'] as any,
      productCategories: ['vegetarian', 'signature'] as any,
      popularity: 95
    },
    {
      name: 'Herb-crusted Rack of Lamb',
      description: 'New Zealand lamb with rosemary crust, mint jus, and roasted root vegetables',
      category: ProductCategory.MAIN,
      menuCategory: 'mains',
      price: 38,
      cost: 15,
      available: true,
      tier: [MenuTier.LUXURY] as any,
      preparationTime: 35,
      ingredients: ['New Zealand lamb', 'Fresh rosemary', 'Mint', 'Root vegetables', 'Red wine jus'] as any,
      allergens: [] as any,
      productCategories: ['meat', 'chef-special'] as any,
      popularity: 88
    },
    {
      name: 'Seared Scallops',
      description: 'Day boat scallops with orange reduction, micro greens, and crispy prosciutto',
      category: ProductCategory.STARTER,
      menuCategory: 'starters',
      price: 28,
      cost: 12,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 20,
      ingredients: ['Fresh scallops', 'Orange', 'Micro greens', 'Prosciutto', 'Butter'] as any,
      allergens: ['Shellfish', 'Dairy'] as any,
      productCategories: ['seafood', 'spicy'] as any,
      popularity: 92
    },
    {
      name: 'Heirloom Tomato Burrata Salad',
      description: 'Colorful heirloom tomatoes with fresh burrata, basil oil, and balsamic reduction',
      category: ProductCategory.STARTER,
      menuCategory: 'starters',
      price: 18,
      cost: 6,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 15,
      ingredients: ['Heirloom tomatoes', 'Burrata cheese', 'Fresh basil', 'Balsamic vinegar', 'Olive oil'] as any,
      allergens: ['Dairy'] as any,
      productCategories: ['vegetarian', 'salad', 'seasonal'] as any,
      popularity: 85
    },
    {
      name: 'Chocolate Fondant',
      description: 'Warm chocolate cake with liquid center and fresh raspberry sauce',
      category: ProductCategory.DESSERT,
      menuCategory: 'desserts',
      price: 16,
      cost: 4,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 18,
      ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Raspberries'] as any,
      allergens: ['Dairy', 'Eggs'] as any,
      productCategories: ['dessert', 'signature'] as any,
      popularity: 90
    },
    {
      name: 'Grilled Salmon',
      description: 'Atlantic salmon with lemon butter sauce and seasonal vegetables',
      category: ProductCategory.MAIN,
      menuCategory: 'mains',
      price: 32,
      cost: 12,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 22,
      ingredients: ['Atlantic salmon', 'Lemon', 'Butter', 'Asparagus', 'Baby potatoes'] as any,
      allergens: ['Fish', 'Dairy'] as any,
      productCategories: ['seafood', 'gluten-free'] as any,
      popularity: 91
    },
    {
      name: 'Smoked Salmon Canape',
      description: 'Rye crisp with smoked salmon, dill cream, and capers',
      category: ProductCategory.STARTER,
      menuCategory: 'starters',
      price: 6,
      cost: 2,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 10,
      ingredients: ['Rye crisp', 'Smoked salmon', 'Dill cream', 'Capers'] as any,
      allergens: ['Fish', 'Dairy'] as any,
      productCategories: ['canape', 'fingerfood', 'seafood'] as any,
      popularity: 80
    },
    {
      name: 'Mini Beef Sliders',
      description: 'Brioche sliders with cheddar, pickles, and house sauce',
      category: ProductCategory.STARTER,
      menuCategory: 'starters',
      price: 7,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 12,
      ingredients: ['Beef', 'Brioche', 'Cheddar', 'Pickles', 'House sauce'] as any,
      allergens: ['Dairy', 'Wheat'] as any,
      productCategories: ['fingerfood', 'bbq', 'meat'] as any,
      popularity: 86
    },
    {
      name: 'Patatas Bravas',
      description: 'Crispy potatoes with spicy tomato sauce and garlic aioli',
      category: ProductCategory.SIDE,
      menuCategory: 'sides',
      price: 9,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 14,
      ingredients: ['Potatoes', 'Tomatoes', 'Garlic', 'Olive oil', 'Paprika'] as any,
      allergens: [] as any,
      productCategories: ['tapas', 'spicy', 'vegetarian'] as any,
      popularity: 82
    },
    {
      name: 'Seasonal Garden Salad',
      description: 'Mixed greens with citrus vinaigrette and toasted seeds',
      category: ProductCategory.SIDE,
      menuCategory: 'sides',
      price: 11,
      cost: 4,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 10,
      ingredients: ['Mixed greens', 'Citrus', 'Seeds', 'Olive oil'] as any,
      allergens: [] as any,
      productCategories: ['salad', 'vegan', 'seasonal'] as any,
      popularity: 78
    },
    {
      name: 'Butternut Squash Soup',
      description: 'Velvety squash soup with nutmeg and toasted pepitas',
      category: ProductCategory.STARTER,
      menuCategory: 'starters',
      price: 12,
      cost: 4,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 18,
      ingredients: ['Butternut squash', 'Onion', 'Vegetable stock', 'Nutmeg'] as any,
      allergens: [] as any,
      productCategories: ['soup', 'vegetarian'] as any,
      popularity: 74
    },
    {
      name: 'Herbed Pasta Primavera',
      description: 'Pasta with seasonal vegetables, herbs, and olive oil',
      category: ProductCategory.MAIN,
      menuCategory: 'mains',
      price: 20,
      cost: 7,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 20,
      ingredients: ['Pasta', 'Seasonal vegetables', 'Herbs', 'Olive oil'] as any,
      allergens: ['Wheat'] as any,
      productCategories: ['pasta', 'vegetarian'] as any,
      popularity: 81
    },
    {
      name: 'Citrus Mocktail',
      description: 'Sparkling citrus blend with mint and ginger',
      category: ProductCategory.BEVERAGE,
      menuCategory: 'drinks',
      price: 6,
      cost: 1,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 5,
      ingredients: ['Citrus', 'Mint', 'Ginger', 'Sparkling water'] as any,
      allergens: [] as any,
      productCategories: ['signature', 'seasonal'] as any,
      popularity: 69
    },
    {
      name: 'Mini Cheesecake Bites',
      description: 'Vanilla cheesecake bites with berry compote',
      category: ProductCategory.DESSERT,
      menuCategory: 'desserts',
      price: 10,
      cost: 3,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 12,
      ingredients: ['Cream cheese', 'Vanilla', 'Eggs', 'Berries'] as any,
      allergens: ['Dairy', 'Eggs'] as any,
      productCategories: ['dessert', 'kid-friendly'] as any,
      popularity: 84
    },
    {
      name: 'Tomato Basil Bruschetta',
      description: 'Grilled baguette with marinated tomatoes and basil',
      category: ProductCategory.STARTER,
      menuCategory: 'starters',
      price: 5,
      cost: 1.5,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 8,
      ingredients: ['Baguette', 'Tomatoes', 'Basil', 'Olive oil'] as any,
      allergens: ['Wheat'] as any,
      productCategories: ['fingerfood', 'vegetarian', 'canape'] as any,
      popularity: 76
    },
    {
      name: 'Crispy Chicken Bites',
      description: 'Golden fried chicken bites with paprika aioli',
      category: ProductCategory.STARTER,
      menuCategory: 'starters',
      price: 8,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 12,
      ingredients: ['Chicken', 'Breadcrumbs', 'Paprika', 'Aioli'] as any,
      allergens: ['Eggs', 'Wheat'] as any,
      productCategories: ['fingerfood', 'bbq', 'meat'] as any,
      popularity: 83
    },
    {
      name: 'Veggie Spring Rolls',
      description: 'Crispy rolls with cabbage, carrot, and sweet chili dip',
      category: ProductCategory.STARTER,
      menuCategory: 'starters',
      price: 7,
      cost: 2.5,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 10,
      ingredients: ['Cabbage', 'Carrot', 'Rice paper', 'Sweet chili'] as any,
      allergens: [] as any,
      productCategories: ['fingerfood', 'vegan', 'tapas'] as any,
      popularity: 79
    },
    {
      name: 'Roasted Beet Salad',
      description: 'Roasted beets with goat cheese, arugula, and walnuts',
      category: ProductCategory.STARTER,
      menuCategory: 'starters',
      price: 14,
      cost: 5,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 12,
      ingredients: ['Beets', 'Goat cheese', 'Arugula', 'Walnuts'] as any,
      allergens: ['Dairy', 'Nuts'] as any,
      productCategories: ['salad', 'vegetarian', 'seasonal'] as any,
      popularity: 77
    },
    {
      name: 'Braised Beef Short Rib',
      description: 'Slow-braised beef with red wine jus and herbs',
      category: ProductCategory.MAIN,
      menuCategory: 'mains',
      price: 36,
      cost: 14,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 40,
      ingredients: ['Beef short rib', 'Red wine', 'Herbs', 'Stock'] as any,
      allergens: [] as any,
      productCategories: ['meat', 'chef-special'] as any,
      popularity: 89
    },
    {
      name: 'Lemon Herb Chicken',
      description: 'Roasted chicken with lemon, garlic, and thyme',
      category: ProductCategory.MAIN,
      menuCategory: 'mains',
      price: 22,
      cost: 8,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 25,
      ingredients: ['Chicken', 'Lemon', 'Garlic', 'Thyme'] as any,
      allergens: [] as any,
      productCategories: ['meat', 'gluten-free'] as any,
      popularity: 80
    },
    {
      name: 'Coconut Chickpea Curry',
      description: 'Creamy coconut curry with chickpeas and vegetables',
      category: ProductCategory.MAIN,
      menuCategory: 'mains',
      price: 19,
      cost: 6,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 20,
      ingredients: ['Chickpeas', 'Coconut milk', 'Vegetables', 'Spices'] as any,
      allergens: [] as any,
      productCategories: ['vegan', 'spicy'] as any,
      popularity: 73
    },
    {
      name: 'Garlic Mashed Potatoes',
      description: 'Creamy mashed potatoes with roasted garlic',
      category: ProductCategory.SIDE,
      menuCategory: 'sides',
      price: 8,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 15,
      ingredients: ['Potatoes', 'Garlic', 'Butter'] as any,
      allergens: ['Dairy'] as any,
      productCategories: ['comfort', 'vegetarian'] as any,
      popularity: 75
    },
    {
      name: 'Roasted Seasonal Vegetables',
      description: 'Seasonal vegetables with olive oil and herbs',
      category: ProductCategory.SIDE,
      menuCategory: 'sides',
      price: 9,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 12,
      ingredients: ['Seasonal vegetables', 'Olive oil', 'Herbs'] as any,
      allergens: [] as any,
      productCategories: ['vegan', 'seasonal'] as any,
      popularity: 71
    },
    {
      name: 'Tiramisu Cups',
      description: 'Coffee-soaked ladyfingers with mascarpone cream',
      category: ProductCategory.DESSERT,
      menuCategory: 'desserts',
      price: 12,
      cost: 4,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 14,
      ingredients: ['Mascarpone', 'Espresso', 'Ladyfingers'] as any,
      allergens: ['Dairy', 'Eggs', 'Wheat'] as any,
      productCategories: ['dessert', 'signature'] as any,
      popularity: 87
    },
    {
      name: 'Fresh Fruit Tart',
      description: 'Shortcrust tart with pastry cream and fresh fruit',
      category: ProductCategory.DESSERT,
      menuCategory: 'desserts',
      price: 11,
      cost: 4,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 16,
      ingredients: ['Pastry cream', 'Seasonal fruit', 'Shortcrust'] as any,
      allergens: ['Dairy', 'Eggs', 'Wheat'] as any,
      productCategories: ['dessert', 'seasonal'] as any,
      popularity: 78
    },
    {
      name: 'Cucumber Mint Sparkler',
      description: 'Crisp cucumber, mint, and sparkling water',
      category: ProductCategory.BEVERAGE,
      menuCategory: 'drinks',
      price: 5,
      cost: 1,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 4,
      ingredients: ['Cucumber', 'Mint', 'Sparkling water'] as any,
      allergens: [] as any,
      productCategories: ['refreshing', 'seasonal'] as any,
      popularity: 68
    },
    {
      name: 'Iced Peach Tea',
      description: 'Chilled black tea with peach and citrus',
      category: ProductCategory.BEVERAGE,
      menuCategory: 'drinks',
      price: 5,
      cost: 1,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 4,
      ingredients: ['Black tea', 'Peach', 'Citrus'] as any,
      allergens: [] as any,
      productCategories: ['refreshing'] as any,
      popularity: 67
    },
    {
      name: 'Mini Caprese Skewers',
      description: 'Mozzarella, tomato, and basil skewers with balsamic glaze',
      category: ProductCategory.STARTER,
      menuCategory: 'starters',
      price: 6,
      cost: 2,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 8,
      ingredients: ['Mozzarella', 'Cherry tomatoes', 'Basil', 'Balsamic glaze'] as any,
      allergens: ['Dairy'] as any,
      productCategories: ['fingerfood', 'vegetarian', 'canape'] as any,
      popularity: 79
    },
    {
      name: 'Stuffed Mini Peppers',
      description: 'Sweet peppers stuffed with herbed cream cheese',
      category: ProductCategory.STARTER,
      menuCategory: 'starters',
      price: 7,
      cost: 2.5,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 10,
      ingredients: ['Mini peppers', 'Cream cheese', 'Herbs'] as any,
      allergens: ['Dairy'] as any,
      productCategories: ['fingerfood', 'vegetarian'] as any,
      popularity: 74
    },
    {
      name: 'Shrimp Cocktail Cups',
      description: 'Chilled shrimp with classic cocktail sauce',
      category: ProductCategory.STARTER,
      menuCategory: 'starters',
      price: 9,
      cost: 4,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 10,
      ingredients: ['Shrimp', 'Cocktail sauce', 'Lemon'] as any,
      allergens: ['Shellfish'] as any,
      productCategories: ['fingerfood', 'seafood'] as any,
      popularity: 82
    },
    {
      name: 'Greek Mezze Platter',
      description: 'Hummus, olives, feta, and pita bread',
      category: ProductCategory.SIDE,
      menuCategory: 'sides',
      price: 13,
      cost: 5,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 12,
      ingredients: ['Hummus', 'Olives', 'Feta', 'Pita'] as any,
      allergens: ['Dairy', 'Wheat'] as any,
      productCategories: ['tapas', 'vegetarian'] as any,
      popularity: 76
    },
    {
      name: 'BBQ Pulled Pork Sliders',
      description: 'Slow-cooked pork with BBQ sauce on mini buns',
      category: ProductCategory.MAIN,
      menuCategory: 'mains',
      price: 18,
      cost: 7,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 20,
      ingredients: ['Pork', 'BBQ sauce', 'Buns'] as any,
      allergens: ['Wheat'] as any,
      productCategories: ['bbq', 'meat'] as any,
      popularity: 85
    },
    {
      name: 'Seared Tuna Steak',
      description: 'Sesame-crusted tuna with soy ginger glaze',
      category: ProductCategory.MAIN,
      menuCategory: 'mains',
      price: 29,
      cost: 12,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 18,
      ingredients: ['Tuna', 'Sesame', 'Soy', 'Ginger'] as any,
      allergens: ['Fish', 'Sesame', 'Soy'] as any,
      productCategories: ['seafood', 'chef-special'] as any,
      popularity: 88
    },
    {
      name: 'Herb Roasted Turkey',
      description: 'Roasted turkey breast with sage and thyme',
      category: ProductCategory.MAIN,
      menuCategory: 'mains',
      price: 21,
      cost: 8,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 22,
      ingredients: ['Turkey', 'Sage', 'Thyme'] as any,
      allergens: [] as any,
      productCategories: ['meat'] as any,
      popularity: 78
    },
    {
      name: 'Wild Rice Pilaf',
      description: 'Wild rice with herbs and toasted almonds',
      category: ProductCategory.SIDE,
      menuCategory: 'sides',
      price: 9,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 15,
      ingredients: ['Wild rice', 'Herbs', 'Almonds'] as any,
      allergens: ['Nuts'] as any,
      productCategories: ['vegetarian'] as any,
      popularity: 70
    },
    {
      name: 'Truffle Mac and Cheese',
      description: 'Creamy mac and cheese with truffle oil',
      category: ProductCategory.SIDE,
      menuCategory: 'sides',
      price: 12,
      cost: 4,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 18,
      ingredients: ['Pasta', 'Cheddar', 'Truffle oil'] as any,
      allergens: ['Dairy', 'Wheat'] as any,
      productCategories: ['comfort', 'vegetarian'] as any,
      popularity: 86
    },
    {
      name: 'Vanilla Panna Cotta',
      description: 'Silky panna cotta with berry coulis',
      category: ProductCategory.DESSERT,
      menuCategory: 'desserts',
      price: 10,
      cost: 3,
      available: true,
      tier: [MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 12,
      ingredients: ['Cream', 'Vanilla', 'Berries'] as any,
      allergens: ['Dairy'] as any,
      productCategories: ['dessert'] as any,
      popularity: 81
    },
    {
      name: 'Lemon Tart',
      description: 'Tangy lemon tart with buttery crust',
      category: ProductCategory.DESSERT,
      menuCategory: 'desserts',
      price: 9,
      cost: 3,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 14,
      ingredients: ['Lemon', 'Butter', 'Flour'] as any,
      allergens: ['Dairy', 'Wheat', 'Eggs'] as any,
      productCategories: ['dessert'] as any,
      popularity: 77
    },
    {
      name: 'Berry Parfait',
      description: 'Layered yogurt, granola, and fresh berries',
      category: ProductCategory.DESSERT,
      menuCategory: 'desserts',
      price: 8,
      cost: 2.5,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 8,
      ingredients: ['Yogurt', 'Granola', 'Berries'] as any,
      allergens: ['Dairy', 'Wheat'] as any,
      productCategories: ['dessert', 'kid-friendly'] as any,
      popularity: 72
    },
    {
      name: 'Ginger Lemonade',
      description: 'Fresh lemonade with ginger and mint',
      category: ProductCategory.BEVERAGE,
      menuCategory: 'drinks',
      price: 5,
      cost: 1,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM] as any,
      preparationTime: 4,
      ingredients: ['Lemon', 'Ginger', 'Mint', 'Water'] as any,
      allergens: [] as any,
      productCategories: ['refreshing'] as any,
      popularity: 66
    },
    {
      name: 'Sparkling Apple Cider',
      description: 'Chilled sparkling apple cider',
      category: ProductCategory.BEVERAGE,
      menuCategory: 'drinks',
      price: 6,
      cost: 1.2,
      available: true,
      tier: [MenuTier.ESSENTIAL, MenuTier.PREMIUM, MenuTier.LUXURY] as any,
      preparationTime: 4,
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
    const minOrderQuantity = Number.isFinite(productData.minOrderQuantity)
      ? productData.minOrderQuantity
      : getDefaultMinOrderQuantity(productData);
    const product = await prisma.product.create({
      data: {
        ...productData,
        minOrderQuantity
      }
    });
    createdProducts.push(product);
  }
  console.log(`✅ Created ${createdProducts.length} products`);

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
  console.log('✅ Created system status');

  // Create closed dates
  await prisma.closedDate.createMany({
    data: [
      {
        date: new Date('2024-12-25'),
        reason: 'Christmas Day',
        recurring: true
      },
      {
        date: new Date('2024-12-31'),
        reason: 'New Years Eve',
        recurring: true
      }
    ]
  });
  console.log('✅ Created closed dates');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
