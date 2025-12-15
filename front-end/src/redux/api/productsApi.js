import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//  création des api
//  récuperer nos produits
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
            }),
        }),
    }),
});
export const { useGetProductsQuery } = productApi;
