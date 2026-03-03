import React, { useEffect, useState } from "react";
import { useGetAdminUsersQuery } from "../../redux/api/userApi";
import { toast } from "react-hot-toast";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import AdminLayout from "../layout/AdminLayout";
import { Link } from "react-router-dom";

const ListUsers = () => {
    const { data, isLoading, error } = useGetAdminUsersQuery();

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message);
        }
    }, [error]);
    const setUsers = () => {
        const users = {
            columns: [
                { label: "ID", field: "id", sort: "asc" },
                {
                    label: "Name",
                    field: "name",
                    sort: "asc",
                },
                { label: "Email", field: "email", sort: "asc" },
                { label: "Role", field: "role", sort: "asc" },
                { label: "Actions", field: "actions", sort: "asc" },
            ],
            rows: [],
        };
        data?.users?.forEach((user) => {
            users.rows.push({
                id: user?._id,
                name: user?.name,
                email: user?.email,
                role: user?.role,
                actions: (
                    <>
                        <Link
                            className="btn btn-outline-primary btn-sm"
                            to={"/admin/users"}
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

        return users;
    };
    if (isLoading) return <Loader />;
    return (
        <AdminLayout>
            <MetaData title="All Users" />
            <h3 className="my-5">{data?.users?.length} Users</h3>
            <MDBDataTable
                data={setUsers()}
                className="px-3"
                bordered
                striped
                hover
            />
        </AdminLayout>
    );
};

export default ListUsers;
