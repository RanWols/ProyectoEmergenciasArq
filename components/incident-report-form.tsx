"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, Save, Send, FileText, Users, Shield, DollarSign, Clock, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  type IncidentReport,
  type FireIncidentData,
  type EarthquakeIncidentData,
  type MedicalIncidentData,
  type IntruderIncidentData,
  incidentReportTemplates,
  severityLevels,
  emergencyServices,
} from "@/lib/incident-reports"

interface IncidentReportFormProps {
  alertId: string
  alertType: "incendio" | "sismo" | "medica" | "intruso"
  alertLocation: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (report: IncidentReport) => void
}

export default function IncidentReportForm({
  alertId,
  alertType,
  alertLocation,
  isOpen,
  onOpenChange,
  onSave,
}: IncidentReportFormProps) {
  const { user } = useAuth()
  const [currentTab, setCurrentTab] = useState("basic")
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const [report, setReport] = useState<IncidentReport>({
    id: "",
    alertId,
    type: alertType,
    reportedBy: user?.name || "",
    reportedAt: new Date(),
    status: "draft",
    basicInfo: {
      incidentDate: new Date(),
      incidentTime: new Date().toTimeString().slice(0, 5),
      location: alertLocation,
      description: "",
      severity: "medium",
      weatherConditions: "",
    },
    peopleInvolved: {
      studentsAffected: 0,
      staffAffected: 0,
      visitorsAffected: 0,
      injuries: [],
      witnesses: [],
    },
    responseActions: {
      emergencyServicesContacted: [],
      evacuationPerformed: false,
      protocolsFollowed: [],
      additionalActions: [],
    },
    damageAssessment: {
      propertyDamage: false,
      equipmentAffected: [],
      facilitiesAffected: [],
    },
    specificData: getInitialSpecificData(alertType),
    followUp: {
      parentalNotification: false,
      mediaInvolvement: false,
      insuranceClaim: false,
      legalAction: false,
      preventiveMeasures: [],
      recommendations: [],
    },
    attachments: [],
    review: {
      approved: false,
    },
  })

  function getInitialSpecificData(
    type: "incendio" | "sismo" | "medica" | "intruso",
  ): FireIncidentData | EarthquakeIncidentData | MedicalIncidentData | IntruderIncidentData {
    switch (type) {
      case "incendio":
        return {
          fireSpread: "contained",
          smokeDetection: false,
          sprinklerActivation: false,
          fireExtinguisherUsed: false,
          buildingEvacuation: false,
          fireServiceResponse: "",
        } as FireIncidentData
      case "sismo":
        return {
          structuralDamage: false,
          aftershocks: false,
          utilityDisruption: [],
          buildingInspection: false,
        } as EarthquakeIncidentData
      case "medica":
        return {
          medicalCondition: "",
          firstAidProvided: false,
          firstAidProvider: "",
          ambulanceRequired: false,
          parentalConsent: false,
          medicationInvolved: false,
          preExistingCondition: false,
        } as MedicalIncidentData
      case "intruso":
        return {
          intruderDescription: "",
          intruderLocation: [],
          lockdownInitiated: false,
          policeResponse: "",
          intruderApprehended: false,
          weaponsInvolved: false,
          threatsIssued: false,
        } as IntruderIncidentData
    }
  }

  const updateReport = (section: keyof IncidentReport, data: any) => {
    setReport((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }

  const addInjury = () => {
    const newInjury = {
      personName: "",
      personType: "student" as const,
      injuryType: "",
      injurySeverity: "minor" as const,
      medicalAttention: false,
      hospitalTransport: false,
    }
    updateReport("peopleInvolved", {
      injuries: [...report.peopleInvolved.injuries, newInjury],
    })
  }

  const updateInjury = (index: number, data: any) => {
    const updatedInjuries = [...report.peopleInvolved.injuries]
    updatedInjuries[index] = { ...updatedInjuries[index], ...data }
    updateReport("peopleInvolved", { injuries: updatedInjuries })
  }

  const removeInjury = (index: number) => {
    const updatedInjuries = report.peopleInvolved.injuries.filter((_, i) => i !== index)
    updateReport("peopleInvolved", { injuries: updatedInjuries })
  }

  const addWitness = () => {
    const newWitness = { name: "", contact: "", statement: "" }
    updateReport("peopleInvolved", {
      witnesses: [...report.peopleInvolved.witnesses, newWitness],
    })
  }

  const updateWitness = (index: number, data: any) => {
    const updatedWitnesses = [...report.peopleInvolved.witnesses]
    updatedWitnesses[index] = { ...updatedWitnesses[index], ...data }
    updateReport("peopleInvolved", { witnesses: updatedWitnesses })
  }

  const removeWitness = (index: number) => {
    const updatedWitnesses = report.peopleInvolved.witnesses.filter((_, i) => i !== index)
    updateReport("peopleInvolved", { witnesses: updatedWitnesses })
  }

  const addEmergencyService = () => {
    const newService = {
      service: "bomberos" as const,
      contactTime: "",
      responseDetails: "",
    }
    updateReport("responseActions", {
      emergencyServicesContacted: [...report.responseActions.emergencyServicesContacted, newService],
    })
  }

  const updateEmergencyService = (index: number, data: any) => {
    const updatedServices = [...report.responseActions.emergencyServicesContacted]
    updatedServices[index] = { ...updatedServices[index], ...data }
    updateReport("responseActions", { emergencyServicesContacted: updatedServices })
  }

  const removeEmergencyService = (index: number) => {
    const updatedServices = report.responseActions.emergencyServicesContacted.filter((_, i) => i !== index)
    updateReport("responseActions", { emergencyServicesContacted: updatedServices })
  }

  const validateReport = (): string[] => {
    const errors: string[] = []

    if (!report.basicInfo.description.trim()) {
      errors.push("La descripción del incidente es obligatoria")
    }

    if (!report.basicInfo.location.trim()) {
      errors.push("La ubicación del incidente es obligatoria")
    }

    if (report.peopleInvolved.injuries.some((injury) => !injury.personName.trim())) {
      errors.push("Todos los heridos deben tener nombre completo")
    }

    if (report.responseActions.emergencyServicesContacted.some((service) => !service.contactTime)) {
      errors.push("Todos los servicios de emergencia deben tener hora de contacto")
    }

    return errors
  }

  const handleSave = async (status: "draft" | "completed") => {
    setIsSaving(true)
    const errors = validateReport()

    if (status === "completed" && errors.length > 0) {
      setValidationErrors(errors)
      setIsSaving(false)
      return
    }

    setValidationErrors([])

    const finalReport: IncidentReport = {
      ...report,
      id: report.id || Date.now().toString(),
      status,
      completedAt: status === "completed" ? new Date() : undefined,
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSave?.(finalReport)
    setIsSaving(false)

    if (status === "completed") {
      onOpenChange(false)
    }
  }

  const template = incidentReportTemplates[alertType]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {template.title}
          </DialogTitle>
        </DialogHeader>

        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Errores de validación:</p>
                <ul className="list-disc list-inside text-sm">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[70vh]">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Secciones del Reporte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={currentTab === "basic" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setCurrentTab("basic")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Información Básica
                  </Button>
                  <Button
                    variant={currentTab === "people" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setCurrentTab("people")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Personas Involucradas
                  </Button>
                  <Button
                    variant={currentTab === "response" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setCurrentTab("response")}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Acciones de Respuesta
                  </Button>
                  <Button
                    variant={currentTab === "damage" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setCurrentTab("damage")}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Evaluación de Daños
                  </Button>
                  <Button
                    variant={currentTab === "specific" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setCurrentTab("specific")}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Datos Específicos
                  </Button>
                  <Button
                    variant={currentTab === "followup" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setCurrentTab("followup")}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Seguimiento
                  </Button>
                </div>

                <div className="mt-6 pt-4 border-t space-y-2">
                  <Button
                    onClick={() => handleSave("draft")}
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Guardando..." : "Guardar Borrador"}
                  </Button>
                  <Button onClick={() => handleSave("completed")} size="sm" className="w-full" disabled={isSaving}>
                    <Send className="h-4 w-4 mr-2" />
                    {isSaving ? "Enviando..." : "Completar Reporte"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <ScrollArea className="h-full">
              <div className="space-y-6 pr-4">
                {/* Basic Information */}
                {currentTab === "basic" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Información Básica del Incidente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="incident-date">Fecha del Incidente</Label>
                          <Input
                            id="incident-date"
                            type="date"
                            value={report.basicInfo.incidentDate.toISOString().split("T")[0]}
                            onChange={(e) => updateReport("basicInfo", { incidentDate: new Date(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="incident-time">Hora del Incidente</Label>
                          <Input
                            id="incident-time"
                            type="time"
                            value={report.basicInfo.incidentTime}
                            onChange={(e) => updateReport("basicInfo", { incidentTime: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="location">Ubicación Específica</Label>
                        <Input
                          id="location"
                          value={report.basicInfo.location}
                          onChange={(e) => updateReport("basicInfo", { location: e.target.value })}
                          placeholder="Ej: Sala 201, Piso 2, Ala Norte"
                        />
                      </div>

                      <div>
                        <Label htmlFor="severity">Nivel de Severidad</Label>
                        <Select
                          value={report.basicInfo.severity}
                          onValueChange={(value) => updateReport("basicInfo", { severity: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(severityLevels).map(([key, level]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <Badge className={level.color}>{level.label}</Badge>
                                  <span className="text-sm">{level.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="description">Descripción Detallada del Incidente</Label>
                        <Textarea
                          id="description"
                          value={report.basicInfo.description}
                          onChange={(e) => updateReport("basicInfo", { description: e.target.value })}
                          placeholder="Describa en detalle qué ocurrió, cómo se desarrolló el incidente, y cualquier información relevante..."
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="weather">Condiciones Climáticas (si es relevante)</Label>
                        <Input
                          id="weather"
                          value={report.basicInfo.weatherConditions || ""}
                          onChange={(e) => updateReport("basicInfo", { weatherConditions: e.target.value })}
                          placeholder="Ej: Soleado, Lluvia intensa, Viento fuerte"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* People Involved */}
                {currentTab === "people" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personas Afectadas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="students-affected">Estudiantes Afectados</Label>
                            <Input
                              id="students-affected"
                              type="number"
                              min="0"
                              value={report.peopleInvolved.studentsAffected}
                              onChange={(e) =>
                                updateReport("peopleInvolved", {
                                  studentsAffected: Number.parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="staff-affected">Personal Afectado</Label>
                            <Input
                              id="staff-affected"
                              type="number"
                              min="0"
                              value={report.peopleInvolved.staffAffected}
                              onChange={(e) =>
                                updateReport("peopleInvolved", { staffAffected: Number.parseInt(e.target.value) || 0 })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="visitors-affected">Visitantes Afectados</Label>
                            <Input
                              id="visitors-affected"
                              type="number"
                              min="0"
                              value={report.peopleInvolved.visitorsAffected}
                              onChange={(e) =>
                                updateReport("peopleInvolved", {
                                  visitorsAffected: Number.parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Heridos y Lesiones</CardTitle>
                          <Button onClick={addInjury} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Herido
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {report.peopleInvolved.injuries.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No se han registrado heridos</p>
                        ) : (
                          <div className="space-y-4">
                            {report.peopleInvolved.injuries.map((injury, index) => (
                              <Card key={index} className="border-l-4 border-orange-500">
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between mb-4">
                                    <h4 className="font-medium">Herido #{index + 1}</h4>
                                    <Button
                                      onClick={() => removeInjury(index)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label>Nombre Completo</Label>
                                      <Input
                                        value={injury.personName}
                                        onChange={(e) => updateInjury(index, { personName: e.target.value })}
                                        placeholder="Nombre y apellido"
                                      />
                                    </div>
                                    <div>
                                      <Label>Tipo de Persona</Label>
                                      <Select
                                        value={injury.personType}
                                        onValueChange={(value) => updateInjury(index, { personType: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="student">Estudiante</SelectItem>
                                          <SelectItem value="staff">Personal</SelectItem>
                                          <SelectItem value="visitor">Visitante</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Tipo de Lesión</Label>
                                      <Input
                                        value={injury.injuryType}
                                        onChange={(e) => updateInjury(index, { injuryType: e.target.value })}
                                        placeholder="Ej: Corte, Quemadura, Fractura"
                                      />
                                    </div>
                                    <div>
                                      <Label>Severidad de la Lesión</Label>
                                      <Select
                                        value={injury.injurySeverity}
                                        onValueChange={(value) => updateInjury(index, { injurySeverity: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="minor">Menor</SelectItem>
                                          <SelectItem value="moderate">Moderada</SelectItem>
                                          <SelectItem value="severe">Grave</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`medical-attention-${index}`}
                                        checked={injury.medicalAttention}
                                        onCheckedChange={(checked) =>
                                          updateInjury(index, { medicalAttention: checked })
                                        }
                                      />
                                      <Label htmlFor={`medical-attention-${index}`}>Recibió atención médica</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`hospital-transport-${index}`}
                                        checked={injury.hospitalTransport}
                                        onCheckedChange={(checked) =>
                                          updateInjury(index, { hospitalTransport: checked })
                                        }
                                      />
                                      <Label htmlFor={`hospital-transport-${index}`}>Trasladado al hospital</Label>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Testigos</CardTitle>
                          <Button onClick={addWitness} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Testigo
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {report.peopleInvolved.witnesses.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No se han registrado testigos</p>
                        ) : (
                          <div className="space-y-4">
                            {report.peopleInvolved.witnesses.map((witness, index) => (
                              <Card key={index} className="border-l-4 border-blue-500">
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between mb-4">
                                    <h4 className="font-medium">Testigo #{index + 1}</h4>
                                    <Button
                                      onClick={() => removeWitness(index)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <Label>Nombre Completo</Label>
                                      <Input
                                        value={witness.name}
                                        onChange={(e) => updateWitness(index, { name: e.target.value })}
                                        placeholder="Nombre y apellido"
                                      />
                                    </div>
                                    <div>
                                      <Label>Contacto</Label>
                                      <Input
                                        value={witness.contact}
                                        onChange={(e) => updateWitness(index, { contact: e.target.value })}
                                        placeholder="Teléfono o email"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Declaración del Testigo</Label>
                                    <Textarea
                                      value={witness.statement}
                                      onChange={(e) => updateWitness(index, { statement: e.target.value })}
                                      placeholder="Describa lo que el testigo vio o experimentó..."
                                      rows={3}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Response Actions */}
                {currentTab === "response" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Servicios de Emergencia Contactados</CardTitle>
                          <Button onClick={addEmergencyService} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Servicio
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {report.responseActions.emergencyServicesContacted.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No se han contactado servicios de emergencia</p>
                        ) : (
                          <div className="space-y-4">
                            {report.responseActions.emergencyServicesContacted.map((service, index) => (
                              <Card key={index} className="border-l-4 border-green-500">
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between mb-4">
                                    <h4 className="font-medium">Servicio #{index + 1}</h4>
                                    <Button
                                      onClick={() => removeEmergencyService(index)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <Label>Servicio de Emergencia</Label>
                                      <Select
                                        value={service.service}
                                        onValueChange={(value) => updateEmergencyService(index, { service: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Object.entries(emergencyServices).map(([key, serviceInfo]) => (
                                            <SelectItem key={key} value={key}>
                                              {serviceInfo.label} ({serviceInfo.phone})
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Hora de Contacto</Label>
                                      <Input
                                        type="time"
                                        value={service.contactTime}
                                        onChange={(e) => updateEmergencyService(index, { contactTime: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label>Hora de Llegada</Label>
                                      <Input
                                        type="time"
                                        value={service.arrivalTime || ""}
                                        onChange={(e) => updateEmergencyService(index, { arrivalTime: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div className="mt-4">
                                    <Label>Detalles de la Respuesta</Label>
                                    <Textarea
                                      value={service.responseDetails}
                                      onChange={(e) =>
                                        updateEmergencyService(index, { responseDetails: e.target.value })
                                      }
                                      placeholder="Describa la respuesta del servicio de emergencia..."
                                      rows={2}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Evacuación</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="evacuation-performed"
                            checked={report.responseActions.evacuationPerformed}
                            onCheckedChange={(checked) =>
                              updateReport("responseActions", { evacuationPerformed: checked })
                            }
                          />
                          <Label htmlFor="evacuation-performed">Se realizó evacuación</Label>
                        </div>

                        {report.responseActions.evacuationPerformed && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="evacuation-time">Tiempo de Evacuación</Label>
                              <Input
                                id="evacuation-time"
                                value={report.responseActions.evacuationTime || ""}
                                onChange={(e) => updateReport("responseActions", { evacuationTime: e.target.value })}
                                placeholder="Ej: 5 minutos"
                              />
                            </div>
                            <div>
                              <Label htmlFor="evacuation-route">Ruta de Evacuación</Label>
                              <Input
                                id="evacuation-route"
                                value={report.responseActions.evacuationRoute || ""}
                                onChange={(e) => updateReport("responseActions", { evacuationRoute: e.target.value })}
                                placeholder="Ej: Salida principal, escalera de emergencia"
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Damage Assessment */}
                {currentTab === "damage" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Evaluación de Daños</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="property-damage"
                          checked={report.damageAssessment.propertyDamage}
                          onCheckedChange={(checked) => updateReport("damageAssessment", { propertyDamage: checked })}
                        />
                        <Label htmlFor="property-damage">Hubo daños a la propiedad</Label>
                      </div>

                      {report.damageAssessment.propertyDamage && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="damage-description">Descripción de los Daños</Label>
                            <Textarea
                              id="damage-description"
                              value={report.damageAssessment.damageDescription || ""}
                              onChange={(e) => updateReport("damageAssessment", { damageDescription: e.target.value })}
                              placeholder="Describa en detalle los daños ocurridos..."
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label htmlFor="estimated-cost">Costo Estimado de Reparación (CLP)</Label>
                            <Input
                              id="estimated-cost"
                              type="number"
                              min="0"
                              value={report.damageAssessment.estimatedCost || ""}
                              onChange={(e) =>
                                updateReport("damageAssessment", {
                                  estimatedCost: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <Label htmlFor="equipment-affected">Equipos Afectados</Label>
                            <Textarea
                              id="equipment-affected"
                              value={report.damageAssessment.equipmentAffected.join(", ")}
                              onChange={(e) =>
                                updateReport("damageAssessment", {
                                  equipmentAffected: e.target.value.split(",").map((item) => item.trim()),
                                })
                              }
                              placeholder="Ej: Computadores, Proyector, Mobiliario (separar con comas)"
                              rows={2}
                            />
                          </div>

                          <div>
                            <Label htmlFor="facilities-affected">Instalaciones Afectadas</Label>
                            <Textarea
                              id="facilities-affected"
                              value={report.damageAssessment.facilitiesAffected.join(", ")}
                              onChange={(e) =>
                                updateReport("damageAssessment", {
                                  facilitiesAffected: e.target.value.split(",").map((item) => item.trim()),
                                })
                              }
                              placeholder="Ej: Aulas, Laboratorio, Biblioteca (separar con comas)"
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Type-specific Data */}
                {currentTab === "specific" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Datos Específicos - {template.title.split(" - ")[1]}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {alertType === "incendio" && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="ignition-source">Fuente de Ignición</Label>
                            <Input
                              id="ignition-source"
                              value={(report.specificData as FireIncidentData).ignitionSource || ""}
                              onChange={(e) =>
                                setReport((prev) => ({
                                  ...prev,
                                  specificData: { ...prev.specificData, ignitionSource: e.target.value },
                                }))
                              }
                              placeholder="Ej: Cortocircuito, Cigarrillo, Equipo defectuoso"
                            />
                          </div>

                          <div>
                            <Label>Propagación del Fuego</Label>
                            <Select
                              value={(report.specificData as FireIncidentData).fireSpread}
                              onValueChange={(value) =>
                                setReport((prev) => ({
                                  ...prev,
                                  specificData: { ...prev.specificData, fireSpread: value },
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="contained">Contenido</SelectItem>
                                <SelectItem value="limited">Limitado</SelectItem>
                                <SelectItem value="extensive">Extenso</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="smoke-detection"
                                checked={(report.specificData as FireIncidentData).smokeDetection}
                                onCheckedChange={(checked) =>
                                  setReport((prev) => ({
                                    ...prev,
                                    specificData: { ...prev.specificData, smokeDetection: checked },
                                  }))
                                }
                              />
                              <Label htmlFor="smoke-detection">Detector de humo activado</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="sprinkler-activation"
                                checked={(report.specificData as FireIncidentData).sprinklerActivation}
                                onCheckedChange={(checked) =>
                                  setReport((prev) => ({
                                    ...prev,
                                    specificData: { ...prev.specificData, sprinklerActivation: checked },
                                  }))
                                }
                              />
                              <Label htmlFor="sprinkler-activation">Sistema de rociadores activado</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="fire-extinguisher-used"
                                checked={(report.specificData as FireIncidentData).fireExtinguisherUsed}
                                onCheckedChange={(checked) =>
                                  setReport((prev) => ({
                                    ...prev,
                                    specificData: { ...prev.specificData, fireExtinguisherUsed: checked },
                                  }))
                                }
                              />
                              <Label htmlFor="fire-extinguisher-used">Extintor utilizado</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="building-evacuation"
                                checked={(report.specificData as FireIncidentData).buildingEvacuation}
                                onCheckedChange={(checked) =>
                                  setReport((prev) => ({
                                    ...prev,
                                    specificData: { ...prev.specificData, buildingEvacuation: checked },
                                  }))
                                }
                              />
                              <Label htmlFor="building-evacuation">Evacuación del edificio</Label>
                            </div>
                          </div>
                        </div>
                      )}

                      {alertType === "medica" && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="medical-condition">Condición Médica</Label>
                            <Input
                              id="medical-condition"
                              value={(report.specificData as MedicalIncidentData).medicalCondition}
                              onChange={(e) =>
                                setReport((prev) => ({
                                  ...prev,
                                  specificData: { ...prev.specificData, medicalCondition: e.target.value },
                                }))
                              }
                              placeholder="Ej: Desmayo, Crisis asmática, Fractura"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="first-aid-provided"
                                checked={(report.specificData as MedicalIncidentData).firstAidProvided}
                                onCheckedChange={(checked) =>
                                  setReport((prev) => ({
                                    ...prev,
                                    specificData: { ...prev.specificData, firstAidProvided: checked },
                                  }))
                                }
                              />
                              <Label htmlFor="first-aid-provided">Se proporcionaron primeros auxilios</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="ambulance-required"
                                checked={(report.specificData as MedicalIncidentData).ambulanceRequired}
                                onCheckedChange={(checked) =>
                                  setReport((prev) => ({
                                    ...prev,
                                    specificData: { ...prev.specificData, ambulanceRequired: checked },
                                  }))
                                }
                              />
                              <Label htmlFor="ambulance-required">Se requirió ambulancia</Label>
                            </div>
                          </div>

                          {(report.specificData as MedicalIncidentData).firstAidProvided && (
                            <div>
                              <Label htmlFor="first-aid-provider">Persona que proporcionó primeros auxilios</Label>
                              <Input
                                id="first-aid-provider"
                                value={(report.specificData as MedicalIncidentData).firstAidProvider}
                                onChange={(e) =>
                                  setReport((prev) => ({
                                    ...prev,
                                    specificData: { ...prev.specificData, firstAidProvider: e.target.value },
                                  }))
                                }
                                placeholder="Nombre completo"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Add similar sections for sismo and intruso types */}
                    </CardContent>
                  </Card>
                )}

                {/* Follow-up */}
                {currentTab === "followup" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Seguimiento y Acciones Posteriores</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="parental-notification"
                            checked={report.followUp.parentalNotification}
                            onCheckedChange={(checked) => updateReport("followUp", { parentalNotification: checked })}
                          />
                          <Label htmlFor="parental-notification">Se notificó a los apoderados</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="media-involvement"
                            checked={report.followUp.mediaInvolvement}
                            onCheckedChange={(checked) => updateReport("followUp", { mediaInvolvement: checked })}
                          />
                          <Label htmlFor="media-involvement">Hubo cobertura mediática</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="insurance-claim"
                            checked={report.followUp.insuranceClaim}
                            onCheckedChange={(checked) => updateReport("followUp", { insuranceClaim: checked })}
                          />
                          <Label htmlFor="insurance-claim">Se hará reclamo al seguro</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="legal-action"
                            checked={report.followUp.legalAction}
                            onCheckedChange={(checked) => updateReport("followUp", { legalAction: checked })}
                          />
                          <Label htmlFor="legal-action">Se requiere acción legal</Label>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="preventive-measures">Medidas Preventivas Recomendadas</Label>
                        <Textarea
                          id="preventive-measures"
                          value={report.followUp.preventiveMeasures.join("\n")}
                          onChange={(e) =>
                            updateReport("followUp", {
                              preventiveMeasures: e.target.value.split("\n").filter((item) => item.trim()),
                            })
                          }
                          placeholder="Una medida por línea..."
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="recommendations">Recomendaciones Generales</Label>
                        <Textarea
                          id="recommendations"
                          value={report.followUp.recommendations.join("\n")}
                          onChange={(e) =>
                            updateReport("followUp", {
                              recommendations: e.target.value.split("\n").filter((item) => item.trim()),
                            })
                          }
                          placeholder="Una recomendación por línea..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
