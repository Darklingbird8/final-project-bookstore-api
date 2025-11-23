import {
  createBookService,
  deleteBookService,
  getAllBooks,
  getBook,
  updateBookService,
} from '../services/bookService.js';

export async function getBooksHandler(req, res, next) {
  try {
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
}

export async function getBookByIdHandler(req, res, next) {
  try {
    const book = await getBook(Number(req.params.id));
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
}

export async function createBookHandler(req, res, next) {
  try {
    const book = await createBookService({
      title: req.body.title,
      price: req.body.price,
      stock: req.body.stock,
      authorId: req.body.authorId,
    });
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
}

export async function updateBookHandler(req, res, next) {
  try {
    const book = await updateBookService(Number(req.params.id), {
      title: req.body.title,
      price: req.body.price,
      stock: req.body.stock,
      authorId: req.body.authorId,
    });
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
}

export async function deleteBookHandler(req, res, next) {
  try {
    await deleteBookService(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
