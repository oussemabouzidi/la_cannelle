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
    }
  ];

  const createdProducts = [];
  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData
    });
    createdProducts.push(product);
  }
  console.log(`✅ Created ${createdProducts.length} products`);

  // Create menus
  const springMenu = await prisma.menu.create({
    data: {
      name: 'Spring Menu',
      description: 'Seasonal spring dishes with fresh ingredients',
      category: 'seasonal',
      type: 'fixed',
      isActive: true,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-05-31'),
      price: 85,
      menuProducts: {
        create: [
          { productId: createdProducts[0].id }, // Risotto
          { productId: createdProducts[1].id }, // Lamb
          { productId: createdProducts[3].id }, // Salad
          { productId: createdProducts[5].id }  // Salmon
        ]
      }
    }
  });

  const premiumMenu = await prisma.menu.create({
    data: {
      name: 'Premium Tasting',
      description: 'Gourmet tasting experience with wine pairing',
      category: 'luxury',
      type: 'tasting',
      isActive: true,
      price: 120,
      menuProducts: {
        create: [
          { productId: createdProducts[0].id }, // Risotto
          { productId: createdProducts[2].id }, // Scallops
          { productId: createdProducts[4].id }, // Fondant
          { productId: createdProducts[5].id }  // Salmon
        ]
      }
    }
  });
  console.log('✅ Created menus');

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      userId: client.id,
      clientName: 'John Doe',
      contactEmail: 'client@example.com',
      phone: '+1 (555) 123-4567',
      eventType: 'Corporate Lunch',
      eventDate: new Date('2024-12-20'),
      eventTime: '12:30 PM',
      guests: 45,
      location: 'TechCorp HQ, Düsseldorf',
      menuTier: MenuTier.PREMIUM,
      total: 3375,
      subtotal: 3326.10,
      serviceFee: 48.90,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      specialRequests: 'Vegetarian options needed for 8 guests',
      businessType: 'B2B',
      serviceType: 'office',
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            quantity: 45,
            price: 24,
            name: 'Truffle Mushroom Risotto'
          },
          {
            productId: createdProducts[2].id,
            quantity: 45,
            price: 28,
            name: 'Seared Scallops'
          }
        ]
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      clientName: 'Smith Wedding',
      contactEmail: 'emily.smith@email.com',
      phone: '+49 987 654 321',
      eventType: 'Wedding Reception',
      eventDate: new Date('2024-12-22'),
      eventTime: '4:00 PM',
      guests: 120,
      location: 'Schloss Benrath, Düsseldorf',
      menuTier: MenuTier.LUXURY,
      total: 14400,
      subtotal: 14351.10,
      serviceFee: 48.90,
      status: 'PREPARATION',
      paymentStatus: 'PAID',
      specialRequests: 'Gluten-free cake, vegan options',
      businessType: 'B2C',
      serviceType: 'wedding',
      items: {
        create: [
          {
            productId: createdProducts[1].id,
            quantity: 120,
            price: 38,
            name: 'Herb-crusted Rack of Lamb'
          },
          {
            productId: createdProducts[3].id,
            quantity: 120,
            price: 18,
            name: 'Heirloom Tomato Burrata Salad'
          }
        ]
      }
    }
  });
  console.log('✅ Created sample orders');

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
