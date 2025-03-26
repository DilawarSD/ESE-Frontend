import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  const navigateToHome = () => {
    window.location.href = "/home";
  };

  const navigateToCreateTickets = () => {
    window.location.href = "/taskmanagement";
  };

  const navigateToUser = () => {
    window.location.href = "/user";
  };

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.email}!</h2>

          <div className="container">
            <button className="Home" onClick={navigateToHome}>
              Home
            </button>
            <button
              className="create-tickets"
              onClick={navigateToCreateTickets}
            >
              Create Tickets
            </button>
            <button className="sign-out" onClick={navigateToUser}>
              Users
            </button>
            <button className="sign-out" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default Dashboard;
