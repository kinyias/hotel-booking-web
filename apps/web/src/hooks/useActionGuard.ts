import { usePermission } from "@/providers/PermissionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useActionGuard(action: string) {
  const { can } = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!can(action)) {
      router.replace("/403");
    }
  }, [action, can, router]);
}
