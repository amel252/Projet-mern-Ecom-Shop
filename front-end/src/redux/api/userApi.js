import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setUser, setLoading } from "../features/userSlice";

// creation de l'api

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1",
        credentials: "include", // ⚠️ IMPORTANT si cookies / JWT httpOnly
    }),
    //  cela nous permet d'enregistrer user dans local storage ,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => `/me`,
            transformResponse: (result) => result.user,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true)); // chatgpt
                try {
                    // une fois les donnés user sont envoyé
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data));
                    //  passe a true quand l'enregistrement est passé
                    dispatch(setIsAuthenticated(true));
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
