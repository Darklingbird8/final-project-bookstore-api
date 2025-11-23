import { findAuthorById } from '../repositories/authorRepo.js';
import {
  createBook,
  deleteBook,
  findAllBooks,
  findBookById,
  updateBook,
} from '../repositories/bookRepo.js';

async function ensureAuthorExists(authorId) {
  const author = await findAuthorById(authorId);
  if (!author) {
    const err = new Error('Author not found');
    err.status = 404;
    throw err;
  }
  return author;
}

export async function getAllBooks() {
  return findAllBooks();
}

export async function getBook(id) {
  const book = await findBookById(id);
  if (!book) {
    const err = new Error('Book not found');
    err.status = 404;
    throw err;
  }
  return book;
}

export async function createBookService(data) {
  await ensureAuthorExists(data.authorId);
  return createBook({
    title: data.title,
    price: data.price,
    stock: data.stock,
    authorId: data.authorId,
  });
}

export async function updateBookService(id, data) {
  const existing = await findBookById(id);
  if (!existing) {
    const err = new Error('Book not found');
    err.status = 404;
    throw err;
  }
  if (data.authorId) {
    await ensureAuthorExists(data.authorId);
  }
  return updateBook(id, {
    title: data.title ?? existing.title,
    price: data.price ?? existing.price,
    stock: data.stock ?? existing.stock,
    authorId: data.authorId ?? existing.authorId,
  });
}

export async function deleteBookService(id) {
  const existing = await findBookById(id);
  if (!existing) {
    const err = new Error('Book not found');
    err.status = 404;
    throw err;
  }
  return deleteBook(id);
}
