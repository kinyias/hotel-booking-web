'use client';
import { Button } from '@/components/ui/button';
import {
  useUsersQuery,
  useUpdateUserMutation,
  UserFormValues,
} from '@/features/user';
import { UsersFilters } from '@/features/user/components/UserFilter';
import { Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import UserManagementTable from '@/features/user/components/UserManagementTable';
import { toast } from 'react-hot-toast';
import { User } from '@/features/user/types';
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import UserEditFormDialog from '@/features/user/components/UserEditFormDialog';
import { MESSAGES } from '@/constants/message';
import { ApiError } from '@/types';

function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Edit user dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Calculate offset based on page number
  const offset = (page - 1) * limit;

  // Fetch users with pagination
  const { data, isLoading, isError } = useUsersQuery({
    limit,
    offset,
    q: searchTerm || undefined,
    role: filterRole !== 'all' ? filterRole : undefined,
  });

  // Mutations
  const updateUserMutation = useUpdateUserMutation();

  const users = data?.data || [];
  const totalPages = data?.meta ? Math.ceil(data.meta.total / limit) : 0;

  // Available roles for filtering
  const availableRoles = ['all', 'admin', 'user'];

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (data: UserFormValues) => {
    if (!userToEdit) return;
    updateUserMutation.mutate(
      {
        id: userToEdit.id,
        data,
      },
      {
        onSuccess: () => {
          toast.success(MESSAGES.USER.UPDATE_PROFILE_SUCCESS);
          setEditDialogOpen(false);
        },
        onError: (err) => {
          const error = err as ApiError;
          console.error('Edit user error:',error);
          toast.error(error?.response?.data.message || MESSAGES.USER.UPDATE_PROFILE_FAILED);
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      console.log(id);
    }
  };

  // Debounce search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to first page on search/filter change
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filterRole]);

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus size={20} className="mr-2" />
          Add User
        </Button>
      </div>

      <UsersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterRole={filterRole}
        onFilterRoleChange={setFilterRole}
        roles={availableRoles}
      />

      {isLoading ? (
        <div className="flex justify-center py-8">Loading users...</div>
      ) : isError ? (
        <div className="flex justify-center py-8 text-destructive">
          Error loading users
        </div>
      ) : (
        <>
          <UserManagementTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {totalPages > 0 && (
            <div className="flex justify-end">
              <EllipsisPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}

          {/* Edit User Dialog */}
          <UserEditFormDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            user={userToEdit}
            onSubmit={handleSaveEdit}
          />
        </>
      )}
    </div>
  );
}

export default UserManagementPage;
