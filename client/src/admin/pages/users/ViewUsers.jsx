import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
  getAdminUsers,
  deleteAdminUser,
} from "../../../services/adminService";

const ViewUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAdminUsers();
        setUsers(data?.users || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      await deleteAdminUser(id);
      setUsers((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-header">
          <h1>View Users</h1>
          <p>All registered users are listed below.</p>
        </div>

        {loading && <p>Loading users...</p>}
        {error && <p className="admin-dashboard-error">{error}</p>}

        {!loading && !error && (
          <section className="admin-dashboard-section">
            <h2>Users List</h2>

            <div className="admin-dashboard-table-wrap">
              <table className="admin-dashboard-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() =>
                                navigate(`/admin/users/edit/${user._id}`)
                              }
                              style={editBtn}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              style={deleteBtn}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </AdminLayout>
  );
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

export default ViewUsers;
