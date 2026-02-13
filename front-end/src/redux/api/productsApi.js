import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//  création des api,  récuperer nos produits (getProducts)
export const productApi = createApi({
    //  on réécri ce que on a mis dans const
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        // baseUrl: "http://localhost:4000/api/v1",
        baseUrl: "/api/v1",
        // envoyé  le token de l'utilisateur
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.user?.token;
            if (token) headers.set("Authorization", `Bearer${token}`);
            return headers;
        },
    }),
    tagTypes: ["Product"],

    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: "/products",
                //  on met sans spécification c deja travaillé dans home
                params: params,
            }),
        }),
        getProductDetails: builder.query({
            query: (id) => `/products/${id}`,
        }),
        createReview: builder.mutation({
            query: ({ productId, rating, comment }) => ({
                url: `/products/${productId}/reviews`,
                method: "POST",
                body: { rating, comment },
            }),
            invalidateTags: (result, error, { productId }) => [
                { type: "Product", id: productId },
            ],
        }),
    }),
});
export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateReviewMutation,
} = productApi;
