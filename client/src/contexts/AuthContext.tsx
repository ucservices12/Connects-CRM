import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, LoginCredentials, RegisterData } from '../types/auth';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../machine/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { },
  register: async () => { },
  logout: () => { },
  forgotPassword: async () => { },
  checkAuth: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    const run = async () => {
      setIsLoading(true);
      try {
        const userData = await getCurrentUser();
        setUser(userData?.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.log("Session expired or user not authenticated.");
        localStorage.clear();
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const userData = await loginUser(credentials, navigate);
      setUser(userData.data);
      setIsAuthenticated(true);

      toast.success("Login successful!");

      // Role-based navigation
      const role = userData.data.role;
      let path = '/dashboard/admin';
      if (role === 'admin') path = '/dashboard/admin';
      else if (role === 'hr') path = '/dashboard/hr';
      else if (role === 'manager') path = '/dashboard/manager';
      else if (role === 'employee') path = '/dashboard/employee';
      navigate(path);
    } catch (error: any) {
      console.error(error.response?.data?.error || error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutUser()
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Replace with your actual API if needed
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Password reset link has been sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
