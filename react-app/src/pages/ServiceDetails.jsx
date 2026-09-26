import React, { useState, useEffect } from "react";
import { getServices } from "../services/api";

export default function ServiceDetails({ navigate, params }) {

    const [service, setService] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================
    // LOAD SERVICE FROM DJANGO
    // =====================================

    useEffect(() => {

        const loadService = async () => {

            try {

                setLoading(true);

                setError("");

                const data = await getServices();

                const serviceId = params?.serviceId;

                const foundService = data.find(
                    (item) =>
                        String(item.id) === String(serviceId)
                );

                if (foundService) {

                    setService(foundService);

                } else {

                    setService(null);

                }

            } catch (error) {

                console.error(
                    "Failed to load service:",
                    error
                );

                setError(
                    "Unable to load service details."
                );

            } finally {

                setLoading(false);

            }

        };


        loadService();

    }, [params]);


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div
                className="container"
                style={{
                    padding: "4rem 0",
                    textAlign: "center"
                }}
            >

                Loading service details...

            </div>

        );

    }


    // =====================================
    // ERROR
    // =====================================

    if (error) {

        return (

            <div
                className="container"
                style={{
                    padding: "4rem 0",
                    textAlign: "center"
                }}
            >

                <h2>
                    {error}
                </h2>

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate("services")
                    }
                    style={{
                        marginTop: "1rem"
                    }}
                >
                    Back to Services
                </button>

            </div>

        );

    }


    // =====================================
    // SERVICE NOT FOUND
    // =====================================

    if (!service) {

        return (

            <div
                className="container"
                style={{
                    padding: "4rem 0",
                    textAlign: "center"
                }}
            >

                <h2>
                    Service not found
                </h2>

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate("services")
                    }
                    style={{
                        marginTop: "1rem"
                    }}
                >
                    Back to Services
                </button>

            </div>

        );

    }


    // =====================================
    // FALLBACK VALUES
    // =====================================

    const category =
        service.category || "Local Service";

    const rating =
        service.rating || "Not Rated";

    const reviewsCount =
        service.reviewsCount || 0;

    const duration =
        service.duration || "Depends on service";

    const price =
        service.price || "Contact for price";

    const features =
        service.features || [];


    return (

        <div className="section-padding">

            <div
                className="container"
                style={{
                    maxWidth: "900px"
                }}
            >

                {/* BACK BUTTON */}

                <button
                    className="btn btn-secondary btn-sm"
                    style={{
                        marginBottom: "1.5rem"
                    }}
                    onClick={() =>
                        navigate("services")
                    }
                >
                    ← Back to Catalog
                </button>


                {/* SERVICE CARD */}

                <div
                    className="card"
                    style={{
                        padding: "2.5rem"
                    }}
                >

                    {/* SERVICE HEADER */}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1.5rem",
                            marginBottom: "1.5rem",
                            flexWrap: "wrap"
                        }}
                    >

                        <div
                            style={{
                                width: "72px",
                                height: "72px",
                                borderRadius:
                                    "var(--radius-lg)",
                                background:
                                    "var(--primary-light)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2.5rem"
                            }}
                        >
                            {service.icon || "🛠️"}
                        </div>


                        <div>

                            <span
                                className="badge badge-primary"
                                style={{
                                    marginBottom: "0.5rem"
                                }}
                            >
                                {category}
                            </span>


                            <h1
                                style={{
                                    fontSize: "2rem",
                                    fontWeight: 800
                                }}
                            >
                                {service.name}
                            </h1>


                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    marginTop: "0.25rem",
                                    flexWrap: "wrap"
                                }}
                            >

                                <span
                                    style={{
                                        color: "#b45309",
                                        fontWeight: 700
                                    }}
                                >
                                    ★ {rating}
                                    {reviewsCount > 0 &&
                                        ` (${reviewsCount} ratings)`}
                                </span>


                                <span
                                    style={{
                                        color:
                                            "var(--text-muted)"
                                    }}
                                >
                                    ⏱️ Estimated Duration:{" "}
                                    {duration}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* DESCRIPTION */}

                    <p
                        style={{
                            fontSize: "1.1rem",
                            color: "var(--text-muted)",
                            lineHeight: 1.7,
                            marginBottom: "2rem"
                        }}
                    >
                        {service.description ||
                            "Professional local service for your needs."}
                    </p>


                    {/* INFORMATION GRID */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: "2rem",
                            marginBottom: "2.5rem"
                        }}
                    >

                        {/* INCLUDED */}

                        <div
                            style={{
                                background:
                                    "var(--bg-main)",
                                padding: "1.5rem",
                                borderRadius:
                                    "var(--radius-md)"
                            }}
                        >

                            <h3
                                style={{
                                    fontSize: "1.1rem",
                                    marginBottom: "0.75rem",
                                    color:
                                        "var(--success)"
                                }}
                            >
                                ✓ What is Included
                            </h3>


                            <ul
                                style={{
                                    listStyle: "none",
                                    display: "flex",
                                    flexDirection:
                                        "column",
                                    gap: "0.6rem",
                                    fontSize: "0.95rem"
                                }}
                            >

                                {features.length > 0 ? (

                                    features.map(
                                        (feature, index) => (

                                            <li
                                                key={index}
                                            >
                                                • {feature}
                                            </li>

                                        )
                                    )

                                ) : (

                                    <>
                                        <li>
                                            • Service inspection
                                        </li>

                                        <li>
                                            • Problem diagnosis
                                        </li>

                                        <li>
                                            • Professional service
                                        </li>

                                        <li>
                                            • Post-service testing
                                        </li>
                                    </>

                                )}

                            </ul>

                        </div>


                        {/* QUALITY */}

                        <div
                            style={{
                                background:
                                    "var(--bg-main)",
                                padding: "1.5rem",
                                borderRadius:
                                    "var(--radius-md)"
                            }}
                        >

                            <h3
                                style={{
                                    fontSize: "1.1rem",
                                    marginBottom: "0.75rem",
                                    color:
                                        "var(--primary)"
                                }}
                            >
                                🛡️ Quality & Safety Assured
                            </h3>


                            <ul
                                style={{
                                    listStyle: "none",
                                    display: "flex",
                                    flexDirection:
                                        "column",
                                    gap: "0.6rem",
                                    fontSize: "0.95rem",
                                    color:
                                        "var(--text-muted)"
                                }}
                            >

                                <li>
                                    • Professional service specialists
                                </li>

                                <li>
                                    • Transparent service details
                                </li>

                                <li>
                                    • Quality-focused service
                                </li>

                                <li>
                                    • Customer support available
                                </li>

                            </ul>

                        </div>

                    </div>


                    {/* PRICE + BOOK */}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "space-between",
                            borderTop:
                                "1px solid var(--border-color)",
                            paddingTop: "1.5rem",
                            flexWrap: "wrap",
                            gap: "1rem"
                        }}
                    >

                        <div>

                            <span
                                style={{
                                    fontSize: "0.85rem",
                                    color:
                                        "var(--text-muted)",
                                    textTransform:
                                        "uppercase",
                                    fontWeight: 600
                                }}
                            >
                                Standard Base Price
                            </span>


                            <div
                                style={{
                                    fontSize: "2rem",
                                    fontWeight: 800,
                                    color:
                                        "var(--primary)"
                                }}
                            >
                                {typeof price === "number"
                                    ? `₹${price}`
                                    : price}
                            </div>

                        </div>


                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() =>
                                navigate(
                                    "booking",
                                    {
                                        serviceId:
                                            service.id
                                    }
                                )
                            }
                        >
                            Proceed to Book Service →
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}