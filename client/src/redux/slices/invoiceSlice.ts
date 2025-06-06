import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInvoices, deleteInvoice, getInvoiceSetting, createInvoiceSetting } from '../../machine/invoice';

// Async thunk to fetch invoices
export const fetchInvoices = createAsyncThunk(
    'invoice/fetchInvoices',
    async (params, thunkAPI) => {
        try {
            const { currentPage, itemsPerPage, orgId } = params;
            const response = await getInvoices(currentPage, itemsPerPage, orgId);
            return response?.data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to load invoices');
        }
    }
);

// Async thunk to delete invoice
export const deleteInvoiceAsync = createAsyncThunk(
    'invoice/deleteInvoice',
    async (id, thunkAPI) => {
        try {
            await deleteInvoice(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to delete invoice');
        }
    }
);

// Async thunk to fetch invoice settings
export const fetchInvoiceSettings = createAsyncThunk(
    'invoiceSettings/fetchInvoiceSettings',
    async (orgId, thunkAPI) => {
        try {
            const response = await getInvoiceSetting(orgId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to load invoice settings');
        }
    }
);

// Async thunk to create or update invoice settings
export const saveInvoiceSettings = createAsyncThunk(
    'invoiceSettings/saveInvoiceSettings',
    async (payload, thunkAPI) => {
        try {
            const response = await createInvoiceSetting(payload);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to save invoice settings');
        }
    }
);

// Initial state with default settings structure
const initialState = {
    invoices: [],
    invoiceSettings: {
        company: {
            name: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            phone: '',
            email: '',
            website: '',
            logoUrl: '',
            gst: '',
            tan: '',
        },
        invoice: {
            prefix: '',
            nextNumber: '',
            terms: '',
            notes: '',
            defaultTax: 0,
            invoiceTypes: [],
        },
        payment: {
            bankName: '',
            accountName: '',
            accountNumber: '',
            ifscCode: '',
            upi: '',
        },
    },
    isLoading: false,
    saving: false,
    error: null,
};

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Invoices handling
        builder
            .addCase(fetchInvoices.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.invoices = action.payload;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteInvoiceAsync.fulfilled, (state, action) => {
                state.invoices = state.invoices.filter((inv) => inv._id !== action.payload);
            });

        // Invoice settings handling
        builder
            .addCase(fetchInvoiceSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInvoiceSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                // Merge response with default structure to avoid missing fields
                state.invoiceSettings = {
                    company: { ...initialState.invoiceSettings.company, ...action.payload.company },
                    invoice: {
                        ...initialState.invoiceSettings.invoice,
                        ...action.payload.invoice,
                        invoiceTypes: action.payload.invoice?.invoiceTypes ?? []
                    },
                    payment: { ...initialState.invoiceSettings.payment, ...action.payload.payment },
                };
            })
            .addCase(fetchInvoiceSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(saveInvoiceSettings.pending, (state) => {
                state.saving = true;
                state.error = null;
            })
            .addCase(saveInvoiceSettings.fulfilled, (state, action) => {
                state.saving = false;
                // Update invoiceSettings with latest saved data
                state.invoiceSettings = {
                    company: { ...initialState.invoiceSettings.company, ...action.payload.company },
                    invoice: {
                        ...initialState.invoiceSettings.invoice,
                        ...action.payload.invoice,
                        invoiceTypes: action.payload.invoice?.invoiceTypes ?? []
                    },
                    payment: { ...initialState.invoiceSettings.payment, ...action.payload.payment },
                };
            })
            .addCase(saveInvoiceSettings.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload;
            });
    },
});

export default invoiceSlice.reducer;
