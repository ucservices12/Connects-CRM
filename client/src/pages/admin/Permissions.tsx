import { useState } from 'react';
import { Shield } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

const Permissions = () => {
    const { permissions, togglePermission } = usePermissions(); // from Redux
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('admin');

    const roles = ['admin', 'hr', 'manager', 'employee'];

    const filteredPermissions = permissions.filter(permission =>
        permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Permissions Management</h1>
                <p className="text-neutral-500">Manage role-based permissions and access control</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                {/* Role Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Select Role</label>
                    <div className="flex flex-wrap gap-2">
                        {roles.map(role => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedRole === role
                                        ? 'bg-primary-100 text-primary-800 border-2 border-primary-200'
                                        : 'bg-neutral-50 text-neutral-700 border-2 border-neutral-200 hover:bg-neutral-200'
                                    }`}
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6 max-w-md">
                    <input
                        type="text"
                        placeholder="Search permissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-input w-full border border-neutral-300 rounded-md px-4 py-2"
                    />
                </div>

                {/* Permissions List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPermissions.map(permission => (
                        <div
                            key={permission.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-neutral-50"
                        >
                            <div className="flex items-start flex-1">
                                <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                                    <Shield size={20} />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-neutral-900">{permission.name}</h3>
                                    <p className="text-sm text-neutral-500">{permission.description}</p>
                                </div>
                            </div>
                            <div className="ml-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={permission.roles.includes(selectedRole)}
                                        onChange={() => togglePermission(permission.id, selectedRole)}
                                    />
                                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Permissions;
