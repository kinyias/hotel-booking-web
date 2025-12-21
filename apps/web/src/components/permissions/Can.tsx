import { usePermission } from "@/providers/PermissionProvider";

type CanProps = {
  action: string;
  children: React.ReactNode;
};

export function Can({ action, children }: CanProps) {
  const { can } = usePermission();
  if (!can(action)) return null;
  return <>{children}</>;
}
