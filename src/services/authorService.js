import {
  createAuthor,
  deleteAuthor,
  findAllAuthors,
  findAuthorById,
  updateAuthor,
} from '../repositories/authorRepo.js';

export async function getAllAuthors() {
  return findAllAuthors();
}

export async function getAuthor(id) {
  const author = await findAuthorById(id);
  if (!author) {
    const err = new Error('Author not found');
    err.status = 404;
    throw err;
  }
  return author;
}

export async function createAuthorService(data) {
  return createAuthor({ name: data.name });
}

export async function updateAuthorService(id, data) {
  const existing = await findAuthorById(id);
  if (!existing) {
    const err = new Error('Author not found');
    err.status = 404;
    throw err;
  }
  return updateAuthor(id, { name: data.name ?? existing.name });
}

export async function deleteAuthorService(id) {
  const existing = await findAuthorById(id);
  if (!existing) {
    const err = new Error('Author not found');
    err.status = 404;
    throw err;
  }
  return deleteAuthor(id);
}
