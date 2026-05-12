# Punjab Bus Tracking System

A full-stack, real-time smart transportation monitoring and analytics platform built with the MERN stack (MongoDB, Express, React, Node.js). Features an advanced Glassmorphism UI, real-time live map tracking, intelligent ETA predictions, and comprehensive role-based analytics dashboards.

## 🚀 Key Features

*   **Real-time Live Map**: Interactive Google Maps integration with custom animated bus routes and live tracking markers.
*   **Smart Dashboard**: Complex data visualizations using Recharts, including KPI metrics, line charts for 24-hour trips, and dynamic status tables.
*   **Authentication & Security**: Fully implemented JWT-based local authentication and robust social OAuth integration (Google & GitHub) with role-based protected routes.
*   **Responsive Glassmorphism UI**: High-end futuristic aesthetic built strictly with CSS variables, backdrop-filters, and media queries for complete mobile responsiveness.
*   **Alert & Reminder System**: Real-time mock alerts for delays and emergencies with custom toggle preferences.

## 🛠 Technology Stack

### Frontend (Client)
*   **React.js (Vite)**
*   **Framer Motion** (Complex animations & transitions)
*   **Recharts** (Data visualization)
*   **React Router v6** (Client-side routing)
*   **React Icons** & **Pure CSS** (No external CSS frameworks)

### Backend (Server)
*   **Node.js & Express.js**
*   **MongoDB Atlas & Mongoose** (Database & schema validation)
*   **JSON Web Tokens (JWT)** (Authentication)
*   **Bcrypt.js** (Password hashing)

## 📱 Mobile Responsiveness

The application is completely responsive across all devices:
*   Fluid grid layouts for Analytics and Reminders.
*   Mobile-friendly sidebar navigation and bottom-sheet Chatbot.
*   Stacked data inputs and vertical scaling for charts.

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Frontend (`/frontend/.env`)
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 📦 Local Development

1.  **Clone the repository**
2.  **Install dependencies**
    ```bash
    # Install backend dependencies
    cd backend
    npm install
    
    # Install frontend dependencies
    cd ../frontend
    npm install
    ```
3.  **Run the application**
    ```bash
    # Run backend (from /backend)
    npm run dev
    
    # Run frontend (from /frontend)
    npm run dev
    ```

## ☁️ Deployment Instructions (Render)

This project is configured for seamless deployment on Render using the provided `render.yaml` configuration.

1. Push your code to a GitHub repository.
2. Connect your repository to Render via the Render Dashboard.
3. Render will automatically detect the `render.yaml` Blueprint and spin up both the **Node Web Service** and the **Vite Static Site**.
4. Make sure to configure your Environment Variables (`MONGO_URI`, `JWT_SECRET`) in the Render Dashboard for the backend service.

## 📄 License
Final Year Engineering Project. All Rights Reserved.
