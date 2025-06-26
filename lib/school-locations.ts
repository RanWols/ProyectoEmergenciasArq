"use client"

export interface SchoolLocation {
  id: string
  name: string
  type:
    | "aula"
    | "laboratorio"
    | "oficina"
    | "patio"
    | "baño"
    | "biblioteca"
    | "gimnasio"
    | "cocina"
    | "enfermeria"
    | "auditorio"
    | "escalera"
    | "pasillo"
    | "entrada"
    | "estacionamiento"
  floor: number
  building: string
  coordinates: {
    x: number // Coordenada X en el plano del edificio (0-100)
    y: number // Coordenada Y en el plano del edificio (0-100)
  }
  capacity?: number
  description?: string
  emergencyExit?: boolean
  assemblyPoint?: boolean
  riskLevel: "low" | "medium" | "high"
  equipment?: string[]
  responsiblePerson?: string
}

export interface Building {
  id: string
  name: string
  floors: number
  description: string
  emergencyExits: Array<{
    floor: number
    location: string
    coordinates: { x: number; y: number }
  }>
  assemblyPoints: Array<{
    id: string
    name: string
    coordinates: { x: number; y: number }
    capacity: number
  }>
}

export const schoolBuildings: Building[] = [
  {
    id: "principal",
    name: "Edificio Principal",
    floors: 3,
    description: "Edificio principal con aulas, oficinas administrativas y biblioteca",
    emergencyExits: [
      { floor: 1, location: "Entrada Principal", coordinates: { x: 50, y: 95 } },
      { floor: 1, location: "Salida Lateral Este", coordinates: { x: 90, y: 50 } },
      { floor: 1, location: "Salida Lateral Oeste", coordinates: { x: 10, y: 50 } },
      { floor: 2, location: "Escalera de Emergencia Este", coordinates: { x: 85, y: 20 } },
      { floor: 2, location: "Escalera de Emergencia Oeste", coordinates: { x: 15, y: 20 } },
      { floor: 3, location: "Escalera de Emergencia Este", coordinates: { x: 85, y: 20 } },
      { floor: 3, location: "Escalera de Emergencia Oeste", coordinates: { x: 15, y: 20 } },
    ],
    assemblyPoints: [
      { id: "ap1", name: "Patio Principal", coordinates: { x: 50, y: 120 }, capacity: 500 },
      { id: "ap2", name: "Cancha Deportiva", coordinates: { x: 150, y: 50 }, capacity: 300 },
    ],
  },
  {
    id: "laboratorios",
    name: "Edificio de Laboratorios",
    floors: 2,
    description: "Laboratorios de ciencias, informática y talleres",
    emergencyExits: [
      { floor: 1, location: "Entrada Principal Lab", coordinates: { x: 50, y: 95 } },
      { floor: 1, location: "Salida de Emergencia", coordinates: { x: 10, y: 30 } },
      { floor: 2, location: "Escalera de Emergencia", coordinates: { x: 15, y: 30 } },
    ],
    assemblyPoints: [{ id: "ap3", name: "Patio de Laboratorios", coordinates: { x: 50, y: 120 }, capacity: 200 }],
  },
  {
    id: "deportivo",
    name: "Complejo Deportivo",
    floors: 1,
    description: "Gimnasio, camarines y oficinas deportivas",
    emergencyExits: [
      { floor: 1, location: "Entrada Principal Gimnasio", coordinates: { x: 50, y: 95 } },
      { floor: 1, location: "Salida Lateral Camarines", coordinates: { x: 20, y: 20 } },
      { floor: 1, location: "Salida de Emergencia", coordinates: { x: 80, y: 20 } },
    ],
    assemblyPoints: [{ id: "ap4", name: "Cancha Exterior", coordinates: { x: 50, y: 120 }, capacity: 400 }],
  },
]

