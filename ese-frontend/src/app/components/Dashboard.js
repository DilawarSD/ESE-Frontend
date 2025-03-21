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

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.email}!</h2>
          <button className="sign-out" onClick={handleSignOut}>
            Sign Out
          </button>
        </>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default Dashboard;
