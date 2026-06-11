import { useState, useEffect } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_COURSES = [
  { id: 1, title: "Introduction to React", instructor: "Dr. Amina Bello", category: "Web Dev", duration: "6 weeks", lessons: 24, enrolled: 1240, rating: 4.8, price: "Free", image: "⚛️", description: "Master React from the ground up. Build real-world projects with hooks, state management, and modern patterns.", level: "Beginner" },
  { id: 2, title: "Advanced JavaScript", instructor: "Prof. Chidi Okafor", category: "Programming", duration: "8 weeks", lessons: 32, enrolled: 980, rating: 4.7, price: "Free", image: "📜", description: "Deep dive into closures, async/await, prototypes, and JavaScript engine internals.", level: "Advanced" },
  { id: 3, title: "UI/UX Design Fundamentals", instructor: "Ms. Fatima Hassan", category: "Design", duration: "5 weeks", lessons: 20, enrolled: 750, rating: 4.9, price: "Free", image: "🎨", description: "Learn design thinking, wireframing, prototyping, and user research principles.", level: "Beginner" },
  { id: 4, title: "Node.js & Express Backend", instructor: "Engr. Tunde Adeyemi", category: "Backend", duration: "7 weeks", lessons: 28, enrolled: 620, rating: 4.6, price: "Free", image: "🟢", description: "Build scalable REST APIs, authentication systems, and database integrations.", level: "Intermediate" },
  { id: 5, title: "Python for Data Science", instructor: "Dr. Ngozi Eze", category: "Data Science", duration: "10 weeks", lessons: 40, enrolled: 1560, rating: 4.9, price: "Free", image: "🐍", description: "NumPy, Pandas, Matplotlib, and machine learning fundamentals with scikit-learn.", level: "Intermediate" },
  { id: 6, title: "Database Design & SQL", instructor: "Prof. Emeka Nwosu", category: "Database", duration: "4 weeks", lessons: 16, enrolled: 430, rating: 4.5, price: "Free", image: "🗄️", description: "Relational database design, normalization, complex queries, and indexing strategies.", level: "Beginner" },
];

const MOCK_STUDENTS = [
  { id: 1, name: "Adaeze Okonkwo", email: "adaeze@student.edu", enrolled: [1, 2, 5], progress: { 1: 78, 2: 45, 5: 20 }, avatar: "AO", joinDate: "Jan 2025" },
  { id: 2, name: "Yusuf Garba", email: "yusuf@student.edu", enrolled: [1, 3], progress: { 1: 100, 3: 65 }, avatar: "YG", joinDate: "Feb 2025" },
  { id: 3, name: "Chisom Ibe", email: "chisom@student.edu", enrolled: [2, 4, 6], progress: { 2: 90, 4: 30, 6: 10 }, avatar: "CI", joinDate: "Mar 2025" },
  { id: 4, name: "Halima Usman", email: "halima@student.edu", enrolled: [5, 6], progress: { 5: 55, 6: 80 }, avatar: "HU", joinDate: "Jan 2025" },
  { id: 5, name: "Obinna Obi", email: "obinna@student.edu", enrolled: [1, 2, 3, 4], progress: { 1: 60, 2: 15, 3: 40, 4: 5 }, avatar: "OO", joinDate: "Apr 2025" },
];

const ANNOUNCEMENTS = [
  { id: 1, title: "Mid-semester exams scheduled", date: "May 10, 2025", body: "All mid-semester exams will be held between May 20–25. Check your dashboard for your personal schedule." },
  { id: 2, title: "New courses added for Q3", date: "May 8, 2025", body: "Three new courses in Cloud Computing, Cybersecurity, and Mobile Development are now available for enrollment." },
  { id: 3, title: "System maintenance on Sunday", date: "May 5, 2025", body: "The platform will be down for maintenance from 2:00 AM – 6:00 AM WAT on Sunday, May 12." },
];

