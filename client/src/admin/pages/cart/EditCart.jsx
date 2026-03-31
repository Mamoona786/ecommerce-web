import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
  getAdminCartById,
  updateAdminCart,
} from "../../../services/adminService";

const EditCart = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await getAdminCartById(id);
        setStatus(data?.cart?.status || "active");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateAdminCart(id, { status });

      setSuccess("Cart updated successfully");

      setTimeout(() => {
        navigate("/admin/cart");
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update cart");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-header">
          <h1>Edit Cart</h1>
          <p>Update cart status.</p>
        </div>

        <section className="admin-dashboard-section">
          {loading ? (
            <p>Loading cart...</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
              <div>
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={inputStyle}
                >
                  <option value="active">Active</option>
                  <option value="checked_out">Checked Out</option>
                  <option value="abandoned">Abandoned</option>
                </select>
              </div>

              {error && <p style={{ color: "#dc2626" }}>{error}</p>}
              {success && <p style={{ color: "#16a34a" }}>{success}</p>}

              <button type="submit" style={buttonStyle} disabled={saving}>
                {saving ? "Updating..." : "Update Cart"}
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

export default EditCart;
