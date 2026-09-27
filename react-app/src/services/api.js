const API_BASE_URL = "http://127.0.0.1:8000/api";


// =====================================
// SERVICES
// =====================================

export async function getServices() {
    const response = await fetch(
        `${API_BASE_URL}/services/`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch services");
    }

    return await response.json();
}


// =====================================
// SERVICE BY ID
// =====================================

export async function getServiceById(serviceId) {
    const services = await getServices();

    return services.find(
        (service) =>
            String(service.id) === String(serviceId)
    ) || null;
}


// =====================================
// USERS
// =====================================

export async function getUsers() {
    const response = await fetch(
        `${API_BASE_URL}/users/`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return await response.json();
}


// =====================================
// USER BY ID
// =====================================

export async function getUserById(userId) {
    const response = await fetch(
        `${API_BASE_URL}/users/${userId}/`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    return await response.json();
}


// =====================================
// CREATE USER
// =====================================

export async function createUser(userData) {
    const response = await fetch(
        `${API_BASE_URL}/users/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        }
    );

    if (!response.ok) {
        let errorMessage = "Failed to create user";

        try {
            const errorData = await response.json();

            errorMessage = Object.values(errorData)
                .flat()
                .join(" ");
        } catch (error) {
            console.error(error);
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}


// =====================================
// BOOKINGS - GET
// =====================================

export async function getBookings() {
    const response = await fetch(
        `${API_BASE_URL}/bookings/`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return await response.json();
}


// =====================================
// BOOKINGS - CREATE
// =====================================

export async function createBooking(bookingData) {
    const response = await fetch(
        `${API_BASE_URL}/bookings/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(bookingData)
        }
    );

    if (!response.ok) {
        let errorMessage =
            "Failed to create booking";

        try {
            const errorData =
                await response.json();

            console.error(
                "Booking API Error:",
                errorData
            );

            errorMessage =
                Object.values(errorData)
                    .flat()
                    .join(" ");
        } catch (error) {
            console.error(
                "Could not read API error:",
                error
            );
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}


// =====================================
// BOOKING - GET ONE
// =====================================

export async function getBookingById(bookingId) {
    const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch booking"
        );
    }

    return await response.json();
}


// =====================================
// BOOKING - UPDATE
// =====================================

export async function updateBooking(
    bookingId,
    bookingData
) {
    const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(bookingData)
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to update booking"
        );
    }

    return await response.json();
}


// =====================================
// BOOKING - DELETE
// =====================================

export async function deleteBooking(bookingId) {
    const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to delete booking"
        );
    }

    return true;
}


// =====================================
// REVIEWS - GET
// =====================================

export async function getReviews() {
    const response = await fetch(
        `${API_BASE_URL}/reviews/`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch reviews"
        );
    }

    return await response.json();
}


// =====================================
// REVIEW - CREATE
// =====================================

export async function createReview(reviewData) {
    const response = await fetch(
        `${API_BASE_URL}/reviews/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(reviewData)
        }
    );

    if (!response.ok) {
        let errorMessage =
            "Failed to create review";

        try {
            const errorData =
                await response.json();

            console.error(
                "Review API Error:",
                errorData
            );

            errorMessage =
                Object.values(errorData)
                    .flat()
                    .join(" ");
        } catch (error) {
            console.error(error);
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}


// =====================================
// CURRENT USER
// =====================================

export function getCurrentUser() {
    try {
        const user =
            localStorage.getItem("currentUser");

        return user
            ? JSON.parse(user)
            : null;
    } catch (error) {
        console.error(
            "Failed to get current user:",
            error
        );

        return null;
    }
}


// =====================================
// SET CURRENT USER
// =====================================

export function setCurrentUser(user) {
    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );
}


// =====================================
// LOGOUT
// =====================================

export function logout() {
    localStorage.removeItem(
        "currentUser"
    );
}


// =====================================
// API OBJECT
// =====================================

export const api = {

    getServices,
    getServiceById,

    getUsers,
    getUserById,
    createUser,

    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,

    getReviews,
    createReview,

    getCurrentUser,
    setCurrentUser,
    logout
};