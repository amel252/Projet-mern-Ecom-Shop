import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userApi } from "./userApi";

//  création des api

export const authApi = createApi({
    //  on réécri ce que on a mis dans const
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1",
    }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query(body) {
                return {
                    url: "/register",
                    method: "POST",
                    body,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulFilled }) {
                try {
                    // une fois les donnés user sont envoyé
                    const { data } = await queryFulFilled;
                    await dispatch(userApi.endpoints.getMe.initiate(null));
                } catch (error) {
                    console.log(error);
                }
            },
            // async onQueryStarted(args, { dispatch, queryFulfilled }) {
            //     try {
            //         const { data } = await queryFulfilled;
            //         dispatch(setUser(data.user));
            //     } catch (error) {
            //         console.log(error);
            //     }
            // },
        }),
        login: builder.mutation({
            query(body) {
                return {
                    url: "/login",
                    method: "POST",
                    body,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulFilled }) {
                try {
                    // une fois les donnés user sont envoyé
                    const { data } = await queryFulFilled;
                    await dispatch(userApi.endpoints.getMe.initiate(null));
                } catch (error) {
                    console.log(error);
                }
            },
        }),
    }),
});
export const { useLoginMutation, useRegisterMutation } = authApi;
