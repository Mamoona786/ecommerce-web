import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
  getCategoryById,
  updateCategory,
} from "../../../services/categoryService";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category_name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await getCategoryById(id);
        const category = data?.category;

        setFormData({
          category_name: category?.category_name || "",
          description: category?.description || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
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

      await updateCategory(id, formData);

      setSuccess("Category updated successfully");

      setTimeout(() => {
        navigate("/admin/categories/view");
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-header">
          <h1>Edit Category</h1>
          <p>Update category details.</p>
        </div>

        <section className="admin-dashboard-section">
          {loading ? (
            <p>Loading category...</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
              <div>
                <label>Category Name</label>
                <input
                  type="text"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  style={inputStyle}
                />
              </div>

              {error && <p style={{ color: "#dc2626" }}>{error}</p>}
              {success && <p style={{ color: "#16a34a" }}>{success}</p>}

              <button type="submit" style={buttonStyle} disabled={saving}>
                {saving ? "Updating..." : "Update Category"}
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

export default EditCategory;
