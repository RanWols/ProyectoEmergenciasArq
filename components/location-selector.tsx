"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MapPin, Building, Users, AlertTriangle, Navigation } from "lucide-react"
import {
  schoolBuildings,
  schoolLocations,
  locationTypes,
  riskLevels,
  type SchoolLocation,
} from "@/lib/school-locations"

interface LocationSelectorProps {
  selectedLocation?: SchoolLocation
  onLocationSelect: (location: SchoolLocation) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  showCoordinates?: boolean
  filterByRisk?: boolean
}

export default function LocationSelector({
  selectedLocation,
  onLocationSelect,
  isOpen,
  onOpenChange,
  showCoordinates = false,
  filterByRisk = false,
}: LocationSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBuilding, setSelectedBuilding] = useState<string>("all")
  const [selectedFloor, setSelectedFloor] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedRisk, setSelectedRisk] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  const filteredLocations = schoolLocations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.responsiblePerson?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBuilding = selectedBuilding === "all" || location.building === selectedBuilding
    const matchesFloor = selectedFloor === "all" || location.floor.toString() === selectedFloor
    const matchesType = selectedType === "all" || location.type === selectedType
    const matchesRisk = selectedRisk === "all" || location.riskLevel === selectedRisk

    return matchesSearch && matchesBuilding && matchesFloor && matchesType && matchesRisk
  })

  const handleLocationSelect = (location: SchoolLocation) => {
    onLocationSelect(location)
    onOpenChange(false)
  }

  const getAvailableFloors = () => {
    if (selectedBuilding === "all") return []
    const building = schoolBuildings.find((b) => b.id === selectedBuilding)
    return building ? Array.from({ length: building.floors }, (_, i) => i + 1) : []
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Seleccionar Ubicación Exacta
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[70vh]">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Filtros de Búsqueda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar ubicación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div>
                  <Label>Edificio</Label>
                  <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los edificios</SelectItem>
                      {schoolBuildings.map((building) => (
                        <SelectItem key={building.id} value={building.id}>
                          {building.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Piso</Label>
                  <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los pisos</SelectItem>
                      {getAvailableFloors().map((floor) => (
                        <SelectItem key={floor} value={floor.toString()}>
                          Piso {floor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tipo de Ubicación</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      {Object.entries(locationTypes).map(([key, type]) => (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            {type.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {filterByRisk && (
                  <div>
                    <Label>Nivel de Riesgo</Label>
                    <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los niveles</SelectItem>
                        {Object.entries(riskLevels).map(([key, risk]) => (
                          <SelectItem key={key} value={key}>
                            <Badge className={risk.color}>{risk.label}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedBuilding("all")
                    setSelectedFloor("all")
                    setSelectedType("all")
                    setSelectedRisk("all")
                  }}
                >
                  Limpiar Filtros
                </Button>
              </CardContent>
            </Card>

            {selectedLocation && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Ubicación Seleccionada</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{locationTypes[selectedLocation.type].icon}</span>
                      <span className="font-medium">{selectedLocation.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        {schoolBuildings.find((b) => b.id === selectedLocation.building)?.name} - Piso{" "}
                        {selectedLocation.floor}
                      </p>
                      {selectedLocation.capacity && <p>Capacidad: {selectedLocation.capacity} personas</p>}
                      {selectedLocation.responsiblePerson && <p>Responsable: {selectedLocation.responsiblePerson}</p>}
                      {showCoordinates && (
                        <p>
                          Coordenadas: ({selectedLocation.coordinates.x}, {selectedLocation.coordinates.y})
                        </p>
                      )}
                    </div>
                    <Badge className={riskLevels[selectedLocation.riskLevel].color}>
                      Riesgo {riskLevels[selectedLocation.riskLevel].label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Location List/Map */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  Lista
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                >
                  Mapa
                </Button>
              </div>
              <Badge variant="outline">{filteredLocations.length} ubicaciones</Badge>
            </div>

            <ScrollArea className="h-[55vh]">
              {viewMode === "list" ? (
                <div className="space-y-3">
                  {filteredLocations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No se encontraron ubicaciones</p>
                      <p className="text-sm">Ajuste los filtros para ver más resultados</p>
                    </div>
                  ) : (
                    filteredLocations.map((location) => {
                      const building = schoolBuildings.find((b) => b.id === location.building)
                      const typeInfo = locationTypes[location.type]
                      const riskInfo = riskLevels[location.riskLevel]
                      const isSelected = selectedLocation?.id === location.id

                      return (
                        <Card
                          key={location.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                          }`}
                          onClick={() => handleLocationSelect(location)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="text-2xl">{typeInfo.icon}</div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-sm">{location.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Building className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">
                                      {building?.name} - Piso {location.floor}
                                    </span>
                                  </div>
                                  {location.capacity && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <Users className="h-3 w-3 text-gray-400" />
                                      <span className="text-xs text-gray-600">{location.capacity} personas</span>
                                    </div>
                                  )}
                                  {location.responsiblePerson && (
                                    <p className="text-xs text-gray-500 mt-1">{location.responsiblePerson}</p>
                                  )}
                                  {location.description && (
                                    <p className="text-xs text-gray-500 mt-1">{location.description}</p>
                                  )}
                                  {showCoordinates && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <Navigation className="h-3 w-3 text-gray-400" />
                                      <span className="text-xs text-gray-600">
                                        ({location.coordinates.x}, {location.coordinates.y})
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                                <Badge className={riskInfo.color}>{riskInfo.label}</Badge>
                                {location.assemblyPoint && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700">
                                    Punto de Encuentro
                                  </Badge>
                                )}
                                {location.emergencyExit && (
                                  <Badge variant="outline" className="bg-red-50 text-red-700">
                                    Salida de Emergencia
                                  </Badge>
                                )}
                                {location.riskLevel === "high" && (
                                  <div className="flex items-center gap-1 text-red-600">
                                    <AlertTriangle className="h-3 w-3" />
                                    <span className="text-xs">Alto Riesgo</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {schoolBuildings.map((building) => {
                    const buildingLocations = filteredLocations.filter((loc) => loc.building === building.id)
                    if (buildingLocations.length === 0) return null

                    return (
                      <Card key={building.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {building.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {Array.from({ length: building.floors }, (_, i) => i + 1).map((floor) => {
                              const floorLocations = buildingLocations.filter((loc) => loc.floor === floor)
                              if (floorLocations.length === 0) return null

                              return (
                                <div key={floor}>
                                  <h4 className="font-medium text-sm mb-2">Piso {floor}</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {floorLocations.map((location) => {
                                      const typeInfo = locationTypes[location.type]
                                      const isSelected = selectedLocation?.id === location.id

                                      return (
                                        <Button
                                          key={location.id}
                                          variant={isSelected ? "default" : "outline"}
                                          size="sm"
                                          className="justify-start h-auto p-2"
                                          onClick={() => handleLocationSelect(location)}
                                        >
                                          <div className="flex items-center gap-2 text-left">
                                            <span className="text-sm">{typeInfo.icon}</span>
                                            <div className="min-w-0">
                                              <p className="text-xs font-medium truncate">{location.name}</p>
                                              {location.capacity && (
                                                <p className="text-xs text-gray-500">{location.capacity}p</p>
                                              )}
                                            </div>
                                          </div>
                                        </Button>
                                      )
                                    })}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
