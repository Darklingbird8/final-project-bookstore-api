import {
  createAuthorService,
  deleteAuthorService,
  getAllAuthors,
  getAuthor,
  updateAuthorService,
} from '../services/authorService.js';

export async function getAuthorsHandler(req, res, next) {
  try {
    const authors = await getAllAuthors();
    res.status(200).json(authors);
  } catch (err) {
    next(err);
  }
}

export async function getAuthorByIdHandler(req, res, next) {
  try {
    const author = await getAuthor(Number(req.params.id));
    res.status(200).json(author);
  } catch (err) {
    next(err);
  }
}

export async function createAuthorHandler(req, res, next) {
  try {
    const author = await createAuthorService({ name: req.body.name });
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
}

export async function updateAuthorHandler(req, res, next) {
  try {
    const author = await updateAuthorService(Number(req.params.id), {
      name: req.body.name,
    });
    res.status(200).json(author);
  } catch (err) {
    next(err);
  }
}

export async function deleteAuthorHandler(req, res, next) {
  try {
    await deleteAuthorService(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
