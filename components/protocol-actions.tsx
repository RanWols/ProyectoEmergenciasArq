"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, Users, Phone, CheckCircle, AlertTriangle, BookOpen } from "lucide-react"
import {
  getProtocolForAlert,
  getActionsForRole,
  getPriorityColor,
  getPriorityLabel,
  type ProtocolAction,
} from "@/lib/emergency-protocols"
import { useAuth } from "@/contexts/auth-context"

interface ProtocolActionsProps {
  alertType: "incendio" | "sismo" | "medica" | "intruso"
  alertLocation: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProtocolActions({ alertType, alertLocation, isOpen, onOpenChange }: ProtocolActionsProps) {
  const { user } = useAuth()
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())
  const [currentTab, setCurrentTab] = useState("immediate")

  const protocol = getProtocolForAlert(alertType)
  const userActions = user ? getActionsForRole(protocol, user.role) : []

  const toggleActionComplete = (actionId: string) => {
    const newCompleted = new Set(completedActions)
    if (newCompleted.has(actionId)) {
      newCompleted.delete(actionId)
    } else {
      newCompleted.add(actionId)
    }
    setCompletedActions(newCompleted)
  }

  const getActionsByCategory = (actions: ProtocolAction[], category: "immediate" | "followup") => {
    if (category === "immediate") {
      return actions.filter((action) => action.priority === "immediate" || action.priority === "urgent")
    }
    return actions.filter((action) => action.priority === "important" || action.priority === "secondary")
  }

  const ActionCard = ({ action, isUserAction }: { action: ProtocolAction; isUserAction: boolean }) => {
    const isCompleted = completedActions.has(action.id)

    return (
      <Card className={`${getPriorityColor(action.priority)} ${isCompleted ? "opacity-60" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{action.icon}</span>
              {isUserAction && (
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => toggleActionComplete(action.id)}
                  className="mt-1"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-semibold text-sm ${isCompleted ? "line-through" : ""}`}>{action.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {getPriorityLabel(action.priority)}
                </Badge>
              </div>
              <p className={`text-sm text-gray-700 mb-2 ${isCompleted ? "line-through" : ""}`}>{action.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {action.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {action.responsible.join(", ")}
                  </div>
                </div>
                {isUserAction && (
                  <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                    {isCompleted ? "Completado" : "Tu responsabilidad"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const immediateActions = getActionsByCategory(protocol.immediateActions, "immediate")
  const followUpActions = getActionsByCategory(protocol.followUpActions, "followup")
  const userImmediateActions = getActionsByCategory(userActions, "immediate")
  const userFollowUpActions = getActionsByCategory(userActions, "followup")

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {protocol.title}
          </DialogTitle>
          <DialogDescription>
            Protocolo de emergencia para {alertLocation} • {protocol.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[70vh]">
          {/* Protocol Overview */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Información del Protocolo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">
                    {protocol.evacuationRequired ? "Requiere evacuación" : "No requiere evacuación"}
                  </span>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Contactos de Emergencia
                  </h4>
                  <div className="space-y-1">
                    {protocol.emergencyContacts.map((contact, index) => (
                      <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                        {contact}
                      </div>
                    ))}
                  </div>
                </div>

                {user && userActions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Tu Progreso
                    </h4>
                    <div className="text-xs text-gray-600">
                      {completedActions.size} de {userActions.length} acciones completadas
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${userActions.length > 0 ? (completedActions.size / userActions.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="immediate" className="text-xs">
                  Inmediatas ({immediateActions.length})
                </TabsTrigger>
                <TabsTrigger value="followup" className="text-xs">
                  Seguimiento ({followUpActions.length})
                </TabsTrigger>
                <TabsTrigger value="my-immediate" className="text-xs">
                  Mis Inmediatas ({userImmediateActions.length})
                </TabsTrigger>
                <TabsTrigger value="my-followup" className="text-xs">
                  Mi Seguimiento ({userFollowUpActions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="immediate" className="mt-4 h-full">
                <ScrollArea className="h-[50vh]">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-red-700 mb-3">Acciones Inmediatas</h3>
                    {immediateActions.map((action) => (
                      <ActionCard
                        key={action.id}
                        action={action}
                        isUserAction={user ? action.responsible.includes(user.role) : false}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="followup" className="mt-4 h-full">
                <ScrollArea className="h-[50vh]">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-orange-700 mb-3">Acciones de Seguimiento</h3>
                    {followUpActions.map((action) => (
                      <ActionCard
                        key={action.id}
                        action={action}
                        isUserAction={user ? action.responsible.includes(user.role) : false}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="my-immediate" className="mt-4 h-full">
                <ScrollArea className="h-[50vh]">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-blue-700 mb-3">Tus Acciones Inmediatas</h3>
                    {userImmediateActions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No tienes acciones inmediatas asignadas</p>
                      </div>
                    ) : (
                      userImmediateActions.map((action) => (
                        <ActionCard key={action.id} action={action} isUserAction={true} />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="my-followup" className="mt-4 h-full">
                <ScrollArea className="h-[50vh]">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-blue-700 mb-3">Tus Acciones de Seguimiento</h3>
                    {userFollowUpActions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No tienes acciones de seguimiento asignadas</p>
                      </div>
                    ) : (
                      userFollowUpActions.map((action) => (
                        <ActionCard key={action.id} action={action} isUserAction={true} />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
