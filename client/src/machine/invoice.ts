import axios from 'axios';

const API = "http://localhost:5000/api/v1/invoices";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getInvoices = async (page, limit, orgId) => {
    if (!orgId) throw new Error("orgId is required");
    try {
        const response = await axios.get(
            `${API}?orgId=${orgId}&page=${page}&limit=${limit}`,
            { headers: getAuthHeaders() }
        );
        console.log("getAllInvoices =>", response?.data?.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoices:", error);
        throw error;
    }
};

export const getInvoiceById = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}`, {
            headers: getAuthHeaders()
        });
        console.log("getInvoiceById =>", response?.data?.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice by ID:", error);
        throw error;
    }
};

export const createInvoice = async (invoiceData: any) => {
    try {
        const response = await axios.post(API, invoiceData, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            }
        });
        console.log("Invoice created successfully:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error creating invoice:", error);
        throw error;
    }
};

export const updateInvoice = async (id: string, invoiceData: any) => {
    try {
        const response = await axios.put(`${API}/${id}`, invoiceData, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Error updating invoice:", error);
        throw error;
    }
};

export const deleteInvoice = async (id: string) => {
    try {
        const response = await axios.delete(`${API}/${id}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting invoice:", error);
        throw error;
    }
};

export const searchInvoices = async (query: string, page: number, limit: number) => {
    try {
        const response = await axios.get(`${API}/search`, {
            params: { query, page, limit },
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Error searching invoices:", error);
        throw error;
    }
};

export const getInvoiceStats = async () => {
    try {
        const response = await axios.get(`${API}/stats`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice stats:", error);
        throw error;
    }
};

export const getInvoicePdf = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}/pdf`, {
            responseType: 'blob',
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice PDF:", error);
        throw error;
    }
};

export const sendInvoiceEmail = async (id: string, emailData: any) => {
    try {
        const response = await axios.post(`${API}/${id}/send-email`, emailData, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Error sending invoice email:", error);
        throw error;
    }
};

export const getInvoiceHistory = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}/history`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice history:", error);
        throw error;
    }
};

export const getInvoiceComments = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}/comments`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice comments:", error);
        throw error;
    }
};

export const addInvoiceComment = async (id: string, commentData: any) => {
    try {
        const response = await axios.post(`${API}/${id}/comments`, commentData);
        return response.data;
    } catch (error) {
        console.error("Error adding invoice comment:", error);
        throw error;
    }
};

export const deleteInvoiceComment = async (id: string, commentId: string) => {
    try {
        const response = await axios.delete(`${API}/${id}/comments/${commentId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting invoice comment:", error);
        throw error;
    }
};

export const getInvoiceAttachments = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}/attachments`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice attachments:", error);
        throw error;
    }
};

export const addInvoiceAttachment = async (id: string, formData: FormData) => {
    try {
        const response = await axios.post(`${API}/${id}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding invoice attachment:", error);
        throw error;
    }
};


export const deleteInvoiceAttachment = async (id: string, attachmentId: string) => {
    try {
        const response = await axios.delete(`${API}/${id}/attachments/${attachmentId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting invoice attachment:", error);
        throw error;
    }
};

export const getInvoicePayments = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}/payments`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice payments:", error);
        throw error;
    }
};

export const addInvoicePayment = async (id: string, paymentData: any) => {
    try {
        const response = await axios.post(`${API}/${id}/payments`, paymentData);
        return response.data;
    } catch (error) {
        console.error("Error adding invoice payment:", error);
        throw error;
    }
};

export const deleteInvoicePayment = async (id: string, paymentId: string) => {
    try {
        const response = await axios.delete(`${API}/${id}/payments/${paymentId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting invoice payment:", error);
        throw error;
    }
};

export const updateInvoicePayment = async (id: string, paymentId: string, paymentData: any) => {
    try {
        const response = await axios.put(`${API}/${id}/payments/${paymentId}`, paymentData);
        return response.data;
    } catch (error) {
        console.error("Error updating invoice payment:", error);
        throw error;
    }
};

export const getInvoicePaymentMethods = async () => {
    try {
        const response = await axios.get(`${API}/payment-methods`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice payment methods:", error);
        throw error;
    }
};

export const getInvoicePaymentStatus = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}/payment-status`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice payment status:", error);
        throw error;
    }
};

export const getInvoiceDueDates = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}/due-dates`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice due dates:", error);
        throw error;
    }
};

export const updateInvoiceDueDate = async (id: string, dueDateData: any) => {
    try {
        const response = await axios.put(`${API}/${id}/due-dates`, dueDateData);
        return response.data;
    } catch (error) {
        console.error("Error updating invoice due date:", error);
        throw error;
    }
};

export const getInvoiceRecurringDetails = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}/recurring`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice recurring details:", error);
        throw error;
    }
};

