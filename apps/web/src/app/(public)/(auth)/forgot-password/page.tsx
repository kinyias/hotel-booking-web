'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import PageTitle from '@/components/sections/PageTitle';
import { ROUTES } from '@/constants';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';
import { MailCheckIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const { forgotPassword, loading } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (email: string) => {
    try {
      await forgotPassword(email);
      setSubmittedEmail(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  return (
    <>
      <PageTitle
        title="Forgot Password"
        breadcrumbs={[]}
        description="Reset your password"
      />

      {!isSubmitted ? (
        <div className="py-20 flex items-center justify-center">
          <ForgotPasswordForm onSubmit={handleSubmit} loading={loading} />
        </div>
      ) : (
        <SuccessMessage email={submittedEmail} />
      )}
    </>
  );
}
function SuccessMessage({ email }: { email: string }) {
  return (
    <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
      <div className="size-[48px]">
        <MailCheckIcon size="48px" className="animate-bounce" />
      </div>
      <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
        Kiểm tra email của bạn
      </h2>
      <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
        Chúng tôi đã gửi link xác nhận email tới {email}.
      </p>
      <Link href={ROUTES.LOGIN}>
        <Button className="h-[40px]">
          Tiếp tục đăng nhập
          <ArrowRight />
        </Button>
      </Link>
    </div>
  );
}
