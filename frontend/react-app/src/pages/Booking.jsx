import React, { useState, useEffect } from "react";
import { getServices, getUsers, createBooking } from "../services/api";

export default function Booking({ navigate, user, params }) {

    const [services, setServices] = useState([]);

    const [selectedServiceId, setSelectedServiceId] =
        useState(params?.serviceId || "");

    const [bookingDate, setBookingDate] =
        useState(new Date().toISOString().split("T")[0]);

    const [selectedSlot, setSelectedSlot] =
        useState("10:00 AM");

    const [name, setName] =
        useState(user?.name || "");

    const [email, setEmail] =
        useState(user?.email || "");

    const [phone, setPhone] =
        useState(user?.phone || "");

    const [address, setAddress] =
        useState("");

    const [instructions, setInstructions] =
        useState("");

    const [errors, setErrors] =
        useState({});

    const [confirmedBooking, setConfirmedBooking] =
        useState(null);

    const [submitting, setSubmitting] =
        useState(false);

    const [loading, setLoading] =
        useState(true);


    // =====================================
    // LOAD SERVICES
    // =====================================

    useEffect(() => {

        const loadServices = async () => {

            try {

                const data = await getServices();

                setServices(data);

                if (params?.serviceId) {

                    setSelectedServiceId(
                        String(params.serviceId)
                    );

                } else if (data.length > 0) {

                    setSelectedServiceId(
                        String(data[0].id)
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to load services:",
                    error
                );

                setErrors({
                    form:
                        "Unable to load services from server."
                });

            } finally {

                setLoading(false);

            }

        };

        loadServices();

    }, [params]);


    // =====================================
    // CURRENT SERVICE
    // =====================================

    const currentService =
        services.find(
            (service) =>
                String(service.id) ===
                String(selectedServiceId)
        ) ||
        services[0] ||
        null;


    // =====================================
    // PRICE
    // =====================================

    const basePrice =
        Number(currentService?.price || 499);

    const tax =
        Math.round(basePrice * 0.05);

    const platformFee = 49;

    const totalAmount =
        basePrice + tax + platformFee;


    // =====================================
    // SUBMIT BOOKING
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const newErrors = {};


        if (!name.trim()) {

            newErrors.name =
                "Please provide your full name.";

        }


        if (
            !email.trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {

            newErrors.email =
                "Valid email is required.";

        }


        if (
            !phone.trim() ||
            phone.replace(/\D/g, "").length < 10
        ) {

            newErrors.phone =
                "Valid phone number is required.";

        }


        if (!address.trim()) {

            newErrors.address =
                "Service location address is required.";

        }


        if (!bookingDate) {

            newErrors.date =
                "Please choose a date.";

        }


        if (!currentService) {

            newErrors.form =
                "Please select a service.";

        }


        if (Object.keys(newErrors).length > 0) {

            setErrors(newErrors);

            return;

        }


        setSubmitting(true);

        setErrors({});


        try {

            /*
             * Current Django Booking model requires:
             *
             * user
             * service
             * name
             * phone
             * address
             * service_date
             * service_time
             * description
             */

            let userId = user?.id;


            // If no logged-in user ID, try to find
            // the user using the email address.
            if (!userId && email.trim()) {

                try {

                    const users = await getUsers();

                    const foundUser = users.find(
                        (item) =>
                            item.email?.toLowerCase() ===
                            email.trim().toLowerCase()
                    );

                    if (foundUser) {

                        userId = foundUser.id;

                    }

                } catch (userError) {

                    console.error(
                        "User lookup failed:",
                        userError
                    );

                }

            }


            if (!userId) {

                throw new Error(
                    "Please login before booking a service."
                );

            }


            const booking = await createBooking({

                user: userId,

                service: currentService.id,

                name: name.trim(),

                phone: phone.trim(),

                address: address.trim(),

                service_date: bookingDate,

                service_time: convertTimeTo24Hour(
                    selectedSlot
                ),

                description:
                    instructions.trim()

            });


            setConfirmedBooking({

                id: booking.id,

                serviceName:
                    currentService.name,

                bookingDate:
                    booking.service_date,

                timeSlot:
                    selectedSlot,

                address:
                    booking.address,

                totalAmount

            });


        } catch (err) {

            console.error(
                "Booking Error:",
                err
            );

            setErrors({

                form:
                    err.message ||
                    "Failed to submit booking."

            });

        } finally {

            setSubmitting(false);

        }

    };


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

                Loading booking page...

            </div>

        );

    }


    // =====================================
    // CONFIRMED
    // =====================================

    if (confirmedBooking) {

        return (

            <main className="section-padding">

                <div
                    className="container"
                    style={{
                        maxWidth: "560px"
                    }}
                >

                    <div
                        className="card"
                        style={{
                            padding: "3rem 2rem",
                            textAlign: "center"
                        }}
                    >

                        <div className="modal-icon-success">
                            ✓
                        </div>


                        <h2
                            style={{
                                fontSize: "1.85rem",
                                marginBottom: "0.5rem"
                            }}
                        >
                            Booking Confirmed!
                        </h2>


                        <p
                            style={{
                                color:
                                    "var(--text-muted)",
                                marginBottom: "1.5rem"
                            }}
                        >
                            Your service appointment
                            has been submitted successfully.
                        </p>


                        <div className="modal-booking-ref">

                            Booking Reference:{" "}
                            {confirmedBooking.id}

                        </div>


                        <div
                            style={{
                                textAlign: "left",
                                background:
                                    "var(--bg-main)",
                                padding: "1.25rem",
                                borderRadius:
                                    "var(--radius-md)",
                                marginBottom: "2rem",
                                fontSize: "0.95rem",
                                lineHeight: 1.7
                            }}
                        >

                            <div>
                                <strong>
                                    Service:
                                </strong>{" "}
                                {confirmedBooking.serviceName}
                            </div>

                            <div>
                                <strong>
                                    Date & Time:
                                </strong>{" "}
                                {confirmedBooking.bookingDate}
                                {" "}at{" "}
                                {confirmedBooking.timeSlot}
                            </div>

                            <div>
                                <strong>
                                    Location:
                                </strong>{" "}
                                {confirmedBooking.address}
                            </div>

                            <div>
                                <strong>
                                    Estimated Amount:
                                </strong>{" "}
                                ₹{confirmedBooking.totalAmount}
                            </div>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                justifyContent: "center",
                                flexWrap: "wrap"
                            }}
                        >

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate(
                                        "my-bookings"
                                    )
                                }
                            >
                                View My Bookings
                            </button>


                            <button
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate(
                                        "services"
                                    )
                                }
                            >
                                Browse Other Services
                            </button>

                        </div>

                    </div>

                </div>

            </main>

        );

    }


    return (

        <div>

            {/* ================= HEADER ================= */}

            <section className="booking-header">

                <div className="container">

                    <h1>
                        Schedule Your Service
                    </h1>

                    <p>
                        Book a local specialist at
                        your preferred time.
                    </p>

                </div>

            </section>


            {/* ================= FORM ================= */}

            <main className="booking-layout">

                <div className="container booking-grid">


                    <div className="booking-form-card">

                        {errors.form && (

                            <div
                                className="field-error visible"
                                style={{
                                    marginBottom: "1rem"
                                }}
                            >
                                {errors.form}
                            </div>

                        )}


                        <form
                            onSubmit={handleSubmit}
                            noValidate
                        >


                            {/* STEP 1 */}

                            <div className="booking-step-title">

                                <span className="step-badge">
                                    1
                                </span>

                                <span>
                                    Select Service
                                </span>

                            </div>


                            <div
                                className="form-group"
                                style={{
                                    marginBottom: "2rem"
                                }}
                            >

                                <label className="form-label">
                                    Service Type
                                </label>


                                <select
                                    className="form-input"
                                    style={{
                                        paddingLeft: "1rem",
                                        cursor: "pointer"
                                    }}
                                    value={
                                        selectedServiceId
                                    }
                                    onChange={(e) =>
                                        setSelectedServiceId(
                                            e.target.value
                                        )
                                    }
                                >

                                    {services.map(
                                        (service) => (

                                            <option
                                                key={
                                                    service.id
                                                }
                                                value={
                                                    service.id
                                                }
                                            >
                                                {service.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* STEP 2 */}

                            <div className="booking-step-title">

                                <span className="step-badge">
                                    2
                                </span>

                                <span>
                                    Date & Time Slot
                                </span>

                            </div>


                            <div
                                style={{
                                    marginBottom: "2rem"
                                }}
                            >

                                <div
                                    className="form-group"
                                    style={{
                                        marginBottom:
                                            "1.25rem"
                                    }}
                                >

                                    <label className="form-label">
                                        Service Date
                                    </label>


                                    <input
                                        type="date"
                                        className={`form-input ${
                                            errors.date
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        style={{
                                            paddingLeft:
                                                "1rem"
                                        }}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        value={
                                            bookingDate
                                        }
                                        onChange={(e) =>
                                            setBookingDate(
                                                e.target.value
                                            )
                                        }
                                    />


                                    {errors.date && (

                                        <div className="field-error visible">
                                            {errors.date}
                                        </div>

                                    )}

                                </div>


                                <div className="form-group">

                                    <label className="form-label">
                                        Available Slots
                                    </label>


                                    <div className="time-slots-grid">

                                        {[
                                            "08:30 AM",
                                            "10:00 AM",
                                            "11:30 AM",
                                            "02:00 PM",
                                            "04:00 PM",
                                            "06:00 PM"
                                        ].map(
                                            (slot) => (

                                                <button
                                                    key={
                                                        slot
                                                    }
                                                    type="button"
                                                    className={`slot-btn ${
                                                        selectedSlot ===
                                                        slot
                                                            ? "selected"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedSlot(
                                                            slot
                                                        )
                                                    }
                                                >
                                                    {slot}
                                                </button>

                                            )
                                        )}

                                    </div>

                                </div>

                            </div>


                            {/* STEP 3 */}

                            <div className="booking-step-title">

                                <span className="step-badge">
                                    3
                                </span>

                                <span>
                                    Contact & Address
                                </span>

                            </div>


                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: "1rem",
                                    marginBottom:
                                        "1.25rem"
                                }}
                            >

                                <div className="form-group">

                                    <label className="form-label">
                                        Full Name
                                    </label>


                                    <input
                                        type="text"
                                        className={`form-input ${
                                            errors.name
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        style={{
                                            paddingLeft:
                                                "1rem"
                                        }}
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                    />


                                    {errors.name && (

                                        <div className="field-error visible">
                                            {errors.name}
                                        </div>

                                    )}

                                </div>


                                <div className="form-group">

                                    <label className="form-label">
                                        Phone Number
                                    </label>


                                    <input
                                        type="tel"
                                        className={`form-input ${
                                            errors.phone
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        style={{
                                            paddingLeft:
                                                "1rem"
                                        }}
                                        placeholder="9876543210"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(
                                                e.target.value
                                            )
                                        }
                                    />


                                    {errors.phone && (

                                        <div className="field-error visible">
                                            {errors.phone}
                                        </div>

                                    )}

                                </div>

                            </div>


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
                                    className={`form-input ${
                                        errors.email
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    style={{
                                        paddingLeft:
                                            "1rem"
                                    }}
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                />


                                {errors.email && (

                                    <div className="field-error visible">
                                        {errors.email}
                                    </div>

                                )}

                            </div>


                            <div
                                className="form-group"
                                style={{
                                    marginBottom:
                                        "1.25rem"
                                }}
                            >

                                <label className="form-label">
                                    Doorstep Service Address
                                </label>


                                <textarea
                                    className={`form-input ${
                                        errors.address
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    style={{
                                        padding:
                                            "0.75rem 1rem",
                                        minHeight: "80px",
                                        resize: "vertical"
                                    }}
                                    placeholder="Apartment/Flat No, Street, Landmark, Pincode"
                                    value={address}
                                    onChange={(e) =>
                                        setAddress(
                                            e.target.value
                                        )
                                    }
                                />


                                {errors.address && (

                                    <div className="field-error visible">
                                        {errors.address}
                                    </div>

                                )}

                            </div>


                            <div
                                className="form-group"
                                style={{
                                    marginBottom:
                                        "2rem"
                                }}
                            >

                                <label className="form-label">
                                    Special Instructions
                                    (Optional)
                                </label>


                                <input
                                    type="text"
                                    className="form-input"
                                    style={{
                                        paddingLeft:
                                            "1rem"
                                    }}
                                    placeholder="Any additional instructions"
                                    value={instructions}
                                    onChange={(e) =>
                                        setInstructions(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <button
                                type="submit"
                                className="btn btn-primary btn-block btn-lg"
                                disabled={
                                    submitting ||
                                    !currentService
                                }
                            >
                                {submitting
                                    ? "Confirming Appointment..."
                                    : "Confirm & Book Service"}
                            </button>

                        </form>

                    </div>


                    {/* ================= SUMMARY ================= */}

                    <aside className="booking-summary-card">

                        <h3 className="summary-title">
                            Booking Summary
                        </h3>


                        {currentService && (

                            <>

                                <div className="selected-service-banner">

                                    <div className="summary-icon">
                                        {currentService.icon ||
                                            "🛠️"}
                                    </div>


                                    <div className="summary-service-info">

                                        <h4>
                                            {
                                                currentService.name
                                            }
                                        </h4>

                                        <span>
                                            Doorstep Service
                                        </span>

                                    </div>

                                </div>


                                <div className="summary-breakdown">

                                    <div className="summary-row">

                                        <span>
                                            Selected Time Slot:
                                        </span>

                                        <strong>
                                            {selectedSlot}
                                        </strong>

                                    </div>


                                    <div className="summary-row">

                                        <span>
                                            Service Base Price:
                                        </span>

                                        <span>
                                            ₹{basePrice}
                                        </span>

                                    </div>


                                    <div className="summary-row">

                                        <span>
                                            Platform & Safety Fee:
                                        </span>

                                        <span>
                                            ₹{platformFee}
                                        </span>

                                    </div>


                                    <div className="summary-row">

                                        <span>
                                            GST / Taxes (5%):
                                        </span>

                                        <span>
                                            ₹{tax}
                                        </span>

                                    </div>


                                    <div className="summary-row total">

                                        <span>
                                            Total Amount:
                                        </span>

                                        <span
                                            style={{
                                                color:
                                                    "var(--primary)"
                                            }}
                                        >
                                            ₹{totalAmount}
                                        </span>

                                    </div>

                                </div>


                                <p
                                    style={{
                                        fontSize:
                                            "0.85rem",
                                        color:
                                            "var(--text-muted)",
                                        marginBottom:
                                            "1rem"
                                    }}
                                >
                                    💵{" "}
                                    <strong>
                                        Pay After Service:
                                    </strong>{" "}
                                    Payment can be handled
                                    after the service.
                                </p>


                                <div className="summary-guarantee">

                                    <span>
                                        🛡️ Service quality
                                        support
                                    </span>

                                </div>

                            </>

                        )}

                    </aside>

                </div>

            </main>

        </div>

    );
}


// =====================================
// TIME CONVERTER
// =====================================

function convertTimeTo24Hour(time) {

    const [timePart, modifier] =
        time.split(" ");

    let [hours, minutes] =
        timePart.split(":");

    if (
        modifier === "PM" &&
        hours !== "12"
    ) {

        hours = String(
            Number(hours) + 12
        );

    }

    if (
        modifier === "AM" &&
        hours === "12"
    ) {

        hours = "00";

    }

    return `${hours}:${minutes}:00`;
}