import React, { useEffect, useMemo, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import "./ResumeStudio.css";
const initialResume = {
  name: "Lishika Sharma",
  headline: "Computer Science Student | Aspiring Software Engineer",
  email: "student@example.com",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  summary: "Motivated computer science student interested in software development, problem solving, and building useful products.",
  education: "B.Tech in Computer Science",
  college: "Your University",
  graduation: "2027",
  experience: "Developed academic projects using modern web technologies.",
  projects: "Student Portfolio Website — Built a responsive portfolio using React and CSS.",
  skills: "JavaScript, React, Java, HTML, CSS, Communication",
  achievements: "",
};

function normalizeResumeData(data = {}) {
  const normalized = { ...initialResume, ...(data || {}) };
  const fields = [
    "name", "headline", "email", "phone", "location", "linkedin",
    "github", "summary", "education", "college", "graduation",
    "experience", "projects", "skills", "achievements",
  ];

  for (const field of fields) {
    const value = normalized[field];
    normalized[field] = Array.isArray(value)
      ? value.join(", ")
      : String(value ?? "");
  }
  return normalized;
}

const templates = [
  { id: "classic", name: "Classic", label: "ATS friendly", color: "#5745CF" },
  { id: "modern", name: "Modern", label: "Contemporary", color: "#167D75" },
  { id: "minimal", name: "Minimal", label: "Clean & simple", color: "#32394B" },
];

function getAtsChecks(resume) {
  const text = (value) =>
    Array.isArray(value) ? value.join(", ") : String(value ?? "");

  const skills = text(resume.skills)
    .split(/[,;\n]+/)
    .map((skill) => skill.trim())
    .filter(Boolean);

  return [
    {
      title: "Full name",
      detail: "Add your professional name.",
      points: 10,
      done: text(resume.name).trim().length >= 3,
    },
    {
      title: "Professional headline",
      detail: "Mention your target role or specialization.",
      points: 10,
      done: text(resume.headline).trim().length >= 8,
    },
    {
      title: "Contact information",
      detail: "Provide a valid email address.",
      points: 10,
      done: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(resume.email).trim()),
    },
    {
      title: "Professional summary",
      detail: "Write a summary of at least 40 characters.",
      points: 15,
      done: text(resume.summary).trim().length >= 40,
    },
    {
      title: "Education",
      detail: "Include your degree and institution.",
      points: 15,
      done:
        text(resume.education).trim().length > 2 &&
        text(resume.college).trim().length > 2,
    },
    {
      title: "Relevant skills",
      detail: "List at least four skills relevant to your target role.",
      points: 15,
      done: skills.length >= 4,
    },
    {
      title: "Projects or experience",
      detail: "Describe projects, internships or practical experience.",
      points: 15,
      done:
        text(resume.projects).trim().length >= 30 ||
        text(resume.experience).trim().length >= 40,
    },
    {
      title: "Career links",
      detail: "Add a LinkedIn or GitHub profile.",
      points: 5,
      done: Boolean(text(resume.linkedin).trim() || text(resume.github).trim()),
    },
    {
      title: "Achievements",
      detail: "Add a certification, award or measurable result.",
      points: 5,
      done: text(resume.achievements).trim().length >= 10,
    },
  ];
}

function SectionTitle({ children }) {
  return <div className="section-title">{children}</div>;
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
      />
    </label>
  );
}

function TextField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        rows={rows}
      />
    </label>
  );
}

