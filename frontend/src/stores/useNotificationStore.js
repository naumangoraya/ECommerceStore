import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/notifications");
      const notifications = response.data.notifications;
      set({
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
      set({ loading: false });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await axios.patch(`/notifications/${notificationId}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      }));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  },

  markAllAsRead: async () => {
    try {
      await axios.patch("/notifications/read-all");
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  },

  clearReadNotifications: async () => {
    try {
      await axios.delete("/notifications/clear-read");
      set((state) => ({
        notifications: state.notifications.filter((n) => !n.isRead),
      }));
      toast.success("Read notifications cleared");
    } catch (error) {
      console.error("Error clearing read notifications:", error);
      toast.error("Failed to clear read notifications");
    }
  },
}));
