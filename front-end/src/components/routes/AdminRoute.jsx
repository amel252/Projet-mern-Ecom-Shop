import React from "react";
import ProtectedRoute from "../auth/ProtectedRoute";
import Dashboard from "../admin/Dashboard";
import { Route } from "react-router-dom";

const AdminRoute = () => {
    return (
        <Route
            path="/admin/dashboard"
            element={
                <ProtectedRoute admin={true}>
                    <Dashboard />
                </ProtectedRoute>
            }
        />
    );
};

export default AdminRoute;
