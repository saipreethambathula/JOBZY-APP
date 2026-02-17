import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_URL;

const Auth = ({ isTrue = false }) => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  // Immediate redirect if JWT exists
  if (token && user?.role === "admin") return <Navigate to="/admin" replace />;
  if (token && user?.role === "user") return <Navigate to="/jobs" replace />;

  const [isSignup, setIsSignup] = useState(isTrue);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup && !passwordRegex.test(formData.password)) {
      return setError(
        "Password must contain at least one capital letter and one number",
      );
    }

    setIsLoading(true);

    try {
      const url = isSignup
        ? `${BASE_URL}/auth/signup`
        : `${BASE_URL}/auth/login`;

      const payload = isSignup
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Authentication failed");

      if (!isSignup) {
        Cookies.set("token", data.token, { expires: 30, path: "/" });
        Cookies.set("user", JSON.stringify(data.user), { expires: 1 });

        if (data.user.role === "admin") navigate("/admin", { replace: true });
        else navigate("/jobs", { replace: true });
      } else {
        alert("Signup successful! You can now login.");
        setIsSignup(false);
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-10 rounded-4xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        {/* Toggle Login / Signup */}
        <div className="flex mb-8 bg-neutral-50 p-1.5 rounded-2xl">
          <button
            onClick={() => setIsSignup(false)}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
              !isSignup
                ? "bg-white shadow-sm text-black"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
              isSignup
                ? "bg-white shadow-sm text-black"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-800">
            {isSignup ? "Join Jobzy" : "Welcome Back"}
          </h1>
          <p className="text-neutral-400 text-sm">
            {isSignup
              ? "Create an account to start applying"
              : "Enter your credentials to continue"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <div className="relative flex items-center">
              <User className="absolute text-gray-400 ml-2.5" size={21} />
              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={formData.name}
                className="w-full pl-10 p-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black/20 transition-all text-sm"
                required
              />
            </div>
          )}

          <div className="relative flex items-center">
            <Mail className="absolute ml-2.5 text-gray-400" size={21} />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              className="w-full pl-10 p-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black/20 transition-all text-sm"
              required
            />
          </div>

          <div className="relative flex items-center">
            <Lock className="absolute text-gray-400 ml-2.5" size={21} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              className="w-full pl-10 pr-12 p-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black/20 transition-all text-sm"
              required
            />
            <span
              className="absolute right-4 top-4 cursor-pointer text-neutral-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
            </span>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button with Loading */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-xl shadow-black/10 mt-4 disabled:opacity-50"
          >
            <span className="inline-flex items-center justify-center w-full">
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
            </span>
          </button>
        </form>

        <p
          className="text-center text-sm mt-4 cursor-pointer text-gray-600"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don’t have an account? Sign up"}
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
