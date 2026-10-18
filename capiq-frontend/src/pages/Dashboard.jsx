
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const initialCourses = [
  { id: 1, name: "Data Structures & Algorithms", category: "Computer Science", progress: 78, color: "violet", hours: 12.5, next: "Binary trees" },
  { id: 2, name: "Web Development", category: "Development", progress: 64, color: "blue", hours: 9.2, next: "React fundamentals" },
  { id: 3, name: "Database Management", category: "Computer Science", progress: 86, color: "orange", hours: 7.5, next: "SQL optimization" },
  { id: 4, name: "Machine Learning", category: "Artificial Intelligence", progress: 42, color: "green", hours: 5.8, next: "Model evaluation" },
];

const initialTasks = [
  { id: 1, title: "Complete DSA practice set", category: "Study", time: "Today · 10:30 AM", done: true },
  { id: 2, title: "Finish React mini project", category: "Project", time: "Today · 2:00 PM", done: false },
  { id: 3, title: "Update resume skills", category: "Career", time: "Today · 5:00 PM", done: false },
  { id: 4, title: "Review database notes", category: "Study", time: "Tomorrow · 9:00 AM", done: false },
];

const weeklyData = [
  { day: "MON", hours: 2.5 },
  { day: "TUE", hours: 4.2 },
  { day: "WED", hours: 3.2 },
  { day: "THU", hours: 5.4 },
  { day: "FRI", hours: 3.8 },
  { day: "SAT", hours: 6.1 },
  { day: "SUN", hours: 4.4 },
];

