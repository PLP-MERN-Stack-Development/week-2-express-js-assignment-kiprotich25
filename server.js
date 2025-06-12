// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use ((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next()
});
const authenticator = (req, res, next) => {
  const auth =req.headers['authorization'];
  if (auth === "passkey") {
    next();
  }else {
    res.status(401).send('Unauthorized access')
  }
}
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: uuidv4(),
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});
// Get a specific product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = products.find( p => p.id === req.params.id);
    //res.json(product)
    if (!product) return res.status(404).send();
    res.json(product)

  } catch (error) {
    res.status(500).send(error)
  }

});
// Create a new product
app.post('/api/products',authenticator,  (req, res)=> {
  try {
    const {name, price, category, inStock} = req.body;
    const newProduct = {id: uuidv4(), name: req.body.name, price: req.body.price, category: req.body.category, inStock: req.body.inStock };
    if (!name|| price == null || !category || inStock == null) {
      return res.status(400).send(`All fields are required`)
    }
    products.push(newProduct);
    res.status(201).send(newProduct);
  }catch(error) {
    res.status(500).send(error)
    
  }
})
// Update a product
app.put('/api/products/:id',authenticator, (req, res) => {
  try {
    console.log(req.body);
    const id = req.params.id;
    const product = products.find( p => p.id === (req.params.id) );
      
    if (!product) return res.status(404).send('Product not found');
    
    Object.assign(product, req.body);
    res.status(200).send(product)
  }catch (error){
    res.status(500).send(error)
  }
});
//- Delete a product
app.delete('/api/products/:id',authenticator, (req, res) =>{
  try {
    const id = req.params.id;
    const productIndex = products.findIndex(p => p.id === id);

     if (productIndex === -1) {
      return res.status(404).send(`Product not found`)
     }
     products.splice(productIndex, 1)
    res.status(204).send();
    console.log('Trying to delete ID:', id);
    console.log('Available IDs:', products.map(p => p.id));

  }catch (error) {
    res.status(500).send(error)
  }
});


// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 