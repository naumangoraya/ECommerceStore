import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// Get user notifications
export const getUserNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isAdmin = user.role === "admin";

    // If user is admin, get all admin notifications
    // If user is not admin, get only their notifications
    const query = isAdmin
      ? { $or: [{ user: req.user._id }, { isAdmin: true }] }
      : { user: req.user._id };

    const notifications = await Notification.find(query)
      .populate("order")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error in getUserNotifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const user = await User.findById(req.user._id);
    const isAdmin = user.role === "admin";

    // Allow admin to mark any notification as read
    // Allow users to mark only their notifications as read
    if (!isAdmin && notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ notification });
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    res.status(500).json({ message: "Error updating notification" });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isAdmin = user.role === "admin";

    // If admin, mark all admin notifications as read
    // If user, mark only their notifications as read
    const query = isAdmin
      ? { $or: [{ user: req.user._id }, { isAdmin: true }] }
      : { user: req.user._id };

    await Notification.updateMany(
      { ...query, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error in markAllNotificationsAsRead:", error);
    res.status(500).json({ message: "Error updating notifications" });
  }
};

// Clear read notifications
export const clearReadNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isAdmin = user.role === "admin";

    // If admin, clear all read admin notifications
    // If user, clear only their read notifications
    const query = isAdmin
      ? { $or: [{ user: req.user._id }, { isAdmin: true }], isRead: true }
      : { user: req.user._id, isRead: true };

    await Notification.deleteMany(query);

    res.status(200).json({ message: "Read notifications cleared" });
  } catch (error) {
    console.error("Error in clearReadNotifications:", error);
    res.status(500).json({ message: "Error clearing notifications" });
  }
};

// Create notification (internal use)
export const createNotification = async (
  userId,
  orderId,
  type,
  message,
  isAdmin = false
) => {
  try {
    console.log("Creating notification:", {
      userId,
      orderId,
      type,
      message,
      isAdmin,
    });
    const notification = await Notification.create({
      user: userId,
      order: orderId,
      type,
      message,
      isAdmin,
      isRead: false,
    });
    console.log("Notification created successfully:", notification);
    return notification;
  } catch (error) {
    console.error("Error in createNotification:", error);
    // Don't throw the error, just log it and return null
    return null;
  }
};

// Create admin notification for new registration
export const createNewRegistrationNotification = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found for notification:", userId);
      return null;
    }
    const message = `New user registered: ${user.name} (${user.email})`;
    const notification = await createNotification(
      userId,
      null,
      "new_registration",
      message,
      true
    );
    console.log("Registration notification created:", notification);
    return notification;
  } catch (error) {
    console.error("Error in createNewRegistrationNotification:", error);
    return null;
  }
};

// Create admin notification for new order
export const createNewOrderNotification = async (orderId, userId) => {
  try {
    const user = await User.findById(userId);
    const message = `New order received from ${user.name}`;
    await createNotification(userId, orderId, "new_order", message, true);
  } catch (error) {
    console.error("Error in createNewOrderNotification:", error);
  }
};
