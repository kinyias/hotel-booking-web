import Link from 'next/link';
import { ShieldX } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-black px-6">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <ShieldX className="h-10 w-10 text-red-500" />
          </div>
        </div>

        <h1 className="text-7xl font-extrabold text-red-500 tracking-tight">
          403
        </h1>

        <p className="mt-4 text-xl font-semibold">
          Access Denied
        </p>

        <p className="mt-2 text-muted-foreground">
          You don't have permission to access this resource.
          Please contact the administrator if you think this is a mistake.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition shadow-sm"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
