import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
  getAdminOrders,
  deleteAdminOrder,
} from "../../../services/adminService";

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const getOrderItemsCount = (items = []) => {
  return items.reduce((total, item) => total + Number(item.quantity || 0), 0);
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAdminOrders();
        setOrders(data?.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleRow = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmed) return;

    try {
      await deleteAdminOrder(id);
      setOrders((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete order");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-header">
          <h1>Orders</h1>
          <p>Manage all customer orders from here.</p>
        </div>

        <section className="admin-dashboard-section">
          <h2>All Orders</h2>

          {loading && <p>Loading orders...</p>}
          {error && <p className="admin-dashboard-error">{error}</p>}

          {!loading && !error && (
            <div className="admin-dashboard-table-wrap">
              <table className="admin-dashboard-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Total Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <React.Fragment key={order._id}>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{order._id}</td>
                          <td>{order.user?.username || "N/A"}</td>
                          <td>{order.user?.email || "N/A"}</td>
                          <td>{getOrderItemsCount(order.items)}</td>
                          <td>{formatCurrency(order.total)}</td>
                          <td>{order.status}</td>
                          <td>
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => toggleRow(order._id)}
                              style={secondaryBtn}
                            >
                              {expandedRows[order._id] ? "Hide" : "View"}
                            </button>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                onClick={() =>
                                  navigate(`/admin/orders/edit/${order._id}`)
                                }
                                style={editBtn}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(order._id)}
                                style={deleteBtn}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>

                        {expandedRows[order._id] && (
                          <tr>
                            <td colSpan="10" style={{ background: "#f9fafb" }}>
                              <div style={{ padding: "16px" }}>
                                <h3 style={{ marginBottom: "14px" }}>
                                  Ordered Products
                                </h3>

                                {order.items?.length > 0 ? (
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
                                        {order.items.map((item) => (
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
                                    No ordered products found.
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
                      <td colSpan="10" style={{ textAlign: "center" }}>
                        No orders found
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

export default AdminOrders;
