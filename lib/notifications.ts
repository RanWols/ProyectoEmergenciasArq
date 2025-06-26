"use client"

// Types for notifications
export interface NotificationData {
  id: string
  title: string
  body: string
  icon?: string
  timestamp: number
  type: "alert" | "system" | "user"
  priority: "low" | "normal" | "high" | "urgent"
  alertType?: "incendio" | "sismo" | "medica" | "intruso"
}

class NotificationService {
  private isSupported = false
  private isPermissionGranted = false
  private isEnabled = false

  constructor() {
    if (typeof window !== "undefined") {
      this.isSupported = "Notification" in window
      this.isPermissionGranted = Notification.permission === "granted"
      this.isEnabled = localStorage.getItem("notificationsEnabled") === "true"
    }
  }

  // Initialize notifications
  async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn("Notifications are not supported in this browser")
      return false
    }

    try {
      // Request notification permission
      const permission = await this.requestPermission()
      if (!permission) {
        console.warn("Notification permission denied")
        return false
      }

      this.isEnabled = true
      localStorage.setItem("notificationsEnabled", "true")
      console.log("Notifications initialized successfully")
      return true
    } catch (error) {
      console.error("Failed to initialize notifications:", error)
      return false
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      this.isPermissionGranted = permission === "granted"
      return this.isPermissionGranted
    } catch (error) {
      console.error("Failed to request notification permission:", error)
      return false
    }
  }

  // Show native browser notification
  async showNotification(data: Omit<NotificationData, "id" | "timestamp">): Promise<void> {
    if (!this.isPermissionGranted || !this.isEnabled) {
      console.warn("Notifications not enabled or permission not granted")
      return
    }

    const notificationData: NotificationData = {
      ...data,
      id: Date.now().toString(),
      timestamp: Date.now(),
    }

    try {
      // Create native notification
      const notification = new Notification(data.title, {
        body: data.body,
        icon: data.icon || "/placeholder.svg?height=64&width=64",
        tag: `notification-${notificationData.id}`,
        requireInteraction: data.priority === "urgent",
        silent: data.priority === "low",
      })

      // Auto-close notification after delay (except urgent ones)
      if (data.priority !== "urgent") {
        setTimeout(
          () => {
            notification.close()
          },
          data.priority === "high" ? 8000 : 5000,
        )
      }

      // Handle click event
      notification.onclick = () => {
        window.focus()
        notification.close()
        // Trigger custom event for the app to handle
        window.dispatchEvent(new CustomEvent("notificationClick", { detail: notificationData }))
      }

      // Vibrate if supported and enabled
      if ("vibrate" in navigator) {
        navigator.vibrate(this.getVibrationPattern(data.priority))
      }

      // Play sound for urgent notifications
      if (data.priority === "urgent") {
        this.playNotificationSound()
      }

      // Store notification in local storage for history
      this.storeNotification(notificationData)

      // Dispatch event for UI updates
      window.dispatchEvent(new CustomEvent("newNotification", { detail: notificationData }))
    } catch (error) {
      console.error("Failed to show notification:", error)
    }
  }

  // Play notification sound
  private playNotificationSound(): void {
    try {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn("Could not play notification sound:", error)
    }
  }

  // Get vibration pattern based on priority
  private getVibrationPattern(priority: NotificationData["priority"]): number[] {
    switch (priority) {
      case "urgent":
        return [200, 100, 200, 100, 200, 100, 200]
      case "high":
        return [200, 100, 200]
      case "normal":
        return [200]
      case "low":
      default:
        return []
    }
  }

  // Store notification in local storage
  private storeNotification(notification: NotificationData): void {
    try {
      const stored = localStorage.getItem("notifications")
      const notifications: NotificationData[] = stored ? JSON.parse(stored) : []
      notifications.unshift(notification)

      // Keep only last 50 notifications
      if (notifications.length > 50) {
        notifications.splice(50)
      }

      localStorage.setItem("notifications", JSON.stringify(notifications))
    } catch (error) {
      console.error("Failed to store notification:", error)
    }
  }

  // Get stored notifications
  getStoredNotifications(): NotificationData[] {
    try {
      const stored = localStorage.getItem("notifications")
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Failed to get stored notifications:", error)
      return []
    }
  }

  // Clear all notifications
  clearNotifications(): void {
    try {
      localStorage.removeItem("notifications")
      // Dispatch event for UI updates
      window.dispatchEvent(new CustomEvent("notificationsCleared"))
    } catch (error) {
      console.error("Failed to clear notifications:", error)
    }
  }

  // Disable notifications
  disable(): void {
    this.isEnabled = false
    localStorage.setItem("notificationsEnabled", "false")
  }

  // Check if notifications are supported and enabled
  get enabled(): boolean {
    return this.isSupported && this.isPermissionGranted && this.isEnabled
  }

  // Get current permission status
  get permissionStatus(): NotificationPermission {
    return this.isSupported ? Notification.permission : "denied"
  }
}

// Create singleton instance
export const notificationService = new NotificationService()

// Alert-specific notification helpers
export const alertNotifications = {
  // Send emergency alert notification
  async sendEmergencyAlert(alert: {
    type: "incendio" | "sismo" | "medica" | "intruso"
    location: string
    description: string
    reportedBy: string
  }): Promise<void> {
    const alertTypeLabels = {
      incendio: "🔥 INCENDIO",
      sismo: "🌍 SISMO",
      medica: "🚑 EMERGENCIA MÉDICA",
      intruso: "🚨 INTRUSO",
    }

    await notificationService.showNotification({
      title: `${alertTypeLabels[alert.type]} - ${alert.location}`,
      body: `${alert.description}\nReportado por: ${alert.reportedBy}`,
      icon: "/placeholder.svg?height=64&width=64",
      type: "alert",
      priority: "urgent",
      alertType: alert.type,
    })
  },

  // Send alert resolution notification
  async sendAlertResolution(alert: {
    type: "incendio" | "sismo" | "medica" | "intruso"
    location: string
    resolvedBy: string
  }): Promise<void> {
    await notificationService.showNotification({
      title: "✅ Alerta Resuelta",
      body: `La alerta en ${alert.location} ha sido resuelta por ${alert.resolvedBy}`,
      icon: "/placeholder.svg?height=64&width=64",
      type: "system",
      priority: "normal",
      alertType: alert.type,
    })
  },

  // Send system notification
  async sendSystemNotification(
    title: string,
    body: string,
    priority: NotificationData["priority"] = "normal",
  ): Promise<void> {
    await notificationService.showNotification({
      title,
      body,
      type: "system",
      priority,
      icon: "/placeholder.svg?height=64&width=64",
    })
  },
}
