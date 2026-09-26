import React from "react";

export default function BookingCard({
    booking,
    onCancel
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

        const formattedDate =
            new Date(date).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        return formattedDate;
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

        const period =
            hour >= 12 ? "PM" : "AM";

        hour =
            hour % 12 || 12;

        return `${hour}:${minute} ${period}`;
    };


    const getServiceName = () => {

        if (
            booking.service_name
        ) {
            return booking.service_name;
        }

        if (
            booking.serviceName
        ) {
            return booking.serviceName;
        }

        return `Service #${booking.service}`;
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
                        alignItems: "center",
                        gap: "1.25rem"
                    }}
                >

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
                            fontSize: "1.75rem"
                        }}
                    >
                        {booking.service_icon || "🛠️"}
                    </div>


                    {/* BOOKING DETAILS */}

                    <div>

                        <h3
                            style={{
                                fontSize: "1.2rem",
                                fontWeight: 700,
                                marginBottom:
                                    "0.25rem"
                            }}
                        >
                            {getServiceName()}
                        </h3>


                        <p
                            style={{
                                color:
                                    "var(--text-muted)",
                                fontSize:
                                    "0.9rem",
                                marginBottom:
                                    "0.25rem"
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


                        <p
                            style={{
                                color:
                                    "var(--text-muted)",
                                fontSize:
                                    "0.85rem",
                                marginBottom:
                                    "0.25rem"
                            }}
                        >
                            📍{" "}
                            {booking.address ||
                                "Address not available"}
                        </p>


                        <p
                            style={{
                                color:
                                    "var(--text-muted)",
                                fontSize:
                                    "0.85rem",
                                marginBottom:
                                    "0.25rem"
                            }}
                        >
                            👤{" "}
                            {booking.name ||
                                "Name not available"}
                        </p>


                        <p
                            style={{
                                color:
                                    "var(--text-muted)",
                                fontSize:
                                    "0.85rem"
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
                                marginTop:
                                    "0.5rem",
                                fontSize:
                                    "0.8rem",
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
                        flexDirection:
                            "column",
                        alignItems:
                            "flex-end"
                    }}
                >

                    {/* STATUS */}

                    <span
                        className={`badge ${getBadgeClass(
                            booking.status
                        )}`}
                    >
                        {booking.status ||
                            "Pending"}
                    </span>


                    {/* CANCEL BUTTON */}

                    {canCancel &&
                        onCancel && (

                            <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                style={{
                                    marginTop:
                                        "0.75rem",
                                    borderColor:
                                        "var(--danger)",
                                    color:
                                        "var(--danger)"
                                }}
                                onClick={() =>
                                    onCancel(
                                        booking.id
                                    )
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