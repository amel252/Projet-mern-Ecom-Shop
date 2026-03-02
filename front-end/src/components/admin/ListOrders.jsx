// export default ListOrders;
import React, { useEffect } from "react";
import { useGetAdminOrdersQuery } from "../../redux/api/productsApi";
import { toast } from "react-hot-toast";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

const ListOrders = () => {
    const { data, isLoading, error } = useGetAdminOrdersQuery();

    useEffect(() => {
        if (error) {
            toast.error(
                error?.data?.message ||
                    "Erreur lors du chargement des commandes"
            );
        }
    }, [error]);

    const setOrders = () => {
        const orders = {
            columns: [
                { label: "ID", field: "id", sort: "asc" },
                {
                    label: "Payment Status",
                    field: "paymentStatus",
                    sort: "asc",
                },
                { label: "Order Status", field: "orderStatus", sort: "asc" },
                { label: "Actions", field: "actions", sort: "asc" },
            ],
            rows: [],
        };

        data?.orders?.forEach((order) => {
            orders.rows.push({
                id: order?._id,
                // ✅ Vérifie paymentInfo et renvoie "PENDING" si undefined
                paymentStatus: order?.paymentInfo?.status.toUpperCase(),
                orderStatus: order?.orderStatus || "Processing",
                actions: (
                    <>
                        <Link
                            className="btn btn-outline-primary btn-sm"
                            to={`/admin/orders/${order?._id}`}
                        >
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <Link className="btn btn-outline-danger btn-sm ms-2">
                            <i className="fa fa-trash"></i>
                        </Link>
                    </>
                ),
            });
        });

        return orders;
    };

    if (isLoading) return <Loader />;

    return (
        <AdminLayout>
            <MetaData title="All Orders" />
            <h3 className="my-5">{data?.orders?.length} Orders</h3>
            <MDBDataTable
                data={setOrders()}
                className="px-3"
                bordered
                striped
                hover
            />
        </AdminLayout>
    );
};

export default ListOrders;
