'use client';

import { 
  Clock, 
  CreditCard, 
  Baby, 
  PawPrint, 
  Cigarette, 
  FileText, 
  Ban,
  Info
} from 'lucide-react';
import { usePublicPoliciesQuery } from '../queries';
import { PolicyType } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const POLICY_ICONS: Record<PolicyType, React.ElementType> = {
  CHECKIN: Clock,
  CANCELLATION: Ban,
  PAYMENT: CreditCard,
  CHILDREN: Baby,
  PET: PawPrint,
  SMOKING: Cigarette,
  GENERAL: Info,
};

const POLICY_LABELS: Record<PolicyType, string> = {
  CHECKIN: 'Check-in & Check-out',
  CANCELLATION: 'Cancellation Policy',
  PAYMENT: 'Payment Methods',
  CHILDREN: 'Children & Extra Beds',
  PET: 'Pets',
  SMOKING: 'Smoking Policy',
  GENERAL: 'General Rules',
};

interface PolicyListProps {
  hotelId: string;
}

export default function PolicyList({ hotelId }: PolicyListProps) {
  const { data: policies, isLoading } = usePublicPoliciesQuery(hotelId);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (!policies || policies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">House Rules & Policies</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {policies.sort((a, b) => a.order - b.order).map((policy) => {
          const Icon = POLICY_ICONS[policy.type] || FileText;
          return (
            <Card key={policy.id} className="border-l-4 border-l-primary/50">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">{policy.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed">
                  {policy.content}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
