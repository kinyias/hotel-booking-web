import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  resendVerificationEmail,
  resendVerificationEmailSchema,
  verifyEmail,
} from '@/features/auth';
import { MESSAGES } from '@/constants/message';
import { ApiError } from '@/types';
import { ROUTES } from '@/constants';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import z, { set } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
type ResendVerticationForm = z.infer<typeof resendVerificationEmailSchema>;
export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ResendVerticationForm>({
    resolver: zodResolver(resendVerificationEmailSchema),
    defaultValues: {
      email: '',
    },
  });
  useEffect(() => {
    const verifyToken = async () => {
      if (!token || typeof token !== 'string') return;

      try {
        setStatus('loading');
        await verifyEmail(token);
        setStatus('success');
      } catch (err) {
        const error = err as ApiError;
        console.error('Lỗi xác thực:', error);
        setStatus('error');
        setError(
          error?.response?.data.message || MESSAGES.AUTH.VERIFY_EMAIL_FAILED
        );
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, verifyEmail]);
  const handleSubmit = async (values: ResendVerticationForm) => {
    try {
      setLoading(true);
      await resendVerificationEmail(values.email);
      toast.success(
        'Verification email resent! Please check your inbox.'
      );
      setLoading(false);
      router.push(ROUTES.LOGIN);
    } catch (err) {
      const error = err as ApiError;
      toast.error(
        error?.response?.data?.message || 'Failed to resend verification email.'
      );
      setLoading(false);
      console.error('Forgot password error:', error);
    }
  };
  return (
    <>
      {' '}
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-700">Verifying your email...</p>
        </div>
      )}
      {status === 'success' && (
        <div className="text-center">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            <p>Your email has been successfully verified</p>
          </div>
          <Link href={ROUTES.LOGIN}>
            <Button>Login</Button>
          </Link>
        </div>
      )}
      {status === 'error' && (
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>
              {error || 'Failed to verify email. The link may have expired.'}
            </p>
          </div>
          {error !== MESSAGES.AUTH.VERIFY_EMAIL_EXPIRED && (
            <Link href={ROUTES.LOGIN}>
              <Button>Back to login</Button>
            </Link>
          )}
          {error === MESSAGES.AUTH.VERIFY_EMAIL_EXPIRED && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input
                            placeholder="Email"
                            className="pl-10"
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Send verification email'
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      )}
    </>
  );
}
