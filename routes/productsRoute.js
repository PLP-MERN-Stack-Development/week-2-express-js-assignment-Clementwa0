const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const auth = require('../controllers/auth');
const validateProduct = require('../controllers/validateProduct');

let products = [];
// Create a new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get all products
router.get('/', (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  let filtered = [...products];

  if (category) {
    filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  res.send(filtered.slice(start, end));
});


// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).send({ message: 'Product not found' });
    res.send(product);
  } catch (error) {
    res.status(400).send({ error: 'Invalid product ID' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Fixed: 'runvalidators' -> 'runValidators'
    );
    if (!updatedProduct)
      return res.status(404).send({ message: 'Product not found' });
    res.send(updatedProduct);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).send({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully', deletedProduct });
  } catch (error) {
    res.status(400).send({ error: 'Invalid product ID' });
  }
});

module.exports = router;
