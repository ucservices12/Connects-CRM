import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../machine/auth';
import { getOrganization } from '../machine/organization';

const AuthContext = createContext({
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrganizationData = async () => {
      if (user?.organization) {
        try {
          const response = await getOrganization(user.organization);
          setOrganization(response);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getOrganizationData();
  }, [user]);

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

  const login = async (credentials) => {
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
    } catch (error) {
      console.error(error.response?.data?.error || error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login');
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
        checkAuth,
        organization
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};