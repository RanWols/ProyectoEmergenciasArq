"use client"

export interface ProtocolAction {
  id: string
  title: string
  description: string
  priority: "immediate" | "urgent" | "important" | "secondary"
  responsible: string[]
  estimatedTime: string
  icon: string
}

export interface EmergencyProtocol {
  type: "incendio" | "sismo" | "medica" | "intruso"
  title: string
  description: string
  immediateActions: ProtocolAction[]
  followUpActions: ProtocolAction[]
  evacuationRequired: boolean
  emergencyContacts: string[]
}

export const emergencyProtocols: Record<string, EmergencyProtocol> = {
  incendio: {
    type: "incendio",
    title: "Protocolo de Incendio",
    description: "Procedimientos para emergencias de incendio en el establecimiento",
    immediateActions: [
      {
        id: "fire-001",
        title: "Activar Alarma de Incendio",
        description: "Activar inmediatamente la alarma general de incendio en todo el establecimiento",
        priority: "immediate",
        responsible: ["coordinador", "inspector"],
        estimatedTime: "1 min",
        icon: "🚨",
      },
      {
        id: "fire-002",
        title: "Llamar a Bomberos",
        description: "Contactar inmediatamente al Cuerpo de Bomberos (132) y proporcionar ubicación exacta",
        priority: "immediate",
        responsible: ["administrador", "coordinador"],
        estimatedTime: "2 min",
        icon: "📞",
      },
      {
        id: "fire-003",
        title: "Evacuar Zona Afectada",
        description: "Evacuar inmediatamente a todas las personas de la zona afectada y áreas adyacentes",
        priority: "immediate",
        responsible: ["inspector", "docente"],
        estimatedTime: "3-5 min",
        icon: "🏃‍♂️",
      },
      {
        id: "fire-004",
        title: "Cortar Suministros",
        description: "Cortar suministro eléctrico y de gas en la zona afectada si es seguro hacerlo",
        priority: "urgent",
        responsible: ["coordinador"],
        estimatedTime: "2-3 min",
        icon: "⚡",
      },
    ],
    followUpActions: [
      {
        id: "fire-005",
        title: "Punto de Encuentro",
        description: "Dirigir a todas las personas al punto de encuentro designado (Patio Principal)",
        priority: "urgent",
        responsible: ["inspector", "docente"],
        estimatedTime: "5-10 min",
        icon: "📍",
      },
      {
        id: "fire-006",
        title: "Lista de Asistencia",
        description: "Realizar conteo de personas y verificar que todos estén presentes",
        priority: "important",
        responsible: ["docente", "inspector"],
        estimatedTime: "10-15 min",
        icon: "📋",
      },
      {
        id: "fire-007",
        title: "Contactar Apoderados",
        description: "Informar a los apoderados sobre la situación y procedimientos de retiro",
        priority: "important",
        responsible: ["administrador"],
        estimatedTime: "15-30 min",
        icon: "👨‍👩‍👧‍👦",
      },
    ],
    evacuationRequired: true,
    emergencyContacts: ["Bomberos: 132", "Ambulancia: 131", "Carabineros: 133"],
  },
  sismo: {
    type: "sismo",
    title: "Protocolo de Sismo",
    description: "Procedimientos para emergencias sísmicas",
    immediateActions: [
      {
        id: "earthquake-001",
        title: "Protegerse Inmediatamente",
        description: "Agacharse, cubrirse y mantenerse firme. Buscar refugio bajo escritorios o marcos de puertas",
        priority: "immediate",
        responsible: ["docente", "inspector"],
        estimatedTime: "30 seg",
        icon: "🛡️",
      },
      {
        id: "earthquake-002",
        title: "Mantener la Calma",
        description: "Tranquilizar a los estudiantes y evitar el pánico. No correr durante el movimiento",
        priority: "immediate",
        responsible: ["docente"],
        estimatedTime: "Durante sismo",
        icon: "🤝",
      },
      {
        id: "earthquake-003",
        title: "Alejarse de Ventanas",
        description: "Mantener a todos alejados de ventanas, espejos y objetos que puedan caer",
        priority: "immediate",
        responsible: ["docente", "inspector"],
        estimatedTime: "30 seg",
        icon: "🪟",
      },
    ],
    followUpActions: [
      {
        id: "earthquake-004",
        title: "Evaluar Daños",
        description: "Una vez terminado el sismo, evaluar daños estructurales y riesgos",
        priority: "urgent",
        responsible: ["coordinador", "administrador"],
        estimatedTime: "5-10 min",
        icon: "🔍",
      },
      {
        id: "earthquake-005",
        title: "Evacuar si es Necesario",
        description: "Si hay daños estructurales, proceder con evacuación ordenada",
        priority: "urgent",
        responsible: ["coordinador", "inspector"],
        estimatedTime: "10-15 min",
        icon: "🚪",
      },
      {
        id: "earthquake-006",
        title: "Verificar Heridos",
        description: "Revisar si hay personas heridas y proporcionar primeros auxilios",
        priority: "important",
        responsible: ["inspector", "docente"],
        estimatedTime: "10-20 min",
        icon: "🩹",
      },
    ],
    evacuationRequired: false,
    emergencyContacts: ["Ambulancia: 131", "Carabineros: 133", "ONEMI: 1332"],
  },
  medica: {
    type: "medica",
    title: "Protocolo de Emergencia Médica",
    description: "Procedimientos para emergencias médicas",
    immediateActions: [
      {
        id: "medical-001",
        title: "Evaluar la Situación",
        description: "Evaluar el estado de la persona afectada y determinar la gravedad",
        priority: "immediate",
        responsible: ["inspector", "docente"],
        estimatedTime: "1-2 min",
        icon: "🔍",
      },
      {
        id: "medical-002",
        title: "Llamar Ambulancia",
        description: "Si es grave, llamar inmediatamente a ambulancia (131)",
        priority: "immediate",
        responsible: ["administrador", "coordinador"],
        estimatedTime: "2 min",
        icon: "🚑",
      },
      {
        id: "medical-003",
        title: "Primeros Auxilios",
        description: "Aplicar primeros auxilios básicos según la situación",
        priority: "immediate",
        responsible: ["inspector"],
        estimatedTime: "Variable",
        icon: "🩹",
      },
      {
        id: "medical-004",
        title: "Aislar el Área",
        description: "Mantener despejada el área alrededor de la persona afectada",
        priority: "urgent",
        responsible: ["docente", "inspector"],
        estimatedTime: "2-3 min",
        icon: "🚧",
      },
    ],
    followUpActions: [
      {
        id: "medical-005",
        title: "Contactar Apoderados",
        description: "Informar inmediatamente a los padres o apoderados de la situación",
        priority: "urgent",
        responsible: ["administrador"],
        estimatedTime: "5-10 min",
        icon: "📞",
      },
      {
        id: "medical-006",
        title: "Acompañar al Hospital",
        description: "Si es necesario traslado, designar personal para acompañar",
        priority: "important",
        responsible: ["inspector", "administrador"],
        estimatedTime: "Variable",
        icon: "🏥",
      },
      {
        id: "medical-007",
        title: "Documentar Incidente",
        description: "Registrar todos los detalles del incidente para el reporte",
        priority: "secondary",
        responsible: ["administrador"],
        estimatedTime: "30 min",
        icon: "📝",
      },
    ],
    evacuationRequired: false,
    emergencyContacts: ["Ambulancia: 131", "Hospital Regional: +56-XX-XXXXXXX"],
  },
  intruso: {
    type: "intruso",
    title: "Protocolo de Intruso",
    description: "Procedimientos para situaciones de intruso en el establecimiento",
    immediateActions: [
      {
        id: "intruder-001",
        title: "Activar Código de Seguridad",
        description: "Activar inmediatamente el código de seguridad interno",
        priority: "immediate",
        responsible: ["coordinador", "administrador"],
        estimatedTime: "30 seg",
        icon: "🔒",
      },
      {
        id: "intruder-002",
        title: "Llamar a Carabineros",
        description: "Contactar inmediatamente a Carabineros (133)",
        priority: "immediate",
        responsible: ["administrador", "coordinador"],
        estimatedTime: "1 min",
        icon: "👮‍♂️",
      },
      {
        id: "intruder-003",
        title: "Cerrar Aulas",
        description: "Cerrar y asegurar todas las aulas con estudiantes en su interior",
        priority: "immediate",
        responsible: ["docente", "inspector"],
        estimatedTime: "1-2 min",
        icon: "🚪",
      },
      {
        id: "intruder-004",
        title: "Mantener Silencio",
        description: "Instruir a todos a mantener silencio y permanecer ocultos",
        priority: "immediate",
        responsible: ["docente"],
        estimatedTime: "Continuo",
        icon: "🤫",
      },
    ],
    followUpActions: [
      {
        id: "intruder-005",
        title: "Monitorear Situación",
        description: "Mantener comunicación con autoridades y monitorear la situación",
        priority: "urgent",
        responsible: ["coordinador", "administrador"],
        estimatedTime: "Variable",
        icon: "📡",
      },
      {
        id: "intruder-006",
        title: "Esperar Autorización",
        description: "No salir de las aulas hasta recibir autorización de las autoridades",
        priority: "important",
        responsible: ["docente"],
        estimatedTime: "Variable",
        icon: "⏳",
      },
      {
        id: "intruder-007",
        title: "Informar a Apoderados",
        description: "Una vez seguro, informar a los apoderados sobre la situación",
        priority: "important",
        responsible: ["administrador"],
        estimatedTime: "30-60 min",
        icon: "📢",
      },
    ],
    evacuationRequired: false,
    emergencyContacts: ["Carabineros: 133", "PDI: 134"],
  },
}

