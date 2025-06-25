const express = require('express');
const router = express.Router();
const Product = require('../models/products');

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
router.get('/', async (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (search) filter.name = new RegExp(search, 'i');

  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.send(products);
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
