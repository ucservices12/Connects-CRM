import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1/organizations';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createOrganization = async (data: any) => {
    try {
        const res = await axios.post(API_BASE, data, { headers: getAuthHeaders() });
        return res.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to create organization');
    }
};

export const getOrganization = async (id: string) => {
    try {
        const res = await axios.get(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
        // console.log("Get Oranazation Data =>", res?.data?.data);
        return res.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to fetch organization');
    }
};

export const updateOrganization = async (id: string, data: any) => {
    try {
        const res = await axios.put(`${API_BASE}/${id}`, data, { headers: getAuthHeaders() });
        return res.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to update organization');
    }
};

export const deleteOrganization = async (id: string) => {
    try {
        const res = await axios.delete(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
        return res.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to delete organization');
    }
};

export const updateSubscription = async (id: string, subscriptionPlan: string) => {
    try {
        const res = await axios.put(
            `${API_BASE}/${id}/subscription`,
            { subscriptionPlan },
            { headers: getAuthHeaders() }
        );
        return res.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to update subscription');
    }
};