import { useState, useEffect, useRef } from "react";

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

  /* ── SCROLL ANIMATIONS ── */
  .reveal {
    opacity: 0; transform: translateY(28px);
    transition: opacity .55s cubic-bezier(.16,1,.3,1), transform .55s cubic-bezier(.16,1,.3,1);
    transition-delay: var(--reveal-delay, 0s);
  }
  .reveal.in { opacity: 1; transform: none; }
  .reveal-left {
    opacity: 0; transform: translateX(-24px);
    transition: opacity .5s cubic-bezier(.16,1,.3,1), transform .5s cubic-bezier(.16,1,.3,1);
    transition-delay: var(--reveal-delay, 0s);
  }
  .reveal-left.in { opacity: 1; transform: none; }

  /* ── NAV ── */
  .pf-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 1.5rem 3rem; display: flex; justify-content: space-between;
    align-items: center; border-bottom: 1px solid transparent; transition: all .3s;
    z-index: 210;
  }
  .pf-nav.scrolled { background: rgba(10,10,10,.9); border-color: var(--border); backdrop-filter: blur(10px); }
  .pf-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem; letter-spacing: -.02em; color: var(--accent); text-decoration: none; }
  .pf-nav-links { display: flex; gap: 2rem; list-style: none; }
  .pf-nav-links a { color: var(--muted); text-decoration: none; font-size: .85rem; letter-spacing: .05em; text-transform: uppercase; transition: color .2s; }
  .pf-nav-links a:hover { color: var(--accent); }

  .pf-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
  .pf-hamburger span { display: block; width: 22px; height: 2px; background: var(--text); transition: all .3s; }
  .pf-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .pf-hamburger.open span:nth-child(2) { opacity: 0; }
  .pf-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  .pf-mobile-menu {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(10,10,10,.97); backdrop-filter: blur(12px);
    flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem;
    opacity: 0; pointer-events: none; transition: opacity .3s;
  }
  .pf-mobile-menu.open { opacity: 1; pointer-events: all; }
  .pf-mobile-menu a { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; letter-spacing: -.03em; color: var(--muted); text-decoration: none; transition: color .2s; }
  .pf-mobile-menu a:hover { color: var(--accent); }

  .pf-section { padding: 6rem 3rem; position: relative; z-index: 205; }

  /* ══════════════════════════════════════════════
     THE SINGLE FLYING ELEMENT
     Starts centered on screen, flies to h1 slot,
     stays there permanently (never removed from DOM)
  ══════════════════════════════════════════════ */
.pf-fly {
display:flex;
  align-items:center;
  gap:-0.03em;
  letter-spacing:-0.04em;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
  pointer-events: none;

  font-family: 'Syne', sans-serif;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -.04em;
  line-height: 1;

  display: flex;
  align-items: center;
  gap: 0;
  white-space: nowrap;
}

  /* letter slot — collapses via width */
