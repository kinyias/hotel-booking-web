'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { MailCheckIcon, ArrowRight } from 'lucide-react';
import PageTitle from '@/components/sections/PageTitle';
import { ROUTES } from '@/constants';
import RegisterForm from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <>
      <PageTitle
        title="Đăng ký"
        breadcrumbs={[
          { label: 'Trang chủ', href: ROUTES.HOME },
          { label: 'Đăng ký', href: ROUTES.REGISTER },
        ]}
      />

      {!isSubmitted ? (
        <div className="py-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Tạo tài khoản
              </CardTitle>
              <CardDescription className="text-center">
                Đăng nhập với tài khoản mới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm
                onSuccess={(email) => {
                  setEmail(email);
                  setIsSubmitted(true);
                }}
              />
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-gray-500">
                    Hoặc tiếp tục với
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <GoogleIcon />
                Tiếp tục với Google
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
          <MailCheckIcon size="48px" className="animate-bounce" />
          <h2 className="text-xl font-bold">Kiểm tra email của bạn</h2>
          <p className="mb-2 text-center text-sm text-muted-foreground">
            Chúng tôi đã gửi link xác nhận email tới <strong>{email}</strong>.
          </p>
          <Link href={ROUTES.LOGIN}>
            <Button className="h-[40px]">
              Tiếp tục đăng nhập <ArrowRight />
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
