import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: localStorage.getItem("cartItems")
        ? //  si l'user a mis des produits dans le panier  return moi ces produits
          JSON.parse(localStorage.getItem("cartItems"))
        : //  sinon retourne tableau vide
          [],
};

export const cartSlice = createSlice({
    initialState,
    name: "cartSlice",
    reducers: {
        setCartItem: (state, actions) => {
            //  item ajouté par user dans le panier
            const item = actions.payload;
            console.log(item);
            //  verif produit existe, on va les comparé
            const isItemExist = state.cartItems.find(
                (i) => i.product === item.product
            );
            //  si produit exist on met a jour le panier
            if (isItemExist) {
                state.cartItems = state.cartItems.map((i) =>
                    //  si product existe , sion garde moi le panier comme avant
                    i.product === isItemExist.product ? item : i
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            //  mettre a jour notre panier
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        removeCartItem: (state, action) => {
            //  on filtre et o, récupere l'element filtré pour comparé avec celui envoyé
            state.cartItems = state?.cartItems?.filter(
                (i) => i.product !== action.payload
            );
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        saveShippingInfo: (state, action) => {
            state.saveShippingInfo = action.payload;
            localStorage.setItem(
                "shippingInfo",
                JSON.stringify(state.shippingInfo)
            );
        },
    },
});
export default cartSlice.reducer;
export const { setCartItem, removeCartItem, saveShippingInfo } =
    cartSlice.actions;
