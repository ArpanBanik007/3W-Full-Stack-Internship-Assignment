import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:8001/api/v1/users/login",
        formData,
        { withCredentials: true },
      );

      setSuccess(res?.data?.message || "Login successful!");

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong or Login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card p-4 shadow" style={{ width: "380px" }}>
        {error && (
          <p className="text-danger text-center fw-medium mb-3">{error}</p>
        )}

        {success && (
          <p className="text-success text-center fw-medium mb-3">{success}</p>
        )}

        <h4 className="text-center mb-4">Login</h4>

        <form onSubmit={handelSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="identifier"
              className="form-control"
              placeholder="Email or Username"
              value={formData.identifier}
              onChange={handelChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handelChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3 text-danger">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="btn btn-link p-0 text-primary"
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
