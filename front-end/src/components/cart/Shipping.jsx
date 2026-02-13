import React, { useEffect, useState } from "react";
import { saveShippingInfo } from "../../redux/features/cartSlice";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import { getNames } from "country-list";
import CheckoutSteps from "./CheckoutSteps";

function Shipping() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const countryNames = getNames();

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [country, setCountry] = useState("");

    const { ShippingInfo } = useSelector((state) => state.cart);

    useEffect(() => {
        if (ShippingInfo) {
            setAddress(ShippingInfo.address || "");
            setCity(ShippingInfo.city || "");
            setZipCode(ShippingInfo.zipCode || "");
            setPhoneNo(ShippingInfo.phoneNo || "");
            setCountry(ShippingInfo.country || "");
        }
    }, [ShippingInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            saveShippingInfo({ address, city, phoneNo, zipCode, country })
        );
        navigate("/confirm_order");
    };
    return (
        <>
            <MetaData title={"Shipping Info"} />
            <CheckoutSteps shipping />
            <div className="row wrapper mb-5">
                <div className="col-10 col-lg-5">
                    <form
                        onSubmit={submitHandler}
                        className="shadow rounded bg-body"
                        action="your_submit_url_here"
                        method="post"
                    >
                        <h2 className="mb-4">Shipping Info</h2>
                        <div className="mb-3">
                            <label
                                htmlFor="address_field"
                                className="form-label"
                            >
                                Address
                            </label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                name="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="city_field" className="form-label">
                                City
                            </label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                name="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phone_field" className="form-label">
                                Phone No
                            </label>
                            <input
                                type="tel"
                                id="phone_field"
                                className="form-control"
                                name="phoneNo"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="postal_code_field"
                                className="form-label"
                            >
                                Postal Code
                            </label>
                            <input
                                type="number"
                                id="postal_code_field"
                                className="form-control"
                                name="postalCode"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="country_field"
                                className="form-label"
                            >
                                Country
                            </label>
                            <select
                                id="country_field"
                                className="form-select"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    -- Select a country --
                                </option>
                                {countryNames.map((name) => (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn w-100 py-2"
                        >
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Shipping;
