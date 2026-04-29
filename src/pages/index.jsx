import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0a0a0a; --bg2: #111; --bg3: #1a1a1a;
    --accent: #c8f560; --accent2: #a8d940;
    --text: #f0f0f0; --muted: #888; --border: #222; --card: #141414;
  }

  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }

  /* CURTAIN */
  .pf-curtain {
    position: fixed; inset: 0; z-index: 999;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none;
  }
  .pf-curtain-top, .pf-curtain-bot {
    position: absolute; left: 0; right: 0; height: 50%; background: #0a0a0a;
    transition: transform .9s cubic-bezier(.76,0,.24,1);
  }
  .pf-curtain-top { top: 0; }
  .pf-curtain-bot { bottom: 0; }
  .pf-curtain.open .pf-curtain-top { transform: translateY(-100%); }
  .pf-curtain.open .pf-curtain-bot { transform: translateY(100%); }
  .pf-curtain-label {
    position: relative; z-index: 1;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(3rem,10vw,7rem); letter-spacing: -.04em; color: var(--accent);
    opacity: 0; transform: translateY(20px);
    transition: opacity .5s .2s, transform .5s .2s;
  }
  .pf-curtain.visible .pf-curtain-label { opacity: 1; transform: none; }
  .pf-curtain.open .pf-curtain-label { opacity: 0; transition: opacity .3s; }

  /* CONTENT REVEAL */
  .pf-content { opacity: 0; transform: translateY(16px); transition: opacity .6s 1s, transform .6s 1s; }
  .pf-content.visible { opacity: 1; transform: none; }

  /* NAV */
  .pf-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 1.5rem 3rem; display: flex; justify-content: space-between;
    align-items: center; border-bottom: 1px solid transparent; transition: all .3s;
  }
  .pf-nav.scrolled { background: rgba(10,10,10,.9); border-color: var(--border); backdrop-filter: blur(10px); }
  .pf-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem; letter-spacing: -.02em; color: var(--accent); text-decoration: none; }
  .pf-nav-links { display: flex; gap: 2rem; list-style: none; }
  .pf-nav-links a { color: var(--muted); text-decoration: none; font-size: .85rem; letter-spacing: .05em; text-transform: uppercase; transition: color .2s; }
  .pf-nav-links a:hover { color: var(--accent); }

  /* HAMBURGER */
  .pf-hamburger {
    display: none; flex-direction: column; gap: 5px; cursor: pointer;
    background: none; border: none; padding: 4px;
  }
  .pf-hamburger span {
    display: block; width: 22px; height: 2px; background: var(--text);
    transition: all .3s;
  }
  .pf-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .pf-hamburger.open span:nth-child(2) { opacity: 0; }
  .pf-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* MOBILE MENU */
  .pf-mobile-menu {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(10,10,10,.97); backdrop-filter: blur(12px);
    flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem;
    opacity: 0; pointer-events: none; transition: opacity .3s;
  }
  .pf-mobile-menu.open { opacity: 1; pointer-events: all; }
  .pf-mobile-menu a {
    font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800;
    letter-spacing: -.03em; color: var(--muted); text-decoration: none; transition: color .2s;
  }
  .pf-mobile-menu a:hover { color: var(--accent); }

  .pf-section { padding: 6rem 3rem; }

  /* HERO */
  .pf-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding-top: 8rem; position: relative; overflow: hidden; }
  .pf-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .pf-hero-tag { display: inline-flex; align-items: center; gap: .5rem; background: rgba(200,245,96,.08); border: 1px solid rgba(200,245,96,.2); color: var(--accent); padding: .4rem 1rem; border-radius: 2rem; font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 1.5rem; }
  .pf-pulse { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pf-pulse 2s infinite; flex-shrink: 0; }
  @keyframes pf-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .pf-h1 { font-family: 'Syne', sans-serif; font-size: clamp(2.6rem,6vw,5.5rem); font-weight: 800; line-height: 1; letter-spacing: -.04em; margin-bottom: 1.5rem; }
  .pf-h1-line { display: block; overflow: hidden; }
  .pf-h1-line span { display: block; animation: pf-slideUp .8s cubic-bezier(.16,1,.3,1) both; }
  .pf-h1-line:nth-child(2) span { animation-delay: .1s; }
  .pf-h1-line:nth-child(3) span { animation-delay: .2s; }
  .pf-accent { color: var(--accent); }
  @keyframes pf-slideUp { from{transform:translateY(110%);opacity:0} to{transform:translateY(0);opacity:1} }
  .pf-hero-desc { color: var(--muted); line-height: 1.7; font-size: 1rem; max-width: 42ch; margin-bottom: 2.5rem; }
  .pf-hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
  .pf-btn { padding: .75rem 1.75rem; border-radius: .35rem; font-family: 'DM Sans', sans-serif; font-size: .9rem; font-weight: 500; transition: all .2s; text-decoration: none; display: inline-flex; align-items: center; gap: .5rem; cursor: pointer; border: none; }
  .pf-btn-primary { background: var(--accent); color: #0a0a0a; }
  .pf-btn-primary:hover { background: var(--accent2); transform: translateY(-2px); }
  .pf-btn-outline { border: 1px solid var(--border); color: var(--text); background: transparent; }
  .pf-btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .pf-hero-card { background: var(--card); border: 1px solid var(--border); border-radius: 1.2rem; padding: 2rem; position: relative; overflow: hidden; }
  .pf-hero-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 70% 20%, rgba(200,245,96,.06), transparent 60%); pointer-events: none; }
  .pf-avatar { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #6ee7b7); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.8rem; color: #0a0a0a; margin-bottom: 1.2rem; }
  .pf-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-top: 1.5rem; }
  .pf-stat { background: var(--bg3); border-radius: .75rem; padding: 1rem; border: 1px solid var(--border); }
  .pf-stat-num { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 700; color: var(--accent); }
  .pf-stat-label { font-size: .75rem; color: var(--muted); margin-top: .25rem; }
  .pf-skills-strip { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1rem; }
  .pf-skill-chip { background: var(--bg3); border: 1px solid var(--border); padding: .3rem .8rem; border-radius: .25rem; font-size: .75rem; color: var(--muted); }

  .pf-section-label { font-size: .75rem; text-transform: uppercase; letter-spacing: .15em; color: var(--accent); margin-bottom: 1rem; display: flex; align-items: center; gap: .75rem; }
  .pf-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .pf-h2 { font-family: 'Syne', sans-serif; font-size: clamp(2rem,4vw,3rem); font-weight: 800; letter-spacing: -.03em; margin-bottom: .75rem; }

  /* PROJECTS */
  .pf-projects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3rem; }
  .pf-project-card { background: var(--card); border: 1px solid var(--border); border-radius: 1.2rem; padding: 1.75rem; transition: all .3s; position: relative; overflow: hidden; }
  .pf-project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--accent), transparent); transform: scaleX(0); transition: transform .4s; }
  .pf-project-card:hover::before { transform: scaleX(1); }
  .pf-project-card:hover { border-color: #333; transform: translateY(-4px); }
  .pf-project-featured { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; }
  .pf-project-num { font-family: 'Syne', sans-serif; font-size: .75rem; color: var(--accent); letter-spacing: .1em; margin-bottom: .75rem; }
  .pf-project-title { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: .5rem; }
  .pf-project-desc { font-size: .85rem; color: var(--muted); line-height: 1.7; margin-bottom: 1.2rem; }
  .pf-metrics { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.2rem; }
  .pf-metric { display: flex; align-items: center; gap: .4rem; font-size: .8rem; }
  .pf-metric-val { font-family: 'Syne', sans-serif; font-weight: 700; color: var(--accent); }
  .pf-metric-label { color: var(--muted); }
  .pf-tech-tags { display: flex; flex-wrap: wrap; gap: .4rem; }
  .pf-tech-tag { background: rgba(200,245,96,.06); border: 1px solid rgba(200,245,96,.15); color: var(--accent); padding: .25rem .65rem; border-radius: .2rem; font-size: .72rem; font-weight: 500; }
  .pf-project-link { display: inline-flex; align-items: center; gap: .4rem; color: var(--muted); font-size: .8rem; text-decoration: none; margin-top: 1rem; transition: color .2s; }
  .pf-project-link:hover { color: var(--accent); }
  .pf-project-visual { background: var(--bg3); border-radius: .75rem; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid var(--border); font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800; color: rgba(200,245,96,.08); letter-spacing: -.05em; }

  /* SKILLS — updated pill styles */
  .pf-skills-bg { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .pf-skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 1.5rem; margin-top: 3rem; }
  .pf-skill-cat { background: var(--card); border: 1px solid var(--border); border-radius: 1rem; padding: 1.5rem; }
  .pf-skill-cat-icon { width: 36px; height: 36px; background: rgba(200,245,96,.1); border-radius: .5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; font-size: 1rem; }
  .pf-skill-cat-title { font-family: 'Syne', sans-serif; font-size: .85rem; font-weight: 700; margin-bottom: .75rem; }
  .pf-skill-pills { display: flex; flex-wrap: wrap; gap: .5rem; }

  /* BLACK LOGOS — light pill bg so black icons are visible */
  .pf-skill-pill {
    display: flex; align-items: center; gap: .45rem;
    background: #ebebeb; border: 1px solid #ccc;
    padding: .32rem .75rem; border-radius: .25rem;
    font-size: .72rem; font-weight: 500; color: #1a1a1a;
    transition: border-color .2s, background .2s;
  }
  .pf-skill-pill:hover { border-color: #999; background: #e0e0e0; }
  .pf-skill-pill img {
    width: 18px; height: 18px; object-fit: contain;
    filter: brightness(0);
    transition: filter .2s;
    flex-shrink: 0;
  }

  /* EXPERIENCE */
  .pf-exp-list { margin-top: 3rem; display: flex; flex-direction: column; gap: 1rem; }
  .pf-exp-item { background: var(--card); border: 1px solid var(--border); border-radius: 1rem; padding: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; transition: border-color .2s; }
  .pf-exp-item:hover { border-color: #333; }
  .pf-exp-role { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; margin-bottom: .25rem; }
  .pf-exp-org { font-size: .85rem; color: var(--accent); }
  .pf-exp-period { font-size: .8rem; color: var(--muted); white-space: nowrap; background: var(--bg3); padding: .3rem .8rem; border-radius: .25rem; border: 1px solid var(--border); align-self: flex-start; flex-shrink: 0; }

  /* CONTACT */
  .pf-contact-bg { background: var(--bg2); border-top: 1px solid var(--border); }
  .pf-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; margin-top: 3rem; }
  .pf-contact-big { font-family: 'Syne', sans-serif; font-size: clamp(2.5rem,5vw,4.5rem); font-weight: 800; letter-spacing: -.04em; line-height: 1; }
  .pf-contact-links { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
  .pf-contact-link { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: var(--card); border: 1px solid var(--border); border-radius: .75rem; text-decoration: none; color: var(--text); transition: all .2s; font-size: .9rem; }
  .pf-contact-link:hover { border-color: var(--accent); color: var(--accent); }
  .pf-achievements { margin-top: 1.5rem; padding: 1.25rem; background: var(--card); border: 1px solid var(--border); border-radius: 1rem; }
  .pf-achievement-label { font-size: .75rem; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: .75rem; }
  .pf-achievement-row { display: flex; justify-content: space-between; font-size: .85rem; margin-bottom: .6rem; gap: 1rem; }
  .pf-achievement-row:last-child { margin-bottom: 0; }

  /* FOOTER */
  .pf-footer { padding: 2rem 3rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
  .pf-footer-name { font-family: 'Syne', sans-serif; font-weight: 700; color: var(--muted); font-size: .85rem; }
  .pf-dot { width: 4px; height: 4px; background: var(--accent); border-radius: 50%; display: inline-block; margin: 0 .5rem; vertical-align: middle; }

  .pf-bg-glow { position: fixed; top: -20%; left: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(200,245,96,.04), transparent 60%); pointer-events: none; z-index: 0; }
  .pf-bg-glow2 { position: fixed; bottom: -20%; right: -10%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(110,231,183,.03), transparent 60%); pointer-events: none; z-index: 0; }

  /* ── RESPONSIVE ── */

  /* Tablet: 768px–1024px */
  @media (max-width: 1024px) {
    .pf-nav { padding: 1.2rem 2rem; }
    .pf-section { padding: 5rem 2rem; }
    .pf-hero-grid { gap: 2.5rem; }
    .pf-contact-grid { gap: 2.5rem; }
    .pf-footer { padding: 2rem; }
  }

  /* Mobile: ≤768px */
  @media (max-width: 768px) {
    .pf-nav { padding: 1rem 1.25rem; }
    .pf-nav-links { display: none; }
    .pf-hamburger { display: flex; }
    .pf-mobile-menu { display: flex; }

    .pf-section { padding: 4rem 1.25rem; }

    /* Hero stacks vertically; card comes first on mobile */
    .pf-hero { padding-top: 6rem; min-height: auto; padding-bottom: 3rem; }
    .pf-hero-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .pf-hero-grid > div:first-child { order: 2; }
    .pf-hero-grid > div:last-child  { order: 1; }
    .pf-hero-desc { max-width: 100%; }

    /* Projects: single column */
    .pf-projects-grid { grid-template-columns: 1fr; }
    .pf-project-featured { grid-column: auto; grid-template-columns: 1fr; }
    .pf-project-visual { display: none; }

    /* Skills: 2-col on mobile min */
    .pf-skills-grid { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; }
    .pf-skill-cat { padding: 1.1rem; }

    /* Experience: stack period badge below role */
    .pf-exp-item { flex-direction: column; gap: .75rem; }
    .pf-exp-period { align-self: flex-start; }

    /* Contact: single column */
    .pf-contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }

    /* Achievement row: allow wrapping */
    .pf-achievement-row { flex-wrap: wrap; }

    .pf-footer { padding: 1.5rem 1.25rem; flex-direction: column; text-align: center; }

    .pf-stat-grid { gap: .5rem; }
  }

  /* Small mobile: ≤420px */
  @media (max-width: 420px) {
    .pf-skills-grid { grid-template-columns: 1fr; }
    .pf-stat-grid { grid-template-columns: 1fr 1fr; }
    .pf-hero-btns { flex-direction: column; }
    .pf-btn { width: 100%; justify-content: center; }
    .pf-skill-pill { font-size: .68rem; }
    .pf-skill-pill img { width: 16px; height: 16px; }
  }
`;

const ICON = (slug) => `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`;

const skillCategories = [
  {
    icon: "✦", title: "Design Tools",
    skills: [
      { name: "Figma",         logo: ICON("figma") },
      { name: "Photoshop",     logo: ICON("adobephotoshop") },
      { name: "Canva",         logo: ICON("canva") },
      { name: "Final Cut Pro", logo: ICON("apple") },
      { name: "Motion",        logo: ICON("apple") },
    ],
  },
  {
    icon: "◈", title: "UI/UX",
    skills: [
      { name: "Wireframing" },
      { name: "Prototyping" },
      { name: "Responsive Design" },
      { name: "Design Systems" },
      { name: "Accessibility" },
    ],
  },
  {
    icon: "⬡", title: "Frontend",
    skills: [
      { name: "React.js",     logo: ICON("react") },
      { name: "Next.js",      logo: ICON("nextdotjs") },
      { name: "Tailwind CSS", logo: ICON("tailwindcss") },
      { name: "TypeScript",   logo: ICON("typescript") },
      { name: "Three.js",     logo: ICON("threedotjs") },
    ],
  },
  {
    icon: "◎", title: "Motion & Visual",
    skills: [
      { name: "Animation" },
      { name: "Micro-interactions" },
      { name: "Video Editing" },
      { name: "Visual Storytelling" },
    ],
  },
  {
    icon: "▣", title: "Backend & Cloud",
    skills: [
      { name: "Node.js",  logo: ICON("nodedotjs") },
      { name: "Firebase", logo: ICON("firebase") },
      { name: "MongoDB",  logo: ICON("mongodb") },
      { name: "Vercel",   logo: ICON("vercel") },
      { name: "AWS",      logo: ICON("amazonwebservices") },
    ],
  },
  {
    icon: "◇", title: "Languages",
    skills: [
      { name: "JavaScript", logo: ICON("javascript") },
      { name: "TypeScript", logo: ICON("typescript") },
      { name: "Python",     logo: ICON("python") },
      { name: "C++",        logo: ICON("cplusplus") },
    ],
  },
];

const projects = [
  {
    num: "01 — Featured",
    title: "ICMACC 2026 – IEEE Conference Platform",
    desc: "Official portal for the 3rd IEEE-sponsored International Conference on Microelectronics, Automation, Computing & Communications Systems hosted at VNRVJIET, Hyderabad.",
    metrics: [{ val: "13,000+", label: "site visits" }, { val: "99%", label: "uptime" }],
    tech: ["Next.js", "Firebase", "Razorpay", "Firestore"],
    link: "https://icmacc.org", linkLabel: "icmacc.org",
    featured: true, visual: "ICMACC", visualSub: "IEEE 2026",
  },
  {
    num: "02",
    title: "QElectric – Corporate Website",
    desc: "Responsive corporate site for an electrical solutions brand with an interactive 3D model and Vercel-optimised deployment.",
    metrics: [{ val: "25%", label: "engagement boost" }, { val: "~30%", label: "faster loads" }],
    tech: ["Next.js", "React", "Tailwind", "Three.js", "Vercel"],
    link: "https://www.qelectric.in", linkLabel: "qelectric.in",
  },
  {
    num: "03",
    title: "Sintillashunz – Cultural Fest Website",
    desc: "Vibrant digital hub for VNRVJIET's annual cultural fest — event discovery, registrations, and schedules.",
    metrics: [{ val: "2,500+", label: "registrations" }],
    tech: ["Firebase", "Hosting", "Firestore"],
    link: "https://sintillashunz.vnrvjiet.ac.in", linkLabel: "sintillashunz.vnrvjiet.ac.in",
  },
];

const positions = [
  { role: "WebMaster", org: "IEEE Student Body, VNRVJIET", period: "2026 – Present" },
  { role: "Core Design Member", org: "ED-Cell, VNRVJIET", period: "2023 – Present" },
  { role: "Logo Designer & Design Team Member", org: "Social Media Club, VNRVJIET", period: "2026 – Present" },
  { role: "Volunteer", org: "Ecficio 7.0H Entrepreneurship Fest, VNRVJIET", period: "Feb 2025" },
  { role: "Volunteer", org: "International Conference on Digital Humanities (ICDH), VNRVJIET", period: "Jan 2024" },
];

const achievements = [
  { title: "2nd Place — Startup Expo, Krithomedh", year: "Feb 2026" },
  { title: "SIH 2025 — Intra-college qualified", year: "2025" },
  { title: "Top 100 Coders — Rank 75, Krithomedh", year: "2025" },
];

export default function Portfolio() {
  const [phase, setPhase] = useState("init");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Bhuwan Kumar Rasala — Portfolio";
    const t1 = setTimeout(() => setPhase("visible"), 120);
    const t2 = setTimeout(() => setPhase("open"),    1500);
    const t3 = setTimeout(() => setPhase("done"),    2500);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const curtainClass = [
    "pf-curtain",
    phase === "visible" || phase === "open" ? "visible" : "",
    phase === "open" ? "open" : "",
  ].filter(Boolean).join(" ");

  const navItems = [
    { id: "projects",  label: "Work" },
    { id: "skills",    label: "Skills" },
    { id: "positions", label: "Experience" },
    { id: "contact",   label: "Contact" },
  ];

  return (
    <>
      <style>{styles}</style>

      {/* ── CURTAIN WIPE ── */}
      {phase !== "done" && (
        <div className={curtainClass}>
          <div className="pf-curtain-top" />
          <div className="pf-curtain-label">RBK.</div>
          <div className="pf-curtain-bot" />
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className={`pf-content${phase === "open" || phase === "done" ? " visible" : ""}`}>
        <div className="pf-bg-glow" />
        <div className="pf-bg-glow2" />

        {/* NAV */}
        <nav className={`pf-nav${scrolled ? " scrolled" : ""}`}>
          <a className="pf-logo" href="#home">RBK.</a>

          {/* Desktop links */}
          <ul className="pf-nav-links">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            className={`pf-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </nav>

        {/* Mobile menu overlay */}
        <div className={`pf-mobile-menu${menuOpen ? " open" : ""}`}>
          {navItems.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>
              {label}
            </a>
          ))}
        </div>

        {/* HERO */}
        <section className="pf-hero pf-section" id="home">
          <div className="pf-hero-grid">
            <div>
              <h1 className="pf-h1">
                <span className="pf-h1-line"><span>UI/UX</span></span>
                <span className="pf-h1-line"><span>Designer &</span></span>
                <span className="pf-h1-line"><span><em className="pf-accent">Developer.</em></span></span>
              </h1>
              <p className="pf-hero-desc">
                Hi, I'm <strong style={{ color: "var(--text)" }}>Bhuwan Kumar Rasala</strong> — crafting intuitive digital experiences at the intersection of design and code. From interactive 3D websites to IEEE conference platforms serving global audiences.
              </p>
              <div className="pf-hero-btns">
                <button className="pf-btn pf-btn-primary" onClick={() => scrollTo("projects")}>View Work →</button>
                <button className="pf-btn pf-btn-outline" onClick={() => scrollTo("contact")}>Get in Touch</button>
              </div>
            </div>
            <div>
              <div className="pf-hero-card">
                <div className="pf-avatar">RBK.</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: ".25rem" }}>
                  Bhuwan Kumar Rasala
                </div>
                <div style={{ fontSize: ".85rem", color: "var(--muted)" }}>B.Tech CSE (IoT) · VNRVJIET · GPA 7.65</div>
                <div className="pf-stat-grid">
                  {[
                    { num: "13K+",  label: "Site visits delivered" },
                    { num: "2.5K+", label: "Registrations handled" },
                    { num: "3+",    label: "Live projects" },
                    { num: "25%",   label: "Engagement boost" },
                  ].map((s) => (
                    <div className="pf-stat" key={s.num}>
                      <div className="pf-stat-num">{s.num}</div>
                      <div className="pf-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="pf-skills-strip">
                  {["Figma", "Next.js", "Photoshop", "Firebase", "React"].map((t) => (
                    <span className="pf-skill-chip" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="pf-section" id="projects" style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
          <div className="pf-section-label">Selected Work</div>
          <h2 className="pf-h2">Projects</h2>
          <p style={{ color: "var(--muted)", maxWidth: "55ch" }}>
            Real-world platforms with measurable impact — from corporate identity to international academic conferences.
          </p>
          <div className="pf-projects-grid">
            {projects.map((p) => (
              <div key={p.num} className={`pf-project-card${p.featured ? " pf-project-featured" : ""}`}>
                <div>
                  <div className="pf-project-num">{p.num}</div>
                  <div className="pf-project-title">{p.title}</div>
                  <div className="pf-project-desc">{p.desc}</div>
                  <div className="pf-metrics">
                    {p.metrics.map((m) => (
                      <div className="pf-metric" key={m.val}>
                        <span className="pf-metric-val">{m.val}</span>
                        <span className="pf-metric-label">{m.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pf-tech-tags">
                    {p.tech.map((t) => <span className="pf-tech-tag" key={t}>{t}</span>)}
                  </div>
                  <a href={p.link} className="pf-project-link" target="_blank" rel="noreferrer">
                    {p.linkLabel} 
                  </a>
                </div>
                {p.featured && (
                  <div className="pf-project-visual">
                    <span>{p.visual}</span>
                    <span style={{ fontSize: "1rem", color: "rgba(200,245,96,.15)", marginTop: ".5rem" }}>{p.visualSub}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section className="pf-section pf-skills-bg" id="skills">
          <div className="pf-section-label">Toolkit</div>
          <h2 className="pf-h2">Skills</h2>
          <div className="pf-skills-grid">
            {skillCategories.map((cat) => (
              <div className="pf-skill-cat" key={cat.title}>
                <div className="pf-skill-cat-icon">{cat.icon}</div>
                <div className="pf-skill-cat-title">{cat.title}</div>
                <div className="pf-skill-pills">
                  {cat.skills.map((s) => (
                    <span className="pf-skill-pill" key={s.name}>
                      {s.logo && (
                        <img
                          src={s.logo}
                          alt={s.name}
                          width={18}
                          height={18}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      )}
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* POSITIONS */}
        <section className="pf-section" id="positions">
          <div className="pf-section-label">Experience</div>
          <h2 className="pf-h2">Positions of Responsibility</h2>
          <div className="pf-exp-list">
            {positions.map((p) => (
              <div className="pf-exp-item" key={p.role + p.org}>
                <div>
                  <div className="pf-exp-role">{p.role}</div>
                  <div className="pf-exp-org">{p.org}</div>
                </div>
                <div className="pf-exp-period">{p.period}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="pf-section pf-contact-bg" id="contact">
          <div className="pf-section-label">Let's Talk</div>
          <div className="pf-contact-grid">
            <div>
              <div className="pf-contact-big">
                Let's build<br />something<br /><em className="pf-accent">great.</em>
              </div>
              <p style={{ color: "var(--muted)", marginTop: "1.5rem", lineHeight: 1.7, fontSize: ".9rem" }}>
                Open to UI/UX roles, freelance projects, and collaborations. Currently pursuing B.Tech CSE (IoT) at VNRVJIET.
              </p>
            </div>
            <div>
              <div className="pf-contact-links">
                <a href="mailto:bhuwan1013@gmail.com" className="pf-contact-link">
                  <span>Email</span>
                  <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>→</span>
                </a>
                <a href="https://icmacc.org" className="pf-contact-link" target="_blank" rel="noreferrer">
                  <span>ICMACC Project</span>
                  <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>icmacc.org →</span>
                </a>
                <a href="https://www.qelectric.in" className="pf-contact-link" target="_blank" rel="noreferrer">
                  <span>QElectric Project</span>
                  <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>qelectric.in →</span>
                </a>
              </div>
              <div className="pf-achievements">
                <div className="pf-achievement-label">Achievements</div>
                {achievements.map((a) => (
                  <div className="pf-achievement-row" key={a.title}>
                    <span>{a.title}</span>
                    <span style={{ color: "var(--accent)", flexShrink: 0 }}>{a.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pf-footer">
          <div className="pf-footer-name">
            Bhuwan Kumar Rasala <span className="pf-dot" /> UI/UX Designer & Developer <span className="pf-dot" /> VNRVJIET
          </div>
          <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>B.Tech CSE IoT · 2023–Present</div>
        </footer>
      </div>
    </>
  );
}