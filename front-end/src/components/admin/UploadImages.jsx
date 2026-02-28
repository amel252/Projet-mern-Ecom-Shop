import React, { useEffect, useState, useRef } from "react";
import {
    useGetProductDetailsQuery,
    useUploadProductImageMutation,
    useDeleteProductImageMutation,
} from "../../redux/api/productsApi";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";

import AdminLayout from "../layout/AdminLayout";

const UploadImages = () => {
    const navigate = useNavigate();
    const params = useParams();
    const fileInputRef = useRef(null);

    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    //  mutation RTK pour upload img
    const [uploadProductImage, { isLoading, error, isSuccess }] =
        useUploadProductImageMutation();
    const { data, refetch } = useGetProductDetailsQuery(params?.id);
    //  RTK suppression
    const [
        deleteProductImage,
        { isLoading: isDeleteLoading, error: deleteError },
    ] = useDeleteProductImageMutation();

    // useEffect(() => {
    //     if (data?.product) {
    //         setUploadedImages(data?.product?.images);
    //     }
    //     if (error) {
    //         toast.error(data?.product?.message);
    //     }
    //     if (isSuccess) {
    //         setImagesPreview([]);
    //         toast.success("Images Uploaded");
    //         navigate("/admin/products");
    //     }
    // }, [data, error, isSuccess, navigate, isDeleteLoading, deleteError]);
    useEffect(() => {
        if (data?.product?.images) {
            setUploadedImages(data.product.images);
        }
    }, [data?.product?.images]);

    useEffect(() => {
        if (deleteError) {
            toast.error(deleteError?.data?.message || "Delete failed");
        }
    }, [deleteError]);

    const onChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setImagesPreview(previews);
    };

    const handleResetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImagePreviewDelete = (imageUlr) => {
        const index = imagesPreview.findIndex((img) => img === imageUlr);

        if (index !== -1) {
            const newPreviews = [...imagesPreview];
            const newFiles = [...images];

            newPreviews.splice(index, 1);
            newFiles.splice(index, 1);

            setImages(newFiles);
            setImagesPreview(newPreviews);
        }
    };
    //  soummission du formulaire
    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        images.forEach((file) => formData.append("images", file));

        await uploadProductImage({ id: params.id, body: formData });
    };

    //  deleteImg
    const deleteImage = (imgId) => {
        deleteProductImage({ id: params?.id, body: { imgId } });
    };
    return (
        <AdminLayout>
            <MetaData title={"Upload Product Images"} />
            <div className="row wrapper">
                <div className="col-10 col-lg-8 mt-5 mt-lg-0">
                    <form
                        className="shadow rounded bg-body"
                        encType="multipart/form-data"
                        onSubmit={submitHandler}
                    >
                        <h2 className="mb-4">Upload Product Images</h2>

                        <div className="mb-3">
                            <label htmlFor="customFile" className="form-label">
                                Choose Images
                            </label>

                            <div className="custom-file">
                                <input
                                    ref={fileInputRef}
                                    onChange={onChange}
                                    type="file"
                                    name="images"
                                    className="form-control"
                                    id="customFile"
                                    multiple
                                    onClick={handleResetFileInput}
                                />
                            </div>
                            {imagesPreview?.length > 0 && (
                                <div className="new-images my-4">
                                    <p className="text-warning">New Images:</p>
                                    <div className="row mt-4">
                                        {imagesPreview?.map((img, index) => (
                                            <div
                                                className="col-md-3 mt-2"
                                                key={index}
                                            >
                                                <div className="card">
                                                    <img
                                                        src={img}
                                                        alt="Card"
                                                        className="card-img-top p-2"
                                                        style={{
                                                            width: "100%",
                                                            height: "80%",
                                                        }}
                                                    />
                                                    <button
                                                        style={{
                                                            backgroundColor:
                                                                "#dc3545",
                                                            borderColor:
                                                                "#dc3545",
                                                        }}
                                                        type="button"
                                                        className="btn btn-block btn-danger cross-button mt-1 py-0"
                                                        onClick={() =>
                                                            handleImagePreviewDelete(
                                                                img
                                                            )
                                                        }
                                                    >
                                                        <i className="fa fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Uploaded Images */}

                            {uploadedImages?.length > 0 && (
                                <div className="uploaded-images my-4">
                                    <p className="text-success">
                                        Product Uploaded Images:
                                    </p>
                                    <div className="row mt-1">
                                        {uploadedImages?.map((img, index) => (
                                            <div
                                                className="col-md-3 mt-2"
                                                key={index}
                                            >
                                                <div className="card">
                                                    <img
                                                        src={img.url}
                                                        alt="Card"
                                                        className="card-img-top p-2"
                                                        style={{
                                                            width: "100%",
                                                            height: "80%",
                                                        }}
                                                    />
                                                    <button
                                                        style={{
                                                            backgroundColor:
                                                                "#dc3545",
                                                            borderColor:
                                                                "#dc3545",
                                                        }}
                                                        className="btn btn-block btn-danger cross-button mt-1 py-0"
                                                        disabled={
                                                            isLoading ||
                                                            isDeleteLoading
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            deleteImage(
                                                                img?.public_id
                                                            )
                                                        }
                                                    >
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            disabled={isLoading || isDeleteLoading}
                            id="register_button"
                            type="submit"
                            className="btn w-100 py-2"
                        >
                            {isLoading ? "Uploading..." : "Upload"}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UploadImages;
