import { createSlice } from "@reduxjs/toolkit";

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
        setInAuthenticated(state, action) {
            state.isAuthenticated = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
    },
});
export default userSlice.reducer;
export const { setUser, setInAuthenticated, setLoading } = userSlice.actions;
