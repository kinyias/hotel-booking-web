'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthTokens } from '@/lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/providers/AuthProvider';
import { ROUTES } from '@/constants';

export default function OAuthCallBack() {
  const router = useRouter();
  const { loadUser } = useAuth();
  useEffect(() => {
    // Extract query parameters
    const hash = window.location.hash;
    if (!hash) return;

    // Xóa dấu # đầu tiên và parse
    const params = Object.fromEntries(
      hash
        .substring(1)
        .split('&')
        .map((part) => part.split('=').map(decodeURIComponent))
    );

    const token = params.access_token;
    if (token) {
      // Save tokens
      setAuthTokens(token);
      loadUser();
      toast.success('Đăng nhập thành công');
      // Redirect to dashboard
      router.push(ROUTES.HOME);
    } else {
      // If no tokens or error, redirect to login
      toast.error('Đăng nhập thất bại');
      router.push(ROUTES.LOGIN);
    }
  }, [router, loadUser]);
  return (
    <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Logging you in...
        </h2>
        <div className="mt-8">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Please wait while we log you in using OAuth...
        </p>
      </div>
    </div>
  );
}
