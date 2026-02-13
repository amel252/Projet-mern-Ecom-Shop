import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/features/cartSlice";

function PaymentSuccess() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //  déclarer sessionId ici pour pouvoir l'user dans jsx
    const sessionId = new URLSearchParams(window.location.search).get(
        "session_id"
    );
    useEffect(() => {
        //  vider le panier redux et localStorage
        dispatch(clearCart());
        localStorage.removeItem("cartItems");
        localStorage.removeItem("shippingInfo");

        //  redirection vers la page des commandes apres 1.5s

        const timer = setTimeout(() => {
            navigate("/me/orders");
        }, 1500);
        return () => clearTimeout(timer);
    }, [dispatch, navigate]);
    // session n'a pas besoin d'etre dans useEffect

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Payment confirmed</h2>
            <p>Redirect to dashboard orders... </p>
            {sessionId && (
                <p style={{ fontSize: "0.9rem", color: "#555" }}>
                    Stripe Session: {sessionId}
                </p>
            )}
        </div>
    );
}

export default PaymentSuccess;
