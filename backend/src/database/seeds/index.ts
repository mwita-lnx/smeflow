import { connectDatabase } from '../../config/database';
import { Category } from '../../models/Category.model';
import { User } from '../../models/User.model';
import { Business } from '../../models/Business.model';
import { Product } from '../../models/Product.model';
import { Rating } from '../../models/Rating.model';
import { Tender } from '../../models/Tender.model';
import { Bid } from '../../models/Bid.model';
import { ProductVerification } from '../../models/ProductVerification.model';
import { MpesaTransaction } from '../../models/MpesaTransaction.model';
import { logger } from '../../shared/utils/logger';
import { BUSINESS_CATEGORIES } from '../../config/constants';
import { config } from '../../config/environment';
import slugify from 'slugify';

async function seedCategories() {
  logger.info('Seeding categories...');

  const categories = BUSINESS_CATEGORIES.map(category => ({
    name: category,
    slug: slugify(category, { lower: true, strict: true }),
    isActive: true,
  }));

  await Category.deleteMany({});

  // Insert categories one by one to trigger pre-save hooks
  for (const category of categories) {
    await Category.create(category);
  }

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

async function seedUsers() {
  logger.info('Seeding users...');

  // SME Users (Business Owners)
  const smeUsers = [
    {
      email: 'kamau.dairy@example.com',
      password: 'Password123',
      phone: '+254712000001',
      firstName: 'John',
      lastName: 'Kamau',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'mama.fua@example.com',
      password: 'Password123',
      phone: '+254712000002',
      firstName: 'Grace',
      lastName: 'Nyambura',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'mwangi.welder@example.com',
      password: 'Password123',
      phone: '+254712000003',
      firstName: 'Peter',
      lastName: 'Mwangi',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'akinyi.tailor@example.com',
      password: 'Password123',
      phone: '+254712000004',
      firstName: 'Lucy',
      lastName: 'Akinyi',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'hassan.butchery@example.com',
      password: 'Password123',
      phone: '+254712000005',
      firstName: 'Hassan',
      lastName: 'Mohammed',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'wanjiru.salon@example.com',
      password: 'Password123',
      phone: '+254712000006',
      firstName: 'Mary',
      lastName: 'Wanjiru',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'omondi.vegetables@example.com',
      password: 'Password123',
      phone: '+254712000007',
      firstName: 'David',
      lastName: 'Omondi',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'njeri.bakery@example.com',
      password: 'Password123',
      phone: '+254712000008',
      firstName: 'Jane',
      lastName: 'Njeri',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'otieno.electronics@example.com',
      password: 'Password123',
      phone: '+254712000009',
      firstName: 'James',
      lastName: 'Otieno',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'chege.carpenter@example.com',
      password: 'Password123',
      phone: '+254712000010',
      firstName: 'Samuel',
      lastName: 'Chege',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'wambui.restaurant@example.com',
      password: 'Password123',
      phone: '+254712000011',
      firstName: 'Anne',
      lastName: 'Wambui',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'kipchoge.shoes@example.com',
      password: 'Password123',
      phone: '+254712000012',
      firstName: 'Joseph',
      lastName: 'Kipchoge',
      role: 'SME',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  ];

  // Consumer Users
  const consumerUsers = [
    {
      email: 'consumer1@example.com',
      password: 'Password123',
      phone: '+254713000001',
      firstName: 'Michael',
      lastName: 'Odhiambo',
      role: 'CONSUMER',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'consumer2@example.com',
      password: 'Password123',
      phone: '+254713000002',
      firstName: 'Sarah',
      lastName: 'Mutua',
      role: 'CONSUMER',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'consumer3@example.com',
      password: 'Password123',
      phone: '+254713000003',
      firstName: 'Robert',
      lastName: 'Kariuki',
      role: 'CONSUMER',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'consumer4@example.com',
      password: 'Password123',
      phone: '+254713000004',
      firstName: 'Esther',
      lastName: 'Adhiambo',
      role: 'CONSUMER',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    {
      email: 'consumer5@example.com',
      password: 'Password123',
      phone: '+254713000005',
      firstName: 'Daniel',
      lastName: 'Kiprono',
      role: 'CONSUMER',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  ];

  await User.deleteMany({ role: { $in: ['SME', 'CONSUMER'] } });

  // Create users one by one to trigger pre-save hooks for password hashing
  const createdSMEs = [];
  for (const smeUser of smeUsers) {
    const user = await User.create(smeUser);
    createdSMEs.push(user);
  }

  const createdConsumers = [];
  for (const consumerUser of consumerUsers) {
    const user = await User.create(consumerUser);
    createdConsumers.push(user);
  }

  logger.info(`✅ ${createdSMEs.length} SME users seeded successfully`);
  logger.info(`✅ ${createdConsumers.length} Consumer users seeded successfully`);

  return { smeUsers: createdSMEs, consumerUsers: createdConsumers };
}

async function seedBusinessesAndProducts(users: any[]) {
  logger.info('Seeding businesses and products...');

  await Business.deleteMany({});
  await Product.deleteMany({});

  const businesses = [
    // 1. Dairy Farmer
    {
      businessName: 'Kamau Dairy Farm',
      description: 'Fresh milk and dairy products from our own cows. We deliver fresh milk daily to homes and businesses across Kiambu. Family-run farm for over 20 years.',
      category: 'Agriculture & Farming',
      owner: users[0]._id,
      phone: '+254712000001',
      email: 'kamau.dairy@example.com',
      county: 'Kiambu',
      subCounty: 'Limuru',
      address: 'Off Limuru Road, near Tigoni',
      location: {
        type: 'Point',
        coordinates: [36.6497, -1.1167],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'VERIFIED',
      products: [
        {
          name: 'Fresh Cow Milk (1 Liter)',
          description: 'Pure fresh milk from healthy cows, delivered daily',
          price: 80,
          category: 'Dairy Products',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Fresh Cow Milk (5 Liters)',
          description: 'Bulk fresh milk for families and businesses',
          price: 380,
          category: 'Dairy Products',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Fresh Yoghurt (500ml)',
          description: 'Homemade natural yoghurt',
          price: 120,
          category: 'Dairy Products',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Mala (Fermented Milk - 1L)',
          description: 'Traditional fermented milk, fresh daily',
          price: 100,
          category: 'Dairy Products',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 2. Laundry Service (Mama Fua)
    {
      businessName: 'Grace Laundry Services',
      description: 'Professional laundry and dry cleaning services. We wash, iron, and deliver. Same-day service available!',
      category: 'Services',
      owner: users[1]._id,
      phone: '+254712000002',
      email: 'mama.fua@example.com',
      whatsapp: '+254712000002',
      county: 'Nairobi',
      subCounty: 'Embakasi',
      address: 'Donholm Phase 8',
      location: {
        type: 'Point',
        coordinates: [36.8953, -1.3089],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'BASIC',
      mpesaTill: '567890',
      products: [
        {
          name: 'Shirt/Blouse Wash & Iron',
          description: 'Professional washing and ironing per piece',
          price: 80,
          category: 'Laundry',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Trouser/Skirt Wash & Iron',
          description: 'Complete laundry service per piece',
          price: 100,
          category: 'Laundry',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Bedsheets & Duvet (Set)',
          description: 'Wash and iron bedding set',
          price: 350,
          category: 'Laundry',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Curtains per Meter',
          description: 'Professional curtain cleaning',
          price: 150,
          category: 'Laundry',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Suit Dry Cleaning',
          description: 'Complete suit dry cleaning service',
          price: 500,
          category: 'Dry Cleaning',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 3. Jua Kali - Metal Fabrication
    {
      businessName: 'Mwangi Welding & Fabrication',
      description: 'Custom metal works - gates, windows grills, doors, burglar proofing, and general welding services. Quality workmanship guaranteed!',
      category: 'Construction',
      owner: users[2]._id,
      phone: '+254712000003',
      email: 'mwangi.welder@example.com',
      county: 'Nairobi',
      subCounty: 'Industrial Area',
      address: 'Industrial Area, Enterprise Road',
      location: {
        type: 'Point',
        coordinates: [36.8392, -1.3198],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'VERIFIED',
      products: [
        {
          name: 'Main Gate (Standard Size)',
          description: 'Custom designed metal gate for homes',
          price: 35000,
          category: 'Gates',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Window Grills per Window',
          description: 'Security window grills, custom fit',
          price: 4500,
          category: 'Security',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Burglar Proofing per Window',
          description: 'Modern burglar proofing installation',
          price: 3500,
          category: 'Security',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Metal Door Frame',
          description: 'Strong metal door frame with installation',
          price: 8000,
          category: 'Doors',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Steel Staircase Railing (per meter)',
          description: 'Quality staircase railing with installation',
          price: 2500,
          category: 'Railings',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 4. Tailor/Dressmaker
    {
      businessName: 'Akinyi Fashion House',
      description: 'Professional tailoring services - custom dresses, suits, alterations, and African wear. We bring your fashion dreams to life!',
      category: 'Services',
      owner: users[3]._id,
      phone: '+254712000004',
      email: 'akinyi.tailor@example.com',
      whatsapp: '+254712000004',
      county: 'Kisumu',
      subCounty: 'Kisumu Central',
      address: 'Oginga Odinga Street, opposite Nakumatt',
      location: {
        type: 'Point',
        coordinates: [34.7617, -0.0917],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'PREMIUM',
      products: [
        {
          name: 'Custom Dress (Simple Design)',
          description: 'Made-to-measure dress with your fabric',
          price: 1500,
          category: 'Dresses',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Custom Dress (Detailed Design)',
          description: 'Complex designs with beading and details',
          price: 3500,
          category: 'Dresses',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Men\'s Suit (Tailoring)',
          description: 'Custom fitted suit with your fabric',
          price: 4000,
          category: 'Men\'s Wear',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'African Wear (Kitenge/Ankara)',
          description: 'Custom African attire, various styles',
          price: 2500,
          category: 'African Wear',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Clothing Alterations',
          description: 'Resize, repair, or modify existing clothes',
          price: 300,
          category: 'Alterations',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 5. Butchery
    {
      businessName: 'Hassan Fresh Butchery',
      description: 'Quality meat products - beef, goat, chicken. Fresh daily. We also do home deliveries. Halal certified.',
      category: 'Food & Beverage',
      owner: users[4]._id,
      phone: '+254712000005',
      email: 'hassan.butchery@example.com',
      county: 'Mombasa',
      subCounty: 'Mvita',
      address: 'Makadara Road, Old Town',
      location: {
        type: 'Point',
        coordinates: [39.6682, -4.0435],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'VERIFIED',
      products: [
        {
          name: 'Beef (Soft Bone - 1kg)',
          description: 'Premium quality beef with soft bone',
          price: 550,
          category: 'Beef',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Beef (Boneless - 1kg)',
          description: 'Tender boneless beef, perfect for stew',
          price: 620,
          category: 'Beef',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Goat Meat (1kg)',
          description: 'Fresh goat meat, ideal for nyama choma',
          price: 700,
          category: 'Goat',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Whole Chicken',
          description: 'Fresh whole chicken, approx 1.5kg',
          price: 450,
          category: 'Chicken',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Chicken Pieces (1kg)',
          description: 'Mixed chicken pieces',
          price: 380,
          category: 'Chicken',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Mince Meat (1kg)',
          description: 'Freshly minced beef',
          price: 480,
          category: 'Beef',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 6. Hair Salon
    {
      businessName: 'Wanjiru Beauty Lounge',
      description: 'Full service hair salon - braiding, weaving, relaxing, coloring, and styling. Professional stylists with latest trends. Walk-ins welcome!',
      category: 'Health & Beauty',
      owner: users[5]._id,
      phone: '+254712000006',
      email: 'wanjiru.salon@example.com',
      whatsapp: '+254712000006',
      county: 'Nakuru',
      subCounty: 'Nakuru East',
      address: 'Kenyatta Avenue, Next to Nakumatt Downtown',
      location: {
        type: 'Point',
        coordinates: [36.0667, -0.3031],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'PREMIUM',
      mpesaPaybill: '400200',
      products: [
        {
          name: 'Box Braids',
          description: 'Professional box braids, all lengths',
          price: 2000,
          category: 'Braiding',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Cornrows',
          description: 'Various cornrow styles available',
          price: 800,
          category: 'Braiding',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Weave Installation (Full Head)',
          description: 'Professional weave installation with closure',
          price: 1500,
          category: 'Weaving',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Hair Relaxing/Perming',
          description: 'Chemical relaxer treatment with deep conditioning',
          price: 1200,
          category: 'Treatment',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Hair Coloring',
          description: 'Professional hair coloring service',
          price: 2500,
          category: 'Styling',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Wash & Blow Dry',
          description: 'Hair wash with blow dry and styling',
          price: 600,
          category: 'Basic Service',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Deep Conditioning Treatment',
          description: 'Intensive conditioning treatment',
          price: 800,
          category: 'Treatment',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 7. Vegetable Vendor
    {
      businessName: 'Omondi Fresh Greens',
      description: 'Farm-fresh vegetables and fruits delivered daily. We source directly from farmers. Affordable prices, quality guaranteed!',
      category: 'Retail & Shop',
      owner: users[6]._id,
      phone: '+254712000007',
      email: 'omondi.vegetables@example.com',
      county: 'Nairobi',
      subCounty: 'Dagoretti',
      address: 'Kawangware Market, Stall B12',
      location: {
        type: 'Point',
        coordinates: [36.7431, -1.2942],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'BASIC',
      products: [
        {
          name: 'Sukuma Wiki (1 bunch)',
          description: 'Fresh kale from local farms',
          price: 20,
          category: 'Vegetables',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Spinach (1 bunch)',
          description: 'Fresh spinach leaves',
          price: 30,
          category: 'Vegetables',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Tomatoes (1kg)',
          description: 'Ripe red tomatoes',
          price: 80,
          category: 'Vegetables',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Onions (1kg)',
          description: 'Fresh red onions',
          price: 70,
          category: 'Vegetables',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Potatoes (2kg)',
          description: 'Quality Irish potatoes',
          price: 120,
          category: 'Vegetables',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Cabbage (1 head)',
          description: 'Fresh cabbage head',
          price: 60,
          category: 'Vegetables',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Bananas (1 bunch)',
          description: 'Sweet ripe bananas',
          price: 100,
          category: 'Fruits',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Avocados (3 pieces)',
          description: 'Large ripe avocados',
          price: 150,
          category: 'Fruits',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 8. Bakery
    {
      businessName: 'Njeri\'s Home Bakery',
      description: 'Fresh bread, cakes, and pastries baked daily. We also take orders for birthday cakes, wedding cakes, and special occasions.',
      category: 'Food & Beverage',
      owner: users[7]._id,
      phone: '+254712000008',
      email: 'njeri.bakery@example.com',
      whatsapp: '+254712000008',
      county: 'Nyeri',
      subCounty: 'Nyeri Town',
      address: 'Kimathi Street, opposite Nyeri DEB',
      location: {
        type: 'Point',
        coordinates: [36.9478, -0.4197],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'VERIFIED',
      products: [
        {
          name: 'White Bread (400g)',
          description: 'Fresh baked white bread',
          price: 55,
          category: 'Bread',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Brown Bread (400g)',
          description: 'Whole wheat brown bread',
          price: 70,
          category: 'Bread',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Mandazi (6 pieces)',
          description: 'Sweet Kenyan doughnuts',
          price: 50,
          category: 'Pastries',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Chapati (10 pieces)',
          description: 'Soft layered chapatis',
          price: 200,
          category: 'Pastries',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Scones (6 pieces)',
          description: 'Buttery tea scones',
          price: 120,
          category: 'Pastries',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Birthday Cake (1kg)',
          description: 'Custom designed birthday cake',
          price: 1500,
          category: 'Cakes',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Cupcakes (6 pieces)',
          description: 'Decorated cupcakes, various flavors',
          price: 300,
          category: 'Cakes',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 9. Electronics Repair
    {
      businessName: 'Otieno Tech Solutions',
      description: 'Phone and laptop repairs, screen replacement, software issues, unlocking, and accessories. Quick service, affordable prices.',
      category: 'Technology',
      owner: users[8]._id,
      phone: '+254712000009',
      email: 'otieno.electronics@example.com',
      county: 'Nairobi',
      subCounty: 'CBD',
      address: 'Luthuli Avenue, Stall 45',
      location: {
        type: 'Point',
        coordinates: [36.8219, -1.2841],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'VERIFIED',
      products: [
        {
          name: 'Phone Screen Replacement',
          description: 'Original quality screen replacement for various models',
          price: 2500,
          category: 'Repairs',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Phone Battery Replacement',
          description: 'Genuine battery replacement',
          price: 1200,
          category: 'Repairs',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Laptop Screen Replacement',
          description: 'Laptop screen replacement, various sizes',
          price: 8000,
          category: 'Repairs',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Software Installation & Troubleshooting',
          description: 'Windows installation, virus removal, software issues',
          price: 500,
          category: 'Services',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Phone Unlocking',
          description: 'Unlock any phone network',
          price: 300,
          category: 'Services',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Data Recovery',
          description: 'Recover lost data from phones and computers',
          price: 1500,
          category: 'Services',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 10. Jua Kali Carpenter
    {
      businessName: 'Chege Furniture Workshop',
      description: 'Custom furniture maker - beds, wardrobes, dining sets, sofas, and office furniture. Quality wood, expert craftsmanship. We also do repairs!',
      category: 'Manufacturing',
      owner: users[9]._id,
      phone: '+254712000010',
      email: 'chege.carpenter@example.com',
      county: 'Nairobi',
      subCounty: 'Gikomba',
      address: 'Gikomba, Furniture Section',
      location: {
        type: 'Point',
        coordinates: [36.8364, -1.2814],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'PREMIUM',
      products: [
        {
          name: 'Bed Frame (5x6)',
          description: 'Solid wood bed frame, queen size',
          price: 15000,
          category: 'Beds',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Wardrobe (3-Door)',
          description: 'Spacious wooden wardrobe with mirror',
          price: 25000,
          category: 'Wardrobes',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Dining Table (6-Seater)',
          description: 'Hardwood dining table with chairs',
          price: 35000,
          category: 'Dining Sets',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Coffee Table',
          description: 'Modern wooden coffee table',
          price: 8000,
          category: 'Tables',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'TV Stand',
          description: 'Wall unit TV stand with storage',
          price: 12000,
          category: 'Entertainment',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Office Desk',
          description: 'Executive office desk with drawers',
          price: 18000,
          category: 'Office Furniture',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Kitchen Cabinets (per meter)',
          description: 'Custom kitchen cabinets with installation',
          price: 15000,
          category: 'Kitchen',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 11. Restaurant/Food Kiosk
    {
      businessName: 'Wambui\'s Mama Pima',
      description: 'Authentic Kenyan food - chapati, ugali, nyama, githeri, and more. Fresh meals daily. Home delivery available within 5km.',
      category: 'Food & Beverage',
      owner: users[10]._id,
      phone: '+254712000011',
      email: 'wambui.restaurant@example.com',
      whatsapp: '+254712000011',
      county: 'Nairobi',
      subCounty: 'Eastleigh',
      address: 'First Avenue, Section 1',
      location: {
        type: 'Point',
        coordinates: [36.8589, -1.2753],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'BASIC',
      mpesaTill: '789012',
      products: [
        {
          name: 'Ugali & Beef Stew',
          description: 'Ugali with beef stew and vegetables',
          price: 150,
          category: 'Main Meals',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Chapati & Beans',
          description: '3 chapatis with stewed beans',
          price: 100,
          category: 'Main Meals',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Pilau (Beef)',
          description: 'Spiced rice with beef',
          price: 200,
          category: 'Main Meals',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Githeri (Special)',
          description: 'Mixed maize and beans with vegetables',
          price: 80,
          category: 'Main Meals',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Chicken & Chips',
          description: 'Fried chicken with French fries',
          price: 250,
          category: 'Fast Food',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Tea/Chai (Cup)',
          description: 'Hot Kenyan tea',
          price: 30,
          category: 'Beverages',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Mandazi (2 pieces)',
          description: 'Sweet mandazi',
          price: 20,
          category: 'Snacks',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 12. Shoe Repair (Jua Kali)
    {
      businessName: 'Kipchoge Shoe Clinic',
      description: 'Professional shoe repair and shoemaking. We fix all types of shoes, make custom shoes, and sell shoe care products.',
      category: 'Services',
      owner: users[11]._id,
      phone: '+254712000012',
      email: 'kipchoge.shoes@example.com',
      county: 'Eldoret',
      subCounty: 'Eldoret West',
      address: 'Uganda Road, near KCB',
      location: {
        type: 'Point',
        coordinates: [35.2697, 0.5143],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'BASIC',
      products: [
        {
          name: 'Shoe Sole Replacement',
          description: 'Replace worn out shoe soles',
          price: 300,
          category: 'Repairs',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Shoe Stretching',
          description: 'Stretch tight shoes for comfort',
          price: 200,
          category: 'Services',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Shoe Polishing & Cleaning',
          description: 'Professional shoe cleaning and polish',
          price: 150,
          category: 'Services',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Zip Replacement',
          description: 'Replace broken zippers on shoes or boots',
          price: 250,
          category: 'Repairs',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Custom Leather Shoes (Men)',
          description: 'Handmade leather shoes, your measurements',
          price: 4500,
          category: 'Custom Shoes',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'School Shoes Repair',
          description: 'Complete school shoe repair',
          price: 200,
          category: 'Repairs',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 13. Plumber (Jua Kali)
    {
      businessName: 'Otieno Plumbing Services',
      description: 'Expert plumber - installations, repairs, water tank cleaning, drainage systems, and bathroom renovations. 24/7 emergency services available.',
      category: 'Services',
      owner: users[0]._id, // Reusing users for more businesses
      phone: '+254723000001',
      email: 'kamau.dairy@example.com',
      whatsapp: '+254723000001',
      county: 'Nairobi',
      subCounty: 'Kayole',
      address: 'Kayole North, Near Mama Lucy Hospital',
      location: {
        type: 'Point',
        coordinates: [36.9167, -1.2833],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'VERIFIED',
      products: [
        {
          name: 'Toilet Installation',
          description: 'Complete toilet installation with all fittings',
          price: 3500,
          category: 'Installation',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Sink Installation',
          description: 'Kitchen or bathroom sink installation',
          price: 2000,
          category: 'Installation',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Water Tank Cleaning (5000L)',
          description: 'Thorough cleaning and sanitization',
          price: 2500,
          category: 'Maintenance',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Blocked Drain Clearing',
          description: 'Unblock any drainage system',
          price: 1500,
          category: 'Repairs',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Bathroom Renovation',
          description: 'Complete bathroom plumbing overhaul',
          price: 25000,
          category: 'Renovation',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 14. Poultry Farmer
    {
      businessName: 'Wanjiku Poultry Farm',
      description: 'Fresh chicken, eggs, and dressed poultry. We also supply day-old chicks and offer consultancy on poultry keeping.',
      category: 'Agriculture & Farming',
      owner: users[1]._id,
      phone: '+254722000013',
      email: 'mama.fua@example.com',
      county: 'Kiambu',
      subCounty: 'Kikuyu',
      address: 'Off Kikuyu-Wangige Road',
      location: {
        type: 'Point',
        coordinates: [36.6639, -1.2436],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'PREMIUM',
      products: [
        {
          name: 'Tray of Eggs (30 pcs)',
          description: 'Fresh farm eggs, brown or white',
          price: 420,
          category: 'Eggs',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Live Chicken (Kienyeji)',
          description: 'Free-range indigenous chicken, approx 2kg',
          price: 800,
          category: 'Live Poultry',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Dressed Chicken (Broiler)',
          description: 'Ready to cook broiler chicken, 2.5kg',
          price: 650,
          category: 'Dressed Poultry',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Day-Old Chicks (10 pcs)',
          description: 'Healthy day-old chicks for rearing',
          price: 500,
          category: 'Chicks',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 15. Boda Boda Spare Parts
    {
      businessName: 'Kipkemoi Motorcycle Spares',
      description: 'Motorcycle spare parts and accessories - helmets, mirrors, chains, tires, and more. We stock for all major brands.',
      category: 'Retail & Shop',
      owner: users[2]._id,
      phone: '+254721000014',
      email: 'mwangi.welder@example.com',
      county: 'Nairobi',
      subCounty: 'Umoja',
      address: 'Umoja Inner Core, Stage 2',
      location: {
        type: 'Point',
        coordinates: [36.8908, -1.2750],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'BASIC',
      products: [
        {
          name: 'Motorcycle Helmet',
          description: 'Quality safety helmet, various sizes',
          price: 1500,
          category: 'Safety Gear',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Side Mirrors (Pair)',
          description: 'Universal fit side mirrors',
          price: 400,
          category: 'Accessories',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Motorcycle Chain Set',
          description: 'Heavy duty chain and sprocket set',
          price: 2800,
          category: 'Parts',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Motorcycle Tire (Front)',
          description: 'Quality tire for common models',
          price: 2200,
          category: 'Tires',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Brake Pads Set',
          description: 'Front and rear brake pads',
          price: 800,
          category: 'Parts',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 16. Barbershop
    {
      businessName: 'Kamau Fresh Cuts Barber Shop',
      description: 'Modern barbershop - haircuts, shaves, beard trimming, and grooming. Walk-ins welcome, appointments preferred.',
      category: 'Health & Beauty',
      owner: users[3]._id,
      phone: '+254720000015',
      email: 'akinyi.tailor@example.com',
      whatsapp: '+254720000015',
      county: 'Nairobi',
      subCounty: 'South B',
      address: 'South B Shopping Center, 1st Floor',
      location: {
        type: 'Point',
        coordinates: [36.8242, -1.3116],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'VERIFIED',
      products: [
        {
          name: 'Regular Haircut',
          description: 'Standard men\'s haircut and styling',
          price: 250,
          category: 'Haircuts',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Fade Haircut',
          description: 'Modern fade cut with precise lines',
          price: 350,
          category: 'Haircuts',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Clean Shave',
          description: 'Full head or face shave with aftershave',
          price: 150,
          category: 'Shaving',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Beard Trim & Shaping',
          description: 'Beard grooming and styling',
          price: 200,
          category: 'Grooming',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Kids Haircut',
          description: 'Haircut for children under 12',
          price: 200,
          category: 'Haircuts',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 17. Hardware Store
    {
      businessName: 'Njoroge Hardware & Building Materials',
      description: 'Complete hardware store - cement, iron sheets, nails, paint, timber, and all construction materials. We deliver!',
      category: 'Construction',
      owner: users[4]._id,
      phone: '+254719000016',
      email: 'hassan.butchery@example.com',
      county: 'Machakos',
      subCounty: 'Machakos Town',
      address: 'Machakos Town, Next to Bus Station',
      location: {
        type: 'Point',
        coordinates: [37.2634, -1.5177],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'PREMIUM',
      products: [
        {
          name: 'Cement (50kg Bag)',
          description: 'Portland cement, 50kg bag',
          price: 720,
          category: 'Building Materials',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Iron Sheet (Mabati)',
          description: 'Galvanized iron sheet, 3m',
          price: 850,
          category: 'Roofing',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Wire Nails (1kg)',
          description: 'Assorted sizes wire nails',
          price: 150,
          category: 'Fasteners',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Paint (20L)',
          description: 'Emulsion paint, various colors',
          price: 4500,
          category: 'Paint',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Timber (4x2, 12ft)',
          description: 'Quality treated timber',
          price: 450,
          category: 'Timber',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 18. M-Pesa Agent
    {
      businessName: 'Achieng M-Pesa & Airtime Shop',
      description: 'M-Pesa services, airtime, money transfers, bill payments. We also sell phone accessories.',
      category: 'Services',
      owner: users[5]._id,
      phone: '+254718000017',
      email: 'wanjiru.salon@example.com',
      mpesaTill: '987654',
      county: 'Kisumu',
      subCounty: 'Kondele',
      address: 'Kondele Market, Stall C45',
      location: {
        type: 'Point',
        coordinates: [34.7519, -0.0917],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'VERIFIED',
      products: [
        {
          name: 'M-Pesa Deposit/Withdrawal',
          description: 'Cash in/out service',
          price: 0,
          category: 'Financial Services',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Airtime (All Networks)',
          description: 'Safaricom, Airtel, Telkom airtime',
          price: 10,
          category: 'Airtime',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Phone Charger (Universal)',
          description: 'Fast charging universal charger',
          price: 500,
          category: 'Accessories',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Phone Case',
          description: 'Various models available',
          price: 300,
          category: 'Accessories',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 19. Cyber Cafe
    {
      businessName: 'Smart Cyber Cafe & Printing',
      description: 'Computer services - typing, printing, photocopying, scanning, CV writing, and internet access. We also laminate and bind documents.',
      category: 'Technology',
      owner: users[6]._id,
      phone: '+254717000018',
      email: 'omondi.vegetables@example.com',
      county: 'Nairobi',
      subCounty: 'Githurai',
      address: 'Githurai 45, Near Stage',
      location: {
        type: 'Point',
        coordinates: [36.9333, -1.1667],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'BASIC',
      products: [
        {
          name: 'Printing (Black & White)',
          description: 'Per page printing',
          price: 5,
          category: 'Printing',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Printing (Color)',
          description: 'Color printing per page',
          price: 20,
          category: 'Printing',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Photocopy (Per Page)',
          description: 'Black and white photocopying',
          price: 3,
          category: 'Copying',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Document Binding',
          description: 'Spiral or thermal binding',
          price: 100,
          category: 'Binding',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'CV Writing & Formatting',
          description: 'Professional CV creation',
          price: 300,
          category: 'Services',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Lamination (A4)',
          description: 'Document lamination',
          price: 50,
          category: 'Lamination',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },

    // 20. Matatu Spare Parts
    {
      businessName: 'Kariuki Matatu Spares',
      description: 'Vehicle spare parts for matatus and PSVs - tires, batteries, brake systems, lights, and accessories.',
      category: 'Retail & Shop',
      owner: users[7]._id,
      phone: '+254716000019',
      email: 'njeri.bakery@example.com',
      county: 'Nairobi',
      subCounty: 'Ngara',
      address: 'Ngara Market, Auto Section',
      location: {
        type: 'Point',
        coordinates: [36.8333, -1.2594],
      },
      status: 'ACTIVE',
      isVerified: true,
      verificationLevel: 'VERIFIED',
      products: [
        {
          name: 'Car Battery (70Ah)',
          description: 'Heavy duty car battery with warranty',
          price: 8500,
          category: 'Batteries',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Brake Pads (Set)',
          description: 'Quality brake pads for matatus',
          price: 3500,
          category: 'Brakes',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'Tire (14 inch)',
          description: 'New tire for matatus',
          price: 6500,
          category: 'Tires',
          currency: 'KES',
          isAvailable: true,
        },
        {
          name: 'LED Headlights (Pair)',
          description: 'Bright LED headlights',
          price: 2500,
          category: 'Lights',
          currency: 'KES',
          isAvailable: true,
        },
      ],
    },
  ];

  const createdBusinesses = [];

  for (const businessData of businesses) {
    const { products, ...businessInfo } = businessData;

    const business = await Business.create(businessInfo);
    createdBusinesses.push(business);

    const productsWithBusiness = products.map(product => ({
      ...product,
      business: business._id,
    }));

    await Product.insertMany(productsWithBusiness);

    logger.info(`✅ Created business: ${business.businessName} with ${products.length} products`);
  }

  logger.info(`✅ ${businesses.length} businesses with products seeded successfully`);
  return createdBusinesses;
}

async function seedReviews(businesses: any[], consumers: any[]) {
  logger.info('Seeding reviews and ratings...');

  await Rating.deleteMany({});

  const reviews = [
    // Reviews for Dairy Farm
    {
      business: businesses[0]._id,
      user: consumers[0]._id,
      rating: 5,
      reviewTitle: 'Best fresh milk in Kiambu!',
      reviewText: 'I\'ve been buying milk from Kamau for 6 months now. Always fresh and delivered on time. The yoghurt is also amazing!',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    {
      business: businesses[0]._id,
      user: consumers[1]._id,
      rating: 4,
      reviewTitle: 'Good quality',
      reviewText: 'Good milk but sometimes delivery is delayed by 30 minutes.',
      qualityRating: 5,
      serviceRating: 3,
      valueRating: 4,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    // Reviews for Laundry
    {
      business: businesses[1]._id,
      user: consumers[2]._id,
      rating: 5,
      reviewTitle: 'Excellent service!',
      reviewText: 'Grace does an amazing job! My clothes always come back spotless and well ironed. Highly recommend!',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    // Reviews for Welding
    {
      business: businesses[2]._id,
      user: consumers[3]._id,
      rating: 5,
      reviewTitle: 'Professional metalwork',
      reviewText: 'Mwangi made a beautiful gate for my home. Strong, well-designed, and fairly priced. Very satisfied!',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    {
      business: businesses[2]._id,
      user: consumers[4]._id,
      rating: 4,
      reviewTitle: 'Good work',
      reviewText: 'Did window grills for my house. Good quality but took longer than expected.',
      qualityRating: 5,
      serviceRating: 3,
      valueRating: 4,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    // Reviews for Tailor
    {
      business: businesses[3]._id,
      user: consumers[0]._id,
      rating: 5,
      reviewTitle: 'Perfect fit!',
      reviewText: 'Akinyi is a talented tailor. She made my wedding dress and it was perfect! Attention to detail is excellent.',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    // Reviews for Butchery
    {
      business: businesses[4]._id,
      user: consumers[1]._id,
      rating: 5,
      reviewTitle: 'Fresh meat always',
      reviewText: 'Hassan has the freshest meat in Mombasa. Clean butchery and fair prices.',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    // Reviews for Salon
    {
      business: businesses[5]._id,
      user: consumers[2]._id,
      rating: 5,
      reviewTitle: 'Love this salon!',
      reviewText: 'Best braids in Nakuru! The stylists are friendly and professional. I always leave happy.',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    {
      business: businesses[5]._id,
      user: consumers[3]._id,
      rating: 4,
      reviewTitle: 'Great service',
      reviewText: 'Good salon but can be crowded on weekends. Book in advance!',
      qualityRating: 5,
      serviceRating: 4,
      valueRating: 4,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    // Reviews for Vegetables
    {
      business: businesses[6]._id,
      user: consumers[4]._id,
      rating: 5,
      reviewTitle: 'Fresh and affordable',
      reviewText: 'Omondi has the freshest vegetables at good prices. I buy from him every week.',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    // Reviews for Bakery
    {
      business: businesses[7]._id,
      user: consumers[0]._id,
      rating: 5,
      reviewTitle: 'Delicious cakes!',
      reviewText: 'Njeri made my daughter\'s birthday cake. It was beautiful and tasted amazing! Everyone loved it.',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    // Reviews for Electronics
    {
      business: businesses[8]._id,
      user: consumers[1]._id,
      rating: 4,
      reviewTitle: 'Quick repair',
      reviewText: 'Fixed my phone screen in 30 minutes. Good service but slightly expensive.',
      qualityRating: 4,
      serviceRating: 5,
      valueRating: 3,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    // Reviews for Furniture
    {
      business: businesses[9]._id,
      user: consumers[2]._id,
      rating: 5,
      reviewTitle: 'Quality furniture',
      reviewText: 'Chege made me a beautiful wardrobe. Solid wood, well finished. Worth every shilling!',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    // Reviews for Restaurant
    {
      business: businesses[10]._id,
      user: consumers[3]._id,
      rating: 5,
      reviewTitle: 'Tasty food!',
      reviewText: 'Best githeri in Eastleigh! Reminds me of home. Portions are generous too.',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    // Reviews for Shoe Repair
    {
      business: businesses[11]._id,
      user: consumers[4]._id,
      rating: 5,
      reviewTitle: 'Excellent cobbler',
      reviewText: 'Kipchoge fixed my expensive leather shoes perfectly. You can\'t even tell they were damaged!',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    // Reviews for new businesses
    {
      business: businesses[13]._id, // Poultry Farm
      user: consumers[0]._id,
      rating: 5,
      reviewTitle: 'Fresh eggs always!',
      reviewText: 'Best eggs in Kiambu. Fresh from the farm. Great prices too!',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    {
      business: businesses[15]._id, // Barbershop
      user: consumers[1]._id,
      rating: 5,
      reviewTitle: 'Best barber in South B',
      reviewText: 'Kamau gives the cleanest fades. Professional service and friendly atmosphere.',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    {
      business: businesses[16]._id, // Hardware
      user: consumers[2]._id,
      rating: 4,
      reviewTitle: 'Good hardware store',
      reviewText: 'Has everything you need for construction. Delivery service is reliable.',
      qualityRating: 4,
      serviceRating: 4,
      valueRating: 4,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
    {
      business: businesses[18]._id, // Cyber Cafe
      user: consumers[3]._id,
      rating: 5,
      reviewTitle: 'Affordable printing',
      reviewText: 'Great service! They helped me format my CV and print documents quickly.',
      qualityRating: 5,
      serviceRating: 5,
      valueRating: 5,
      status: 'ACTIVE',
      ratingType: 'BUSINESS',
    },
  ];

  const createdReviews = await Rating.insertMany(reviews);

  // Update business average ratings and total reviews
  for (const business of businesses) {
    const businessReviews = createdReviews.filter(
      r => r.business.toString() === business._id.toString()
    );

    if (businessReviews.length > 0) {
      const avgRating = businessReviews.reduce((sum, r) => sum + r.rating, 0) / businessReviews.length;
      await Business.findByIdAndUpdate(business._id, {
        averageRating: avgRating,
        totalReviews: businessReviews.length,
      });
    }
  }

  logger.info(`✅ ${createdReviews.length} reviews seeded successfully`);
}

async function seedTendersAndBids(consumers: any[], businesses: any[]) {
  logger.info('Seeding tenders and bids...');

  await Tender.deleteMany({});
  await Bid.deleteMany({});

  // Create tenders
  const tenders = [
    {
      title: 'Wedding Catering Service Needed',
      description: 'Looking for a catering service for my wedding on December 15th. Expected guests: 200 people. Need full catering including food, drinks, and service staff.',
      category: 'Food & Beverage',
      budget: {
        min: 150000,
        max: 250000,
        currency: 'KES',
      },
      deadline: new Date('2025-12-01'),
      location: {
        county: 'Nairobi',
        subCounty: 'Westlands',
      },
      requirements: [
        'Must provide menu options',
        'Include serving staff',
        'Provide own utensils and equipment',
        'Food tasting session before event',
      ],
      postedBy: consumers[0]._id,
      postedByRole: 'CONSUMER',
      status: 'OPEN',
    },
    {
      title: 'Office Furniture Required',
      description: 'New office opening in Industrial Area. Need 10 office desks, 10 chairs, 2 conference tables, and filing cabinets. Quality wood required.',
      category: 'Manufacturing',
      budget: {
        min: 200000,
        max: 350000,
        currency: 'KES',
      },
      deadline: new Date('2025-11-20'),
      location: {
        county: 'Nairobi',
        subCounty: 'Industrial Area',
      },
      requirements: [
        'Quality hardwood furniture',
        'Modern designs',
        'Delivery and installation included',
        'One year warranty',
      ],
      postedBy: consumers[1]._id,
      postedByRole: 'CONSUMER',
      status: 'OPEN',
    },
    {
      title: 'Security Gates and Grills Installation',
      description: 'Need security gates and window grills for 4-bedroom house. Main gate, back gate, and grills for 8 windows.',
      category: 'Construction',
      budget: {
        min: 80000,
        max: 120000,
        currency: 'KES',
      },
      deadline: new Date('2025-11-30'),
      location: {
        county: 'Kiambu',
        subCounty: 'Ruiru',
      },
      requirements: [
        'Quality steel material',
        'Modern designs',
        'Full installation',
        'Painting included',
      ],
      postedBy: consumers[2]._id,
      postedByRole: 'CONSUMER',
      status: 'OPEN',
    },
    {
      title: 'School Uniform Tailoring - 50 Pieces',
      description: 'Primary school needs 50 school uniforms tailored. We will provide fabric. Need experienced tailor.',
      category: 'Services',
      budget: {
        min: 35000,
        max: 50000,
        currency: 'KES',
      },
      deadline: new Date('2025-12-10'),
      location: {
        county: 'Kisumu',
        subCounty: 'Kisumu Central',
      },
      requirements: [
        'Experience in uniform tailoring',
        'Complete within 3 weeks',
        'Quality stitching',
        'Ability to handle bulk orders',
      ],
      postedBy: consumers[3]._id,
      postedByRole: 'CONSUMER',
      status: 'OPEN',
    },
    {
      title: 'Plumbing Services for 5 Apartments',
      description: 'New apartment block needs complete plumbing installation. 5 units, 2-bedroom each. Water lines, drainage, and bathroom/kitchen fixtures.',
      category: 'Services',
      budget: {
        min: 150000,
        max: 200000,
        currency: 'KES',
      },
      deadline: new Date('2025-12-05'),
      location: {
        county: 'Nairobi',
        subCounty: 'Donholm',
      },
      requirements: [
        'Licensed plumber',
        'Experience with apartment blocks',
        'Provide materials list',
        'Complete within 1 month',
      ],
      postedBy: consumers[4]._id,
      postedByRole: 'CONSUMER',
      status: 'OPEN',
    },
    {
      title: 'Fresh Eggs Supply Contract',
      description: 'Restaurant needs regular supply of fresh eggs. Approximately 20 trays per week. Looking for reliable supplier.',
      category: 'Agriculture & Farming',
      budget: {
        min: 30000,
        max: 40000,
        currency: 'KES',
      },
      deadline: new Date('2025-11-25'),
      location: {
        county: 'Nairobi',
        subCounty: 'Westlands',
      },
      requirements: [
        'Fresh farm eggs',
        'Consistent weekly delivery',
        'Quality guarantee',
        '3-month contract',
      ],
      postedBy: consumers[0]._id,
      postedByRole: 'CONSUMER',
      status: 'OPEN',
    },
  ];

  const createdTenders = await Tender.insertMany(tenders);

  // Create bids for some tenders
  const bids = [
    // Bids for Wedding Catering (Tender 1) - Restaurant can bid
    {
      tender: createdTenders[0]._id,
      business: businesses[10]._id, // Wambui's Restaurant
      amount: 180000,
      currency: 'KES',
      proposal: 'We can provide full catering for your wedding with traditional Kenyan dishes and international cuisine. Our team has experience catering events up to 300 people. We will provide food, drinks, serving staff, and all equipment needed. Timeline: 2 weeks preparation, full day service.',
      deliveryTime: 14, // 2 weeks
      status: 'PENDING',
    },
    // Bids for Office Furniture (Tender 2)
    {
      tender: createdTenders[1]._id,
      business: businesses[9]._id, // Chege Furniture
      amount: 280000,
      currency: 'KES',
      proposal: 'Quality hardwood office furniture with modern designs. All items custom-made to your specifications. Includes delivery, installation, and 1 year warranty. We use mahogany and mvule wood. Timeline: 4 weeks for completion.',
      deliveryTime: 28, // 4 weeks
      status: 'PENDING',
    },
    // Bids for Security Gates (Tender 3)
    {
      tender: createdTenders[2]._id,
      business: businesses[2]._id, // Mwangi Welding
      amount: 95000,
      currency: 'KES',
      proposal: 'Complete security solution with main gate, back gate, and window grills for 8 windows. Using quality steel, modern designs with painting included. We have 10+ years experience in similar projects. Timeline: 3 weeks including installation.',
      deliveryTime: 21, // 3 weeks
      status: 'PENDING',
    },
    // Bids for School Uniforms (Tender 4)
    {
      tender: createdTenders[3]._id,
      business: businesses[3]._id, // Akinyi Fashion
      amount: 42000,
      currency: 'KES',
      proposal: 'Experienced in bulk uniform tailoring. Have done similar projects for 3 schools in Kisumu. Quality stitching with reinforced seams for durability. Can complete 50 uniforms in 2.5 weeks. Timeline: 18 days.',
      deliveryTime: 18, // 2.5 weeks
      status: 'PENDING',
    },
  ];

  const createdBids = await Bid.insertMany(bids);

  // Update tender bid counts
  for (const tender of createdTenders) {
    const tenderBids = createdBids.filter(
      b => b.tender.toString() === tender._id.toString()
    );
    await Tender.findByIdAndUpdate(tender._id, {
      bidsCount: tenderBids.length,
    });
  }

  logger.info(`✅ ${createdTenders.length} tenders with ${createdBids.length} bids seeded successfully`);
}

async function seedProductVerifications(businesses: any[], consumers: any[]) {
  logger.info('Seeding product verifications...');

  await ProductVerification.deleteMany({});

  // Get some products for verification
  const products = await Product.find().limit(10);

  const verifications = [];

  // Create QR codes for selected products
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const business = businesses.find(b => b._id.toString() === product.business.toString());

    if (!business) continue;

    // Generate QR code and serial number
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 14);
    const qrCode = `SF-${timestamp}-${random}`;

    const productId = product._id.toString().substring(0, 6);
    const timestampShort = Date.now().toString().substring(-8);
    const randomShort = Math.random().toString().substring(2, 10);
    const serialNumber = `SN${productId}${timestampShort}${randomShort}`;

    // Some products have been scanned, others haven't
    const scans = i < 5 ? [
      {
        scannedBy: consumers[i % consumers.length]._id,
        scannedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last week
        location: {
          type: 'Point',
          coordinates: [36.8219 + Math.random() * 0.1, -1.2841 + Math.random() * 0.1],
        },
        ipAddress: `197.232.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        deviceInfo: 'Android 12; SM-G991B',
      },
    ] : [];

    verifications.push({
      product: product._id,
      business: business._id,
      qrCode,
      serialNumber,
      batchNumber: `BATCH-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
      manufacturingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isAuthentic: true,
      isActive: true,
      scans,
      metadata: {
        source: 'seed_script',
        qualityCheck: 'passed',
      },
    });
  }

  const createdVerifications = await ProductVerification.insertMany(verifications);

  logger.info(`✅ ${createdVerifications.length} product verifications with QR codes seeded successfully`);
  return createdVerifications;
}

async function seedMpesaTransactions(consumers: any[], businesses: any[]) {
  logger.info('Seeding M-Pesa transactions...');

  await MpesaTransaction.deleteMany({});

  const transactions = [];

  // Create some successful transactions
  for (let i = 0; i < 8; i++) {
    const consumer = consumers[i % consumers.length];
    const business = businesses[i % businesses.length];

    const merchantRequestID = `MR-SIM-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const checkoutRequestID = `CR-SIM-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const mpesaReceiptNumber = i < 6 ? `QBR${Math.floor(Math.random() * 100000000)}` : undefined;

    const amount = [100, 500, 1000, 1500, 2000, 2500, 3000, 5000][i];
    const status = i < 6 ? 'SUCCESS' : (i === 6 ? 'PENDING' : 'FAILED');

    transactions.push({
      merchantRequestID,
      checkoutRequestID,
      mpesaReceiptNumber,
      phoneNumber: consumer.phone,
      amount,
      accountReference: `ORDER-${Math.floor(Math.random() * 10000)}`,
      transactionDesc: `Payment for ${business.businessName}`,
      status,
      resultCode: status === 'SUCCESS' ? '0' : (status === 'FAILED' ? '1' : undefined),
      resultDesc: status === 'SUCCESS' ? 'The service request is processed successfully.' : (status === 'FAILED' ? 'Insufficient balance' : undefined),
      isSimulation: true,
      user: consumer._id,
      business: business._id,
      metadata: {
        source: 'seed_script',
        testData: true,
      },
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last week
    });
  }

  const createdTransactions = await MpesaTransaction.insertMany(transactions);

  logger.info(`✅ ${createdTransactions.length} M-Pesa transactions seeded successfully`);
  return createdTransactions;
}

async function seed() {
  try {
    await connectDatabase();

    logger.info('🌱 Starting database seeding...');

    await seedCategories();
    await seedAdminUser();
    const { smeUsers, consumerUsers } = await seedUsers();
    const businesses = await seedBusinessesAndProducts(smeUsers);
    await seedReviews(businesses, consumerUsers);
    await seedTendersAndBids(consumerUsers, businesses);
    await seedProductVerifications(businesses, consumerUsers);
    await seedMpesaTransactions(consumerUsers, businesses);

    logger.info('🌱 All seeds completed successfully!');
    logger.info('');
    logger.info('Test Accounts Created:');
    logger.info('========================');
    logger.info('Admin: admin@smeflow.co.ke / (from .env)');
    logger.info('');
    logger.info('SME Users (Business Owners):');
    logger.info('- kamau.dairy@example.com / Password123');
    logger.info('- mama.fua@example.com / Password123');
    logger.info('- mwangi.welder@example.com / Password123');
    logger.info('... and 9 more SME users');
    logger.info('');
    logger.info('Consumer Users:');
    logger.info('- consumer1@example.com / Password123');
    logger.info('- consumer2@example.com / Password123');
    logger.info('... and 3 more consumer users');
    logger.info('');
    logger.info('✅ Database contains:');
    logger.info(`   - ${smeUsers.length} SME users`);
    logger.info(`   - ${consumerUsers.length} Consumer users`);
    logger.info(`   - ${businesses.length} businesses with products`);
    logger.info(`   - Reviews and ratings`);
    logger.info(`   - Sample tenders and bids`);
    logger.info(`   - Product verifications with QR codes`);
    logger.info(`   - M-Pesa transaction simulations`);

    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