export function getProtocolForAlert(alertType: "incendio" | "sismo" | "medica" | "intruso"): EmergencyProtocol {
  return emergencyProtocols[alertType]
}

export function getActionsForRole(
  protocol: EmergencyProtocol,
  userRole: "administrador" | "coordinador" | "inspector" | "docente",
): ProtocolAction[] {
  const allActions = [...protocol.immediateActions, ...protocol.followUpActions]
  return allActions.filter((action) => action.responsible.includes(userRole))
}

export function getPriorityColor(priority: ProtocolAction["priority"]): string {
  switch (priority) {
    case "immediate":
      return "bg-red-100 border-red-500 text-red-800"
    case "urgent":
      return "bg-orange-100 border-orange-500 text-orange-800"
    case "important":
      return "bg-yellow-100 border-yellow-500 text-yellow-800"
    case "secondary":
      return "bg-blue-100 border-blue-500 text-blue-800"
    default:
      return "bg-gray-100 border-gray-500 text-gray-800"
  }
}

export function getPriorityLabel(priority: ProtocolAction["priority"]): string {
  switch (priority) {
    case "immediate":
      return "INMEDIATO"
    case "urgent":
      return "URGENTE"
    case "important":
      return "IMPORTANTE"
    case "secondary":
      return "SECUNDARIO"
    default:
      return "NORMAL"
  }
}
