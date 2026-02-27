import React from "react";
import ProtectedRoute from "../auth/ProtectedRoute";
import Dashboard from "../admin/Dashboard";
import { Route } from "react-router-dom";
import ListProducts from "../admin/ListProducts";
import NewProduct from "../admin/NewProduct";
import UpdateProduct from "../admin/UpdateProduct";

const AdminRoute = () => {
    return (
        <>
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute admin={true}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/products"
                element={
                    <ProtectedRoute admin={true}>
                        <ListProducts />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/product/new"
                element={
                    <ProtectedRoute admin={true}>
                        <NewProduct />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/products/:id"
                element={
                    <ProtectedRoute admin={true}>
                        <UpdateProduct />
                    </ProtectedRoute>
                }
            />
        </>
    );
};

export default AdminRoute;
