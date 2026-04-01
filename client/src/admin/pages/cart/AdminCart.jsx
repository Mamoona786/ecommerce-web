import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
  getAdminCarts,
  deleteAdminCart,
} from "../../../services/adminService";

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const getCartItemsCount = (items = []) => {
  return items.reduce((total, item) => total + Number(item.quantity || 0), 0);
};

const getCartTotal = (items = []) => {
  return items.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
};

const AdminCart = () => {
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAdminCarts();
        setCarts(data?.carts || []);
      } catch (err) {
        console.error("Failed to fetch carts:", err);
        setError(err.response?.data?.message || "Failed to load carts");
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const toggleRow = (cartId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [cartId]: !prev[cartId],
    }));
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this cart?"
    );
    if (!confirmed) return;

    try {
      await deleteAdminCart(id);
      setCarts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete cart");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-header">
          <h1>Cart</h1>
          <p>All user carts are listed below.</p>
        </div>

        <section className="admin-dashboard-section">
          <h2>Cart Management</h2>

          {loading && <p>Loading carts...</p>}
          {error && <p className="admin-dashboard-error">{error}</p>}

          {!loading && !error && (
            <div className="admin-dashboard-table-wrap">
              <table className="admin-dashboard-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Total Items</th>
                    <th>Cart Total</th>
                    <th>Last Updated</th>
                    <th>Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {carts.length > 0 ? (
                    carts.map((cart, index) => (
                      <React.Fragment key={cart._id}>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{cart.user?.username || "N/A"}</td>
                          <td>{cart.user?.email || "N/A"}</td>
                          <td>{cart.status}</td>
                          <td>{getCartItemsCount(cart.items)}</td>
                          <td>{formatCurrency(getCartTotal(cart.items))}</td>
                          <td>
                            {cart.updatedAt
                              ? new Date(cart.updatedAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => toggleRow(cart._id)}
                              style={secondaryBtn}
                            >
                              {expandedRows[cart._id] ? "Hide" : "View"}
                            </button>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                onClick={() =>
                                  navigate(`/admin/carts/edit/${cart._id}`)
                                }
                                style={editBtn}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(cart._id)}
                                style={deleteBtn}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>

                        {expandedRows[cart._id] && (
                          <tr>
                            <td colSpan="9" style={{ background: "#f9fafb" }}>
                              <div style={{ padding: "16px" }}>
                                <h3 style={{ marginBottom: "14px" }}>
                                  Cart Items
                                </h3>

                                {cart.items?.length > 0 ? (
                                  <div style={{ overflowX: "auto" }}>
                                    <table
                                      style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        background: "#fff",
                                      }}
                                    >
                                      <thead>
                                        <tr>
                                          <th style={thStyle}>Image</th>
                                          <th style={thStyle}>Product</th>
                                          <th style={thStyle}>Seller</th>
                                          <th style={thStyle}>Price</th>
                                          <th style={thStyle}>Quantity</th>
                                          <th style={thStyle}>Subtotal</th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {cart.items.map((item) => (
                                          <tr key={item._id}>
                                            <td style={tdStyle}>
                                              <img
                                                src={item.image}
                                                alt={item.title}
                                                style={imgStyle}
                                              />
                                            </td>
                                            <td style={tdStyle}>
                                              {item.title || item.product?.name || "N/A"}
                                            </td>
                                            <td style={tdStyle}>
                                              {item.seller || "N/A"}
                                            </td>
                                            <td style={tdStyle}>
                                              {formatCurrency(item.price)}
                                            </td>
                                            <td style={tdStyle}>{item.quantity}</td>
                                            <td style={tdStyle}>
                                              {formatCurrency(
                                                Number(item.price || 0) *
                                                  Number(item.quantity || 0)
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <p style={{ color: "#6b7280" }}>
                                    No cart items found.
                                  </p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: "center" }}>
                        No carts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

const thStyle = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #e5e7eb",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #f1f5f9",
};

const imgStyle = {
  width: "56px",
  height: "56px",
  objectFit: "cover",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const secondaryBtn = {
  background: "#fff",
  color: "#111827",
  border: "1px solid #d1d5db",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const editBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default AdminCart;
