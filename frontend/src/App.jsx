import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing      from "./pages/Landing";
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Search       from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import Watchlist    from "./pages/Watchlist";

function App() {
  return (
    <Routes>
      {/* Public routes — anyone can visit */}
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes — must be logged in */}
      <Route path="/search" element={
        <ProtectedRoute><Search /></ProtectedRoute>
      } />
      <Route path="/movie/:id" element={
        <ProtectedRoute><MovieDetails /></ProtectedRoute>
      } />
      <Route path="/watchlist" element={
        <ProtectedRoute><Watchlist /></ProtectedRoute>
      } />

      {/* Catch all - redirect unknown URLs to landing */}
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default App;
