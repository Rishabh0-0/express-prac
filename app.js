const express = require('express');

const bookRouter = require('./bookRoutes');

const app = express();

/////////////////////////////////////////////////////////////
////////////// MIDDLEWARE

app.use(express.json());

// Request Logger Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/////////////////////////////////////////////////////////////
////////////// Routes

app.use('/api/books', bookRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Book Management API' });
});

/////////////////////////////////////////////////////////////
////////////// Server

const PORT = 2000;
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});

/////////////////////////////////////////////////////////////
////////////// Error Handling Middleware

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found!' });
});
