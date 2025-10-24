'use client';
import { ConfirmDialog } from '@/components/common/CofirmDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MESSAGES } from '@/constants/message';
import {
  Permission,
  PermissionFormValues,
  usePermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from '@/features/permissions';
import PermissionFormDialog from '@/features/permissions/component/PermissionFormDialog';
import PermissionManagementTable from '@/features/permissions/component/PermissionManagementTable';
import { ApiError } from '@/types';
import { Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError } = usePermissionsQuery();
  const [permissionToEdit, setPermissionToEdit] = useState<Permission | null>(
    null
  );
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const permissions = data?.data || [];

  const updatePermissionMutation = useUpdatePermissionMutation();
  const createPermissionMutation = useCreatePermissionMutation();
  const deletePermissionMutation = useDeletePermissionMutation();
  const handleEdit = (permission: Permission) => {
    setPermissionToEdit(permission);
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setPermissionToEdit(null);
    setOpenDialog(true);
  };

  const handleDelete = (permission: Permission) => {
    setPermissionToDelete(permission);
    setOpenDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    if (!permissionToDelete) return;
    setIsSubmitting(true);
    deletePermissionMutation.mutate(permissionToDelete.id, {
      onSuccess: () => {
        toast.success('Permission deleted successfully');
        setOpenDeleteDialog(false);
        setPermissionToDelete(null);
        setIsSubmitting(false);
      },
      onError: (err) => {
        const error = err as ApiError;
        toast.error(
          error?.response?.data.message || 'Failed to delete permission'
        );
        setIsSubmitting(false);
      },
    });
  };

  const handleSave = async (data: PermissionFormValues) => {
    if (permissionToEdit) {
      setIsSubmitting(true);
      updatePermissionMutation.mutate(
        {
          id: permissionToEdit.id,
          data,
        },
        {
          onSuccess: () => {
            toast.success('Permission updated successfully');
            setOpenDialog(false);
            setIsSubmitting(false);
          },
          onError: (err) => {
            const error = err as ApiError;
            console.error('Edit permission error:', error);
            toast.error(
              error?.response?.data.message || 'Failed to update permission'
            );
            setIsSubmitting(false);
          },
        }
      );
    } else {
      setIsSubmitting(true);
      createPermissionMutation.mutate(
        {
          data,
        },
        {
          onSuccess: () => {
            toast.success('Permission created successfully');
            setOpenDialog(false);
            setIsSubmitting(false);
          },
          onError: (err) => {
            const error = err as ApiError;
            console.error('Create permission error:', error);
            toast.error(
              error?.response?.data.message || 'Failed to create permission'
            );
            setIsSubmitting(false);
          },
        }
      );
    }
  };

  // Filter permissions based on search term
  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permission.description &&
        permission.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Permissions Management
        </h1>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleCreate}
        >
          <Plus size={20} className="mr-2" />
          Add Permission
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
            placeholder="Search permissions by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">Loading permissions...</div>
      ) : isError ? (
        <div className="flex justify-center py-8 text-destructive">
          Error loading permissions
        </div>
      ) : (
        <>
          <PermissionManagementTable
            permissions={filteredPermissions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Edit Permission Dialog */}
          <PermissionFormDialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            permission={permissionToEdit}
            onSubmit={handleSave}
            isSubmitting={isSubmitting}
          />
          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            open={openDeleteDialog}
            onConfirm={confirmDelete}
            onCancel={() => setOpenDeleteDialog(false)}
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={deletePermissionMutation.isPending}
          />
        </>
      )}
    </div>
  );
}

export default PermissionsPage;
