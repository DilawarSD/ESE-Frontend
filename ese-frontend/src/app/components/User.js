import React, { useState, useEffect } from "react";
import { getUsers } from "../../lib/server";

const User = ({ ticketId, handleAssignUser, assignedUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data.fetched || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <select
      value={assignedUserId || ""}
      onChange={(e) => handleAssignUser(ticketId, e.target.value)}
    >
      <option value="">Assign User</option>
      {users.length === 0 ? (
        <option disabled>No users available</option>
      ) : (
        users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.first_name} {user.last_name}
          </option>
        ))
      )}
    </select>
  );
};

export default User;
