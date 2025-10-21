export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  permission: Permission; // Chi tiết quyền
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: RolePermission[]; // Danh sách quyền gắn với role
}
