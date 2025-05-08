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
exports.getAllBooks = (req, res) => {
  let result = [...books];

  // Filter by author
  if (req.query.author) {
    result = result.filter((book) =>
      book.author.toLowerCase().includes(req.query.author.toLowerCase())
    );
  }

  // Filter by minimum year
  if (req.query.year) {
    result = result.filter((book) => book.year === parseInt(req.query.year));
  }

  res.json({
    status: 'success',
    data: {
      books: result,
    },
  });
};

// GET a specific book by ID
exports.getBook = (req, res) => {
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
};

// POST a new Book
exports.createBook = (req, res) => {
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
};

// PUT to update a book
exports.updateBook = (req, res) => {
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
};

// Delete a Book
exports.deleteBook = (req, res) => {
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
};
