import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//  création des api
//  récuperer nos produits (getProducts)
export const orderApi = createApi({
    //  on réécri ce que on a mis dans const
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/v1",
    }),
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth?.user?.token;
        console.log("User token in prepareHeaders:", token);
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },

    endpoints: (builder) => ({
        createNewOrder: builder.mutation({
            query(body) {
                return {
                    url: "/orders/new",
                    method: "POST",
                    body,
                };
            },
        }),
        stripeCheckoutSession: builder.mutation({
            query(body) {
                return {
                    url: "/payment/checkout_session",
                    method: "POST",
                    body,
                };
            },
        }),
        myOrders: builder.query({
            query: () => `/me/orders`,
        }),
        orderDetails: builder.query({
            query: (id) => `/orders/${id}`,
        }),
    }),
});
export const {
    useCreateNewOrderMutation,
    useStripeCheckoutSessionMutation,
    useMyOrdersQuery,
    useOrderDetailsQuery,
} = orderApi;
