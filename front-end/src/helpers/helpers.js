export const getPriceQueryParams = (searchParams, key, value) => {
    const newParams = new URLSearchParams(searchParams);
    //  si l'url recois une valeur minimal il va mettre a jour (plus que )
    if (key === "min") {
        key = "price[gte]";
    } else if (key === "max") {
        key = "price[lte]";
    }
    //  si la valeur existe on va réasigné avec set
    if (value) {
        //  on a réasigné une nouvel valuer avec (gte/lte)et la valeur (prix)
        newParams.set(key, value);
    } else {
        //  si on supprime les valeur il revient a l'état initial
        newParams.delete(key);
    }
    return newParams;
};
export const calculateOrderCost = (cartItems) => {
    const itemsPrice = cartItems?.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    //  si la commande est inf a 200 euro livraison gratuite sinon 25e
    const shippingPrice = itemsPrice > 200 ? 0 : 25;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);
    return {
        itemsPrice: Number(itemsPrice).toFixed(2),
        shippingPrice,
        taxPrice,
        totalPrice,
    };
};