export const schoolLocations: SchoolLocation[] = [
  // Edificio Principal - Piso 1
  {
    id: "aula-101",
    name: "Aula 101",
    type: "aula",
    floor: 1,
    building: "principal",
    coordinates: { x: 20, y: 70 },
    capacity: 35,
    riskLevel: "low",
    responsiblePerson: "Prof. Ana García",
  },
  {
    id: "aula-102",
    name: "Aula 102",
    type: "aula",
    floor: 1,
    building: "principal",
    coordinates: { x: 40, y: 70 },
    capacity: 35,
    riskLevel: "low",
    responsiblePerson: "Prof. Carlos Ruiz",
  },
  {
    id: "aula-103",
    name: "Aula 103",
    type: "aula",
    floor: 1,
    building: "principal",
    coordinates: { x: 60, y: 70 },
    capacity: 35,
    riskLevel: "low",
    responsiblePerson: "Prof. María López",
  },
  {
    id: "direccion",
    name: "Dirección",
    type: "oficina",
    floor: 1,
    building: "principal",
    coordinates: { x: 80, y: 70 },
    capacity: 10,
    riskLevel: "low",
    responsiblePerson: "Director Juan Pérez",
  },
  {
    id: "secretaria",
    name: "Secretaría",
    type: "oficina",
    floor: 1,
    building: "principal",
    coordinates: { x: 80, y: 60 },
    capacity: 5,
    riskLevel: "low",
    responsiblePerson: "Sec. Carmen Silva",
  },
  {
    id: "biblioteca",
    name: "Biblioteca",
    type: "biblioteca",
    floor: 1,
    building: "principal",
    coordinates: { x: 30, y: 40 },
    capacity: 80,
    riskLevel: "low",
    equipment: ["Computadores", "Proyector", "Sistema de sonido"],
    responsiblePerson: "Bibliotecaria Rosa Morales",
  },
  {
    id: "enfermeria",
    name: "Enfermería",
    type: "enfermeria",
    floor: 1,
    building: "principal",
    coordinates: { x: 70, y: 40 },
    capacity: 8,
    riskLevel: "medium",
    equipment: ["Botiquín", "Camilla", "Desfibrilador"],
    responsiblePerson: "Enfermera Patricia Vega",
  },
  {
    id: "patio-principal",
    name: "Patio Principal",
    type: "patio",
    floor: 1,
    building: "principal",
    coordinates: { x: 50, y: 20 },
    capacity: 500,
    riskLevel: "low",
    assemblyPoint: true,
  },

  // Edificio Principal - Piso 2
  {
    id: "aula-201",
    name: "Aula 201",
    type: "aula",
    floor: 2,
    building: "principal",
    coordinates: { x: 20, y: 70 },
    capacity: 35,
    riskLevel: "low",
    responsiblePerson: "Prof. Luis Mendoza",
  },
  {
    id: "aula-202",
    name: "Aula 202",
    type: "aula",
    floor: 2,
    building: "principal",
    coordinates: { x: 40, y: 70 },
    capacity: 35,
    riskLevel: "low",
    responsiblePerson: "Prof. Elena Torres",
  },
  {
    id: "aula-203",
    name: "Aula 203",
    type: "aula",
    floor: 2,
    building: "principal",
    coordinates: { x: 60, y: 70 },
    capacity: 35,
    riskLevel: "low",
    responsiblePerson: "Prof. Roberto Díaz",
  },
  {
    id: "sala-profesores",
    name: "Sala de Profesores",
    type: "oficina",
    floor: 2,
    building: "principal",
    coordinates: { x: 80, y: 70 },
    capacity: 20,
    riskLevel: "low",
    equipment: ["Computadores", "Impresora", "Microondas"],
  },
  {
    id: "auditorio",
    name: "Auditorio",
    type: "auditorio",
    floor: 2,
    building: "principal",
    coordinates: { x: 50, y: 40 },
    capacity: 150,
    riskLevel: "medium",
    equipment: ["Sistema de sonido", "Proyector", "Iluminación"],
    responsiblePerson: "Coord. Eventos María Soto",
  },

  // Edificio Principal - Piso 3
  {
    id: "aula-301",
    name: "Aula 301",
    type: "aula",
    floor: 3,
    building: "principal",
    coordinates: { x: 20, y: 70 },
    capacity: 35,
    riskLevel: "low",
    responsiblePerson: "Prof. Andrea Campos",
  },
  {
    id: "aula-302",
    name: "Aula 302",
    type: "aula",
    floor: 3,
    building: "principal",
    coordinates: { x: 40, y: 70 },
    capacity: 35,
    riskLevel: "low",
    responsiblePerson: "Prof. Miguel Herrera",
  },
  {
    id: "sala-computacion",
    name: "Sala de Computación",
    type: "aula",
    floor: 3,
    building: "principal",
    coordinates: { x: 60, y: 70 },
    capacity: 30,
    riskLevel: "medium",
    equipment: ["30 Computadores", "Proyector", "Aire acondicionado"],
    responsiblePerson: "Prof. Informática Pedro Rojas",
  },

  // Edificio de Laboratorios - Piso 1
  {
    id: "lab-quimica",
    name: "Laboratorio de Química",
    type: "laboratorio",
    floor: 1,
    building: "laboratorios",
    coordinates: { x: 30, y: 70 },
    capacity: 25,
    riskLevel: "high",
    equipment: ["Campanas extractoras", "Mecheros", "Reactivos químicos", "Ducha de emergencia"],
    responsiblePerson: "Prof. Química Sandra Moreno",
  },
  {
    id: "lab-fisica",
    name: "Laboratorio de Física",
    type: "laboratorio",
    floor: 1,
    building: "laboratorios",
    coordinates: { x: 70, y: 70 },
    capacity: 25,
    riskLevel: "medium",
    equipment: ["Equipos eléctricos", "Instrumentos de medición", "Generadores"],
    responsiblePerson: "Prof. Física Jorge Castillo",
  },
  {
    id: "bodega-lab",
    name: "Bodega de Laboratorio",
    type: "oficina",
    floor: 1,
    building: "laboratorios",
    coordinates: { x: 50, y: 40 },
    capacity: 3,
    riskLevel: "high",
    equipment: ["Reactivos", "Equipos de seguridad", "Material de laboratorio"],
  },

  // Edificio de Laboratorios - Piso 2
  {
    id: "lab-biologia",
    name: "Laboratorio de Biología",
    type: "laboratorio",
    floor: 2,
    building: "laboratorios",
    coordinates: { x: 30, y: 70 },
    capacity: 25,
    riskLevel: "medium",
    equipment: ["Microscopios", "Muestras biológicas", "Incubadora"],
    responsiblePerson: "Prof. Biología Carmen Flores",
  },
  {
    id: "taller-arte",
    name: "Taller de Arte",
    type: "aula",
    floor: 2,
    building: "laboratorios",
    coordinates: { x: 70, y: 70 },
    capacity: 20,
    riskLevel: "medium",
    equipment: ["Pinturas", "Solventes", "Herramientas", "Horno cerámico"],
    responsiblePerson: "Prof. Arte Lucía Ramírez",
  },

  // Complejo Deportivo
  {
    id: "gimnasio",
    name: "Gimnasio Principal",
    type: "gimnasio",
    floor: 1,
    building: "deportivo",
    coordinates: { x: 50, y: 60 },
    capacity: 200,
    riskLevel: "low",
    equipment: ["Equipos deportivos", "Sistema de sonido", "Marcador electrónico"],
    responsiblePerson: "Prof. Ed. Física Carlos Mendoza",
  },
  {
    id: "camarines-hombres",
    name: "Camarines Hombres",
    type: "baño",
    floor: 1,
    building: "deportivo",
    coordinates: { x: 30, y: 30 },
    capacity: 40,
    riskLevel: "low",
  },
  {
    id: "camarines-mujeres",
    name: "Camarines Mujeres",
    type: "baño",
    floor: 1,
    building: "deportivo",
    coordinates: { x: 70, y: 30 },
    capacity: 40,
    riskLevel: "low",
  },
  {
    id: "oficina-deportes",
    name: "Oficina de Deportes",
    type: "oficina",
    floor: 1,
    building: "deportivo",
    coordinates: { x: 20, y: 70 },
    capacity: 5,
    riskLevel: "low",
    responsiblePerson: "Coord. Deportes Fernando Silva",
  },

  // Áreas exteriores
  {
    id: "cancha-futbol",
    name: "Cancha de Fútbol",
    type: "patio",
    floor: 1,
    building: "principal",
    coordinates: { x: 150, y: 50 },
    capacity: 300,
    riskLevel: "low",
    assemblyPoint: true,
  },
  {
    id: "estacionamiento",
    name: "Estacionamiento Principal",
    type: "estacionamiento",
    floor: 1,
    building: "principal",
    coordinates: { x: 20, y: 120 },
    capacity: 50,
    riskLevel: "low",
  },
  {
    id: "entrada-principal",
    name: "Entrada Principal",
    type: "entrada",
    floor: 1,
    building: "principal",
    coordinates: { x: 50, y: 95 },
    riskLevel: "low",
    emergencyExit: true,
  },
]

