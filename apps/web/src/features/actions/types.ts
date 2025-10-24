import { Permission } from "../roles";


export interface Policy {
  actionId: string;
  permissionId: string;
  permission: Permission;
}

export interface RoleAction {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  mode: "ANY" | "ALL"; 
  createdAt: string;  
  updatedAt: string;
  policies: Policy[];
}
