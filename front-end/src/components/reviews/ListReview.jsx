import React from "react";
import renderStars from "../../utils/renderStars";

function ListReview({ reviews }) {
    return (
        <div>
            <div className="reviews w-75 container">
                <h3>Other's Reviews:</h3>
                <hr />
                {reviews?.map((review) => (
                    <div className="review-card my-3" key={review?._id}>
                        <div className="row">
                            <div className="col-1">
                                <img
                                    src={
                                        review?.user?.avatar
                                            ? review?.user?.avatar?.url
                                            : "../images/default_avatar.jpg"
                                    }
                                    alt="User Name"
                                    width="50"
                                    height="50"
                                    className="rounded-circle"
                                />
                            </div>
                            <div className="col-11">
                                {renderStars(review?.rating)}

                                <p className="review_user">
                                    {review?.user?.name}
                                </p>
                                <p className="review_comment">
                                    {review?.comment}
                                </p>
                            </div>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListReview;
