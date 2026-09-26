import React, { useState, useEffect } from "react";
import ServiceCard from "../components/ServiceCard";
import { getServices } from "../services/api";

export default function Services({
    navigate,
    initialParams
}) {

    const [services, setServices] = useState([]);

    const [filterCategory, setFilterCategory] =
        useState(initialParams?.category || "all");

    const [searchTerm, setSearchTerm] =
        useState(initialParams?.search || "");

    const [sortBy, setSortBy] =
        useState("popular");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================
    // LOAD SERVICES FROM DJANGO
    // =====================================

    useEffect(() => {

        const loadServices = async () => {

            try {

                setLoading(true);

                setError("");

                const data = await getServices();

                setServices(data);

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
    // VIEW DETAILS
    // =====================================

    const handleViewDetails = (service) => {

        navigate(
            "service-details",
            {
                serviceId: service.id
            }
        );

    };


    // =====================================
    // FILTER & SEARCH
    // =====================================

    const filteredServices = services
        .filter((service) => {

            const serviceName =
                (service.name || "").toLowerCase();

            const serviceDescription =
                (service.description || "").toLowerCase();


            /*
             * Current Django Service model
             * does not have category field.
             *
             * So category filtering is based
             * on service name/description.
             */

            let matchCategory = true;

            if (filterCategory !== "all") {

                const categoryKeywords = {

                    plumbing: [
                        "plumber",
                        "plumbing"
                    ],

                    electrical: [
                        "electrician",
                        "electrical",
                        "electric"
                    ],

                    cleaning: [
                        "cleaning",
                        "cleaner"
                    ],

                    appliances: [
                        "ac",
                        "appliance",
                        "appliances"
                    ],

                    carpentry: [
                        "carpenter",
                        "carpentry"
                    ],

                    painting: [
                        "painting",
                        "painter"
                    ],

                    electronics: [
                        "computer",
                        "repair",
                        "electronics"
                    ],

                    automotive: [
                        "vehicle",
                        "car",
                        "bike",
                        "automotive"
                    ]

                };


                const keywords =
                    categoryKeywords[filterCategory] || [];


                matchCategory =
                    keywords.some(
                        (keyword) =>
                            serviceName.includes(keyword) ||
                            serviceDescription.includes(keyword)
                    );

            }


            const searchText =
                searchTerm.trim().toLowerCase();


            const matchSearch =
                !searchText ||
                serviceName.includes(searchText) ||
                serviceDescription.includes(searchText);


            return matchCategory && matchSearch;

        })
        .sort((a, b) => {

            /*
             * Current Django model does not have
             * price/rating fields.
             *
             * So popular sorting keeps API order.
             */

            if (sortBy === "popular") {
                return 0;
            }

            return 0;

        });


    // =====================================
    // RESET FILTERS
    // =====================================

    const resetFilters = () => {

        setFilterCategory("all");

        setSearchTerm("");

        setSortBy("popular");

    };


    return (

        <div>

            {/* ================= HEADER ================= */}

            <section className="services-page-header">

                <div className="container">

                    <h1>
                        Professional Services on Demand
                    </h1>

                    <p>
                        Transparent upfront pricing,
                        background-verified specialists,
                        and instant booking guaranteed.
                    </p>

                </div>

            </section>


            {/* ================= TOOLBAR ================= */}

            <section className="toolbar-section">

                <div className="container toolbar-container">

                    <div className="toolbar-top">

                        <div className="catalog-search-box">

                            <span className="catalog-search-icon">
                                🔍
                            </span>

                            <input
                                type="text"
                                className="catalog-search-input"
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <select
                            className="filter-select"
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(
                                    e.target.value
                                )
                            }
                        >

                            <option value="popular">
                                Sort by: Recommended
                            </option>

                            <option value="price-low">
                                Price: Low to High
                            </option>

                            <option value="price-high">
                                Price: High to Low
                            </option>

                            <option value="rating">
                                Highest Rated
                            </option>

                        </select>

                    </div>


                    {/* CATEGORY FILTER */}

                    <div className="category-filter-bar">

                        {[
                            {
                                id: "all",
                                label: "All Services"
                            },
                            {
                                id: "plumbing",
                                label: "Plumbing"
                            },
                            {
                                id: "electrical",
                                label: "Electrical"
                            },
                            {
                                id: "cleaning",
                                label: "Cleaning"
                            },
                            {
                                id: "appliances",
                                label: "Appliances & AC"
                            },
                            {
                                id: "carpentry",
                                label: "Carpentry"
                            },
                            {
                                id: "painting",
                                label: "Painting"
                            },
                            {
                                id: "electronics",
                                label: "Computer Repair"
                            },
                            {
                                id: "automotive",
                                label: "Vehicle Care"
                            }
                        ].map((cat) => (

                            <button
                                key={cat.id}
                                type="button"
                                className={
                                    `filter-pill ${
                                        filterCategory === cat.id
                                            ? "active"
                                            : ""
                                    }`
                                }
                                onClick={() =>
                                    setFilterCategory(
                                        cat.id
                                    )
                                }
                            >

                                {cat.label}

                            </button>

                        ))}

                    </div>

                </div>

            </section>


            {/* ================= CATALOG ================= */}

            <main className="catalog-section">

                <div className="container">

                    <div className="catalog-results-header">

                        <span>
                            Showing{" "}
                            {filteredServices.length}{" "}
                            of{" "}
                            {services.length}{" "}
                            services
                        </span>

                        <span>
                            ⚡ 30-Day Service Guarantee
                        </span>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div
                            style={{
                                textAlign: "center",
                                padding: "3rem"
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
                                padding: "3rem",
                                color: "red"
                            }}
                        >

                            <p>
                                {error}
                            </p>

                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Try Again
                            </button>

                        </div>

                    )}


                    {/* SERVICES */}

                    {!loading &&
                        !error &&
                        filteredServices.length > 0 && (

                            <div className="services-grid">

                                {filteredServices.map(
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


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        filteredServices.length === 0 && (

                            <div className="empty-catalog">

                                <div className="empty-catalog-icon">
                                    🔍
                                </div>

                                <h3>
                                    No matching services found
                                </h3>

                                <p>
                                    Try searching for a
                                    different keyword or
                                    resetting your filters.
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={resetFilters}
                                >
                                    Reset All Filters
                                </button>

                            </div>

                        )}

                </div>

            </main>

        </div>

    );

}