const MOCK_USER = { name: "Adaeze Okonkwo", email: "adaeze@student.edu", avatar: "AO", role: "student", enrolled: [1, 2, 5], progress: { 1: 78, 2: 45, 5: 20 } };
const ADMIN_USER = { name: "Dr. Amina Bello", email: "admin@lms.edu", avatar: "AB", role: "admin" };

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  // Layout
  app: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f5f6fa", minHeight: "100vh", color: "#1a1d2e" },
  page: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px" },

  // Nav
  nav: { background: "#fff", borderBottom: "1px solid #e8eaf0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
  navInner: { maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 64, gap: 8 },
  logo: { fontWeight: 800, fontSize: 20, color: "#2563eb", letterSpacing: "-0.5px", marginRight: 32, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
  navLink: (active) => ({ padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: active ? 600 : 400, color: active ? "#2563eb" : "#64748b", background: active ? "#eff6ff" : "transparent", border: "none", transition: "all 0.15s" }),
  navRight: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 },
  avatar: (size = 36) => ({ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size > 40 ? 18 : 13, cursor: "pointer", flexShrink: 0 }),

  // Cards
  card: { background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  courseCard: { background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" },

  // Buttons
  btn: (variant = "primary") => ({
    padding: "10px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", border: "none", transition: "all 0.15s",
    ...(variant === "primary" ? { background: "#2563eb", color: "#fff" } :
      variant === "ghost" ? { background: "transparent", color: "#2563eb", border: "1px solid #dbeafe" } :
      variant === "danger" ? { background: "#fee2e2", color: "#dc2626", border: "none" } :
      { background: "#f1f5f9", color: "#475569", border: "none" }),
  }),
  btnSm: (variant = "primary") => ({ ...S.btn(variant), padding: "6px 14px", fontSize: 13 }),

  // Typography
  h1: { fontSize: 32, fontWeight: 800, color: "#1a1d2e", letterSpacing: "-0.5px", margin: 0 },
  h2: { fontSize: 22, fontWeight: 700, color: "#1a1d2e", margin: "0 0 20px" },
  h3: { fontSize: 17, fontWeight: 700, color: "#1a1d2e", margin: 0 },
  label: { fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" },
  muted: { fontSize: 14, color: "#64748b" },

  // Form
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fafafa", transition: "border 0.15s" },
  formGroup: { marginBottom: 18 },

  // Grid
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 },
  flex: (gap = 12) => ({ display: "flex", alignItems: "center", gap }),
  flexBetween: { display: "flex", alignItems: "center", justifyContent: "space-between" },

  // Badge / Tag
  badge: (color = "blue") => ({
    display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    ...(color === "blue" ? { background: "#eff6ff", color: "#2563eb" } :
      color === "green" ? { background: "#f0fdf4", color: "#16a34a" } :
      color === "orange" ? { background: "#fff7ed", color: "#ea580c" } :
      color === "purple" ? { background: "#faf5ff", color: "#7c3aed" } :
      { background: "#f1f5f9", color: "#475569" }),
  }),

  // Progress
  progressBar: (pct) => ({ height: 6, borderRadius: 3, background: "#e2e8f0", overflow: "hidden", position: "relative" }),
  progressFill: (pct) => ({ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#2563eb,#7c3aed)", borderRadius: 3, transition: "width 0.6s ease" }),

  // Stat card
  statCard: { background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },

  // Alert
  alert: (type = "info") => ({
    padding: "12px 16px", borderRadius: 10, fontSize: 14, marginBottom: 16,
    ...(type === "success" ? { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" } :
      type === "error" ? { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" } :
      { background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" }),
  }),
};

// ─── TINY COMPONENTS ──────────────────────────────────────────────────────────
const ProgressBar = ({ pct }) => (
  <div style={S.progressBar(pct)}>
    <div style={S.progressFill(pct)} />
  </div>
);

const StarRating = ({ rating }) => (
  <span style={{ color: "#f59e0b", fontSize: 13 }}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    <span style={{ color: "#94a3b8", marginLeft: 4 }}>{rating}</span>
  </span>
);

const Badge = ({ children, color }) => <span style={S.badge(color)}>{children}</span>;

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, user, onLogout }) {
  const links = user?.role === "admin"
    ? ["Admin", "Courses", "Students", "Announcements"]
    : ["Home", "Courses", "Dashboard", "Profile"];

  return (
    <nav style={S.nav}>
      <div style={S.navInner}>
        <div style={S.logo} onClick={() => setPage(user?.role === "admin" ? "Admin" : "Home")}>
          <span style={{ fontSize: 22 }}>🎓</span> LearnHub
        </div>
        {links.map(l => (
          <button key={l} style={S.navLink(page === l)} onClick={() => setPage(l)}>{l}</button>
        ))}
        <button style={S.navLink(page === "About")} onClick={() => setPage("About")}>About</button>
        <button style={S.navLink(page === "Contact")} onClick={() => setPage("Contact")}>Contact</button>
        <div style={S.navRight}>
          {user ? (
            <>
              <div style={S.avatar(36)} title={user.name}>{user.avatar}</div>
              <button style={S.btnSm("ghost")} onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <button style={S.btn("ghost")} onClick={() => setPage("Login")}>Login</button>
              <button style={S.btn("primary")} onClick={() => setPage("Register")}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ setPage, user }) {
  const [search, setSearch] = useState("");
  const filtered = MOCK_COURSES.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#7c3aed 100%)", padding: "72px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.07) 0%, transparent 50%)" }} />
        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            🚀 100% Free Courses · No Credit Card Required
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: "#fff", letterSpacing: "-1px", margin: "0 0 16px", lineHeight: 1.1 }}>
            Learn Without Limits
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", marginBottom: 36, lineHeight: 1.6 }}>
            Access world-class courses taught by expert instructors. Build real skills, earn certificates, and advance your career.
          </p>
          <div style={{ display: "flex", gap: 12, maxWidth: 480, margin: "0 auto" }}>
            <input
              style={{ flex: 1, padding: "14px 18px", borderRadius: 10, border: "none", fontSize: 15, outline: "none" }}
              placeholder="Search courses, topics, skills…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button style={{ ...S.btn("primary"), background: "#1d4ed8", padding: "14px 24px", fontSize: 15 }}>Search</button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8eaf0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {[["6+", "Courses"], ["5,580+", "Students"], ["6", "Expert Instructors"], ["100%", "Free Access"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#2563eb" }}>{n}</div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.page}>
        {/* Announcements */}
        <div style={{ ...S.card, marginBottom: 32, borderLeft: "4px solid #2563eb" }}>
          <div style={{ ...S.flex(8), marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>📢</span>
            <h3 style={S.h3}>Latest Announcements</h3>
          </div>
          {ANNOUNCEMENTS.map(a => (
            <div key={a.id} style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563eb", marginTop: 7, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{a.date} · {a.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div style={S.flexBetween}>
          <h2 style={{ ...S.h2, margin: 0 }}>Available Courses</h2>
          <span style={S.muted}>{filtered.length} courses</span>
        </div>
        <div style={{ height: 20 }} />
        <div style={S.grid2}>
          {filtered.map(c => (
            <CourseCard key={c.id} course={c} user={user} onEnroll={() => setPage("Login")} onView={() => setPage("Courses")} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
            <div style={{ fontSize: 40 }}>🔍</div>
            <p>No courses found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COURSE CARD ──────────────────────────────────────────────────────────────
function CourseCard({ course: c, user, onEnroll, showProgress }) {
  const [hover, setHover] = useState(false);
  const progress = user?.progress?.[c.id];
  const isEnrolled = user?.enrolled?.includes(c.id);

  return (
    <div
      style={{ ...S.courseCard, transform: hover ? "translateY(-2px)" : "none", boxShadow: hover ? "0 8px 24px rgba(0,0,0,0.1)" : S.courseCard.boxShadow }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ background: "linear-gradient(135deg,#eff6ff,#f5f3ff)", padding: "28px 24px", textAlign: "center", fontSize: 48 }}>
        {c.image}
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ ...S.flex(8), marginBottom: 10 }}>
          <Badge color={c.category === "Web Dev" ? "blue" : c.category === "Design" ? "purple" : "gray"}>{c.category}</Badge>
          <Badge color={c.level === "Beginner" ? "green" : c.level === "Advanced" ? "orange" : "gray"}>{c.level}</Badge>
        </div>
        <h3 style={{ ...S.h3, marginBottom: 8, fontSize: 16 }}>{c.title}</h3>
        <p style={{ ...S.muted, fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>{c.description}</p>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>👨‍🏫 {c.instructor}</div>
        <div style={{ ...S.flex(16), marginBottom: 14, fontSize: 13, color: "#64748b" }}>
          <span>📚 {c.lessons} lessons</span>
          <span>⏱ {c.duration}</span>
          <span>👥 {c.enrolled.toLocaleString()}</span>
        </div>
        <div style={{ marginBottom: 14 }}><StarRating rating={c.rating} /></div>
        {isEnrolled && showProgress && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ ...S.flexBetween, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Progress</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#2563eb" }}>{progress || 0}%</span>
            </div>
            <ProgressBar pct={progress || 0} />
          </div>
        )}
        <button
          style={{ ...S.btn(isEnrolled ? "ghost" : "primary"), width: "100%" }}
          onClick={isEnrolled ? null : onEnroll}
        >
          {isEnrolled ? (progress === 100 ? "✅ Completed" : "▶ Continue Learning") : "Enroll Free"}
        </button>
      </div>
    </div>
  );
}

// ─── COURSES PAGE ─────────────────────────────────────────────────────────────
function CoursesPage({ user, setPage }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const categories = ["All", ...new Set(MOCK_COURSES.map(c => c.category))];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filtered = MOCK_COURSES.filter(c =>
    (category === "All" || c.category === category) &&
    (level === "All" || c.level === level) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={S.page}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={S.h1}>All Courses</h1>
        <p style={{ ...S.muted, marginTop: 8 }}>Explore our full catalog of expert-led courses</p>
      </div>

      {/* Filters */}
      <div style={{ ...S.card, marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ ...S.label, marginBottom: 6 }}>Search</div>
            <input style={S.input} placeholder="Course title or instructor…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div>
            <div style={{ ...S.label, marginBottom: 6 }}>Category</div>
            <select style={{ ...S.input, width: "auto" }} value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ ...S.label, marginBottom: 6 }}>Level</div>
            <select style={{ ...S.input, width: "auto" }} value={level} onChange={e => setLevel(e.target.value)}>
              {levels.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <button style={S.btn("ghost")} onClick={() => { setSearch(""); setCategory("All"); setLevel("All"); }}>Clear</button>
        </div>
      </div>

      <div style={{ marginBottom: 16, color: "#64748b", fontSize: 14 }}>{filtered.length} course{filtered.length !== 1 ? "s" : ""} found</div>
      <div style={S.grid2}>
        {filtered.map(c => (
          <CourseCard key={c.id} course={c} user={user} showProgress onEnroll={() => setPage("Login")} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
          <div style={{ fontSize: 40 }}>📭</div>
          <p>No courses match your filters</p>
        </div>
      )}
    </div>
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
function DashboardPage({ user }) {
  const enrolledCourses = MOCK_COURSES.filter(c => user.enrolled.includes(c.id));
  const avgProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((s, c) => s + (user.progress[c.id] || 0), 0) / enrolledCourses.length)
    : 0;
  const completed = enrolledCourses.filter(c => (user.progress[c.id] || 0) === 100).length;

  return (
    <div style={S.page}>
      {/* Welcome */}
      <div style={{ ...S.card, marginBottom: 28, background: "linear-gradient(135deg,#eff6ff,#f5f3ff)", border: "1px solid #dbeafe" }}>
        <div style={S.flex(16)}>
          <div style={S.avatar(56)}>{user.avatar}</div>
          <div>
            <h1 style={{ ...S.h1, fontSize: 24 }}>Welcome back, {user.name.split(" ")[0]}! 👋</h1>
            <p style={{ ...S.muted, marginTop: 4 }}>Keep up the great work — you're making solid progress.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
        {[
          ["📚", "Enrolled", enrolledCourses.length, "courses"],
          ["✅", "Completed", completed, "courses"],
          ["📊", "Avg Progress", avgProgress + "%", "overall"],
          ["🏆", "Certificates", completed, "earned"],
        ].map(([icon, label, value, sub]) => (
          <div key={label} style={S.statCard}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1a1d2e" }}>{value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>{label}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Enrolled Courses */}
      <h2 style={S.h2}>My Courses</h2>
      {enrolledCourses.length === 0 ? (
        <div style={{ ...S.card, textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 40 }}>📭</div>
          <p style={S.muted}>You haven't enrolled in any courses yet.</p>
        </div>
      ) : (
        <div style={S.grid2}>
          {enrolledCourses.map(c => (
            <CourseCard key={c.id} course={c} user={user} showProgress />
          ))}
        </div>
      )}

      {/* Announcements */}
      <h2 style={{ ...S.h2, marginTop: 36 }}>Announcements</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} style={{ ...S.card, display: "flex", gap: 16 }}>
            <div style={{ fontSize: 24 }}>📢</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 6px" }}>{a.date}</div>
              <div style={{ fontSize: 14, color: "#475569" }}>{a.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email, bio: "Passionate learner and software developer.", phone: "+234 800 000 0000" });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setUser(prev => ({ ...prev, name: form.name, email: form.email }));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={S.page}>
      <h1 style={{ ...S.h1, marginBottom: 28 }}>My Profile</h1>
      {saved && <div style={S.alert("success")}>✅ Profile updated successfully!</div>}

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, flexWrap: "wrap" }}>
        {/* Left Panel */}
        <div>
          <div style={{ ...S.card, textAlign: "center", padding: 32, marginBottom: 16 }}>
            <div style={{ ...S.avatar(80), margin: "0 auto 16px" }}>{user.avatar}</div>
            <h3 style={{ ...S.h3, marginBottom: 4 }}>{user.name}</h3>
            <p style={{ ...S.muted, marginBottom: 12 }}>{user.email}</p>
            <Badge color="blue">Student</Badge>
            <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 20, paddingTop: 16 }}>
              <div style={{ fontSize: 13, color: "#64748b" }}>Member since Jan 2025</div>
            </div>
          </div>
          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 16 }}>Learning Stats</h3>
            {[["Enrolled", user.enrolled.length], ["Completed", 1], ["In Progress", user.enrolled.length - 1]].map(([k, v]) => (
              <div key={k} style={{ ...S.flexBetween, padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
                <span style={{ fontSize: 14, color: "#64748b" }}>{k}</span>
                <span style={{ fontWeight: 700, color: "#2563eb" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div>
          <div style={{ ...S.card, marginBottom: 20 }}>
            <div style={S.flexBetween}>
              <h3 style={S.h3}>Personal Information</h3>
              <button style={S.btnSm(editing ? "ghost" : "primary")} onClick={() => setEditing(!editing)}>
                {editing ? "Cancel" : "✏️ Edit"}
              </button>
            </div>
            <div style={{ height: 20 }} />
            {[["Full Name", "name"], ["Email Address", "email"], ["Phone", "phone"], ["Bio", "bio"]].map(([label, key]) => (
              <div key={key} style={S.formGroup}>
                <label style={{ ...S.label, display: "block", marginBottom: 6 }}>{label}</label>
                {editing ? (
                  key === "bio"
                    ? <textarea style={{ ...S.input, height: 80, resize: "vertical" }} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                    : <input style={S.input} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                ) : (
                  <div style={{ padding: "10px 0", fontSize: 15, color: "#1a1d2e" }}>{form[key]}</div>
                )}
              </div>
            ))}
            {editing && (
              <button style={S.btn("primary")} onClick={handleSave}>Save Changes</button>
            )}
          </div>

          {/* Change Password */}
          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 20 }}>Change Password</h3>
            {["Current Password", "New Password", "Confirm Password"].map(p => (
              <div key={p} style={S.formGroup}>
                <label style={{ ...S.label, display: "block", marginBottom: 6 }}>{p}</label>
                <input style={S.input} type="password" placeholder="••••••••" />
              </div>
            ))}
            <button style={S.btn("primary")}>Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
function AdminPage() {
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Courses", "Students", "Settings"];
  const totalEnrolled = MOCK_STUDENTS.reduce((s, st) => s + st.enrolled.length, 0);

  return (
    <div style={S.page}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={S.h1}>Admin Dashboard</h1>
        <p style={S.muted}>Manage courses, students, and platform settings</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid #e8eaf0", paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ ...S.navLink(tab === t), borderRadius: "8px 8px 0 0", paddingBottom: 12 }}>{t}</button>
        ))}
      </div>

      {tab === "Overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
            {[
              ["📚", "Total Courses", MOCK_COURSES.length, "blue"],
              ["👥", "Total Students", MOCK_STUDENTS.length, "green"],
              ["📋", "Enrollments", totalEnrolled, "purple"],
              ["📢", "Announcements", ANNOUNCEMENTS.length, "orange"],
            ].map(([icon, label, value, color]) => (
              <div key={label} style={{ ...S.statCard, borderTop: `3px solid ${color === "blue" ? "#2563eb" : color === "green" ? "#16a34a" : color === "purple" ? "#7c3aed" : "#ea580c"}` }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 32, fontWeight: 800 }}>{value}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={S.card}>
              <h3 style={{ ...S.h3, marginBottom: 16 }}>Top Courses by Enrollment</h3>
              {[...MOCK_COURSES].sort((a, b) => b.enrolled - a.enrolled).slice(0, 4).map(c => (
                <div key={c.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
                  <span style={{ fontSize: 22 }}>{c.image}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{c.enrolled.toLocaleString()} students</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <h3 style={{ ...S.h3, marginBottom: 16 }}>Recent Students</h3>
              {MOCK_STUDENTS.slice(0, 4).map(s => (
                <div key={s.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
                  <div style={S.avatar(32)}>{s.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.enrolled.length} courses · joined {s.joinDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "Courses" && (
        <div>
          <div style={{ ...S.flexBetween, marginBottom: 20 }}>
            <h2 style={{ ...S.h2, margin: 0 }}>All Courses</h2>
            <button style={S.btn("primary")}>+ Add Course</button>
          </div>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e8eaf0" }}>
                  {["Course", "Instructor", "Category", "Level", "Enrolled", "Rating", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_COURSES.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                    <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 20 }}>{c.image}</span><span style={{ fontWeight: 600 }}>{c.title}</span></div></td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{c.instructor}</td>
                    <td style={{ padding: "12px 16px" }}><Badge color="blue">{c.category}</Badge></td>
                    <td style={{ padding: "12px 16px" }}><Badge color={c.level === "Beginner" ? "green" : c.level === "Advanced" ? "orange" : "gray"}>{c.level}</Badge></td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{c.enrolled.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px" }}><StarRating rating={c.rating} /></td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={S.flex(8)}>
                        <button style={S.btnSm("ghost")}>Edit</button>
                        <button style={S.btnSm("danger")}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Students" && (
        <div>
          <div style={{ ...S.flexBetween, marginBottom: 20 }}>
            <h2 style={{ ...S.h2, margin: 0 }}>All Students</h2>
            <span style={S.muted}>{MOCK_STUDENTS.length} students</span>
          </div>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e8eaf0" }}>
                  {["Student", "Email", "Enrolled Courses", "Joined", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_STUDENTS.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={S.flex(10)}>
                        <div style={S.avatar(32)}>{s.avatar}</div>
                        <span style={{ fontWeight: 600 }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{s.email}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={S.flex(6)}>
                        {s.enrolled.map(id => {
                          const c = MOCK_COURSES.find(x => x.id === id);
                          return c ? <span key={id} style={{ fontSize: 18 }} title={c.title}>{c.image}</span> : null;
                        })}
                        <span style={{ fontSize: 13, color: "#64748b" }}>({s.enrolled.length})</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{s.joinDate}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={S.flex(8)}>
                        <button style={S.btnSm("ghost")}>View</button>
                        <button style={S.btnSm("danger")}>Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Settings" && (
        <div style={{ maxWidth: 600 }}>
          <div style={{ ...S.card, marginBottom: 20 }}>
            <h3 style={{ ...S.h3, marginBottom: 20 }}>Platform Settings</h3>
            {[["Platform Name", "LearnHub LMS"], ["Admin Email", "admin@lms.edu"], ["Support Email", "support@lms.edu"]].map(([l, v]) => (
              <div key={l} style={S.formGroup}>
                <label style={{ ...S.label, display: "block", marginBottom: 6 }}>{l}</label>
                <input style={S.input} defaultValue={v} />
              </div>
            ))}
            <button style={S.btn("primary")}>Save Settings</button>
          </div>
          <div style={S.card}>
            <h3 style={{ ...S.h3, marginBottom: 16 }}>Announcements</h3>
            <div style={S.formGroup}>
              <label style={{ ...S.label, display: "block", marginBottom: 6 }}>Title</label>
              <input style={S.input} placeholder="Announcement title…" />
            </div>
            <div style={S.formGroup}>
              <label style={{ ...S.label, display: "block", marginBottom: 6 }}>Message</label>
              <textarea style={{ ...S.input, height: 80, resize: "vertical" }} placeholder="Announcement body…" />
            </div>
            <button style={S.btn("primary")}>Post Announcement</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STUDENTS PAGE (admin view) ───────────────────────────────────────────────
function StudentsPage() {
  return (
    <div style={S.page}>
      <h1 style={{ ...S.h1, marginBottom: 28 }}>Students</h1>
      <div style={S.grid3}>
        {MOCK_STUDENTS.map(s => (
          <div key={s.id} style={S.card}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ ...S.avatar(52), margin: "0 auto 12px" }}>{s.avatar}</div>
              <h3 style={{ ...S.h3, marginBottom: 4 }}>{s.name}</h3>
              <p style={{ ...S.muted, fontSize: 13 }}>{s.email}</p>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>Enrolled in {s.enrolled.length} course{s.enrolled.length !== 1 ? "s" : ""}</div>
              {s.enrolled.map(id => {
                const c = MOCK_COURSES.find(x => x.id === id);
                const prog = s.progress[id] || 0;
                return c ? (
                  <div key={id} style={{ marginBottom: 8 }}>
                    <div style={{ ...S.flexBetween, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#475569" }}>{c.image} {c.title}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#2563eb" }}>{prog}%</span>
                    </div>
                    <ProgressBar pct={prog} />
                  </div>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ANNOUNCEMENTS PAGE ───────────────────────────────────────────────────────
function AnnouncementsPage() {
  return (
    <div style={S.page}>
      <h1 style={{ ...S.h1, marginBottom: 28 }}>Announcements</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} style={{ ...S.card, borderLeft: "4px solid #2563eb" }}>
            <div style={{ ...S.flex(8), marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>📢</span>
              <h3 style={S.h3}>{a.title}</h3>
              <Badge color="blue">{a.date}</Badge>
            </div>
            <p style={{ ...S.muted, lineHeight: 1.6 }}>{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ setPage, setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (form.email === "admin@lms.edu" && form.password === "admin123") {
        setUser(ADMIN_USER); setPage("Admin");
      } else if (form.email === "adaeze@student.edu" && form.password === "student123") {
        setUser(MOCK_USER); setPage("Dashboard");
      } else {
        setError("Invalid email or password. Try: adaeze@student.edu / student123");
      }
    }, 800);
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
          <h1 style={{ ...S.h1, fontSize: 28 }}>Welcome Back</h1>
          <p style={S.muted}>Sign in to continue learning</p>
        </div>
        <div style={S.card}>
          {error && <div style={S.alert("error")}>{error}</div>}
          <div style={S.formGroup}>
            <label style={{ ...S.label, display: "block", marginBottom: 6 }}>Email Address</label>
            <input style={S.input} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div style={S.formGroup}>
            <label style={{ ...S.label, display: "block", marginBottom: 6 }}>Password</label>
            <input style={S.input} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: "#2563eb", cursor: "pointer" }}>Forgot password?</span>
          </div>
          <button style={{ ...S.btn("primary"), width: "100%", padding: "12px", fontSize: 15 }} onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#64748b" }}>
            Don't have an account?{" "}
            <span style={{ color: "#2563eb", cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("Register")}>Sign up free</span>
          </div>
          <div style={{ marginTop: 20, padding: 12, background: "#f8fafc", borderRadius: 8, fontSize: 12, color: "#94a3b8" }}>
            <strong>Demo:</strong> adaeze@student.edu / student123<br />
            <strong>Admin:</strong> admin@lms.edu / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
function RegisterPage({ setPage }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleRegister = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSuccess(true);
    setTimeout(() => setPage("Login"), 2000);
  };

  if (success) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
        <h2 style={S.h2}>Account Created!</h2>
        <p style={S.muted}>Redirecting to login…</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
          <h1 style={{ ...S.h1, fontSize: 28 }}>Create Account</h1>
          <p style={S.muted}>Join thousands of learners today</p>
        </div>
        <div style={S.card}>
          {[["Full Name", "name", "text", "Adaeze Okonkwo"], ["Email Address", "email", "email", "you@example.com"], ["Password", "password", "password", "Min. 6 characters"], ["Confirm Password", "confirm", "password", "Repeat password"]].map(([label, key, type, ph]) => (
            <div key={key} style={S.formGroup}>
              <label style={{ ...S.label, display: "block", marginBottom: 6 }}>{label}</label>
              <input style={{ ...S.input, ...(errors[key] ? { borderColor: "#ef4444" } : {}) }} type={type} placeholder={ph} value={form[key]} onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: "" })); }} />
              {errors[key] && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{errors[key]}</div>}
            </div>
          ))}
          <button style={{ ...S.btn("primary"), width: "100%", padding: "12px", fontSize: 15 }} onClick={handleRegister}>
            Create Account
          </button>
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#64748b" }}>
            Already have an account?{" "}
            <span style={{ color: "#2563eb", cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("Login")}>Sign in</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#eff6ff,#f5f3ff)", padding: "60px 24px", textAlign: "center" }}>
        <h1 style={{ ...S.h1, fontSize: 40 }}>About LearnHub</h1>
        <p style={{ ...S.muted, fontSize: 18, maxWidth: 600, margin: "16px auto 0", lineHeight: 1.6 }}>
          Empowering learners across Nigeria and beyond with free, world-class education.
        </p>
      </div>
      <div style={S.page}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
          <div style={S.card}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🎯</div>
            <h3 style={{ ...S.h3, marginBottom: 12 }}>Our Mission</h3>
            <p style={{ ...S.muted, lineHeight: 1.7 }}>To democratize quality education by making world-class courses accessible to every learner, regardless of background or location.</p>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>👁️</div>
            <h3 style={{ ...S.h3, marginBottom: 12 }}>Our Vision</h3>
            <p style={{ ...S.muted, lineHeight: 1.7 }}>A world where every person has access to the skills they need to build a better future for themselves and their communities.</p>
          </div>
        </div>

        <h2 style={S.h2}>Meet Our Instructors</h2>
        <div style={S.grid3}>
          {[...new Map(MOCK_COURSES.map(c => [c.instructor, c])).values()].map(c => (
            <div key={c.instructor} style={{ ...S.card, textAlign: "center" }}>
              <div style={{ ...S.avatar(52), margin: "0 auto 12px" }}>{c.instructor.split(" ").slice(-1)[0][0]}{c.instructor.split(" ")[0][0]}</div>
              <h3 style={{ ...S.h3, marginBottom: 4, fontSize: 15 }}>{c.instructor}</h3>
              <Badge color="blue">{c.category}</Badge>
              <p style={{ ...S.muted, fontSize: 13, marginTop: 10 }}>Teaching {c.title}</p>
            </div>
          ))}
        </div>

        <div style={{ ...S.card, marginTop: 32, background: "linear-gradient(135deg,#eff6ff,#f5f3ff)", border: "1px solid #dbeafe", textAlign: "center", padding: 48 }}>
          <h2 style={{ ...S.h2, margin: "0 0 12px" }}>Ready to start learning?</h2>
          <p style={{ ...S.muted, marginBottom: 24 }}>Join over 5,000 students already learning on LearnHub.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button style={{ ...S.btn("primary"), padding: "12px 28px", fontSize: 15 }}>Browse Courses</button>
            <button style={{ ...S.btn("ghost"), padding: "12px 28px", fontSize: 15 }}>Sign Up Free</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div style={S.page}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={S.h1}>Contact Us</h1>
          <p style={{ ...S.muted, marginTop: 8 }}>Have a question or feedback? We'd love to hear from you.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 24 }}>
          <div>
            <div style={{ ...S.card, marginBottom: 16 }}>
              <h3 style={{ ...S.h3, marginBottom: 16 }}>Get in Touch</h3>
              {[["📧", "Email", "support@learnhub.edu"], ["📞", "Phone", "+234 800 LEARN 01"], ["📍", "Address", "12 University Road, Lagos, Nigeria"], ["🕒", "Hours", "Mon–Fri, 8AM–6PM WAT"]].map(([icon, label, val]) => (
                <div key={label} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontSize: 14, color: "#1a1d2e" }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ ...S.card, background: "#eff6ff", border: "1px solid #dbeafe" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>💬</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Live Chat</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Chat with our support team during business hours for instant help.</div>
            </div>
          </div>

          <div style={S.card}>
            {sent && <div style={S.alert("success")}>✅ Message sent! We'll reply within 24 hours.</div>}
            <h3 style={{ ...S.h3, marginBottom: 20 }}>Send a Message</h3>
            {[["Name", "name", "text", "Your full name"], ["Email", "email", "email", "your@email.com"], ["Subject", "subject", "text", "How can we help?"]].map(([label, key, type, ph]) => (
              <div key={key} style={S.formGroup}>
                <label style={{ ...S.label, display: "block", marginBottom: 6 }}>{label}</label>
                <input style={S.input} type={type} placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <div style={S.formGroup}>
              <label style={{ ...S.label, display: "block", marginBottom: 6 }}>Message</label>
              <textarea style={{ ...S.input, height: 120, resize: "vertical" }} placeholder="Tell us more…" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            </div>
            <button style={{ ...S.btn("primary"), width: "100%", padding: 12, fontSize: 15 }} onClick={handleSubmit}>Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 404 PAGE ─────────────────────────────────────────────────────────────────
function NotFoundPage({ setPage }) {
  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div>
        <div style={{ fontSize: 80 }}>404</div>
        <h2 style={{ ...S.h2, color: "#64748b" }}>Page Not Found</h2>
        <p style={S.muted}>The page you're looking for doesn't exist.</p>
        <button style={{ ...S.btn("primary"), marginTop: 20 }} onClick={() => setPage("Home")}>Go Home</button>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: "#1a1d2e", color: "#94a3b8", marginTop: 60 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 12 }}>🎓 LearnHub</div>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>Empowering learners with free, world-class education. Built with React by Group A.</p>
          </div>
          {[
            ["Platform", ["Home", "Courses", "Dashboard", "About"]],
            ["Support", ["Contact", "FAQ", "Help Center", "Community"]],
            ["Legal", ["Privacy Policy", "Terms of Use", "Cookie Policy", "Accessibility"]],
          ].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 14, fontSize: 14 }}>{title}</div>
              {links.map(l => (
                <div key={l} style={{ fontSize: 14, marginBottom: 8, cursor: "pointer" }} onClick={() => setPage(l)}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #2d3148", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13 }}>© 2025 LearnHub LMS · Group A — Computer & Electronics 200 Level Project</div>
          <div style={{ fontSize: 13 }}>Built with ⚛️ React · Deployed on Vercel/Netlify</div>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Home");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("lms_user");
    if (saved) { try { setUser(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("lms_user", JSON.stringify(user));
    else localStorage.removeItem("lms_user");
  }, [user]);

  const handleLogout = () => { setUser(null); setPage("Home"); };

  const renderPage = () => {
    switch (page) {
      case "Home": return <HomePage setPage={setPage} user={user} />;
      case "Courses": return <CoursesPage user={user} setPage={setPage} />;
      case "Dashboard": return user ? <DashboardPage user={user} /> : <LoginPage setPage={setPage} setUser={setUser} />;
      case "Profile": return user ? <ProfilePage user={user} setUser={setUser} /> : <LoginPage setPage={setPage} setUser={setUser} />;
      case "Admin": return user?.role === "admin" ? <AdminPage /> : <LoginPage setPage={setPage} setUser={setUser} />;
      case "Students": return user?.role === "admin" ? <StudentsPage /> : <LoginPage setPage={setPage} setUser={setUser} />;
      case "Announcements": return <AnnouncementsPage />;
      case "Login": return <LoginPage setPage={setPage} setUser={setUser} />;
      case "Register": return <RegisterPage setPage={setPage} />;
      case "About": return <AboutPage />;
      case "Contact": return <ContactPage />;
      default: return <NotFoundPage setPage={setPage} />;
    }
  };

  return (
    <div style={S.app}>
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <main>{renderPage()}</main>
      <Footer setPage={setPage} />
    </div>
  );
}
