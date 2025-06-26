"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, BellOff, Settings, Trash2, Volume2, VolumeX, TestTube } from "lucide-react"
import { notificationService, alertNotifications, type NotificationData } from "@/lib/notifications"

interface NotificationCenterProps {
  onNotificationToggle?: (enabled: boolean) => void
}

export default function NotificationCenter({ onNotificationToggle }: NotificationCenterProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [settings, setSettings] = useState({
    soundEnabled: true,
    vibrationEnabled: true,
    emergencyOnly: false,
  })

  useEffect(() => {
    // Load initial state
    setIsEnabled(notificationService.enabled)
    setNotifications(notificationService.getStoredNotifications())

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("notificationSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Listen for new notifications
    const handleNewNotification = (event: CustomEvent) => {
      setNotifications(notificationService.getStoredNotifications())
    }

    const handleNotificationsCleared = () => {
      setNotifications([])
    }

    window.addEventListener("newNotification", handleNewNotification as EventListener)
    window.addEventListener("notificationsCleared", handleNotificationsCleared)

    return () => {
      window.removeEventListener("newNotification", handleNewNotification as EventListener)
      window.removeEventListener("notificationsCleared", handleNotificationsCleared)
    }
  }, [])

  const handleEnableNotifications = async () => {
    try {
      const success = await notificationService.initialize()
      setIsEnabled(success)
      onNotificationToggle?.(success)

      if (success) {
        // Send welcome notification
        await alertNotifications.sendSystemNotification(
          "Notificaciones Activadas",
          "Recibirás alertas de emergencia en tiempo real",
          "normal",
        )
      }
    } catch (error) {
      console.error("Failed to enable notifications:", error)
    }
  }

  const handleDisableNotifications = () => {
    notificationService.disable()
    setIsEnabled(false)
    onNotificationToggle?.(false)
  }

  const handleClearNotifications = () => {
    notificationService.clearNotifications()
  }

  const handleSettingsChange = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("notificationSettings", JSON.stringify(newSettings))
  }

  const handleTestNotification = async () => {
    await alertNotifications.sendSystemNotification(
      "Notificación de Prueba",
      "Esta es una notificación de prueba del sistema de seguridad escolar",
      "normal",
    )
  }

  const handleTestEmergencyNotification = async () => {
    await alertNotifications.sendEmergencyAlert({
      type: "incendio",
      location: "Laboratorio de Prueba",
      description: "Esta es una alerta de emergencia de prueba",
      reportedBy: "Sistema de Prueba",
    })
  }

  const formatNotificationTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Ahora"
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`
    return date.toLocaleDateString("es-CL")
  }

  const getNotificationIcon = (notification: NotificationData) => {
    if (notification.priority === "urgent") return "🚨"
    if (notification.alertType) {
      switch (notification.alertType) {
        case "incendio":
          return "🔥"
        case "sismo":
          return "🌍"
        case "medica":
          return "🚑"
        case "intruso":
          return "🚨"
      }
    }
    switch (notification.type) {
      case "alert":
        return "⚠️"
      case "system":
        return "ℹ️"
      case "user":
        return "👤"
      default:
        return "🔔"
    }
  }

  const getPriorityColor = (priority: NotificationData["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 border-red-500 text-red-800"
      case "high":
        return "bg-orange-100 border-orange-500 text-orange-800"
      case "normal":
        return "bg-blue-100 border-blue-500 text-blue-800"
      case "low":
        return "bg-gray-100 border-gray-500 text-gray-800"
      default:
        return "bg-gray-100 border-gray-500 text-gray-800"
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {isEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          {notifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
              {notifications.length > 9 ? "9+" : notifications.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Centro de Notificaciones
          </DialogTitle>
          <DialogDescription>Gestiona las notificaciones push del sistema de seguridad</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Enable/Disable Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Estado de Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-toggle">Notificaciones Push</Label>
                <Switch
                  id="notifications-toggle"
                  checked={isEnabled}
                  onCheckedChange={isEnabled ? handleDisableNotifications : handleEnableNotifications}
                />
              </div>

              {!isEnabled && (
                <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="font-medium text-yellow-800">Notificaciones Desactivadas</p>
                  <p className="text-yellow-700">
                    Activa las notificaciones para recibir alertas de emergencia en tiempo real.
                  </p>
                  {notificationService.permissionStatus === "denied" && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Las notificaciones fueron bloqueadas. Puedes habilitarlas en la configuración del navegador.
                    </p>
                  )}
                </div>
              )}

              {isEnabled && (
                <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="font-medium text-green-800">Notificaciones Activas</p>
                  <p className="text-green-700">Recibirás alertas de emergencia automáticamente.</p>
                  <p className="text-xs text-green-600 mt-1">
                    Las notificaciones aparecerán incluso cuando el navegador esté minimizado.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          {isEnabled && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configuración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-toggle" className="flex items-center gap-2">
                    {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    Sonido
                  </Label>
                  <Switch
                    id="sound-toggle"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => handleSettingsChange("soundEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="vibration-toggle">Vibración</Label>
                  <Switch
                    id="vibration-toggle"
                    checked={settings.vibrationEnabled}
                    onCheckedChange={(checked) => handleSettingsChange("vibrationEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="emergency-only-toggle">Solo Emergencias</Label>
                  <Switch
                    id="emergency-only-toggle"
                    checked={settings.emergencyOnly}
                    onCheckedChange={(checked) => handleSettingsChange("emergencyOnly", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Button onClick={handleTestNotification} variant="outline" size="sm" className="w-full">
                    <TestTube className="h-4 w-4 mr-2" />
                    Notificación Normal
                  </Button>
                  <Button onClick={handleTestEmergencyNotification} variant="outline" size="sm" className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Alerta de Emergencia
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications List */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Notificaciones Recientes</CardTitle>
                {notifications.length > 0 && (
                  <Button onClick={handleClearNotifications} variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No hay notificaciones</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border-l-4 ${getPriorityColor(notification.priority)}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{getNotificationIcon(notification)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.body}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-500">{formatNotificationTime(notification.timestamp)}</p>
                              <Badge variant="outline" className="text-xs">
                                {notification.priority.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
