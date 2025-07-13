# GeeksArena

A full-stack coding platform built for competitive programming enthusiasts and developers to practice, learn, and grow through challenging problems, community blogs, AI assistance, and rich editor tools.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

GeeksArena is a modern web platform designed to offer a comprehensive coding practice environment. It provides a growing library of coding problems, video explanations, blog-style posts, and AI-powered support to help users learn and excel in problem-solving.

### Key Objectives

- Offer a smooth and fast UI for solving problems
- Support real-time code execution for multiple languages
- Integrate AI tools to assist with doubts and hints
- Encourage content creation via blogs and comments
- Enable administrators to manage problems, videos, and users
- Track user progress and solution history

## Features

### Core Features

- **Problem Solving:** Practice from a wide range of problems
- **Multi-language Editor:** Write code in Python, C++, Java, JavaScript, etc.
- **Code Execution:** Real-time code testing with expected output
- **JWT Authentication:** Login & register securely
- **Rate Limiting:** Redis-based sliding window algorithm for abuse prevention
- **Monaco Code Editor:** Rich IDE-like coding interface
- **Pagination:** Smooth problem browsing with page controls
- **Video Editorials:** Admin-uploaded solutions visible in problem pages
- **Blog Posts:** Users can write and publish posts
- **Comments:** Logged-in users can comment on posts

### AI Assistance

- Available as a **dedicated tab** on each problem page alongside **Description**, **Editorial**, and **Submissions**
- Based on **Gemini API**
- Offers **hints**, **explanations**, and **doubt-solving support**

### Admin Features

- Add / Update / Delete coding problems
- Upload / Delete Cloudinary video solutions
- Moderate users and manage blogs if needed

### User Roles

- **User**: Can solve problems, submit code, comment, and write blog posts
- **Admin**: Can manage problems, users, videos, and more

### Planned Features

- **Problem Sheets Section:** Topic-based curated problem lists
- **Resource Hub:** External materials and reference sheets

## Technology Stack

### Frontend

- **Framework**: React.js
- **Styling**: Tailwind CSS + DaisyUI
- **State Management**: Redux
- **Code Editor**: Monaco Editor

### Backend

- **Runtime**: Node.js + Express
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT
- **Rate Limiting**: Redis (Sliding Window)

### Tools & Services

- **Cloudinary**: For storing and serving video solutions
- **Gemini API**: For AI-powered hints and explanations
- **Deployment**: Vercel (Frontend) & Render (Backend)

## Installation

### Prerequisites

- Node.js (v14 or above)
- MongoDB
- Redis (for rate limiting)
- npm or yarn
- Git

### Steps

1. **Clone the Repo**
   ```bash
   git clone https://github.com/sumitdebnath2002/GeeksArena.git
   cd GeeksArena
   ```

2. **Install Dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Fill in: DB URI, JWT secret, Redis config, Cloudinary keys, Gemini API key, etc.
   ```

4. **Start Servers**
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend (in a new terminal)
   cd frontend
   npm run dev
   ```

5. **Visit the App**
   - Frontend: http://localhost:5174  
   - Backend: http://localhost:3000

## Usage

### As a User

- Register or log in
- Browse problems using filters or pagination
- Solve problems using the Monaco Editor
- View explanations in the Editorial or Video sections
- Use AI tab for assistance
- Write or read blog posts
- Comment on others' blogs

### As an Admin

- Access the admin panel
- Create, update, or delete problems
- Upload or delete Cloudinary-hosted video explanations
- Moderate blog posts or comments if needed

## Project Structure

```
GeeksArena/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── authSlice.js
│   │   ├── main.jsx
│   │   └── styles/
│   ├── index.html
│   ├── .env
│   ├── tailwind.config.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── README.md
```

## API Documentation

### Auth

#### POST `/api/auth/register`

```json
{
  "username": "sumit",
  "email": "sumit@email.com",
  "password": "secure123"
}
```

#### POST `/api/auth/login`

```json
{
  "email": "sumit@email.com",
  "password": "secure123"
}
```

### Problems

#### GET `/api/problems?page=1&limit=10`

Returns paginated problems.

#### GET `/api/problems/:id`

Get detailed problem data.

#### POST `/api/problems/:id/submit`

```json
{
  "code": "your code here",
  "language": "cpp"
}
```

### Profile

#### GET `/api/users/profile`

Fetch user info.

#### PUT `/api/users/profile`

Update profile details.

## Contributing

We welcome contributions of any kind!

```bash
git fork https://github.com/sumitdebnath2002/GeeksArena.git
git checkout -b feature/your-feature-name
```

Make changes, then:

```bash
git commit -m "Fix: improved profile update UI"
git push origin feature/your-feature-name
```

Submit a Pull Request.


## Contact

**Maintainers:**

- **Sumit Debnath**  
  GitHub: [@sumitdebnath2002](https://github.com/sumitdebnath2002)

- **Shubham Jha**  
  GitHub: [@shubhamjha-13](https://github.com/shubhamjha-13)

- **Nongamba Nangom**  
  GitHub: [@Nongamba04](https://github.com/Nongamba04)

Feel free to:
- Open issues
- Join discussions
- Submit pull requests

**Built with ❤️ by the GeeksArena community**
