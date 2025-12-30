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