.fl{
  display:inline-block;
  overflow:hidden;
  white-space:nowrap;
  line-height:1;
  text-align:center;
  transition:
    width .42s cubic-bezier(.22,1,.36,1),
    opacity .28s ease,
    transform .28s ease;
}
  .fl.collapse{
  transform:scaleX(0) scaleY(.5);
  opacity:0;
}

  /* the UI/UX morphing slot */
 .fl-uiux{
  display:inline-block;
  overflow:hidden;
  white-space:nowrap;
  line-height:1;
  text-align:center;
  transition:width .55s cubic-bezier(.22,1,.36,1);
}

  /* black screen — fades out after animation ends */
  .pf-cover {
    position: fixed; inset: 0; z-index: 190;
    background: var(--bg);
    pointer-events: none;
    transition: opacity 0.7s ease;
  }
  .pf-cover.fade { opacity: 0; }
  .pf-cover.off  { display: none; }

  /* ═══════
     HERO
  ═══════ */
  .pf-hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    padding: 8rem 3rem 4rem;
    position: relative;
    z-index: 205;
  }

  .pf-h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.6rem, 6vw, 5.5rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -.04em;
    margin-bottom: 1.5rem;
  }
  /* invisible spacer — holds space for "UI/UX" at hero font size */
  .pf-h1-spacer { display: block; visibility: hidden;
  z index: -10; }

  .pf-h1-line { display: block; overflow: visible; }
  .pf-h1-reveal {
    display: block;
    transform: translateY(110%); opacity: 0;
    transition: transform 0.6s cubic-bezier(.16,1,.3,1), opacity 0.6s cubic-bezier(.16,1,.3,1);
    transition-delay: var(--d, 0s);
  }
  .pf-h1-reveal.in { transform: none; opacity: 1; }

  .pf-accent { color: var(--accent); }

  .pf-hero-tag {
    display: inline-flex; align-items: center; gap: .5rem;
    background: rgba(200,245,96,.08); border: 1px solid rgba(200,245,96,.2);
    color: var(--accent); padding: .4rem 1rem; border-radius: 2rem;
    font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 1.5rem;
    opacity: 0; transition: opacity 0.5s ease 0.05s;
  }
  .pf-hero-tag.in { opacity: 1; }
  .pf-pulse { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse 2s infinite; flex-shrink: 0; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  .pf-hero-desc {
    color: var(--muted); line-height: 1.7; font-size: 1rem; max-width: 42ch; margin-bottom: 2.5rem;
    opacity: 0; transform: translateY(14px);
    transition: opacity 0.5s ease 0.18s, transform 0.5s ease 0.18s;
  }
  .pf-hero-desc.in { opacity: 1; transform: none; }

  .pf-hero-btns {
    display: flex; gap: 1rem; flex-wrap: wrap;
    opacity: 0; transform: translateY(12px);
    transition: opacity 0.5s ease 0.28s, transform 0.5s ease 0.28s;
  }
  .pf-hero-btns.in { opacity: 1; transform: none; }

  .pf-btn { padding: .75rem 1.75rem; border-radius: .35rem; font-family: 'DM Sans', sans-serif; font-size: .9rem; font-weight: 500; transition: all .2s; text-decoration: none; display: inline-flex; align-items: center; gap: .5rem; cursor: pointer; border: none; }
  .pf-btn-primary { background: var(--accent); color: #0a0a0a; }
  .pf-btn-primary:hover { background: var(--accent2); transform: translateY(-2px); }
  .pf-btn-outline { border: 1px solid var(--border); color: var(--text); background: transparent; }
  .pf-btn-outline:hover { border-color: var(--accent); color: var(--accent); }

  .pf-hero-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 1.2rem; padding: 2rem;
    position: relative; overflow: hidden;
    opacity: 0; transform: translateY(18px);
    transition: opacity 0.6s ease 0.12s, transform 0.6s ease 0.12s;
  }
  .pf-hero-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 70% 20%, rgba(200,245,96,.06), transparent 60%); pointer-events: none; }
  .pf-hero-card.in { opacity: 1; transform: none; }

  .pf-avatar { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #6ee7b7); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.8rem; color: #0a0a0a; margin-bottom: 1.2rem; }
  .pf-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-top: 1.5rem; }
  .pf-stat { background: var(--bg3); border-radius: .75rem; padding: 1rem; border: 1px solid var(--border); }
  .pf-stat-num { font-family: 'SpaceGrotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: var(--accent); }
  .pf-stat-label { font-size: .75rem; color: var(--muted); margin-top: .25rem; }
  .pf-skills-strip { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1rem; }
  .pf-skill-chip { background: var(--bg3); border: 1px solid var(--border); padding: .3rem .8rem; border-radius: .25rem; font-size: .75rem; color: var(--muted); }

  .pf-section-label { font-size: .75rem; text-transform: uppercase; letter-spacing: .15em; color: var(--accent); margin-bottom: 1rem; display: flex; align-items: center; gap: .75rem; }
  .pf-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .pf-h2 { font-family: 'Syne', sans-serif; font-size: clamp(2rem,4vw,3rem); font-weight: 800; letter-spacing: -.03em; margin-bottom: .75rem; }

  .pf-projects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3rem; }
  .pf-project-card { background: var(--card); border: 1px solid var(--border); border-radius: 1.2rem; padding: 1.75rem; transition: all .3s; position: relative; overflow: hidden; text-decoration: none; color: inherit; display: block; }
  .pf-project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--accent), transparent); transform: scaleX(0); transition: transform .4s; }
  .pf-project-card:hover::before { transform: scaleX(1); }
  .pf-project-card:hover { border-color: #333; transform: translateY(-4px); }
  .pf-project-featured { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; }
  .pf-project-num { font-family: 'SpaceGrotesk', sans-serif; font-size: .75rem; color: var(--accent); letter-spacing: .1em; margin-bottom: .75rem; }
  .pf-project-title { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: .5rem; }
  .pf-project-desc { font-size: .85rem; color: var(--muted); line-height: 1.7; margin-bottom: 1.2rem; }
  .pf-metrics { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.2rem; }
  .pf-metric { display: flex; align-items: center; gap: .4rem; font-size: .8rem; }
  .pf-metric-val { font-family: 'SpaceGrotesk', sans-serif; font-weight: 700; color: var(--accent); }
  .pf-metric-label { color: var(--muted); }
  .pf-tech-tags { display: flex; flex-wrap: wrap; gap: .4rem; }
  .pf-tech-tag { background: rgba(200,245,96,.06); border: 1px solid rgba(200,245,96,.15); color: var(--accent); padding: .25rem .65rem; border-radius: .2rem; font-size: .72rem; font-weight: 500; }
  .pf-project-visual { background: var(--bg3); border-radius: .75rem; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid var(--border); font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800; color: rgba(200,245,96,.08); letter-spacing: -.05em; }

  .pf-skills-bg { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .pf-skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 1.5rem; margin-top: 3rem; }
  .pf-skill-cat { background: var(--card); border: 1px solid var(--border); border-radius: 1rem; padding: 1.5rem; position: relative; overflow: hidden; }
  .pf-skill-cat::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(200,245,96,.05), transparent 70%); pointer-events: none; opacity: 0; transition: opacity .4s; }
  .pf-skill-cat:hover::after { opacity: 1; }
  .pf-skill-cat-icon { width: 36px; height: 36px; background: rgba(200,245,96,.1); border-radius: .5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; font-size: 1rem; }
  .pf-skill-cat-title { font-family: 'Syne', sans-serif; font-size: .85rem; font-weight: 700; margin-bottom: .75rem; }
  .pf-skill-pills { display: flex; flex-wrap: wrap; gap: .5rem; }
  .pf-skill-pill {
    display: flex; align-items: center; gap: .45rem;
    background: #ebebeb; border: 1px solid #ccc;
    padding: .32rem .75rem; border-radius: .25rem;
    font-size: .72rem; font-weight: 500; color: #1a1a1a;
    opacity: 0; transform: translateY(10px) scale(.95);
    transition: opacity .35s cubic-bezier(.16,1,.3,1), transform .35s cubic-bezier(.16,1,.3,1), background .2s, border-color .2s;
    transition-delay: var(--pill-delay, 0s);
  }
  .pf-skill-pill:hover { border-color: #999; background: #e0e0e0; }
  .pf-skill-pill.pill-in { opacity: 1; transform: none; }
  .pf-skill-pill img { width: 18px; height: 18px; object-fit: contain; filter: brightness(0); flex-shrink: 0; }

  .pf-exp-list { margin-top: 3rem; display: flex; flex-direction: column; gap: 1rem; }
  .pf-exp-item { background: var(--card); border: 1px solid var(--border); border-radius: 1rem; padding: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; transition: border-color .25s, transform .25s; position: relative; overflow: hidden; }
  .pf-exp-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--accent); transform: scaleY(0); transform-origin: bottom; transition: transform .35s cubic-bezier(.16,1,.3,1); border-radius: 0 0 0 1rem; }
  .pf-exp-item:hover { border-color: #333; transform: translateX(4px); }
  .pf-exp-item:hover::before { transform: scaleY(1); }
  .pf-exp-role { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; margin-bottom: .25rem; }
  .pf-exp-org { font-size: .85rem; color: var(--accent); }
  .pf-exp-period { font-size: .8rem; color: var(--muted); white-space: nowrap; background: var(--bg3); padding: .3rem .8rem; border-radius: .25rem; border: 1px solid var(--border); align-self: flex-start; flex-shrink: 0; }

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

  .pf-footer { padding: 2rem 3rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
  .pf-footer-name { font-family: 'Syne', sans-serif; font-weight: 700; color: var(--muted); font-size: .85rem; }
  .pf-dot { width: 4px; height: 4px; background: var(--accent); border-radius: 50%; display: inline-block; margin: 0 .5rem; vertical-align: middle; }

  .pf-bg-glow  { position: fixed; top: -20%; left: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(200,245,96,.04), transparent 60%); pointer-events: none; z-index: 0; }
  .pf-bg-glow2 { position: fixed; bottom: -20%; right: -10%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(110,231,183,.03), transparent 60%); pointer-events: none; z-index: 0; }

  @media (max-width: 1024px) {
    .pf-nav { padding: 1.2rem 2rem; }
    .pf-section { padding: 5rem 2rem; }
    .pf-hero { padding: 7rem 2rem 4rem; gap: 2.5rem; }
    .pf-contact-grid { gap: 2.5rem; }
    .pf-footer { padding: 2rem; }
  }
  @media (max-width: 768px) {
    .pf-nav { padding: 1rem 1.25rem; }
    .pf-nav-links { display: none; }
    .pf-hamburger { display: flex; }
    .pf-mobile-menu { display: flex; }
    .pf-section { padding: 4rem 1.25rem; }
    .pf-hero { padding: 6rem 1.25rem 3rem; grid-template-columns: 1fr; min-height: auto; }
    .pf-hero > div:first-child { order: 2; }
    .pf-hero > div:last-child  { order: 1; }
    .pf-hero-desc { max-width: 100%; }
    .pf-projects-grid { grid-template-columns: 1fr; }
    .pf-project-featured { grid-column: auto; grid-template-columns: 1fr; }
    .pf-project-visual { display: none; }
    .pf-skills-grid { grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap: 1rem; }
    .pf-skill-cat { padding: 1.1rem; }
    .pf-exp-item { flex-direction: column; gap: .75rem; }
    .pf-exp-period { align-self: flex-start; }
    .pf-contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .pf-footer { padding: 1.5rem 1.25rem; flex-direction: column; text-align: center; }
    .pf-stat-grid { gap: .5rem; }
  }
  @media (max-width: 420px) {
    .pf-skills-grid { grid-template-columns: 1fr; }
    .pf-stat-grid { grid-template-columns: 1fr 1fr; }
    .pf-hero-btns { flex-direction: column; }
    .pf-btn { width: 100%; justify-content: center; }
  }
