import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Shield, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Role } from '../types';
interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}
function RoleManagementTable({ roles, onEdit, onDelete }: RoleTableProps) {
  return (
          <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="text-foreground">Role Name</TableHead>
              <TableHead className="text-foreground">Description</TableHead>
              <TableHead className="text-foreground">Permissions</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <TableCell className="text-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-primary" />
                    {role.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{role.description}</TableCell>
                <TableCell className="text-foreground font-medium">{role.permissions.map(permission => permission.permission.name).join(', ')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(role)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/80"
                      onClick={() => onDelete(role.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Empty State */}
        {roles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Shield size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No roles found</p>
          </div>
        )}
      </Card>
  )
}

export default RoleManagementTable