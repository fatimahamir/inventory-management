const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
  // ❌ updateStock hata diya kyunki controller mein nahi hai
} = require('../controllers/productController');

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

// ❌ Yeh line bhi hata di (updateStock nahi hai controller mein)
// router.route('/:id/stock').patch(updateStock);

module.exports = router;