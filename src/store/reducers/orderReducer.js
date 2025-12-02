import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const place_order = createAsyncThunk(
    'order/place_order',
    async({ price, products, shipping_fee, items, shippingInfo, userId, navigate }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/home/order/place-order', {
                price, products, shipping_fee, items, shippingInfo, userId
            })

            // Navigate after successful order placement
            setTimeout(() => {
                navigate('/payment', {
                    state: {
                        price: price + shipping_fee,
                        items,
                        orderId: data.orderId
                    }
                })
            }, 100)

            return fulfillWithValue({
                ...data,
                totalPrice: price + shipping_fee,
                items
            })
        } catch (error) {
            console.log('Place order error:', error.response)
            return rejectWithValue(error.response?.data || { error: 'Failed to place order' })
        }
    }
)
// End Method

export const create_paynow_payment = createAsyncThunk(
    'order/create_paynow_payment',
    async({ orderId, price, email }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/order/paynow/create', { orderId, price, email })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
// End Method

export const create_paynow_mobile = createAsyncThunk(
    'order/create_paynow_mobile',
    async({ orderId, price, email, phone, method }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/order/paynow/mobile', { orderId, price, email, phone, method })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
// End Method

export const check_paynow_status = createAsyncThunk(
    'order/check_paynow_status',
    async(orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/order/paynow/status/${orderId}`)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
// End Method

export const confirm_cod_order = createAsyncThunk(
    'order/confirm_cod_order',
    async(orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/order/cod/confirm/${orderId}`)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
// End Method

export const get_orders = createAsyncThunk(
    'order/get_orders',
    async({ customerId, status }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/coustomer/get-orders/${customerId}/${status}`)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
// End Method

export const get_order_details = createAsyncThunk(
    'order/get_order_details',
    async(orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/coustomer/get-order-details/${orderId}`)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
// End Method 
 


export const orderReducer = createSlice({
    name: 'order',
    initialState: {
        myOrders: [],
        errorMessage: '',
        successMessage: '',
        myOrder: {},
        loader: false,
        paynowRedirectUrl: '',
        paymentStatus: ''
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        },
        clearPaymentState: (state, _) => {
            state.paynowRedirectUrl = ''
            state.paymentStatus = ''
        },
        updateOrderDeliveryDetails: (state, { payload }) => {
            // Update delivery details in real-time via socket
            if (state.myOrder) {
                state.myOrder = {
                    ...state.myOrder,
                    deliveryDetails: payload
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Place order
            .addCase(place_order.pending, (state) => {
                state.loader = true;
            })
            .addCase(place_order.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = 'Order placed successfully';
            })
            .addCase(place_order.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Failed to place order';
            })
            .addCase(get_orders.fulfilled, (state, { payload }) => {
                state.myOrders = payload.orders;
            })
            .addCase(get_order_details.fulfilled, (state, { payload }) => {
                state.myOrder = payload.order;
            })
            // Paynow web payment
            .addCase(create_paynow_payment.pending, (state) => {
                state.loader = true;
            })
            .addCase(create_paynow_payment.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.paynowRedirectUrl = payload.redirectUrl;
                state.successMessage = 'Redirecting to payment...';
            })
            .addCase(create_paynow_payment.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Payment failed';
            })
            // Paynow mobile payment
            .addCase(create_paynow_mobile.pending, (state) => {
                state.loader = true;
            })
            .addCase(create_paynow_mobile.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.instructions || 'Check your phone to complete payment';
            })
            .addCase(create_paynow_mobile.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Mobile payment failed';
            })
            // Check payment status
            .addCase(check_paynow_status.fulfilled, (state, { payload }) => {
                state.paymentStatus = payload.paid ? 'paid' : payload.status;
            })
            // COD confirmation
            .addCase(confirm_cod_order.pending, (state) => {
                state.loader = true;
            })
            .addCase(confirm_cod_order.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(confirm_cod_order.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'COD confirmation failed';
            })
    }
})
export const { messageClear, clearPaymentState, updateOrderDeliveryDetails } = orderReducer.actions
export default orderReducer.reducer