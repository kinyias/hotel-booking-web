'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Contact, ContactStatus } from '../types';

interface ContactTableProps {
  contacts: Contact[];
}

const STATUS_CONFIG: Record<ContactStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  NEW: { label: 'New', variant: 'default' },
  IN_PROGRESS: { label: 'In Progress', variant: 'secondary' },
  RESOLVED: { label: 'Resolved', variant: 'outline' },
  SPAM: { label: 'Spam', variant: 'destructive' },
};

export default function ContactTable({ contacts }: ContactTableProps) {
  return (
    <Card className="bg-card border-border overflow-hidden w-full">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="text-foreground">Name</TableHead>
            <TableHead className="text-foreground">Contact Info</TableHead>
            <TableHead className="text-foreground">Subject</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="text-foreground">Handled By</TableHead>
            <TableHead className="text-foreground">Created At</TableHead>
            <TableHead className="text-right text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              className="border-b border-border hover:bg-secondary/30 transition-colors"
            >
              <TableCell className="text-foreground font-medium">
                {contact.name}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {contact.email && (
                  <div className="text-sm">{contact.email}</div>
                )}
                {contact.phone && (
                  <div className="text-sm">{contact.phone}</div>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground max-w-[200px] truncate">
                {contact.subject || '-'}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_CONFIG[contact.status].variant}>
                  {STATUS_CONFIG[contact.status].label}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {contact.handledBy ? (
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {contact.handledBy.email}
                    </div>
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(contact.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/admin/contacts/${contact.id}`}>
                  <Button variant="ghost" size="icon" title="View Details">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {contacts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No contacts found</p>
        </div>
      )}
    </Card>
  );
}
