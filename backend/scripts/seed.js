//require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { Category, Work, Testimonial, Admin } = require('../models');

const seed = async () => {
  //await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marvel_seating');
  console.log('Connected to MongoDB');

  // Clear existing
  await Promise.all([
    Category.deleteMany(),
    Product.deleteMany(),
    Work.deleteMany(),
    Testimonial.deleteMany()
  ]);

  // Categories
  const categories = await Category.insertMany([
    { name: 'Office Chairs', slug: 'office-chairs', description: 'Premium ergonomic office seating solutions', icon: '🪑', order: 1 },
    { name: 'Sofas', slug: 'sofas', description: 'Elegant sofas for office and home', icon: '🛋️', order: 2 },
    { name: 'Cafe Chairs', slug: 'cafe-chairs', description: 'Stylish seating for cafes and restaurants', icon: '☕', order: 3 },
    { name: 'Bar Stools', slug: 'bar-stools', description: 'Modern bar and counter stools', icon: '🪑', order: 4 }
  ]);

  const [officeChairs, sofas, cafeChairs, barStools] = categories;

  // Products
  await Product.insertMany([
    {
      category: officeChairs._id,
      name: 'Executive Office Chair',
      slug: 'executive-office-chair',
      description: 'Premium high-back executive chairs with lumbar support and adjustable features.',
      models: [
        {
          modelNumber: 'EOC-001',
          name: 'Mushy Wings Office Chair',
          description: 'Ergonomic design with breathable mesh back, adjustable armrests, and lumbar support. Ideal for long work sessions.',
          images: ['https://placehold.co/600x450/1e3a5f/ffffff?text=Mushy+Wings+Chair'],
          specifications: [
            { key: 'Material', value: 'Mesh + High-Density Foam' },
            { key: 'Max Load', value: '120 kg' },
            { key: 'Seat Height', value: '45–55 cm (adjustable)' },
            { key: 'Warranty', value: '1 Year' }
          ],
          featured: true,
          tags: ['ergonomic', 'mesh', 'executive'],
          order: 1
        },
        {
          modelNumber: 'EOC-002',
          name: 'Spongy Victory High Back Chair',
          description: 'High-back office chair with premium foam padding and executive aesthetics. Perfect for leadership cabins.',
          images: ['https://placehold.co/600x450/1e3a5f/ffffff?text=Spongy+Victory+Chair'],
          specifications: [
            { key: 'Material', value: 'Premium PU Leather' },
            { key: 'Max Load', value: '130 kg' },
            { key: 'Seat Height', value: '47–57 cm (adjustable)' },
            { key: 'Warranty', value: '1 Year' }
          ],
          featured: true,
          tags: ['leather', 'high-back', 'executive'],
          order: 2
        },
        {
          modelNumber: 'EOC-003',
          name: 'Mid-Back Manager Chair',
          description: 'Comfortable mid-back chair suitable for managers and team leads. Durable and easy to maintain.',
          images: ['https://placehold.co/600x450/1e3a5f/ffffff?text=Mid+Back+Manager'],
          specifications: [
            { key: 'Material', value: 'Fabric + Foam' },
            { key: 'Max Load', value: '110 kg' },
            { key: 'Warranty', value: '1 Year' }
          ],
          tags: ['mid-back', 'manager', 'fabric'],
          order: 3
        }
      ],
      order: 1
    },
    {
      category: sofas._id,
      name: 'Office Lobby Sofa',
      slug: 'office-lobby-sofa',
      description: 'Designer sofas crafted for corporate lobbies and reception areas.',
      models: [
        {
          modelNumber: 'SOF-001',
          name: 'Executive Lobby Sofa - 3 Seater',
          description: 'Elegant 3-seater lobby sofa with premium leatherette upholstery. Makes a powerful first impression.',
          images: ['https://placehold.co/600x450/2d5016/ffffff?text=Lobby+Sofa+3+Seater'],
          specifications: [
            { key: 'Seating', value: '3 Persons' },
            { key: 'Material', value: 'Leatherette + Solid Wood Frame' },
            { key: 'Dimensions', value: '200×80×85 cm' },
            { key: 'Warranty', value: '1 Year' }
          ],
          featured: true,
          tags: ['lobby', '3-seater', 'leatherette'],
          order: 1
        },
        {
          modelNumber: 'SOF-002',
          name: 'Premium Waiting Area Sofa - 2 Seater',
          description: 'Compact 2-seater sofa ideal for waiting areas, reception, and small lounges.',
          images: ['https://placehold.co/600x450/2d5016/ffffff?text=Waiting+Sofa+2+Seater'],
          specifications: [
            { key: 'Seating', value: '2 Persons' },
            { key: 'Material', value: 'Fabric Upholstery' },
            { key: 'Dimensions', value: '140×75×80 cm' },
            { key: 'Warranty', value: '1 Year' }
          ],
          tags: ['waiting', '2-seater', 'fabric'],
          order: 2
        }
      ],
      order: 2
    },
    {
      category: cafeChairs._id,
      name: 'Cafe & Dining Chair',
      slug: 'cafe-dining-chair',
      description: 'Stylish and durable chairs for cafes, restaurants, and dining areas.',
      models: [
        {
          modelNumber: 'CAF-001',
          name: 'Stackable Cafe Chair',
          description: 'Lightweight stackable chairs perfect for cafeterias and food courts. Easy storage and modern design.',
          images: ['https://placehold.co/600x450/8b3a0f/ffffff?text=Cafe+Chair'],
          specifications: [
            { key: 'Material', value: 'PP Plastic + Steel Legs' },
            { key: 'Stackable', value: 'Yes (up to 6)' },
            { key: 'Max Load', value: '100 kg' }
          ],
          featured: true,
          tags: ['cafe', 'stackable', 'lightweight'],
          order: 1
        }
      ],
      order: 3
    },
    {
      category: barStools._id,
      name: 'Bar Stool Collection',
      slug: 'bar-stool-collection',
      description: 'Height-adjustable bar and counter stools for modern work and hospitality spaces.',
      models: [
        {
          modelNumber: 'BAR-001',
          name: 'Adjustable Bar Stool Set',
          description: 'Modern height-adjustable bar stools with footrest ring. Ideal for reception counters and collaborative zones.',
          images: ['https://placehold.co/600x450/3a0f5e/ffffff?text=Bar+Stool'],
          specifications: [
            { key: 'Height', value: '60–80 cm (adjustable)' },
            { key: 'Material', value: 'Chrome Steel + PU Seat' },
            { key: 'Footrest', value: 'Yes (chrome ring)' }
          ],
          featured: true,
          tags: ['bar', 'stool', 'adjustable'],
          order: 1
        }
      ],
      order: 4
    }
  ]);

  // Works
  await Work.insertMany([
    {
      companyName: 'TechCorp Solutions',
      projectTitle: 'Complete Office Chair Setup - 200 Units',
      description: 'Supplied and installed 200 ergonomic office chairs across 5 floors for a leading IT company in Chennai.',
      images: ['https://placehold.co/800x500/1e3a5f/ffffff?text=TechCorp+Office+Setup'],
      category: 'Office Chairs',
      featured: true,
      order: 1
    },
    {
      companyName: 'Star Hotels',
      projectTitle: 'Lobby Sofa Rework & Reupholstery',
      description: 'Complete sofa rework for a 5-star hotel lobby, including reupholstery with premium fabric and foam replacement.',
      images: ['https://placehold.co/800x500/2d5016/ffffff?text=Hotel+Lobby+Sofa+Rework'],
      category: 'Sofa Rework',
      featured: true,
      order: 2
    },
    {
      companyName: 'Reliance Office Complex',
      projectTitle: 'Carpet and Blinds Cleaning - 50,000 sq.ft',
      description: 'Deep cleaning of carpets and blinds across a large corporate complex. Completed within 3 days with zero disruption.',
      images: ['https://placehold.co/800x500/8b3a0f/ffffff?text=Carpet+Cleaning+Project'],
      category: 'Carpet Cleaning',
      featured: false,
      order: 3
    },
    {
      companyName: 'GreenLeaf Cafe Chain',
      projectTitle: 'Cafe Chair Supply - 150 Units',
      description: 'Custom cafe chairs manufactured and delivered to a growing cafe chain across Chennai.',
      images: ['https://placehold.co/800x500/1a5e3a/ffffff?text=Cafe+Chair+Supply'],
      category: 'Cafe Chairs',
      featured: false,
      order: 4
    }
  ]);

  // Testimonials
  await Testimonial.insertMany([
    {
      clientName: 'Ramesh Kumar',
      company: 'TechCorp Solutions',
      designation: 'Facilities Manager',
      review: 'Marvel Seating delivered 200 chairs on time and the quality exceeded our expectations. The team was professional and efficient. Highly recommend!',
      rating: 5,
      featured: true,
      order: 1
    },
    {
      clientName: 'Priya Menon',
      company: 'Star Hotels',
      designation: 'Operations Head',
      review: 'Our lobby sofas look brand new after the rework by Marvel Seating. The craftsmanship is excellent and the turnaround time was impressive.',
      rating: 5,
      featured: true,
      order: 2
    },
    {
      clientName: 'Arun Babu',
      company: 'GreenLeaf Cafe',
      designation: 'Owner',
      review: 'Very happy with the cafe chairs. Durable, stylish, and priced reasonably. Will definitely order again as we expand.',
      rating: 4,
      featured: true,
      order: 3
    },
    {
      clientName: 'Deepa Nair',
      company: 'Reliance Office Complex',
      designation: 'Admin Manager',
      review: 'The carpet and blinds cleaning was done meticulously. Our office feels refreshed and the team worked without disrupting our operations.',
      rating: 5,
      featured: false,
      order: 4
    }
  ]);

  // Admin user
  const adminExists = await Admin.findOne({ email: 'admin@marvelseating.com' });
  if (!adminExists) {
    await Admin.create({
      name: 'Marvel Admin',
      email: 'admin@marvelseating.com',
      password: 'Marvel@2024',
      role: 'superadmin'
    });
    console.log('✅ Admin created: admin@marvelseating.com / Marvel@2024');
  }

  console.log('✅ Database seeded successfully!');
  // process.exit(0);
};

// seed().catch(err => {
//   console.error('❌ Seed failed:', err);
//   process.exit(1);
// });

module.exports = seed;