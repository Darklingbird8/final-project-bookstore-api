import prisma from '../config/db.js';

export async function findAllAuthors() {
  return prisma.authors.findMany({
    include: {
      books: true,
    },
    orderBy: { id: 'asc' },
  });
}

export async function findAuthorById(id) {
  return prisma.authors.findUnique({
    where: { id },
    include: {
      books: true,
    },
  });
}

export async function createAuthor(data) {
  return prisma.authors.create({ data });
}

export async function updateAuthor(id, data) {
  return prisma.authors.update({
    where: { id },
    data,
  });
}

export async function deleteAuthor(id) {
  return prisma.authors.delete({
    where: { id },
  });
}
