"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Search, Filter } from "lucide-react"
import { type IncidentReport, severityLevels } from "@/lib/incident-reports"
import { useAuth } from "@/contexts/auth-context"

interface IncidentReportsListProps {
  reports: IncidentReport[]
  onViewReport?: (report: IncidentReport) => void
  onEditReport?: (report: IncidentReport) => void
  onExportReport?: (report: IncidentReport) => void
}

const statusLabels = {
  draft: { label: "Borrador", color: "bg-gray-100 text-gray-800" },
  completed: { label: "Completado", color: "bg-blue-100 text-blue-800" },
  reviewed: { label: "Revisado", color: "bg-green-100 text-green-800" },
  archived: { label: "Archivado", color: "bg-purple-100 text-purple-800" },
}

const typeLabels = {
  incendio: { label: "Incendio", icon: "🔥" },
  sismo: { label: "Sismo", icon: "🌍" },
  medica: { label: "Médica", icon: "🚑" },
  intruso: { label: "Intruso", icon: "🚨" },
}

export default function IncidentReportsList({
  reports,
  onViewReport,
  onEditReport,
  onExportReport,
}: IncidentReportsListProps) {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.basicInfo.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.basicInfo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesType = typeFilter === "all" || report.type === typeFilter
    const matchesSeverity = severityFilter === "all" || report.basicInfo.severity === severityFilter

    return matchesSearch && matchesStatus && matchesType && matchesSeverity
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes de Incidentes</h2>
          <p className="text-gray-600">Gestione y revise los reportes de emergencias</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredReports.length} de {reports.length} reportes
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar reportes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(statusLabels).map(([key, status]) => (
                  <SelectItem key={key} value={key}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {Object.entries(typeLabels).map(([key, type]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      {type.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las severidades</SelectItem>
                {Object.entries(severityLevels).map(([key, level]) => (
                  <SelectItem key={key} value={key}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setTypeFilter("all")
                setSeverityFilter("all")
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Reportes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No se encontraron reportes</p>
              <p className="text-sm">Ajuste los filtros para ver más resultados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Reportado por</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    \
