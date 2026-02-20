import React, { useEffect, useState } from "react";
import { useGetProductDetailsQuery } from "../../redux/api/productsApi";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import renderStars from "../../utils/renderStars";
import Loader from "../layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "../../redux/features/cartSlice";
import NewReview from "../reviews/NewReview";
import ListReview from "../reviews/ListReview";

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1);

    const [activeImg, setActiveImg] = useState("");
    const params = useParams();
    const dispatch = useDispatch();
    const { data, isLoading, error, isError } = useGetProductDetailsQuery(
        params.id
    );
    console.log(data);

    const { isAuthenticated } = useSelector((state) => state.auth);

    const product = data?.product;

    useEffect(() => {
        setActiveImg(
            product?.images[0]
                ? product.images[0]?.url
                : "/images/default_product.png"
        );
    }, [product]);

    //  si on a un souci avec la récup du data
    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message || "Error is occured");
        }
    }, [isError, error]);
    // fonction de quantity

    const increaseQty = () => {
        //  input count ciblé
        const count = document.querySelector(".count");
        //  si le produit est dispo dans le stock
        if (count.valueAsNumber >= product.stock) return;
        setQuantity(count.valueAsNumber + 1);
    };
    const decreaseQty = () => {
        //  input count ciblé
        const count = document.querySelector(".count");
        //  si le produit est dispo dans le stock
        if (count.valueAsNumber <= 1) return;

        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    };

    const setItemToCart = () => {
        const cartItem = {
            product: product?._id,
            name: product?.name,
            price: product?.price,
            image: product?.images[0]?.url,
            stock: product?.stock,
            quantity,
        };
        dispatch(setCartItem(cartItem));
        toast.success("Produit ajouté au panier");
    };
    if (isLoading) return <Loader />;
    if (!product) return null;
    return (
        <>
            <MetaData title={product?.name || "Product details"} />

            <div className="row d-flex justify-content-around container">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <div className="p-3">
                        <img
                            className="d-block"
                            src={activeImg}
                            alt={product.name}
                            width="320"
                            height="260"
                        />
                    </div>
                    <div className="row justify-content-start mt-5">
                        {product?.images?.map((img) => (
                            <div key={img._id} className="col-2 ms-4 mt-2">
                                <a role="button">
                                    <img
                                        className={`d-block border rounded p-3 cursor-pointer ${
                                            img.url === activeImg
                                                ? "border-warning"
                                                : ""
                                        }`}
                                        height="100"
                                        width="100"
                                        src={img?.url}
                                        alt={img.name}
                                        onClick={(e) => setActiveImg(img.url)}
                                    />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-12 col-lg-5 mt-5">
                    <h3>{product?.name}</h3>
                    <p id="product_id">Product # {product?._id}</p>

                    <hr />

                    <div className="d-flex">
                        {renderStars(product?.ratings)}
                        <span id="no-of-reviews" className="pt-1 ps-2">
                            ({product?.numOfReviews || 0} Reviews)
                        </span>
                    </div>
                    <hr />

                    <p id="product_price">${product?.price}</p>
                    <div className="stockCounter d-inline">
                        <span
                            className="btn btn-danger minus"
                            onClick={decreaseQty}
                        >
                            -
                        </span>
                        <input
                            type="number"
                            className="form-control count d-inline"
                            value={quantity}
                            readOnly
                        />
                        <span
                            className="btn btn-primary plus"
                            onClick={increaseQty}
                        >
                            +
                        </span>
                    </div>
                    <button
                        type="button"
                        id="cart_btn"
                        className="btn btn-primary d-inline ms-4"
                        disabled={product?.stock <= 0}
                        onClick={setItemToCart}
                    >
                        Add to Cart
                    </button>

                    <hr />

                    <p>
                        Status:{" "}
                        <span
                            id="stock_status"
                            className={
                                product?.stock > 0 ? "greenColor" : "redColor"
                            }
                        >
                            {product?.stock > 0 ? "In stock" : "Out of stock"}
                        </span>
                    </p>

                    <hr />

                    <h4 className="mt-2">Description:</h4>
                    <p>{product?.description}</p>
                    <hr />
                    <p id="product_seller mb-3">
                        Sold by: <strong>{product?.seller}</strong>
                    </p>
                    {/* component */}
                    {isAuthenticated ? (
                        <NewReview productId={product._id} />
                    ) : (
                        <div className="alert alert-danger my-5" type="alert">
                            Login to post your review.
                        </div>
                    )}
                </div>
            </div>
            {product?.reviews?.length > 0 && (
                <ListReview reviews={product?.reviews} />
            )}
        </>
    );
};

export default ProductDetails;
