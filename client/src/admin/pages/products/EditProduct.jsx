import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
  getProductById,
  updateProduct,
} from "../../../services/productService";
import { getAllCategories } from "../../../services/categoryService";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    category: "",
    brand: "",
    shortDescription: "",
    subCategory: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productData, categoryData] = await Promise.all([
          getProductById(id),
          getAllCategories(),
        ]);

        const product = productData?.product;

        setCategories(categoryData?.categories || []);
        setFormData({
          name: product?.name || "",
          price: product?.price || "",
          stock: product?.stock || "",
          image: product?.image || "",
          description: product?.description || "",
          category: product?.category?._id || "",
          brand: product?.brand || "",
          shortDescription: product?.shortDescription || "",
          subCategory: product?.subCategory || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

      await updateProduct(id, {
        ...formData,
        price: Number(formData.price || 0),
        stock: Number(formData.stock || 0),
      });

      setSuccess("Product updated successfully");

      setTimeout(() => {
        navigate("/admin/products/view");
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-header">
          <h1>Edit Product</h1>
          <p>Update product details.</p>
        </div>

        <section className="admin-dashboard-section">
          {loading ? (
            <p>Loading product...</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
              <div>
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Sub Category</label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Short Description</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows="3"
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
                {saving ? "Updating..." : "Update Product"}
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

export default EditProduct;
