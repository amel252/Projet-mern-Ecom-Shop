import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//  création des api,  récuperer nos produits (getProducts)
export const productApi = createApi({
    //  on réécri ce que on a mis dans const
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1",
        credentials: "include",
    }),
    //  pour rafrechir la page apres chaque modif
    tagTypes: ["Product", "AdminProducts", "Reviews"],

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
        //  tu cible le produit
        invalidateTags: ["product"],

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
        submitReview: builder.mutation({
            query(body) {
                return {
                    url: "/reviews",
                    method: "PUT",
                    body,
                };
            },
            invalidateTags: ["product"],
        }),
        canUserReview: builder.query({
            query: (productId) => `/can_review/?productId=${productId}`,
        }),
        getAdminProducts: builder.query({
            query: () => `/admin/products`,
        }),
        createProduct: builder.mutation({
            query(body) {
                return {
                    url: "/admin/products",
                    method: "POST",
                    body,
                };
            },
            invalidateTags: ["AdminProducts"],
        }),
        updateProduct: builder.mutation({
            query({ id, body }) {
                return {
                    url: `/products/${id}`,
                    method: "PUT",
                    body,
                };
            },
            //  on met "Product dans les tag pour que le rafrichissement se fait automatiquement"
            invalidateTags: ["AdminProducts", "Product"],
        }),
        uploadProductImage: builder.mutation({
            query({ id, body }) {
                return {
                    url: `/admin/products/${id}/upload_images`,
                    method: "PUT",
                    body,
                };
            },
            invalidateTags: ["AdminProducts", "Product"],
        }),
        deleteProductImage: builder.mutation({
            query({ id, body }) {
                return {
                    url: `/admin/products/${id}/delete_images`,
                    method: "PUT",
                    body,
                };
            },
            invalidateTags: ["AdminProducts", "Product"],
        }),
        deleteProduct: builder.mutation({
            query(id) {
                return {
                    url: `/admin/products/${id}`,
                    method: "DELETE",
                };
            },
            invalidateTags: ["AdminProducts", "Product"],
        }),
        getProductReviews: builder.query({
            query: (productId) => `/reviews?id=${productId}`,
            invalidateTags: ["Reviews"],
        }),
        //  c'est l'admin qui va supp le comment
        deleteReview: builder.mutation({
            query({ productId, id }) {
                return {
                    url: `/admin/reviews?productId=${productId}&id=${id}`,
                    method: "DELETE",
                };
            },
            invalidateTags: ["Reviews"],
        }),
    }),
});
export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateReviewMutation,
    useSubmitReviewMutation,
    useCanUserReviewQuery,
    useGetAdminProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductImageMutation,
    useDeleteProductMutation,
    useGetAdminOrdersQuery,
    useLazyGetProductReviewsQuery,
    useDeleteReviewMutation,
} = productApi;
