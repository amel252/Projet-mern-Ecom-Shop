import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQueryParams } from "../../helpers/helpers.js";
import { PRODUCT_CATEGORY } from "../../constants/constants.js";

const Filter = () => {
    //  valeur minimal et maximal
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    const navigate = useNavigate();
    let [searchParams] = useSearchParams();

    //  on combine 2 filtres (prix et category)
    useEffect(() => {
        //  si il contient la valeur min , l'a mettre a jour
        if (searchParams.has("min")) {
            setMin(Number(searchParams.get("min")));
        } else {
            setMin(0);
        }
        if (searchParams.has("max")) {
            setMax(Number(searchParams.get("max")));
        } else {
            setMax(0);
        }
    }, [searchParams]);

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
    //  fonction price filter
    const handleButtonClick = (e) => {
        e.preventDefault();
        //  si la valeur minimal que j'ai mis existe ? je la prend sinon je reste sur 0
        const validateMin = min ? min : 0;
        const validateMax = max ? max : 0;

        let updatedParams = getPriceQueryParams(
            searchParams,
            "min",
            validateMin
        );
        //  je rajoute la valeur maximal
        updatedParams = getPriceQueryParams(updatedParams, "max", validateMax);
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

            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    name="ratings"
                    id="check7"
                    value="5"
                />
                <label className="form-check-label" htmlFor="check7">
                    <span className="star-rating">★ ★ ★ ★ ★</span>
                </label>
            </div>
            <div className="form-check">
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
            </div>
        </div>
    );
};

export default Filter;
