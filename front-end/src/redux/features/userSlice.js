import { createSlice } from "@reduxjs/toolkit";

//  les infos de user avant l'authentification
const initialState = {
    //  au début n'est pax connecté est null
    user: null,
    //  false il n'est pas inscrit
    isAuthenticated: false,
    loading: true,
};
export const userSlice = createSlice({
    initialState,
    name: "userSlice",
    //  on rentre dans chaque element et on modifie l'état cad on passe de null a true (moment d'inscription)
    reducers: {
        setUser(state, action) {
            //  action c'est la réponse qu'on recoit
            state.user = action.payload;
            //  payload c'est les donnés qu'on envoit le corps (name, email, password)
        },
        setIsAuthenticated(state, action) {
            state.isAuthenticated = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        logoutUser(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
    },
});
export default userSlice.reducer;
export const { setUser, setIsAuthenticated, setLoading, logoutUser } =
    userSlice.actions;
