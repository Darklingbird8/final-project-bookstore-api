import prisma from '../config/db.js';

export async function createOrder({ userId, status, orderItems }) {
  return prisma.orders.create({
    data: {
      userId,
      status,
      orderItems: {
        create: orderItems,
      },
    },
    include: {
      orderItems: {
        include: { book: true },
      },
    },
  });
}

export async function findOrdersByUser(userId) {
  return prisma.orders.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: { book: true },
      },
    },
    orderBy: { id: 'asc' },
  });
}

export async function findAllOrders() {
  return prisma.orders.findMany({
    include: {
      user: true,
      orderItems: {
        include: { book: true },
      },
    },
    orderBy: { id: 'asc' },
  });
}

export async function findOrderById(id) {
  return prisma.orders.findUnique({
    where: { id },
    include: {
      user: true,
      orderItems: {
        include: { book: true },
      },
    },
  });
}

export async function deleteOrderAndItems(id) {
  // Delete items first to avoid FK constraints
  await prisma.order_Items.deleteMany({ where: { orderId: id } });
  return prisma.orders.delete({ where: { id } });
}

export async function updateOrderStatus(id, status) {
  return prisma.orders.update({
    where: { id },
    data: { status },
    include: {
      user: true,
      orderItems: {
        include: { book: true },
      },
    },
  });
}
