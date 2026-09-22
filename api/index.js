const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let books = [
  { id: 1, title: "Нэгэн зууны ганцаардал", author: "Габриэль Гарсиа Маркес" },
  { id: 2, title: "Тунгалаг Тамир", author: "Ч.Лодойдамба" }
];

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ message: "Ном олдсонгүй." });
  }

  res.json(book);
});

app.post('/api/books', (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Номын нэр болон зохиолчийг заавал оруулна уу." });
  }

  const newBook = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
    title,
    author
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ message: "Ном олдсонгүй." });
  }

  const { title, author } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;

  res.json(book);
});

app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Ном олдсонгүй." });
  }

  const deletedBook = books.splice(bookIndex, 1);
  res.json({ message: "Ном амжилттай устгагдлаа.", book: deletedBook[0] });
});

app.listen(port, () => {
  console.log(`Library API running on port ${port}`);
});