function ResumePreview({ resume, template }) {
  const skillsText = Array.isArray(resume.skills)
    ? resume.skills.join(", ")
    : String(resume.skills ?? "");

  const skills = skillsText
    .split(/[,;\n]+/)
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <article className={`resume-paper template-${template}`}>
      <header className="resume-header">
        <h1>{resume.name || "Your Name"}</h1>
        <p className="resume-headline">
          {resume.headline || "Your professional headline"}
        </p>
        <div className="resume-contact">
          {[resume.email, resume.phone, resume.location]
            .filter(Boolean)
            .join("  •  ")}
        </div>
        <div className="resume-links">
          {[resume.linkedin, resume.github].filter(Boolean).join("  •  ")}
        </div>
      </header>

      <section className="resume-section">
        <h3>Professional Summary</h3>
        <p>{resume.summary || "Your professional summary will appear here."}</p>
      </section>

      <section className="resume-section">
        <h3>Education</h3>
        <div className="resume-entry">
          <strong>{resume.education || "Your degree"}</strong>
          <span>{resume.graduation || "Graduation year"}</span>
        </div>
        <p>{resume.college || "Your institution"}</p>
      </section>

      <section className="resume-section">
        <h3>Projects</h3>
        <p className="preserve-lines">
          {resume.projects || "Add your academic and personal projects."}
        </p>
      </section>

      <section className="resume-section">
        <h3>Experience</h3>
        <p className="preserve-lines">
          {resume.experience || "Add internships, work or practical experience."}
        </p>
      </section>

      <section className="resume-section">
        <h3>Skills</h3>
        <div className="resume-skills">
          {skills.length ? (
            skills.map((skill, i) => (
              <span key={`${skill}-${i}`}>{skill}</span>
            ))
          ) : (
            <p>Add your skills.</p>
          )}
        </div>
      </section>

      {String(resume.achievements ?? "").trim() && (
        <section className="resume-section">
          <h3>Achievements & Certifications</h3>
          <p className="preserve-lines">{resume.achievements}</p>
        </section>
      )}
    </article>
  );
}

