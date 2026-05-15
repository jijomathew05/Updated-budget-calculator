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
-   **MongoDB**: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community) (Make sure it's running locally on port 27017).

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
    Create a `.env` file in `Backend/server/`:
    ```env
    MONGODB_URI=mongodb://127.0.0.1:27017/budget-calculator
    PORT=5000
    ```

---

## 💻 Usage

### Development Mode
Runs the backend and the Vite dev server concurrently.
```bash
npm run dev
```
-   **Frontend**: `http://localhost:5173`
-   **Backend**: `http://localhost:5000`

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
