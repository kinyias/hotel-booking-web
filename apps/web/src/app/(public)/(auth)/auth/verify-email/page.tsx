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
        title="Xác minh email"
        breadcrumbs={[
          { label: 'Trang chủ', href: ROUTES.HOME },
        ]}
      />
      <div className="py-20 flex items-center justify-center ">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Xác minh tài khoản
            </CardTitle>
            <CardDescription className="text-center">
              Xác minh tài khoản của bạn để bắt đầu sử dụng dịch vụ của chúng
              tôi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Đang tải...</div>}>
              <VerifyEmail />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