`;

const ICON = (s) => `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${s}.svg`;

const skillCategories = [
  { icon: "✦", title: "Design Tools", skills: [{ name: "Figma", logo: ICON("figma") }, { name: "Photoshop", logo: ICON("adobephotoshop") }, { name: "Canva", logo: ICON("canva") }, { name: "Final Cut Pro", logo: ICON("apple") }, { name: "Motion", logo: ICON("apple") }] },
  { icon: "◈", title: "UI/UX", skills: [{ name: "Wireframing" }, { name: "Prototyping" }, { name: "Responsive Design" }, { name: "Design Systems" }, { name: "Accessibility" }] },
  { icon: "⬡", title: "Frontend", skills: [{ name: "React.js", logo: ICON("react") }, { name: "Next.js", logo: ICON("nextdotjs") }, { name: "Tailwind CSS", logo: ICON("tailwindcss") }, { name: "TypeScript", logo: ICON("typescript") }, { name: "Three.js", logo: ICON("threedotjs") }] },
  { icon: "◎", title: "Motion & Visual", skills: [{ name: "Animation" }, { name: "Micro-interactions" }, { name: "Video Editing" }, { name: "Visual Storytelling" }] },
  { icon: "▣", title: "Backend & Cloud", skills: [{ name: "Node.js", logo: ICON("nodedotjs") }, { name: "Firebase", logo: ICON("firebase") }, { name: "MongoDB", logo: ICON("mongodb") }, { name: "Vercel", logo: ICON("vercel") }, { name: "AWS", logo: ICON("amazonwebservices") }] },
  { icon: "◇", title: "Languages", skills: [{ name: "JavaScript", logo: ICON("javascript") }, { name: "TypeScript", logo: ICON("typescript") }, { name: "Python", logo: ICON("python") }, { name: "C++", logo: ICON("cplusplus") }] },
];

const projects = [
  { num: "01 — Featured", title: "ICMACC 2026 – IEEE Conference Platform", desc: "Official portal for the 3rd IEEE-sponsored International Conference on Microelectronics, Automation, Computing & Communications Systems hosted at VNRVJIET, Hyderabad.", metrics: [{ val: "13,000+", label: "site visits" }, { val: "99%", label: "uptime" }], tech: ["Next.js", "Firebase", "Razorpay", "Firestore"], link: "https://icmacc.org", featured: true, visual: "ICMACC", visualSub: "IEEE 2026" },
  { num: "02", title: "QElectric – Corporate Website", desc: "Responsive corporate site for an electrical solutions brand with an interactive 3D model and Vercel-optimised deployment.", metrics: [{ val: "25%", label: "engagement boost" }, { val: "~30%", label: "faster loads" }], tech: ["Next.js", "React", "Tailwind", "Three.js", "Vercel"], link: "https://www.qelectric.in" },
  { num: "03", title: "Sintillashunz – Cultural Fest Website", desc: "Vibrant digital hub for VNRVJIET's annual cultural fest — event discovery, registrations, and schedules.", metrics: [{ val: "2,500+", label: "registrations" }], tech: ["Firebase", "Hosting", "Firestore"], link: "https://sintillashunz.vnrvjiet.ac.in" },
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

function useScrollReveal(deps = []) {
  const refs = useRef([]);
  useEffect(() => {
    const els = refs.current.filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            e.target.querySelectorAll(".pf-skill-pill").forEach((p, i) =>
              setTimeout(() => p.classList.add("pill-in"), 80 + i * 55)
            );
          } else {
            e.target.classList.remove("in");
            e.target.querySelectorAll(".pf-skill-pill").forEach((p) => p.classList.remove("pill-in"));
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, deps);
  return (i) => (el) => { refs.current[i] = el; };
}

/*
  PHASES
  "rbk"    0ms     — show R B K centered
  "expand" 700ms   — stretch open H U W A N between B and K
  "shrink" 2100ms  — collapse R B H W A N K, leave U
  "uiux"   2700ms  — U expands to UI/UX
  "fly"    3300ms  — UI/UX flies to h1 spacer position
  "done"   4200ms  — hero content reveals, cover gone
*/
export default function Portfolio() {
  const [phase, setPhase]         = useState("rbk");
  const [heroIn, setHeroIn]       = useState(false);
  const [coverFade, setCoverFade] = useState(false);
  const [coverOff, setCoverOff]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const flyRef    = useRef(null);   // the fixed flying element
  const spacerRef = useRef(null);   // invisible h1 spacer we fly onto

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.title = "Bhuwan Kumar Rasala — Portfolio";
    window.scrollTo(0, 0);
    const T = [];

    T.push(setTimeout(() => setPhase("expand"), 700));
    T.push(setTimeout(() => setPhase("shrink"),  2100));
    T.push(setTimeout(() => setPhase("uiux"),    2700));

    T.push(setTimeout(() => {
      setPhase("fly");
      const fly    = flyRef.current;
      const spacer = spacerRef.current;
      if (!fly || !spacer) return;

      const vw      = window.innerWidth;
      const rem     = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const heroFs  = Math.min(5.5 * rem, Math.max(2.6 * rem, 0.06 * vw));
      const introFs = Math.min(7.5 * rem, Math.max(3.2 * rem, 0.10 * vw));
      const scale   = heroFs / introFs;

      const fRect = fly.getBoundingClientRect();
      const sRect = spacer.getBoundingClientRect();

      // Move top-left of fly element to top-left of spacer
      const dx = sRect.left - fRect.left;
      const dy = sRect.top  - fRect.top;

      fly.style.transition      = "transform 0.85s cubic-bezier(0.76,0,0.24,1)";
      fly.style.transformOrigin = "top left";
      fly.style.transform       = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${scale})`;
    }, 3300));

    T.push(setTimeout(() => {
      setPhase("done");
      setHeroIn(true);
      setCoverFade(true);
      // remove cover from DOM after transition
      T.push(setTimeout(() => setCoverOff(true), 800));
    }, 4200));

    return () => T.forEach(clearTimeout);
  }, []);

  useEffect(() => {
  const fn = () => {
    const y = window.scrollY;
    setScrollY(y);
    setScrolled(y > 50);
  };

  window.addEventListener("scroll", fn);
  fn();

  return () => window.removeEventListener("scroll", fn);
}, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navItems = [
    { id: "projects",  label: "Work" },
    { id: "skills",    label: "Skills" },
    { id: "positions", label: "Experience" },
    { id: "contact",   label: "Contact" },
  ];

  // phase booleans
  const expanded  = ["expand","shrink","uiux","fly","done"].includes(phase);
  const collapsed = ["shrink","uiux","fly","done"].includes(phase);
  const isUiux    = ["uiux","fly","done"].includes(phase);

  const SKILL_HDR        = 0;
  const SKILL_CARD_START = 1;
  const EXP_HDR          = 1 + skillCategories.length;
  const EXP_ITEM_START   = EXP_HDR + 1;
  const setRef = useScrollReveal([heroIn]);

  return (
    <>
      <style>{styles}</style>
      <div className="pf-bg-glow" />
      <div className="pf-bg-glow2" />

      {/* BLACK COVER */}
      {!coverOff && (
        <div className={`pf-cover${coverFade ? " fade" : ""}`} />
      )}

      {/* ════════════════════════════════════════════
          THE SINGLE FLYING UI/UX ELEMENT
          Never removed from DOM — just stays where it lands.
          The h1 spacer is invisible but identical in size,
          so the fly element perfectly overlaps it.
      ════════════════════════════════════════════ */}
      <div
  ref={flyRef}
  className="pf-fly"
  style={{
    fontSize: "clamp(3.2rem, 10vw, 7.5rem)",
    opacity: scrollY > 700 * 0.8 ? 0 : 1,
    transition: "opacity 0.35s ease"
  }}
  aria-hidden="true"
>
        {/* R */}
        <span className={`fl${collapsed ? " collapse" : ""}`}
              style={{ width: collapsed ? 0 : "1.18em", transitionDelay: collapsed ? "0.08s" : "0s" }}>
          R
        </span>

        {/* B */}
        <span className={`fl${collapsed ? " collapse" : ""}`}
              style={{ width: collapsed ? 0 : "1.12em", transitionDelay: collapsed ? "0.05s" : "0s" }}>
          B
        </span>

        {/* H — hidden in rbk, opens in expand */}
        <span className={`fl${collapsed ? " collapse" : ""}`}
              style={{
                width: collapsed ? 0 : (expanded ? "1.2em" : 0),
                transitionDelay: collapsed ? "0.02s" : "0s",
              }}>
          H
        </span>

        {/* UI/UX morphing slot — starts as U, stretches to UI/UX */}
        <span className="fl-uiux"
              style={{ width: isUiux ? "4.6em" : "1.23em" }}>
          {isUiux ? "UI/UX" : "U"}
        </span>

        {/* W */}
        <span className={`fl${collapsed ? " collapse" : ""}`}
              style={{
                width: collapsed ? 0 : (expanded ? "1.85em" : 0),
                transitionDelay: collapsed ? "0.02s" : "0s",
              }}>
          W
        </span>

        {/* A */}
        <span className={`fl${collapsed ? " collapse" : ""}`}
              style={{
                width: collapsed ? 0 : (expanded ? "1.2em" : 0),
                transitionDelay: collapsed ? "0.04s" : "0s",
              }}>
          A
        </span>

        {/* N */}
        <span className={`fl${collapsed ? " collapse" : ""}`}
              style={{
                width: collapsed ? 0 : (expanded ? "1.2em" : 0),
                transitionDelay: collapsed ? "0.06s" : "0s",
              }}>
          N
        </span>

        {/* K */}
        <span className={`fl${collapsed ? " collapse" : ""}`}
              style={{ width: collapsed ? 0 : "1.2em", transitionDelay: collapsed ? "0.1s" : "0s" }}>
          K
        </span>
      </div>

      {/* NAV */}
      <nav className={`pf-nav${scrolled ? " scrolled" : ""}`}>
        <a className="pf-logo" href="#home">RBK.</a>
        <ul className="pf-nav-links">
          {navItems.map(({ id, label }) => (
            <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a></li>
          ))}
        </ul>
        <button className={`pf-hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`pf-mobile-menu${menuOpen ? " open" : ""}`}>
        {navItems.map(({ id, label }) => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>
        ))}
      </div>

      {/* HERO */}
      <section className="pf-hero" id="home">
        <div>
          <div className={`pf-hero-tag${heroIn ? " in" : ""}`}>
            <span className="pf-pulse" /> Available for opportunities
          </div>

          <h1 className="pf-h1">
            {/*
              Invisible spacer — exact same text as "UI/UX" at hero font size.
              Holds the layout space. The flying element lands precisely on top.
            */}
            <span className="pf-h1-spacer" ref={spacerRef}>
              <em className="pf-accent">UI/UX</em>
            </span>

            <span className="pf-h1-line">
              <span className={`pf-h1-reveal${heroIn ? " in" : ""}`} style={{ "--d": "0s" }}>
                Designer &amp;
              </span>
            </span>
            <span className="pf-h1-line">
              <span className={`pf-h1-reveal${heroIn ? " in" : ""}`} style={{ "--d": "0.12s" }}>
                Developer.
              </span>
            </span>
          </h1>

          <p className={`pf-hero-desc${heroIn ? " in" : ""}`}>
            Hi, I'm <strong style={{ color: "var(--text)" }}>Bhuwan Kumar Rasala</strong> — crafting
            intuitive digital experiences at the intersection of design and code. From interactive 3D
            websites to IEEE conference platforms serving global audiences.
          </p>

          <div className={`pf-hero-btns${heroIn ? " in" : ""}`}>
            <button className="pf-btn pf-btn-primary" onClick={() => scrollTo("projects")}>View Work →</button>
            <button className="pf-btn pf-btn-outline" onClick={() => scrollTo("contact")}>Get in Touch</button>
          </div>
        </div>

        <div>
          <div className={`pf-hero-card${heroIn ? " in" : ""}`}>
            <div className="pf-avatar">RBK.</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: ".25rem" }}>
              Bhuwan Kumar Rasala
            </div>
            <div style={{ fontSize: ".85rem", color: "var(--muted)" }}>B.Tech CSE (IoT) · VNRVJIET · GPA 7.65</div>
            <div className="pf-stat-grid">
              {[
                { num: "13K+",  label: "Site visits delivered" },
                { num: "2.5K+", label: "Registrations handled" },
                { num: "3+",    label: "Live projects"         },
                { num: "25%",   label: "Engagement boost"      },
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
            <a key={p.num} href={p.link} target="_blank" rel="noreferrer"
               className={`pf-project-card${p.featured ? " pf-project-featured" : ""}`}>
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
              </div>
              {p.featured && (
                <div className="pf-project-visual">
                  <span>{p.visual}</span>
                  <span style={{ fontSize: "1rem", color: "rgba(200,245,96,.15)", marginTop: ".5rem" }}>{p.visualSub}</span>
                </div>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className="pf-section pf-skills-bg" id="skills">
        <div ref={setRef(SKILL_HDR)} className="reveal" style={{ "--reveal-delay": "0s" }}>
          <div className="pf-section-label">Toolkit</div>
          <h2 className="pf-h2">Skills</h2>
          <p style={{ color: "var(--muted)", maxWidth: "52ch" }}>Every tool I reach for — from pixel-perfect design to cloud deployment.</p>
        </div>
        <div className="pf-skills-grid">
          {skillCategories.map((cat, ci) => (
            <div key={cat.title} ref={setRef(SKILL_CARD_START + ci)} className="pf-skill-cat reveal" style={{ "--reveal-delay": `${ci * 0.07}s` }}>
              <div className="pf-skill-cat-icon">{cat.icon}</div>
              <div className="pf-skill-cat-title">{cat.title}</div>
              <div className="pf-skill-pills">
                {cat.skills.map((s, si) => (
                  <span key={s.name} className="pf-skill-pill" style={{ "--pill-delay": `${si * 0.055}s` }}>
                    {s.logo && <img src={s.logo} alt={s.name} width={18} height={18} onError={(e) => { e.currentTarget.style.display = "none"; }} />}
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="pf-section" id="positions">
        <div ref={setRef(EXP_HDR)} className="reveal" style={{ "--reveal-delay": "0s" }}>
          <div className="pf-section-label">Experience</div>
          <h2 className="pf-h2">Positions of Responsibility</h2>
        </div>
        <div className="pf-exp-list">
          {positions.map((p, i) => (
            <div key={p.role + p.org} ref={setRef(EXP_ITEM_START + i)} className="pf-exp-item reveal-left" style={{ "--reveal-delay": `${i * 0.09}s` }}>
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
            <div className="pf-contact-big">Let's build<br />something<br /><em className="pf-accent">great.</em></div>
            <p style={{ color: "var(--muted)", marginTop: "1.5rem", lineHeight: 1.7, fontSize: ".9rem" }}>
              Open to UI/UX roles, freelance projects, and collaborations. Currently pursuing B.Tech CSE (IoT) at VNRVJIET.
            </p>
          </div>
          <div>
            <div className="pf-contact-links">
              <a href="mailto:bhuwan1013@gmail.com" className="pf-contact-link"><span>Email</span><span style={{ fontSize: ".8rem", color: "var(--muted)" }}>→</span></a>
              <a href="https://icmacc.org" className="pf-contact-link" target="_blank" rel="noreferrer"><span>ICMACC Project</span><span style={{ fontSize: ".8rem", color: "var(--muted)" }}>icmacc.org →</span></a>
              <a href="https://www.qelectric.in" className="pf-contact-link" target="_blank" rel="noreferrer"><span>QElectric Project</span><span style={{ fontSize: ".8rem", color: "var(--muted)" }}>qelectric.in →</span></a>
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
          Bhuwan Kumar Rasala <span className="pf-dot" /> UI/UX Designer &amp; Developer <span className="pf-dot" /> VNRVJIET
        </div>
        <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>B.Tech CSE IoT · 2023–Present</div>
      </footer>
    </>
  );
}