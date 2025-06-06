import axios from 'axios';

const API = "http://localhost:5000/api/v1/auth";

// Get token from localStorage
export const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) throw new Error("No token found");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API}/login`, credentials);
        const token = response.data.token;
        localStorage.setItem("token", token);
        console.log("login user", response.data);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data?.error || error.message);
        throw error;
    }
};

export const registerUser = async (credentials) => {
    try {
        const payload = {
            ...credentials,
            role: 'admin'
        };

        const response = await axios.post(`${API}/register`, payload);

        return response.data;
    } catch (error) {
        console.error("Register error:", error.response?.data || error.message);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) throw new Error("No token found");

        const response = await axios.get(`${API}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("getCurrentUser error:", error.response?.data || error.message);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`${API}/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        localStorage.removeItem('token');

        return response.data;
    } catch (error) {
        console.error("Logout error:", error.response?.data || error.message);
        throw error;
    }
};

export const updatePassword = async (data) => {
    try {
        const response = await axios.put(`${API}/updatepassword`, data, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Update password error:", error.response?.data || error.message);
        throw error;
    }
};
