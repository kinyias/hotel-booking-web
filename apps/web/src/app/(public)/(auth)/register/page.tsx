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
import { API_BASE_URL, ROUTES } from '@/constants';
import RegisterForm from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const googleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };
  return (
    <>
      <PageTitle
        title="Sign Up"
        breadcrumbs={[
          { label: 'Home', href: ROUTES.HOME },
          { label: 'Sign Up', href: ROUTES.REGISTER },
        ]}
      />

      {!isSubmitted ? (
        <div className="py-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Create an Account
              </CardTitle>
              <CardDescription className="text-center">
                Sign in with your new account
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
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={googleLogin}
              >
                <GoogleIcon />
                Login with Google
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href={ROUTES.LOGIN}
                  className="text-primary hover:underline"
                >
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
          <MailCheckIcon size="48px" className="animate-bounce" />
          <h2 className="text-xl font-bold">Check your email</h2>
          <p className="mb-2 text-center text-sm text-muted-foreground">
            We’ve sent a verification link to <strong>{email}</strong>.
          </p>
          <Link href={ROUTES.LOGIN}>
            <Button className="h-[40px]">
              Continue to Login <ArrowRight />
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
