import React, { useEffect, useState } from "react";
import { useRegisterMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";

const Register = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });
    const { name, email, password } = user;

    const [register, { isLoading, error, data, isSuccess }] =
        useRegisterMutation();

    // ✅ succès
    useEffect(() => {
        if (isSuccess) {
            toast.success("Compte created successfuly");
            navigate("/login");
        }
    }, [isSuccess, navigate]);
    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message || "register failed");
        }
    }, [data, error]);

    const submitHandler = (e) => {
        e.preventDefault();
        //  body (username , email, password)
        const signupData = { name, email, password };
        register(signupData);
        //  une fois register est faite , je redirige vers login
    };
    const onChange = (e) => {
        //    on le cible chaque input et on lui donne la nouvel valeur
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    return (
        <>
            <MetaData title={"register"} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form
                        className="shadow rounded bg-body"
                        onSubmit={submitHandler}
                    >
                        <h2 className="mb-4">Register</h2>

                        <div className="mb-3">
                            <label htmlFor="name_field" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name_field"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={onChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label for="email_field" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name="email"
                                value={email}
                                onChange={onChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="password_field"
                                className="form-label"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name="password"
                                value={password}
                                onChange={onChange}
                            />
                        </div>

                        <button
                            id="register_button"
                            type="submit"
                            className="btn w-100 py-2"
                        >
                            {isLoading ? "Creating..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
