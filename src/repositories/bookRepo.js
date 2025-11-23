import prisma from '../config/db.js';

export async function findAllBooks() {
  return prisma.books.findMany({
    include: {
      author: true,
    },
    orderBy: { id: 'asc' },
  });
}

export async function findBookById(id) {
  return prisma.books.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });
}

export async function createBook(data) {
  return prisma.books.create({ data });
}

export async function updateBook(id, data) {
  return prisma.books.update({
    where: { id },
    data,
  });
}

export async function deleteBook(id) {
  return prisma.books.delete({
    where: { id },
  });
}
