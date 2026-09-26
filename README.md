# Smart Local Services Platform

> A comprehensive, modern on-demand local services platform designed for seamless booking of verified home repair, maintenance, and technical professionals.

---

## 📁 Project Directory Structure

```text
Smart Local Services Platform/
│
├── frontend/
│   │
│   ├── html/                           # Static HTML Pages
│   │   ├── index.html                  # Landing page with hero, search, & testimonials
│   │   ├── login.html                  # Customer & provider login with demo auto-fill
│   │   ├── register.html               # Registration with role toggle & validation
│   │   ├── services.html               # Searchable & filterable services catalog
│   │   ├── booking.html                # Multi-step booking form & price calculator
│   │   └── profile.html                # User dashboard, appointment history, & settings
│   │
│   ├── css/                            # Modular Stylesheets
│   │   ├── style.css                   # Core CSS variables, typography, reset, buttons
│   │   ├── navbar.css                  # Sticky responsive header & mobile drawer
│   │   ├── home.css                    # Hero section, feature grids, & testimonials
│   │   ├── login.css                   # Authentication card layouts & form styling
│   │   ├── services.css                # Catalog toolbar, category pills, & cards
│   │   ├── booking.css                 # 2-column booking layout & summary card
│   │   └── responsive.css              # Breakpoints for tablet & mobile devices
│   │
│   ├── javascript/                     # Vanilla JS Frontend Logic
│   │   ├── main.js                     # Navigation, drawer toggle, user session, toasts
│   │   ├── login.js                    # Auth handling, demo credentials, & redirects
│   │   ├── register.js                 # Validation & user account creation
│   │   ├── services.js                 # Catalog dataset, live search, & category filters
│   │   ├── booking.js                  # Query parsing, slot selection, & order save
│   │   └── validation.js               # Reusable input validator utilities
│   │
│   ├── react-app/                      # Single Page React Application (Vite + React 19)
│   │   ├── public/                     # Static public assets
│   │   ├── src/
│   │   │   ├── components/             # Reusable UI Components
│   │   │   │   ├── Navbar.jsx          # Header with auth state & mobile drawer
│   │   │   │   ├── Footer.jsx          # Brand links, catalog categories, & legal
│   │   │   │   ├── ServiceCard.jsx     # Reusable service card with price & rating
│   │   │   │   └── BookingCard.jsx     # Appointment card with status badge & cancel
│   │   │   │
│   │   │   ├── pages/                  # Page Views
│   │   │   │   ├── Home.jsx            # Hero, quick search, featured cards, stats
│   │   │   │   ├── Login.jsx           # Sign-in with role switcher & demo helper
│   │   │   │   ├── Register.jsx        # Account creation with role selection
│   │   │   │   ├── Services.jsx        # Catalog with search & filter pills
│   │   │   │   ├── ServiceDetails.jsx  # In-depth service breakdown & inclusions
│   │   │   │   ├── Booking.jsx         # Booking flow with slots & dynamic total
│   │   │   │   ├── MyBookings.jsx      # Customer bookings dashboard & cancellation
│   │   │   │   └── Profile.jsx         # User profile manager & tier stats
│   │   │   │
│   │   │   ├── assets/                 # SVGs and Media
│   │   │   │   ├── images/             # Vector banners
│   │   │   │   └── icons/              # Category and UI icons
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── api.js              # Dual-mode API (Django REST + Offline Storage)
│   │   │   │
│   │   │   ├── App.jsx                 # SPA hash router & session coordinator
│   │   │   ├── main.jsx                # React DOM root mounting
│   │   │   └── index.css               # Unified theme & responsive design system
│   │   │
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── assets/                         # Static Frontend Assets
│       ├── images/                     # Hero banners & illustrations
│       └── icons/                      # SVG icons for categories & features
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Static HTML/CSS/JS Frontend
The static frontend works out of the box without requiring any build step or node package installations:

1. Navigate to `frontend/html/`:
   ```bash
   cd "d:/Smart Local Services Platform/frontend/html"
   ```
2. Open `index.html` in any browser (e.g. Double-click `index.html` or use VS Code Live Server / Python HTTP server):
   ```bash
   # Or using Python's built-in web server:
   python -m http.server 5500
   ```
3. Visit `http://localhost:5500/frontend/html/index.html`.

---

### 2. React Application (`react-app/`)
The React application is built on Vite and React 19:

1. Navigate into `frontend/react-app`:
   ```bash
   cd "d:/Smart Local Services Platform/frontend/react-app"
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

4. To build for production:
   ```bash
   npm run build
   ```

---

## 🔑 Demo Accounts & Instant Testing

Both the Static and React frontends include built-in demo credentials for immediate testing:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `alex@smartservices.com` | `password123` |
| **Service Provider** | `pro@smartservices.com` | `password123` |

> 💡 On both login screens, you can simply click the **Auto-fill** button to automatically load these test credentials.

---

## 🛠️ Key Platform Features

1. **Comprehensive Service Catalog**:
   - Plumbing, Electrical, Deep Cleaning, AC Repair, Carpentry, Painting, Computer Repair, Vehicle Care, Pest Control.
   - Real-time search filter and category chip selection.
   - Sorting by Price (Low to High, High to Low) and Rating.

2. **Interactive Booking Engine**:
   - Pre-populates selected service from catalog URL parameters (`?service=...`).
   - Slot picker (`08:30 AM`, `10:00 AM`, `11:30 AM`, `02:00 PM`, `04:00 PM`, `06:00 PM`).
   - Dynamic price calculation: Base Price + ₹49 Platform Fee + 5% GST.
   - Order confirmation modal with generated Reference ID (`SLS-XXXXXX`).

3. **Booking History & Management**:
   - `My Bookings` tab tracks confirmed, completed, and cancelled appointments.
   - One-click booking cancellation with real-time UI refresh.

4. **Dual-Mode API Layer (`react-app/src/services/api.js`)**:
   - Seamlessly connects to Django REST API endpoints (`/api/services/`, `/api/bookings/`) when the backend is active.
   - Automatically falls back to interactive `localStorage` persistence when running offline.

5. **Fully Responsive Design**:
   - Optimized for Desktops, Tablets, and Mobile phones with collapsible navigation drawer.
