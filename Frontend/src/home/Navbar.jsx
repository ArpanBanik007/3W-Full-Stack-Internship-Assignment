import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { useDispatch } from "react-redux";
import axios from "axios";
import { persistor } from "../store/store";
import { resetMyDetails } from "../slices/mydetails.slice";
import { resetMyPosts } from "../slices/postSlice";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // ✅ Logout Handler (UNCHANGED)
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8001/api/v1/users/logout",
        {},
        { withCredentials: true }
      );

      dispatch(resetMyDetails());
      dispatch(resetMyPosts());
      await persistor.purge();

      localStorage.clear();
      sessionStorage.clear();

      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <nav className="navbar px-3 shadow-sm sticky-top bg-secondary">
      {/* ✅ Logo */}
      <span
        className="navbar-brand fw-bold fst-italic text-white"
        style={{ cursor: "pointer" }}
        onClick={() =>
          location.pathname === "/home"
            ? window.location.reload()
            : navigate("/home")
        }
      >
        3W App
      </span>

      {/* ✅ Right side actions */}
      <div className="d-flex align-items-center gap-3">
        {/* Home */}
        <button
          className={`btn btn-sm ${
            location.pathname === "/home"
              ? "btn-light"
              : "btn-outline-light"
          }`}
          onClick={() =>
            location.pathname === "/home"
              ? window.location.reload()
              : navigate("/home")
          }
        >
          <IoMdHome className="me-1" />
          Home
        </button>

        {/* Logout Button */}
        <button
          className="btn btn-sm btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
