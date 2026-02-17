import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <>
      <header className="bg-white h-15 text-black flex items-center justify-between px-5 md:px-10 border-b-[0.8px] border-gray-400">
        <div className="flex items-center">
          <h1 className="font-bold tracking-[2px] text-lg">JOBZY</h1>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white px-4 py-1 shadow-xl shadow-black/10 hover:opacity-90 transition rounded "
        >
          Login
        </button>
      </header>
      <section className="min-h-[calc(100vh-60px)] flex items-center bg-white">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                Find Your Dream Job <br /> Faster & Smarter
              </h1>

              <p className="mt-4 text-gray-600 text-lg max-w-xl">
                Explore verified job opportunities from top companies. Apply
                easily and track your career growth in one place.
              </p>

              <div className="mt-8 flex gap-4">
                <Link
                  to="/login"
                  className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition"
                >
                  Browse Jobs
                </Link>

                <Link
                  to="/signup"
                  className="px-6 py-3 border border-black text-black font-medium rounded-md hover:bg-black hover:text-white transition"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden md:flex justify-center">
              <div className="w-full max-w-md p-8 border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-black">
                  Jobs Available
                </h3>
                <p className="mt-2 text-gray-600">
                  Frontend • Backend • Full-Stack • Internships
                </p>

                <div className="mt-6 h-2 bg-gray-200 rounded">
                  <div className="h-2 w-3/4 bg-black rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
