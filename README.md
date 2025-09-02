# Finance Tracker

A comprehensive personal finance management application with a modern web frontend that helps users track their income, expenses, and account balances with secure authentication and real-time balance updates.

## Description

Finance Tracker is a full-stack Node.js application that provides users with a secure and intuitive way to manage their personal finances. The application includes:

- **Backend API**: RESTful API built with Express.js and MongoDB
- **Frontend Web App**: Modern, responsive web interface built with vanilla JavaScript
- **Real-time Features**: Live balance updates and transaction tracking
- **Secure Authentication**: JWT-based user authentication and authorization
- **Transaction Management**: Complete CRUD operations for financial transactions
- **Analytics**: Transaction statistics and financial insights

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

5. **Start the development server:**

   ```bash
   npm run dev
   ```

6. **Access the application:**
   - **Web Application**: Open your browser and navigate to `http://localhost:3000`
   - **API Documentation**: `http://localhost:3000/api-docs`
   - **Health Check**: `http://localhost:3000/health`

## Frontend Usage

Once the application is running, you can:

1. **Register a new account** or **login** with existing credentials
2. **View your dashboard** with current balance and account information
3. **Add transactions** (income or expenses) with categories and descriptions
4. **View transaction history** with filtering and pagination
5. **Check statistics** for financial insights
6. **Manage your profile** and account settings

### Keyboard Shortcuts

- `1` - Add new transaction
- `2` - View transactions
- `3` - View statistics
- `4` - Edit profile
- `Esc` - Return to dashboard
- `Ctrl/Cmd + H` - Go to dashboard overview

## Technologies Used

### Backend

- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **Environment Management**: dotenv
- **Development Tools**: nodemon, ESLint, Prettier
- **API Documentation**: Swagger UI
- **Testing**: Jest

### Frontend

- **Framework**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with responsive design
- **Architecture**: Modular JavaScript with separation of concerns
- **Features**: Single Page Application (SPA) with client-side routing
- **UI Components**: Custom form components, notifications, and data tables

## API Endpoints

### Authentication Endpoints

| Method | Endpoint            | Description                   | Authentication Required |
| ------ | ------------------- | ----------------------------- | ----------------------- |
| POST   | `/api/auth/signup`  | Register a new user account   | No                      |
| POST   | `/api/auth/login`   | Login with email and password | No                      |
| GET    | `/api/auth/profile` | Get current user profile      | Yes                     |

### User Management Endpoints

| Method | Endpoint             | Description                  | Authentication Required |
| ------ | -------------------- | ---------------------------- | ----------------------- |
| GET    | `/api/users/profile` | Get user profile and balance | Yes                     |
| PUT    | `/api/users/profile` | Update user profile          | Yes                     |

### Balance Management Endpoints

| Method | Endpoint             | Description         | Authentication Required |
| ------ | -------------------- | ------------------- | ----------------------- |
| GET    | `/api/users/balance` | Get current balance | Yes                     |
| PUT    | `/api/users/balance` | Update balance      | Yes                     |

### Transaction Management Endpoints

| Method | Endpoint                  | Description                                        | Authentication Required |
| ------ | ------------------------- | -------------------------------------------------- | ----------------------- |
| POST   | `/api/transactions`       | Create new transaction                             | Yes                     |
| GET    | `/api/transactions`       | Get all transactions (with pagination & filtering) | Yes                     |
| GET    | `/api/transactions/stats` | Get transaction statistics                         | Yes                     |
| GET    | `/api/transactions/:id`   | Get transaction by ID                              | Yes                     |
| PUT    | `/api/transactions/:id`   | Update transaction                                 | Yes                     |
| DELETE | `/api/transactions/:id`   | Delete transaction                                 | Yes                     |

_Note: Transaction endpoints support pagination, filtering by type/category/date range, and sorting options._

## Project Structure

```
finance-tracker/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Database models
├── public/          # Frontend static files
│   ├── js/         # JavaScript modules
│   │   ├── api.js      # API service
│   │   ├── auth.js     # Authentication module
│   │   ├── transactions.js # Transaction management
│   │   ├── dashboard.js # Dashboard functionality
│   │   └── app.js      # Main application
│   ├── styles.css   # Application styles
│   └── index.html   # Main HTML file
├── routes/          # API routes
├── tests/           # Test files
├── .env             # Environment variables
├── .gitignore       # Git ignore file
├── app.js           # Express app setup
├── package.json     # Project dependencies
├── README.md        # Project documentation
├── server.js        # Server entry point
├── Dockerfile       # Docker configuration
├── docker-compose.yml # Docker Compose setup
└── DEPLOYMENT_GUIDE.md # Deployment instructions
```

## Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run build` - Build frontend (ready for deployment)
- `npm run deploy:check` - Verify frontend files are ready
- `npm run serve:frontend` - Serve frontend only on port 8080

### API Documentation

The API documentation is available at `http://localhost:3000/api-docs` when the server is running. This interactive Swagger UI allows you to:

- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Authenticate with JWT tokens
- View example requests and responses

## Features

### Backend Features

- **Authentication**: User registration, login, and profile management
- **Transaction Management**: Create, read, update, and delete financial transactions
- **Balance Tracking**: Real-time balance updates with transaction history
- **Data Analytics**: Transaction statistics and financial insights
- **API Documentation**: Interactive Swagger UI for all endpoints

### Frontend Features

- **User Interface**: Clean, responsive web interface
- **Authentication Forms**: Login and signup with validation
- **Dashboard**: Overview of user profile, balance, and quick actions
- **Transaction Management**: Add, edit, delete, and filter transactions
- **Statistics View**: Visual representation of financial data
- **Profile Management**: Edit user profile and account settings
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- Environment variable management
- Input validation and sanitization
- HTTP security headers with Helmet
- Rate limiting to prevent abuse
- Input sanitization to prevent injection attacks
- CORS protection
- XSS protection
- CSRF protection

## Deployment

The application is ready for production deployment with several options:

### Quick Deployment

```bash
# Check if frontend is ready
npm run deploy:check

# Start production server
npm start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t finance-tracker .
docker run -p 3000:3000 --env-file .env finance-tracker
```

### Cloud Platforms

- **Heroku**: Connect GitHub repo and deploy automatically
- **Railway**: Simple deployment with automatic builds
- **Render**: Free hosting with automatic deployments
- **DigitalOcean App Platform**: Scalable cloud hosting

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

**Azeez Damilare Gbenga**

## License

ISC
