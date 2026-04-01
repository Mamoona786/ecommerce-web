import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
  getAdminUserById,
  updateAdminUser,
} from "../../../services/adminService";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getAdminUserById(id);
        const user = data?.user;

        setFormData({
          username: user?.username || "",
          email: user?.email || "",
          password: "",
          role: user?.role || "user",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateAdminUser(id, formData);

      setSuccess("User updated successfully");

      setTimeout(() => {
        navigate("/admin/users/view");
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-header">
          <h1>Edit User</h1>
          <p>Update user details.</p>
        </div>

        <section className="admin-dashboard-section">
          {loading ? (
            <p>Loading user...</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>New Password (optional)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Leave empty to keep current password"
                />
              </div>

              <div>
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {error && <p style={{ color: "#dc2626" }}>{error}</p>}
              {success && <p style={{ color: "#16a34a" }}>{success}</p>}

              <button type="submit" style={buttonStyle} disabled={saving}>
                {saving ? "Updating..." : "Update User"}
              </button>
            </form>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

const inputStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  outline: "none",
};

const buttonStyle = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
};

export default EditUser;
