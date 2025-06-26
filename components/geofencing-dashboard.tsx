"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Shield,
  MapPin,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  Settings,
  Activity,
  Navigation,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  geofencingService,
  geofenceZones,
  type GeofenceZone,
  type GeofenceEvent,
  type UserLocation,
} from "@/lib/geofencing"
import { useAuth } from "@/contexts/auth-context"
import { schoolLocations } from "@/lib/school-locations"

export default function GeofencingDashboard() {
  const { user } = useAuth()
  const [activeZones, setActiveZones] = useState<GeofenceZone[]>([])
  const [geofenceEvents, setGeofenceEvents] = useState<GeofenceEvent[]>([])
  const [userLocations, setUserLocations] = useState<UserLocation[]>([])
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false)
  const [selectedZone, setSelectedZone] = useState<GeofenceZone | null>(null)
  const [currentTab, setCurrentTab] = useState("zones")

  useEffect(() => {
    // Load initial data
    setActiveZones(geofencingService.getActiveZones())
    setGeofenceEvents(geofencingService.getGeofenceEvents())
    setUserLocations(geofencingService.getUserLocations())

    // Check if tracking is enabled
    const trackingEnabled = localStorage.getItem("geofencing_enabled") === "true"
    setIsTrackingEnabled(trackingEnabled)

    // Listen for geofence events
    const handleGeofenceEvent = (event: CustomEvent) => {
      setGeofenceEvents((prev) => [event.detail, ...prev])
    }

    const handleGeofenceAlert = (event: CustomEvent) => {
      // Handle geofence alerts
      console.log("Geofence Alert:", event.detail)
    }

    const handleLocationUpdate = (event: CustomEvent) => {
      setUserLocations(geofencingService.getUserLocations())
    }

    window.addEventListener("geofenceEvent", handleGeofenceEvent as EventListener)
    window.addEventListener("geofenceAlert", handleGeofenceAlert as EventListener)
    window.addEventListener("userLocationUpdate", handleLocationUpdate as EventListener)

    return () => {
      window.removeEventListener("geofenceEvent", handleGeofenceEvent as EventListener)
      window.removeEventListener("geofenceAlert", handleGeofenceAlert as EventListener)
      window.removeEventListener("userLocationUpdate", handleLocationUpdate as EventListener)
    }
  }, [])

  const handleTrackingToggle = (enabled: boolean) => {
    setIsTrackingEnabled(enabled)
    localStorage.setItem("geofencing_enabled", enabled.toString())

    if (enabled && user) {
      // Start tracking simulation for demo
      simulateUserMovement()
    }
  }

  const simulateUserMovement = () => {
    if (!user) return

    // Simulate movement through different locations
    const locations = ["lab-quimica", "patio-principal", "direccion", "biblioteca"]
    let currentIndex = 0

    const moveUser = () => {
      if (currentIndex < locations.length) {
        geofencingService.simulateLocationUpdate(user.id, user.name, user.role, locations[currentIndex])
        currentIndex++
        setTimeout(moveUser, 5000) // Move every 5 seconds
      }
    }

    setTimeout(moveUser, 2000) // Start after 2 seconds
  }

  const resolveEvent = (eventId: string) => {
    if (user) {
      geofencingService.resolveGeofenceEvent(eventId, user.name, "Resuelto desde dashboard")
      setGeofenceEvents(geofencingService.getGeofenceEvents())
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    return `${hours}h`
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-500"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-500"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-500"
      case "low":
        return "bg-green-100 text-green-800 border-green-500"
      default:
        return "bg-gray-100 text-gray-800 border-gray-500"
    }
  }

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case "entry":
        return "🚪"
      case "exit":
        return "🚶‍♂️"
      case "dwell_exceeded":
        return "⏰"
      case "unauthorized_access":
        return "🚨"
      default:
        return "📍"
    }
  }

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case "entry":
        return "Entrada"
      case "exit":
        return "Salida"
      case "dwell_exceeded":
        return "Tiempo Excedido"
      case "unauthorized_access":
        return "Acceso No Autorizado"
      default:
        return "Evento"
    }
  }

  const unresolvedEvents = geofenceEvents.filter((event) => !event.resolved)
  const criticalEvents = unresolvedEvents.filter((event) => event.riskLevel === "critical")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Geofencing</h2>
          <p className="text-gray-600">Monitoreo automático de zonas de riesgo</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="tracking-enabled" checked={isTrackingEnabled} onCheckedChange={handleTrackingToggle} />
            <Label htmlFor="tracking-enabled" className="flex items-center gap-2">
              {isTrackingEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Seguimiento Activo
            </Label>
          </div>
          <Badge variant={isTrackingEnabled ? "default" : "secondary"}>
            {isTrackingEnabled ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalEvents.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{criticalEvents.length} evento(s) crítico(s)</strong> requieren atención inmediata
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Zonas Activas</p>
                <p className="text-2xl font-bold">{activeZones.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eventos Hoy</p>
                <p className="text-2xl font-bold">{geofenceEvents.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sin Resolver</p>
                <p className="text-2xl font-bold">{unresolvedEvents.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold">{userLocations.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="zones">Zonas</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Zones Tab */}
        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Zonas de Geofencing Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeZones.map((zone) => (
                  <Card key={zone.id} className="border-l-4 border-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{zone.name}</h3>
                          <p className="text-sm text-gray-600">{zone.description}</p>
                        </div>
                        <Badge className={getRiskLevelColor(zone.riskLevel)}>{zone.riskLevel.toUpperCase()}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3" />
                          <span>{zone.locations.length} ubicaciones</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-3 w-3" />
                          <span>Roles: {zone.permissions.allowedRoles.join(", ")}</span>
                        </div>

                        {zone.permissions.timeRestrictions && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>
                              {zone.permissions.timeRestrictions.startTime} -{" "}
                              {zone.permissions.timeRestrictions.endTime}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-3 w-3" />
                          <span>
                            Alertas:{" "}
                            {[
                              zone.alertSettings.onEntry && "Entrada",
                              zone.alertSettings.onExit && "Salida",
                              zone.alertSettings.onDwellTime && "Tiempo",
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedZone(zone)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{zone.name}</DialogTitle>
                              <DialogDescription>{zone.description}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Ubicaciones Incluidas:</h4>
                                <div className="space-y-1">
                                  {zone.locations.map((locationId) => {
                                    const location = schoolLocations.find((loc) => loc.id === locationId)
                                    return (
                                      <Badge key={locationId} variant="outline" className="mr-2">
                                        {location?.name || locationId}
                                      </Badge>
                                    )
                                  })}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Reglas Configuradas:</h4>
                                <div className="space-y-2">
                                  {zone.rules.map((rule) => (
                                    <div key={rule.id} className="p-2 bg-gray-50 rounded">
                                      <p className="font-medium text-sm">{rule.name}</p>
                                      <p className="text-xs text-gray-600">
                                        {rule.condition} → {rule.action}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Eventos de Geofencing Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {geofenceEvents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No hay eventos registrados</p>
                    <p className="text-sm">Los eventos aparecerán cuando se detecte actividad</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {geofenceEvents.map((event) => {
                      const zone = activeZones.find((z) => z.id === event.zoneId)
                      const isUnresolved = !event.resolved
                      const isCritical = event.riskLevel === "critical"

                      return (
                        <Card
                          key={event.id}
                          className={`border-l-4 ${
                            isCritical
                              ? "border-red-500 bg-red-50"
                              : isUnresolved
                                ? "border-orange-500 bg-orange-50"
                                : "border-green-500 bg-green-50"
                          }`}
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="text-2xl">{getEventTypeIcon(event.eventType)}</div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-sm">
                                      {getEventTypeLabel(event.eventType)} - {zone?.name}
                                    </h4>
                                    <Badge className={getRiskLevelColor(event.riskLevel)}>
                                      {event.riskLevel.toUpperCase()}
                                    </Badge>
                                  </div>

                                  <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <Users className="h-3 w-3" />
                                      <span>
                                        {event.userName} ({event.userRole})
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-3 w-3" />
                                      <span>{event.location.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        {formatTime(event.timestamp)} ({getTimeAgo(event.timestamp)} ago)
                                      </span>
                                    </div>
                                  </div>

                                  {event.resolved && (
                                    <div className="mt-2 text-xs text-green-600">
                                      <div className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        <span>
                                          Resuelto por {event.resolvedBy} el{" "}
                                          {event.resolvedAt && formatTime(event.resolvedAt)}
                                        </span>
                                      </div>
                                      {event.notes && <p className="mt-1">Notas: {event.notes}</p>}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                {event.alertTriggered && (
                                  <Badge variant="destructive" className="text-xs">
                                    ALERTA
                                  </Badge>
                                )}

                                {isUnresolved && (
                                  <Button onClick={() => resolveEvent(event.id)} size="sm" variant="outline">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Resolver
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Ubicaciones de Usuarios en Tiempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userLocations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay usuarios siendo rastreados</p>
                  <p className="text-sm">Active el seguimiento para ver ubicaciones en tiempo real</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userLocations.map((userLocation) => (
                    <Card key={userLocation.userId} className="border-l-4 border-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{userLocation.userName}</h4>
                              <p className="text-sm text-gray-600">{userLocation.userRole}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{userLocation.currentLocation.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Actualizado {getTimeAgo(userLocation.lastUpdate)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración de Geofencing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="tracking-toggle">Seguimiento de Ubicación</Label>
                  <p className="text-sm text-gray-600">Habilitar el monitoreo automático de ubicaciones</p>
                </div>
                <Switch id="tracking-toggle" checked={isTrackingEnabled} onCheckedChange={handleTrackingToggle} />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Información del Sistema</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Zonas configuradas: {geofenceZones.length}</p>
                  <p>• Zonas activas: {activeZones.length}</p>
                  <p>• Eventos registrados: {geofenceEvents.length}</p>
                  <p>• Usuarios rastreados: {userLocations.length}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Simulación de Demostración</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Para propósitos de demostración, puede simular el movimiento de usuarios a través de diferentes zonas.
                </p>
                <Button onClick={simulateUserMovement} variant="outline" disabled={!isTrackingEnabled || !user}>
                  <Activity className="h-4 w-4 mr-2" />
                  Simular Movimiento
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
