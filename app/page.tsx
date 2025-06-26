"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Flame,
  Activity,
  Shield,
  Clock,
  Users,
  Plus,
  History,
  LogOut,
  Settings,
  User,
  BookOpen,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import LoginForm from "@/components/login-form"
import UserManagement from "@/components/user-management"
import { useNotifications } from "@/hooks/use-notifications"
import NotificationCenter from "@/components/notification-center"
import ProtocolActions from "@/components/protocol-actions"
import LocationSelector from "@/components/location-selector"
import type { SchoolLocation } from "@/lib/school-locations"
import { locationTypes, schoolBuildings } from "@/lib/constants"
import { MapPin } from "lucide-react"

interface AlertEvent {
  id: string
  type: "incendio" | "sismo" | "medica" | "intruso"
  location: string
  timestamp: Date
  status: "activa" | "resuelta"
  description: string
  reportedBy: string
  locationId: string
}

const alertTypes = {
  incendio: {
    label: "Incendio",
    icon: Flame,
    color: "bg-red-500",
    bgColor: "bg-red-50 border-red-200",
    textColor: "text-red-700",
  },
  sismo: {
    label: "Sismo",
    icon: AlertTriangle,
    color: "bg-orange-500",
    bgColor: "bg-orange-50 border-orange-200",
    textColor: "text-orange-700",
  },
  medica: {
    label: "Emergencia Médica",
    icon: Activity,
    color: "bg-blue-500",
    bgColor: "bg-blue-50 border-blue-200",
    textColor: "text-blue-700",
  },
  intruso: {
    label: "Intruso",
    icon: Shield,
    color: "bg-purple-500",
    bgColor: "bg-purple-50 border-purple-200",
    textColor: "text-purple-700",
  },
}

const roleLabels = {
  administrador: "Administrador",
  coordinador: "Coordinador de Seguridad",
  inspector: "Inspector",
  docente: "Docente",
}

