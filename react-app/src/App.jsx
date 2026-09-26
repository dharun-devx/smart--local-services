import React, { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

import {
    getServices,
    getCurrentUser,
    logout
} from "./services/api";

import "./index.css";


export default function App() {

    const [activePage, setActivePage] = useState("home");

    const [pageParams, setPageParams] = useState({});

    const [user, setUser] = useState(null);

    const [services, setServices] = useState([]);

    const [servicesLoading, setServicesLoading] = useState(true);

    const [servicesError, setServicesError] = useState("");


    // =====================================
    // LOAD USER + SERVICES
    // =====================================

    useEffect(() => {

        // Get logged-in user
        const savedUser = getCurrentUser();

        if (savedUser) {
            setUser(savedUser);
        }


        // Get services from Django API
        const loadServices = async () => {

            try {

                setServicesLoading(true);

                setServicesError("");

                const data = await getServices();

                setServices(data);

                console.log(
                    "Services loaded from Django:",
                    data
                );

            } catch (error) {

                console.error(
                    "Service API Error:",
                    error
                );

                setServicesError(
                    "Unable to load services from server."
                );

            } finally {

                setServicesLoading(false);

            }
        };


        loadServices();


        // =====================================
        // HASH ROUTING
        // =====================================

        const handleHashChange = () => {

            const hash =
                window.location.hash.replace("#", "")
                || "home";


            const [page, queryString] =
                hash.split("?");


            const params = {};


            if (queryString) {

                new URLSearchParams(
                    queryString
                ).forEach((value, key) => {

                    params[key] = value;

                });

            }


            setActivePage(page);

            setPageParams(params);

            window.scrollTo(0, 0);

        };


        if (window.location.hash) {
            handleHashChange();
        }


        window.addEventListener(
            "hashchange",
            handleHashChange
        );


        return () => {

            window.removeEventListener(
                "hashchange",
                handleHashChange
            );

        };

    }, []);


    // =====================================
    // NAVIGATION
    // =====================================

    const navigate = (
        page,
        params = {}
    ) => {

        setActivePage(page);

        setPageParams(params);


        const query =
            new URLSearchParams(
                params
            ).toString();


        window.location.hash =
            query
                ? `${page}?${query}`
                : page;


        window.scrollTo(0, 0);

    };


    // =====================================
    // LOGIN SUCCESS
    // =====================================

    const handleLoginSuccess = (
        userData
    ) => {

        setUser(userData);

    };


    // =====================================
    // LOGOUT
    // =====================================

    const handleLogout = () => {

        logout();

        setUser(null);

        navigate("home");

    };


    // =====================================
    // UPDATE USER
    // =====================================

    const handleUpdateUser = (
        updatedUser
    ) => {

        setUser(updatedUser);

    };


    // =====================================
    // RENDER CURRENT PAGE
    // =====================================

    const renderCurrentPage = () => {

        switch (activePage) {

            case "home":

                return (
                    <Home
                        navigate={navigate}
                        services={services}
                        servicesLoading={servicesLoading}
                        servicesError={servicesError}
                    />
                );


            case "services":

                return (
                    <Services
                        navigate={navigate}
                        initialParams={pageParams}
                        services={services}
                        servicesLoading={servicesLoading}
                        servicesError={servicesError}
                    />
                );


            case "service-details":

                return (
                    <ServiceDetails
                        navigate={navigate}
                        params={pageParams}
                        services={services}
                    />
                );


            case "booking":

                return (
                    <Booking
                        navigate={navigate}
                        user={user}
                        params={pageParams}
                    />
                );


            case "my-bookings":

                return (
                    <MyBookings
                        navigate={navigate}
                        user={user}
                    />
                );


            case "profile":

                return (
                    <Profile
                        navigate={navigate}
                        user={user}
                        onUpdateUser={handleUpdateUser}
                        onLogout={handleLogout}
                    />
                );


            case "login":

                return (
                    <Login
                        navigate={navigate}
                        onLoginSuccess={handleLoginSuccess}
                    />
                );


            case "register":

                return (
                    <Register
                        navigate={navigate}
                        onRegisterSuccess={handleLoginSuccess}
                    />
                );


            default:

                return (
                    <Home
                        navigate={navigate}
                        services={services}
                        servicesLoading={servicesLoading}
                        servicesError={servicesError}
                    />
                );

        }

    };


    // =====================================
    // MAIN UI
    // =====================================

    return (

        <div className="app">

            <Navbar
                activePage={activePage}
                navigate={navigate}
                user={user}
                onLogout={handleLogout}
            />


            <div className="main-content">

                {renderCurrentPage()}

            </div>


            <Footer
                navigate={navigate}
            />

        </div>

    );

}