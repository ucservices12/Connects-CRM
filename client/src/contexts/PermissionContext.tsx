import { createContext, useContext, useState, ReactNode } from 'react';

interface Permission {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    roles: string[];
}

interface PermissionContextType {
    permissions: Permission[];
    togglePermission: (id: string, role: string) => void;
    hasPermission: (permissionName: string, role: string) => boolean;
}

const defaultPermissions: Permission[] = [
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

const PermissionContext = createContext<PermissionContextType>({
    permissions: defaultPermissions,
    togglePermission: () => { },
    hasPermission: () => false,
});

export const usePermissions = () => useContext(PermissionContext);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
    const [permissions, setPermissions] = useState<Permission[]>(defaultPermissions);

    const togglePermission = (id: string, role: string) => {
        setPermissions(prev =>
            prev.map(permission =>
                permission.id === id
                    ? {
                        ...permission,
                        roles: permission.roles.includes(role)
                            ? permission.roles.filter(r => r !== role)
                            : [...permission.roles, role]
                    }
                    : permission
            )
        );
    };

    const hasPermission = (permissionName: string, role: string) => {
        const permission = permissions.find(p => p.id === permissionName);
        return permission?.roles.includes(role) ?? false;
    };

    return (
        <PermissionContext.Provider value={{ permissions, togglePermission, hasPermission }}>
            {children}
        </PermissionContext.Provider>
    );
};