# Finance Tracker

A comprehensive personal finance management application that helps users track their income, expenses, and account balances with secure authentication and real-time balance updates.

## Description

Finance Tracker is a Node.js-based application that provides users with a secure and intuitive way to manage their personal finances. Users can register accounts, track their balance, and will soon be able to record income and expense transactions with detailed categorization and analytics.

## Purpose

The primary goal of this application is to help users:
- Maintain accurate financial records
- Track spending patterns and habits
- Achieve financial goals through better money management
- Have a secure, personal finance tracking system

## Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm (v9 or higher)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dazeez1/finance-tracker.git
   cd finance-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/finance_tracker
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=30d
   NODE_ENV=development
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

## Technologies Used

- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **Environment Management**: dotenv
- **Development Tools**: nodemon, ESLint, Prettier
- **Testing**: Jest (planned)

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|------------------------|
| POST | `/api/auth/signup` | Register a new user account | No |
| POST | `/api/auth/login` | Login with email and password | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |

### User Management Endpoints

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|------------------------|
| GET | `/api/users/profile` | Get user profile and balance | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |

### Balance Management Endpoints

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|------------------------|
| GET | `/api/balance` | Get current balance | Yes |
| PUT | `/api/balance` | Update balance | Yes |

*Note: More endpoints will be added as the project progresses for transaction management, categories, and reporting.*

## Project Structure

```
finance-tracker/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── tests/           # Test files
├── .env             # Environment variables
├── .gitignore       # Git ignore file
├── app.js           # Express app setup
├── package.json     # Project dependencies
├── README.md        # Project documentation
└── server.js        # Server entry point
```

## Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- Environment variable management
- Input validation and sanitization

## Author

**Azeez Damilare Gbenga**

## License

ISC
