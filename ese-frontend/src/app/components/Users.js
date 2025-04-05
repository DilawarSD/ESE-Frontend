import React, { useState, useEffect } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../../lib/server";
import { sortUsers, filterUsers } from "../../utils/userUtils";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import Search from "../components/Search";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "first_name",
    direction: "ascending",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addUser(newUser);
      setNewUser({ first_name: "", last_name: "", email: "" });
      fetchUsers();
    } catch (err) {
      setError("Failed to add user");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser(user);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.id, newUser);
      setEditingUser(null);
      setNewUser({ first_name: "", last_name: "", email: "" });
      fetchUsers();
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const displayedUsers = filterUsers(sortUsers(users, sortConfig), searchTerm);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

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
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortConfig={sortConfig}
        handleSort={handleSort}
        searchPlaceholder="Search users..."
        sortOptions={[
          { key: "first_name", label: "First Name" },
          { key: "last_name", label: "Last Name" },
          { key: "email", label: "Email" },
        ]}
      />
      <UserList
        users={displayedUsers}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default Users;
