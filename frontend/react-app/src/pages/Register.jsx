import React, { useState } from "react";
import { api } from "../services/api";

export default function Register({
    navigate,
    onRegisterSuccess
}) {
    const [role, setRole] = useState("customer");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [agreeTerms, setAgreeTerms] = useState(true);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // ==========================================
    // REGISTER
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.replace(/\D/g, "");

        // Name
        if (!cleanName) {
            newErrors.name = "Full name is required.";
        }

        // Email
        if (!cleanEmail) {
            newErrors.email = "Email address is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
        ) {
            newErrors.email =
                "Please enter a valid email address.";
        }

        // Phone
        if (cleanPhone.length !== 10) {
            newErrors.phone =
                "Valid 10-digit phone number is required.";
        }

        // Password
        if (!password) {
            newErrors.password =
                "Password is required.";
        } else if (password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters.";
        }

        // Confirm Password
        if (!confirmPassword) {
            newErrors.confirmPassword =
                "Please confirm your password.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword =
                "Passwords do not match.";
        }

        // Terms
        if (!agreeTerms) {
            newErrors.terms =
                "You must agree to the Terms of Service.";
        }

        // Stop if validation fails
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            // Create user in Django
            const user = await api.createUser({
                name: cleanName,
                email: cleanEmail,
                phone: cleanPhone,
                password: password
            });

            // Save current user
            api.setCurrentUser({
                ...user,
                role: role
            });

            // Update App state
            onRegisterSuccess({
                ...user,
                role: role
            });

            // Go to profile
            navigate("profile");

        } catch (err) {
            console.error(
                "Registration error:",
                err
            );

            setErrors({
                form:
                    err.message ||
                    "Registration failed. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div
                className="auth-card"
                style={{
                    maxWidth: "520px"
                }}
            >

                {/* ================= HEADER ================= */}

                <div className="auth-header">
                    <h2>Create Your Account</h2>

                    <p>
                        Sign up in under 60 seconds
                        to book or provide services
                    </p>
                </div>


                {/* ================= ROLE ================= */}

                <div className="role-tabs">

                    <button
                        type="button"
                        className={`role-tab ${
                            role === "customer"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setRole("customer")
                        }
                    >
                        I Need Services (Customer)
                    </button>

                    <button
                        type="button"
                        className={`role-tab ${
                            role === "provider"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setRole("provider")
                        }
                    >
                        I Provide Services (Partner)
                    </button>

                </div>


                {/* ================= FORM ERROR ================= */}

                {errors.form && (
                    <div
                        style={{
                            padding: "0.75rem",
                            background:
                                "var(--danger-light)",
                            color:
                                "var(--danger)",
                            borderRadius:
                                "var(--radius-md)",
                            marginBottom: "1rem",
                            fontSize: "0.9rem"
                        }}
                    >
                        {errors.form}
                    </div>
                )}


                {/* ================= FORM ================= */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                    noValidate
                >

                    {/* NAME */}

                    <div className="form-group">

                        <label className="form-label">
                            Full Name
                        </label>

                        <div className="input-container">

                            <span className="input-icon">
                                👤
                            </span>

                            <input
                                type="text"
                                className={`form-input ${
                                    errors.name
                                        ? "is-invalid"
                                        : ""
                                }`}
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);

                                    setErrors((prev) => ({
                                        ...prev,
                                        name: ""
                                    }));
                                }}
                            />

                        </div>

                        {errors.name && (
                            <div className="field-error visible">
                                {errors.name}
                            </div>
                        )}

                    </div>


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
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);

                                    setErrors((prev) => ({
                                        ...prev,
                                        email: ""
                                    }));
                                }}
                            />

                        </div>

                        {errors.email && (
                            <div className="field-error visible">
                                {errors.email}
                            </div>
                        )}

                    </div>


                    {/* PHONE */}

                    <div className="form-group">

                        <label className="form-label">
                            Phone Number
                        </label>

                        <div className="input-container">

                            <span className="input-icon">
                                📞
                            </span>

                            <input
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                className={`form-input ${
                                    errors.phone
                                        ? "is-invalid"
                                        : ""
                                }`}
                                placeholder="Enter 10-digit phone number"
                                value={phone}
                                onChange={(e) => {

                                    const value =
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 10);

                                    setPhone(value);

                                    setErrors((prev) => ({
                                        ...prev,
                                        phone: ""
                                    }));
                                }}
                            />

                        </div>

                        {errors.phone && (
                            <div className="field-error visible">
                                {errors.phone}
                            </div>
                        )}

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label className="form-label">
                            Password
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
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(e) => {
                                    setPassword(
                                        e.target.value
                                    );

                                    setErrors((prev) => ({
                                        ...prev,
                                        password: ""
                                    }));
                                }}
                            />

                        </div>

                        {errors.password && (
                            <div className="field-error visible">
                                {errors.password}
                            </div>
                        )}

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="form-group">

                        <label className="form-label">
                            Confirm Password
                        </label>

                        <div className="input-container">

                            <span className="input-icon">
                                🔒
                            </span>

                            <input
                                type="password"
                                className={`form-input ${
                                    errors.confirmPassword
                                        ? "is-invalid"
                                        : ""
                                }`}
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(
                                        e.target.value
                                    );

                                    setErrors((prev) => ({
                                        ...prev,
                                        confirmPassword: ""
                                    }));
                                }}
                            />

                        </div>

                        {errors.confirmPassword && (
                            <div className="field-error visible">
                                {errors.confirmPassword}
                            </div>
                        )}

                    </div>


                    {/* TERMS */}

                    <div className="form-options">

                        <label className="checkbox-label">

                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) =>
                                    setAgreeTerms(
                                        e.target.checked
                                    )
                                }
                            />

                            <span>
                                I agree to the Terms of
                                Service & Privacy Policy
                            </span>

                        </label>

                    </div>

                    {errors.terms && (
                        <div
                            className="field-error visible"
                            style={{
                                display: "block"
                            }}
                        >
                            {errors.terms}
                        </div>
                    )}


                    {/* CREATE ACCOUNT */}

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-lg"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>


                {/* ================= FOOTER ================= */}

                <div className="auth-footer">

                    Already have an account?{" "}

                    <button
                        type="button"
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--primary)",
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                        onClick={() =>
                            navigate("login")
                        }
                    >
                        Sign in here
                    </button>

                </div>

            </div>
        </main>
    );
}