const express = require('express');

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

let books = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
  },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
  { id: 3, title: '1984', author: 'George Orwell', year: 1949 },
];

/////////////////////////////////////////////////////////////
////////////// CRUD Operations

// GET All Books
app.get('/api/books', (req, res) => {
  res.json({
    status: 'success',
    data: {
      books,
    },
  });
});

// GET a specific book by ID
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((el) => el.id === id);

  if (!book) {
    return res.status(404).json({ status: 'fail', message: 'Book not found' });
  }

  res.json({
    status: 'success',
    data: {
      book,
    },
  });
});

// POST a new Book
app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'Title and Author are required',
    });
  }
  const newId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
  const newBook = { id: newId, title, author, year: year || null };

  books.push(newBook);

  res.status(201).json({
    status: 'success',
    data: {
      newBook,
    },
  });
});

// PUT to update a book
app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author, year } = req.body;

  const bookIndex = books.findIndex((b) => b.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ status: 'fail', message: 'Book not found' });
  }

  const updatedBook = {
    id,
    title: title || books[bookIndex].title,
    author: author || books[bookIndex].author,
    year: year || books[bookIndex].year,
  };

  books[bookIndex] = updatedBook;
  res.json({
    status: 'success',
    data: {
      updatedBook,
    },
  });
});

// Delete a Book
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ status: 'fail', message: 'Book not found' });
  }

  const deletedBook = books[bookIndex];
  books = books.filter((b) => b.id !== id);

  res.json({
    status: 'success',
    message: 'Book successfully deleted',
    data: {
      book: deletedBook,
    },
  });
});

app.get('/', (req, res) => {
  res.json('Welcome to the Book Manegment API');
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
