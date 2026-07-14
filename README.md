# 💰 Budgety - Full-Stack Budget Calculator

Budgety is a production-ready personal finance application built with the MERN stack (MongoDB, Express, React, Node.js). It features a sleek, modern UI for tracking income and expenses, visualizing financial health through charts, and managing monthly budgets.

## ✨ Features

-   **📊 Dynamic Dashboard**: Real-time overview of available budget, total income, total expenses, and spending percentage.
-   **📝 Transaction Management**: Add, update, and delete income/expense entries with categorized tracking.
-   **📅 Monthly Filtering**: Easily switch between months and years to review historical data.
-   **📈 Visual Reports**: 6-month comparative bar charts for income vs. expenses using Recharts.
-   **⚙️ Custom Settings**: Localized currency selection and customizable category lists.
-   **🚀 Production-Ready**: Mongoose integration, robust error handling, and optimized build pipeline.

## 🛠️ Tech Stack

-   **Frontend**: React 19, Vite, Recharts, React Router 7.
-   **Backend**: Node.js, Express 5, Mongoose.
-   **Database**: MongoDB Community Server.
-   **Styling**: Vanilla CSS with modern Flexbox/Grid and CSS Variables.

---

## 🚀 Getting Started

### Prerequisites

-   **Node.js**: [Download & Install Node.js](https://nodejs.org/)
-   **MongoDB**: An active MongoDB Atlas cluster or a local instance of [MongoDB Community Server](https://www.mongodb.com/try/download/community).

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/jijomathew05/Updated-budget-calculator.git
    cd Updated-budget-calculator
    ```

2.  **Install all dependencies**:
    We provide a root-level script to install dependencies for the root, backend, and frontend simultaneously.
    ```bash
    npm run install-all
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in `Backend/server/` and provide your MongoDB connection string and a secure JWT Secret:
    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
    PORT=5000
    JWT_SECRET=your_super_secret_key_here
    ```

---

## 💻 Usage

### Development Mode
Runs the backend and the Vite dev server concurrently using a single command.
```bash
npm run dev
```
-   **Frontend**: `http://localhost:5173`
-   **Backend**: `http://localhost:5000`

### 🔑 Demo Authentication
A demo admin user is automatically created in the database when the backend server starts. You can use these credentials to quickly access the dashboard without registering:
- **Email:** `admin@demo.com`
- **Password:** `admin123`

*Tip: For maximum convenience, you can click the **"Login as Demo Admin"** button on the Login page to securely log in with these credentials in a single click.*

### Production Mode
Builds the frontend and serves it through the Express backend.
```bash
# 1. Build the frontend assets
npm run build

# 2. Start the production server
npm run start
```
-   **Live App**: `http://localhost:5000`

---

## 📁 Project Structure

```text
Updated-budget-calculator/
├── Backend/
│   └── server/             # Express server & Mongoose models
├── Frontend/
│   └── client/             # Vite + React application
├── package.json            # Root orchestration scripts
└── implementation_plan.md  # Architectural roadmap
```

## 📝 License

This project is licensed under the ISC License.
