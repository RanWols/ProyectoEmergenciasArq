"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus, Edit, Trash2, Shield, Eye } from "lucide-react"
import { useAuth, type User as UserType } from "@/contexts/auth-context"

const mockUsers: UserType[] = [
  {
    id: "1",
    name: "Ana Martínez",
    email: "ana.martinez@colegio.cl",
    role: "administrador",
    department: "Dirección",
    phone: "+56912345678",
    isActive: true,
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@colegio.cl",
    role: "coordinador",
    department: "Seguridad",
    phone: "+56987654321",
    isActive: true,
  },
  {
    id: "3",
    name: "María González",
    email: "maria.gonzalez@colegio.cl",
    role: "inspector",
    department: "Inspectoría",
    phone: "+56911111111",
    isActive: true,
  },
  {
    id: "4",
    name: "Juan Pérez",
    email: "juan.perez@colegio.cl",
    role: "docente",
    department: "Matemáticas",
    phone: "+56922222222",
    isActive: false,
  },
]

const roleLabels = {
  administrador: "Administrador",
  coordinador: "Coordinador de Seguridad",
  inspector: "Inspector",
  docente: "Docente",
}

const roleColors = {
  administrador: "bg-red-100 text-red-800",
  coordinador: "bg-blue-100 text-blue-800",
  inspector: "bg-green-100 text-green-800",
  docente: "bg-gray-100 text-gray-800",
}

export default function UserManagement() {
  const { hasPermission } = useAuth()
  const [users, setUsers] = useState<UserType[]>(mockUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    phone: "",
  })

  if (!hasPermission("manage_users")) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">No tiene permisos para acceder a esta sección</p>
        </CardContent>
      </Card>
    )
  }

  const handleCreateUser = () => {
    setEditingUser(null)
    setFormData({ name: "", email: "", role: "", department: "", phone: "" })
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: UserType) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || "",
      phone: user.phone || "",
    })
    setIsDialogOpen(true)
  }

  const handleSaveUser = () => {
    if (editingUser) {
      // Update existing user
      setUsers((prev) => prev.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user)))
    } else {
      // Create new user
      const newUser: UserType = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
      } as UserType
      setUsers((prev) => [...prev, newUser])
    }
    setIsDialogOpen(false)
  }

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user)))
  }

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600">Administre las cuentas de usuario del sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateUser}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Modifique los datos del usuario seleccionado"
                  : "Complete los datos para crear un nuevo usuario"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="usuario@colegio.cl"
                />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                  placeholder="Ej: Matemáticas, Inspectoría"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+56912345678"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveUser}>{editingUser ? "Guardar Cambios" : "Crear Usuario"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuarios
          </CardTitle>
          <CardDescription>
            {users.length} usuarios registrados • {users.filter((u) => u.isActive).length} activos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleUserStatus(user.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
