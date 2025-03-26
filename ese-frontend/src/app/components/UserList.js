import React from "react";

const UserList = ({ users, handleEditUser, handleDeleteUser }) => {
  return (
    <div className="user-list">
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li
              className="ticket-card"
              key={user.id ? user.id : `user-${index}`}
            >
              <strong>
                {user.first_name} {user.last_name}
              </strong>{" "}
              - {user.email}
              <button
                className="edit-button"
                onClick={() => handleEditUser(user)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
