'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MESSAGES } from '@/constants/message';
import { Role, RoleFormValues, useRolesQuery } from '@/features/roles';
import RoleFormDialog from '@/features/roles/component/RoleFormDialog';
import RoleManagementTable from '@/features/roles/component/RoleManagementTable';
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from '@/features/roles/mutations';
import { ApiError } from '@/types';
import { Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function RolesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError } = useRolesQuery();
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const roles = data || [];
  const updateRoleMutation = useUpdateRoleMutation();
  const createRoleMutation = useCreateRoleMutation();
  const handleEdit = (role: Role) => {
    setRoleToEdit(role);
    setOpenDialog(true);
  };
  const handleCreate = () => {
    setRoleToEdit(null);
    setOpenDialog(true);
  };
  const handleDelete = (id: string) => {
    console.log(id);
  };
  const handleSave = async (data: RoleFormValues) => {
    if (roleToEdit) {
      setIsSubmitting(true);
      updateRoleMutation.mutate(
        {
          id: roleToEdit.id,
          data,
        },
        {
          onSuccess: () => {
            toast.success(MESSAGES.USER.UPDATE_ROLE_SUCCESS);
            setOpenDialog(false);
            setIsSubmitting(false);
          },
          onError: (err) => {
            const error = err as ApiError;
            console.error('Edit role error:', error);
            toast.error(
              error?.response?.data.message ||
                MESSAGES.USER.UPDATE_ROLE_FAILED
            );
            setIsSubmitting(false);
          },
        }
      );
    } else {
      setIsSubmitting(true);
      createRoleMutation.mutate(
        {
          data,
        },
        {
          onSuccess: () => {
            toast.success(MESSAGES.USER.UPDATE_ROLE_SUCCESS);
            setOpenDialog(false);
            setIsSubmitting(false);
          },
          onError: (err) => {
            const error = err as ApiError;
            console.error('Edit role error:', error);
            toast.error(
              error?.response?.data.message ||
                MESSAGES.USER.UPDATE_ROLE_FAILED
            );
            setIsSubmitting(false);
          },
        }
      );
    }
  };

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Roles Management</h1>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleCreate}
        >
          <Plus size={20} className="mr-2" />
          Add Role
        </Button>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Search roles by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">Loading roles...</div>
      ) : isError ? (
        <div className="flex justify-center py-8 text-destructive">
          Error loading roles
        </div>
      ) : (
        <>
          <RoleManagementTable
            roles={roles}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Edit Role Dialog */}
          <RoleFormDialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            role={roleToEdit}
            onSubmit={handleSave}
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </div>
  );
}

export default RolesPage;
