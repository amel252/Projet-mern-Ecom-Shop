import React, { useEffect, useState } from "react";
import { useGetAdminProductsQuery } from "../../redux/api/productsApi";
import { toast } from "react-hot-toast";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

const ListProducts = () => {
    const { data, isLoading, error } = useGetAdminProductsQuery();
    console.log(data);

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message);
        }
    }, [error]);
    const setProducts = () => {
        const products = {
            columns: [
                { label: "ID", field: "id", sort: "asc" },
                { label: "Name", field: "name", sort: "asc" },
                { label: "Stock", field: "stock", sort: "asc" },
                { label: "Actions", field: "actions", sort: "asc" },
            ],
            rows: [],
        };
        data?.products?.forEach((p) => {
            products.rows.push({
                id: p?._id,
                name: `${p?.name?.substring(0, 20)}...`,
                stock: p?.stock,
                actions: (
                    <>
                        <Link
                            className="btn btn-outline-primary btn-sm ms-2"
                            to={`/admin/products/${p?._id}`}
                        >
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <Link
                            className="btn btn-outline-success btn-sm ms-2"
                            to={`/admin/products/${p?._id}/upload_images`}
                        >
                            <i className="fa fa-image"></i>
                        </Link>
                        <Link className="btn btn-outline-danger btn-sm ms-2">
                            <i className="fa fa-trash"></i>
                        </Link>
                    </>
                ),
            });
        });
        return products;
    };
    if (isLoading) return <Loader />;

    return (
        <div>
            <AdminLayout>
                <MetaData title={"All products"} />
                <h3 className="my-5">{data?.products?.length} Products</h3>
                <MDBDataTable
                    data={setProducts()}
                    className="px-3"
                    bordered
                    striped
                    hover
                />
            </AdminLayout>
        </div>
    );
};

export default ListProducts;
