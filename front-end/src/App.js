import "./App.css";
//  import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
//  importer les composants
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UploadAvatar from "./components/user/UploadAvatar";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

function App() {
    return (
        <Router>
            <div className="App">
                <Toaster />
                {/* la position par default est a droite en haut  */}
                <Header position="top-center" />
                <Routes>
                    {/* routes produits  */}
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    {/*  routes authentificate */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/password/forgot"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/password/reset/:token"
                        element={<ResetPassword />}
                    />
                    <Route
                        path="/me/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/me/update_profile"
                        element={
                            <ProtectedRoute>
                                <UpdateProfile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/me/upload_avatar"
                        element={
                            <ProtectedRoute>
                                <UploadAvatar />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/me/update_password"
                        element={
                            <ProtectedRoute>
                                <UpdatePassword />
                            </ProtectedRoute>
                        }
                    />
                </Routes>

                <Footer />
            </div>
        </Router>
    );
}

export default App;
