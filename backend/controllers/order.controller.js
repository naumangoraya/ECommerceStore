import {
  createNotification,
  createNewOrderNotification,
} from "./notification.controller.js";
import Order from "../models/order.model.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Create notification for status change
    let message = "";
    switch (status) {
      case "processing":
        message = "Your order is being processed";
        break;
      case "shipped":
        message = "Your order has been shipped";
        break;
      case "delivered":
        message = "Your order has been delivered";
        break;
      case "cancelled":
        message = "Your order has been cancelled";
        break;
      default:
        message = `Your order status has been updated to ${status}`;
    }

    await createNotification(order.user, order._id, "order_status", message);

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      status: "pending",
    });

    // Create admin notification for new order
    await createNotification(
      req.user._id,
      order._id,
      "new_order",
      `New order #${order._id} placed by ${req.user.name}`,
      true // isAdmin notification
    );

    res.status(201).json(order);
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};
