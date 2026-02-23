import React from "react";
import { Link } from "react-router-dom";
import renderStars from "../../utils/renderStars";

// product c notre props pour qu'on puisse l'utiliser dans home
const ProductItem = ({ product, columnSize = 4 }) => {
    return (
        // `col-sm-12 col-md-6 col-lg-${columnSize} my-3`
        <div className={`col-6 col-md-4 col-lg-${columnSize} my-3`}>
            <div className="card product-card h-100 p-2">
                {/* card p-3 rounded  */}
                <img
                    className="card-img-top product-img"
                    src={product?.images[0]?.url}
                    alt={product.name}
                />
                {/* card-body ps-3 d-flex justify-content-center flex-column */}
                <div className=" card-body d-flex flex-column align-items-center">
                    <h6 className="card-title mb-1 ">
                        <Link to={`product/${product?._id}`}>
                            {product.name}
                        </Link>
                    </h6>
                    <div className="ratings mt-auto d-flex align-items-center mb-1">
                        <div className="star-ratings mt-auto d-flex align-items-center">
                            {renderStars(product?.ratings)}
                        </div>
                        <span
                            id="no_of_reviews"
                            className="ms-2 text-muted small"
                        >
                            {product?.numOfReviews || 0}
                        </span>
                    </div>
                    <p className="card-text mt-2 fw-bold mb-2">
                        ${product?.price}
                    </p>
                    {/*  voir les détails du produit */}
                    <Link
                        to={`/product/${product?._id}`}
                        id="view_btn"
                        className="btn btn-sm btn-primary mt-auto"
                    >
                        View details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
