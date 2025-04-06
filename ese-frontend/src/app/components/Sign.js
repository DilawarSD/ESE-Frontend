import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) {
      setMessage(result.error.message);
    } else if (isSignUp) {
      if (result.data?.user?.identities?.length === 0) {
        setMessage("Account already exists. Please sign in.");
      } else {
        setMessage("Check your email for confirmation!");
      }
    } else {
      setMessage("Signed in successfully!");
    }

    if (!isSignUp && !result.error) {
      window.location.href = "/home";
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
        <br />
        <button type="submit" className="auth-button">
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>
      {message && <p className="auth-message">{message}</p>}
      <p className="auth-toggle">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="toggle-button"
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