const initialProfile = {
  
  name: "Student",
  course: "B.Tech Computer Science",
  college: "",
  year: "2027",
  goal: 30,
};
function normalizeAcademicProfile(data, user = {}) {
  const p = data?.academicProfile ?? data?.profile ?? data ?? {};

  return {
    name: p.fullName ?? p.name ?? user.name ?? "Student",
    course:
      p.course ??
      p.degree ??
      p.courseName ??
      "Add your course",
    college:
      p.college ??
      p.collegeName ??
      p.institution ??
      "",
    year: String(
      p.graduationYear ??
      p.year ??
      p.expectedGraduationYear ??
      ""
    ),
    goal: 30,
  };
}
const navItems = [
  { id: "dashboard", icon: "◫", label: "Overview", section: "WORKSPACE" },
  { id: "profile", icon: "◎", label: "Academic profile" },
  { id: "courses", icon: "▤", label: "My courses" },
  { id: "career", icon: "↗", label: "Career & resume" },
  { id: "analytics", icon: "⌁", label: "Analytics" },
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function Icon({ children, className = "" }) {
  return <span className={`ui-icon ${className}`} aria-hidden="true">{children}</span>;
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function ProgressRing({ value, size = 76, label = "Complete" }) {
  const radius = 29;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="ring-wrap"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${value}% ${label}`}
    >
      <svg viewBox="0 0 76 76" className="ring-svg">
        <circle className="ring-track" cx="38" cy="38" r={radius} />
        <circle
          className="ring-value"
          cx="38"
          cy="38"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <span className="ring-label">{value}%</span>
    </div>
  );
}

function StudyChart({ data }) {
  const [period, setPeriod] = useState("week");
  const total = data.reduce((sum, item) => sum + item.hours, 0);
  const max = Math.max(7, ...data.map((item) => item.hours));
  const points = data
    .map((item, i) => `${36 + i * 55},${165 - (item.hours / max) * 115}`)
    .join(" ");

  return (
    <div className="chart-card glass-card">
      <div className="card-heading chart-heading">
        <div>
          <div className="eyebrow">YOUR CONSISTENCY</div>
          <h3>Study activity</h3>
          <p>Your learning rhythm, visualized.</p>
        </div>
        <div className="period-switch" aria-label="Chart period">
          <button
            type="button"
            className={period === "week" ? "selected" : ""}
            onClick={() => setPeriod("week")}
          >
            7 days
          </button>
          <button
            type="button"
            className={period === "month" ? "selected" : ""}
            onClick={() => setPeriod("month")}
          >
            Month
          </button>
        </div>
      </div>

      <div className="chart-summary">
        <div>
          <strong>{(period === "week" ? total : total * 4.1).toFixed(1)}<small>h</small></strong>
          <span>Total study time</span>
        </div>
        <div className="chart-change">
          <span className="trend-up">↗ 12.8%</span>
          <span>vs. previous period</span>
        </div>
      </div>

      <div className="line-chart">
        <div className="chart-y-labels">
          <span>7h</span>
          <span>5h</span>
          <span>3h</span>
          <span>0h</span>
        </div>

        <svg viewBox="0 0 380 190" preserveAspectRatio="none" role="img" aria-label="Study hours over the last seven days">
          <defs>
            <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8f75ff" stopOpacity=".28" />
              <stop offset="100%" stopColor="#8f75ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="chartLine" x1="0" x2="1">
              <stop offset="0%" stopColor="#8f75ff" />
              <stop offset="100%" stopColor="#52c8d9" />
            </linearGradient>
          </defs>

          {[50, 85, 120, 155].map((y) => (
            <line
              key={y}
              x1="25"
              y1={y}
              x2="365"
              y2={y}
              className="chart-gridline"
            />
          ))}

          <polygon
            points={`36,165 ${points} 366,165`}
            fill="url(#chartFill)"
          />

          <polyline
            points={points}
            fill="none"
            stroke="url(#chartLine)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="chart-line"
          />

          {data.map((item, i) => (
            <g key={item.day} className="chart-point">
              <circle
                cx={36 + i * 55}
                cy={165 - (item.hours / max) * 115}
                r="5"
                className="chart-point-outer"
              />
              <circle
                cx={36 + i * 55}
                cy={165 - (item.hours / max) * 115}
                r="2.3"
                className="chart-point-inner"
              />
              <title>{`${item.day}: ${item.hours} hours`}</title>
            </g>
          ))}
        </svg>

        <div className="chart-x-labels">
          {data.map((item) => <span key={item.day}>{item.day}</span>)}
        </div>
      </div>
      <div className="chart-footer">
        <span><i className="legend-dot" /> Study hours</span>
        <span>Daily learning time</span>
      </div>
    </div>
  );
}

function App({ onLogout }) {
    const routerNavigate = useNavigate();
  const [dark, setDark] = useState(() => readStorage("capiq-theme", false));
  const [page, setPage] = useState("dashboard");
  const [profile, setProfile] = useState(() => readStorage("capiq-profile", initialProfile));
  const [courses, setCourses] = useState(() => readStorage("capiq-courses", initialCourses));
  const [tasks, setTasks] = useState(() => readStorage("capiq-tasks", initialTasks));
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [toast, setToast] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [taskModal, setTaskModal] = useState(false);
  const [courseFilter, setCourseFilter] = useState("All");

  const [resume, setResume] = useState(() =>
    readStorage("capiq-resume", { projects: 2, skills: 5, experience: 1 })
  );

  const [goalInput, setGoalInput] = useState(String(profile.goal || 30));

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("capiq-theme", JSON.stringify(dark));
  }, [dark]);
  useEffect(() => {
  const token = localStorage.getItem("capiq_token");
  if (!token) return;

  let cancelled = false;

  async function loadAcademicProfile() {
    try {
      const response = await fetch(
        "/api/academic-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Profile request failed: ${response.status}`);
      }

      const data = await response.json();
      const user = readStorage("capiqUser", {});

      if (!cancelled) {
        setProfile((current) => ({
          ...current,
          ...normalizeAcademicProfile(data, user),
          goal: current.goal || 30,
        }));
      }
    } catch (error) {
      console.error("Could not load Dashboard profile:", error);
    }
  }

  loadAcademicProfile();

  return () => {
    cancelled = true;
  };
}, []);

  useEffect(() => {
    localStorage.setItem("capiq-profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("capiq-courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("capiq-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("capiq-resume", JSON.stringify(resume));
  }, [resume]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message) => setToast(message);

  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setProfileSaved(false);
  };

  const profileCompletion = useMemo(() => {
    const checks = [
      Boolean(profile.name?.trim()),
      Boolean(profile.course?.trim()),
      Boolean(profile.college?.trim()),
      Boolean(profile.year?.trim()),
      Boolean(profile.goal),
      courses.some((course) => course.progress > 0),
      tasks.some((task) => task.done),
      resume.skills > 0,
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile, courses, tasks, resume]);

  const completedTasks = tasks.filter((task) => task.done).length;
  const taskCompletion = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const averageProgress = courses.length
    ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)
    : 0;

  const totalHours = weeklyData.reduce((sum, item) => sum + item.hours, 0);
  const firstName = profile.name?.trim().split(/\s+/)[0] || "Student";
  const initials = (profile.name || "Student")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = `${course.name} ${course.category}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      courseFilter === "All" ||
      (courseFilter === "In progress" && course.progress > 0 && course.progress < 100) ||
      (courseFilter === "Completed" && course.progress === 100);

    return matchesSearch && matchesFilter;
  });

  const navigate = (nextPage) => {
    setPage(nextPage);
    setMobileSidebar(false);
    setShowNotifications(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) => task.id === id ? { ...task, done: !task.done } : task)
    );
  };

  const addTask = (event) => {
    event.preventDefault();
    const title = newTask.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title,
        category: "Personal",
        time: "Added just now",
        done: false,
      },
    ]);
    setNewTask("");
    setTaskModal(false);
    notify("Your new task has been added.");
  };

  const updateCourseProgress = (id, amount) => {
    setCourses((current) =>
      current.map((course) =>
        course.id === id
          ? { ...course, progress: Math.min(100, Math.max(0, course.progress + amount)) }
          : course
      )
    );
  };

  const resumeScore = Math.min(
    100,
    resume.skills * 8 + resume.projects * 12 + resume.experience * 20 + 12
  );

  const navTo = (item) => {
    if (item.id === "profile" || item.id === "dashboard" || item.id === "courses" || item.id === "career" || item.id === "analytics") {
      navigate(item.id);
    }
  };

  const renderSidebar = () => (
    <aside className={`sidebar ${mobileSidebar ? "sidebar-open" : ""}`}>
      <div className="sidebar-brand">
        <a href="#dashboard" className="brand" onClick={(e) => { e.preventDefault(); navigate("dashboard"); }}>
          <span className="brand-symbol">C</span>
          CapIQ<span className="brand-dot">.</span>
        </a>
        <button className="sidebar-close" onClick={() => setMobileSidebar(false)} aria-label="Close menu">×</button>
      </div>

      <div className="sidebar-label">YOUR WORKSPACE</div>

      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {index === 0 && <div className="nav-group-label">OVERVIEW</div>}
            {index === 1 && <div className="nav-group-label nav-group-spaced">LEARNING & GROWTH</div>}
            <button
              type="button"
              className={`nav-link ${page === item.id ? "nav-active" : ""}`}
              onClick={() => navTo(item)}
            >
              <Icon>{item.icon}</Icon>
              <span>{item.label}</span>
              {item.id === "courses" && (
                <span className="nav-count">{courses.length}</span>
              )}
              {page === item.id && <span className="nav-active-indicator" />}
            </button>
          </React.Fragment>
        ))}
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-goal">
        <div className="goal-orb">✦</div>
        <span className="eyebrow">WEEKLY MISSION</span>
        <h4>Make time for growth.</h4>
        <p>You're building habits that last beyond the classroom.</p>
        <div className="goal-progress-label">
          <span>{totalHours.toFixed(1)}h studied</span>
          <span>{profile.goal}h goal</span>
        </div>
        <div className="mini-progress">
          <span style={{ width: `${Math.min(100, (totalHours / Math.max(1, profile.goal)) * 100)}%` }} />
        </div>
      </div>

      <button className="sidebar-user" type="button" onClick={() => navigate("profile")}>
        <span className="user-avatar">{initials}</span>
        <span className="sidebar-user-info">
          <strong>{profile.name || "Student"}</strong>
          <small>{profile.course || "Student workspace"}</small>
        </span>
        <span className="user-menu-dots">···</span>
      </button>
    </aside>
  );

  return (
    <div className={`app-shell ${dark ? "dark-mode" : ""}`}>
      <div className="background-scene" aria-hidden="true">
        <div className="scene-grid" />
        <div className="scene-glow glow-purple" />
        <div className="scene-glow glow-blue" />
        <div className="scene-glow glow-pink" />
        <div className="scene-grain" />
      </div>

      {mobileSidebar && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      {renderSidebar()}

      <div className="main-column">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              type="button"
              onClick={() => setMobileSidebar(true)}
              aria-label="Open navigation"
            >
              ☰
            </button>
            <div className="breadcrumb">
              <span>Workspace</span>
              <span className="breadcrumb-slash">/</span>
              <strong>{navItems.find((item) => item.id === page)?.label || "Overview"}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="global-search">
              <Icon>⌕</Icon>
              <input
                type="search"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value) setPage("courses");
                }}
                aria-label="Search courses"
              />
              <kbd>⌘ K</kbd>
            </label>

            <button
              className="icon-button notification-button"
              type="button"
              onClick={() => setShowNotifications((value) => !value)}
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              ♧
              <span className="notification-dot" />
            </button>

            <div className="theme-control">
              <span className="theme-icon">{dark ? "☾" : "☀"}</span>
              <button
                type="button"
                className={`theme-switch ${dark ? "switch-on" : ""}`}
                onClick={() => setDark((value) => !value)}
                aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
                aria-pressed={dark}
              >
                <span />
              </button>
            </div>

           <button
  className="topbar-avatar"
  onClick={() => navigate("profile")}
  type="button"
  aria-label="Open profile"
>
  {initials}
</button>

<button
  type="button"
  className="logout-button"
  onClick={onLogout}
>
  ↪ Logout
</button>
          </div>

          {showNotifications && (
            <div className="notification-popover">
              <div className="notification-heading">
                <strong>Notifications</strong>
                <span className="live-label">LIVE</span>
              </div>
              <div className="notification-item">
                <span className="notification-icon purple-notice">✦</span>
                <div><strong>Keep your momentum</strong><p>You have {tasks.filter((task) => !task.done).length} tasks left on your list.</p></div>
              </div>
              <div className="notification-item">
                <span className="notification-icon blue-notice">↗</span>
                <div><strong>Career check-in</strong><p>Your resume readiness is {resumeScore}%.</p></div>
              </div>
              <button className="notification-action" onClick={() => { setShowNotifications(false); navigate("analytics"); }}>
                View your progress →
              </button>
            </div>
          )}
        </header>

        <main className="main-content" key={page}>
          {page === "dashboard" && (
            <>
              <section className="hero-section">
                <div className="hero-copy">
                  <div className="hero-greeting">
                    <span className="live-dot" />
                    YOUR STUDENT WORKSPACE
                  </div>
                  <h1>
                    Good to see you, <span>{firstName}.</span>
                  </h1>
                  <p>Your ambition has a place to grow. Here's your progress at a glance.</p>
                  <div className="hero-actions">
                    <button className="primary-button" onClick={() => navigate("profile")}>
                      Continue your journey <span>↗</span>
                    </button>
                    <button className="secondary-button" onClick={() => navigate("analytics")}>
                      Explore analytics <span>⌁</span>
                    </button>
                  </div>
                </div>

                <div className="hero-visual" aria-label="Your learning journey">
                  <div className="hero-ring hero-ring-one" />
                  <div className="hero-ring hero-ring-two" />
                  <div className="hero-core">
                    <span>✳</span>
                    <strong>{averageProgress}%</strong>
                    <small>LEARNING<br />PROGRESS</small>
                  </div>
                  <div className="hero-float hero-float-top">
                    <span className="float-icon green-float">↗</span>
                    <span><strong>On your way</strong><small>Keep the streak alive</small></span>
                  </div>
                  <div className="hero-float hero-float-bottom">
                    <span className="float-mini-avatars"><i>✦</i><i>↗</i><i>◎</i></span>
                    <span><strong>One step at a time</strong><small>Your future is in progress</small></span>
                  </div>
                  <span className="hero-spark spark-one">✦</span>
                  <span className="hero-spark spark-two">✧</span>
                </div>
              </section>

              <section className="stats-grid">
                <article className="stat-card glass-card">
                  <div className="stat-top">
                    <span className="stat-icon stat-violet"><Icon>◉</Icon></span>
                    <span className="stat-trend">↗ Active</span>
                  </div>
                  <div className="stat-label">PROFILE COMPLETION</div>
                  <div className="stat-number">{profileCompletion}<small>%</small></div>
                  <div className="stat-progress"><span style={{ width: `${profileCompletion}%` }} /></div>
                  <div className="stat-foot">Build your academic identity</div>
                </article>

                <article className="stat-card glass-card">
                  <div className="stat-top">
                    <span className="stat-icon stat-blue"><Icon>◷</Icon></span>
                    <span className="stat-trend">This week</span>
                  </div>
                  <div className="stat-label">FOCUSED STUDY TIME</div>
                  <div className="stat-number">{totalHours.toFixed(1)}<small>h</small></div>
                  <div className="stat-sparkline">
                    {[32, 52, 41, 68, 49, 82, 61, 92, 75, 100, 72, 86].map((height, index) => (
                      <span key={index} style={{ height: `${height}%` }} />
                    ))}
                  </div>
                  <div className="stat-foot">Time invested in your future</div>
                </article>

                <article className="stat-card glass-card">
                  <div className="stat-top">
                    <span className="stat-icon stat-orange"><Icon>▤</Icon></span>
                    <span className="stat-trend">{courses.length} enrolled</span>
                  </div>
                  <div className="stat-label">ACTIVE LEARNING PATHS</div>
                  <div className="stat-number">{courses.filter((course) => course.progress < 100).length}<small> courses</small></div>
                  <div className="stat-mini-dots">
                    {courses.map((course) => <span key={course.id} className={`dot-${course.color}`} />)}
                    <span className="dots-label">Across your curriculum</span>
                  </div>
                  <div className="stat-foot">Skills grow with every session</div>
                </article>

                <article className="stat-card glass-card">
                  <div className="stat-top">
                    <span className="stat-icon stat-green"><Icon>✓</Icon></span>
                    <span className="stat-trend">{taskCompletion}% done</span>
                  </div>
                  <div className="stat-label">TASKS COMPLETED</div>
                  <div className="stat-number">{completedTasks}<small>/{tasks.length}</small></div>
                  <div className="stat-progress green-progress"><span style={{ width: `${taskCompletion}%` }} /></div>
                  <div className="stat-foot">Small wins add up</div>
                </article>
              </section>

              <section className="analytics-grid">
                <StudyChart data={weeklyData} />

                <article className="focus-card glass-card">
                  <div className="card-heading">
                    <div>
                      <div className="eyebrow">AIM WITH INTENTION</div>
                      <h3>Your weekly goal</h3>
                      <p>Progress is built one session at a time.</p>
                    </div>
                    <span className="focus-icon">✳</span>
                  </div>

                  <div className="goal-display">
                    <ProgressRing value={Math.min(100, Math.round((totalHours / Math.max(1, profile.goal)) * 100))} size={112} label="of weekly goal" />
                    <div>
                      <strong>{totalHours.toFixed(1)} <small>hrs</small></strong>
                      <span>out of {profile.goal} hours</span>
                      <span className="goal-remaining">
                        {Math.max(0, profile.goal - totalHours).toFixed(1)}h left to goal
                      </span>
                    </div>
                  </div>

                  <label className="goal-input-label" htmlFor="weekly-goal">Set your weekly target</label>
                  <div className="goal-input-row">
                    <input
                      id="weekly-goal"
                      type="number"
                      min="1"
                      max="100"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                    />
                    <span>hours / week</span>
                    <button
                      type="button"
                      className="small-save-button"
                      onClick={() => {
                        const value = Number(goalInput);
                        if (!Number.isFinite(value) || value < 1 || value > 100) {
                          notify("Choose a weekly goal between 1 and 100 hours.");
                          return;
                        }
                        updateProfile("goal", value);
                        notify("Weekly study goal updated.");
                      }}
                    >
                      Apply
                    </button>
                  </div>

                  <div className="focus-quote">
                    <span>“</span>
                    <p>Consistency beats intensity. Show up for yourself.</p>
                  </div>
                </article>
              </section>

              <section className="courses-section">
                <SectionHeading
                  eyebrow="KEEP MOVING FORWARD"
                  title="Your learning paths"
                  description="Pick up where curiosity left off."
                  action={<button className="text-button" onClick={() => navigate("courses")}>All courses <span>→</span></button>}
                />

                <div className="course-grid">
                  {courses.slice(0, 3).map((course, index) => (
                    <article className={`course-card glass-card course-${course.color}`} key={course.id} style={{ "--delay": `${index * 90}ms` }}>
                      <div className="course-top">
                        <span className={`course-icon course-icon-${course.color}`}>
                          {["⌘", "⌁", "▤", "✳"][index % 4]}
                        </span>
                        <span className="course-category">{course.category}</span>
                        <button
                          type="button"
                          className="course-more"
                          onClick={() => notify(`${course.name}: ${course.progress}% complete.`)}
                          aria-label={`Details for ${course.name}`}
                        >
                          ···
                        </button>
                      </div>

                      <h3>{course.name}</h3>
                      <p className="course-next">NEXT UP <span>·</span> {course.next}</p>

                      <div className="course-progress-head">
                        <span>Course progress</span>
                        <strong>{course.progress}%</strong>
                      </div>
                      <div className="course-progress">
                        <span style={{ width: `${course.progress}%` }} />
                      </div>

                      <div className="course-footer">
                        <span><Icon>◷</Icon> {course.hours}h invested</span>
                        <button onClick={() => navigate("courses")} type="button">Continue ↗</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="bottom-grid">
                <article className="tasks-card glass-card">
                  <div className="card-heading">
                    <div>
                      <div className="eyebrow">YOUR NEXT MOVES</div>
                      <h3>Today's priorities</h3>
                      <p>A little progress goes a long way.</p>
                    </div>
                    <button className="add-task-button" type="button" onClick={() => setTaskModal(true)} aria-label="Add a task">+</button>
                  </div>

                  <div className="task-list">
                    {(showAllTasks ? tasks : tasks.slice(0, 4)).map((task) => (
                      <label className={`task-row ${task.done ? "task-completed" : ""}`} key={task.id}>
                        <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
                        <span className="custom-checkbox">{task.done ? "✓" : ""}</span>
                        <span className="task-copy">
                          <strong>{task.title}</strong>
                          <small><span className={`task-category category-${task.category.toLowerCase()}`}>{task.category}</span> <span>·</span> {task.time}</small>
                        </span>
                        <span className="task-arrow">{task.done ? "✓" : "↗"}</span>
                      </label>
                    ))}
                  </div>
                  {tasks.length > 4 && (
                    <button className="view-tasks-button" type="button" onClick={() => setShowAllTasks((value) => !value)}>
                      {showAllTasks ? "Show less ↑" : `View all ${tasks.length} tasks →`}
                    </button>
                  )}
                </article>

                <article className="career-card">
                  <div className="career-glow" />
                  <div className="career-content">
                    <span className="career-badge"><span /> CAREER MOMENTUM</span>
                    <h3>Your next opportunity starts with <span>preparation.</span></h3>
                    <p>Turn your projects, skills, and experience into a story worth sharing.</p>
                    <div className="career-score">
                      <ProgressRing value={resumeScore} size={80} label="resume readiness" />
                      <div><strong>{resumeScore}% ready</strong><small>Resume readiness estimate</small></div>
                    </div>
                    <button className="career-button" onClick={() => navigate("career")} type="button">
                      Open career studio <span>↗</span>
                    </button>
                  </div>
                  <div className="career-decoration" aria-hidden="true">
                    <div className="career-doc">
                      <span />
                      <span />
                      <span />
                      <div />
                      <div />
                      <div />
                    </div>
                    <span className="career-star star-a">✦</span>
                    <span className="career-star star-b">✧</span>
                  </div>
                </article>
              </section>
            </>
          )}

          {page === "profile" && (
            <section className="page-view">
              <SectionHeading
                eyebrow="YOUR STORY, YOUR WAY"
                title="Academic profile"
                description="A living snapshot of who you are and where you're headed."
              />
              <div className="profile-layout">
                <article className="profile-editor glass-card">
                  <div className="profile-cover">
                    <div className="profile-cover-orb" />
                    <span className="profile-cover-label">STUDENT IDENTITY</span>
                    <div className="large-profile-avatar">{initials}</div>
                  </div>
                  <div className="profile-form-content">
                    <div className="profile-name-row">
                      <div><h3>{profile.name || "Your name"}</h3><p>{profile.course || "Add your course"} · Class of {profile.year}</p></div>
                      <span className="profile-live-status"><i /> Active profile</span>
                    </div>

                    <div className="profile-form-grid">
                      <label className="field"><span>Full name</span><input value={profile.name} onChange={(e) => updateProfile("name", e.target.value)} placeholder="Your full name" /></label>
                      <label className="field"><span>Course / Degree</span><input value={profile.course} onChange={(e) => updateProfile("course", e.target.value)} placeholder="B.Tech Computer Science" /></label>
                      <label className="field"><span>College / University</span><input value={profile.college} onChange={(e) => updateProfile("college", e.target.value)} placeholder="Your institution" /></label>
                      <label className="field"><span>Graduation year</span><select value={profile.year} onChange={(e) => updateProfile("year", e.target.value)}>{Array.from({ length: 10 }, (_, i) => 2025 + i).map((year) => <option key={year} value={String(year)}>{year}</option>)}</select></label>
                    </div>

                    <div className="profile-save-row">
                      <span>Changes save locally in your browser.</span>
                      <button className="primary-button" type="button" onClick={() => { localStorage.setItem("capiq-profile", JSON.stringify(profile)); setProfileSaved(true); notify("Academic profile saved."); }}>
                        {profileSaved ? "✓ Saved" : "Save profile"} <span>↗</span>
                      </button>
                    </div>
                  </div>
                </article>

                <aside className="profile-side-column">
                  <article className="glass-card profile-progress-card">
                    <div className="eyebrow">YOUR PROFILE HEALTH</div>
                    <ProgressRing value={profileCompletion} size={100} />
                    <h3>{profileCompletion >= 80 ? "Looking good!" : "Keep building."}</h3>
                    <p>Add your institution and explore your courses to create a more complete academic identity.</p>
                    <div className="profile-mini-progress"><span style={{ width: `${profileCompletion}%` }} /></div>
                  </article>
                  <article className="glass-card profile-tip-card">
                    <span>✦</span><h3>Make it yours</h3>
                    <p>A clear academic profile helps you keep your education and career goals organized in one place.</p>
                  </article>
                </aside>
              </div>
            </section>
          )}

          {page === "courses" && (
            <section className="page-view">
              <SectionHeading
                eyebrow="LEARN SOMETHING EVERY DAY"
                title="Your learning paths"
                description="Track your learning, explore your next lesson, and keep moving forward."
                action={<span className="course-total-badge">{courses.length} courses</span>}
              />
              <div className="course-controls glass-card">
                <div className="course-filter-tabs">
                  {["All", "In progress", "Completed"].map((filter) => (
                    <button key={filter} className={courseFilter === filter ? "selected" : ""} onClick={() => setCourseFilter(filter)} type="button">
                      {filter}
                    </button>
                  ))}
                </div>
                <span className="course-results">{filteredCourses.length} learning paths</span>
              </div>

              {filteredCourses.length ? (
                <div className="all-courses-grid">
                  {filteredCourses.map((course, index) => (
                    <article className={`course-card glass-card course-${course.color}`} key={course.id} style={{ "--delay": `${index * 60}ms` }}>
                      <div className="course-top">
                        <span className={`course-icon course-icon-${course.color}`}>✧</span>
                        <span className="course-category">{course.category}</span>
                        <span className="course-percent-pill">{course.progress}%</span>
                      </div>
                      <h3>{course.name}</h3>
                      <p className="course-next">NEXT UP <span>·</span> {course.next}</p>
                      <div className="course-progress-head"><span>Course progress</span><strong>{course.progress}%</strong></div>
                      <div className="course-progress"><span style={{ width: `${course.progress}%` }} /></div>
                      <div className="course-footer">
                        <span><Icon>◷</Icon> {course.hours}h invested</span>
                        <button type="button" onClick={() => updateCourseProgress(course.id, 5)}>
                          {course.progress === 100 ? "Completed ✓" : "Log progress +5%"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state glass-card"><span>⌕</span><h3>No courses found</h3><p>Try a different search or filter.</p><button className="secondary-button" onClick={() => { setSearch(""); setCourseFilter("All"); }}>Clear filters</button></div>
              )}
            </section>
          )}

          {page === "career" && (
            <section className="page-view">
              <SectionHeading
                eyebrow="YOUR FUTURE, IN PROGRESS"
                title="Career studio"
                description="Bring your skills, projects, and experience together for your next opportunity."
              />
              <div className="career-overview-grid">
                <article className="career-score-card glass-card">
                  <div className="eyebrow">RESUME READINESS</div>
                  <div className="career-big-score"><ProgressRing value={resumeScore} size={116} /><div><strong>{resumeScore}%</strong><span>Readiness estimate</span></div></div>
                  <p>This score reflects the career information you've tracked in your workspace, not an evaluation by an employer.</p>
                </article>
                {[
                  { key: "skills", title: "Skills to showcase", description: "Technical and transferable skills", icon: "✧", color: "violet" },
                  { key: "projects", title: "Projects to highlight", description: "Work that demonstrates your ability", icon: "⌘", color: "blue" },
                  { key: "experience", title: "Experience entries", description: "Internships, volunteering, and work", icon: "↗", color: "orange" },
                ].map((item) => (
                  <article className="career-metric glass-card" key={item.key}>
                    <span className={`stat-icon stat-${item.color}`}><Icon>{item.icon}</Icon></span>
                    <div className="stat-label">{item.title.toUpperCase()}</div>
                    <strong>{resume[item.key]}</strong>
                    <p>{item.description}</p>
                    <div className="career-metric-actions">
                      <button type="button" onClick={() => setResume((current) => ({ ...current, [item.key]: Math.max(0, current[item.key] - 1) }))}>−</button>
                      <span>Update count</span>
                      <button type="button" onClick={() => setResume((current) => ({ ...current, [item.key]: current[item.key] + 1 }))}>+</button>
                    </div>
                  </article>
                ))}
              </div>

              <article className="career-roadmap glass-card">
                <div className="eyebrow">YOUR NEXT CHAPTER</div>
                <h3>A practical path to career readiness</h3>
                <div className="roadmap-steps">
                  {[
                    ["01", "Build your foundation", "Track your technical and transferable skills.", resume.skills > 0],
                    ["02", "Show what you've built", "Add projects with outcomes and useful context.", resume.projects > 0],
                    ["03", "Tell your story", "Bring your experience together into a clear resume.", resume.experience > 0],
                  ].map(([number, title, description, done]) => (
                    <div className="roadmap-step" key={number}>
                      <span className={`roadmap-number ${done ? "roadmap-done" : ""}`}>{done ? "✓" : number}</span>
                      <div><strong>{title}</strong><p>{description}</p></div>
                      <span className={`roadmap-status ${done ? "done" : ""}`}>{done ? "In progress" : "Next step"}</span>
                    </div>
                  ))}
                </div>
                <div className="career-roadmap-actions">
  <button
    className="primary-button"
    type="button"
    onClick={() => routerNavigate("/resume")}
  >
    Open Resume Builder ↗
  </button>

  <button
    className="secondary-button"
    type="button"
    onClick={() =>
      notify("Your career checklist is ready to work through.")
    }
  >
    Continue career checklist
  </button>
</div>
              </article>
            </section>
          )}

          {page === "analytics" && (
            <section className="page-view">
              <SectionHeading
                eyebrow="PROGRESS, WITH PERSPECTIVE"
                title="Your analytics"
                description="Understand your study habits, learning progress, and personal goals."
              />
              <div className="analytics-summary-grid">
                <article className="glass-card analytics-summary"><span className="stat-icon stat-violet">◷</span><span>WEEKLY STUDY HOURS</span><strong>{totalHours.toFixed(1)}h</strong><small>Based on sample activity data</small></article>
                <article className="glass-card analytics-summary"><span className="stat-icon stat-blue">⌁</span><span>AVERAGE COURSE PROGRESS</span><strong>{averageProgress}%</strong><small>Across {courses.length} learning paths</small></article>
                <article className="glass-card analytics-summary"><span className="stat-icon stat-green">✓</span><span>TASK COMPLETION</span><strong>{taskCompletion}%</strong><small>{completedTasks} of {tasks.length} tasks completed</small></article>
              </div>
              <section className="analytics-grid analytics-page-chart">
                <StudyChart data={weeklyData} />
                <article className="glass-card focus-card">
                  <div className="eyebrow">LEARNING SNAPSHOT</div>
                  <h3>Course progress</h3>
                  <p>See where your learning time is going.</p>
                  <div className="analytics-course-list">
                    {courses.map((course) => (
                      <div className="analytics-course-row" key={course.id}>
                        <div><span>{course.name}</span><strong>{course.progress}%</strong></div>
                        <div className="course-progress"><span style={{ width: `${course.progress}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
              <article className="glass-card analytics-insight">
                <span className="insight-icon">✦</span>
                <div><div className="eyebrow">A USEFUL OBSERVATION</div><h3>Your progress is more than a number.</h3><p>Your current sample data shows a {totalHours.toFixed(1)}-hour study week. Use the weekly target to set a realistic next goal, then track actual study sessions as you complete them.</p></div>
              </article>
            </section>
          )}

          <footer className="main-footer">
            <span><span className="footer-brand-mini">C</span> CapIQ <span className="footer-separator">/</span> Student workspace</span>
            <span>Built around your next chapter <span className="footer-heart">♥</span></span>
            <button type="button" onClick={() => notify("Your workspace data is stored locally in this browser.")}>Privacy & data</button>
          </footer>
        </main>
      </div>

      {taskModal && (
        <div className="modal-backdrop" onClick={() => setTaskModal(false)}>
          <section className="task-modal glass-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
            <button className="modal-close" onClick={() => setTaskModal(false)} type="button" aria-label="Close">×</button>
            <div className="modal-icon">✦</div>
            <div className="eyebrow">MAKE IT HAPPEN</div>
            <h3 id="task-modal-title">Add a priority</h3>
            <p>One small action can move your day forward.</p>
            <form onSubmit={addTask}>
              <label className="field"><span>What would you like to do?</span><input autoFocus value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="e.g. Practice JavaScript for 30 minutes" maxLength={100} required /></label>
              <button className="primary-button modal-submit" type="submit">Add to my list ↗</button>
            </form>
          </section>
        </div>
      )}

      {toast && <div className="toast-message" role="status"><span>✓</span>{toast}</div>}
    </div>
  );
}

export default App;
