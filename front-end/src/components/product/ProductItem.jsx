import React from "react";
import { Link } from "react-router-dom";
import renderStars from "../../utils/renderStars";

// product c notre props pour qu'on puisse l'utiliser dans home
const ProductItem = ({ product }) => {
    return (
        <div class="col-sm-12 col-md-6 col-lg-3 my-3">
            <div class="card p-3 rounded">
                <img
                    class="card-img-top mx-auto"
                    src={product?.images[0]?.url}
                    alt={product.name}
                />
                <div class="card-body ps-3 d-flex justify-content-center flex-column">
                    <h5 class="card-title">
                        <Link to={`product/${product?._id}`}>
                            {product.name}
                        </Link>
                    </h5>
                    <div class="ratings mt-auto d-flex">
                        <div class="star-ratings mt-auto d-flex align-items-center">
                            {renderStars(product?.rating)}
                        </div>
                        <span
                            id="no_of_reviews"
                            className="pt-2 ps-2 text-muted"
                        >
                            {product?.numOfReviews || 0}
                        </span>
                    </div>
                    <p class="card-text mt-2">${product?.price}</p>
                    {/*  voir les détails du produit */}
                    <Link
                        to={`/product/${product?._id}`}
                        id="view_btn"
                        className="btn btn-block"
                    >
                        View details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
