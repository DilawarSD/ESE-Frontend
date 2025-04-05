import React, { useState } from "react";

const UserForm = ({
  newUser,
  setNewUser,
  handleAddUser,
  handleUpdateUser,
  editingUser,
}) => {
  const [error, setError] = useState("");

  const validateForm = () => {
    const { first_name, last_name, email } = newUser;
    return first_name && last_name && email;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setError("");
      editingUser ? handleUpdateUser(e) : handleAddUser(e);
    } else {
      setError("Please fill in all user details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      <strong>{editingUser ? "Edit User" : "Add a New User"}</strong>

      <input
        type="text"
        placeholder="First Name"
        className="Title"
        value={newUser?.first_name || ""}
        onChange={(e) =>
          setNewUser((prev) => ({ ...prev, first_name: e.target.value }))
        }
      />

      <input
        type="text"
        placeholder="Last Name"
        className="Title"
        value={newUser?.last_name || ""}
        onChange={(e) =>
          setNewUser((prev) => ({ ...prev, last_name: e.target.value }))
        }
      />

      <input
        type="email"
        placeholder="Email"
        className="Title"
        value={newUser?.email || ""}
        onChange={(e) =>
          setNewUser((prev) => ({ ...prev, email: e.target.value }))
        }
      />

      <button className="green-button" type="submit">
        {editingUser ? "Update User" : "Add User"}
      </button>

      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default UserForm;
