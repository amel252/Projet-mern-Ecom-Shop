import "./App.css";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import useUserRoute from "./components/routes/UserRoute";
import useAdminRoute from "./components/routes/AdminRoute";

function App() {
    const userRoutes = useUserRoute();
    const adminRoutes = useAdminRoute();

    return (
        <Router>
            <div className="App">
                <Toaster position="top-center" />
                {/* la position par default est a droite en haut  */}
                <Header position="top-center" />
                <Routes>
                    {userRoutes}
                    {adminRoutes}
                </Routes>

                <Footer />
            </div>
        </Router>
    );
}

export default App;
