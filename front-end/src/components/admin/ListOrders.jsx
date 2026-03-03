// export default ListOrders;
import React, { useEffect } from "react";
import {
    useGetAdminOrdersQuery,
    useDeleteOrderMutation,
} from "../../redux/api/orderApi";
import { toast } from "react-hot-toast";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

const ListOrders = () => {
    const { data, isLoading, error } = useGetAdminOrdersQuery();
    const [
        deleteOrder,
        { error: deleteError, isLoading: isDeleteLoading, isSuccess },
    ] = useDeleteOrderMutation();

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message);
        }
        if (deleteOrder) {
            toast.error(deleteError?.data?.message);
        }
        if (isSuccess) {
            toast.success("Order deleted");
        }
    }, [error, deleteError, isSuccess]);

    const deleteOrderHandler = async (id) => {
        try {
            await deleteOrder(id).unwrap();
            //  unwrap permet de recup l'erreur si existe
        } catch (err) {
            toast.error(err?.data?.message || "Delete failed");
        }
    };
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
                        <Link
                            className="btn btn-outline-danger btn-sm ms-2"
                            onClick={() => deleteOrderHandler(order?._id)}
                            disabled={isDeleteLoading}
                        >
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
