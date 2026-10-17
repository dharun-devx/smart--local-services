import React, { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Profile({
  navigate,
  user,
  onUpdateUser,
  onLogout
}) {
  const currentUser = user || {
    name: "",
    email: "",
    phone: "",
    role: "customer",
    address: ""
  };

  const [name, setName] = useState(currentUser.name || "");
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [address, setAddress] = useState(
    currentUser.address || ""
  );

  const [savedMsg, setSavedMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [bookingsCount, setBookingsCount] = useState(0);

  // ==========================================
  // SYNC USER DATA
  // ==========================================

  useEffect(() => {
    setName(currentUser.name || "");
    setPhone(currentUser.phone || "");
    setAddress(currentUser.address || "");
  }, [
    currentUser.name,
    currentUser.phone,
    currentUser.address
  ]);


  // ==========================================
  // BOOKINGS COUNT
  // ==========================================

  useEffect(() => {
    const loadBookingsCount = async () => {
      try {
        const data = await api.getBookings();

        if (Array.isArray(data)) {
          setBookingsCount(data.length);
        } else {
          setBookingsCount(0);
        }

      } catch (error) {
        console.error(
          "Failed to load bookings count:",
          error
        );

        setBookingsCount(0);
      }
    };

    loadBookingsCount();
  }, []);


  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async (e) => {
    e.preventDefault();

    setSavedMsg(false);
    setErrorMsg("");

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();

    // -------------------------------
    // Validate Name
    // -------------------------------

    if (!cleanName) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    // -------------------------------
    // Validate Phone
    // -------------------------------

    if (!cleanPhone) {
      setErrorMsg("Please enter your contact phone.");
      return;
    }

    // -------------------------------
    // Validate Address
    // -------------------------------

    if (!cleanAddress) {
      setErrorMsg(
        "Please enter your service address before saving."
      );
      return;
    }

    // -------------------------------
    // Check Login User
    // -------------------------------

    if (!currentUser.id) {
      setErrorMsg(
        "User information not found. Please login again."
      );
      return;
    }

    try {
      setSaving(true);

      // ======================================
      // UPDATE DATABASE
      // ======================================

      const updatedUser = await api.updateUser(
        currentUser.id,
        {
          name: cleanName,
          phone: cleanPhone,
          address: cleanAddress
        }
      );

      // ======================================
      // SAVE UPDATED USER LOCALLY
      // ======================================

      const finalUser = {
        ...currentUser,
        ...updatedUser,
        name: cleanName,
        phone: cleanPhone,
        address: cleanAddress
      };

      api.setCurrentUser(finalUser);

      // Update App state
      if (onUpdateUser) {
        onUpdateUser(finalUser);
      }

      // Success message
      setSavedMsg(true);

      setTimeout(() => {
        setSavedMsg(false);
      }, 3000);

    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      setErrorMsg(
        error.message ||
        "Failed to save profile. Please try again."
      );

    } finally {
      setSaving(false);
    }
  };


  return (
    <div>

      {/* ==========================================
          HERO BANNER
      ========================================== */}

      <section
        className="profile-banner"
        style={{
          background:
            "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          color: "#fff",
          padding: "3.5rem 0 3rem"
        }}
      >
        <div className="container">

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.75rem",
              flexWrap: "wrap"
            }}
          >

            {/* PROFILE INITIAL */}

            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--primary)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.25rem",
                fontWeight: 700,
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.25)"
              }}
            >
              {name
                ? name.charAt(0).toUpperCase()
                : "U"}
            </div>


            <div>

              <h1
                style={{
                  fontSize: "1.85rem",
                  marginBottom: "0.25rem"
                }}
              >
                {name || "User"}
              </h1>


              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  color: "#94a3b8",
                  fontSize: "0.95rem",
                  flexWrap: "wrap"
                }}
              >

                <span>
                  ✉️ {currentUser.email}
                </span>

                <span>
                  📞 {phone || "Phone not added"}
                </span>

                <span className="badge badge-success">
                  {(
                    currentUser.role || "customer"
                  ).toUpperCase()}{" "}
                  ACCOUNT
                </span>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ==========================================
          PROFILE DETAILS
      ========================================== */}

      <main className="section-padding">

        <div
          className="container"
          style={{
            maxWidth: "800px"
          }}
        >

          {/* ======================================
              QUICK METRICS
          ====================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: "1.5rem",
              marginBottom: "2.5rem"
            }}
          >

            <div
              className="card"
              style={{
                padding: "1.5rem",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--primary)"
                }}
              >
                {bookingsCount}
              </div>

              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem"
                }}
              >
                Total Bookings
              </span>
            </div>


            <div
              className="card"
              style={{
                padding: "1.5rem",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--success)"
                }}
              >
                100%
              </div>

              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem"
                }}
              >
                Reliability Score
              </span>
            </div>


            <div
              className="card"
              style={{
                padding: "1.5rem",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--accent)"
                }}
              >
                Gold
              </div>

              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem"
                }}
              >
                Member Tier
              </span>
            </div>

          </div>


          {/* ======================================
              PROFILE CARD
          ====================================== */}

          <div
            className="card"
            style={{
              padding: "2.5rem"
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                gap: "1rem",
                flexWrap: "wrap"
              }}
            >

              <h2
                style={{
                  fontSize: "1.4rem"
                }}
              >
                Personal & Delivery Information
              </h2>


              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() =>
                  navigate("my-bookings")
                }
              >
                View Booking History →
              </button>

            </div>


            {/* ======================================
                SUCCESS MESSAGE
            ====================================== */}

            {savedMsg && (
              <div
                style={{
                  padding: "0.75rem",
                  background:
                    "var(--success-light)",
                  color: "var(--success)",
                  borderRadius:
                    "var(--radius-md)",
                  marginBottom: "1.5rem",
                  fontWeight: 600
                }}
              >
                ✓ Profile changes saved successfully!
              </div>
            )}


            {/* ======================================
                ERROR MESSAGE
            ====================================== */}

            {errorMsg && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "#fee2e2",
                  color: "#dc2626",
                  borderRadius:
                    "var(--radius-md)",
                  marginBottom: "1.5rem",
                  fontWeight: 600
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}


            <form onSubmit={handleSave}>

              {/* ==================================
                  FULL NAME
              ================================== */}

              <div
                className="form-group"
                style={{
                  marginBottom: "1.25rem"
                }}
              >

                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  className="form-input"
                  style={{
                    paddingLeft: "1rem"
                  }}
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                />

              </div>


              {/* ==================================
                  EMAIL
              ================================== */}

              <div
                className="form-group"
                style={{
                  marginBottom: "1.25rem"
                }}
              >

                <label className="form-label">
                  Email Address (Read-only)
                </label>

                <input
                  type="email"
                  className="form-input"
                  style={{
                    paddingLeft: "1rem",
                    background:
                      "var(--bg-subtle)"
                  }}
                  value={currentUser.email || ""}
                  disabled
                />

              </div>


              {/* ==================================
                  PHONE
              ================================== */}

              <div
                className="form-group"
                style={{
                  marginBottom: "1.25rem"
                }}
              >

                <label className="form-label">
                  Contact Phone
                </label>

                <input
                  type="tel"
                  className="form-input"
                  style={{
                    paddingLeft: "1rem"
                  }}
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter your phone number"
                  required
                />

              </div>


              {/* ==================================
                  SERVICE ADDRESS
              ================================== */}

              <div
                className="form-group"
                style={{
                  marginBottom: "2rem"
                }}
              >

                <label className="form-label">
                  Service Address
                </label>

                <textarea
                  className="form-input"
                  style={{
                    padding: "0.75rem 1rem",
                    minHeight: "80px",
                    resize: "vertical"
                  }}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="Enter your service address"
                  required
                />

              </div>


              {/* ==================================
                  BUTTONS
              ================================== */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>


                <button
                  type="button"
                  className="btn btn-outline"
                  style={{
                    color: "var(--danger)",
                    borderColor:
                      "var(--danger)"
                  }}
                  onClick={onLogout}
                  disabled={saving}
                >
                  Sign Out
                </button>

              </div>

            </form>

          </div>

        </div>

      </main>

    </div>
  );
}