export const locationTypes = {
  aula: { label: "Aula", icon: "🏫", color: "bg-blue-100 text-blue-800" },
  laboratorio: { label: "Laboratorio", icon: "🧪", color: "bg-purple-100 text-purple-800" },
  oficina: { label: "Oficina", icon: "🏢", color: "bg-gray-100 text-gray-800" },
  patio: { label: "Patio", icon: "🌳", color: "bg-green-100 text-green-800" },
  baño: { label: "Baño", icon: "🚻", color: "bg-cyan-100 text-cyan-800" },
  biblioteca: { label: "Biblioteca", icon: "📚", color: "bg-amber-100 text-amber-800" },
  gimnasio: { label: "Gimnasio", icon: "🏃‍♂️", color: "bg-orange-100 text-orange-800" },
  cocina: { label: "Cocina", icon: "🍳", color: "bg-red-100 text-red-800" },
  enfermeria: { label: "Enfermería", icon: "🏥", color: "bg-pink-100 text-pink-800" },
  auditorio: { label: "Auditorio", icon: "🎭", color: "bg-indigo-100 text-indigo-800" },
  escalera: { label: "Escalera", icon: "🪜", color: "bg-slate-100 text-slate-800" },
  pasillo: { label: "Pasillo", icon: "🚶‍♂️", color: "bg-neutral-100 text-neutral-800" },
  entrada: { label: "Entrada", icon: "🚪", color: "bg-emerald-100 text-emerald-800" },
  estacionamiento: { label: "Estacionamiento", icon: "🚗", color: "bg-stone-100 text-stone-800" },
}

