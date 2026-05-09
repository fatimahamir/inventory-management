const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/Product');

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'https://inventory-management-seven-virid.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ==================== DATABASE CONNECTION ====================
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stockmaster')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// ==================== USER MODEL (Directly here for simplicity) ====================
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// ==================== SIGNUP ROUTE ====================
app.post('/api/signup', async (req, res) => {
  console.log("📝 Signup request received:", req.body);
  
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }
    
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username or email already exists' 
      });
    }
    
    const newUser = new User({
      username,
      email,
      password
    });
    
    await newUser.save();
    
    console.log("✅ User created:", username);
    res.status(201).json({ 
      success: true, 
      message: 'Account created successfully! Please login.' 
    });
    
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ==================== LOGIN ROUTE ====================
// ==================== LOGIN ROUTE (Only Database - No Hardcoded) ====================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Sirf database mein check karo
    const user = await User.findOne({ username });
    
    if (user && user.password === password) {
      console.log("✅ Login successful:", username);
      return res.json({ 
        success: true, 
        message: "Login Successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    }
    
    console.log("❌ Login failed for:", username);
    res.status(401).json({ 
      success: false, 
      message: "Invalid username or password" 
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

// ==================== PRODUCT ROUTES (User Specific) ====================

// GET - Get products for specific user
app.get('/api/products', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Agar userId hai toh us user ke products, nahi toh saare products
    let query = {};
    if (userId && userId !== 'undefined' && userId !== 'null') {
      query = { userId: userId };
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Create product with userId
app.post('/api/products', async (req, res) => {
  try {
    const { userId, ...productData } = req.body;
    
    // Agar userId nahi hai toh 'admin' use karo
    const productUserId = userId || 'admin';
    
    // Check if product with same SKU exists for this user
    const existingProduct = await Product.findOne({ sku: productData.sku, userId: productUserId });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists for you'
      });
    }
    
    const product = await Product.create({
      ...productData,
      userId: productUserId
    });
    
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET - Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    
    // Check ownership
    const productOwner = product.userId || 'admin';
    const requestUser = userId || 'admin';
    
    if (productOwner !== requestUser) {
      return res.status(403).json({
        success: false,
        message: 'You cannot edit this product'
      });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE - Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    
    // Check ownership
    const productOwner = product.userId || 'admin';
    const requestUser = userId || 'admin';
    
    if (productOwner !== requestUser) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete this product'
      });
    }
    
    await product.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'API Running!' });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://0.0.0.0:${PORT}`);
});"" 
