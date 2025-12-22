'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { updateContactSchema, UpdateContactFormValues } from '../validator';
import { Contact, ContactStatus } from '../types';
import { useUpdateContactMutation } from '../mutations';
import { useUsersQuery } from '@/features/user/queries';
import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';

interface ContactFormProps {
  contact: Contact;
}

const STATUS_OPTIONS: { value: ContactStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'SPAM', label: 'Spam' },
];

export default function ContactForm({ contact }: ContactFormProps) {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(
    contact.handledBy || null
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const mutation = useUpdateContactMutation(contact.id);
  const { data: usersData } = useUsersQuery({ q: debouncedSearchTerm, limit: 20 });
  const router = useRouter();
  const form = useForm<UpdateContactFormValues>({
    resolver: zodResolver(updateContactSchema),
    defaultValues: {
      status: contact.status,
      handledById: contact.handledById || null,
      note: contact.note || null,
    },
  });

  const onSubmit = async (data: UpdateContactFormValues) => {
    // Convert empty strings to null for proper backend handling
    try{
      const payload = {
        ...data,
        handledById: data.handledById || null,
        note: data.note || null,
      };
      await mutation.mutateAsync(payload);
      router.push(ROUTES.ADMIN_CONTACTS);
    }catch(error){
      console.log(error);
      toast.error('Failed to update contact');
    }
  };

  const handleSelectUser = (user: { id: string; name: string; email: string }) => {
    setSelectedUser(user);
    form.setValue('handledById', user.id);
    setUserDialogOpen(false);
  };

  const handleRemoveUser = () => {
    setSelectedUser(null);
    form.setValue('handledById', null);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="handledById"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Handled By</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {selectedUser ? (
                      <Card>
                        <CardContent className="p-3 flex items-center justify-between">
                          <div>
                            <div className="font-medium">{selectedUser.email}</div>
                            <div className="text-sm text-muted-foreground">
                              {selectedUser.email}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleRemoveUser}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setUserDialogOpen(true)}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Select User
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Internal Note</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add internal notes about this contact..."
                    rows={4}
                    className="resize-none"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>

      {/* User Selection Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[600px]">
          <DialogHeader>
            <DialogTitle>Select User</DialogTitle>
            <DialogDescription>
              Search and select a user to handle this contact
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {usersData?.data?.map((user: any) => (
                <Card
                  key={user.id}
                  className="cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => handleSelectUser(user)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                        {user.roles && user.roles.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {user.roles.map((role: any) => (
                              <Badge key={role.id} variant="outline" className="text-xs">
                                {role.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {usersData?.data?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
