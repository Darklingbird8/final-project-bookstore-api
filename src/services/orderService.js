import {
  createOrder,
  deleteOrderAndItems,
  findAllOrders,
  findOrderById,
  findOrdersByUser,
  updateOrderStatus,
} from '../repositories/orderRepo.js';
import { findBookById } from '../repositories/bookRepo.js';

const VALID_STATUSES = ['PENDING', 'COMPLETED', 'CANCELLED'];

function normalizeStatus(status) {
  if (!status) return 'PENDING';
  return String(status).toUpperCase();
}

function formatOwnershipError() {
  const err = new Error('Forbidden: insufficient permission');
  err.status = 403;
  return err;
}

async function normalizeOrderItems(orderItems) {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    const err = new Error('order_items must be a non-empty array');
    err.status = 400;
    throw err;
  }

  const normalized = [];
  for (const item of orderItems) {
    const bookId = item.bookId ?? item.book_id;
    const quantity = item.quantity;
    if (!bookId || Number.isNaN(Number(bookId))) {
      const err = new Error('Each order item must include book_id');
      err.status = 400;
      throw err;
    }
    if (!quantity || Number.isNaN(Number(quantity)) || Number(quantity) <= 0) {
      const err = new Error('Each order item must include quantity > 0');
      err.status = 400;
      throw err;
    }

    const book = await findBookById(Number(bookId));
    if (!book) {
      const err = new Error(`Book with id ${bookId} not found`);
      err.status = 404;
      throw err;
    }

    normalized.push({ bookId: Number(bookId), quantity: Number(quantity) });
  }

  return normalized;
}

export async function createOrderService(userId, orderItems, status = 'PENDING') {
  const items = await normalizeOrderItems(orderItems);
  const finalStatus = normalizeStatus(status);
  if (!VALID_STATUSES.includes(finalStatus)) {
    const err = new Error(`Invalid status. Allowed: ${VALID_STATUSES.join(', ')}`);
    err.status = 400;
    throw err;
  }

  return createOrder({
    userId,
    status: finalStatus,
    orderItems: items,
  });
}

export async function getOrdersForUser(userId) {
  return findOrdersByUser(userId);
}

export async function getOrderForRequester(orderId, requester) {
  const order = await findOrderById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  if (requester.role !== 'ADMIN' && order.userId !== requester.id) {
    throw formatOwnershipError();
  }
  return order;
}

export async function deleteOrderForRequester(orderId, requester) {
  const order = await findOrderById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  if (requester.role !== 'ADMIN' && order.userId !== requester.id) {
    throw formatOwnershipError();
  }
  await deleteOrderAndItems(orderId);
}

export async function getAllOrdersService() {
  return findAllOrders();
}

export async function updateOrderStatusService(orderId, status) {
  const normalized = normalizeStatus(status);
  if (!VALID_STATUSES.includes(normalized)) {
    const err = new Error(`Invalid status. Allowed: ${VALID_STATUSES.join(', ')}`);
    err.status = 400;
    throw err;
  }
  const order = await findOrderById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  return updateOrderStatus(orderId, normalized);
}
