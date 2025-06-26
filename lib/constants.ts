"use client"

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

export const schoolBuildings = [
  {
    id: "principal",
    name: "Edificio Principal",
    floors: 3,
    description: "Edificio principal con aulas, oficinas administrativas y biblioteca",
    emergencyExits: [],
    assemblyPoints: [],
  },
  {
    id: "laboratorios",
    name: "Edificio de Laboratorios",
    floors: 2,
    description: "Laboratorios de ciencias, informática y talleres",
    emergencyExits: [],
    assemblyPoints: [],
  },
  {
    id: "deportivo",
    name: "Complejo Deportivo",
    floors: 1,
    description: "Gimnasio, camarines y oficinas deportivas",
    emergencyExits: [],
    assemblyPoints: [],
  },
]
