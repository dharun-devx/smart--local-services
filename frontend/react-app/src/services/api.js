const API_BASE_URL = "http://127.0.0.1:8000/api";


// ==========================================
// SERVICES
// ==========================================

export async function getServices() {
    const response = await fetch(
        `${API_BASE_URL}/services/`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch services");
    }

    return await response.json();
}


export async function getServiceById(serviceId) {
    const services = await getServices();

    return (
        services.find(
            (service) =>
                String(service.id) === String(serviceId)
        ) || null
    );
}


// ==========================================
// USERS
// ==========================================

export async function getUsers() {
    const response = await fetch(
        `${API_BASE_URL}/users/`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return await response.json();
}


export async function getUserById(userId) {
    const response = await fetch(
        `${API_BASE_URL}/users/${userId}/`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    return await response.json();
}


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

        let errorMessage =
            "Failed to create user";

        try {

            const errorData =
                await response.json();

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


// ==========================================
// UPDATE USER PROFILE
// ==========================================

export async function updateUser(
    userId,
    userData
) {

    const response = await fetch(
        `${API_BASE_URL}/users/${userId}/`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: userData.name,
                phone: userData.phone,
                address: userData.address
            })
        }
    );


    let data = {};

    try {

        data = await response.json();

    } catch (error) {

        console.error(
            "Update user response error:",
            error
        );

    }


    if (!response.ok) {

        let errorMessage =
            "Failed to update profile";

        if (data) {

            errorMessage =
                Object.values(data)
                    .flat()
                    .join(" ");

        }

        throw new Error(errorMessage);
    }


    return data;
}


// ==========================================
// LOGIN
// ==========================================

export async function login(
    email,
    password,
    role = "customer"
) {

    const response = await fetch(
        `${API_BASE_URL}/users/login/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email:
                    email
                        .trim()
                        .toLowerCase(),

                password: password,

                role: role
            })
        }
    );


    let data = {};

    try {

        data = await response.json();

    } catch (error) {

        console.error(
            "Login response error:",
            error
        );

    }


    if (!response.ok) {

        throw new Error(
            data.error ||
            data.detail ||
            "Invalid email or password."
        );

    }


    if (!data.user) {

        throw new Error(
            "Invalid login response from server."
        );

    }


    // Save logged-in user
    setCurrentUser(data.user);


    return data.user;
}


// ==========================================
// FORGOT PASSWORD
// ==========================================

export async function requestPasswordReset(
    email
) {

    const response = await fetch(
        `${API_BASE_URL}/users/forgot-password/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email:
                    email
                        .trim()
                        .toLowerCase()
            })
        }
    );


    let data = {};

    try {

        data = await response.json();

    } catch (error) {

        console.error(
            "Forgot password response error:",
            error
        );

    }


    if (!response.ok) {

        throw new Error(
            data.error ||
            data.detail ||
            "Unable to send password reset instructions."
        );

    }


    return data;
}


// ==========================================
// RESET PASSWORD
// ==========================================

export async function resetPassword(
    email,
    resetCode,
    newPassword,
    confirmPassword
) {

    const response = await fetch(
        `${API_BASE_URL}/users/reset-password/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email:
                    email
                        .trim()
                        .toLowerCase(),

                reset_code:
                    resetCode.trim(),

                new_password:
                    newPassword,

                confirm_password:
                    confirmPassword
            })
        }
    );


    let data = {};

    try {

        data = await response.json();

    } catch (error) {

        console.error(
            "Reset password response error:",
            error
        );

    }


    if (!response.ok) {

        throw new Error(
            data.error ||
            data.detail ||
            "Unable to reset password."
        );

    }


    return data;
}


// ==========================================
// BOOKINGS
// ==========================================

export async function getBookings() {

    const response = await fetch(
        `${API_BASE_URL}/bookings/`
    );

    if (!response.ok) {

        throw new Error(
            "Failed to fetch bookings"
        );

    }

    return await response.json();
}


export async function createBooking(
    bookingData
) {

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


export async function getBookingById(
    bookingId
) {

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


export async function deleteBooking(
    bookingId
) {

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


// ==========================================
// REVIEWS
// ==========================================

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


export async function createReview(
    reviewData
) {

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


// ==========================================
// CURRENT USER
// ==========================================

export function getCurrentUser() {

    try {

        const user =
            localStorage.getItem(
                "currentUser"
            );

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


export function setCurrentUser(user) {

    try {

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

    } catch (error) {

        console.error(
            "Failed to save current user:",
            error
        );

    }

}


export function logout() {

    try {

        localStorage.removeItem(
            "currentUser"
        );

    } catch (error) {

        console.error(
            "Failed to remove current user:",
            error
        );

    }

}


// ==========================================
// API OBJECT
// ==========================================

export const api = {

    getServices,
    getServiceById,

    getUsers,
    getUserById,
    createUser,
    updateUser,

    login,

    requestPasswordReset,
    resetPassword,

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