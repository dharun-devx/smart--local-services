import React, { useState } from "react";
import { api } from "../services/api";

export default function Login({
    navigate,
    onLoginSuccess,
    params
}) {

    const [role, setRole] = useState("customer");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    // ==========================================
    // FORGOT PASSWORD
    // ==========================================

    const [showForgot, setShowForgot] =
        useState(false);

    const [forgotEmail, setForgotEmail] =
        useState("");

    const [forgotLoading, setForgotLoading] =
        useState(false);

    const [forgotMessage, setForgotMessage] =
        useState("");

    const [forgotError, setForgotError] =
        useState("");


    // ==========================================
    // DEMO LOGIN
    // ==========================================

    const handleDemoFill = (
        demoEmail,
        demoRole
    ) => {

        setEmail(demoEmail);

        setPassword("password123");

        setRole(demoRole);

        setErrors({});
    };


    // ==========================================
    // ROLE CHANGE
    // ==========================================

    const handleRoleChange = (newRole) => {

        setRole(newRole);

        setErrors({});

        setEmail("");

        setPassword("");
    };


    // ==========================================
    // LOGIN SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const newErrors = {};

        const cleanEmail =
            email.trim().toLowerCase();


        // ======================================
        // EMAIL VALIDATION
        // ======================================

        if (!cleanEmail) {

            newErrors.email =
                "Email address is required.";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                cleanEmail
            )
        ) {

            newErrors.email =
                "Please enter a valid email address.";
        }


        // ======================================
        // PASSWORD VALIDATION
        // ======================================

        if (!password) {

            newErrors.password =
                "Password is required.";

        } else if (
            password.length < 6
        ) {

            newErrors.password =
                "Password must be at least 6 characters.";
        }


        // ======================================
        // SHOW ERRORS
        // ======================================

        if (
            Object.keys(newErrors).length > 0
        ) {

            setErrors(newErrors);

            return;
        }


        setLoading(true);

        setErrors({});


        try {

            // ==================================
            // LOGIN API
            // ==================================

            const loggedInUser =
                await api.login(
                    cleanEmail,
                    password,
                    role
                );


            // ==================================
            // SAVE USER
            // ==================================

            const finalUser = {
                ...loggedInUser,
                role: role
            };


            if (onLoginSuccess) {

                onLoginSuccess(finalUser);
            }


            // ==================================
            // AFTER LOGIN
            // ==================================

            // Booking login
            if (
                params?.from === "booking"
            ) {

                navigate(
                    "booking",
                    {
                        serviceId:
                            params?.serviceId || ""
                    }
                );

                return;
            }


            // Service Provider
            if (role === "provider") {

                /*
                 * Provider dashboard page
                 * can be connected here later.
                 *
                 * For now, provider goes to profile.
                 */

                navigate("profile");

                return;
            }


            // Customer
            navigate("profile");

        } catch (err) {

            console.error(
                "Login Error:",
                err
            );

            setErrors({
                form:
                    err.message ||
                    "Login failed. Please check your credentials."
            });

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // FORGOT PASSWORD
    // ==========================================

    const handleForgotPassword = async () => {

        setForgotError("");

        setForgotMessage("");


        const cleanEmail =
            forgotEmail.trim().toLowerCase();


        // --------------------------------------
        // Validate email
        // --------------------------------------

        if (!cleanEmail) {

            setForgotError(
                "Please enter your email address."
            );

            return;
        }


        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                cleanEmail
            )
        ) {

            setForgotError(
                "Please enter a valid email address."
            );

            return;
        }


        setForgotLoading(true);


        try {

            /*
             * This requires the backend API:
             *
             * POST /api/users/forgot-password/
             */

            if (
                typeof api.requestPasswordReset !==
                "function"
            ) {

                throw new Error(
                    "Password reset service is not connected yet."
                );
            }


            await api.requestPasswordReset(
                cleanEmail
            );


            setForgotMessage(
                "Password reset instructions have been sent to your email."
            );


        } catch (error) {

            console.error(
                "Forgot Password Error:",
                error
            );

            setForgotError(
                error.message ||
                "Unable to send password reset instructions."
            );

        } finally {

            setForgotLoading(false);
        }
    };


    // ==========================================
    // CLOSE FORGOT PASSWORD
    // ==========================================

    const closeForgotPassword = () => {

        setShowForgot(false);

        setForgotEmail("");

        setForgotMessage("");

        setForgotError("");
    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <main className="auth-page">

            <div className="auth-card">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="auth-header">

                    <h2>
                        Welcome Back
                    </h2>

                    <p>
                        Sign in to manage your
                        bookings and service history
                    </p>

                </div>


                {/* =================================
                    ROLE TOGGLE
                ================================= */}

                <div className="role-tabs">

                    <button
                        type="button"
                        className={`role-tab ${
                            role === "customer"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleRoleChange(
                                "customer"
                            )
                        }
                    >
                        Customer
                    </button>


                    <button
                        type="button"
                        className={`role-tab ${
                            role === "provider"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleRoleChange(
                                "provider"
                            )
                        }
                    >
                        Service Provider
                    </button>

                </div>


                {/* =================================
                    FORGOT PASSWORD BOX
                ================================= */}

                {showForgot ? (

                    <div>

                        <div
                            style={{
                                marginBottom:
                                    "1.5rem"
                            }}
                        >

                            <h3
                                style={{
                                    marginBottom:
                                        "0.5rem"
                                }}
                            >
                                Forgot Password?
                            </h3>

                            <p
                                style={{
                                    color:
                                        "var(--text-muted)",
                                    fontSize:
                                        "0.9rem"
                                }}
                            >
                                Enter your registered
                                email address and we will
                                send password reset
                                instructions.
                            </p>

                        </div>


                        {/* ERROR */}

                        {forgotError && (

                            <div
                                style={{
                                    padding:
                                        "0.75rem",
                                    background:
                                        "var(--danger-light)",
                                    color:
                                        "var(--danger)",
                                    borderRadius:
                                        "var(--radius-md)",
                                    marginBottom:
                                        "1rem",
                                    fontSize:
                                        "0.9rem"
                                }}
                            >
                                {forgotError}
                            </div>

                        )}


                        {/* SUCCESS */}

                        {forgotMessage && (

                            <div
                                style={{
                                    padding:
                                        "0.75rem",
                                    background:
                                        "var(--success-light)",
                                    color:
                                        "var(--success)",
                                    borderRadius:
                                        "var(--radius-md)",
                                    marginBottom:
                                        "1rem",
                                    fontSize:
                                        "0.9rem"
                                }}
                            >
                                ✓ {forgotMessage}
                            </div>

                        )}


                        {/* EMAIL */}

                        <div
                            className="form-group"
                            style={{
                                marginBottom:
                                    "1.25rem"
                            }}
                        >

                            <label className="form-label">
                                Email Address
                            </label>

                            <input
                                type="email"
                                className="form-input"
                                placeholder="name@example.com"
                                value={forgotEmail}
                                onChange={(e) => {

                                    setForgotEmail(
                                        e.target.value
                                    );

                                    setForgotError("");
                                    setForgotMessage("");

                                }}
                            />

                        </div>


                        {/* SEND BUTTON */}

                        <button
                            type="button"
                            className="btn btn-primary btn-block btn-lg"
                            disabled={
                                forgotLoading
                            }
                            onClick={
                                handleForgotPassword
                            }
                        >
                            {forgotLoading
                                ? "Sending..."
                                : "Send Reset Instructions"}
                        </button>


                        {/* BACK */}

                        <button
                            type="button"
                            style={{
                                width: "100%",
                                marginTop:
                                    "0.75rem",
                                background:
                                    "none",
                                border: "none",
                                color:
                                    "var(--primary)",
                                cursor:
                                    "pointer",
                                fontWeight: 600
                            }}
                            onClick={
                                closeForgotPassword
                            }
                        >
                            ← Back to Login
                        </button>

                    </div>

                ) : (

                    <>
                        {/* =================================
                            FORM ERROR
                        ================================= */}

                        {errors.form && (

                            <div
                                style={{
                                    padding:
                                        "0.75rem",
                                    background:
                                        "var(--danger-light)",
                                    color:
                                        "var(--danger)",
                                    borderRadius:
                                        "var(--radius-md)",
                                    marginBottom:
                                        "1rem",
                                    fontSize:
                                        "0.9rem"
                                }}
                            >
                                {errors.form}
                            </div>

                        )}


                        {/* =================================
                            LOGIN FORM
                        ================================= */}

                        <form
                            className="auth-form"
                            onSubmit={
                                handleSubmit
                            }
                            noValidate
                        >


                            {/* EMAIL */}

                            <div className="form-group">

                                <label className="form-label">
                                    Email Address
                                </label>


                                <div className="input-container">

                                    <span className="input-icon">
                                        ✉️
                                    </span>


                                    <input
                                        type="email"
                                        className={`form-input ${
                                            errors.email
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => {

                                            setEmail(
                                                e.target.value
                                            );

                                            if (
                                                errors.email
                                            ) {

                                                setErrors(
                                                    (
                                                        previous
                                                    ) => ({
                                                        ...previous,
                                                        email: ""
                                                    })
                                                );

                                            }

                                        }}
                                    />

                                </div>


                                {errors.email && (

                                    <div className="field-error visible">
                                        {errors.email}
                                    </div>

                                )}

                            </div>


                            {/* PASSWORD */}

                            <div className="form-group">

                                <label className="form-label">

                                    <span>
                                        Password
                                    </span>


                                    <button
                                        type="button"
                                        className="forgot-link"
                                        style={{
                                            background:
                                                "none",
                                            border:
                                                "none",
                                            cursor:
                                                "pointer"
                                        }}
                                        onClick={() => {

                                            setShowForgot(
                                                true
                                            );

                                            setForgotEmail(
                                                email
                                            );

                                            setErrors({});
                                        }}
                                    >
                                        Forgot?
                                    </button>

                                </label>


                                <div className="input-container">

                                    <span className="input-icon">
                                        🔒
                                    </span>


                                    <input
                                        type="password"
                                        className={`form-input ${
                                            errors.password
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => {

                                            setPassword(
                                                e.target.value
                                            );

                                            if (
                                                errors.password
                                            ) {

                                                setErrors(
                                                    (
                                                        previous
                                                    ) => ({
                                                        ...previous,
                                                        password: ""
                                                    })
                                                );

                                            }

                                        }}
                                    />

                                </div>


                                {errors.password && (

                                    <div className="field-error visible">
                                        {errors.password}
                                    </div>

                                )}

                            </div>


                            {/* REMEMBER ME */}

                            <div className="form-options">

                                <label className="checkbox-label">

                                    <input
                                        type="checkbox"
                                        defaultChecked
                                    />

                                    <span>
                                        Remember me
                                    </span>

                                </label>

                            </div>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="btn btn-primary btn-block btn-lg"
                                disabled={loading}
                            >
                                {loading
                                    ? "Signing In..."
                                    : "Sign In"}
                            </button>

                        </form>


                        {/* =================================
                            DEMO CREDENTIALS
                        ================================= */}

                        <div className="demo-box">

                            <h4>
                                💡 Quick Demo Credentials
                            </h4>


                            <div className="demo-credentials">

                                <span>
                                    Customer:{" "}
                                    <code>
                                        alex@smartservices.com
                                    </code>
                                </span>


                                <button
                                    type="button"
                                    className="demo-fill-btn"
                                    onClick={() =>
                                        handleDemoFill(
                                            "alex@smartservices.com",
                                            "customer"
                                        )
                                    }
                                >
                                    Auto-fill
                                </button>

                            </div>


                            <div className="demo-credentials">

                                <span>
                                    Provider:{" "}
                                    <code>
                                        pro@smartservices.com
                                    </code>
                                </span>


                                <button
                                    type="button"
                                    className="demo-fill-btn"
                                    onClick={() =>
                                        handleDemoFill(
                                            "pro@smartservices.com",
                                            "provider"
                                        )
                                    }
                                >
                                    Auto-fill
                                </button>

                            </div>

                        </div>


                        {/* =================================
                            REGISTER
                        ================================= */}

                        <div className="auth-footer">

                            Don't have an account yet?{" "}

                            <button
                                type="button"
                                style={{
                                    background:
                                        "none",
                                    border:
                                        "none",
                                    color:
                                        "var(--primary)",
                                    fontWeight:
                                        600,
                                    cursor:
                                        "pointer"
                                }}
                                onClick={() =>
                                    navigate("register")
                                }
                            >
                                Create one here
                            </button>

                        </div>

                    </>
                )}

            </div>

        </main>
    );
}