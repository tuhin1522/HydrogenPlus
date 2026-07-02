"use client";

import { useState } from "react";

const MOCK_NOTIFICATIONS = [
  { id: "1", title: "New student admitted", body: "Arif Hossain has been admitted to Morning Batch A.", time: "2 minutes ago", read: false, icon: "🎓" },
  { id: "2", title: "Payment received", body: "৳1500 received from Fatema Akter for monthly fee.", time: "1 hour ago", read: false, icon: "💰" },
  { id: "3", title: "Exam scheduled", body: "Physics Unit Test has been scheduled for July 28.", time: "3 hours ago", read: true, icon: "📝" },
  { id: "4", title: "Teacher assigned", body: "Mr. Rafiqul Islam has been assigned to Mathematics – Morning A.", time: "Yesterday", read: true, icon: "👩‍🏫" },
  { id: "5", title: "New announcement", body: "The SSC Math Complete course has been published.", time: "2 days ago", read: true, icon: "📢" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-primary hover:underline font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markRead(notif.id)}
            className={`bg-card border rounded-xl p-4 cursor-pointer transition hover:border-primary/30 ${
              !notif.read ? "border-primary/30 bg-primary/5" : "border-border"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xl shrink-0 ${!notif.read ? "bg-primary/10" : "bg-muted"}`}>
                {notif.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 justify-between">
                  <p className={`text-sm font-semibold ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{notif.body}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{notif.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
