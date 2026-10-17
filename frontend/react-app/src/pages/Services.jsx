import React, { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { getServices } from "../services/api";

export default function Services({ navigate, initialParams }) {
    const [services, setServices] = useState([]);
    const [filterCategory, setFilterCategory] = useState(
        initialParams?.category || "all"
    );
    const [searchTerm, setSearchTerm] = useState(
        initialParams?.search || ""
    );
    const [sortBy, setSortBy] = useState("popular");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD SERVICES
    // =====================================================
    useEffect(() => {
        const loadServices = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getServices();

                setServices(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load services:", err);

                setError(
                    "Unable to load services. Please check the Django server."
                );
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    // =====================================================
    // UPDATE FILTER WHEN HOME PAGE SENDS PARAMETERS
    // =====================================================
    useEffect(() => {
        if (initialParams?.search !== undefined) {
            setSearchTerm(initialParams.search || "");
            setFilterCategory("all");
        }

        if (initialParams?.category !== undefined) {
            setFilterCategory(initialParams.category || "all");
            setSearchTerm("");
        }
    }, [initialParams]);

    // =====================================================
    // BOOK SERVICE
    // =====================================================
    const handleBook = (service) => {
        navigate("booking", {
            serviceId: service.id,
        });
    };

    // =====================================================
    // VIEW DETAILS
    // =====================================================
    const handleViewDetails = (service) => {
        navigate("service-details", {
            serviceId: service.id,
        });
    };

    // =====================================================
    // SERVICE CATEGORY
    // =====================================================
    const getServiceCategory = (service) => {
        const name = (service.name || "").trim().toLowerCase();
        const description = (service.description || "")
            .trim()
            .toLowerCase();

        // Plumbing
        if (
            name.includes("plumber") ||
            name.includes("plumbing") ||
            description.includes("plumber") ||
            description.includes("plumbing")
        ) {
            return "plumbing";
        }

        // Electrical
        if (
            name.includes("electrician") ||
            name.includes("electrical") ||
            description.includes("electrician") ||
            description.includes("electrical")
        ) {
            return "electrical";
        }

        // Cleaning
        if (
            name.includes("cleaning") ||
            name.includes("cleaner") ||
            description.includes("cleaning") ||
            description.includes("cleaner")
        ) {
            return "cleaning";
        }

        // Computer / Electronics
        if (
            name.includes("computer") ||
            name.includes("laptop") ||
            name.includes("electronics") ||
            description.includes("computer") ||
            description.includes("laptop")
        ) {
            return "electronics";
        }

        // Vehicle
        if (
            name.includes("vehicle") ||
            name.includes("automotive") ||
            name.includes("car service") ||
            name.includes("bike service") ||
            description.includes("vehicle") ||
            description.includes("automotive")
        ) {
            return "automotive";
        }

        // Home Repair
        if (
            name.includes("home repair") ||
            description.includes("home repair") ||
            description.includes("home maintenance")
        ) {
            return "home";
        }

        // AC / Appliances
        if (
            name.includes("ac") ||
            name.includes("appliance") ||
            name.includes("air conditioner") ||
            description.includes("appliance") ||
            description.includes("air conditioner")
        ) {
            return "appliances";
        }

        // Carpentry
        if (
            name.includes("carpentry") ||
            name.includes("carpenter") ||
            description.includes("carpentry") ||
            description.includes("carpenter") ||
            description.includes("woodwork")
        ) {
            return "carpentry";
        }

        // Painting
        if (
            name.includes("painting") ||
            name.includes("painter") ||
            description.includes("painting") ||
            description.includes("painter")
        ) {
            return "painting";
        }

        return "other";
    };

    // =====================================================
    // SEARCH + CATEGORY FILTER
    // =====================================================
    const filteredServices = services
        .filter((service) => {
            const serviceName = (service.name || "").toLowerCase();
            const serviceDescription = (
                service.description || ""
            ).toLowerCase();

            let matchCategory = true;

            if (filterCategory !== "all") {
                matchCategory =
                    getServiceCategory(service) === filterCategory;
            }

            const searchText = searchTerm.trim().toLowerCase();

            const matchSearch =
                !searchText ||
                serviceName.includes(searchText) ||
                serviceDescription.includes(searchText);

            return matchCategory && matchSearch;
        })
        .sort((a, b) => {
            const priceA = Number(a.price || 0);
            const priceB = Number(b.price || 0);

            if (sortBy === "price-low") {
                return priceA - priceB;
            }

            if (sortBy === "price-high") {
                return priceB - priceA;
            }

            return 0;
        });

    // =====================================================
    // RESET
    // =====================================================
    const resetFilters = () => {
        setFilterCategory("all");
        setSearchTerm("");
        setSortBy("popular");

        navigate("services");
    };

    // =====================================================
    // CATEGORIES
    // =====================================================
    const categories = [
        {
            id: "all",
            label: "All Services",
        },
        {
            id: "plumbing",
            label: "Plumbing",
        },
        {
            id: "electrical",
            label: "Electrical",
        },
        {
            id: "cleaning",
            label: "Cleaning",
        },
        {
            id: "electronics",
            label: "Computer Repair",
        },
        {
            id: "automotive",
            label: "Vehicle Care",
        },
        {
            id: "home",
            label: "Home Repair",
        },
        {
            id: "appliances",
            label: "AC & Appliances",
        },
        {
            id: "carpentry",
            label: "Carpentry",
        },
        {
            id: "painting",
            label: "Painting",
        },
    ];

    // =====================================================
    // CATEGORY BUTTON
    // =====================================================
    const handleCategoryChange = (category) => {
        setFilterCategory(category);
        setSearchTerm("");
    };

    return (
        <div>

            {/* =================================================
                HEADER
            ================================================= */}
            <section className="services-page-header">
                <div className="container">
                    <h1>
                        Professional Services on Demand
                    </h1>

                    <p>
                        Transparent upfront pricing, trusted local
                        specialists, and easy booking.
                    </p>
                </div>
            </section>


            {/* =================================================
                TOOLBAR
            ================================================= */}
            <section className="toolbar-section">
                <div className="container toolbar-container">

                    <div className="toolbar-top">

                        {/* SEARCH */}
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
                                    setSearchTerm(e.target.value)
                                }
                            />
                        </div>


                        {/* SORT */}
                        <select
                            className="filter-select"
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value)
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
                        </select>

                    </div>


                    {/* CATEGORY FILTER */}
                    <div className="category-filter-bar">

                        {categories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                className={`filter-pill ${
                                    filterCategory === category.id
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleCategoryChange(
                                        category.id
                                    )
                                }
                            >
                                {category.label}
                            </button>
                        ))}

                    </div>

                </div>
            </section>


            {/* =================================================
                CATALOG
            ================================================= */}
            <main className="catalog-section">
                <div className="container">

                    {/* RESULT COUNT */}
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
                                padding: "3rem",
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
                                color: "red",
                            }}
                        >
                            <p>{error}</p>

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
                                    Try searching for a different
                                    keyword or resetting your filters.
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={resetFilters}
                                >
                                    View All Services
                                </button>

                            </div>
                        )}

                </div>
            </main>

        </div>
    );
}