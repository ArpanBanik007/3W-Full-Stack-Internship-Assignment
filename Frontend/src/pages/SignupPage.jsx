import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../componants/InputField";
import Button from "../componants/Button";
import axios from "axios";
import api from "../utils/axios";

export default function SignUp() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    phone: "", // ✅ backend e empty string যাবে
    password: "",
    avatar: "",
    coverImage: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(
    "https://www.svgrepo.com/show/452030/avatar-default.svg",
  );
  const [coverPreview, setCoverPreview] = useState(
    "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg",
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    if (type === "avatar") {
      setAvatarPreview(url);
      setFormData((prev) => ({ ...prev, avatar: file }));
    } else {
      setCoverPreview(url);
      setFormData((prev) => ({ ...prev, coverImage: file }));
    }
  };

  const avatarRef = useRef(null);
  const coverRef = useRef(null);

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("phone", "");
      formDataToSend.append("password", formData.password);

      if (formData.avatar) formDataToSend.append("avatar", formData.avatar);
      if (formData.coverImage)
        formDataToSend.append("coverImage", formData.coverImage);

      const res = await api.post("/api/v1/users/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(res.data.message || "Registration successful");

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        {error && <p className="text-danger text-center">{error}</p>}
        {success && <p className="text-success text-center">{success}</p>}

        <form onSubmit={handelSubmit}>
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h4 className="text-center mb-3">Basic Details</h4>

              <InputField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                placeholder="Enter full name"
                onChange={handleChange}
              />

              <InputField
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                placeholder="Enter email"
                onChange={handleChange}
              />

              <InputField
                label="Username"
                name="username"
                value={formData.username}
                placeholder="Enter username"
                onChange={handleChange}
              />

              <Button
                type="button"
                text="Next"
                onClick={() => setStep(2)}
                variant="primary"
              />
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h4 className="text-center mb-3">Profile Images</h4>

              <div className="text-center mb-3">
                <img
                  src={coverPreview}
                  alt="cover"
                  className="img-fluid rounded mb-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => coverRef.current.click()}
                />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={coverRef}
                  onChange={(e) => handleFileChange(e, "cover")}
                />
              </div>

              <div className="text-center mb-4">
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="rounded-circle"
                  width="120"
                  style={{ cursor: "pointer" }}
                  onClick={() => avatarRef.current.click()}
                />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={avatarRef}
                  onChange={(e) => handleFileChange(e, "avatar")}
                />
              </div>

              <div className="d-flex gap-2">
                <Button
                  type="button"
                  text="Back"
                  variant="secondary"
                  onClick={() => setStep(1)}
                />
                <Button
                  type="button"
                  text="Next"
                  variant="primary"
                  onClick={() => setStep(3)}
                />
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <h4 className="text-center mb-3">Set Password</h4>

              <InputField
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                placeholder="Enter password"
                onChange={handleChange}
              />

              <div className="d-flex gap-2">
                <Button
                  type="button"
                  text="Back"
                  variant="secondary"
                  onClick={() => setStep(2)}
                />
                <Button
                  type="submit"
                  text="Sign Up"
                  loading={loading}
                  variant="success"
                />
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
