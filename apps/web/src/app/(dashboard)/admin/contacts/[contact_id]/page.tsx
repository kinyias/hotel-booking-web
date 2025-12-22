'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import ContactForm from '@/features/contact/components/ContactForm';
import { useContactQuery } from '@/features/contact/queries';
import { ContactStatus } from '@/features/contact/types';

const STATUS_CONFIG: Record<ContactStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  NEW: { label: 'New', variant: 'default' },
  IN_PROGRESS: { label: 'In Progress', variant: 'secondary' },
  RESOLVED: { label: 'Resolved', variant: 'outline' },
  SPAM: { label: 'Spam', variant: 'destructive' },
};

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.contact_id as string;

  const { data: contact, isLoading, isError } = useContactQuery(contactId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div>
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !contact) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-destructive">Contact not found</h2>
        <p className="text-muted-foreground mt-2">
          The contact you're looking for doesn't exist or has been deleted.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/admin/contacts')}
        >
          Back to Contacts
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/admin/contacts')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contacts
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contact Details</h1>
            <p className="text-muted-foreground mt-1">
              Submitted on {new Date(contact.createdAt).toLocaleString()}
            </p>
          </div>
          <Badge variant={STATUS_CONFIG[contact.status].variant} className="text-lg px-4 py-2">
            {STATUS_CONFIG[contact.status].label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{contact.name}</div>
                </div>
              </div>

              {contact.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {contact.subject && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Subject</div>
                    <div className="font-medium">{contact.subject}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Message Card */}
          <Card>
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {contact.message}
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Information</CardTitle>
              <CardDescription>Metadata about this contact submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {contact.ip && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">IP Address</div>
                    <div className="font-mono text-sm">{contact.ip}</div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Timestamps</div>
                  <div className="text-sm">
                    <div>Created: {new Date(contact.createdAt).toLocaleString()}</div>
                    <div>Updated: {new Date(contact.updatedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {contact.userAgent && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">User Agent</div>
                  <div className="font-mono text-xs text-muted-foreground break-all">
                    {contact.userAgent}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Management Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Contact</CardTitle>
              <CardDescription>
                Update status, assign handler, and add notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm contact={contact} />
            </CardContent>
          </Card>

          {contact.note && (
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {contact.note}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
