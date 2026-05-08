// @desc    Create new product
exports.createProduct = async (req, res) => {
  try {
    // Status manually calculate karein
    let status = 'In Stock';
    if (req.body.quantity === 0) {
      status = 'Out of Stock';
    } else if (req.body.quantity <= 10) {
      status = 'Low Stock';
    }
    
    const product = await Product.create({
      ...req.body,
      status: status
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('❌ Create Error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'SKU already exists. Please use a unique SKU.'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};