export default function SchoolSecuritySystem() {
  const { user, logout, hasPermission } = useAuth()
  const { sendAlertNotification, sendResolutionNotification } = useNotifications()
  const [alerts, setAlerts] = useState<AlertEvent[]>([
    {
      id: "1",
      type: "incendio",
      location: "Laboratorio de Química - Piso 2",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: "activa",
      description: "Humo detectado en el laboratorio",
      reportedBy: "Prof. María González",
      locationId: "lab-quimica",
    },
    {
      id: "2",
      type: "medica",
      location: "Patio Principal",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: "resuelta",
      description: "Estudiante con dificultades respiratorias",
      reportedBy: "Inspector Juan Pérez",
      locationId: "patio-principal",
    },
  ])

  const [selectedLocation, setSelectedLocation] = useState<SchoolLocation | null>(null)
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false)

  const [newAlert, setNewAlert] = useState({
    type: "",
    location: "",
    locationId: "",
    description: "",
  })

  const [currentView, setCurrentView] = useState("dashboard")
  const [selectedProtocol, setSelectedProtocol] = useState<{
    type: "incendio" | "sismo" | "medica" | "intruso"
    location: string
  } | null>(null)

  const activeAlerts = alerts.filter((alert) => alert.status === "activa")

  const handleLocationSelect = (location: SchoolLocation) => {
    setSelectedLocation(location)
    setNewAlert((prev) => ({
      ...prev,
      location: location.name,
      locationId: location.id,
    }))
  }

  const createAlert = async () => {
    if (!newAlert.type || !newAlert.location || !newAlert.description || !user) return

    const alert: AlertEvent = {
      id: Date.now().toString(),
      type: newAlert.type as AlertEvent["type"],
      location: newAlert.location,
      timestamp: new Date(),
      status: "activa",
      description: newAlert.description,
      reportedBy: user.name,
      locationId: newAlert.locationId,
    }

    setAlerts((prev) => [alert, ...prev])
    setNewAlert({ type: "", location: "", locationId: "", description: "" })

    await sendAlertNotification({
      type: alert.type,
      location: alert.location,
      description: alert.description,
      reportedBy: alert.reportedBy,
    })
  }

  const resolveAlert = async (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId)
    if (!alert || !user) return

    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resuelta" } : alert)))

    await sendResolutionNotification({
      type: alert.type,
      location: alert.location,
      description: alert.description,
      reportedBy: alert.reportedBy,
    })
  }

  const openProtocol = (alertType: "incendio" | "sismo" | "medica" | "intruso", location: string) => {
    setSelectedProtocol({ type: alertType, location })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))
    if (minutes < 1) return "Ahora"
    if (minutes === 1) return "Hace 1 minuto"
    return `Hace ${minutes} minutos`
  }

  if (!user) {
    return <LoginForm />
  }

  if (currentView === "users") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => setCurrentView("dashboard")}>
            ← Volver al Dashboard
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {user.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <UserManagement />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Seguridad</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              En línea
            </Badge>
            <NotificationCenter />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hasPermission("manage_users") && (
                  <DropdownMenuItem onClick={() => setCurrentView("users")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Gestión de Usuarios
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{user.name}</p>
            <p className="text-xs text-gray-500">{roleLabels[user.role]}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {user.department}
          </Badge>
        </div>
      </div>

      {/* Active Alerts Banner */}
      {activeAlerts.length > 0 && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 font-medium">
            {activeAlerts.length} alerta{activeAlerts.length > 1 ? "s" : ""} activa{activeAlerts.length > 1 ? "s" : ""}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Alertas
          </TabsTrigger>
          {hasPermission("view_history") && (
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              Historial
            </TabsTrigger>
          )}
          {hasPermission("create_alert") && (
            <TabsTrigger value="create" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Nueva
            </TabsTrigger>
          )}
        </TabsList>

        {/* Active Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          {activeAlerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Shield className="h-12 w-12 mx-auto text-green-500 mb-2" />
                <p className="text-gray-600">No hay alertas activas</p>
                <p className="text-sm text-gray-500">El establecimiento está seguro</p>
              </CardContent>
            </Card>
          ) : (
            activeAlerts.map((alert) => {
              const alertConfig = alertTypes[alert.type]
              const Icon = alertConfig.icon

              return (
                <Card key={alert.id} className={`border-l-4 ${alertConfig.bgColor}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${alertConfig.color}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className={`text-lg ${alertConfig.textColor}`}>{alertConfig.label}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            {getTimeAgo(alert.timestamp)} • {formatTime(alert.timestamp)}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        ACTIVA
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </div>
                      <p className="text-sm text-gray-700">{alert.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        Reportado por: {alert.reportedBy}
                      </div>

                      {/* Protocol Actions Button */}
                      <div className="pt-2 space-y-2">
                        <Button
                          onClick={() => openProtocol(alert.type, alert.location)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Ver Protocolo de Emergencia
                        </Button>

                        {hasPermission("resolve_alert") && (
                          <Button onClick={() => resolveAlert(alert.id)} size="sm" className="w-full">
                            Marcar como Resuelta
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        {/* History Tab */}
        {hasPermission("view_history") && (
          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Historial de Eventos</h3>
              <Badge variant="outline">{alerts.length} eventos</Badge>
            </div>

            {alerts.map((alert) => {
              const alertConfig = alertTypes[alert.type]
              const Icon = alertConfig.icon

              return (
                <Card key={alert.id} className="border-l-2 border-gray-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-1.5 rounded-full ${alert.status === "activa" ? alertConfig.color : "bg-gray-400"}`}
                      >
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{alertConfig.label}</p>
                          <Badge variant={alert.status === "activa" ? "destructive" : "secondary"} className="text-xs">
                            {alert.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{alert.location}</p>
                        <p className="text-xs text-gray-500">
                          {alert.timestamp.toLocaleDateString("es-CL")} • {formatTime(alert.timestamp)}
                        </p>
                        <div className="mt-2">
                          <Button
                            onClick={() => openProtocol(alert.type, alert.location)}
                            variant="ghost"
                            size="sm"
                            className="text-xs h-6 px-2"
                          >
                            <BookOpen className="h-3 w-3 mr-1" />
                            Ver Protocolo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        )}

        {/* Create Alert Tab */}
        {hasPermission("create_alert") && (
          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Crear Nueva Alerta</CardTitle>
                <CardDescription>Reporte una situación de emergencia en el establecimiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="alert-type">Tipo de Emergencia</Label>
                  <Select
                    value={newAlert.type}
                    onValueChange={(value) => setNewAlert((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de emergencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(alertTypes).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon className="h-4 w-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Ubicación Exacta</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      value={newAlert.location}
                      onChange={(e) => setNewAlert((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Seleccione una ubicación específica..."
                      readOnly
                    />
                    <Button type="button" variant="outline" onClick={() => setIsLocationSelectorOpen(true)}>
                      <MapPin className="h-4 w-4 mr-2" />
                      Seleccionar
                    </Button>
                  </div>
                  {selectedLocation && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border">
                      <div className="flex items-center gap-2 text-sm">
                        <span>{locationTypes[selectedLocation.type].icon}</span>
                        <span className="font-medium">{selectedLocation.name}</span>
                        <Badge className={locationTypes[selectedLocation.type].color}>
                          {locationTypes[selectedLocation.type].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {schoolBuildings.find((b) => b.id === selectedLocation.building)?.name} - Piso{" "}
                        {selectedLocation.floor}
                      </p>
                      {selectedLocation.capacity && (
                        <p className="text-xs text-gray-600">Capacidad: {selectedLocation.capacity} personas</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describa brevemente la situación..."
                    value={newAlert.description}
                    onChange={(e) => setNewAlert((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" disabled={!newAlert.type || !newAlert.location || !newAlert.description}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Activar Alerta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Alerta de Emergencia</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Está seguro de que desea activar una alerta de{" "}
                        {alertTypes[newAlert.type as keyof typeof alertTypes]?.label.toLowerCase()} en{" "}
                        {newAlert.location}
                        ?
                        <br />
                        <br />
                        Esta acción notificará inmediatamente a todo el personal autorizado.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={createAlert} className="bg-red-600 hover:bg-red-700">
                        Activar Alerta
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            {/* Location Selector Dialog */}
            <LocationSelector
              selectedLocation={selectedLocation || undefined}
              onLocationSelect={handleLocationSelect}
              isOpen={isLocationSelectorOpen}
              onOpenChange={setIsLocationSelectorOpen}
              showCoordinates={true}
              filterByRisk={true}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Protocol Actions Dialog */}
      {selectedProtocol && (
        <ProtocolActions
          alertType={selectedProtocol.type}
          alertLocation={selectedProtocol.location}
          isOpen={!!selectedProtocol}
          onOpenChange={(open) => !open && setSelectedProtocol(null)}
        />
      )}
    </div>
  )
}
