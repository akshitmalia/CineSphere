import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [showPass, setShowPass]     = useState(false);

  // Password strength indicator
  const getStrength = (p) => {
    if (!p) return { label: "", color: "#2a2a3a", width: "0%" };
    if (p.length < 6)  return { label: "Too short", color: "#ef4444", width: "25%" };
    if (p.length < 8)  return { label: "Weak",      color: "#f97316", width: "50%" };
    if (!/[0-9]/.test(p) || !/[A-Z]/.test(p))
                       return { label: "Fair",       color: "#e8b339", width: "75%" };
    return               { label: "Strong",     color: "#22c55e", width: "100%" };
  };

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirm) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      navigate("/search");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: "#0a0a0f",
    border: "1px solid #2a2a3a",
    borderRadius: "8px",
    padding: "0.85rem 1rem",
    color: "#f5f3ee",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "Manrope, sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background glows */}
      <div style={{
        position: "absolute", top: "-20%", right: "-10%",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(232,179,57,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", left: "-10%",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(108,92,231,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", marginBottom: "2.5rem" }}>
        <h1 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "2.8rem",
          color: "#e8b339",
          letterSpacing: "0.15em",
          margin: 0,
        }}>CineSphere</h1>
      </Link>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "#14141c",
        border: "1px solid #2a2a3a",
        borderRadius: "16px",
        padding: "2.5rem",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
      }}>
        <h2 style={{
          fontFamily: "Manrope, sans-serif",
          fontSize: "1.6rem",
          fontWeight: "800",
          color: "#f5f3ee",
          margin: "0 0 0.5rem 0",
        }}>Create account</h2>
        <p style={{ color: "#8b8b9a", fontSize: "0.9rem", margin: "0 0 2rem 0" }}>
          Join CineSphere and start discovering
        </p>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
            color: "#f87171",
            fontSize: "0.875rem",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ color: "#8b8b9a", fontSize: "0.85rem", fontWeight: "600" }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#e8b339"}
              onBlur={(e) => e.target.style.borderColor = "#2a2a3a"}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ color: "#8b8b9a", fontSize: "0.85rem", fontWeight: "600" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                style={{ ...inputStyle, paddingRight: "3rem" }}
                onFocus={(e) => e.target.style.borderColor = "#e8b339"}
                onBlur={(e) => e.target.style.borderColor = "#2a2a3a"}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: "1rem", top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "#8b8b9a", cursor: "pointer", fontSize: "0.8rem",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            {/* Password strength bar */}
            {password && (
              <div>
                <div style={{
                  height: "3px", backgroundColor: "#2a2a3a",
                  borderRadius: "999px", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: strength.width,
                    backgroundColor: strength.color,
                    borderRadius: "999px",
                    transition: "width 0.3s, background-color 0.3s",
                  }} />
                </div>
                <span style={{ color: strength.color, fontSize: "0.75rem", marginTop: "0.25rem", display: "block" }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ color: "#8b8b9a", fontSize: "0.85rem", fontWeight: "600" }}>
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              style={{
                ...inputStyle,
                borderColor: confirm && confirm !== password ? "#ef4444" : "#2a2a3a",
              }}
              onFocus={(e) => e.target.style.borderColor = confirm !== password ? "#ef4444" : "#e8b339"}
              onBlur={(e) => e.target.style.borderColor = confirm !== password ? "#ef4444" : "#2a2a3a"}
            />
            {confirm && confirm !== password && (
              <span style={{ color: "#f87171", fontSize: "0.78rem" }}>
                Passwords do not match
              </span>
            )}
            {confirm && confirm === password && (
              <span style={{ color: "#22c55e", fontSize: "0.78rem" }}>
                ✓ Passwords match
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? "#c99a2e" : "#e8b339",
              color: "#0a0a0f",
              border: "none",
              borderRadius: "8px",
              padding: "0.9rem",
              fontSize: "1rem",
              fontWeight: "800",
              fontFamily: "Manrope, sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.backgroundColor = "#f0c868"; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.backgroundColor = "#e8b339"; }}
          >
            {loading ? (
              <>
                <div style={{
                  width: "16px", height: "16px",
                  border: "2px solid #0a0a0f",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }} />
                Creating account...
              </>
            ) : "Create Account"}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: "1rem",
          margin: "1.5rem 0",
        }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#2a2a3a" }} />
          <span style={{ color: "#8b8b9a", fontSize: "0.8rem" }}>OR</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#2a2a3a" }} />
        </div>

        {/* Login link */}
        <p style={{ textAlign: "center", color: "#8b8b9a", fontSize: "0.9rem", margin: 0 }}>
          Already have an account?{" "}
          <Link to="/login" style={{
            color: "#e8b339", fontWeight: "700", textDecoration: "none",
          }}>
            Sign in
          </Link>
        </p>
      </div>

      <p style={{ color: "#8b8b9a", fontSize: "0.8rem", marginTop: "2rem" }}>
        © 2025 CineSphere. All rights reserved.
      </p>
    </div>
  );
};

export default Register;
