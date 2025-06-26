"use client"

import { schoolLocations, type SchoolLocation } from "@/lib/school-locations"

export interface GeofenceZone {
  id: string
  name: string
  type: "risk" | "restricted" | "emergency" | "safe" | "assembly"
  riskLevel: "low" | "medium" | "high" | "critical"
  locations: string[] // Array of location IDs
  radius: number // Radius in meters for circular zones
  polygon?: Array<{ x: number; y: number }> // For complex shapes
  rules: GeofenceRule[]
  active: boolean
  description: string
  alertSettings: {
    onEntry: boolean
    onExit: boolean
    onDwellTime: boolean
    dwellTimeMinutes?: number
    alertPriority: "low" | "normal" | "high" | "urgent"
  }
  permissions: {
    allowedRoles: Array<"administrador" | "coordinador" | "inspector" | "docente">
    timeRestrictions?: {
      startTime: string
      endTime: string
      days: number[] // 0-6 (Sunday-Saturday)
    }
  }
}

export interface GeofenceRule {
  id: string
  name: string
  condition: "entry" | "exit" | "dwell" | "unauthorized_access"
  action: "alert" | "notification" | "lockdown" | "evacuation" | "log_only"
  parameters?: {
    dwellTimeMinutes?: number
    maxOccupancy?: number
    requiredRole?: string
  }
}

export interface GeofenceEvent {
  id: string
  zoneId: string
  userId: string
  userName: string
  userRole: string
  eventType: "entry" | "exit" | "dwell_exceeded" | "unauthorized_access"
  timestamp: Date
  location: SchoolLocation
  riskLevel: "low" | "medium" | "high" | "critical"
  alertTriggered: boolean
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
  notes?: string
}

export interface UserLocation {
  userId: string
  userName: string
  userRole: string
  currentLocation: SchoolLocation
  lastUpdate: Date
  isTracking: boolean
  deviceId?: string
}

// Predefined geofence zones
export const geofenceZones: GeofenceZone[] = [
  {
    id: "high-risk-labs",
    name: "Laboratorios de Alto Riesgo",
    type: "risk",
    riskLevel: "high",
    locations: ["lab-quimica", "lab-fisica"],
    radius: 10,
    rules: [
      {
        id: "lab-entry-rule",
        name: "Entrada a Laboratorio",
        condition: "entry",
        action: "alert",
        parameters: { requiredRole: "profesor" },
      },
      {
        id: "lab-dwell-rule",
        name: "Tiempo Excesivo en Laboratorio",
        condition: "dwell",
        action: "notification",
        parameters: { dwellTimeMinutes: 120 },
      },
    ],
    active: true,
    description: "Zona de laboratorios con químicos y equipos peligrosos",
    alertSettings: {
      onEntry: true,
      onExit: true,
      onDwellTime: true,
      dwellTimeMinutes: 120,
      alertPriority: "high",
    },
    permissions: {
      allowedRoles: ["administrador", "coordinador"],
      timeRestrictions: {
        startTime: "08:00",
        endTime: "18:00",
        days: [1, 2, 3, 4, 5], // Monday to Friday
      },
    },
  },
  {
    id: "restricted-admin",
    name: "Área Administrativa Restringida",
    type: "restricted",
    riskLevel: "medium",
    locations: ["direccion", "secretaria", "sala-profesores"],
    radius: 5,
    rules: [
      {
        id: "admin-unauthorized-rule",
        name: "Acceso No Autorizado",
        condition: "entry",
        action: "alert",
      },
    ],
    active: true,
    description: "Área administrativa con acceso restringido",
    alertSettings: {
      onEntry: true,
      onExit: false,
      onDwellTime: false,
      alertPriority: "normal",
    },
    permissions: {
      allowedRoles: ["administrador", "coordinador"],
    },
  },
  {
    id: "emergency-exits",
    name: "Salidas de Emergencia",
    type: "emergency",
    riskLevel: "critical",
    locations: ["entrada-principal"],
    radius: 3,
    rules: [
      {
        id: "emergency-exit-rule",
        name: "Uso de Salida de Emergencia",
        condition: "entry",
        action: "alert",
      },
    ],
    active: true,
    description: "Salidas de emergencia - uso solo en emergencias",
    alertSettings: {
      onEntry: true,
      onExit: false,
      onDwellTime: false,
      alertPriority: "urgent",
    },
    permissions: {
      allowedRoles: ["administrador", "coordinador", "inspector", "docente"],
    },
  },
  {
    id: "safe-assembly",
    name: "Puntos de Encuentro Seguros",
    type: "assembly",
    riskLevel: "low",
    locations: ["patio-principal", "cancha-futbol"],
    radius: 20,
    rules: [
      {
        id: "assembly-entry-rule",
        name: "Llegada a Punto de Encuentro",
        condition: "entry",
        action: "log_only",
      },
    ],
    active: true,
    description: "Puntos de encuentro seguros para evacuaciones",
    alertSettings: {
      onEntry: true,
      onExit: true,
      onDwellTime: false,
      alertPriority: "low",
    },
    permissions: {
      allowedRoles: ["administrador", "coordinador", "inspector", "docente"],
    },
  },
  {
    id: "after-hours-restricted",
    name: "Acceso Fuera de Horario",
    type: "restricted",
    riskLevel: "medium",
    locations: schoolLocations.map((loc) => loc.id),
    radius: 5,
    rules: [
      {
        id: "after-hours-rule",
        name: "Acceso Fuera de Horario",
        condition: "entry",
        action: "alert",
      },
    ],
    active: true,
    description: "Control de acceso fuera del horario escolar",
    alertSettings: {
      onEntry: true,
      onExit: true,
      onDwellTime: false,
      alertPriority: "high",
    },
    permissions: {
      allowedRoles: ["administrador", "coordinador"],
      timeRestrictions: {
        startTime: "18:00",
        endTime: "07:00",
        days: [0, 1, 2, 3, 4, 5, 6], // All days
      },
    },
  },
]

