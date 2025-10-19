'use client';

import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Suspense } from 'react';
import PageTitle from '@/components/sections/PageTitle';

export default function ResetPasswordPage() {
  return (
    <>
      <PageTitle
        title="Reset Password"
        breadcrumbs={[]}
        description="Create a new password for your account"
      />
      <div className="py-20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Set a New Password
            </CardTitle>
            <CardDescription className="text-center">
              Your new password must be different from the old one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
