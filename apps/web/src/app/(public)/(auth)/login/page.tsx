import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/features/auth/components/LoginForm';
import PageTitle from '@/components/sections/PageTitle';
import Link from 'next/link';
import { ROUTES } from '@/constants';

export default function LoginPage() {
  return (
    <>
      <PageTitle
        title="Đăng nhập"
        breadcrumbs={[
          { label: 'Trang chủ', href: ROUTES.HOME },
          { label: 'Đăng nhập', href: ROUTES.LOGIN },
        ]}
      />

      <div className="py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Chào mừng trở lại
            </CardTitle>
            <CardDescription className="text-center">
              Đăng nhập tài khoản
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link href={ROUTES.REGISTER} className="text-primary hover:underline">
                Đăng ký
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
