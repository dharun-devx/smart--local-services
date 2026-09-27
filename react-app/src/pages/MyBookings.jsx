import React, { useState, useEffect } from "react";
import BookingCard from "../components/BookingCard";
import { api } from "../services/api";

export default function MyBookings({ navigate }) {
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await api.getBookings();

            setBookings(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            console.error(
                "Failed to load bookings:",
                err
            );

            setError(
                "Unable to load bookings. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.deleteBooking(bookingId);

            alert("Booking cancelled successfully.");

            await loadBookings();
        } catch (err) {
            console.error(
                "Failed to cancel booking:",
                err
            );

            alert(
                "Failed to cancel booking. Please try again."
            );
        }
    };

    const filtered = bookings.filter((booking) => {
        if (filter === "all") {
            return true;
        }

        return (
            String(booking.status || "")
                .toLowerCase() ===
            filter.toLowerCase()
        );
    });

    return (
        <div className="section-padding">

            <div
                className="container"
                style={{ maxWidth: "900px" }}
            >

                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "2rem",
                        flexWrap: "wrap",
                        gap: "1rem"
                    }}
                >

                    <div>

                        <h1
                            style={{
                                fontSize: "2rem",
                                fontWeight: 800
                            }}
                        >
                            My Service Appointments
                        </h1>

                        <p
                            style={{
                                color: "var(--text-muted)"
                            }}
                        >
                            Track, manage, or reschedule
                            your service bookings.
                        </p>

                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            navigate("booking")
                        }
                    >
                        + Book New Service
                    </button>

                </div>


                {/* Error */}
                {error && (
                    <div
                        className="card"
                        style={{
                            padding: "1rem",
                            marginBottom: "1.5rem",
                            color: "#dc2626",
                            textAlign: "center"
                        }}
                    >
                        {error}

                        <br />

                        <button
                            className="btn btn-primary"
                            style={{
                                marginTop: "1rem"
                            }}
                            onClick={loadBookings}
                        >
                            Try Again
                        </button>
                    </div>
                )}


                {/* Filter Tabs */}
                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginBottom: "2rem",
                        overflowX: "auto",
                        paddingBottom: "0.25rem"
                    }}
                >

                    {[
                        {
                            id: "all",
                            label: "All Bookings"
                        },
                        {
                            id: "confirmed",
                            label: "Active & Confirmed"
                        },
                        {
                            id: "completed",
                            label: "Completed"
                        },
                        {
                            id: "cancelled",
                            label: "Cancelled"
                        }
                    ].map((tab) => (

                        <button
                            key={tab.id}
                            className={`filter-pill ${
                                filter === tab.id
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setFilter(tab.id)
                            }
                        >
                            {tab.label}
                        </button>

                    ))}

                </div>


                {/* Loading */}
                {loading ? (

                    <div
                        style={{
                            textAlign: "center",
                            padding: "3rem"
                        }}
                    >
                        Loading appointments...
                    </div>

                ) : filtered.length === 0 ? (

                    /* No Bookings */
                    <div
                        className="card"
                        style={{
                            padding: "3rem 2rem",
                            textAlign: "center"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "3rem",
                                marginBottom: "1rem"
                            }}
                        >
                            📅
                        </div>

                        <h3>
                            No bookings found
                        </h3>

                        <p
                            style={{
                                color:
                                    "var(--text-muted)",
                                marginBottom: "1.5rem"
                            }}
                        >
                            {filter === "all"
                                ? "You haven’t scheduled any services yet."
                                : `You do not have any ${filter} appointments.`}
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                navigate("services")
                            }
                        >
                            Browse Services
                        </button>

                    </div>

                ) : (

                    /* Booking List */
                    <div>

                        {filtered.map((booking) => (

                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onCancel={handleCancel}
                            />

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}