class GeofencingService {
  private userLocations: Map<string, UserLocation> = new Map()
  private geofenceEvents: GeofenceEvent[] = []
  private activeZones: Map<string, GeofenceZone> = new Map()
  private userZoneHistory: Map<string, string[]> = new Map()

  constructor() {
    // Initialize active zones
    geofenceZones.forEach((zone) => {
      if (zone.active) {
        this.activeZones.set(zone.id, zone)
      }
    })

    // Start location monitoring if supported
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      this.startLocationMonitoring()
    }
  }

  // Start monitoring user location
  startLocationMonitoring(): void {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported")
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    }

    navigator.geolocation.watchPosition(
      (position) => {
        this.handleLocationUpdate(position)
      },
      (error) => {
        console.error("Geolocation error:", error)
      },
      options,
    )
  }

  // Handle location updates
  private handleLocationUpdate(position: GeolocationPosition): void {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return

    // Convert GPS coordinates to school coordinates (simplified)
    const schoolLocation = this.convertGPSToSchoolLocation(position.coords.latitude, position.coords.longitude)

    if (schoolLocation) {
      this.updateUserLocation(currentUser.id, currentUser.name, currentUser.role, schoolLocation)
    }
  }

  // Convert GPS coordinates to school location (simplified implementation)
  private convertGPSToSchoolLocation(lat: number, lng: number): SchoolLocation | null {
    // This would normally use actual GPS coordinates and mapping
    // For demo purposes, we'll simulate location detection
    const locations = schoolLocations.filter((loc) => loc.riskLevel === "high")
    return locations[Math.floor(Math.random() * locations.length)] || null
  }

  // Get current user (would integrate with auth system)
  private getCurrentUser() {
    // This would integrate with your auth system
    const stored = localStorage.getItem("school_security_user")
    return stored ? JSON.parse(stored) : null
  }

  // Update user location and check geofences
  updateUserLocation(userId: string, userName: string, userRole: string, location: SchoolLocation): void {
    const previousLocation = this.userLocations.get(userId)
    const userLocation: UserLocation = {
      userId,
      userName,
      userRole,
      currentLocation: location,
      lastUpdate: new Date(),
      isTracking: true,
    }

    this.userLocations.set(userId, userLocation)

    // Check geofence violations
    this.checkGeofenceViolations(userLocation, previousLocation)

    // Update zone history
    this.updateUserZoneHistory(userId, location.id)

    // Dispatch location update event
    window.dispatchEvent(
      new CustomEvent("userLocationUpdate", {
        detail: { userLocation, previousLocation },
      }),
    )
  }

  // Check for geofence violations
  private checkGeofenceViolations(currentLocation: UserLocation, previousLocation?: UserLocation): void {
    const currentZones = this.getZonesForLocation(currentLocation.currentLocation)
    const previousZones = previousLocation ? this.getZonesForLocation(previousLocation.currentLocation) : []

    // Check for zone entries
    const enteredZones = currentZones.filter((zone) => !previousZones.some((pz) => pz.id === zone.id))
    enteredZones.forEach((zone) => {
      this.handleZoneEntry(currentLocation, zone)
    })

    // Check for zone exits
    const exitedZones = previousZones.filter((zone) => !currentZones.some((cz) => cz.id === zone.id))
    exitedZones.forEach((zone) => {
      this.handleZoneExit(currentLocation, zone)
    })

    // Check dwell time for current zones
    currentZones.forEach((zone) => {
      this.checkDwellTime(currentLocation, zone)
    })
  }

  // Get zones that contain a specific location
  private getZonesForLocation(location: SchoolLocation): GeofenceZone[] {
    return Array.from(this.activeZones.values()).filter((zone) => {
      return zone.locations.includes(location.id) || this.isLocationInZone(location, zone)
    })
  }

  // Check if location is within zone radius/polygon
  private isLocationInZone(location: SchoolLocation, zone: GeofenceZone): boolean {
    // For simplicity, we'll use the location ID matching
    // In a real implementation, this would calculate distance/polygon containment
    return zone.locations.includes(location.id)
  }

  // Handle zone entry
  private handleZoneEntry(userLocation: UserLocation, zone: GeofenceZone): void {
    const isAuthorized = this.checkUserAuthorization(userLocation, zone)
    const isWithinTimeRestrictions = this.checkTimeRestrictions(zone)

    const event: GeofenceEvent = {
      id: Date.now().toString(),
      zoneId: zone.id,
      userId: userLocation.userId,
      userName: userLocation.userName,
      userRole: userLocation.userRole,
      eventType: isAuthorized && isWithinTimeRestrictions ? "entry" : "unauthorized_access",
      timestamp: new Date(),
      location: userLocation.currentLocation,
      riskLevel: zone.riskLevel,
      alertTriggered: false,
      resolved: false,
    }

    // Check if alert should be triggered
    if (zone.alertSettings.onEntry && (!isAuthorized || !isWithinTimeRestrictions)) {
      event.alertTriggered = true
      this.triggerGeofenceAlert(event, zone)
    }

    this.geofenceEvents.push(event)
    this.dispatchGeofenceEvent(event)
  }

  // Handle zone exit
  private handleZoneExit(userLocation: UserLocation, zone: GeofenceZone): void {
    const event: GeofenceEvent = {
      id: Date.now().toString(),
      zoneId: zone.id,
      userId: userLocation.userId,
      userName: userLocation.userName,
      userRole: userLocation.userRole,
      eventType: "exit",
      timestamp: new Date(),
      location: userLocation.currentLocation,
      riskLevel: zone.riskLevel,
      alertTriggered: false,
      resolved: false,
    }

    if (zone.alertSettings.onExit) {
      event.alertTriggered = true
      this.triggerGeofenceAlert(event, zone)
    }

    this.geofenceEvents.push(event)
    this.dispatchGeofenceEvent(event)
  }

  // Check dwell time
  private checkDwellTime(userLocation: UserLocation, zone: GeofenceZone): void {
    if (!zone.alertSettings.onDwellTime || !zone.alertSettings.dwellTimeMinutes) return

    const userHistory = this.userZoneHistory.get(userLocation.userId) || []
    const dwellStartTime = this.calculateDwellStartTime(userHistory, zone.id)

    if (dwellStartTime) {
      const dwellMinutes = (Date.now() - dwellStartTime.getTime()) / (1000 * 60)
      if (dwellMinutes >= zone.alertSettings.dwellTimeMinutes) {
        const event: GeofenceEvent = {
          id: Date.now().toString(),
          zoneId: zone.id,
          userId: userLocation.userId,
          userName: userLocation.userName,
          userRole: userLocation.userRole,
          eventType: "dwell_exceeded",
          timestamp: new Date(),
          location: userLocation.currentLocation,
          riskLevel: zone.riskLevel,
          alertTriggered: true,
          resolved: false,
        }

        this.triggerGeofenceAlert(event, zone)
        this.geofenceEvents.push(event)
        this.dispatchGeofenceEvent(event)
      }
    }
  }

  // Calculate when user started dwelling in zone
  private calculateDwellStartTime(userHistory: string[], zoneId: string): Date | null {
    // Simplified implementation - would track actual entry times
    return new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago for demo
  }

  // Check user authorization for zone
  private checkUserAuthorization(userLocation: UserLocation, zone: GeofenceZone): boolean {
    return zone.permissions.allowedRoles.includes(userLocation.userRole as any)
  }

  // Check time restrictions
  private checkTimeRestrictions(zone: GeofenceZone): boolean {
    if (!zone.permissions.timeRestrictions) return true

    const now = new Date()
    const currentDay = now.getDay()
    const currentTime = now.toTimeString().slice(0, 5)

    const { startTime, endTime, days } = zone.permissions.timeRestrictions

    // Check if current day is allowed
    if (!days.includes(currentDay)) return false

    // Check if current time is within allowed hours
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime
    } else {
      // Handle overnight restrictions (e.g., 18:00 to 07:00)
      return currentTime >= startTime || currentTime <= endTime
    }
  }

  // Trigger geofence alert
  private triggerGeofenceAlert(event: GeofenceEvent, zone: GeofenceZone): void {
    const alertData = {
      id: event.id,
      title: this.getAlertTitle(event, zone),
      message: this.getAlertMessage(event, zone),
      priority: zone.alertSettings.alertPriority,
      zone: zone.name,
      user: event.userName,
      location: event.location.name,
      timestamp: event.timestamp,
      riskLevel: zone.riskLevel,
    }

    // Dispatch alert event
    window.dispatchEvent(
      new CustomEvent("geofenceAlert", {
        detail: alertData,
      }),
    )

    console.log("Geofence Alert:", alertData)
  }

  // Generate alert title
  private getAlertTitle(event: GeofenceEvent, zone: GeofenceZone): string {
    switch (event.eventType) {
      case "unauthorized_access":
        return `🚨 Acceso No Autorizado - ${zone.name}`
      case "entry":
        return `⚠️ Entrada a Zona de Riesgo - ${zone.name}`
      case "exit":
        return `ℹ️ Salida de Zona - ${zone.name}`
      case "dwell_exceeded":
        return `⏰ Tiempo Excedido en Zona - ${zone.name}`
      default:
        return `📍 Evento de Geofencing - ${zone.name}`
    }
  }

  // Generate alert message
  private getAlertMessage(event: GeofenceEvent, zone: GeofenceZone): string {
    const baseMessage = `${event.userName} (${event.userRole}) en ${event.location.name}`

    switch (event.eventType) {
      case "unauthorized_access":
        return `${baseMessage}. Acceso no autorizado detectado.`
      case "entry":
        return `${baseMessage}. Entrada a zona de riesgo ${zone.riskLevel}.`
      case "exit":
        return `${baseMessage}. Salida de zona registrada.`
      case "dwell_exceeded":
        return `${baseMessage}. Tiempo de permanencia excedido (${zone.alertSettings.dwellTimeMinutes} min).`
      default:
        return baseMessage
    }
  }

  // Update user zone history
  private updateUserZoneHistory(userId: string, locationId: string): void {
    const history = this.userZoneHistory.get(userId) || []
    history.push(locationId)

    // Keep only last 50 locations
    if (history.length > 50) {
      history.splice(0, history.length - 50)
    }

    this.userZoneHistory.set(userId, history)
  }

  // Dispatch geofence event
  private dispatchGeofenceEvent(event: GeofenceEvent): void {
    window.dispatchEvent(
      new CustomEvent("geofenceEvent", {
        detail: event,
      }),
    )
  }

  // Public methods
  getActiveZones(): GeofenceZone[] {
    return Array.from(this.activeZones.values())
  }

  getGeofenceEvents(): GeofenceEvent[] {
    return this.geofenceEvents
  }

  getUserLocations(): UserLocation[] {
    return Array.from(this.userLocations.values())
  }

  resolveGeofenceEvent(eventId: string, resolvedBy: string, notes?: string): void {
    const event = this.geofenceEvents.find((e) => e.id === eventId)
    if (event) {
      event.resolved = true
      event.resolvedBy = resolvedBy
      event.resolvedAt = new Date()
      event.notes = notes

      window.dispatchEvent(
        new CustomEvent("geofenceEventResolved", {
          detail: event,
        }),
      )
    }
  }

  // Simulate location update for demo
  simulateLocationUpdate(userId: string, userName: string, userRole: string, locationId: string): void {
    const location = schoolLocations.find((loc) => loc.id === locationId)
    if (location) {
      this.updateUserLocation(userId, userName, userRole, location)
    }
  }
}

// Create singleton instance
export const geofencingService = new GeofencingService()

// Export types and service
export type { GeofenceZone, GeofenceEvent, UserLocation, GeofenceRule }
