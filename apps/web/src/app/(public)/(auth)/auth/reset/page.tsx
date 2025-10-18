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
        <PageTitle title="Đặt lại mật khẩu" breadcrumbs={[]} description="Tạo mật khẩu mới cho tài khoản của bạn" />
      <div className="py-20 flex items-center justify-center ">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Đặt lại mật khẩu mới
            </CardTitle>
            <CardDescription className="text-center">
              Mật khẩu của bạn phải khác mật khẩu cũ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Đang tải...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