export const createInvoiceRecurring = async (id: string, recurringData: any) => {
    try {
        const response = await axios.post(`${API}/${id}/recurring`, recurringData);
        return response.data;
    } catch (error) {
        console.error("Error creating invoice recurring:", error);
        throw error;
    }
};

export const updateInvoiceRecurring = async (id: string, recurringData: any) => {
    try {
        const response = await axios.put(`${API}/${id}/recurring`, recurringData);
        return response.data;
    } catch (error) {
        console.error("Error updating invoice recurring:", error);
        throw error;
    }
};

export const deleteInvoiceRecurring = async (id: string) => {
    try {
        const response = await axios.delete(`${API}/${id}/recurring`);
        return response.data;
    } catch (error) {
        console.error("Error deleting invoice recurring:", error);
        throw error;
    }
};


export const getInvoiceCustomFields = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}/custom-fields`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice custom fields:", error);
        throw error;
    }
};

export const addInvoiceCustomField = async (id: string, customFieldData: any) => {
    try {
        const response = await axios.post(`${API}/${id}/custom-fields`, customFieldData);
        return response.data;
    } catch (error) {
        console.error("Error adding invoice custom field:", error);
        throw error;
    }
};

export const updateInvoiceCustomField = async (id: string, customFieldId: string, customFieldData: any) => {
    try {
        const response = await axios.put(`${API}/${id}/custom-fields/${customFieldId}`, customFieldData);
        return response.data;
    } catch (error) {
        console.error("Error updating invoice custom field:", error);
        throw error;
    }
};

export const deleteInvoiceCustomField = async (id: string, customFieldId: string) => {
    try {
        const response = await axios.delete(`${API}/${id}/custom-fields/${customFieldId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting invoice custom field:", error);
        throw error;
    }
};

export const getInvoiceTags = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}/tags`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice tags:", error);
        throw error;
    }
};

export const addInvoiceTag = async (id: string, tagData: any) => {
    try {
        const response = await axios.post(`${API}/${id}/tags`, tagData);
        return response.data;
    } catch (error) {
        console.error("Error adding invoice tag:", error);
        throw error;
    }
};

export const deleteInvoiceTag = async (id: string, tagId: string) => {
    try {
        const response = await axios.delete(`${API}/${id}/tags/${tagId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting invoice tag:", error);
        throw error;
    }
};

export const getInvoiceActivityLog = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}/activity-log`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice activity log:", error);
        throw error;
    }
};

export const getInvoiceTemplates = async () => {
    try {
        const response = await axios.get(`${API}/templates`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice templates:", error);
        throw error;
    }
};

export const createInvoiceTemplate = async (templateData: any) => {
    try {
        const response = await axios.post(`${API}/templates`, templateData);
        return response.data;
    } catch (error) {
        console.error("Error creating invoice template:", error);
        throw error;
    }
};

export const updateInvoiceTemplate = async (id: string, templateData: any) => {
    try {
        const response = await axios.put(`${API}/templates/${id}`, templateData);
        return response.data;
    } catch (error) {
        console.error("Error updating invoice template:", error);
        throw error;
    }
};

export const deleteInvoiceTemplate = async (id: string) => {
    try {
        const response = await axios.delete(`${API}/templates/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting invoice template:", error);
        throw error;
    }
};

export const applyInvoiceTemplate = async (id: string, templateId: string) => {
    try {
        const response = await axios.post(`${API}/${id}/apply-template`, { templateId });
        return response.data;
    } catch (error) {
        console.error("Error applying invoice template:", error);
        throw error;
    }
};

