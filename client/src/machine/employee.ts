import axios from 'axios';
import { getAuthHeader } from './auth';

const SUB_API = import.meta.env.VITE_PRIVATE_API;
const EMPLOYEE_API = `${SUB_API}/employees`;

// Create Employee
export const createEmployee = async (formData) => {
    try {
        const response = await axios.post(EMPLOYEE_API, formData, getAuthHeader());
        console.log("Employee created:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to create employee:", error.response?.data?.error || error.message);
        throw error;
    }
};

// Get All Employees (with optional filters like ?organization=123)
export const getEmployees = async (filters = {}) => {
    try {
        const query = new URLSearchParams(filters).toString();
        const response = await axios.get(`${EMPLOYEE_API}?${query}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Failed to fetch employees:", error.response?.data?.error || error.message);
        throw error;
    }
};

// Get Single Employee by ID
export const getEmployeeById = async (id) => {
    try {
        const response = await axios.get(`${EMPLOYEE_API}/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Failed to fetch employee:", error.response?.data?.error || error.message);
        throw error;
    }
};

// Update Employee by ID
export const updateEmployee = async (id, updateData) => {
    try {
        const response = await axios.put(`${EMPLOYEE_API}/${id}`, updateData, getAuthHeader());
        console.log("Employee updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to update employee:", error.response?.data?.error || error.message);
        throw error;
    }
};

// Delete Employee by ID
export const deleteEmployee = async (id) => {
    try {
        const response = await axios.delete(`${EMPLOYEE_API}/${id}`, getAuthHeader());
        console.log("Employee deleted:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to delete employee:", error.response?.data?.error || error.message);
        throw error;
    }
};
