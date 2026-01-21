import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setUser, setLoading } from "../features/userSlice";
import UpdateProfile from "../../components/user/UpdateProfile";

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
        UpdateProfile: builder.mutation({
            query(body) {
                return {
                    url: "/me/update",
                    method: "PUT",
                    body,
                };
            },
            providesTags: ["User"],
        }),
        uploadAvatar: builder.mutation({
            query(body) {
                return {
                    url: "/me/upload_avatar",
                    method: "PUT",
                    body,
                };
            },
            providesTags: ["User"],
        }),
        updatePassword: builder.mutation({
            query(body) {
                return {
                    url: "/password/update",
                    method: "PUT",
                    body,
                };
            },
        }),
        forgotPassword: builder.mutation({
            query(body) {
                return {
                    url: "/password/forgot",
                    method: "POST",
                    body,
                };
            },
        }),
        resetPassword: builder.mutation({
            query({ token, body }) {
                return {
                    url: `/password/reset/${token}`,
                    method: "PUT",
                    body,
                };
            },
        }),
    }),
});

export const {
    useGetMeQuery,
    useUpdateProfileMutation,
    useUploadAvatarMutation,
    useUpdatePasswordMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = userApi;
