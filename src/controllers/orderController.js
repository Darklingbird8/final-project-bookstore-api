import {
  createOrderService,
  deleteOrderForRequester,
  getAllOrdersService,
  getOrderForRequester,
  getOrdersForUser,
  updateOrderStatusService,
} from '../services/orderService.js';

export async function createOrderHandler(req, res, next) {
  try {
    const order = await createOrderService(
      req.user.id,
      req.body.order_items || req.body.orderItems,
      req.body.status,
    );
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export async function getMyOrdersHandler(req, res, next) {
  try {
    const orders = await getOrdersForUser(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getOrderByIdHandler(req, res, next) {
  try {
    const order = await getOrderForRequester(Number(req.params.id), req.user);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

export async function deleteOrderHandler(req, res, next) {
  try {
    await deleteOrderForRequester(Number(req.params.id), req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getAllOrdersHandler(req, res, next) {
  try {
    const orders = await getAllOrdersService();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatusHandler(req, res, next) {
  try {
    const order = await updateOrderStatusService(
      Number(req.params.id),
      req.body.status,
    );
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}
