import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../layout/Loader";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    //  sin on mode loading affiche loader
    if (loading) return <Loader />;
    //  si n'est pas connecté redirige vers connexion
    if (!isAuthenticated) {
        return <Navigate to={"/login"} replace />;
    }
    return children;
};

export default ProtectedRoute;
