import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const customer_register = createAsyncThunk(
    'auth/customer_register',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/customer/customer-register', info)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Network error' })
        }
    }
)

export const customer_login = createAsyncThunk(
    'auth/customer_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/customer/customer-login', info)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Network error' })
        }
    }
)

// Fetches the current user from the HttpOnly customerToken cookie. Called on
// app mount to rehydrate auth state, since JS can no longer read the cookie.
export const customer_fetch_me = createAsyncThunk(
    'auth/customer_fetch_me',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/customer/me')
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Not authenticated' })
        }
    }
)

export const customer_logout = createAsyncThunk(
    'auth/customer_logout',
    async (_, { fulfillWithValue }) => {
        try {
            await api.get('/customer/logout')
        } catch (_error) {
            // ignore — we still clear local state below
        }
        return fulfillWithValue(true)
    }
)


export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        loader: false,
        userInfo: '',
        authChecked: false,
        errorMessage: '',
        successMessage: '',
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = ""
            state.successMessage = ""
        },
        user_reset: (state) => {
            state.userInfo = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(customer_register.pending, (state) => {
                state.loader = true;
            })
            .addCase(customer_register.rejected, (state, { payload }) => {
                state.errorMessage = payload?.error || 'Registration failed';
                state.loader = false;
            })
            .addCase(customer_register.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.loader = false;
                state.userInfo = payload.userInfo || '';
            })

            .addCase(customer_login.pending, (state) => {
                state.loader = true;
            })
            .addCase(customer_login.rejected, (state, { payload }) => {
                state.errorMessage = payload?.error || 'Login failed';
                state.loader = false;
            })
            .addCase(customer_login.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.loader = false;
                state.userInfo = payload.userInfo || '';
            })

            .addCase(customer_fetch_me.fulfilled, (state, { payload }) => {
                state.userInfo = payload.userInfo;
                state.authChecked = true;
            })
            .addCase(customer_fetch_me.rejected, (state) => {
                state.userInfo = '';
                state.authChecked = true;
            })

            .addCase(customer_logout.fulfilled, (state) => {
                state.userInfo = '';
            })
    }
})
export const { messageClear, user_reset } = authReducer.actions
export default authReducer.reducer
