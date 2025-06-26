"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Building, Navigation, AlertTriangle, Users, Shield } from "lucide-react"
import {
  schoolBuildings,
  locationTypes,
  riskLevels,
  getLocationsByFloor,
  type SchoolLocation,
} from "@/lib/school-locations"

interface LocationMapProps {
  selectedLocation?: SchoolLocation
  onLocationSelect?: (location: SchoolLocation) => void
  showAlerts?: boolean
  alertLocations?: SchoolLocation[]
  showEvacuationRoutes?: boolean
  className?: string
}

export default function LocationMap({
  selectedLocation,
  onLocationSelect,
  showAlerts = false,
  alertLocations = [],
  showEvacuationRoutes = false,
  className = "",
}: LocationMapProps) {
  const [selectedBuilding, setSelectedBuilding] = useState(schoolBuildings[0].id)
  const [selectedFloor, setSelectedFloor] = useState(1)

  const currentBuilding = schoolBuildings.find((b) => b.id === selectedBuilding)
  const floorLocations = getLocationsByFloor(selectedBuilding, selectedFloor)

  const handleLocationClick = (location: SchoolLocation) => {
    onLocationSelect?.(location)
  }

  const getLocationStyle = (location: SchoolLocation) => {
    const isSelected = selectedLocation?.id === location.id
    const isAlert = alertLocations.some((alert) => alert.id === location.id)
    const typeInfo = locationTypes[location.type]

    let baseStyle = "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110"

    if (isSelected) {
      baseStyle += " ring-4 ring-blue-500 ring-opacity-50 scale-125"
    }

    if (isAlert) {
      baseStyle += " animate-pulse ring-4 ring-red-500 ring-opacity-75"
    }

    return baseStyle
  }

  const getLocationIcon = (location: SchoolLocation) => {
    const isAlert = alertLocations.some((alert) => alert.id === location.id)
    const typeInfo = locationTypes[location.type]

    if (isAlert) {
      return (
        <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
          <AlertTriangle className="h-4 w-4" />
        </div>
      )
    }

    const colorClass =
      location.riskLevel === "high"
        ? "bg-red-100 border-red-500"
        : location.riskLevel === "medium"
          ? "bg-yellow-100 border-yellow-500"
          : "bg-green-100 border-green-500"

    return (
      <div className={`${colorClass} border-2 p-2 rounded-full shadow-md`}>
        <span className="text-sm">{typeInfo.icon}</span>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa del Colegio
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {schoolBuildings.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedFloor.toString()}
              onValueChange={(value) => setSelectedFloor(Number.parseInt(value))}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentBuilding &&
                  Array.from({ length: currentBuilding.floors }, (_, i) => i + 1).map((floor) => (
                    <SelectItem key={floor} value={floor.toString()}>
                      Piso {floor}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map Container */}
          <div className="relative bg-gray-50 border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="relative w-full h-96">
              {/* Building Layout Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100">
                {/* Grid lines for reference */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Emergency Exits */}
                {currentBuilding?.emergencyExits
                  .filter((exit) => exit.floor === selectedFloor)
                  .map((exit, index) => (
                    <div
                      key={index}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${exit.coordinates.x}%`,
                        top: `${exit.coordinates.y}%`,
                      }}
                    >
                      <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                        <Navigation className="h-4 w-4" />
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                        <Badge className="bg-green-500 text-white text-xs whitespace-nowrap">{exit.location}</Badge>
                      </div>
                    </div>
                  ))}

                {/* Assembly Points (if on ground floor) */}
                {selectedFloor === 1 &&
                  currentBuilding?.assemblyPoints.map((point) => (
                    <div
                      key={point.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${point.coordinates.x}%`,
                        top: `${point.coordinates.y}%`,
                      }}
                    >
                      <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                        <Badge className="bg-blue-500 text-white text-xs whitespace-nowrap">{point.name}</Badge>
                      </div>
                    </div>
                  ))}

                {/* Locations */}
                {floorLocations.map((location) => (
                  <div
                    key={location.id}
                    className={getLocationStyle(location)}
                    style={{
                      left: `${location.coordinates.x}%`,
                      top: `${location.coordinates.y}%`,
                    }}
                    onClick={() => handleLocationClick(location)}
                    title={`${location.name} - ${locationTypes[location.type].label}`}
                  >
                    {getLocationIcon(location)}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                      <Badge variant="outline" className="text-xs whitespace-nowrap bg-white shadow-sm">
                        {location.name}
                      </Badge>
                    </div>
                  </div>
                ))}

                {/* Evacuation Routes (if enabled) */}
                {showEvacuationRoutes && selectedLocation && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Draw evacuation path lines */}
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                      </marker>
                    </defs>
                    {/* Example evacuation route line */}
                    <line
                      x1={`${selectedLocation.coordinates.x}%`}
                      y1={`${selectedLocation.coordinates.y}%`}
                      x2="50%"
                      y2="95%"
                      stroke="#ef4444"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      markerEnd="url(#arrowhead)"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-500 text-white p-1 rounded-full">
                <Navigation className="h-3 w-3" />
              </div>
              <span className="text-xs">Salida de Emergencia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 text-white p-1 rounded-full">
                <Users className="h-3 w-3" />
              </div>
              <span className="text-xs">Punto de Encuentro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-red-500 text-white p-1 rounded-full">
                <AlertTriangle className="h-3 w-3" />
              </div>
              <span className="text-xs">Alerta Activa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-red-100 border-2 border-red-500 p-1 rounded-full">
                <Shield className="h-3 w-3 text-red-600" />
              </div>
              <span className="text-xs">Alto Riesgo</span>
            </div>
          </div>

          {/* Selected Location Info */}
          {selectedLocation && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{locationTypes[selectedLocation.type].icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedLocation.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {currentBuilding?.name} - Piso {selectedLocation.floor}
                      </div>
                      {selectedLocation.capacity && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {selectedLocation.capacity} personas
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />({selectedLocation.coordinates.x},{" "}
                        {selectedLocation.coordinates.y})
                      </div>
                    </div>
                    {selectedLocation.responsiblePerson && (
                      <p className="text-sm text-gray-600 mt-1">Responsable: {selectedLocation.responsiblePerson}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={locationTypes[selectedLocation.type].color}>
                        {locationTypes[selectedLocation.type].label}
                      </Badge>
                      <Badge className={riskLevels[selectedLocation.riskLevel].color}>
                        Riesgo {riskLevels[selectedLocation.riskLevel].label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Building Info */}
          {currentBuilding && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">{currentBuilding.name}</p>
              <p>{currentBuilding.description}</p>
              <p>
                Piso {selectedFloor} de {currentBuilding.floors} • {floorLocations.length} ubicaciones
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
