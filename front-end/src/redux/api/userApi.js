import React from "react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setInAuthenticated, setUser, setLoading } from "../features/userSlice";

// creation de l'api

export const userApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1",
    }),
    //  cela nous permet d'enregistrer user dans local storage ,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getMe: builder.query({
            query: "/me",
            transformResponse: (result) => result.user,
            async onQueryStarted(args, { dispatch, queryFulFilled }) {
                try {
                    // une fois les donnés user sont envoyé
                    const { data } = await queryFulFilled;
                    dispatch(setUser(data));
                    //  passe a true quand l'enregistrement est passé
                    dispatch(setInAuthenticated(true));
                    dispatch(setLoading(false));
                    // console.log(error);
                } catch (error) {
                    dispatch(setLoading(false));
                    console.log(error);
                }
            },
            providesTags: ["User"],
        }),
    }),
});

export const { useGetMeQuery } = userApi;
