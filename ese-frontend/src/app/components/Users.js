import React, { useState, useEffect } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../../lib/server";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState(""); // ✅ CSRF Token state
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  // ✅ Fetch CSRF token on mount
  const fetchCsrfToken = async () => {
    try {
      const response = await fetch("/api/csrf");
      const data = await response.json();
      setCsrfToken(data.csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  };

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      const userData = await getUsers();
      setUsers(userData.fetched || []);
    } catch (err) {
      setError("Failed to load users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCsrfToken(); // ✅ Fetch CSRF token first
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!csrfToken) {
      console.error("CSRF token is missing");
      return;
    }

    try {
      await addUser(newUser, csrfToken);
      setNewUser({ first_name: "", last_name: "", email: "" });
      fetchUsers(); // ✅ Refresh user list
    } catch (err) {
      setError("Failed to add user");
      console.error("Error adding user:", err);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!csrfToken) {
      console.error("CSRF token is missing");
      return;
    }

    try {
      await updateUser(editingUser.id, newUser, csrfToken);
      setEditingUser(null);
      setNewUser({ first_name: "", last_name: "", email: "" });
      fetchUsers(); // ✅ Refresh user list
    } catch (err) {
      setError("Failed to update user");
      console.error("Error updating user:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!csrfToken) {
      console.error("CSRF token is missing");
      return;
    }

    try {
      await deleteUser(id, csrfToken);
      fetchUsers(); // ✅ Refresh user list
    } catch (err) {
      setError("Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="users-list">
      <h2 className="task-management">Users List</h2>

      <UserForm
        newUser={newUser}
        setNewUser={setNewUser}
        handleAddUser={handleAddUser}
        handleUpdateUser={handleUpdateUser}
        editingUser={editingUser}
      />
      <br />
      <UserList
        users={users}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default Users;
