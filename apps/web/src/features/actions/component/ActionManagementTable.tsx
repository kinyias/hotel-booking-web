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
import { Lock, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RoleAction } from '../types';
import { Badge } from '@/components/ui/badge';

interface ActionTableProps {
  actions: RoleAction[];
  onAssign: (action: RoleAction) => void;
  searchTerm: string;
}

function ActionManagementTable({ actions, onAssign, searchTerm }: ActionTableProps) {
  // Filter actions based on search term
  const filteredActions = actions.filter(action => 
    action.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
    action.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-card border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="text-foreground">Action Key</TableHead>
            <TableHead className="text-foreground">Description</TableHead>
            <TableHead className="text-foreground">Mode</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="text-foreground">Permissions</TableHead>
            <TableHead className="text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredActions.map((action) => (
            <TableRow key={action.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
              <TableCell className="text-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-primary" />
                  {action.key}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{action.description}</TableCell>
              <TableCell className="text-foreground font-medium">
                <Badge variant={action.mode === "ANY" ? "secondary" : "outline"}>
                  {action.mode}
                </Badge>
              </TableCell>
              <TableCell className="text-foreground font-medium">
                <Badge variant={action.enabled ? "success" : "destructive"}>
                  {action.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </TableCell>
              <TableCell className="text-foreground font-medium">
                {action.policies.length > 0 
                  ? action.policies.map(policy => policy.permission.name).join(', ')
                  : <span className="text-muted-foreground italic">No permissions</span>
                }
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => onAssign(action)}
                  >
                    <Lock size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Empty State */}
      {filteredActions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Shield size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No actions found</p>
        </div>
      )}
    </Card>
  )
}

export default ActionManagementTable