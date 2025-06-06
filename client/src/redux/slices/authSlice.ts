import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../../machine/auth';
import { getOrganization } from '../../machine/organization';

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, thunkAPI) => {
    try {
        const userData = await getCurrentUser();
        return userData?.data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Session expired');
    }
});

export const login = createAsyncThunk('auth/login', async ({ credentials, navigate, toast }, thunkAPI) => {
    try {
        // Step 1: Log in and store token
        const loginResponse = await loginUser(credentials);
        if (!loginResponse.success) {
            throw new Error("Invalid login response");
        }

        // Step 2: Get user details after login
        const userResponse = await getCurrentUser();
        const user = userResponse?.data;

        if (!user || !user.role) {
            throw new Error("Failed to retrieve user data after login");
        }

        // Step 3: Navigate based on role
        toast.success('Login successful!');
        const path =
            user.role === 'admin' ? '/dashboard/admin'
                : user.role === 'hr' ? '/dashboard/hr'
                    : user.role === 'manager' ? '/dashboard/manager'
                        : '/dashboard/employee';
        navigate(path);

        return user;
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || error.message || 'Login failed'
        );
    }
}
);

export const register = createAsyncThunk('auth/register', async ({ data, navigate, toast }, thunkAPI) => {
    try {
        await registerUser(data);
        toast.success('Registration successful! Please log in.');
        navigate('/login');
        return true;
    } catch (error) {
        toast.error(error.response?.data?.error || 'Register failed');
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Register failed');
    }
});

export const fetchOrganization = createAsyncThunk('auth/fetchOrganization', async (orgId, thunkAPI) => {
    try {
        const response = await getOrganization(orgId);
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue('Organization fetch failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        organization: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            logoutUser();
            state.user = null;
            state.organization = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isLoading = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isAuthenticated = false;
                state.isLoading = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(fetchOrganization.fulfilled, (state, action) => {
                state.organization = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
