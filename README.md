# VaultX - Full-Stack Secrets Manager

VaultX is a secure, full-stack secrets manager application built with the MERN stack. It allows users to securely store, manage, and retrieve sensitive data like passwords, API keys, and private notes, with an emphasis on enterprise-grade security and a modern, developer-focused UI.

This repository contains the complete source code for both the frontend client and the backend server.

## ✨ Core Features

- **Secure Authentication**: JWT-based authentication and a full 2FA (Two-Factor Authentication) implementation.
- **Data Encryption**: All secrets are encrypted at rest using AES-256-CBC.
- **Complete CRUD Functionality**: Full create, read, update, and delete capabilities for all your secrets.
- **Activity Logging**: A detailed audit trail that logs all significant user actions.
- **Modern Frontend**: A responsive and attractive UI built with React, Vite, and Tailwind CSS.

## 🛠️ Tech Stack

| Area      | Technology              |
| :-------- | :---------------------- |
| **Frontend** | React, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js     |
| **Database** | MongoDB (with Mongoose) |
| **Security** | JWT, bcryptjs, speakeasy  |

---

## 🚀 Getting Started

This project is structured as a monorepo with two main folders: `client` and `server`. You will need to run them in two separate terminals.

### 1. Backend Setup

First, set up and run the server.

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `/server` directory and add the necessary environment variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=a_long_random_secure_string
    MASTER_KEY=a_64_character_hex_string_for_encryption
    ```
4.  **Run the server:**
    ```bash
    npm start
    ```
    The backend API will be running at `http://localhost:5000`.

### 2. Frontend Setup

Next, set up and run the client in a **new terminal window**.

1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.