export const getInvoiceCurrencyRates = async () => {
    try {
        const response = await axios.get(`${API}/currency-rates`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice currency rates:", error);
        throw error;
    }
};

export const convertInvoiceCurrency = async (id: string, currency: string) => {
    try {
        const response = await axios.post(`${API}/${id}/convert-currency`, { currency });
        return response.data;
    } catch (error) {
        console.error("Error converting invoice currency:", error);
        throw error;
    }
};

export const getInvoicePaymentLinks = async (id: string) => {
    try {
        const response = await axios.get(`${API}/${id}/payment-links`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice payment links:", error);
        throw error;
    }
};


export const createInvoicePaymentLink = async (id: string, paymentLinkData: any) => {
    try {
        const response = await axios.post(`${API}/${id}/payment-links`, paymentLinkData);
        return response.data;
    } catch (error) {
        console.error("Error creating invoice payment link:", error);
        throw error;
    }
};

export const deleteInvoicePaymentLink = async (id: string, linkId: string) => {
    try {
        const response = await axios.delete(`${API}/${id}/payment-links/${linkId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting invoice payment link:", error);
        throw error;
    }
};

export const getInvoicePaymentLinkById = async (id: string, linkId: string) => {
    try {
        const response = await axios.get(`${API}/${id}/payment-links/${linkId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice payment link by ID:", error);
        throw error;
    }
};

export const updateInvoicePaymentLink = async (id: string, linkId: string, paymentLinkData: any) => {
    try {
        const response = await axios.put(`${API}/${id}/payment-links/${linkId}`, paymentLinkData);
        return response.data;
    } catch (error) {
        console.error("Error updating invoice payment link:", error);
        throw error;
    }
};

export const getInvoicePaymentLinkStats = async (id: string, linkId: string) => {
    try {
        const response = await axios.get(`${API}/${id}/payment-links/${linkId}/stats`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice payment link stats:", error);
        throw error;
    }
};

export const getInvoicePaymentLinkTransactions = async (id: string, linkId: string) => {
    try {
        const response = await axios.get(`${API}/${id}/payment-links/${linkId}/transactions`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice payment link transactions:", error);
        throw error;
    }
};

export const getInvoicePaymentLinkRefunds = async (id: string, linkId: string) => {
    try {
        const response = await axios.get(`${API}/${id}/payment-links/${linkId}/refunds`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice payment link refunds:", error);
        throw error;
    }
};

export const refundInvoicePaymentLink = async (id: string, linkId: string, refundData: any) => {
    try {
        const response = await axios.post(`${API}/${id}/payment-links/${linkId}/refund`, refundData);
        return response.data;
    } catch (error) {
        console.error("Error refunding invoice payment link:", error);
        throw error;
    }
};

export const getInvoicePaymentLinkSettings = async (id: string, linkId: string) => {
    try {
        const response = await axios.get(`${API}/${id}/payment-links/${linkId}/settings`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice payment link settings:", error);
        throw error;
    }
};

export const updateInvoicePaymentLinkSettings = async (id: string, linkId: string, settingsData: any) => {
    try {
        const response = await axios.put(`${API}/${id}/payment-links/${linkId}/settings`, settingsData);
        return response.data;
    } catch (error) {
        console.error("Error updating invoice payment link settings:", error);
        throw error;
    }
};

export const getInvoicePaymentLinkNotifications = async (id: string, linkId: string) => {
    try {
        const response = await axios.get(`${API}/${id}/payment-links/${linkId}/notifications`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice payment link notifications:", error);
        throw error;
    }
};

export const updateInvoicePaymentLinkNotifications = async (id: string, linkId: string, notificationsData: any) => {
    try {
        const response = await axios.put(`${API}/${id}/payment-links/${linkId}/notifications`, notificationsData);
        return response.data;
    } catch (error) {
        console.error("Error updating invoice payment link notifications:", error);
        throw error;
    }
};

export const getInvoicePaymentLinkCustomFields = async (id: string, linkId: string) => {
    try {
        const response = await axios.get(`${API}/${id}/payment-links/${linkId}/custom-fields`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice payment link custom fields:", error);
        throw error;
    }
};

export const addInvoicePaymentLinkCustomField = async (id: string, linkId: string, customFieldData: any) => {
    try {
        const response = await axios.post(`${API}/${id}/payment-links/${linkId}/custom-fields`, customFieldData);
        return response.data;
    } catch (error) {
        console.error("Error adding invoice payment link custom field:", error);
        throw error;
    }
};

export const updateInvoicePaymentLinkCustomField = async (id: string, linkId: string, customFieldId: string, customFieldData: any) => {
    try {
        const response = await axios.put(`${API}/${id}/payment-links/${linkId}/custom-fields/${customFieldId}`, customFieldData);
        return response.data;
    } catch (error) {
        console.error("Error updating invoice payment link custom field:", error);
        throw error;
    }
};

export const deleteInvoicePaymentLinkCustomField = async (id: string, linkId: string, customFieldId: string) => {
    try {
        const response = await axios.delete(`${API}/${id}/payment-links/${linkId}/custom-fields/${customFieldId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting invoice payment link custom field:", error);
        throw error;
    }
};

export const getInvoicePaymentLinkDiscounts = async (id: string, linkId: string) => {
    try {
        const response = await axios.get(`${API}/${id}/payment-links/${linkId}/discounts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice payment link discounts:", error);
        throw error;
    }
};

export const addInvoicePaymentLinkDiscount = async (id: string, linkId: string, discountData: any) => {
    try {
        const response = await axios.post(`${API}/${id}/payment-links/${linkId}/discounts`, discountData);
        return response.data;
    } catch (error) {
        console.error("Error adding invoice payment link discount:", error);
        throw error;
    }
};

export const updateInvoicePaymentLinkDiscount = async (id: string, linkId: string, discountId: string, discountData: any) => {
    try {
        const response = await axios.put(`${API}/${id}/payment-links/${linkId}/discounts/${discountId}`, discountData);
        return response.data;
    } catch (error) {
        console.error("Error updating invoice payment link discount:", error);
        throw error;
    }
};

