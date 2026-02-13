import React from "react";
import Search from "./Search";
import { useGetMeQuery } from "../../redux/api/userApi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLazyLogoutQuery } from "../../redux/api/authApi";
import { logoutUser } from "../../redux/features/userSlice";
import { setCartItem } from "../../redux/features/cartSlice";

const Header = () => {
    const [logout] = useLazyLogoutQuery();
    const { isLoading } = useGetMeQuery();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    // console.log(user);
    const { cartItems } = useSelector((state) => state.cart);

    const logoutHandler = async () => {
        try {
            //  on appel la mutation
            await logout().unwrap();
            //  il fait le nettoyage
            dispatch(logoutUser());
            navigate("/login");
        } catch (error) {
            console.error("Signout error", error);
        }
    };

    return (
        <nav className="navbar row">
            <div className="col-12 col-md-3 ps-5">
                <div className="navbar-brand">
                    <Link to="/">
                        <img
                            src="../images/shopit_logo.png"
                            alt="ShopIT Logo"
                        />
                    </Link>
                </div>
            </div>
            <div className="col-12 col-md-6 mt-2 mt-md-0">
                <Search />
            </div>
            <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                <Link to="/cart" style={{ textDecoration: "none" }}>
                    <span id="cart" className="ms-3">
                        Cart
                    </span>
                    <span className="ms-1" id="cart_count">
                        {cartItems?.length}
                    </span>
                </Link>
                {user ? (
                    <div className="ms-4 dropdown">
                        <button
                            className="btn dropdown-toggle text-white"
                            type="button"
                            id="dropDownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <figure className="avatar avatar-nav">
                                <img
                                    className="rounded-circle img-fluid"
                                    src={
                                        user?.avatar
                                            ? user?.avatar.url
                                            : "/images/default_avatar.jpg"
                                    }
                                    alt={user?.name}
                                />
                            </figure>
                            <span>{user.name}</span>
                        </button>
                        <div
                            className="dropdown-menu w-100"
                            aria-labelledby="dropDownMenuButton"
                        >
                            <Link
                                className="dropdown-item"
                                to="/admin/dashboard"
                            >
                                {" "}
                                Dashboard{" "}
                            </Link>

                            <Link className="dropdown-item" to="/me/orders">
                                {" "}
                                Orders{" "}
                            </Link>

                            <Link className="dropdown-item" to="/me/profile">
                                {" "}
                                Profile{" "}
                            </Link>

                            <Link
                                onClick={logoutHandler}
                                className="dropdown-item text-danger"
                                to="/"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="btn ms-4" id="login_btn">
                        {" "}
                        Login{" "}
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Header;
