import OAuthCallBack from '@/features/auth/components/OAuthCallBack';
import { Suspense } from 'react';

export default function OAuthCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <OAuthCallBack />
      </Suspense>
    </div>
  );
}