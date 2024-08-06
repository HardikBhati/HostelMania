# YelpCamp

YelpCamp is a full-stack web application built with Next.js where users can post information about hostels and view information posted by others. The application features user authentication, CRUD operations for hostel listings, and more.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- User authentication (login, logout, register)
- CRUD operations for hostel listings
- View details of each hostel
- Comment on hostels
- Edit and delete own hostels and comments
- Responsive design

## Technologies Used

- Frontend: Next.js, React, SCSS, MUI (Material-UI)
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT, bcrypt
- Deployment: Vercel

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB database

### Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/yelpcamp.git
    cd yelpcamp
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env.local` file in the root directory and add the following environment variables:

    ```env
    NEXT_PUBLIC_API=http://localhost:3000
    MONGODB_URI=mongodb://localhost:27017/yelpcamp
    JWT_SECRET=your_jwt_secret
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

- `NEXT_PUBLIC_API`: The base URL for the API.
- `MONGODB_URI`: The URI for connecting to the MongoDB database.
- `JWT_SECRET`: The secret key for signing JWT tokens.

## Usage

### Running Locally

1. **Start the development server:**

    ```bash
    npm run dev
    ```

2. **Open your browser:**

    Navigate to [http://localhost:3000](http://localhost:3000).

### Building for Production

1. **Build the project:**

    ```bash
    npm run build
    ```

2. **Start the production server:**

    ```bash
    npm start
    ```

### Running Tests

(Currently no tests implemented)

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user

### Hostels

- `GET /api/hostels`: Get all hostels
- `POST /api/hostels`: Create a new hostel (authenticated)
- `GET /api/hostels/:id`: Get a single hostel by ID
- `PUT /api/hostels/:id`: Update a hostel by ID (authenticated)
- `DELETE /api/hostels/:id`: Delete a hostel by ID (authenticated)

### Comments

- `POST /api/hostels/:id/comments`: Add a comment to a hostel (authenticated)
- `PUT /api/hostels/:id/comments/:commentId`: Update a comment (authenticated)
- `DELETE /api/hostels/:id/comments/:commentId`: Delete a comment (authenticated)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