export default function App() {
  const [resume, setResume] = useState(() => {
    try {
      const saved = localStorage.getItem("capiq-resume");
      return saved
        ? normalizeResumeData(JSON.parse(saved))
        : { ...initialResume };
    } catch {
      return { ...initialResume };
    }
  });

  const [dark, setDark] = useState(false);
  const [template, setTemplate] = useState("classic");
  const [activeTab, setActiveTab] = useState("editor");
  const [savedMessage, setSavedMessage] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [atsReport, setAtsReport] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
const [uploadedResumeText, setUploadedResumeText] = useState("");
const [uploadError, setUploadError] = useState("");
const handleResumeUpload = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  setUploadError("");
  setUploadedFileName("");
  setUploadedResumeText("");

  const fileName = file.name.toLowerCase();
  const isPdf = fileName.endsWith(".pdf");
  const isDocx = fileName.endsWith(".docx");

  if (!isPdf && !isDocx) {
    setUploadError("Please select a PDF or DOCX file.");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setUploadError("File size must be 5 MB or less.");
    event.target.value = "";
    return;
  }

  try {
    let extractedText = "";

    if (isPdf) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();

        extractedText +=
          content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ") + "\n";
      }
    } else {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value;
    }

    extractedText = extractedText.trim();

    if (!extractedText) {
      setUploadError(
        "No readable text found. If this is a scanned PDF, OCR may be needed."
      );
      return;
    }

    setUploadedFileName(file.name);
    setUploadedResumeText(extractedText);
  } catch (error) {
    console.error("Resume extraction error:", error);
    setUploadError(
      "Could not read this file. Please try another PDF or DOCX."
    );
  }
};

  useEffect(() => {
    let cancelled = false;

    async function loadResume() {
      const token = localStorage.getItem("capiq_token");
      if (!token) return;

      try {
        const response = await fetch("/api/resume", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 204 || response.status === 404) return;

        if (!response.ok) {
          console.error("Could not load resume:", response.status);
          return;
        }

        const data = await response.json();

        if (!cancelled && data) {
          setResume((previous) => {
            const updated = normalizeResumeData({ ...previous, ...data });
            try {
              localStorage.setItem("capiq-resume", JSON.stringify(updated));
            } catch {
              // Resume remains available in React state.
            }
            return updated;
          });
        }
      } catch (error) {
        console.error("Resume backend unavailable:", error);
      }
    }

    loadResume();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (key, value) => {
    setResume((previous) => ({ ...previous, [key]: value }));
    setSavedMessage(false);
  };

  const checks = useMemo(() => getAtsChecks(resume), [resume]);
  const score = checks.reduce(
    (total, check) => total + (check.done ? check.points : 0),
    0
  );
  const completed = checks.filter((check) => check.done).length;
  const suggestions = checks.filter((check) => !check.done);

  const analyzeWithBackend = async () => {
    const token = localStorage.getItem("capiq_token");
    if (!token) {
      setAtsError("Please log in again before running ATS analysis.");
      return;
    }
    setAtsLoading(true);
    setAtsError("");
    try {
      const response = await fetch("/api/resume/ats-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || data.detail || `ATS analysis failed (HTTP ${response.status}).`);
      }
      setAtsReport(data);
    } catch (error) {
      setAtsError(error.message || "Unable to run ATS analysis.");
    } finally {
      setAtsLoading(false);
    }
  };

  const saveResume = async () => {
    try {
      localStorage.setItem("capiq-resume", JSON.stringify(resume));
    } catch {
      alert("Unable to save locally in this browser.");
      return;
    }

    const token = localStorage.getItem("capiq_token");

    if (!token) {
      setSavedMessage(false);
      alert("Please log in again before saving your resume to the backend.");
      return;
    }

    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resume),
      });

      if (!response.ok) {
        const message = await response.text();
        console.error("Resume save failed:", response.status, message);
        setSavedMessage(false);
        alert(
          `Backend save failed (HTTP ${response.status}). Your local backup is preserved.`
        );
        return;
      }

      const savedResume = await response.json();
      const updated = normalizeResumeData({ ...resume, ...savedResume });
      setResume(updated);
      localStorage.setItem("capiq-resume", JSON.stringify(updated));
      setSavedMessage(true);
    } catch (error) {
      console.error("Resume backend unavailable:", error);
      setSavedMessage(false);
      alert("Could not connect to the backend. Your local backup is preserved.");
    }
  };

  const resetResume = () => {
    if (window.confirm("Reset all resume fields to the sample data?")) {
      setResume({ ...initialResume });
      setSavedMessage(false);
    }
  };

  const exportPdf = () => window.print();

  return (
    <div className={`studio ${dark ? "dark" : ""}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#" aria-label="CapIQ home">
          Cap<span>IQ</span><i>.</i>
        </a>
        <div className="topbar-right">
          <span className="workspace-label">CAREER WORKSPACE</span>
          <button
            className="theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            title="Toggle theme"
          >
            {dark ? "☀" : "☾"}
            <span>{dark ? "Light mode" : "Dark mode"}</span>
          </button>
          <div className="avatar">
            {(resume.name || "Y").trim().charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="studio-main">
        <div className="page-heading">
          <div>
            <div className="eyebrow">YOUR CAREER, YOUR STORY</div>
            <h1>Resume Studio<span className="heading-dot">.</span></h1>
            <p>Build a resume that reflects what you can actually do.</p>
          </div>
          <div className="heading-actions">
            <button className="btn btn-ghost" onClick={resetResume}>Reset</button>
            <button className="btn btn-primary" onClick={saveResume}>
              {savedMessage ? "✓ Saved" : "Save progress"}
            </button>
          </div>
        </div>

        <section className="panel" style={{ marginBottom: "1.25rem" }}>
          <div className="section-title">AI-assisted ATS analysis</div>
          <p className="local-note">Optionally paste a job description to compare its keywords with your resume. This is guidance, not a hiring guarantee.</p>
          <label className="field">
  <span>Upload existing resume (PDF or DOCX)</span>
  <input
    type="file"
    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    onChange={handleResumeUpload}
  />
</label>

{uploadedFileName && (
  <p className="local-note">
    Selected file: {uploadedFileName}
  </p>
)}

{uploadError && (
  <p role="alert" className="local-note">
    {uploadError}
  </p>
)}

{uploadedResumeText && (
  <div className="field">
    <span>Extracted resume text</span>
    <textarea
      value={uploadedResumeText}
      readOnly
      rows={5}
      aria-label="Extracted resume text preview"
    />
    <p className="local-note">
      Text extracted successfully. You can review it above.
    </p>
  </div>
)}
          <label className="field">
            <span>Target job description (optional)</span>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the internship or job description here..."
              rows={4}
            />
          </label>
          <button className="btn btn-primary" type="button" onClick={analyzeWithBackend} disabled={atsLoading}>
            {atsLoading ? "Analyzing..." : "Run ATS analysis"}
          </button>
          {atsError && <p role="alert" className="local-note">{atsError}</p>}
          {atsReport && (
            <div className="ats-backend-result" aria-live="polite">
              <h3>Analysis score: {atsReport.score}/100</h3>
              <p>{atsReport.summary}</p>
              {Array.isArray(atsReport.suggestions) && atsReport.suggestions.length > 0 && (
                <ul>{atsReport.suggestions.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul>
              )}
              {Array.isArray(atsReport.missingKeywords) && atsReport.missingKeywords.length > 0 && (
                <p><strong>Missing job keywords:</strong> {atsReport.missingKeywords.join(", ")}</p>
              )}
            </div>
          )}
        </section>

        <section className="analytics-grid">
          <article className="analytics-card score-card">
            <div className="analytics-top">
              <span>RESUME READINESS</span>
              <span className="analytics-icon">✦</span>
            </div>
            <div className="score-content">
              <div className="score-number">{score}<span>/100</span></div>
              <p>Content checklist score</p>
            </div>
            <div className="progress-track">
              <div style={{ width: `${score}%` }} />
            </div>
            <div className="analytics-bottom">
              <span>{completed} of {checks.length} checks complete</span>
              <span>{score}%</span>
            </div>
          </article>

          <article className="analytics-card">
            <div className="analytics-top">
              <span>CONTENT SECTIONS</span>
              <span className="analytics-icon">▤</span>
            </div>
            <div className="metric-number">
              {[
                resume.summary, resume.education, resume.projects,
                resume.experience, resume.skills,
              ].filter((value) => String(value ?? "").trim()).length}
              <span>/5</span>
            </div>
            <p>Sections with content</p>
            <div className="metric-note">Keep each section clear and relevant.</div>
          </article>

          <article className="analytics-card">
            <div className="analytics-top">
              <span>RESUME TEMPLATE</span>
              <span className="analytics-icon">▧</span>
            </div>
            <div className="template-metric">{templates.find((item) => item.id === template)?.name || "Classic"}</div>
            <p>Selected layout</p>
            <button className="text-action" onClick={() => setActiveTab("templates")}>
              Change template ↗
            </button>
          </article>
        </section>

        <nav className="studio-tabs">
          <button className={activeTab === "editor" ? "active" : ""} onClick={() => setActiveTab("editor")}>Resume editor</button>
          <button className={activeTab === "templates" ? "active" : ""} onClick={() => setActiveTab("templates")}>Templates</button>
          <button className={activeTab === "improve" ? "active" : ""} onClick={() => setActiveTab("improve")}>Improve my resume</button>
        </nav>

        {activeTab === "editor" && (
          <section className="editor-layout page-enter">
            <div className="editor-column">
              <div className="panel editor-panel">
                <div className="panel-heading">
                  <div>
                    <div className="eyebrow">BUILD YOUR PROFILE</div>
                    <h2>Tell your story.</h2>
                    <p>Complete the details to update your live resume.</p>
                  </div>
                  <span className="panel-symbol">✳</span>
                </div>

                <SectionTitle>Personal information</SectionTitle>
                <div className="form-grid">
                  <Field label="Full name" value={resume.name} onChange={(v) => update("name", v)} placeholder="Your full name" />
                  <Field label="Professional headline" value={resume.headline} onChange={(v) => update("headline", v)} placeholder="e.g. Computer Science Student" />
                  <Field label="Email" type="email" value={resume.email} onChange={(v) => update("email", v)} placeholder="you@example.com" />
                  <Field label="Phone" value={resume.phone} onChange={(v) => update("phone", v)} placeholder="Your phone number" />
                  <Field label="Location" value={resume.location} onChange={(v) => update("location", v)} placeholder="City, Country" />
                  <Field label="LinkedIn URL" value={resume.linkedin} onChange={(v) => update("linkedin", v)} placeholder="linkedin.com/in/you" />
                  <Field label="GitHub URL" value={resume.github} onChange={(v) => update("github", v)} placeholder="github.com/you" />
                </div>

                <SectionTitle>Professional summary</SectionTitle>
                <TextField label="About your professional goals" value={resume.summary} onChange={(v) => update("summary", v)} placeholder="Describe your interests, strengths and career direction..." rows={4} />
                <div className="field-hint">
                  Tip: Mention your specialization, strongest skills and the kind of role you want.
                </div>

                <SectionTitle>Education</SectionTitle>
                <div className="form-grid">
                  <Field label="Degree / Course" value={resume.education} onChange={(v) => update("education", v)} />
                  <Field label="College / University" value={resume.college} onChange={(v) => update("college", v)} />
                  <Field label="Graduation year" value={resume.graduation} onChange={(v) => update("graduation", v)} />
                </div>

                <SectionTitle>Projects & experience</SectionTitle>
                <TextField label="Projects" value={resume.projects} onChange={(v) => update("projects", v)} placeholder="Project name, what you built, technologies and results..." />
                <TextField label="Internships / Experience" value={resume.experience} onChange={(v) => update("experience", v)} placeholder="Your role, responsibilities, technologies and results..." />

                <SectionTitle>Skills & achievements</SectionTitle>
                <TextField label="Skills (separate with commas)" value={resume.skills} onChange={(v) => update("skills", v)} placeholder="React, JavaScript, SQL, Problem solving..." rows={3} />
                <TextField label="Achievements & certifications" value={resume.achievements} onChange={(v) => update("achievements", v)} placeholder="Certifications, awards, hackathons or measurable results..." rows={3} />

                <div className="editor-footer">
                  <span className="local-note">✓ Your work stays in this browser</span>
                  <button className="btn btn-primary" onClick={saveResume}>
                    {savedMessage ? "✓ Saved" : "Save progress"}
                  </button>
                </div>
              </div>
            </div>

            <aside className="preview-column">
              <div className="preview-toolbar">
                <div>
                  <span className="preview-live-dot" />
                  <strong>Live preview</strong>
                  <span className="preview-status">A4 · {template}</span>
                </div>
                <button className="btn btn-small btn-ghost" onClick={exportPdf}>↓ Export PDF</button>
              </div>
              <ResumePreview resume={resume} template={template} />
              <div className="preview-footnote">
                <span>✳</span> Keep formatting simple for easier ATS parsing.
              </div>

              <div className="panel quick-tip">
                <div className="eyebrow">STUDIO TIP</div>
                <h3>Show the result, not just the task.</h3>
                <p>
                  Replace “worked on a website” with what you built, the tools
                  you used, and what improved because of your work.
                </p>
                <button className="text-action" onClick={() => setActiveTab("improve")}>
                  See improvement tips ↗
                </button>
              </div>
            </aside>
          </section>
        )}

        {activeTab === "templates" && (
          <section className="panel secondary-view page-enter">
            <div className="panel-heading">
              <div>
                <div className="eyebrow">PRESENT YOURSELF WELL</div>
                <h2>Choose your resume style</h2>
                <p>Pick a layout and preview it with your own content.</p>
              </div>
            </div>

            <div className="template-grid">
              {templates.map((item) => (
                <button
                  key={item.id}
                  className={`template-card ${template === item.id ? "selected" : ""}`}
                  onClick={() => setTemplate(item.id)}
                >
                  <div className={`template-thumb thumb-${item.id}`}>
                    <div className="thumb-heading" style={{ background: item.color }} />
                    <div className="thumb-line long" />
                    <div className="thumb-line" />
                    <div className="thumb-section" />
                    <div className="thumb-line long" />
                    <div className="thumb-line medium" />
                    <div className="thumb-section" />
                    <div className="thumb-line long" />
                    <div className="thumb-line medium" />
                    <div className="thumb-line short" />
                  </div>
                  <div className="template-info">
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.label}</span>
                    </div>
                    <span className="template-radio">{template === item.id ? "✓" : ""}</span>
                  </div>
                  {template === item.id && <div className="selected-label">CURRENT TEMPLATE</div>}
                </button>
              ))}
            </div>

            <div className="template-bottom">
              <div>
                <h3>Ready to see your selection?</h3>
                <p>Your current resume content will be preserved.</p>
              </div>
              <button className="btn btn-primary" onClick={() => setActiveTab("editor")}>
                Open live preview ↗
              </button>
            </div>
          </section>
        )}

        {activeTab === "improve" && (
          <section className="improve-grid page-enter">
            <div className="panel improvement-panel">
              <div className="eyebrow">YOUR RESUME REPORT</div>
              <h2>Make every section count.</h2>
              <p className="report-intro">
                Your readiness score is based on content checks, not a real
                employer's ATS system. Work through the suggestions below to
                strengthen your resume.
              </p>

              <div className="report-score">
                <div className="report-score-number">{score}<span>/100</span></div>
                <div className="report-progress">
                  <div className="progress-track">
                    <div style={{ width: `${score}%` }} />
                  </div>
                  <span>{completed} of {checks.length} checks complete</span>
                </div>
              </div>

              <div className="checklist">
                {checks.map((check) => (
                  <div className="check-row" key={check.title}>
                    <span className={`check-status ${check.done ? "complete" : ""}`}>
                      {check.done ? "✓" : "○"}
                    </span>
                    <div>
                      <strong>{check.title}</strong>
                      <p>{check.detail}</p>
                    </div>
                    <span className="check-points">+{check.points}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="improvement-side">
              <div className="panel tips-panel">
                <div className="eyebrow">YOUR NEXT STEPS</div>
                <h2>Small edits. Stronger story.</h2>

                {suggestions.length ? (
                  suggestions.slice(0, 5).map((item, index) => (
                    <div className="suggestion" key={item.title}>
                      <span className="suggestion-number">{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="all-done">
                    <span>✦</span>
                    <strong>All checks completed!</strong>
                    <p>Now tailor your resume to each job description.</p>
                  </div>
                )}

                <button className="btn btn-primary full-button" onClick={() => setActiveTab("editor")}>
                  Edit my resume ↗
                </button>
              </div>

              <div className="panel writing-guide">
                <div className="eyebrow">WRITE STRONGER BULLETS</div>
                <h3>Use the action + evidence formula.</h3>
                <div className="formula">
                  <span>Action</span><b>+</b><span>Tool</span><b>+</b><span>Result</span>
                </div>
                <p className="example-label">Instead of</p>
                <p className="weak-example">“Made a student website.”</p>
                <p className="example-label">Try something specific</p>
                <p className="strong-example">
                  “Built a responsive student portal using React, improving
                  access to course information across devices.”
                </p>
                <p className="disclaimer">
                  Example wording only. Use results you can genuinely support.
                </p>
              </div>
            </aside>
          </section>
        )}

        <footer className="studio-footer">
          <span>CapIQ <b>Resume Studio</b></span>
          <span>Built for the next step in your career.</span>
        </footer>
      </main>
    </div>
  );
}