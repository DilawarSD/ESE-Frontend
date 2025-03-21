import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");

  // Handle Sign In and Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    setMessage(
      result.error
        ? result.error.message
        : isSignUp
        ? "Check your email for confirmation!"
        : "Signed in successfully!"
    );

    if (!isSignUp && !result.error) {
      window.location.href = "/taskmanagement";
    }
  };

  return (
    <div>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <p>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
