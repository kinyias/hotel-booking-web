'use client';import React, { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthProvider";

type PermissionContextType = {
  actions: Set<string>;
  can: (action: string) => boolean;
  canAny: (actions: string[]) => boolean;
  canAll: (actions: string[]) => boolean;
};

const PermissionContext = createContext<PermissionContextType | null>(null);

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const { loading, user } = useAuth();

  const actionsSet = useMemo(() => {
    if (!user) return new Set<string>();
    return new Set(user.allowedActions || []);
  }, [user]);

  const value = useMemo<PermissionContextType>(() => {
    return {
      actions: actionsSet,

      can: (action: string) => actionsSet.has(action),

      canAny: (actions: string[]) =>
        actions.some((a) => actionsSet.has(a)),

      canAll: (actions: string[]) =>
        actions.every((a) => actionsSet.has(a)),
    };
  }, [actionsSet]);

  // đang load auth → chưa biết quyền → không render
  if (loading) return null; // hoặc <FullScreenLoading />

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};
export function usePermission() {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    throw new Error("usePermission must be used inside PermissionProvider");
  }
  return ctx;
}