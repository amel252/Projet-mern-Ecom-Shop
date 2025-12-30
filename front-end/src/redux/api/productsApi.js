import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//  création des api
//  récuperer nos produits (getProducts)
export const productApi = createApi({
    //  on réécri ce que on a mis dans const
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1",
    }),
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
    }),
});
export const { useGetProductsQuery, useGetProductDetailsQuery } = productApi;
