'use client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MESSAGES } from '@/constants/message';
import { PermissionAssignActionFormValues, RoleAction, useActionsQuery } from '@/features/actions';
import PermissionAssignActionDialog from '@/features/actions/component/PermissionAssignActionDialog';
import ActionManagementTable from '@/features/actions/component/ActionManagementTable';
import { useAssignPermissionToAction } from '@/features/actions/mutations';
import { ApiError } from '@/types';
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function ActionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError } = useActionsQuery();
  const [actionToEdit, setActionToEdit] = useState<RoleAction | null>(null);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const actions = data || [];
  const assignPermissionToActionMutation = useAssignPermissionToAction();

  const handleAssignSave = async (data: PermissionAssignActionFormValues) => {
    if (actionToEdit) {
      assignPermissionToActionMutation.mutate(
        {
          id: actionToEdit.id,
          data: data.permissionIds,
        },
        {
          onSuccess: () => {
            toast.success(MESSAGES.USER.UPDATE_ACTION_SUCCESS || 'Permissions assigned successfully');
            setOpenAssignDialog(false);
          },
          onError: (err) => {
            const error = err as ApiError;
            console.error('Assign permission error:', error);
            toast.error(
              error?.response?.data.message ||
                MESSAGES.USER.UPDATE_ACTION_FAILED || 'Failed to assign permissions'
            );
            setOpenAssignDialog(false);
          },
        }
      );
    }
    else{
      toast.error(MESSAGES.USER.MISSING_ACTION || 'No action selected');
    }
  };

  const handleAssign = (action: RoleAction) => {
    setActionToEdit(action);
    setOpenAssignDialog(true);
  };

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Actions Management</h1>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Search actions by key or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">Loading actions...</div>
      ) : isError ? (
        <div className="flex justify-center py-8 text-destructive">
          Error loading actions
        </div>
      ) : (
        <>
          <ActionManagementTable
            actions={actions}
            onAssign={handleAssign}
            searchTerm={searchTerm}
          />

          {/* Permission Assign Action Dialog */}
          <PermissionAssignActionDialog
            open={openAssignDialog}
            onOpenChange={setOpenAssignDialog}
            action={actionToEdit || null}
            onSubmit={handleAssignSave}
            isSubmitting={assignPermissionToActionMutation.isPending}
          />
        </>
      )}
    </div>
  );
}

export default ActionsPage;