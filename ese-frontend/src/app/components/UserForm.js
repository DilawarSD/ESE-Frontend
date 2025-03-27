import React, { useState } from "react";

const UserForm = ({
  newUser,
  setNewUser,
  handleAddUser,
  handleUpdateUser,
  editingUser,
}) => {
  // State to handle error message
  const [error, setError] = useState("");

  // Function to validate that all fields are filled
  const validateForm = () => {
    const { first_name, last_name, email } = newUser;
    return first_name && last_name && email;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Check if the form is valid
    if (validateForm()) {
      // If valid, proceed with the submission (either add or update)
      setError(""); // Clear any previous error message
      editingUser ? handleUpdateUser(e) : handleAddUser(e);
    } else {
      // If invalid, show an error message
      setError("Please fill in all user details.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      <strong>{editingUser ? "Edit User" : "Add a New User"}</strong>

      <input
        type="text"
        placeholder="First Name"
        className="Title"
        name="first_name"
        value={newUser.first_name}
        onChange={handleInputChange}
      />

      <input
        type="text"
        placeholder="Last Name"
        className="Title"
        name="last_name"
        value={newUser.last_name}
        onChange={handleInputChange}
      />

      <input
        type="email"
        placeholder="Email"
        className="Title"
        name="email"
        value={newUser.email}
        onChange={handleInputChange}
      />

      <button className="green-button" type="submit">
        {editingUser ? "Update User" : "Add User"}
      </button>

      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default UserForm;
