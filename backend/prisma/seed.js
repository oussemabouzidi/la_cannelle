"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // Create admin user
    const adminPassword = await bcryptjs_1.default.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@catering.com' },
        update: {},
        create: {
            email: 'admin@catering.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: client_1.UserRole.ADMIN
        }
    });
    console.log('✅ Created admin user:', admin.email);
    // Create sample client
    const clientPassword = await bcryptjs_1.default.hash('client123', 10);
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
            role: client_1.UserRole.CLIENT,
            preferences: ['Italian', 'Vegetarian'],
            allergies: ['Shellfish']
        }
    });
    console.log('✅ Created client user:', client.email);
    // Create products
    const products = [
        {
            name: 'Truffle Mushroom Risotto',
            description: 'Arborio rice with seasonal wild mushrooms, white truffle oil, and Parmigiano-Reggiano',
            category: client_1.ProductCategory.MAIN,
            menuCategory: 'mains',
            price: 24,
            cost: 8,
            available: true,
            tier: [client_1.MenuTier.PREMIUM, client_1.MenuTier.LUXURY],
            preparationTime: 25,
            ingredients: ['Arborio rice', 'Wild mushrooms', 'White truffle oil', 'Parmigiano-Reggiano', 'Vegetable stock'],
            allergens: ['Dairy'],
            productCategories: ['vegetarian', 'signature'],
            popularity: 95
        },
        {
            name: 'Herb-crusted Rack of Lamb',
            description: 'New Zealand lamb with rosemary crust, mint jus, and roasted root vegetables',
            category: client_1.ProductCategory.MAIN,
            menuCategory: 'mains',
            price: 38,
            cost: 15,
            available: true,
            tier: [client_1.MenuTier.LUXURY],
            preparationTime: 35,
            ingredients: ['New Zealand lamb', 'Fresh rosemary', 'Mint', 'Root vegetables', 'Red wine jus'],
            allergens: [],
            productCategories: ['meat', 'chef-special'],
            popularity: 88
        },
        {
            name: 'Seared Scallops',
            description: 'Day boat scallops with orange reduction, micro greens, and crispy prosciutto',
            category: client_1.ProductCategory.STARTER,
            menuCategory: 'starters',
            price: 28,
            cost: 12,
            available: true,
            tier: [client_1.MenuTier.PREMIUM, client_1.MenuTier.LUXURY],
            preparationTime: 20,
            ingredients: ['Fresh scallops', 'Orange', 'Micro greens', 'Prosciutto', 'Butter'],
            allergens: ['Shellfish', 'Dairy'],
            productCategories: ['seafood', 'spicy'],
            popularity: 92
        },
        {
            name: 'Heirloom Tomato Burrata Salad',
            description: 'Colorful heirloom tomatoes with fresh burrata, basil oil, and balsamic reduction',
            category: client_1.ProductCategory.STARTER,
            menuCategory: 'starters',
            price: 18,
            cost: 6,
            available: true,
            tier: [client_1.MenuTier.ESSENTIAL, client_1.MenuTier.PREMIUM, client_1.MenuTier.LUXURY],
            preparationTime: 15,
            ingredients: ['Heirloom tomatoes', 'Burrata cheese', 'Fresh basil', 'Balsamic vinegar', 'Olive oil'],
            allergens: ['Dairy'],
            productCategories: ['vegetarian', 'salad', 'seasonal'],
            popularity: 85
        },
        {
            name: 'Chocolate Fondant',
            description: 'Warm chocolate cake with liquid center and fresh raspberry sauce',
            category: client_1.ProductCategory.DESSERT,
            menuCategory: 'desserts',
            price: 16,
            cost: 4,
            available: true,
            tier: [client_1.MenuTier.PREMIUM, client_1.MenuTier.LUXURY],
            preparationTime: 18,
            ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Raspberries'],
            allergens: ['Dairy', 'Eggs'],
            productCategories: ['dessert', 'signature'],
            popularity: 90
        },
        {
            name: 'Grilled Salmon',
            description: 'Atlantic salmon with lemon butter sauce and seasonal vegetables',
            category: client_1.ProductCategory.MAIN,
            menuCategory: 'mains',
            price: 32,
            cost: 12,
            available: true,
            tier: [client_1.MenuTier.PREMIUM, client_1.MenuTier.LUXURY],
            preparationTime: 22,
            ingredients: ['Atlantic salmon', 'Lemon', 'Butter', 'Asparagus', 'Baby potatoes'],
            allergens: ['Fish', 'Dairy'],
            productCategories: ['seafood', 'gluten-free'],
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
            isActive: true,
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-05-31'),
            price: 85,
            menuProducts: {
                create: [
                    { productId: createdProducts[0].id }, // Risotto
                    { productId: createdProducts[1].id }, // Lamb
                    { productId: createdProducts[3].id }, // Salad
                    { productId: createdProducts[5].id } // Salmon
                ]
            }
        }
    });
    const premiumMenu = await prisma.menu.create({
        data: {
            name: 'Premium Tasting',
            description: 'Gourmet tasting experience with wine pairing',
            isActive: true,
            price: 120,
            menuProducts: {
                create: [
                    { productId: createdProducts[0].id }, // Risotto
                    { productId: createdProducts[2].id }, // Scallops
                    { productId: createdProducts[4].id }, // Fondant
                    { productId: createdProducts[5].id } // Salmon
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
            menuTier: client_1.MenuTier.PREMIUM,
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
            menuTier: client_1.MenuTier.LUXURY,
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
