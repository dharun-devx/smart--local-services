import React, { useState, useEffect } from "react";
import ServiceCard from "../components/ServiceCard";
import { getServices } from "../services/api";

export default function Home({ navigate }) {

    const [services, setServices] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================
    // LOAD SERVICES FROM DJANGO
    // =====================================

    useEffect(() => {

        const loadServices = async () => {

            try {

                setLoading(true);

                setError("");

                const data = await getServices();

                setServices(data.slice(0, 6));

            } catch (error) {

                console.error(
                    "Failed to load services:",
                    error
                );

                setError(
                    "Unable to load services. Please check the Django server."
                );

            } finally {

                setLoading(false);

            }

        };


        loadServices();

    }, []);


    // =====================================
    // SEARCH
    // =====================================

    const handleSearch = (e) => {

        e.preventDefault();

        if (searchTerm.trim()) {

            navigate(
                "services",
                {
                    search: searchTerm.trim()
                }
            );

        } else {

            navigate("services");

        }

    };


    // =====================================
    // BOOK SERVICE
    // =====================================

    const handleBook = (service) => {

        navigate(
            "booking",
            {
                serviceId: service.id
            }
        );

    };


    // =====================================
    // VIEW SERVICE DETAILS
    // =====================================

    const handleViewDetails = (service) => {

        navigate(
            "service-details",
            {
                serviceId: service.id
            }
        );

    };


    return (

        <div>

            {/* ================= HERO ================= */}

            <section className="hero-section">

                <div className="container hero-content">

                    <div className="hero-badge">
                        <span>⚡</span>
                        Verified Local Experts at Your Doorstep
                    </div>


                    <h1 className="hero-title">

                        Book Reliable{" "}

                        <span className="hero-highlight">
                            Home & Local Services
                        </span>{" "}

                        in Minutes

                    </h1>


                    <p className="hero-subtitle">

                        Find certified plumbers, electricians,
                        house cleaners, carpenters, painters,
                        and technicians trusted by over
                        50,000+ happy households.

                    </p>


                    {/* SEARCH BOX */}

                    <form
                        className="hero-search-wrapper"
                        onSubmit={handleSearch}
                    >

                        <span className="hero-search-icon">
                            🔍
                        </span>


                        <input
                            type="text"
                            className="hero-search-input"
                            placeholder="Search for 'Plumber', 'Electrician', 'Deep Cleaning'..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />


                        <button
                            type="submit"
                            className="btn btn-primary hero-search-btn"
                        >
                            Find Services
                        </button>

                    </form>


                    {/* POPULAR SEARCH TAGS */}

                    <div className="hero-popular-tags">

                        <span>
                            Popular:
                        </span>


                        <button
                            type="button"
                            className="hero-tag"
                            onClick={() =>
                                navigate(
                                    "services",
                                    {
                                        category: "plumbing"
                                    }
                                )
                            }
                        >
                            Plumbing
                        </button>


                        <button
                            type="button"
                            className="hero-tag"
                            onClick={() =>
                                navigate(
                                    "services",
                                    {
                                        category: "electrical"
                                    }
                                )
                            }
                        >
                            Electrician
                        </button>


                        <button
                            type="button"
                            className="hero-tag"
                            onClick={() =>
                                navigate(
                                    "services",
                                    {
                                        category: "cleaning"
                                    }
                                )
                            }
                        >
                            Deep Cleaning
                        </button>


                        <button
                            type="button"
                            className="hero-tag"
                            onClick={() =>
                                navigate(
                                    "services",
                                    {
                                        category: "appliances"
                                    }
                                )
                            }
                        >
                            AC Repair
                        </button>

                    </div>

                </div>

            </section>


            {/* ================= CATEGORIES ================= */}

            <section className="section-padding">

                <div className="container">

                    <div className="section-header">

                        <span className="section-tag">
                            Categories
                        </span>

                        <h2 className="section-title">
                            Popular Service Categories
                        </h2>

                        <p className="section-desc">
                            Select a category to view vetted
                            service specialists near you.
                        </p>

                    </div>


                    <div className="category-grid">

                        <div
                            className="category-card"
                            onClick={() =>
                                navigate(
                                    "services",
                                    {
                                        category: "plumbing"
                                    }
                                )
                            }
                        >

                            <div className="category-icon">
                                🔧
                            </div>

                            <h3>
                                Plumbing
                            </h3>

                            <span>
                                Leaks, Taps & Pipes
                            </span>

                        </div>


                        <div
                            className="category-card"
                            onClick={() =>
                                navigate(
                                    "services",
                                    {
                                        category: "electrical"
                                    }
                                )
                            }
                        >

                            <div className="category-icon">
                                ⚡
                            </div>

                            <h3>
                                Electrical
                            </h3>

                            <span>
                                Wiring & Lights
                            </span>

                        </div>


                        <div
                            className="category-card"
                            onClick={() =>
                                navigate(
                                    "services",
                                    {
                                        category: "cleaning"
                                    }
                                )
                            }
                        >

                            <div className="category-icon">
                                🧹
                            </div>

                            <h3>
                                Cleaning
                            </h3>

                            <span>
                                Deep Home Cleaning
                            </span>

                        </div>


                        <div
                            className="category-card"
                            onClick={() =>
                                navigate(
                                    "services",
                                    {
                                        category: "appliances"
                                    }
                                )
                            }
                        >

                            <div className="category-icon">
                                ❄️
                            </div>

                            <h3>
                                AC & Appliances
                            </h3>

                            <span>
                                Repair & Service
                            </span>

                        </div>


                        <div
                            className="category-card"
                            onClick={() =>
                                navigate(
                                    "services",
                                    {
                                        category: "carpentry"
                                    }
                                )
                            }
                        >

                            <div className="category-icon">
                                🪚
                            </div>

                            <h3>
                                Carpentry
                            </h3>

                            <span>
                                Furniture & Woodwork
                            </span>

                        </div>


                        <div
                            className="category-card"
                            onClick={() =>
                                navigate(
                                    "services",
                                    {
                                        category: "painting"
                                    }
                                )
                            }
                        >

                            <div className="category-icon">
                                🎨
                            </div>

                            <h3>
                                Painting
                            </h3>

                            <span>
                                Wall & Textures
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= FEATURED SERVICES ================= */}

            <section
                className="section-padding"
                style={{
                    background: "#f1f5f9"
                }}
            >

                <div className="container">

                    <div className="section-header">

                        <span className="section-tag">
                            Featured
                        </span>

                        <h2 className="section-title">
                            Top-Rated Services
                        </h2>

                        <p className="section-desc">
                            Our most requested and highest
                            customer-rated home repair solutions.
                        </p>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div
                            style={{
                                textAlign: "center",
                                padding: "2rem"
                            }}
                        >
                            Loading services...
                        </div>

                    )}


                    {/* ERROR */}

                    {!loading && error && (

                        <div
                            style={{
                                textAlign: "center",
                                padding: "2rem",
                                color: "red"
                            }}
                        >
                            {error}
                        </div>

                    )}


                    {/* SERVICES */}

                    {!loading &&
                        !error &&
                        services.length > 0 && (

                            <div className="services-grid">

                                {services.map(
                                    (service) => (

                                        <ServiceCard
                                            key={service.id}
                                            service={service}
                                            onBook={handleBook}
                                            onViewDetails={
                                                handleViewDetails
                                            }
                                        />

                                    )
                                )}

                            </div>

                        )}


                    {/* NO SERVICES */}

                    {!loading &&
                        !error &&
                        services.length === 0 && (

                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "2rem"
                                }}
                            >
                                No services available.
                            </div>

                        )}


                    <div
                        style={{
                            textAlign: "center",
                            marginTop: "3rem"
                        }}
                    >

                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() =>
                                navigate("services")
                            }
                        >
                            Browse All Services →
                        </button>

                    </div>

                </div>

            </section>


            {/* ================= HOW IT WORKS ================= */}

            <section className="section-padding how-it-works">

                <div className="container">

                    <div className="section-header">

                        <span className="section-tag">
                            Simple & Fast
                        </span>

                        <h2 className="section-title">
                            How It Works
                        </h2>

                        <p className="section-desc">
                            Book your needed home service
                            in 3 hassle-free steps.
                        </p>

                    </div>


                    <div className="steps-grid">

                        <div className="step-card">

                            <div className="step-number">
                                1
                            </div>

                            <h3>
                                Select a Service
                            </h3>

                            <p>
                                Browse our catalog of
                                upfront-priced services
                                and pick what fits your needs.
                            </p>

                        </div>


                        <div className="step-card">

                            <div className="step-number">
                                2
                            </div>

                            <h3>
                                Pick Date & Time
                            </h3>

                            <p>
                                Select your convenient date
                                and 1-hour time window with
                                simple doorstep dispatch.
                            </p>

                        </div>


                        <div className="step-card">

                            <div className="step-number">
                                3
                            </div>

                            <h3>
                                Certified Service
                            </h3>

                            <p>
                                An authorized specialist
                                arrives on schedule,
                                completes the work,
                                and ensures satisfaction.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= STATS ================= */}

            <div className="container">

                <div className="stats-banner">

                    <div className="stats-grid">

                        <div className="stat-item">

                            <h3>
                                50,000+
                            </h3>

                            <p>
                                Completed Bookings
                            </p>

                        </div>


                        <div className="stat-item">

                            <h3>
                                4.8 / 5
                            </h3>

                            <p>
                                Average Customer Rating
                            </p>

                        </div>


                        <div className="stat-item">

                            <h3>
                                1,500+
                            </h3>

                            <p>
                                Background-Checked Pros
                            </p>

                        </div>


                        <div className="stat-item">

                            <h3>
                                30 Days
                            </h3>

                            <p>
                                Free Rework Warranty
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= CTA ================= */}

            <section className="cta-section">

                <div className="container cta-content">

                    <h2>
                        Ready to Fix Your Home Troubles?
                    </h2>

                    <p>
                        Book certified technicians with
                        guaranteed satisfaction and
                        transparent rates.
                    </p>


                    <div className="cta-buttons">

                        <button
                            className="btn btn-secondary btn-lg"
                            onClick={() =>
                                navigate("services")
                            }
                        >
                            Explore All Services
                        </button>


                        <button
                            className="btn btn-primary btn-lg"
                            style={{
                                background: "#0f172a",
                                borderColor: "#0f172a"
                            }}
                            onClick={() =>
                                navigate("booking")
                            }
                        >
                            Schedule Service Now
                        </button>

                    </div>

                </div>

            </section>

        </div>

    );

}