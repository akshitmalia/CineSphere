# CineSphere

A full-stack MERN application for discovering, filtering, and saving movies. CineSphere connects to the TMDb API to provide multi-criteria movie search, detailed movie pages with trailer playback, and a personal watchlist backed by MongoDB.

---

## Deployment

| Service | URL |
|---|---|
| Live Application | https://cinesphere-psi.vercel.app |
| Backend API | https://cinesphere-eip2.onrender.com |
| Source Code | https://github.com/akshitmalia/CineSphere |

---

## Overview

CineSphere allows authenticated users to search for movies by title or apply multiple filters simultaneously — genre, release year, language, and minimum TMDb rating — with paginated results. Each movie page displays a backdrop hero with the official trailer playing as a muted background video on desktop, with a YouTube redirect on mobile. Users can save movies to a personal watchlist stored in MongoDB, with the poster and metadata snapshot persisted so the watchlist loads without additional API calls.

---

## Features

- Movie search by title with 500ms debounced input
- Multi-filter discovery: genre, release year, original language, and minimum rating applied simultaneously
- Server-side filtering and pagination via TMDb's `/discover/movie` and `/search/movie` endpoints
- Movie detail page with auto-playing muted trailer on desktop; YouTube redirect button on mobile
- Mute and unmute trailer without restarting playback, using the YouTube iframe postMessage API
- Cast display with actor name and character, horizontally scrollable
- Personal watchlist with add and remove functionality, persisted in MongoDB
- Watchlist loads from a stored snapshot — no extra TMDb calls on the watchlist page
- JWT authentication with short-lived access tokens stored in memory and long-lived refresh tokens stored as httpOnly cookies
- Silent session restore on page load via the refresh token cookie
- URL-based filter state: active filters are reflected in the URL query string, making searches shareable and bookmarkable, with the browser back button working correctly
- Skeleton loading states on the search grid during data fetches
- Responsive layout with a collapsible hamburger navigation on mobile
- Trailer fallback to static backdrop image when no trailer is available or on mobile devices

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 with Vite | UI framework and build tooling |
| Tailwind CSS v4 (Vite plugin) | Utility-first styling with custom design tokens |
| React Router DOM v7 | Client-side routing with URL-based filter state |
| Axios | HTTP client with silent token refresh interceptor |
| Context API with useReducer | Global auth state without Redux |

### Backend

| Technology | Purpose |
|---|---|
| Node.js with Express | REST API server |
| MongoDB with Mongoose | Persistent storage for users and watchlist |
| bcryptjs | Password hashing |
| jsonwebtoken | Access and refresh token generation and verification |
| cookie-parser | Reading httpOnly refresh token cookies |
| axios | Server-side TMDb API proxy |
| cors | Cross-origin request handling between Vercel and Render |

### External APIs

| API | Purpose |
|---|---|
| TMDb API v3 | Movie search, discovery, details, cast, trailers, genres |
| YouTube embed | Trailer autoplay on the movie detail page |

---

## Project Structure

```
CineSphere/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── movieController.js
│   │   └── fav.js
│   ├── middleware/
│   │   └── auth_middleware.js
│   ├── models/
│   │   ├── user.js
│   │   └── favourite.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   └── favouriteRoutes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js
    │   │   ├── auth.js
    │   │   ├── movies.js
    │   │   └── favourites.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   └── useAuth.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── MovieCard.jsx
    │   │   ├── FilterBar.jsx
    │   │   └── Pagination.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Search.jsx
    │   │   ├── MovieDetails.jsx
    │   │   └── Watchlist.jsx
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── vercel.json
    └── package.json
```

---

## Local Setup

### Prerequisites

- Node.js 18 or higher
- A MongoDB Atlas account (free tier is sufficient)
- A TMDb API key (free at themoviedb.org, Settings, API)

### 1. Clone the repository

```bash
git clone https://github.com/akshitmalia/CineSphere.git
cd CineSphere
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder using `.env.example` as a reference:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/cinesphere
JWT_ACCESS_SECRET=your_64_char_random_hex
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=your_different_64_char_random_hex
JWT_REFRESH_EXPIRY=7d
TMDB_API_KEY=your_tmdb_v3_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
CLIENT_URL=http://localhost:3000
```

Generate secure JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run the command twice to get two distinct secrets.

Start the backend:

```bash
npm run dev
```

The server runs at `http://localhost:5000`. Verify it is live by visiting `http://localhost:5000/api/health`.

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The application runs at `http://localhost:3000`.

---

## Authentication Flow

CineSphere uses a dual-token authentication pattern designed to keep the access token out of browser storage:

- On login or registration, the server issues a short-lived access token (15 minutes) returned in the JSON response body, and a long-lived refresh token (7 days) set as an httpOnly cookie that JavaScript cannot read.
- The React frontend stores the access token only in memory via Context state. It is never written to localStorage or sessionStorage.
- Every authenticated API request sends the access token in the `Authorization: Bearer` header. The axios interceptor attaches it automatically.
- When the access token expires and a request receives a 401 response, the axios interceptor silently calls `/api/auth/refresh`. The browser sends the httpOnly cookie automatically on this call. If the cookie is valid, the server issues a new access token and the original request is retried transparently.
- Multiple concurrent requests that all receive a 401 are queued behind a single refresh call rather than triggering multiple parallel refresh requests.
- On every page load, the AuthContext calls `/api/auth/refresh` to restore the session from the cookie. This means users stay logged in across browser restarts and tab refreshes without re-entering credentials.

---

## API Reference

### Authentication routes — `/api/auth`

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Log in and receive tokens |
| POST | `/refresh` | No (cookie) | Issue a new access token using the refresh cookie |
| POST | `/logout` | No | Clear the refresh token cookie |

### Movie routes — `/api/movies`

All routes require a valid access token in the `Authorization` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/trending` | Top 10 trending movies for the week |
| GET | `/genres` | Full list of TMDb genre IDs and names |
| GET | `/search` | Search and filter movies (query, genre, year, language, minRating, page) |
| GET | `/:id` | Full movie details including cast and trailer key |

### Favourites routes — `/api/favourites`

All routes require a valid access token in the `Authorization` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Retrieve all watchlist entries for the current user |
| POST | `/` | Add a movie to the watchlist |
| DELETE | `/:tmdbMovieId` | Remove a movie from the watchlist |

---

## Deployment

### Backend on Render

1. Create a new Web Service on Render connected to the GitHub repository
2. Set the root directory to `backend`
3. Set the start command to `node server.js`
4. Add all environment variables from the backend `.env` section above, with `NODE_ENV=production` and `CLIENT_URL` set to your Vercel URL

### Frontend on Vercel

1. Import the repository on Vercel
2. Set the root directory to `frontend`
3. Add `VITE_API_URL` pointing to your Render backend URL
4. The `vercel.json` file in the frontend directory handles SPA routing so that page refreshes on any route return the React application rather than a 404

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Environment Variables Reference

### Backend `.env.example`

```
PORT=5000
NODE_ENV=development
MONGO_URI=
JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRY=7d
TMDB_API_KEY=
TMDB_BASE_URL=https://api.themoviedb.org/3
CLIENT_URL=
```

### Frontend `.env.example`

```
VITE_API_URL=
```

---

## Author

Akshit Malia

- GitHub: https://github.com/akshitmalia
- LinkedIn: https://linkedin.com/in/akshitmalia

---

## License

This project is open source and available under the MIT License.
