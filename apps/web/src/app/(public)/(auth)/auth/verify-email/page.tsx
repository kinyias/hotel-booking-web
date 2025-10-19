'use client';
import VerifyEmail from '@/features/auth/components/VerifyEmail';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Suspense } from 'react';
import PageTitle from '@/components/sections/PageTitle';
import { ROUTES } from '@/constants';

export default function ConfirmAccount() {
  return (
    <>
      <PageTitle
        title="Verify Email"
        breadcrumbs={[{ label: 'Home', href: ROUTES.HOME }]}
      />
      <div className="py-20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Verify Account
            </CardTitle>
            <CardDescription className="text-center">
              Verify your account to start using our services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <VerifyEmail />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
