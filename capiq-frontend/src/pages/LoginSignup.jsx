
import { useState } from "react";
import "./LoginSignup.css";

function LoginSignup({ onLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    if (isRegister && fullName.trim().length < 2) {
      setMessage("Please enter your full name.");
      return;
    }

    if (isRegister && password.length < 8) {
      setMessage("Your password must contain at least 8 characters.");
      return;
    }

    if (!isRegister && password.length < 8) {
      setMessage("Please enter a valid password.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister
        ? "/api/users"
        : "/api/auth/login";

      const body = isRegister
        ? {
            name: fullName.trim(),
            email: cleanEmail,
            password,
          }
        : {
            email: cleanEmail,
            password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("This email is already registered. Please log in.");
        }

        if (response.status === 401) {
          throw new Error("Incorrect email or password. Please try again.");
        }

        throw new Error(
          data.message ||
            data.error ||
            `Request failed (${response.status}). Please try again.`
        );
      }

      if (isRegister) {
        setIsRegister(false);
        setPassword("");
        setFullName("");
        setShowPassword(false);
        setMessage("Account created successfully! Please log in.");
        return;
      }

      if (!data.token) {
        throw new Error(
          "The server did not return a login token. Please try again."
        );
      }

      // Store the JWT for future authenticated API requests.
      localStorage.setItem("capiq_token", data.token);

      // Pass the authenticated user to the main application.
      if (typeof onLogin === "function") {
        onLogin({
          id: data.id,
          name: data.name,
          email: data.email,
          token: data.token,
        });
      } else {
        setMessage(
          "Login successful, but app navigation is not configured yet."
        );
      }
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.toLowerCase().includes("fetch")
      ) {
        setMessage(
          "Cannot connect to the backend. Make sure Spring Boot is running on port 8080."
        );
      } else {
        setMessage(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (register) => {
    setIsRegister(register);
    setMessage("");
    setShowPassword(false);
    setPassword("");
  };

  return (
    <main className={`auth-page ${darkMode ? "dark" : ""}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="auth-header">
        <a className="brand" href="#" aria-label="CapIQ home">
          Cap<span>I</span>Q<span className="brand-dot">.</span>
        </a>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
          type="button"
        >
          {darkMode ? "☀" : "☾"}
        </button>
      </header>

      <section className="auth-stage">
        <div className={`auth-card ${isRegister ? "register-mode" : ""}`}>
          {/* LOGIN FORM */}
          <div className="form-panel login-panel">
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-eyebrow">WELCOME BACK</div>

              <h1>
                Good to see
                <br />
                you <span>again.</span>
              </h1>

              <p className="form-subtitle">
                Pick up where your next chapter begins.
              </p>

              <label htmlFor="login-email">Email address</label>
              <div className="input-wrap">
                <span className="field-icon">✉</span>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <label htmlFor="login-password">Password</label>
              <div className="input-wrap">
                <span className="field-icon">♙</span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="form-options">
                <label className="remember-option">
                  <input type="checkbox" defaultChecked />
                  <span>Keep me signed in</span>
                </label>

                <button
                  type="button"
                  className="text-button"
                  onClick={() =>
                    setMessage(
                      "Password recovery is not configured yet. Please contact your administrator if you cannot log in."
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

              <button
                className="submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Log in to CapIQ"}{" "}
                {!loading && <span>↗</span>}
              </button>

              <div className="separator">
                <span>OR CONTINUE WITH</span>
              </div>

              <div className="social-buttons">
                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "Google authentication has not been configured yet."
                    )
                  }
                >
                  <b className="google-letter">G</b> Google
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "GitHub authentication has not been configured yet."
                    )
                  }
                >
                  <b>⌘</b> GitHub
                </button>
              </div>

              {message && (
                <p className="form-message" role="status" aria-live="polite">
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* REGISTRATION FORM */}
          <div className="form-panel register-panel">
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-eyebrow">START SOMETHING GREAT</div>

              <h1>
                Your future
                <br />
                looks <span>promising.</span>
              </h1>

              <p className="form-subtitle">
                Create your workspace. Your next step starts here.
              </p>

              <label htmlFor="register-name">Full name</label>
              <div className="input-wrap">
                <span className="field-icon">♙</span>
                <input
                  id="register-name"
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  minLength={2}
                />
              </div>

              <label htmlFor="register-email">Email address</label>
              <div className="input-wrap">
                <span className="field-icon">✉</span>
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <label htmlFor="register-password">Create password</label>
              <div className="input-wrap">
                <span className="field-icon">♙</span>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <label className="terms-option">
                <input type="checkbox" required />
                <span>
                  I agree to the <a href="#terms">terms</a> and{" "}
                  <a href="#privacy">privacy policy</a>.
                </span>
              </label>

              <button
                className="submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Create my account"}{" "}
                {!loading && <span>↗</span>}
              </button>

              <div className="separator">
                <span>OR SIGN UP WITH</span>
              </div>

              <div className="social-buttons">
                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "Google authentication has not been configured yet."
                    )
                  }
                >
                  <b className="google-letter">G</b> Google
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "GitHub authentication has not been configured yet."
                    )
                  }
                >
                  <b>⌘</b> GitHub
                </button>
              </div>

              {message && (
                <p className="form-message" role="status" aria-live="polite">
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* SLIDING PURPLE PANEL */}
          <div className="sliding-panel">
            <div className="orb orb-top" />
            <div className="orb orb-bottom" />
            <div className="panel-glow" />

            <div className="panel-content">
              <div className="panel-symbol">✧</div>

              <div className="panel-eyebrow">
                A LITTLE SPACE FOR BIG DREAMS
              </div>

              <div className="panel-copy">
                <h2>
                  Hello,
                  <br />
                  welcome!
                </h2>
                <p>
                  Make yourself at home.
                  <br />
                  There's a lot to look forward to.
                </p>
                <button
                  type="button"
                  className="panel-button"
                  onClick={() => switchMode(true)}
                >
                  Create account <span>↗</span>
                </button>
              </div>

              <div className="panel-copy panel-copy-back">
                <h2>
                  Welcome
                  <br />
                  back!
                </h2>
                <p>
                  Your next chapter awaits.
                  <br />
                  Let's make it happen.
                </p>
                <button
                  type="button"
                  className="panel-button"
                  onClick={() => switchMode(false)}
                >
                  Log in <span>↗</span>
                </button>
              </div>

              <div className="panel-footer">
                <span>✦</span> Your journey, your next chapter.
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="auth-footer">
        <span>✧</span> A focused space for your next step.
        <span className="footer-divider">·</span>
        Made for curious minds.
      </footer>
    </main>
  );
}

export default LoginSignup;
