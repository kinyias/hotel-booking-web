'use client';

import { useState } from 'react';
import { useHotelsQuery } from '@/features/hotels/queries';
import { useHotelMembersQuery } from '@/features/hotels/queries';
import { useAddMembersToHotelMutation, useRemoveMemberFromHotelMutation } from '@/features/hotels/mutations';
import { useUsersQuery } from '@/features/user/queries';
import { HotelMember } from '@/features/hotels/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';
import { UserPlus, Trash2, Users, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function MemberHotelsPage() {
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Queries
  const { data: hotelsData, isLoading: isLoadingHotels } = useHotelsQuery();
  const { data: membersData, isLoading: isLoadingMembers } = useHotelMembersQuery(
    selectedHotelId,
    !!selectedHotelId
  );
  const { data: usersData, isLoading: isLoadingUsers } = useUsersQuery({ limit: 100 });

  // Mutations
  const addMembersMutation = useAddMembersToHotelMutation();
  const removeMemberMutation = useRemoveMemberFromHotelMutation();

  const hotels = hotelsData?.data || [];
  const members = (membersData as HotelMember[]) || [];
  const users = usersData?.data || [];

  // Filter users that are not already members
  const availableUsers = users.filter(
    (user) => !members.some((member) => member.userId === user.id)
  );

  // Filter available users based on search query
  const filteredUsers = availableUsers.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower)
    );
  });

  const handleAddMembers = async () => {
    if (!selectedHotelId || selectedUserIds.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    try {
      await addMembersMutation.mutateAsync({
        hotelId: selectedHotelId,
        userIds: selectedUserIds,
      });
      toast.success(`Successfully added ${selectedUserIds.length} member(s)`);
      setIsAddMemberDialogOpen(false);
      setSelectedUserIds([]);
      setSearchQuery('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add members');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedHotelId) return;

    try {
      await removeMemberMutation.mutateAsync({
        hotelId: selectedHotelId,
        userId,
      });
      toast.success('Member removed successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to remove member');
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const selectedHotel = hotels.find((h) => h.id === selectedHotelId);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotel Members Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage team members for your hotels
          </p>
        </div>
      </div>

      {/* Hotel Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Hotel</CardTitle>
          <CardDescription>Choose a hotel to manage its members</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingHotels ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={selectedHotelId} onValueChange={setSelectedHotelId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Members List */}
      {selectedHotelId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </CardTitle>
                <CardDescription>
                  {selectedHotel?.name} - {members.length} member(s)
                </CardDescription>
              </div>
              <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Members
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Add Members to {selectedHotel?.name}</DialogTitle>
                    <DialogDescription>
                      Select users to add as members to this hotel
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* User Selection */}
                    <div className="flex-1 overflow-y-auto border rounded-md">
                      {isLoadingUsers ? (
                        <div className="p-4 space-y-2">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                          ))}
                        </div>
                      ) : filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          {searchQuery ? 'No users found matching your search' : 'No available users to add'}
                        </div>
                      ) : (
                        <div className="divide-y">
                          {filteredUsers.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                              onClick={() => toggleUserSelection(user.id)}
                            >
                              <Checkbox
                                checked={selectedUserIds.includes(user.id)}
                                onCheckedChange={() => toggleUserSelection(user.id)}
                              />
                              <div className="flex-1">
                                <p className="font-medium">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedUserIds.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {selectedUserIds.length} user(s) selected
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddMemberDialogOpen(false);
                        setSelectedUserIds([]);
                        setSearchQuery('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddMembers}
                      disabled={selectedUserIds.length === 0 || addMembersMutation.isPending}
                    >
                      {addMembersMutation.isPending
                        ? 'Adding...'
                        : `Add ${selectedUserIds.length} Member(s)`}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingMembers ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No members added yet</p>
                <p className="text-sm mt-2">Click "Add Members" to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member, index) => (
                    <TableRow key={`${member.id}-${index}`}>
                      <TableCell className="font-medium">
                        {member.user.firstName} {member.user.lastName}
                      </TableCell>
                      <TableCell>{member.user.email}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.userId)}
                          disabled={removeMemberMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedHotelId && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Users className="mx-auto h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg">Select a hotel to manage its members</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
