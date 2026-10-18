import "./Courses.css";
import { useEffect, useMemo, useState } from "react";

const initialCourses = [
  {
    id: 1,
    title: "React Fundamentals",
    category: "Development",
    level: "Beginner",
    duration: "6 hours",
    lessons: 18,
    icon: "⚛",
    color: "violet",
    description: "Build modern interfaces with components, props, hooks and state.",
    skills: ["React", "JavaScript", "UI Development"],
    progress: 65,
    featured: true,
  },
  {
    id: 2,
    title: "Java Programming",
    category: "Development",
    level: "Beginner",
    duration: "8 hours",
    lessons: 24,
    icon: "☕",
    color: "blue",
    description: "Master object-oriented programming and solve real coding problems.",
    skills: ["Java", "OOP", "Problem Solving"],
    progress: 30,
  },
  {
    id: 3,
    title: "UI/UX Essentials",
    category: "Design",
    level: "Beginner",
    duration: "4 hours",
    lessons: 12,
    icon: "✳",
    color: "pink",
    description: "Create intuitive experiences through wireframes and visual design.",
    skills: ["Figma", "Wireframes", "UX"],
    progress: 0,
    featured: true,
  },
  {
    id: 4,
    title: "Career Launchpad",
    category: "Career",
    level: "Intermediate",
    duration: "5 hours",
    lessons: 15,
    icon: "↗",
    color: "green",
    description: "Prepare for internships with portfolios, interviews and career skills.",
    skills: ["Interviews", "Portfolio", "Communication"],
    progress: 0,
  },
  {
    id: 5,
    title: "Python for Data Science",
    category: "Data Science",
    level: "Intermediate",
    duration: "10 hours",
    lessons: 30,
    icon: "⌘",
    color: "orange",
    description: "Explore Python, data analysis and your first practical datasets.",
    skills: ["Python", "Pandas", "Analytics"],
    progress: 15,
  },
  {
    id: 6,
    title: "Digital Marketing",
    category: "Business",
    level: "Beginner",
    duration: "3 hours",
    lessons: 10,
    icon: "◈",
    color: "cyan",
    description: "Learn content strategy, audience research and campaign basics.",
    skills: ["SEO", "Content", "Strategy"],
    progress: 0,
  },
];

const categories = [
  "All courses",
  "Development",
  "Design",
  "Data Science",
  "Career",
  "Business",
];

