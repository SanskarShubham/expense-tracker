# ExpenseTracker  Documentation

## Overview
MyWebApp is a web application built with Express.js, MongoDB, Bootstrap, and Vanilla JavaScript. It provides functionalities such as user authentication, CRUD operations, integration with the Razorpay payment gateway, and a leaderboard feature for premium users.

## Table of Contents
1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [File Structure](#file-structure)
5. [Dependencies](#dependencies)
6. [Contributing](#contributing)
7. [License](#license)

## Features <a name="features"></a>
- **User Authentication:** Implements user authentication using bcrypt for password hashing and JWT tokens for session management.
- **CRUD Operations:** Users can perform CRUD (Create, Read, Update, Delete) operations on various entities within the application.
- **Razorpay Integration:** Allows users to purchase membership using the Razorpay payment gateway.
- **Leaderboard Feature:** Premium users have access to a leaderboard feature.

## Installation <a name="installation"></a>
1. Clone the repository: `git clone <repository_url>`
2. Install dependencies: `npm install`
3. Configure environment variables (if any).
4. Start the server: `npm start`

## Usage <a name="usage"></a>
1. Register/Login: Users can register or login to the application.
2. Perform CRUD Operations: Authenticated users can perform CRUD operations on different entities.
3. Purchase Membership: Users can purchase membership using the Razorpay payment gateway.
4. Access Leaderboard: Premium users can access the leaderboard feature.

## File Structure <a name="file-structure"></a>
MyWebApp/
│
├── config/
│   ├── database.js
│   ├── middleware.js
│   └── ...
│
├── controllers/
│   ├── authController.js
│   ├── expenseController.js
│   └── ...
│
├── models/
│   ├── User.js
│   ├── Expense.js
│   └── ...
│
├── public/
│   ├── css/
│   ├── js/
│   └── ...
│
├── routes/
│   ├── authRoutes.js
│   ├── expenseRoutes.js
│   └── ...
│
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   └── ...
│
├── app.js
└── ...


## Dependencies 
- express
- mongoose
- bcrypt
- jsonwebtoken
- razorpay
- bootstrap

## Contributing <a name="contributing"></a>
Contributions are welcome! 



