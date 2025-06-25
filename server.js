const express = require('express');
const cors = require('cors');
const productsRoute = require('./routes/productsRoute');
const logger = require('./middleware/logger');
const errorHandler = require('./utils/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/products', productsRoute);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
