import React, { useState, useEffect, useMemo } from "react";

import {
    getServices,
    createBooking
} from "../services/api";


// =====================================
// TIME SLOTS
// =====================================

const TIME_SLOTS = [
    "08:30 AM",
    "10:00 AM",
    "11:30 AM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM"
];


// =====================================
// GET LOCAL DATE
// =====================================

function getLocalDate() {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// =====================================
// TIME TO MINUTES
// =====================================

function timeToMinutes(time) {
    if (!time) {
        return 0;
    }

    const [timePart, modifier] = time.split(" ");

    let [hours, minutes] = timePart
        .split(":")
        .map(Number);

    if (modifier === "PM" && hours !== 12) {
        hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
        hours = 0;
    }

    return hours * 60 + minutes;
}


// =====================================
// CURRENT TIME
// =====================================

function getCurrentMinutes() {
    const now = new Date();

    return (
        now.getHours() * 60 +
        now.getMinutes()
    );
}


// =====================================
// CONVERT TIME
// =====================================

function convertTimeTo24Hour(time) {
    if (!time) {
        return "00:00:00";
    }

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

    return `${hours.padStart(2, "0")}:${minutes}:00`;
}


// =====================================
// BOOKING COMPONENT
// =====================================

export default function Booking({
    navigate,
    user,
    params
}) {

    // =====================================
    // STATES
    // =====================================

    const [services, setServices] =
        useState([]);

    const [selectedServiceId, setSelectedServiceId] =
        useState(params?.serviceId || "");

    const [bookingDate, setBookingDate] =
        useState(getLocalDate());

    const [selectedSlot, setSelectedSlot] =
        useState("");

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

    const [timeTick, setTimeTick] =
        useState(0);


    // =====================================
    // LOGIN CHECK
    // =====================================

    useEffect(() => {

        if (!user) {

            navigate("login");

        }

    }, [user, navigate]);


    // =====================================
    // UPDATE USER DETAILS
    // =====================================

    useEffect(() => {

        if (user?.name) {
            setName(user.name);
        }

        if (user?.email) {
            setEmail(user.email);
        }

        if (user?.phone) {

            setPhone(
                String(user.phone)
                    .replace(/\D/g, "")
                    .slice(0, 10)
            );

        }

    }, [user]);


    // =====================================
    // LOAD SERVICES
    // =====================================

    useEffect(() => {

        const loadServices = async () => {

            try {

                setLoading(true);

                const data =
                    await getServices();

                const serviceList =
                    Array.isArray(data)
                        ? data
                        : [];

                setServices(serviceList);


                // =================================
                // SERVICE FROM PAGE
                // =================================

                if (params?.serviceId) {

                    const requestedService =
                        serviceList.find(
                            (service) =>
                                String(service.id) ===
                                String(params.serviceId)
                        );

                    if (requestedService) {

                        setSelectedServiceId(
                            String(
                                requestedService.id
                            )
                        );

                    }

                } else {

                    // =================================
                    // DEFAULT SERVICE = CLEANING
                    // =================================

                    const cleaningService =
                        serviceList.find(
                            (service) =>
                                service.name
                                    ?.trim()
                                    .toLowerCase() ===
                                "cleaning"
                        );

                    if (cleaningService) {

                        setSelectedServiceId(
                            String(
                                cleaningService.id
                            )
                        );

                    } else if (
                        serviceList.length > 0
                    ) {

                        setSelectedServiceId(
                            String(
                                serviceList[0].id
                            )
                        );

                    }

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

    }, [params?.serviceId]);


    // =====================================
    // CURRENT SERVICE
    // =====================================

    const currentService =
        services.find(
            (service) =>
                String(service.id) ===
                String(selectedServiceId)
        ) || null;


    // =====================================
    // PRICE
    // =====================================

    const basePrice =
        Number(
            currentService?.price || 0
        );

    const tax =
        Math.round(
            basePrice * 0.05
        );

    const platformFee = 49;

    const totalAmount =
        basePrice +
        tax +
        platformFee;


    // =====================================
    // AVAILABLE SLOTS
    // =====================================

    const availableSlots = useMemo(() => {

        void timeTick;

        // Future date
        if (
            bookingDate &&
            bookingDate !== getLocalDate()
        ) {

            return TIME_SLOTS;

        }

        // Today
        const currentMinutes =
            getCurrentMinutes();

        return TIME_SLOTS.filter(
            (slot) =>
                timeToMinutes(slot) >
                currentMinutes
        );

    }, [bookingDate, timeTick]);


    // =====================================
    // AUTO SELECT SLOT
    // =====================================

    useEffect(() => {

        if (
            selectedSlot &&
            availableSlots.includes(
                selectedSlot
            )
        ) {

            return;

        }

        if (
            availableSlots.length > 0
        ) {

            setSelectedSlot(
                availableSlots[0]
            );

        } else {

            setSelectedSlot("");

        }

    }, [
        availableSlots,
        selectedSlot
    ]);


    // =====================================
    // REFRESH TIME EVERY MINUTE
    // =====================================

    useEffect(() => {

        const interval =
            setInterval(() => {

                setTimeTick(
                    (value) => value + 1
                );

            }, 60000);

        return () => {
            clearInterval(interval);
        };

    }, []);


    // =====================================
    // DATE CHANGE
    // =====================================

    const handleDateChange = (e) => {

        setBookingDate(
            e.target.value
        );

        setErrors(
            (previous) => ({
                ...previous,
                date: "",
                time: "",
                form: ""
            })
        );

    };


    // =====================================
    // SERVICE CHANGE
    // =====================================

    const handleServiceChange = (e) => {

        setSelectedServiceId(
            e.target.value
        );

        setErrors(
            (previous) => ({
                ...previous,
                service: "",
                form: ""
            })
        );

    };


    // =====================================
    // SUBMIT BOOKING
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const newErrors = {};


        // =================================
        // NAME
        // =================================

        if (!name.trim()) {

            newErrors.name =
                "Please provide your full name.";

        }


        // =================================
        // EMAIL
        // =================================

        const cleanEmail =
            email.trim().toLowerCase();

        if (
            !cleanEmail ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                cleanEmail
            )
        ) {

            newErrors.email =
                "Valid email is required.";

        }


        // =================================
        // PHONE
        // =================================

        const cleanPhone =
            phone.replace(/\D/g, "");

        if (
            cleanPhone.length !== 10
        ) {

            newErrors.phone =
                "Valid 10-digit phone number is required.";

        }


        // =================================
        // ADDRESS
        // =================================

        if (!address.trim()) {

            newErrors.address =
                "Service location address is required.";

        }


        // =================================
        // DATE
        // =================================

        if (!bookingDate) {

            newErrors.date =
                "Please choose a date.";

        }


        // =================================
        // SERVICE
        // =================================

        if (!currentService) {

            newErrors.service =
                "Please select a service.";

        }


        // =================================
        // TIME
        // =================================

        if (!selectedSlot) {

            newErrors.time =
                "Please select an available time slot.";

        }


        // =================================
        // SHOW VALIDATION ERRORS
        // =================================

        if (
            Object.keys(newErrors).length > 0
        ) {

            setErrors(newErrors);

            return;

        }


        // =================================
        // CHECK PAST TIME
        // =================================

        if (
            bookingDate === getLocalDate() &&
            timeToMinutes(selectedSlot) <=
                getCurrentMinutes()
        ) {

            setErrors({
                time:
                    "This time slot has already passed. Please select another slot."
            });

            return;

        }


        setSubmitting(true);

        setErrors({});


        try {

            // =================================
            // CREATE BOOKING
            // =================================
            //
            // Login already checked above.
            //
            // Backend receives email.
            //
            // Existing email:
            // Existing user is used.
            //
            // New email:
            // User is automatically created.
            //
            // Then booking is saved.
            // =================================

            const booking =
                await createBooking({

                    service:
                        currentService.id,

                    name:
                        name.trim(),

                    email:
                        cleanEmail,

                    phone:
                        cleanPhone,

                    address:
                        address.trim(),

                    service_date:
                        bookingDate,

                    service_time:
                        convertTimeTo24Hour(
                            selectedSlot
                        ),

                    description:
                        instructions.trim()

                });


            // =================================
            // BOOKING CONFIRMED
            // =================================

            setConfirmedBooking({

                id:
                    booking.id,

                serviceName:
                    currentService.name,

                bookingDate:
                    booking.service_date,

                timeSlot:
                    selectedSlot,

                address:
                    booking.address,

                basePrice:
                    basePrice,

                tax:
                    tax,

                platformFee:
                    platformFee,

                totalAmount:
                    totalAmount

            });

        } catch (error) {

            console.error(
                "Booking Error:",
                error
            );

            let message =
                error.message ||
                "Failed to submit booking.";


            // =================================
            // ALREADY BOOKED
            // =================================

            if (
                message
                    .toLowerCase()
                    .includes(
                        "already booked"
                    )
            ) {

                message =
                    "This service is already booked for the selected date and time. Please choose another time.";

            }


            setErrors({
                form: message
            });

        } finally {

            setSubmitting(false);

        }

    };


    // =====================================
    // NOT LOGGED IN
    // =====================================

    if (!user) {

        return (

            <main
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "3rem 1rem"
                }}
            >

                <div
                    className="card"
                    style={{
                        maxWidth: "450px",
                        width: "100%",
                        padding: "2.5rem 2rem",
                        textAlign: "center"
                    }}
                >

                    <div
                        style={{
                            fontSize: "3rem",
                            marginBottom: "1rem"
                        }}
                    >
                        🔐
                    </div>


                    <h2>
                        Login Required
                    </h2>


                    <p
                        style={{
                            color:
                                "var(--text-muted)",
                            margin:
                                "1rem 0 1.5rem",
                            lineHeight: 1.6
                        }}
                    >
                        Please login to your account
                        before booking a service.
                    </p>


                    <button
                        className="btn btn-primary btn-block"
                        onClick={() =>
                            navigate("login")
                        }
                    >
                        Login to Continue
                    </button>


                    <button
                        className="btn btn-secondary btn-block"
                        style={{
                            marginTop: "0.75rem"
                        }}
                        onClick={() =>
                            navigate("register")
                        }
                    >
                        Create New Account
                    </button>

                </div>

            </main>

        );

    }


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
    // CONFIRMATION
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
                                fontSize:
                                    "1.85rem",
                                marginBottom:
                                    "0.5rem"
                            }}
                        >
                            Booking Confirmed!
                        </h2>


                        <p
                            style={{
                                color:
                                    "var(--text-muted)",
                                marginBottom:
                                    "1.5rem"
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
                                textAlign:
                                    "left",
                                background:
                                    "var(--bg-main)",
                                padding:
                                    "1.25rem",
                                borderRadius:
                                    "var(--radius-md)",
                                marginBottom:
                                    "2rem",
                                fontSize:
                                    "0.95rem",
                                lineHeight:
                                    1.7
                            }}
                        >

                            <div>
                                <strong>
                                    Service:
                                </strong>{" "}
                                {
                                    confirmedBooking.serviceName
                                }
                            </div>


                            <div>
                                <strong>
                                    Date & Time:
                                </strong>{" "}
                                {
                                    confirmedBooking.bookingDate
                                }{" "}
                                at{" "}
                                {
                                    confirmedBooking.timeSlot
                                }
                            </div>


                            <div>
                                <strong>
                                    Location:
                                </strong>{" "}
                                {
                                    confirmedBooking.address
                                }
                            </div>


                            <div>
                                <strong>
                                    Service Price:
                                </strong>{" "}
                                ₹
                                {
                                    confirmedBooking.basePrice
                                }
                            </div>


                            <div>
                                <strong>
                                    GST (5%):
                                </strong>{" "}
                                ₹
                                {
                                    confirmedBooking.tax
                                }
                            </div>


                            <div>
                                <strong>
                                    Platform & Safety Fee:
                                </strong>{" "}
                                ₹
                                {
                                    confirmedBooking.platformFee
                                }
                            </div>


                            <div>
                                <strong>
                                    Total Amount:
                                </strong>{" "}
                                ₹
                                {
                                    confirmedBooking.totalAmount
                                }
                            </div>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                justifyContent:
                                    "center",
                                flexWrap:
                                    "wrap"
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


    // =====================================
    // MAIN BOOKING PAGE
    // =====================================

    return (

        <div>

            {/* =================================
                HEADER
            ================================= */}

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


            {/* =================================
                CONTENT
            ================================= */}

            <main className="booking-layout">

                <div className="container booking-grid">


                    {/* =================================
                        BOOKING FORM
                    ================================= */}

                    <div className="booking-form-card">

                        {errors.form && (

                            <div
                                className="field-error visible"
                                style={{
                                    marginBottom:
                                        "1rem"
                                }}
                            >
                                {errors.form}
                            </div>

                        )}


                        <form
                            onSubmit={
                                handleSubmit
                            }
                            noValidate
                        >


                            {/* =================================
                                STEP 1
                            ================================= */}

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
                                    marginBottom:
                                        "2rem"
                                }}
                            >

                                <label className="form-label">
                                    Service Type
                                </label>


                                <select
                                    className="form-input"
                                    style={{
                                        paddingLeft:
                                            "1rem",
                                        cursor:
                                            "pointer"
                                    }}
                                    value={
                                        selectedServiceId
                                    }
                                    onChange={
                                        handleServiceChange
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
                                                {
                                                    service.name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>


                                {errors.service && (

                                    <div className="field-error visible">
                                        {
                                            errors.service
                                        }
                                    </div>

                                )}

                            </div>


                            {/* =================================
                                STEP 2
                            ================================= */}

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
                                    marginBottom:
                                        "2rem"
                                }}
                            >

                                {/* DATE */}

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
                                            getLocalDate()
                                        }
                                        value={
                                            bookingDate
                                        }
                                        onChange={
                                            handleDateChange
                                        }
                                    />


                                    {errors.date && (

                                        <div className="field-error visible">
                                            {
                                                errors.date
                                            }
                                        </div>

                                    )}

                                </div>


                                {/* TIME */}

                                <div className="form-group">

                                    <label className="form-label">
                                        Available Slots
                                    </label>


                                    {availableSlots.length ===
                                    0 ? (

                                        <div
                                            style={{
                                                padding:
                                                    "1rem",
                                                background:
                                                    "#fff7ed",
                                                border:
                                                    "1px solid #fed7aa",
                                                borderRadius:
                                                    "8px",
                                                color:
                                                    "#c2410c",
                                                fontSize:
                                                    "0.9rem"
                                            }}
                                        >
                                            No time slots are
                                            available for today.
                                            Please select another
                                            date.
                                        </div>

                                    ) : (

                                        <div className="time-slots-grid">

                                            {availableSlots.map(
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
                                                        onClick={() => {

                                                            setSelectedSlot(
                                                                slot
                                                            );

                                                            setErrors(
                                                                (
                                                                    previous
                                                                ) => ({
                                                                    ...previous,
                                                                    time:
                                                                        ""
                                                                })
                                                            );

                                                        }}
                                                    >
                                                        {slot}
                                                    </button>

                                                )
                                            )}

                                        </div>

                                    )}


                                    {errors.time && (

                                        <div className="field-error visible">
                                            {
                                                errors.time
                                            }
                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* =================================
                                STEP 3
                            ================================= */}

                            <div className="booking-step-title">

                                <span className="step-badge">
                                    3
                                </span>

                                <span>
                                    Contact & Address
                                </span>

                            </div>


                            {/* NAME + PHONE */}

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap:
                                        "1rem",
                                    marginBottom:
                                        "1.25rem"
                                }}
                            >

                                {/* NAME */}

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
                                            {
                                                errors.name
                                            }
                                        </div>

                                    )}

                                </div>


                                {/* PHONE */}

                                <div className="form-group">

                                    <label className="form-label">
                                        Phone Number
                                    </label>


                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength="10"
                                        className={`form-input ${
                                            errors.phone
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        style={{
                                            paddingLeft:
                                                "1rem"
                                        }}
                                        placeholder="Enter 10-digit phone number"
                                        value={phone}
                                        onChange={(e) => {

                                            const value =
                                                e.target.value
                                                    .replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                    .slice(
                                                        0,
                                                        10
                                                    );

                                            setPhone(
                                                value
                                            );

                                        }}
                                    />


                                    {errors.phone && (

                                        <div className="field-error visible">
                                            {
                                                errors.phone
                                            }
                                        </div>

                                    )}

                                </div>

                            </div>


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
                                                    email:
                                                        ""
                                                })
                                            );

                                        }

                                    }}
                                />


                                {errors.email && (

                                    <div className="field-error visible">
                                        {
                                            errors.email
                                        }
                                    </div>

                                )}

                            </div>


                            {/* ADDRESS */}

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
                                        minHeight:
                                            "80px",
                                        resize:
                                            "vertical"
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
                                        {
                                            errors.address
                                        }
                                    </div>

                                )}

                            </div>


                            {/* INSTRUCTIONS */}

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
                                    value={
                                        instructions
                                    }
                                    onChange={(e) =>
                                        setInstructions(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                className="btn btn-primary btn-block btn-lg"
                                disabled={
                                    submitting ||
                                    !currentService ||
                                    !selectedSlot
                                }
                            >

                                {submitting
                                    ? "Confirming Appointment..."
                                    : "Confirm & Book Service"}

                            </button>

                        </form>

                    </div>


                    {/* =================================
                        SUMMARY
                    ================================= */}

                    <aside className="booking-summary-card">

                        <h3 className="summary-title">
                            Booking Summary
                        </h3>


                        {currentService && (

                            <>

                                <div className="selected-service-banner">

                                    <div className="summary-icon">

                                        {
                                            currentService.icon ||
                                            "🛠️"
                                        }

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
                                            Service Date:
                                        </span>

                                        <strong>
                                            {
                                                bookingDate
                                            }
                                        </strong>

                                    </div>


                                    <div className="summary-row">

                                        <span>
                                            Selected Time Slot:
                                        </span>

                                        <strong>
                                            {
                                                selectedSlot ||
                                                "Select a time"
                                            }
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