# Finance Tracker

A comprehensive income, expenses, and balance tracking application with powerful analytics and reporting capabilities.

## Description

The Finance Tracker helps users manage their personal finances by tracking income, expenses, and account balances. It provides visual spending insights, budgeting tools, and financial reporting to help users achieve their financial goals.

## Features

### Core Functionality

- Record income and expense transactions
- Categorize transactions with custom categories
- Multiple account management
- Balance tracking across accounts
- Transaction history with search/filter

### Financial Insights

- Interactive spending charts and graphs
- Monthly/Yearly financial summaries
- Budget tracking with alerts
- Spending trends analysis
- Net worth calculation

### Technical Features

- Secure user authentication
- Data export (CSV/PDF)
- Receipt image upload
- Recurring transactions
- Multi-currency support

## Installation & Usage

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher) or MongoDB (v6 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:

````bash
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm (v8 or higher)


2. Install dependencies:

   ```bash
   npm install
````

3. Create a `.env` file in the root directory:

   ```env
   PORT=5000
   DB_URL=postgres://user:password@localhost:5432/finance_tracker
   OR for MongoDB:
   DB_URL=mongodb://localhost:27017/financetracker
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=30d
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name  # For receipt uploads

   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5000`

## Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Receipt storage**: Cloudinary
- **Testing**: Jest, Socket.IO Client for testing

## Author

**Name**

- Name: Azeez Damilare Gbenga