function App() {
  const [catalog, setCatalog] = useState(initialCourses);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All courses");
  const [activeTab, setActiveTab] = useState("Discover");
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("capiq-course-saved") || "[2]"); } catch { return [2]; }
  });
  const [startedIds, setStartedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("capiq-course-started") || "[1,2,5]"); } catch { return [1, 2, 5]; }
  });
  const [progressMap, setProgressMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem("capiq-course-progress") || "{}"); } catch { return {}; }
  });

  useEffect(() => {
    const token = localStorage.getItem("capiq_token");
    let cancelled = false;
    async function loadCourses() {
      try {
        const response = await fetch("/api/courses", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && Array.isArray(data) && data.length) setCatalog(data);
      } catch (error) {
        console.warn("Course API unavailable; using the bundled catalogue.", error);
      }
    }
    loadCourses();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { localStorage.setItem("capiq-course-saved", JSON.stringify(savedIds)); }, [savedIds]);
  useEffect(() => { localStorage.setItem("capiq-course-started", JSON.stringify(startedIds)); }, [startedIds]);
  useEffect(() => { localStorage.setItem("capiq-course-progress", JSON.stringify(progressMap)); }, [progressMap]);
  const [listView, setListView] = useState(false);
  const [notice, setNotice] = useState("");
  const [goal, setGoal] = useState(6);
  const [showGoalEditor, setShowGoalEditor] = useState(false);

  const courses = useMemo(
    () =>
      catalog.map((course) => ({
        ...course,
        progress: progressMap[course.id] ?? course.progress,
      })),
    [progressMap]
  );

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = [
        course.title,
        course.category,
        course.description,
        ...course.skills,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All courses" || course.category === category;

      const matchesTab =
        activeTab === "Discover" ||
        (activeTab === "My learning" && startedIds.includes(course.id)) ||
        (activeTab === "Saved" && savedIds.includes(course.id));

      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [courses, search, category, activeTab, startedIds, savedIds]);

  const completedCourses = courses.filter((course) => course.progress >= 100).length;
  const activeCourses = courses.filter(
    (course) => course.progress > 0 && course.progress < 100
  ).length;
  const overallProgress = Math.round(
    courses.reduce((sum, course) => sum + course.progress, 0) /
      courses.length
  );

  const completedLessons = courses.reduce(
    (sum, course) => sum + Math.round((course.lessons * course.progress) / 100),
    0
  );

  function showMessage(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function toggleSaved(id) {
    const alreadySaved = savedIds.includes(id);

    setSavedIds((previous) =>
      alreadySaved
        ? previous.filter((savedId) => savedId !== id)
        : [...previous, id]
    );

    showMessage(alreadySaved ? "Removed from saved courses" : "Course saved to your library");
  }

  function startCourse(course) {
    setStartedIds((previous) =>
      previous.includes(course.id) ? previous : [...previous, course.id]
    );

    const currentProgress = progressMap[course.id] ?? course.progress;

    if (currentProgress === 0) {
      setProgressMap((previous) => ({ ...previous, [course.id]: 5 }));
    }

    showMessage(
      currentProgress >= 100
        ? "You've completed this course!"
        : `Let's keep learning: ${course.title}`
    );
  }

  function completeLesson(course) {
    const current = progressMap[course.id] ?? course.progress;
    const next = Math.min(100, current + 10);

    setProgressMap((previous) => ({ ...previous, [course.id]: next }));
    setStartedIds((previous) =>
      previous.includes(course.id) ? previous : [...previous, course.id]
    );

    showMessage(
      next === 100
        ? `Amazing! ${course.title} completed 🎉`
        : `Progress updated to ${next}%`
    );
  }

  return (
    <div className={`learning-app ${darkMode ? "dark" : ""}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="CapIQ home">
          Cap<span>IQ</span>
          <i className="brand-dot" />
        </a>

        <div className="topbar-right">
          <div className="live-indicator">
            <span />
            Your learning space
          </div>

          <button
            className="theme-toggle"
            onClick={() => setDarkMode((previous) => !previous)}
            aria-label="Toggle dark mode"
            title="Toggle appearance"
          >
            <span>{darkMode ? "☀" : "☾"}</span>
          </button>

          <button
            className="avatar-button"
            onClick={() => showMessage("Welcome to your learning workspace!")}
            title="Student profile"
          >
            S
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-label">WORKSPACE</div>

          {[
            ["Discover", "⌕"],
            ["My learning", "▤"],
            ["Saved", "♡"],
          ].map(([name, icon]) => (
            <button
              key={name}
              className={`nav-link ${activeTab === name ? "active" : ""}`}
              onClick={() => {
                setActiveTab(name);
                setCategory("All courses");
                setSearch("");
              }}
            >
              <span className="nav-icon">{icon}</span>
              {name}
              {name === "Saved" && savedIds.length > 0 && (
                <span className="nav-count">{savedIds.length}</span>
              )}
            </button>
          ))}

          <div className="sidebar-divider" />

          <div className="sidebar-label">YOUR PROGRESS</div>

          <div className="sidebar-progress">
            <div className="mini-progress-heading">
              <span>Learning journey</span>
              <strong>{overallProgress}%</strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p>Every lesson moves you forward.</p>
          </div>

          <div className="sidebar-bottom">
            <div className="streak-icon">✦</div>
            <strong>Keep your momentum</strong>
            <p>Little by little, skills become strengths.</p>
            <span className="streak-pill">Your next chapter starts here</span>
          </div>
        </aside>

        <main className="main-content" id="home">
          <section className="welcome-section">
            <div className="welcome-copy">
              <div className="eyebrow">
                <span className="eyebrow-line" />
                THE STUDENT LEARNING HUB
              </div>
              <h1>
                Make your next skill
                <br />
                <span>your strongest one.</span>
                <span className="heading-sparkle">✳</span>
              </h1>
              <p>
                Find your focus, learn at your pace, and build a future
                you're proud of.
              </p>
            </div>

            <div className="welcome-art" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="art-core">✦</div>
              <div className="floating-chip chip-code">{"</>"}</div>
              <div className="floating-chip chip-star">✧</div>
              <div className="floating-chip chip-book">▤</div>
              <div className="floating-chip chip-plus">+</div>
            </div>
          </section>

          <section className="stats-grid">
            <article className="stat-card stat-primary">
              <div className="stat-top">
                <span className="stat-icon">◷</span>
                <span className="stat-label">LEARNING GOAL</span>
                <button
                  className="tiny-action"
                  onClick={() => setShowGoalEditor((previous) => !previous)}
                  aria-label="Edit weekly goal"
                >
                  ✎
                </button>
              </div>

              <div className="stat-number">
                4.5 <span>/ {goal} hrs</span>
              </div>

              <div className="progress-track stat-track">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(100, (4.5 / goal) * 100)}%` }}
                />
              </div>

              {showGoalEditor ? (
                <div className="goal-editor">
                  <label htmlFor="weekly-goal">Weekly target</label>
                  <select
                    id="weekly-goal"
                    value={goal}
                    onChange={(event) => {
                      setGoal(Number(event.target.value));
                      setShowGoalEditor(false);
                      showMessage("Weekly learning goal updated");
                    }}
                  >
                    {[3, 4, 5, 6, 8, 10, 12].map((hours) => (
                      <option key={hours} value={hours}>
                        {hours} hours
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="stat-foot">75% of your weekly target</p>
              )}
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon icon-green">✓</span>
                <span className="stat-label">COURSES COMPLETED</span>
              </div>
              <div className="stat-number">
                {String(completedCourses).padStart(2, "0")}
                <span className="stat-change"> + keep going</span>
              </div>
              <p className="stat-foot">
                {completedLessons} lessons completed across your catalog
              </p>
              <div className="stat-decoration decoration-green">↗</div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon icon-orange">⚡</span>
                <span className="stat-label">IN PROGRESS</span>
              </div>
              <div className="stat-number">
                {String(activeCourses).padStart(2, "0")}
              </div>
              <p className="stat-foot">Keep the momentum going</p>
              <div className="stat-decoration decoration-orange">✳</div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon icon-blue">♡</span>
                <span className="stat-label">SAVED FOR LATER</span>
              </div>
              <div className="stat-number">
                {String(savedIds.length).padStart(2, "0")}
              </div>
              <p className="stat-foot">Your personal learning shortlist</p>
              <div className="stat-decoration decoration-blue">✧</div>
            </article>
          </section>

          <section className="learning-insight">
            <div className="insight-icon">✦</div>
            <div className="insight-copy">
              <strong>A little progress adds up.</strong>
              <p>
                You've got {activeCourses} course
                {activeCourses === 1 ? "" : "s"} in progress. Pick one and
                make today count.
              </p>
            </div>
            <button
              className="insight-button"
              onClick={() => {
                setActiveTab("My learning");
                setCategory("All courses");
                setSearch("");
              }}
            >
              Continue learning <span>↗</span>
            </button>
          </section>

          <section className="catalog-section">
            <div className="catalog-heading">
              <div>
                <div className="eyebrow">PICK YOUR NEXT CHALLENGE</div>
                <h2>
                  {activeTab === "Saved"
                    ? "Your saved courses"
                    : activeTab === "My learning"
                      ? "Your learning journey"
                      : "Explore courses"}
                </h2>
                <p>
                  {activeTab === "Saved"
                    ? "Good choices are worth coming back to."
                    : activeTab === "My learning"
                      ? "Pick up where you left off."
                      : "Practical skills for the things you want to achieve."}
                </p>
              </div>

              <div className="view-controls">
                <span className="course-count">
                  {filteredCourses.length} courses
                </span>
                <button
                  className={`view-button ${!listView ? "selected" : ""}`}
                  onClick={() => setListView(false)}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  ▦
                </button>
                <button
                  className={`view-button ${listView ? "selected" : ""}`}
                  onClick={() => setListView(true)}
                  aria-label="List view"
                  title="List view"
                >
                  ☷
                </button>
              </div>
            </div>

            <div className="catalog-tools">
              <label className="search-box">
                <span>⌕</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search skills, courses, or topics..."
                />
                <kbd>⌕</kbd>
              </label>
              <div className="category-select-wrap">
                <select
                  aria-label="Filter by category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <span>⌄</span>
              </div>
            </div>

            <div className="category-chips">
              {categories.map((item) => (
                <button
                  key={item}
                  className={`category-chip ${category === item ? "chosen" : ""}`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                  {item === "All courses" && (
                    <span>{initialCourses.length}</span>
                  )}
                </button>
              ))}
            </div>

            {filteredCourses.length > 0 ? (
              <div className={`course-grid ${listView ? "list-view" : ""}`}>
                {filteredCourses.map((course, index) => (
                  <article
                    key={course.id}
                    className="course-card"
                    style={{ "--card-index": index }}
                  >
                    <div className={`course-cover cover-${course.color}`}>
                      <div className="cover-orb orb-a" />
                      <div className="cover-orb orb-b" />
                      <div className="cover-topline">
                        <span className="cover-category">{course.category}</span>
                        <button
                          className={`save-button ${
                            savedIds.includes(course.id) ? "is-saved" : ""
                          }`}
                          onClick={() => toggleSaved(course.id)}
                          aria-label={
                            savedIds.includes(course.id)
                              ? "Remove saved course"
                              : "Save course"
                          }
                          title={
                            savedIds.includes(course.id)
                              ? "Remove from saved"
                              : "Save for later"
                          }
                        >
                          {savedIds.includes(course.id) ? "♥" : "♡"}
                        </button>
                      </div>

                      <div className="cover-art">
                        <div className="cover-icon">{course.icon}</div>
                        <span className="cover-art-sparkle">✦</span>
                        <span className="cover-art-dot" />
                      </div>

                      {course.featured && (
                        <span className="featured-label">✦ EDITOR'S PICK</span>
                      )}
                    </div>

                    <div className="course-body">
                      <div className="course-meta">
                        <span>{course.level}</span>
                        <span className="meta-dot">•</span>
                        <span>{course.duration}</span>
                        <span className="meta-dot">•</span>
                        <span>{course.lessons} lessons</span>
                      </div>

                      <h3>{course.title}</h3>
                      <p className="course-description">{course.description}</p>

                      <div className="skill-tags">
                        {course.skills.slice(0, 3).map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>

                      {course.progress > 0 && (
                        <div className="course-progress">
                          <div className="course-progress-label">
                            <span>
                              {course.progress >= 100
                                ? "Completed"
                                : "Your progress"}
                            </span>
                            <strong>{course.progress}%</strong>
                          </div>
                          <div className="progress-track">
                            <div
                              className="progress-fill"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="course-actions">
                        <button
                          className="primary-button"
                          onClick={() => startCourse(course)}
                        >
                          {course.progress >= 100
                            ? "Review course"
                            : course.progress > 0
                              ? "Continue learning"
                              : "Start learning"}
                          <span>↗</span>
                        </button>

                        {startedIds.includes(course.id) &&
                          course.progress < 100 && (
                            <button
                              className="lesson-button"
                              onClick={() => completeLesson(course)}
                              title="Simulate completing a lesson"
                            >
                              +10%
                            </button>
                          )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">⌕</div>
                <h3>No courses found</h3>
                <p>
                  Try another search or explore a different category.
                </p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All courses");
                    setActiveTab("Discover");
                  }}
                >
                  Explore all courses <span>↗</span>
                </button>
              </div>
            )}
          </section>

          <footer className="page-footer">
            <span>CapIQ <span className="footer-dot">✦</span> Your growth, organized.</span>
            <span>LEARN AT YOUR OWN PACE</span>
          </footer>
        </main>
      </div>

      {notice && (
        <div className="toast-message" role="status">
          <span>✓</span>
          {notice}
        </div>
      )}
    </div>
  );
}

export default App;
