"use client"

export interface IncidentReport {
  id: string
  alertId: string
  type: "incendio" | "sismo" | "medica" | "intruso"
  reportedBy: string
  reportedAt: Date
  completedAt?: Date
  status: "draft" | "completed" | "reviewed" | "archived"

  // Basic Information
  basicInfo: {
    incidentDate: Date
    incidentTime: string
    location: string
    description: string
    severity: "low" | "medium" | "high" | "critical"
    weatherConditions?: string
  }

  // People Involved
  peopleInvolved: {
    studentsAffected: number
    staffAffected: number
    visitorsAffected: number
    injuries: Array<{
      personName: string
      personType: "student" | "staff" | "visitor"
      injuryType: string
      injurySeverity: "minor" | "moderate" | "severe"
      medicalAttention: boolean
      hospitalTransport: boolean
    }>
    witnesses: Array<{
      name: string
      contact: string
      statement: string
    }>
  }

  // Response Actions
  responseActions: {
    emergencyServicesContacted: Array<{
      service: "bomberos" | "ambulancia" | "carabineros" | "pdi" | "onemi"
      contactTime: string
      arrivalTime?: string
      responseDetails: string
    }>
    evacuationPerformed: boolean
    evacuationTime?: string
    evacuationRoute?: string
    protocolsFollowed: string[]
    additionalActions: string[]
  }

  // Damage Assessment
  damageAssessment: {
    propertyDamage: boolean
    damageDescription?: string
    estimatedCost?: number
    equipmentAffected: string[]
    facilitiesAffected: string[]
    environmentalImpact?: string
  }

  // Type-specific data
  specificData: FireIncidentData | EarthquakeIncidentData | MedicalIncidentData | IntruderIncidentData

  // Follow-up
  followUp: {
    parentalNotification: boolean
    parentalNotificationTime?: string
    mediaInvolvement: boolean
    mediaDetails?: string
    insuranceClaim: boolean
    legalAction: boolean
    preventiveMeasures: string[]
    recommendations: string[]
  }

  // Attachments
  attachments: Array<{
    id: string
    name: string
    type: "photo" | "document" | "video" | "audio"
    url: string
    description: string
  }>

  // Review
  review: {
    reviewedBy?: string
    reviewedAt?: Date
    reviewComments?: string
    approved: boolean
  }
}

export interface FireIncidentData {
  ignitionSource?: string
  fireSpread: "contained" | "limited" | "extensive"
  smokeDetection: boolean
  sprinklerActivation: boolean
  fireExtinguisherUsed: boolean
  buildingEvacuation: boolean
  fireServiceResponse: string
  causeOfFire?: string
}

export interface EarthquakeIncidentData {
  magnitude?: number
  duration?: string
  structuralDamage: boolean
  aftershocks: boolean
  utilityDisruption: string[]
  buildingInspection: boolean
  inspectionResults?: string
}

export interface MedicalIncidentData {
  medicalCondition: string
  firstAidProvided: boolean
  firstAidProvider: string
  ambulanceRequired: boolean
  hospitalName?: string
  parentalConsent: boolean
  medicationInvolved: boolean
  preExistingCondition: boolean
}

export interface IntruderIncidentData {
  intruderDescription: string
  intruderLocation: string[]
  lockdownInitiated: boolean
  lockdownDuration?: string
  policeResponse: string
  intruderApprehended: boolean
  weaponsInvolved: boolean
  threatsIssued: boolean
}

export const incidentReportTemplates = {
  incendio: {
    title: "Reporte de Incidente - Incendio",
    sections: [
      "Información Básica",
      "Personas Involucradas",
      "Acciones de Respuesta",
      "Evaluación de Daños",
      "Datos Específicos del Incendio",
      "Seguimiento",
      "Adjuntos",
    ],
  },
  sismo: {
    title: "Reporte de Incidente - Sismo",
    sections: [
      "Información Básica",
      "Personas Involucradas",
      "Acciones de Respuesta",
      "Evaluación de Daños",
      "Datos Específicos del Sismo",
      "Seguimiento",
      "Adjuntos",
    ],
  },
  medica: {
    title: "Reporte de Incidente - Emergencia Médica",
    sections: [
      "Información Básica",
      "Personas Involucradas",
      "Acciones de Respuesta",
      "Evaluación de Daños",
      "Datos Médicos Específicos",
      "Seguimiento",
      "Adjuntos",
    ],
  },
  intruso: {
    title: "Reporte de Incidente - Intruso",
    sections: [
      "Información Básica",
      "Personas Involucradas",
      "Acciones de Respuesta",
      "Evaluación de Daños",
      "Datos Específicos del Intruso",
      "Seguimiento",
      "Adjuntos",
    ],
  },
}

export const severityLevels = {
  low: { label: "Bajo", color: "bg-green-100 text-green-800", description: "Sin heridos, daños mínimos" },
  medium: { label: "Medio", color: "bg-yellow-100 text-yellow-800", description: "Heridos leves, daños moderados" },
  high: { label: "Alto", color: "bg-orange-100 text-orange-800", description: "Heridos graves, daños significativos" },
  critical: { label: "Crítico", color: "bg-red-100 text-red-800", description: "Heridos críticos, daños extensos" },
}

export const emergencyServices = {
  bomberos: { label: "Bomberos", phone: "132" },
  ambulancia: { label: "Ambulancia", phone: "131" },
  carabineros: { label: "Carabineros", phone: "133" },
  pdi: { label: "PDI", phone: "134" },
  onemi: { label: "ONEMI", phone: "1332" },
}