export const riskLevels = {
  low: { label: "Bajo", color: "bg-green-100 text-green-800", description: "Riesgo mínimo" },
  medium: { label: "Medio", color: "bg-yellow-100 text-yellow-800", description: "Riesgo moderado" },
  high: { label: "Alto", color: "bg-red-100 text-red-800", description: "Riesgo elevado" },
}

export function getLocationById(id: string): SchoolLocation | undefined {
  return schoolLocations.find((location) => location.id === id)
}

export function getLocationsByBuilding(buildingId: string): SchoolLocation[] {
  return schoolLocations.filter((location) => location.building === buildingId)
}

export function getLocationsByFloor(buildingId: string, floor: number): SchoolLocation[] {
  return schoolLocations.filter((location) => location.building === buildingId && location.floor === floor)
}

export function getLocationsByType(type: SchoolLocation["type"]): SchoolLocation[] {
  return schoolLocations.filter((location) => location.type === type)
}

export function getAssemblyPoints(): SchoolLocation[] {
  return schoolLocations.filter((location) => location.assemblyPoint)
}

export function getEmergencyExits(): SchoolLocation[] {
  return schoolLocations.filter((location) => location.emergencyExit)
}

export function getNearbyLocations(location: SchoolLocation, radius = 20): SchoolLocation[] {
  return schoolLocations.filter((loc) => {
    if (loc.id === location.id || loc.building !== location.building || loc.floor !== location.floor) {
      return false
    }

    const distance = Math.sqrt(
      Math.pow(loc.coordinates.x - location.coordinates.x, 2) + Math.pow(loc.coordinates.y - location.coordinates.y, 2),
    )

    return distance <= radius
  })
}

export function getEvacuationRoute(fromLocation: SchoolLocation): SchoolLocation[] {
  const building = schoolBuildings.find((b) => b.id === fromLocation.building)
  if (!building) return []

  // Find nearest emergency exit on the same floor
  const sameFloorExits = building.emergencyExits.filter((exit) => exit.floor === fromLocation.floor)

  if (sameFloorExits.length === 0) {
    // If no exits on same floor, find stairs to go down
    const stairs = schoolLocations.filter(
      (loc) => loc.building === fromLocation.building && loc.type === "escalera" && loc.floor === fromLocation.floor,
    )
    return stairs
  }

  // Return path to nearest exit (simplified)
  return []
}
