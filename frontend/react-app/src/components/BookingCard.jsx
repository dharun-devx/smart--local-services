import React from "react";

export default function BookingCard({
    booking,
    onCancel,
    serialNumber
}) {

    const getBadgeClass = (status) => {
        switch (status) {
            case "Confirmed":
                return "badge-success";

            case "Completed":
                return "badge-primary";

            case "Cancelled":
                return "badge-danger";

            case "Pending":
                return "badge-subtle";

            default:
                return "badge-subtle";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "Date not available";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const formatTime = (time) => {
        if (!time) {
            return "Time not available";
        }

        const parts = time.split(":");

        if (parts.length < 2) {
            return time;
        }

        let hour = parseInt(parts[0], 10);
        const minute = parts[1];

        const period = hour >= 12 ? "PM" : "AM";

        hour = hour % 12 || 12;

        return `${hour}:${minute} ${period}`;
    };

    // Get actual service name
    const getServiceName = () => {

        if (booking.service_name) {
            return booking.service_name;
        }

        if (booking.serviceName) {
            return booking.serviceName;
        }

        if (
            booking.service &&
            typeof booking.service === "object"
        ) {
            if (booking.service.name) {
                return booking.service.name;
            }
        }

        // Fallback based on service ID
        const serviceNames = {
            1: "Plumber",
            2: "Electrician",
            3: "Cleaning",
            4: "Computer Repair",
            5: "Vehicle Service",
            6: "Home Repair",
            7: "AC & Appliances",
            8: "Carpentry",
            9: "Painting"
        };

        const serviceId =
            typeof booking.service === "object"
                ? booking.service.id
                : booking.service;

        return (
            serviceNames[serviceId] ||
            "Local Service"
        );
    };

    const canCancel =
        booking.status === "Pending" ||
        booking.status === "Confirmed";

    return (
        <div
            className="card"
            style={{
                padding: "1.5rem",
                marginBottom: "1.25rem"
            }}
        >

            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "1rem",
                    flexWrap: "wrap"
                }}
            >

                {/* LEFT SIDE */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1.25rem"
                    }}
                >

                    {/* SERIAL NUMBER */}
                    <div
                        style={{
                            minWidth: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "var(--primary)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "1rem",
                            marginTop: "0.5rem"
                        }}
                    >
                        {serialNumber}
                    </div>


                    {/* SERVICE ICON */}
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            background:
                                "var(--primary-light)",
                            borderRadius:
                                "var(--radius-md)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.75rem",
                            flexShrink: 0
                        }}
                    >
                        {booking.service_icon || "🛠️"}
                    </div>


                    {/* BOOKING DETAILS */}
                    <div>

                        {/* SERVICE NAME */}
                        <h3
                            style={{
                                fontSize: "1.2rem",
                                fontWeight: 700,
                                marginBottom: "0.25rem"
                            }}
                        >
                            Service {serialNumber} -{" "}
                            {getServiceName()}
                        </h3>


                        {/* DATE & TIME */}
                        <p
                            style={{
                                color: "var(--text-muted)",
                                fontSize: "0.9rem",
                                marginBottom: "0.25rem"
                            }}
                        >
                            📅{" "}
                            {formatDate(
                                booking.service_date
                            )}{" "}
                            at{" "}
                            {formatTime(
                                booking.service_time
                            )}
                        </p>


                        {/* ADDRESS */}
                        <p
                            style={{
                                color: "var(--text-muted)",
                                fontSize: "0.85rem",
                                marginBottom: "0.25rem"
                            }}
                        >
                            📍{" "}
                            {booking.address ||
                                "Address not available"}
                        </p>


                        {/* NAME */}
                        <p
                            style={{
                                color: "var(--text-muted)",
                                fontSize: "0.85rem",
                                marginBottom: "0.25rem"
                            }}
                        >
                            👤{" "}
                            {booking.name ||
                                "Name not available"}
                        </p>


                        {/* PHONE */}
                        <p
                            style={{
                                color: "var(--text-muted)",
                                fontSize: "0.85rem"
                            }}
                        >
                            📞{" "}
                            {booking.phone ||
                                "Phone not available"}
                        </p>


                        {/* REFERENCE */}
                        <span
                            style={{
                                display: "inline-block",
                                marginTop: "0.5rem",
                                fontSize: "0.8rem",
                                fontFamily:
                                    "var(--font-code)",
                                color:
                                    "var(--primary)",
                                fontWeight: 700
                            }}
                        >
                            Ref: {booking.id}
                        </span>

                    </div>

                </div>


                {/* RIGHT SIDE */}
                <div
                    style={{
                        textAlign: "right",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end"
                    }}
                >

                    {/* STATUS */}
                    <span
                        className={`badge ${getBadgeClass(
                            booking.status
                        )}`}
                    >
                        {booking.status || "Pending"}
                    </span>


                    {/* CANCEL BUTTON */}
                    {canCancel && onCancel && (
                        <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{
                                marginTop: "0.75rem",
                                borderColor:
                                    "var(--danger)",
                                color:
                                    "var(--danger)"
                            }}
                            onClick={() =>
                                onCancel(booking.id)
                            }
                        >
                            Cancel Booking
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}