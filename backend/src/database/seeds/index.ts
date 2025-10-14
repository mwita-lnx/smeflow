import { connectDatabase } from '../../config/database';
import { Category } from '../../models/Category.model';
import { User } from '../../models/User.model';
import { Business } from '../../models/Business.model';
import { Product } from '../../models/Product.model';
import { logger } from '../../shared/utils/logger';
import { BUSINESS_CATEGORIES } from '../../config/constants';
import { config } from '../../config/environment';

async function seedCategories() {
  logger.info('Seeding categories...');

  const categories = BUSINESS_CATEGORIES.map(category => ({
    name: category,
    isActive: true,
  }));

  await Category.deleteMany({});
  await Category.insertMany(categories);

  logger.info(`✅ ${categories.length} categories seeded successfully`);
}

async function seedAdminUser() {
  logger.info('Seeding admin user...');

  const existingAdmin = await User.findOne({ email: config.admin.email });

  if (existingAdmin) {
    logger.info('Admin user already exists');
    return existingAdmin;
  }

  const admin = await User.create({
    email: config.admin.email,
    password: config.admin.password,
    phone: '+254700000000',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    isEmailVerified: true,
    isPhoneVerified: true,
  });

  logger.info('✅ Admin user created successfully');
  return admin;
}

async function seedSMEUsers() {
  logger.info('Seeding SME users...');

  const smeUsers = [
    {
      email: 'john.bakery@example.com',
      password: 'Password123',
      phone: '+254712345671',
      firstName: 'John',
      lastName: 'Kamau',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'mary.groceries@example.com',
      password: 'Password123',
      phone: '+254712345672',
      firstName: 'Mary',
      lastName: 'Wanjiru',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'peter.electronics@example.com',
      password: 'Password123',
      phone: '+254712345673',
      firstName: 'Peter',
      lastName: 'Ochieng',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  ];

  await User.deleteMany({ role: 'SME' });
  const createdUsers = await User.insertMany(smeUsers);

  logger.info(`✅ ${createdUsers.length} SME users seeded successfully`);
  return createdUsers;
}

async function seedBusinessesAndProducts(users: any[]) {
  logger.info('Seeding businesses and products...');

  await Business.deleteMany({});
  await Product.deleteMany({});

  const businesses = [
    {
      businessName: 'Kamau\'s Fresh Bakery',
      description: 'Fresh bread and pastries baked daily. Family-owned bakery serving Nairobi for over 10 years.',
      category: 'food-beverage',
      owner: users[0]._id,
      phone: '+254712345671',
      email: 'john.bakery@example.com',
      contactPhone: '+254712345671',
      county: 'Nairobi',
      subCounty: 'Westlands',
      location: {
        type: 'Point',
        coordinates: [36.8219, -1.2634],
      },
      status: 'ACTIVE',
      verified: true,
      products: [
        {
          name: 'White Bread Loaf',
          description: 'Freshly baked white bread, soft and fluffy',
          price: 60,
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Brown Bread Loaf',
          description: 'Healthy brown bread made with whole wheat',
          price: 80,
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Mandazi (6 pieces)',
          description: 'Traditional Kenyan doughnuts, perfect with tea',
          price: 50,
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Scones (4 pieces)',
          description: 'Buttery scones, great for breakfast',
          price: 100,
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },
    {
      businessName: 'Wanjiru Groceries & Supplies',
      description: 'Your one-stop shop for fresh vegetables, fruits, and household items. Quality products at affordable prices.',
      category: 'retail-shop',
      owner: users[1]._id,
      phone: '+254712345672',
      email: 'mary.groceries@example.com',
      contactPhone: '+254712345672',
      county: 'Nairobi',
      subCounty: 'Kasarani',
      location: {
        type: 'Point',
        coordinates: [36.8969, -1.2214],
      },
      status: 'ACTIVE',
      verified: true,
      products: [
        {
          name: 'Tomatoes (1kg)',
          description: 'Fresh red tomatoes from local farms',
          price: 80,
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Onions (1kg)',
          description: 'Fresh onions, perfect for cooking',
          price: 70,
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Potatoes (2kg)',
          description: 'Quality potatoes for all your cooking needs',
          price: 120,
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Cooking Oil (2L)',
          description: 'Premium vegetable cooking oil',
          price: 450,
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Rice (2kg)',
          description: 'Quality long grain rice',
          price: 250,
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },
    {
      businessName: 'Ochieng Electronics Hub',
      description: 'Mobile phones, accessories, and electronic repairs. Authorized dealer for major brands.',
      category: 'technology',
      owner: users[2]._id,
      phone: '+254712345673',
      email: 'peter.electronics@example.com',
      contactPhone: '+254712345673',
      county: 'Nairobi',
      subCounty: 'CBD',
      location: {
        type: 'Point',
        coordinates: [36.8219, -1.2864],
      },
      status: 'ACTIVE',
      verified: true,
      products: [
        {
          name: 'Samsung Galaxy A14',
          description: 'Latest Samsung smartphone with 128GB storage',
          price: 18500,
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'iPhone 13',
          description: 'Apple iPhone 13, 128GB, excellent condition',
          price: 65000,
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Phone Charger (Type-C)',
          description: 'Fast charging USB Type-C charger',
          price: 800,
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Bluetooth Headphones',
          description: 'Wireless Bluetooth headphones with great sound',
          price: 2500,
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Phone Screen Protector',
          description: 'Tempered glass screen protector for various models',
          price: 300,
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Power Bank 10000mAh',
          description: 'Portable power bank for charging on the go',
          price: 1200,
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },
  ];

  for (const businessData of businesses) {
    const { products, ...businessInfo } = businessData;

    const business = await Business.create(businessInfo);

    const productsWithBusiness = products.map(product => ({
      ...product,
      business: business._id,
    }));

    await Product.insertMany(productsWithBusiness);

    logger.info(`✅ Created business: ${business.businessName} with ${products.length} products`);
  }

  logger.info(`✅ ${businesses.length} businesses with products seeded successfully`);
}

async function seed() {
  try {
    await connectDatabase();

    await seedCategories();
    await seedAdminUser();
    const smeUsers = await seedSMEUsers();
    await seedBusinessesAndProducts(smeUsers);

    logger.info('🌱 All seeds completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
