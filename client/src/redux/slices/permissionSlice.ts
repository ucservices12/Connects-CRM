// features/permissions/permissionSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Permission {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    roles: string[];
}

const initialState: Permission[] = [
    {
        id: 'dashboard_access',
        name: 'Dashboard Access',
        description: 'Access to view dashboard and analytics',
        enabled: true,
        roles: ['admin', 'hr', 'manager']
    },
    {
        id: 'employee_management',
        name: 'Employee Management',
        description: 'Create, edit, and delete employee records',
        enabled: true,
        roles: ['admin', 'hr']
    },
    {
        id: 'client_management',
        name: 'Client Management',
        description: 'Manage client information and relationships',
        enabled: true,
        roles: ['admin', 'manager']
    },
    {
        id: 'invoice_management',
        name: 'Invoice Management',
        description: 'Create and manage invoices',
        enabled: true,
        roles: ['admin']
    },
    {
        id: 'attendance_management',
        name: 'Attendance Management',
        description: 'View and manage attendance records',
        enabled: true,
        roles: ['admin', 'hr']
    },
    {
        id: 'leave_management',
        name: 'Leave Management',
        description: 'Approve or reject leave requests',
        enabled: true,
        roles: ['admin', 'hr', 'manager']
    },
    {
        id: 'task_management',
        name: 'Task Management',
        description: 'Create and assign tasks',
        enabled: true,
        roles: ['admin', 'manager']
    },
    {
        id: 'report_access',
        name: 'Report Access',
        description: 'Access and download reports',
        enabled: true,
        roles: ['admin', 'hr', 'manager']
    },
    {
        id: 'settings_access',
        name: 'Settings Access',
        description: 'Access system settings and configurations',
        enabled: true,
        roles: ['admin']
    },
    {
        id: 'user_management',
        name: 'User Management',
        description: 'Manage user accounts and roles',
        enabled: true,
        roles: ['admin']
    }
];

interface TogglePayload {
    id: string;
    role: string;
}

const permissionSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {
        togglePermission(state, action: PayloadAction<TogglePayload>) {
            const { id, role } = action.payload;
            return state.map(permission => {
                if (permission.id !== id) return permission;
                const hasRole = permission.roles.includes(role);
                return {
                    ...permission,
                    roles: hasRole
                        ? permission.roles.filter(r => r !== role)
                        : [...permission.roles, role]
                };
            });
        }
    }
});

export const { togglePermission } = permissionSlice.actions;
export default permissionSlice.reducer;
