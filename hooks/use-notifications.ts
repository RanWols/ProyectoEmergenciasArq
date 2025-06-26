"use client"

import { useEffect, useState } from "react"
import { notificationService, alertNotifications, type NotificationData } from "@/lib/notifications"

export function useNotifications() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Check initial state
    setIsEnabled(notificationService.enabled)
    loadNotifications()

    // Listen for notification events
    const handleNewNotification = () => {
      loadNotifications()
    }

    const handleNotificationsCleared = () => {
      setNotifications([])
      setUnreadCount(0)
    }

    window.addEventListener("newNotification", handleNewNotification)
    window.addEventListener("notificationsCleared", handleNotificationsCleared)

    // Set up periodic refresh of notifications
    const interval = setInterval(loadNotifications, 10000)

    return () => {
      window.removeEventListener("newNotification", handleNewNotification)
      window.removeEventListener("notificationsCleared", handleNotificationsCleared)
      clearInterval(interval)
    }
  }, [])

  const loadNotifications = () => {
    const stored = notificationService.getStoredNotifications()
    setNotifications(stored)
    setUnreadCount(stored.length)
  }

  const sendAlertNotification = async (alert: {
    type: "incendio" | "sismo" | "medica" | "intruso"
    location: string
    description: string
    reportedBy: string
  }) => {
    await alertNotifications.sendEmergencyAlert(alert)
  }

  const sendResolutionNotification = async (alert: {
    type: "incendio" | "sismo" | "medica" | "intruso"
    location: string
    resolvedBy: string
  }) => {
    await alertNotifications.sendAlertResolution(alert)
  }

  const sendSystemNotification = async (
    title: string,
    body: string,
    priority: NotificationData["priority"] = "normal",
  ) => {
    await alertNotifications.sendSystemNotification(title, body, priority)
  }

  const clearNotifications = () => {
    notificationService.clearNotifications()
  }

  const toggleNotifications = async () => {
    if (isEnabled) {
      notificationService.disable()
      setIsEnabled(false)
    } else {
      const enabled = await notificationService.initialize()
      setIsEnabled(enabled)
    }
  }

  return {
    isEnabled,
    notifications,
    unreadCount,
    sendAlertNotification,
    sendResolutionNotification,
    sendSystemNotification,
    clearNotifications,
    toggleNotifications,
    loadNotifications,
  }
}
