
const ACHIEVEMENTS_API_URL = "/api/achievements";
import React, { useEffect, useMemo, useState } from "react";
import "./AcademicProfile.css";

const API_URL = "/api/academic-profile";

const initialProfile = {
  name: "RICKY",
  email: "student@example.com",
  phone: "8365491254",
  course: "B.Tech",
  college: "SAPTHAGIRI NPS UNIVERSITY",
  year: "2027",
  about: "ntgh",
  skills: ["Communication", "Teamwork"],
  achievements: [],
};

const defaultAchievements = [
  "Academic Excellence",
  "Hackathon Participant",
  "Leadership",
];

function App() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("academic-profile");
      return saved
        ? { ...initialProfile, ...JSON.parse(saved) }
        : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [newSkill, setNewSkill] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");
  const [showAchievements, setShowAchievements] = useState(true);

  // Load the academic profile from the backend.
  useEffect(() => {
    const token = localStorage.getItem("capiq_token");

    if (!token) return;

    fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 404) return null;

        if (!response.ok) {
          throw new Error("Could not load academic profile");
        }

        return response.json();
      })
      .then((data) => {
        if (!data) return;

        const backendProfile = {
          name: data.profileName ?? initialProfile.name,
          email: data.email ?? initialProfile.email,
          phone: data.phone ?? initialProfile.phone,
          about: data.about ?? initialProfile.about,
          college: data.collegeName ?? initialProfile.college,
          course: data.degree ?? initialProfile.course,
          year: String(
            data.graduationYear ?? initialProfile.year
          ),
        };

        setProfile((prev) => ({
          ...prev,
          ...backendProfile,
        }));
      })
      .catch((error) => console.error(error));
  }, []);

  const update = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const completion = useMemo(() => {
    const checks = [
      profile.name.trim(),
      profile.email.trim(),
      profile.phone.trim(),
      profile.course.trim(),
      profile.college.trim(),
      profile.year.trim(),
      profile.about.trim(),
      profile.skills.length > 0,
      profile.achievements.length > 0,
    ];

    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100
    );
  }, [profile]);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  // Save the mapped frontend fields to the backend.
  const saveProfile = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("capiq_token");

    if (!token) {
      notify("Please log in again to save your profile.");
      return;
    }

    const payload = {
      profileName: profile.name,
      email: profile.email,
      phone: profile.phone,
      about: profile.about,
      collegeName: profile.college,
      degree: profile.course,
      graduationYear: profile.year
        ? Number(profile.year)
        : null,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401 || response.status === 403
            ? "Session expired. Please log in again."
            : "Could not save your profile."
        );
      }

      const data = await response.json();

      const updatedProfile = {
        ...profile,
        name: data.profileName ?? profile.name,
        email: data.email ?? profile.email,
        phone: data.phone ?? profile.phone,
        about: data.about ?? profile.about,
        college: data.collegeName ?? profile.college,
        course: data.degree ?? profile.course,
        year: String(
          data.graduationYear ?? profile.year
        ),
      };

      setProfile(updatedProfile);

      // Keep the complete frontend profile locally,
      // including skills and achievements.
      localStorage.setItem(
        "academic-profile",
        JSON.stringify(updatedProfile)
      );

      setSaved(true);
      notify("Your academic profile has been saved!");
    } catch (error) {
      console.error(error);
      notify(error.message || "Unable to connect to the backend.");
    }
  };

  const addSkill = (event) => {
    event?.preventDefault();
    const skill = newSkill.trim();

    if (
      skill &&
      !profile.skills.some(
        (existing) => existing.toLowerCase() === skill.toLowerCase()
      )
    ) {
      update("skills", [...profile.skills, skill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    update(
      "skills",
      profile.skills.filter((item) => item !== skill)
    );
  };

  const addAchievement = (event) => {
    event?.preventDefault();
    const achievement = newAchievement.trim();

    if (
      achievement &&
      !profile.achievements.some(
        (item) => item.toLowerCase() === achievement.toLowerCase()
      )
    ) {
      update("achievements", [...profile.achievements, achievement]);
      setNewAchievement("");
    }
  };

  const toggleAchievement = (achievement) => {
    const exists = profile.achievements.includes(achievement);

    update(
      "achievements",
      exists
        ? profile.achievements.filter((item) => item !== achievement)
        : [...profile.achievements, achievement]
    );
  };

  const initials =
    profile.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "ST";

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="add-skill-form"></div>
      <div className="add-achievement-form"></div>

      <header className="topbar">
        <a
          className="brand"
          href="#home"
          onClick={() => setActiveTab("profile")}
          aria-label="CapIQ home"
        >
          <span className="brand-symbol">C</span>
          CapIQ<span className="brand-dot">.</span>
        </a>

        <div className="topbar-right">
          <span className="status-label">
            <span className="status-dot" />
            STUDENT PORTAL
          </span>

          <button
            className="theme-toggle"
            type="button"
            onClick={() => setDark((value) => !value)}
            aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
            title={`Switch to ${dark ? "light" : "dark"} mode`}
          >
            <span>{dark ? "☀" : "☾"}</span>
            <span className="toggle-track">
              <span className="toggle-thumb" />
            </span>
          </button>

          <button
            type="button"
            className="add-button"
            disabled={!newSkill.trim()}
            onClick={() => addSkill()}
          >
            + Add skill
          </button>

          <button
            type="button"
            disabled={!newAchievement.trim()}
            onClick={() => addAchievement()}
            aria-label="Add achievement"
          >
            +
          </button>

          <button
            className="mini-avatar"
            type="button"
            onClick={() => setActiveTab("profile")}
            title="Go to profile"
          >
            {initials}
          </button>
        </div>
      </header>

      <main className="dashboard" id="home">
        <section className="welcome-section">
          <div className="welcome-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              YOUR PERSONAL SPACE
            </div>

            <h1>
              Build your <span className="gradient-text">story.</span>
            </h1>

            <p className="welcome-description">
              Your journey, your achievements, your future. Make your
              academic profile truly yours.
            </p>

            <div className="welcome-meta">
              <span className="meta-icon">✦</span>
              Everything you need to showcase your potential.
            </div>
          </div>

          <div className="welcome-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-card">
              <div className="art-card-top">
                <span className="art-dot" />
                <span className="art-dot" />
                <span className="art-dot" />
              </div>
              <div className="art-avatar">{initials}</div>
              <div className="art-line art-line-long" />
              <div className="art-line art-line-short" />
              <div className="art-bars">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="floating-chip chip-top">✦ Your potential</div>
            <div className="floating-chip chip-bottom">
              <span>✓</span> Keep growing
            </div>
          </div>
        </section>

        <nav className="page-tabs" aria-label="Dashboard navigation">
          <button
            className={activeTab === "profile" ? "page-tab active" : "page-tab"}
            onClick={() => setActiveTab("profile")}
            type="button"
          >
            <span>▤</span> My profile
          </button>
          <button
            className={
              activeTab === "achievements"
                ? "page-tab active"
                : "page-tab"
            }
            onClick={() => setActiveTab("achievements")}
            type="button"
          >
            <span>✧</span> Achievements
          </button>
        </nav>

        <section className="overview-grid">
          <article className="overview-card">
            <div className="overview-icon violet-icon">◉</div>
            <div>
              <p className="overview-label">PROFILE COMPLETION</p>
              <h2>{completion}%</h2>
              <p className="overview-note">
                {completion === 100
                  ? "Amazing! Everything is complete."
                  : "Every detail brings you closer."}
              </p>
            </div>
            <div
              className="progress-ring"
              style={{ "--progress": `${completion * 3.6}deg` }}
              aria-label={`${completion}% complete`}
              role="img"
            >
              <div>{completion}%</div>
            </div>
          </article>

          <article className="overview-card">
            <div className="overview-icon blue-icon">✧</div>
            <div>
              <p className="overview-label">SKILLS ADDED</p>
              <h2>{profile.skills.length.toString().padStart(2, "0")}</h2>
              <p className="overview-note">Your strengths, at a glance.</p>
            </div>
            <span className="overview-decoration">✳</span>
          </article>

          <article className="overview-card">
            <div className="overview-icon peach-icon">♜</div>
            <div>
              <p className="overview-label">ACHIEVEMENTS</p>
              <h2>
                {profile.achievements.length.toString().padStart(2, "0")}
              </h2>
              <p className="overview-note">Celebrate every milestone.</p>
            </div>
            <span className="overview-decoration">✦</span>
          </article>
        </section>

        {activeTab === "profile" ? (
          <section className="content-grid" key="profile">
            <form className="panel profile-panel" onSubmit={saveProfile}>
              <div className="panel-heading">
                <div>
                  <div className="section-kicker">LET'S GET PERSONAL</div>
                  <h2>Your academic profile</h2>
                  <p>Small details. Big opportunities.</p>
                </div>
                <div className="profile-avatar">{initials}</div>
              </div>

              <div className="form-section-title">
                <span className="section-number">01</span>
                Personal information
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>
                    Full name <span className="required">*</span>
                  </span>
                  <input
                    value={profile.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="field">
                  <span>
                    Email address <span className="required">*</span>
                  </span>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="field">
                  <span>Phone number</span>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 00000 00000"
                    autoComplete="tel"
                  />
                </label>

                <label className="field">
                  <span>Course / Degree</span>
                  <select
                    value={profile.course}
                    onChange={(e) => update("course", e.target.value)}
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.E.">B.E.</option>
                    <option value="B.Sc.">B.Sc.</option>
                    <option value="BCA">BCA</option>
                    <option value="BBA">BBA</option>
                    <option value="B.Com">B.Com</option>
                    <option value="BA">BA</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="field">
                  <span>College / University</span>
                  <input
                    value={profile.college}
                    onChange={(e) => update("college", e.target.value)}
                    placeholder="Your institution"
                    autoComplete="organization"
                  />
                </label>

                <label className="field">
                  <span>Graduation year</span>
                  <select
                    value={profile.year}
                    onChange={(e) => update("year", e.target.value)}
                  >
                    {Array.from({ length: 9 }, (_, i) => 2025 + i).map(
                      (year) => (
                        <option value={String(year)} key={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>

              <div className="form-section-title section-spaced">
                <span className="section-number">02</span>
                Tell your story
              </div>

              <label className="field">
                <span>About me</span>
                <textarea
                  value={profile.about}
                  onChange={(e) => update("about", e.target.value)}
                  placeholder="Introduce yourself, share your interests, goals, and what inspires you..."
                  rows={4}
                  maxLength={500}
                />
                <span className="character-count">
                  {profile.about.length}/500 characters
                </span>
              </label>

              <div className="form-section-title section-spaced">
                <span className="section-number">03</span>
                Skills & strengths
              </div>

              <div className="skill-list">
                {profile.skills.map((skill) => (
                  <span className="skill-chip" key={skill}>
                    <span className="skill-chip-dot" />
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      title={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {profile.skills.length === 0 && (
                  <p className="empty-hint">Add your first skill below.</p>
                )}
              </div>

              <form className="add-skill-form" onSubmit={addSkill}>
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. React, Leadership, Design"
                  aria-label="New skill"
                  maxLength={35}
                />
                <button
                  type="submit"
                  className="add-button"
                  disabled={!newSkill.trim()}
                >
                  + Add skill
                </button>
              </form>

              <div className="form-footer">
                <div className="save-caption">
                  <span className={saved ? "save-dot success" : "save-dot"} />
                  {saved
                    ? "All changes saved"
                    : "Your changes are ready to save"}
                </div>
                <button className="primary-button" type="submit">
                  {saved ? "✓ Saved" : "Save changes"}
                  {!saved && <span>↗</span>}
                </button>
              </div>
            </form>

            <aside className="sidebar">
              <article className="panel checklist-panel">
                <div className="side-heading">
                  <div>
                    <div className="section-kicker">YOUR PROGRESS</div>
                    <h3>Profile checklist</h3>
                  </div>
                  <span className="checklist-icon">✓</span>
                </div>

                <div className="checklist-progress">
                  <div
                    className="checklist-progress-fill"
                    style={{ width: `${completion}%` }}
                  />
                </div>

                {[
                  [
                    "Basic information",
                    Boolean(profile.name.trim() && profile.email.trim()),
                  ],
                  [
                    "Education details",
                    Boolean(
                      profile.course &&
                        profile.college.trim() &&
                        profile.year
                    ),
                  ],
                  ["About you", Boolean(profile.about.trim())],
                  ["Add achievements", profile.achievements.length > 0],
                  ["Show your skills", profile.skills.length > 0],
                ].map(([label, complete]) => (
                  <div className="checklist-row" key={label}>
                    <span
                      className={
                        complete ? "check-circle checked" : "check-circle"
                      }
                    >
                      {complete ? "✓" : ""}
                    </span>
                    <span className={complete ? "checklist-done" : ""}>
                      {label}
                    </span>
                    <span className="checklist-state">
                      {complete ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}

                <div className="tip-box">
                  <span className="tip-sparkle">✦</span>
                  <div>
                    <strong>A little tip</strong>
                    <p>
                      A complete profile helps tell a stronger story about you.
                    </p>
                  </div>
                </div>
              </article>

              <article className="panel achievements-panel">
                <button
                  type="button"
                  className="expand-heading"
                  onClick={() =>
                    setShowAchievements((value) => !value)
                  }
                  aria-expanded={showAchievements}
                >
                  <span className="achievement-heading-icon">✧</span>
                  <span>
                    <span className="section-kicker">MAKE IT COUNT</span>
                    <strong>Achievements</strong>
                  </span>
                  <span className="expand-chevron">
                    {showAchievements ? "−" : "+"}
                  </span>
                </button>

                {showAchievements && (
                  <div className="achievement-content">
                    <p className="sidebar-description">
                      Celebrate your milestones. Select any that apply to you.
                    </p>

                    {defaultAchievements.map((achievement) => {
                      const selected =
                        profile.achievements.includes(achievement);

                      return (
                        <button
                          type="button"
                          key={achievement}
                          className={`achievement-option ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() => toggleAchievement(achievement)}
                        >
                          <span className="achievement-option-icon">
                            {selected ? "✓" : "✧"}
                          </span>
                          {achievement}
                          <span className="achievement-option-check">
                            {selected ? "✓" : "+"}
                          </span>
                        </button>
                      );
                    })}

                    <form
                      className="add-achievement-form"
                      onSubmit={addAchievement}
                    >
                      <input
                        value={newAchievement}
                        onChange={(e) =>
                          setNewAchievement(e.target.value)
                        }
                        placeholder="Add your own achievement"
                        aria-label="New achievement"
                        maxLength={60}
                      />
                      <button
                        type="submit"
                        disabled={!newAchievement.trim()}
                        aria-label="Add achievement"
                      >
                        +
                      </button>
                    </form>

                    {profile.achievements
                      .filter(
                        (item) => !defaultAchievements.includes(item)
                      )
                      .map((achievement) => (
                        <div
                          className="custom-achievement"
                          key={achievement}
                        >
                          <span>✦ {achievement}</span>
                          <button
                            type="button"
                            onClick={() =>
                              toggleAchievement(achievement)
                            }
                            aria-label={`Remove ${achievement}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </article>

              <div className="privacy-note">
                <span>♧</span>
                <p>
                  <strong>Your space, your data.</strong>
                  <br />
                  This demo stores your profile in this browser only.
                </p>
              </div>
            </aside>
          </section>
        ) : (
          <section className="panel achievements-page" key="achievements">
            <div className="panel-heading">
              <div>
                <div className="section-kicker">EVERY WIN MATTERS</div>
                <h2>Your achievements</h2>
                <p>Every milestone is a part of your story.</p>
              </div>
              <div className="achievements-total">
                <span>✧</span>
                <strong>{profile.achievements.length}</strong>
                <small>milestones</small>
              </div>
            </div>

            <div className="achievement-page-grid">
              {defaultAchievements.map((achievement, index) => {
                const selected =
                  profile.achievements.includes(achievement);

                return (
                  <button
                    type="button"
                    className={`achievement-large-card ${
                      selected ? "selected" : ""
                    }`}
                    key={achievement}
                    onClick={() => toggleAchievement(achievement)}
                  >
                    <span
                      className={`large-achievement-icon achievement-color-${index}`}
                    >
                      {["✦", "⚡", "♜"][index]}
                    </span>
                    <span className="achievement-card-title">
                      {achievement}
                    </span>
                    <span className="achievement-card-description">
                      {
                        [
                          "Recognize your academic progress.",
                          "Celebrate innovation and collaboration.",
                          "Highlight your initiative and impact.",
                        ][index]
                      }
                    </span>
                    <span className="achievement-card-action">
                      {selected
                        ? "✓ Added to profile"
                        : "+ Add achievement"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="achievement-summary">
              <span>✧</span>
              <div>
                <strong>Your journey is uniquely yours.</strong>
                <p>
                  {profile.achievements.length
                    ? `You've recorded ${
                        profile.achievements.length
                      } achievement${
                        profile.achievements.length === 1 ? "" : "s"
                      }. Keep building your story!`
                    : "Start adding achievements to showcase your progress."}
                </p>
              </div>
              <button
                className="primary-button"
                type="button"
                onClick={() => setActiveTab("profile")}
              >
                Back to profile ↗
              </button>
            </div>
          </section>
        )}

        <footer className="page-footer">
          <a href="#home" className="footer-brand">
            CapIQ<span>.</span>
          </a>
          <span>
            Made for your next chapter{" "}
            <span className="footer-heart">♥</span>
          </span>
          <span>ACADEMIC PROFILE · 2026</span>
        </footer>
      </main>

      {toast && (
        <div className="toast-message" role="status">
          <span>✓</span> {toast}
        </div>
      )}
    </div>
  );
}

export default App;
