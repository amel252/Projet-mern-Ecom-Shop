import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQueryParams } from "../../helpers/helpers.js";
import { PRODUCT_CATEGORY } from "../../constants/constants.js";
import renderStars from "../../utils/renderStars.js";

const Filter = () => {
    //  valeur minimal et maximal
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");

    const navigate = useNavigate();
    let [searchParams] = useSearchParams();

    //  on combine 2 filtres (prix et category)
    useEffect(() => {
        setMin(searchParams.get("min") ?? "");
        setMax(searchParams.get("max") ?? "");

        // //  si il contient la valeur min , l'a mettre a jour
        // if (searchParams.has("min")) {
        //     setMin(Number(searchParams.get("min")));
        // } else {
        //     setMin(0);
        // }
        // if (searchParams.has("max")) {
        //     setMax(Number(searchParams.get("max")));
        // } else {
        //     setMax(0);
        // }
    }, [searchParams]);

    //  fonction price filter
    const handleButtonClick = (e) => {
        e.preventDefault();
        const updatedParams = new URLSearchParams(searchParams);
        //  Min
        if (min === "") updatedParams.delete("min");
        else updatedParams.set("min", Number(min));
        //  Max
        if (max === "") updatedParams.delete("max");
        else updatedParams.set("max", Number(max));

        navigate({
            pathname: window.location.pathname,
            search: updatedParams.toString(),
        });
    };

    const handleClick = (checkbox) => {
        const updatedParams = new URLSearchParams(searchParams);
        //  on récupere checkboxes
        const checkboxes = document.getElementsByName(checkbox.name);
        //  dans chaque tour de boucle , si il est !=  il sera pas actif
        checkboxes.forEach((item) => {
            if (item != checkbox) {
                item.checked = false;
            }
        });
        // si l'element est checked
        if (checkbox.checked) {
            updatedParams.set(checkbox.name, checkbox.value);
        } else {
            updatedParams.delete(checkbox.name);
        }
        navigate({
            pathname: window.location.pathname,
            search: updatedParams.toString(),
        });
    };

    return (
        <div className="border p-3 filter">
            <h3>Filters</h3>
            <hr />
            <h5 className="filter-heading mb-3">Price</h5>
            <form
                id="filter_form"
                className="px-2"
                onSubmit={handleButtonClick}
            >
                <div className="row">
                    <div className="col">
                        <input
                            type="text"
                            min="0"
                            className="form-control"
                            placeholder="Min ($)"
                            name="min"
                            value={min}
                            //  si la valeur existe on l'a prend et convertir en nombre sinon je prend 0
                            onChange={(e) =>
                                setMin(
                                    e.target.value ? Number(e.target.value) : 0
                                )
                            }
                        />
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Max ($)"
                            name="max"
                            value={max}
                            onChange={(e) =>
                                setMax(
                                    e.target.value ? Number(e.target.value) : 0
                                )
                            }
                        />
                    </div>
                    <div className="col">
                        <button type="submit" className="btn btn-primary">
                            GO
                        </button>
                    </div>
                </div>
            </form>
            <hr />
            <h5 className="mb-3">Category</h5>
            {PRODUCT_CATEGORY?.map((category) => (
                <div className="form-check" key={category}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="category"
                        id={`check_${category}`}
                        value={category}
                        checked={searchParams.get("category") === category}
                        onClick={(e) => {
                            handleClick(e.target);
                        }}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={`check_${category}`}
                    >
                        {category}
                    </label>
                </div>
            ))}

            <hr />
            <h5 className="mb-3">Ratings</h5>
            {/*  a chaque de tour de boucle je récupere une valeur  */}
            {[5, 4, 3, 2, 1].map((rating) => (
                <div className="form-check" key={rating}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="ratings"
                        id={`rating_${rating}`}
                        value={rating}
                        checked={
                            searchParams.get("ratings") === rating?.toString()
                        }
                        onClick={(e) => {
                            handleClick(e.target);
                        }}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={`check_${rating}`}
                    >
                        {renderStars(rating)}
                        {/* <span className="star-rating">★ ★ ★ ★ ★</span> */}
                    </label>
                </div>
            ))}

            {/* <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    name="ratings"
                    id="check8"
                    value="4"
                />
                <label className="form-check-label" htmlFor="check8">
                    <span className="star-rating">★ ★ ★ ★ ☆</span>
                </label>
            </div> */}
        </div>
    );
};

export default Filter;
