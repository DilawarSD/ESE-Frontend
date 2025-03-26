import React from "react";

const UserForm = ({
  newUser,
  setNewUser,
  handleAddUser,
  handleUpdateUser,
  editingUser,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={editingUser ? handleUpdateUser : handleAddUser}
      className="ticket-form"
    >
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
    </form>
  );
};

export default UserForm;
