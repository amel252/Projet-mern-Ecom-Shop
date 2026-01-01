import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//  création des api

export const authApi = createApi({
    //  on réécri ce que on a mis dans const
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1",
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query(body) {
                return {
                    url: "/login",
                    method: "POST",
                    body,
                };
            },
        }),
    }),
});
export const { useLoginMutation } = authApi;
