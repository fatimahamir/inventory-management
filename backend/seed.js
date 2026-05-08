const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Sample Products Data (Real Inventory)
const products = [
  {
    name: "Wireless Mouse",
    description: "Logitech M185 Wireless Mouse",
    price: 2500,
    quantity: 50,
    category: "Electronics",
    sku: "ELEC001",
    supplier: "Logitech PK"
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB Backlit Gaming Keyboard",
    price: 8500,
    quantity: 25,
    category: "Electronics",
    sku: "ELEC002",
    supplier: "Redragon PK"
  },
  {
    name: "Office Chair",
    description: "Ergonomic Executive Chair",
    price: 15000,
    quantity: 10,
    category: "Furniture",
    sku: "FURN001",
    supplier: "Comfort Seating"
  },
  {
    name: "Desk Lamp",
    description: "LED Study Lamp with USB Port",
    price: 3500,
    quantity: 30,
    category: "Accessories",
    sku: "ACC001",
    supplier: "Bright Lights"
  },
  {
    name: "Notebook A4",
    description: "200 Pages Ruled Notebook",
    price: 250,
    quantity: 200,
    category: "Stationery",
    sku: "STAT001",
    supplier: "Paper Plus"
  },
  {
    name: "USB Cable Type-C",
    description: "Fast Charging 1m Cable",
    price: 450,
    quantity: 100,
    category: "Accessories",
    sku: "ACC002",
    supplier: "Tech Cables"
  },
  {
    name: "Webcam HD",
    description: "1080p Webcam with Microphone",
    price: 6500,
    quantity: 15,
    category: "Electronics",
    sku: "ELEC003",
    supplier: "CamTech"
  },
  {
    name: "Monitor 24 inch",
    description: "Full HD IPS Display",
    price: 32000,
    quantity: 8,
    category: "Electronics",
    sku: "ELEC004",
    supplier: "ViewSonic PK"
  },
  {
    name: "Printer Ink Cartridge",
    description: "Black Ink for HP DeskJet",
    price: 1800,
    quantity: 40,
    category: "Accessories",
    sku: "ACC003",
    supplier: "HP Supplies"
  },
  {
    name: "File Folder Set",
    description: "Pack of 10 Plastic Folders",
    price: 800,
    quantity: 60,
    category: "Stationery",
    sku: "STAT002",
    supplier: "Office Essentials"
  }
];

// Connect & Seed Function
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding');
    
    // Purana data clear karna hai toh yeh line uncomment karein:
    // await Product.deleteMany({});
    
    // Naya data insert karein
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products inserted successfully!`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seed Error:', error);
    mongoose.connection.close();
  }
};

seedDB();