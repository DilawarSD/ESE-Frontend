import React, { useState, useEffect } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../../lib/server";
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
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addUser(newUser);
      setNewUser({ first_name: "", last_name: "", email: "" });
      fetchUsers();
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
    try {
      await updateUser(editingUser.id, newUser);
      setEditingUser(null);
      setNewUser({ first_name: "", last_name: "", email: "" });
      fetchUsers();
    } catch (err) {
      setError("Failed to update user");
      console.error("Error updating user:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedUsers = () => {
    const sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (
          typeof a[sortConfig.key] === "string" &&
          typeof b[sortConfig.key] === "string"
        ) {
          const valueA = a[sortConfig.key].toLowerCase();
          const valueB = b[sortConfig.key].toLowerCase();

          if (valueA < valueB) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sortableUsers;
  };

  const getFilteredUsers = () => {
    const sortedUsers = getSortedUsers();
    if (!searchTerm) return sortedUsers;

    return sortedUsers.filter((user) => {
      const term = searchTerm.toLowerCase();
      return (
        (user.first_name && user.first_name.toLowerCase().includes(term)) ||
        (user.last_name && user.last_name.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term))
      );
    });
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
        users={getFilteredUsers()}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default Users;
