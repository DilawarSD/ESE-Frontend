import Image from "next/image";

export default function Home() {
  return (
    <div className="TaskManagement">
      <h1 className="TaskManagement">Task Management</h1>

      {/* Sign-In Form */}
      <form className="form">
        <div className="flex flex-col">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input />
        </div>

        <a href="/taskmanagement" type="submit" className="button save">
          Log In
        </a>

        <p>
          Don't have an account?
          <a href="/taskmanagement" className="sign-up-link">
            Sign up
          </a>
        </p>
      </form>

      <footer className="footer">
        <a
          className="footer-link"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
