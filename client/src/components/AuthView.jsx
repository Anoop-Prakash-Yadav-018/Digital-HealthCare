import React from "react";

export default function AuthView({
  authMode,
  authForm,
  setAuthForm,
  registerForm,
  setRegisterForm,
  busyAction,
  feedback,
  switchAuthMode,
  submitLogin,
  submitRegister,
}) {
  return (
    <main>
      <section className="auth-shell">
        <article className="auth-panel">
          <p className="eyebrow">Secure access</p>
          <h1 className="auth-title">Digital HealthCare</h1>
          <p className="auth-copy">
            Sign in as a patient, doctor, or admin to access records, medicine intelligence, and hospital operations.
          </p>

          {feedback.message && <div className={`notice ${feedback.type === "error" ? "notice-error" : ""}`}>{feedback.message}</div>}

          <div className="auth-switch">
            <button className={`tab ${authMode === "login" ? "active" : ""}`} onClick={() => switchAuthMode("login")} type="button">
              Login
            </button>
            <button className={`tab ${authMode === "register" ? "active" : ""}`} onClick={() => switchAuthMode("register")} type="button">
              Register
            </button>
          </div>

          {authMode === "login" ? (
            <form className="auth-form" onSubmit={submitLogin}>
              <label>
                Email
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                  required
                />
              </label>
              <button className="primary-action" disabled={busyAction === "login"} type="submit">
                {busyAction === "login" ? "Signing in..." : "Login"}
              </button>
              <p className="auth-hint">Seeded accounts: `admin@digitalhealthcare.local`, `doctor@digitalhealthcare.local`, `patient@digitalhealthcare.local`.</p>
            </form>
          ) : (
            <form className="auth-form" onSubmit={submitRegister}>
              <label>
                Full Name
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                  required
                />
              </label>
              <div className="form-row">
                <label>
                  Age
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={registerForm.patientProfile.age}
                    onChange={(event) =>
                      setRegisterForm({
                        ...registerForm,
                        patientProfile: { ...registerForm.patientProfile, age: event.target.value },
                      })
                    }
                    required
                  />
                </label>
                <label>
                  Gender
                  <select
                    value={registerForm.patientProfile.gender}
                    onChange={(event) =>
                      setRegisterForm({
                        ...registerForm,
                        patientProfile: { ...registerForm.patientProfile, gender: event.target.value },
                      })
                    }
                    required
                  >
                    <option value="">Select</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>
              <label>
                City
                <input
                  type="text"
                  value={registerForm.patientProfile.city}
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,
                      patientProfile: { ...registerForm.patientProfile, city: event.target.value },
                    })
                  }
                  required
                />
              </label>
              <button className="primary-action" disabled={busyAction === "register"} type="submit">
                {busyAction === "register" ? "Creating account..." : "Create Patient Account"}
              </button>
            </form>
          )}
        </article>
      </section>
    </main>
  );
}
