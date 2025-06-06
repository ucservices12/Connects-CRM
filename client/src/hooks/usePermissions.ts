import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { togglePermission } from '../redux/slices/permissionSlice';

export const usePermissions = () => {
    const permissions = useSelector((state: RootState) => state.permissions);
    const dispatch = useDispatch();

    const toggle = (id: string, role: string) => {
        dispatch(togglePermission({ id, role }));
    };

    const hasPermission = (id: string, role: string) => {
        const perm = permissions.find(p => p.id === id);
        return perm?.roles.includes(role) ?? false;
    };

    return { permissions, togglePermission: toggle, hasPermission };
};
