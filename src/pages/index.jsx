import { useState, useEffect, useRef } from "react";
import Head from "next/head";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #faf9f5; --bg2: #f1efe6; --bg3: #eae7db;
    --accent: #c8f560; --accent-ink: #587a1f; --accent2: #a8d940;
    --text: #17180f; --muted: #726f62; --border: #e3e0d3; --card: #ffffff;
    --shadow-sm: 0 2px 10px -4px rgba(60,55,30,.08);
    --shadow-md: 0 18px 40px -16px rgba(60,55,30,.14);
  }

  html { scroll-behavior: smooth; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }
  .pf-skip-link {
    position: fixed; top: -60px; left: 1rem; z-index: 300;
    background: var(--accent); color: #0a0a0a; font-weight: 700; font-size: .85rem;
    padding: .6rem 1rem; border-radius: .4rem; text-decoration: none; transition: top .2s;
  }
  .pf-skip-link:focus { top: 1rem; }
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
    z-index: 210; max-width: 1440px; margin-inline: auto;
  }
  .pf-nav.scrolled { background: rgba(250,249,245,.82); border-color: var(--border); backdrop-filter: blur(10px); box-shadow: var(--shadow-sm); }
  .pf-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem; letter-spacing: -.02em; color: var(--accent-ink); text-decoration: none; }
  .pf-nav-links { display: flex; gap: 2rem; list-style: none; }
  .pf-nav-links a { color: var(--muted); text-decoration: none; font-size: .85rem; letter-spacing: .05em; text-transform: uppercase; transition: color .2s; }
  .pf-nav-links a:hover { color: var(--accent-ink); }

  .pf-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
  .pf-hamburger span { display: block; width: 22px; height: 2px; background: var(--text); transition: all .3s; }
  .pf-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .pf-hamburger.open span:nth-child(2) { opacity: 0; }
  .pf-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  .pf-mobile-menu {
    display: none; position: fixed; inset: 0; z-index: 99;
    background: rgba(250,249,245,.97); backdrop-filter: blur(12px);
    flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem;
    opacity: 0; pointer-events: none; transition: opacity .3s;
  }
  .pf-mobile-menu.open { opacity: 1; pointer-events: all; }
  .pf-mobile-menu a { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; letter-spacing: -.03em; color: var(--muted); text-decoration: none; transition: color .2s; }
  .pf-mobile-menu a:hover { color: var(--accent-ink); }

  .pf-section { padding: 6rem 3rem; position: relative; z-index: 205; max-width: 1440px; margin-inline: auto; }

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
  color: var(--accent-ink);
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

  /* the AI/ML morphing slot (the "A" of BHUWAN) */
 .fl-morph{
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
    min-height: 100dvh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    padding: 8rem 3rem 4rem;
    max-width: 1440px; margin-inline: auto;
    position: relative;
    z-index: 205;
  }

  .pf-h1 {
    text-wrap: balance;
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.6rem, 6vw, 5.5rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -.04em;
    margin-bottom: 1.5rem;
  }
  /* invisible spacer — holds space for "AI/ML" at hero font size */
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

  .pf-accent { color: var(--accent-ink); }

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
  .pf-btn-outline:hover { border-color: var(--accent-ink); color: var(--accent-ink); }

  .pf-hero-card {
    background: var(--card); border: 1px solid rgba(0,0,0,.05); border-radius: 1.2rem; padding: 2rem;
    box-shadow: var(--shadow-md);
    position: relative; overflow: hidden;
    opacity: 0; transform: translateY(18px);
    transition: opacity 0.6s ease 0.12s, transform 0.6s ease 0.12s;
  }
  .pf-hero-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 70% 20%, rgba(88,122,31,.06), transparent 60%); pointer-events: none; }
  .pf-hero-card.in { opacity: 1; transform: none; }

  .pf-avatar { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #6ee7b7); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.8rem; color: #0a0a0a; margin-bottom: 1.2rem; }
  .pf-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-top: 1.5rem; }
  .pf-stat { background: var(--bg3); border-radius: .75rem; padding: 1rem; border: 1px solid var(--border); }
  .pf-stat-num { font-family: 'SpaceGrotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: var(--accent-ink); }
  .pf-stat-label { font-size: .75rem; color: var(--muted); margin-top: .25rem; }
  .pf-focus-icon { font-size: 1.05rem; color: var(--accent-ink); margin-bottom: .4rem; }
  .pf-focus-title { font-family: 'Syne', sans-serif; font-size: .82rem; font-weight: 700; }
  .pf-focus-desc { font-size: .7rem; color: var(--muted); margin-top: .2rem; line-height: 1.4; }
  .pf-skills-strip { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1rem; }
  .pf-skill-chip { background: var(--bg3); border: 1px solid var(--border); padding: .3rem .8rem; border-radius: .25rem; font-size: .75rem; color: var(--muted); }

  .pf-section-label { font-size: .75rem; text-transform: uppercase; letter-spacing: .15em; color: var(--accent-ink); margin-bottom: 1rem; display: flex; align-items: center; gap: .75rem; }
  .pf-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .pf-h2 {
    text-wrap: balance; font-family: 'Syne', sans-serif; font-size: clamp(2rem,4vw,3rem); font-weight: 800; letter-spacing: -.03em; margin-bottom: .75rem; }

  .pf-projects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3rem; }
  .pf-project-card { background: var(--card); border: 1px solid rgba(0,0,0,.05); border-radius: 1.2rem; padding: 1.75rem; box-shadow: var(--shadow-sm); transition: all .3s; position: relative; overflow: hidden; text-decoration: none; color: inherit; display: block; }
  .pf-project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--accent), transparent); transform: scaleX(0); transition: transform .4s; }
  .pf-project-card:hover::before { transform: scaleX(1); }
  .pf-project-card:hover { border-color: rgba(0,0,0,.09); box-shadow: var(--shadow-md); transform: translateY(-4px); }
  .pf-project-featured { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; }
  .pf-project-num { font-family: 'SpaceGrotesk', sans-serif; font-size: .75rem; color: var(--accent-ink); letter-spacing: .1em; margin-bottom: .75rem; }
  .pf-project-title { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: .5rem; }
  .pf-project-desc { font-size: .85rem; color: var(--muted); line-height: 1.7; margin-bottom: 1rem; }
  .pf-metrics { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.2rem; }
  .pf-metric { display: flex; align-items: center; gap: .4rem; font-size: .8rem; }
  .pf-metric-val { font-family: 'SpaceGrotesk', sans-serif; font-weight: 700; color: var(--accent-ink); }
  .pf-metric-label { color: var(--muted); }
  .pf-tech-tags { display: flex; flex-wrap: wrap; gap: .4rem; }
  .pf-tech-tag { background: rgba(88,122,31,.07); border: 1px solid rgba(88,122,31,.22); color: var(--accent-ink); padding: .25rem .65rem; border-radius: .2rem; font-size: .72rem; font-weight: 500; }
  .pf-project-visual { background: var(--bg3); border-radius: .75rem; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid var(--border); font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800; color: rgba(88,122,31,.10); letter-spacing: -.05em; }
  .pf-project-experience { border-color: rgba(140,170,255,.35); background: linear-gradient(180deg, rgba(140,170,255,.05), var(--card)); }
  .pf-project-top { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin-bottom: .75rem; }
  .pf-project-badge { font-size: .68rem; font-weight: 700; letter-spacing: .04em; padding: .3rem .65rem; border-radius: 999px; white-space: nowrap; border: 1px solid transparent; }
  .pf-badge-live { color: var(--accent-ink); background: rgba(88,122,31,.1); border-color: rgba(88,122,31,.3); }
  .pf-badge-github { color: var(--text); background: rgba(0,0,0,.04); border-color: var(--border); }
  .pf-badge-linkedin { color: #3454c9; background: rgba(140,170,255,.14); border-color: rgba(140,170,255,.35); }
  .pf-badge-experience { color: #3454c9; background: rgba(140,170,255,.14); border-color: rgba(140,170,255,.35); }
  .pf-badge-dev { color: var(--muted); background: rgba(0,0,0,.03); border-color: var(--border); }
  .pf-badge-video-pending { color: var(--muted); background: rgba(0,0,0,.03); border-color: var(--border); }
  .pf-project-tagline { font-size: .82rem; color: var(--accent-ink); margin-bottom: .6rem; font-weight: 600; }
  .pf-project-highlights { list-style: none; display: flex; flex-direction: column; gap: .45rem; margin: 0 0 1.1rem; }
  .pf-project-highlights li { position: relative; padding-left: 1.1rem; font-size: .8rem; color: var(--muted); line-height: 1.6; }
  .pf-project-highlights li::before { content: ''; position: absolute; left: 0; top: .58em; width: 5px; height: 5px; border-radius: 50%; background: var(--accent-ink); }
  .pf-project-cta { display: inline-flex; align-items: center; gap: .4rem; margin-top: 1.1rem; font-size: .82rem; font-weight: 700; text-decoration: none; color: #0a0a0a; background: var(--accent); padding: .55rem 1.1rem; border-radius: .6rem; transition: transform .2s, opacity .2s; }
  .pf-project-cta:hover { transform: translateY(-2px); }
  .pf-project-cta-disabled { background: transparent; color: var(--muted); border: 1px dashed var(--border); cursor: default; }
  .pf-project-cta-disabled:hover { transform: none; }

  .pf-skills-bg { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .pf-skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 1.5rem; margin-top: 3rem; }
  .pf-skill-cat { background: var(--card); border: 1px solid rgba(0,0,0,.05); border-radius: 1rem; padding: 1.5rem; box-shadow: var(--shadow-sm); position: relative; overflow: hidden; transition: box-shadow .3s; }
  .pf-skill-cat::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(88,122,31,.06), transparent 70%); pointer-events: none; opacity: 0; transition: opacity .4s; }
  .pf-skill-cat:hover::after { opacity: 1; }
  .pf-skill-cat:hover { box-shadow: var(--shadow-md); }
  .pf-skill-cat-icon { width: 36px; height: 36px; background: rgba(88,122,31,.12); border-radius: .5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; font-size: 1rem; }
  .pf-skill-cat-title { font-family: 'Syne', sans-serif; font-size: .85rem; font-weight: 700; margin-bottom: .75rem; }
  .pf-skill-pills { display: flex; flex-wrap: wrap; gap: .5rem; }
  .pf-skill-pill {
    display: flex; align-items: center; gap: .45rem;
    background: var(--bg3); border: 1px solid var(--border);
    padding: .32rem .75rem; border-radius: .25rem;
    font-size: .72rem; font-weight: 500; color: var(--text);
    opacity: 0; transform: translateY(10px) scale(.95);
    transition: opacity .35s cubic-bezier(.16,1,.3,1), transform .35s cubic-bezier(.16,1,.3,1), background .2s, border-color .2s;
    transition-delay: var(--pill-delay, 0s);
  }
  .pf-skill-pill:hover { border-color: var(--accent-ink); background: #e2ddc9; }
  .pf-skill-pill.pill-in { opacity: 1; transform: none; }
  .pf-skill-pill img { width: 18px; height: 18px; object-fit: contain; filter: brightness(0); flex-shrink: 0; }

  .pf-exp-list { margin-top: 3rem; display: flex; flex-direction: column; gap: 1rem; }
  .pf-exp-item { background: var(--card); border: 1px solid rgba(0,0,0,.05); border-radius: 1rem; padding: 1.5rem; box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; transition: border-color .25s, transform .25s, box-shadow .25s; position: relative; overflow: hidden; }
  .pf-exp-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--accent); transform: scaleY(0); transform-origin: bottom; transition: transform .35s cubic-bezier(.16,1,.3,1); border-radius: 0 0 0 1rem; }
  .pf-exp-item:hover { border-color: rgba(0,0,0,.09); box-shadow: var(--shadow-md); transform: translateX(4px); }
  .pf-exp-item:hover::before { transform: scaleY(1); }
  .pf-exp-body { flex: 1; min-width: 0; }
  .pf-exp-bullets { list-style: none; display: flex; flex-direction: column; gap: .5rem; margin: .9rem 0 1.1rem; }
  .pf-exp-bullets li { position: relative; padding-left: 1.1rem; font-size: .85rem; color: var(--muted); line-height: 1.65; }
  .pf-exp-bullets li::before { content: ''; position: absolute; left: 0; top: .62em; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
  .pf-h3 { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 700; letter-spacing: -.02em; margin-top: 3.5rem; }
  .pf-exp-role { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; margin-bottom: .25rem; }
  .pf-exp-org { font-size: .85rem; color: var(--accent-ink); }
  .pf-exp-period { font-size: .8rem; color: var(--muted); white-space: nowrap; background: var(--bg3); padding: .3rem .8rem; border-radius: .25rem; border: 1px solid var(--border); align-self: flex-start; flex-shrink: 0; }

  .pf-contact-bg { background: var(--bg2); border-top: 1px solid var(--border); }
  .pf-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; margin-top: 3rem; }
  .pf-contact-big { font-family: 'Syne', sans-serif; font-size: clamp(2.5rem,5vw,4.5rem); font-weight: 800; letter-spacing: -.04em; line-height: 1; }
  .pf-contact-links { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
  .pf-contact-link { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: var(--card); border: 1px solid rgba(0,0,0,.05); border-radius: .75rem; box-shadow: var(--shadow-sm); text-decoration: none; color: var(--text); transition: all .2s; font-size: .9rem; }
  .pf-contact-link:hover { border-color: var(--accent-ink); color: var(--accent-ink); box-shadow: var(--shadow-md); }
  .pf-achievements { margin-top: 1.5rem; padding: 1.25rem; background: var(--card); border: 1px solid rgba(0,0,0,.05); border-radius: 1rem; box-shadow: var(--shadow-sm); }
  .pf-achievement-label { font-size: .75rem; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: .75rem; }
  .pf-achievement-row { display: flex; justify-content: space-between; font-size: .85rem; margin-bottom: .6rem; gap: 1rem; }
  .pf-achievement-row:last-child { margin-bottom: 0; }

  .pf-footer { padding: 2rem 3rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
  .pf-footer-name { font-family: 'Syne', sans-serif; font-weight: 700; color: var(--muted); font-size: .85rem; }
  .pf-dot { width: 4px; height: 4px; background: var(--accent-ink); border-radius: 50%; display: inline-block; margin: 0 .5rem; vertical-align: middle; }

  .pf-bg-glow  { position: fixed; top: -20%; left: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(88,122,31,.05), transparent 60%); pointer-events: none; z-index: 0; }
  .pf-bg-glow2 { position: fixed; bottom: -20%; right: -10%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(70,150,120,.05), transparent 60%); pointer-events: none; z-index: 0; }

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
  { icon: "✦", title: "AI / ML", skills: [{ name: "PyTorch", logo: ICON("pytorch") }, { name: "Hugging Face" }, { name: "Transformers" }, { name: "Fine-Tuning (LoRA)" }, { name: "RAG" }, { name: "FAISS" }, { name: "OCR" }, { name: "Pandas", logo: ICON("pandas") }] },
  { icon: "⬡", title: "Web Development", skills: [{ name: "React.js", logo: ICON("react") }, { name: "Next.js", logo: ICON("nextdotjs") }, { name: "Node.js", logo: ICON("nodedotjs") }, { name: "Express.js", logo: ICON("express") }, { name: "FastAPI", logo: ICON("fastapi") }, { name: "Flask", logo: ICON("flask") }, { name: "Tailwind CSS", logo: ICON("tailwindcss") }, { name: "Bootstrap", logo: ICON("bootstrap") }] },
  { icon: "◈", title: "Web Design", skills: [{ name: "Figma", logo: ICON("figma") }, { name: "Photoshop", logo: ICON("adobephotoshop") }, { name: "Responsive Design" }, { name: "Three.js", logo: ICON("threedotjs") }, { name: "Animation" }] },
  { icon: "◎", title: "Robotics & Embedded", skills: [{ name: "ROS", logo: ICON("ros") }, { name: "Gazebo" }, { name: "SLAM Toolbox" }, { name: "Nav2" }, { name: "Raspberry Pi", logo: ICON("raspberrypi") }, { name: "Linux", logo: ICON("linux") }] },
  { icon: "▣", title: "Data & Cloud", skills: [{ name: "PostgreSQL", logo: ICON("postgresql") }, { name: "MongoDB", logo: ICON("mongodb") }, { name: "MySQL", logo: ICON("mysql") }, { name: "Redis", logo: ICON("redis") }, { name: "Qdrant" }, { name: "AWS" }, { name: "Docker", logo: ICON("docker") }, { name: "Kubernetes", logo: ICON("kubernetes") }, { name: "Firebase", logo: ICON("firebase") }, { name: "Vercel", logo: ICON("vercel") }, { name: "Git", logo: ICON("git") }] },
  { icon: "◇", title: "Languages & Core CS", skills: [{ name: "Python", logo: ICON("python") }, { name: "Java", logo: ICON("openjdk") }, { name: "C", logo: ICON("c") }, { name: "C++", logo: ICON("cplusplus") }, { name: "JavaScript", logo: ICON("javascript") }, { name: "C#/.NET", logo: ICON("dotnet") }, { name: "DSA" }, { name: "OOP" }, { name: "DBMS" }, { name: "Operating Systems" }] },
];

const projects = [
  {
    num: "01", category: "personal", featured: true,
    badge: "In Development", badgeKind: "dev",
    title: "AIM OS — AI Infrastructure & Memory Platform",
    tagline: "Self-hosted memory & persona layer for an LLM assistant.",
    desc: "A self-hosted AI infrastructure platform giving an LLM assistant persistent memory and a consistent persona, built as a set of containerized microservices with a hybrid relational + vector memory store.",
    highlights: [
      "12 containerized microservices behind a Redis pub/sub event layer",
      "Hybrid memory: PostgreSQL (relational) + Qdrant (vector/semantic search)",
      "Phi-3-mini fine-tuned with LoRA (PEFT) for persona adaptation",
      "Memory and persona services exposed through REST APIs",
    ],
    metrics: [{ val: "2.00 → 4.00 / 5", label: "persona consistency — own held-out evaluation" }],
    tech: ["Python", "FastAPI", "Docker Compose", "Redis", "PostgreSQL", "Qdrant", "PyTorch", "LoRA / PEFT"],
    visual: "AIM OS", visualSub: "LLM · Memory · LoRA",
    cta: { label: "In Development", kind: "dev" },
  },
  {
    num: "02", category: "personal", featured: true,
    badge: "Demo Video", badgeKind: "video-pending",
    title: "FuelDrop — Autonomous Drone Fuel Delivery System",
    tagline: "Simulated autonomous drone delivery with live web tracking.",
    desc: "A full-stack autonomous drone fuel-delivery simulation combining ROS2 navigation, SLAM-based mapping, and a live web tracking interface, run inside a simulated 3D city.",
    highlights: [
      "5 ROS2 nodes coordinating navigation, mapping and delivery logic",
      "360° LiDAR with SLAM-based live mapping and Smac A* planning over costmaps",
      "Flask backend streaming live position to a Leaflet.js map via Server-Sent Events",
      "3D city environment — 8 buildings, power lines, 20 m flight ceiling",
    ],
    tech: ["ROS2 Humble", "Gazebo Classic 11", "Nav2", "SLAM", "Python", "Flask", "SQLite", "Leaflet.js", "SSE"],
    visual: "FuelDrop", visualSub: "ROS2 · SLAM · Live Tracking",
    cta: { label: "Watch Demo", kind: "video-pending" },
  },
  {
    num: "03", category: "personal",
    badge: "GitHub", badgeKind: "github",
    title: "Automated Compliance Checker",
    tagline: "OCR + vision-language checks for legal metrology labels.",
    desc: "A prototype AI compliance system that checks product labels and e-commerce listings against legal metrology requirements, combining OCR with rule-based analysis and multimodal visual reasoning.",
    highlights: [
      "OCR + rule-based analysis to extract and check label declarations",
      "Qwen-VL multimodal reasoning to catch defects beyond text-only extraction",
      "Runs as a low-cost Raspberry Pi prototype with a Node.js backend",
      "Cloud dashboard for real-time scoring and visualization",
    ],
    tech: ["Python", "OCR", "Qwen-VL", "Raspberry Pi", "Node.js"],
    link: "https://github.com/lohithajaeger/compliance-checker-sih",
    cta: { label: "GitHub", kind: "github", href: "https://github.com/lohithajaeger/compliance-checker-sih" },
  },
  {
    num: "04", category: "personal",
    badge: "Live", badgeKind: "live",
    title: "ICMACC 2026 — Conference Website",
    tagline: "Production site for an international conference at VNRVJIET.",
    desc: "A responsive full-stack website for ICMACC 2026, shipped through a CI/CD pipeline for fast and reliable releases. Handles conference information, registration workflows and Razorpay payments with real-time transaction verification.",
    highlights: [
      "CI/CD pipeline powering build and deployment on every release",
      "Razorpay payment integration with real-time transaction verification",
      "Live countdown, real-time visitor counter, and dynamic sponsor sections",
      "Performance tuning with WebP assets and lazy loading",
    ],
    metrics: [{ val: "25,000+", label: "site hits" }],
    tech: ["Next.js", "Firebase", "Razorpay", "CI/CD"],
    link: "https://icmacc.org",
    cta: { label: "Live Website", kind: "live", href: "https://icmacc.org" },
  },
  {
    num: "05", category: "experience",
    badge: "Professional Experience", badgeKind: "experience",
    title: "XEVO — Autonomous Robotics",
    tagline: "ROS Developer, Sep 2024 – Mar 2025.",
    desc: "Professional robotics role at an early-stage startup, building autonomous navigation and SLAM software from sensor simulation through to real-time localization and path planning.",
    highlights: [
      "Developed autonomous navigation and SLAM software in ROS and Python",
      "Simulated LiDAR and camera sensor integration in Gazebo for real-time localization and path planning",
      "Containerized the development environment with Docker across a 4-member team",
    ],
    tech: ["ROS", "Python", "Gazebo", "SLAM", "LiDAR", "Docker", "Linux"],
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7383402937450024960/",
    cta: { label: "View Experience", kind: "linkedin", href: "https://www.linkedin.com/feed/update/urn:li:activity:7383402937450024960/" },
  },
  {
    num: "06", category: "personal",
    badge: "GitHub", badgeKind: "github",
    title: "IPL Score Prediction — End-to-End ML Pipeline",
    tagline: "Benchmarking five regression models on a synthetic dataset.",
    desc: "An end-to-end machine-learning pipeline for cricket score prediction, benchmarking five regression models on a synthetic dataset with an interactive interface for real-time inference.",
    highlights: [
      "Synthetic dataset of 30,000 records",
      "Benchmarked Linear Regression, Random Forest, Extra Trees, Gradient Boosting and XGBoost",
      "Interactive HTML/JS interface for real-time predictions",
    ],
    metrics: [
      { val: "0.92", label: "R² — best model, synthetic benchmark" },
      { val: "6.54 runs", label: "MAE — synthetic benchmark" },
    ],
    tech: ["Python", "scikit-learn", "XGBoost", "HTML/JS"],
    link: "https://github.com/bhuwan1321/ipl_score_predictor",
    cta: { label: "GitHub", kind: "github", href: "https://github.com/bhuwan1321/ipl_score_predictor" },
  },
];


const experience = [
  { role: "Website Developer", org: "Q Electric", period: "Aug 2025 – Oct 2025", tags: ["Next.js", "React", "Tailwind CSS", "Three.js", "Vercel"], points: [
    "Gathered requirements with stakeholders, then designed and launched a responsive corporate website.",
    "Integrated an interactive 3D model to boost engagement and deployed on Vercel for reliable production hosting.",
    "Improved load performance with lazy loading, code splitting and asset optimization while carrying the brand identity across devices and browsers.",
  ] },
  { role: "ROS Developer", org: "Xevo – Startup", period: "Sep 2024 – Mar 2025", tags: ["ROS", "Python", "Gazebo", "Docker"], points: [
    "Built autonomous navigation and SLAM software in ROS and Python, simulating LiDAR/camera sensors in Gazebo for real-time localization and path planning.",
    "Containerized the development environment with Docker across a 4-member team for reproducible builds.",
  ] },
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
  { title: "Advanced Robotics ROX102 — Xairo Tech", year: "Aug 2024" },
  { title: "Tableau Certified Training — 82%", year: "Jul 2024" },
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
  "shrink" 2100ms  — collapse R B H U W N K, leave A
  "morph"  2700ms  — A expands to AI/ML
  "fly"    3300ms  — AI/ML flies to h1 spacer position
  "done"   4200ms  — hero content reveals, cover gone
*/
export default function Portfolio() {
  const [phase, setPhase]         = useState("rbk");
  const [heroIn, setHeroIn]       = useState(false);
  const [coverFade, setCoverFade] = useState(false);
  const [coverOff, setCoverOff]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [morphW, setMorphW]      = useState("4.4em"); // measured so AI/ML lands exactly on the h1

  const flyRef    = useRef(null);   // the fixed flying element
  const spacerRef = useRef(null);   // invisible h1 spacer we fly onto

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.title = "Bhuwan Kumar Rasala — AI/ML & Web Developer";
    window.scrollTo(0, 0);
    const T = [];
    let landed = false;

    // Once landed, pin the word to the h1's spot in the document (not the viewport)
    // so it scrolls with the page like normal content.
    const anchorFly = () => {
      const fly    = flyRef.current;
      const spacer = spacerRef.current;
      if (!fly || !spacer) return;
      const vw      = window.innerWidth;
      const rem     = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const heroFs  = Math.min(5.5 * rem, Math.max(2.6 * rem, 0.06 * vw));
      const introFs = Math.min(7.5 * rem, Math.max(3.2 * rem, 0.10 * vw));
      const sRect   = spacer.getBoundingClientRect();
      fly.style.transition      = "none";
      fly.style.position        = "absolute";
      fly.style.left            = `${sRect.left + window.scrollX}px`;
      fly.style.top             = `${sRect.top + window.scrollY}px`;
      fly.style.transformOrigin = "top left";
      fly.style.transform       = `scale(${heroFs / introFs})`;
    };
    const onResize = () => { if (landed) anchorFly(); };
    window.addEventListener("resize", onResize);

    T.push(setTimeout(() => setPhase("expand"), 700));
    T.push(setTimeout(() => setPhase("shrink"),  2100));
    T.push(setTimeout(() => {
      setPhase("morph");
      // size the slot to the real width of "AI/ML" so the fly-in lands flush with the h1
      const em = spacerRef.current?.firstElementChild;
      if (em) {
        const vw      = window.innerWidth;
        const rem     = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const heroFs  = Math.min(5.5 * rem, Math.max(2.6 * rem, 0.06 * vw));
        const introFs = Math.min(7.5 * rem, Math.max(3.2 * rem, 0.10 * vw));
        setMorphW(`${em.getBoundingClientRect().width * (introFs / heroFs)}px`);
      }
    }, 2700));

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
      anchorFly();
      landed = true;
      setHeroIn(true);
      setCoverFade(true);
      // remove cover from DOM after transition
      T.push(setTimeout(() => setCoverOff(true), 800));
    }, 4200));

    return () => {
      T.forEach(clearTimeout);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
  const fn = () => {
    const y = window.scrollY;
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
    { id: "experience", label: "Experience" },
    { id: "contact",   label: "Contact" },
  ];

  // phase booleans
  const expanded  = ["expand","shrink","morph","fly","done"].includes(phase);
  const collapsed = ["shrink","morph","fly","done"].includes(phase);
  const isMorph    = ["morph","fly","done"].includes(phase);

  const SKILL_HDR        = 0;
  const SKILL_CARD_START = 1;
  const EXP_HDR          = 1 + skillCategories.length;
  const EXP_ITEM_START   = EXP_HDR + 1;
  const POS_HDR          = EXP_ITEM_START + experience.length;
  const setRef = useScrollReveal([heroIn]);

  return (
    <>
      <Head>
        <title>Bhuwan Kumar Rasala — AI/ML &amp; Web Developer</title>
        <meta name="description" content="Portfolio of Bhuwan Kumar Rasala — AI/ML and full-stack web developer building self-hosted AI infrastructure, autonomous robotics and production web platforms." />
        <meta name="theme-color" content="#faf9f5" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Bhuwan Kumar Rasala — AI/ML & Web Developer" />
        <meta property="og:description" content="AI/ML and full-stack web developer building self-hosted AI infrastructure, autonomous robotics and production web platforms." />
      </Head>
      <style>{styles}</style>
      <a className="pf-skip-link" href="#main-content">Skip to content</a>
      <div className="pf-bg-glow" />
      <div className="pf-bg-glow2" />

      {/* BLACK COVER */}
      {!coverOff && (
        <div className={`pf-cover${coverFade ? " fade" : ""}`} />
      )}

      {/* ════════════════════════════════════════════
          THE SINGLE FLYING AI/ML ELEMENT
          Never removed from DOM — just stays where it lands.
          The h1 spacer is invisible but identical in size,
          so the fly element perfectly overlaps it.
      ════════════════════════════════════════════ */}
      <div
  ref={flyRef}
  className="pf-fly"
  style={{
    fontSize: "clamp(3.2rem, 10vw, 7.5rem)",
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
              style={{ width: collapsed ? 0 : (expanded ? "1.2em" : 0), transitionDelay: collapsed ? "0.02s" : "0s" }}>
          H
        </span>

        {/* U */}
        <span className={`fl${collapsed ? " collapse" : ""}`}
              style={{ width: collapsed ? 0 : (expanded ? "1.23em" : 0), transitionDelay: collapsed ? "0.03s" : "0s" }}>
          U
        </span>

        {/* W */}
        <span className={`fl${collapsed ? " collapse" : ""}`}
              style={{ width: collapsed ? 0 : (expanded ? "1.85em" : 0), transitionDelay: collapsed ? "0.02s" : "0s" }}>
          W
        </span>

        {/* AI/ML morphing slot — opens as the A of BHUWAN, stretches to AI/ML */}
        <span className="fl-morph"
              style={{ width: !expanded ? 0 : (isMorph ? morphW : "1.2em") }}>
          {isMorph ? "AI/ML" : "A"}
        </span>

        {/* N */}
        <span className={`fl${collapsed ? " collapse" : ""}`}
              style={{ width: collapsed ? 0 : (expanded ? "1.2em" : 0), transitionDelay: collapsed ? "0.06s" : "0s" }}>
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

      <main id="main-content">
      {/* HERO */}
      <section className="pf-hero" id="home">
        <div>
          <h1 className="pf-h1">
            {/*
              Invisible spacer — exact same text as "AI/ML" at hero font size.
              Holds the layout space. The flying element lands precisely on top.
            */}
            <span className="pf-h1-spacer" ref={spacerRef}>
              <em className="pf-accent">AI/ML</em>
            </span>

            <span className="pf-h1-line">
              <span className={`pf-h1-reveal${heroIn ? " in" : ""}`} style={{ "--d": "0s" }}>
                &amp; Web
              </span>
            </span>
            <span className="pf-h1-line">
              <span className={`pf-h1-reveal${heroIn ? " in" : ""}`} style={{ "--d": "0.12s" }}>
                Developer.
              </span>
            </span>
          </h1>

          <p className={`pf-hero-desc${heroIn ? " in" : ""}`}>
            Hi, I'm <strong style={{ color: "var(--text)" }}>Bhuwan Kumar Rasala</strong> — I build
            intelligent systems and sharp, considered web experiences. From fine-tuned LLM
            infrastructure to conference platforms serving 25,000+ visitors.
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
            <div style={{ fontSize: ".85rem", color: "var(--muted)" }}>B.Tech CSE (IoT) · VNRVJIET · CGPA 7.60</div>
            <div className="pf-stat-grid">
              {[
                { icon: "✦", title: "AI / ML",     desc: "LLMs, fine-tuning, RAG" },
                { icon: "⬡", title: "Web Dev",     desc: "React, Next.js, APIs" },
                { icon: "◎", title: "Robotics",    desc: "ROS2, SLAM, navigation" },
                { icon: "▣", title: "Systems",     desc: "Docker, databases, cloud" },
              ].map((f) => (
                <div className="pf-stat pf-focus-item" key={f.title}>
                  <div className="pf-focus-icon">{f.icon}</div>
                  <div className="pf-focus-title">{f.title}</div>
                  <div className="pf-focus-desc">{f.desc}</div>
                </div>
              ))}
            </div>
            <div className="pf-skills-strip">
              {["PyTorch", "Hugging Face", "Next.js", "FastAPI", "Docker"].map((t) => (
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
          Machine learning, robotics and the web, built end to end — personal engineering work alongside professional experience.
        </p>
        <div className="pf-projects-grid">
          {projects.map((p) => (
            <div key={p.num}
                 className={`pf-project-card${p.featured ? " pf-project-featured" : ""}${p.category === "experience" ? " pf-project-experience" : ""}`}>
              <div>
                <div className="pf-project-top">
                  <div className="pf-project-num">{p.num}</div>
                  <span className={`pf-project-badge pf-badge-${p.badgeKind}`}>{p.badge}</span>
                </div>
                <div className="pf-project-title">{p.title}</div>
                <div className="pf-project-tagline">{p.tagline}</div>
                <div className="pf-project-desc">{p.desc}</div>
                <ul className="pf-project-highlights">
                  {p.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
                {p.metrics && (
                  <div className="pf-metrics">
                    {p.metrics.map((m) => (
                      <div className="pf-metric" key={m.label}>
                        <span className="pf-metric-val">{m.val}</span>
                        <span className="pf-metric-label">{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="pf-tech-tags">
                  {p.tech.map((t) => <span className="pf-tech-tag" key={t}>{t}</span>)}
                </div>
                {p.cta.href ? (
                  <a href={p.cta.href} target="_blank" rel="noreferrer" className={`pf-project-cta pf-cta-${p.cta.kind}`}>
                    {p.cta.label} <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <span className={`pf-project-cta pf-project-cta-disabled pf-cta-${p.cta.kind}`}>
                    {p.cta.label}
                  </span>
                )}
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
        <div ref={setRef(SKILL_HDR)} className="reveal" style={{ "--reveal-delay": "0s" }}>
          <div className="pf-section-label">Toolkit</div>
          <h2 className="pf-h2">Skills</h2>
          <p style={{ color: "var(--muted)", maxWidth: "52ch" }}>Every tool I reach for — from model fine-tuning to polished interfaces and cloud deployment.</p>
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
      <section className="pf-section" id="experience">
        <div ref={setRef(EXP_HDR)} className="reveal" style={{ "--reveal-delay": "0s" }}>
          <div className="pf-section-label">Experience</div>
          <h2 className="pf-h2">Work Experience</h2>
        </div>
        <div className="pf-exp-list">
          {experience.map((e, i) => (
            <div key={e.role + e.org} ref={setRef(EXP_ITEM_START + i)} className="pf-exp-item reveal-left" style={{ "--reveal-delay": `${i * 0.09}s` }}>
              <div className="pf-exp-body">
                <div className="pf-exp-role">{e.role}</div>
                <div className="pf-exp-org">{e.org}</div>
                <ul className="pf-exp-bullets">
                  {e.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
                <div className="pf-tech-tags">
                  {e.tags.map((t) => <span className="pf-tech-tag" key={t}>{t}</span>)}
                </div>
              </div>
              <div className="pf-exp-period">{e.period}</div>
            </div>
          ))}
        </div>

        <div ref={setRef(POS_HDR)} className="reveal" style={{ "--reveal-delay": "0s" }}>
          <h3 className="pf-h3">Positions of Responsibility</h3>
        </div>
        <div className="pf-exp-list" style={{ marginTop: "1.25rem" }}>
          {positions.map((p, i) => (
            <div key={p.role + p.org} ref={setRef(POS_HDR + 1 + i)} className="pf-exp-item reveal-left" style={{ "--reveal-delay": `${i * 0.09}s` }}>
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
              Open to AI/ML and web development roles, internships, freelance projects, and collaborations. Currently pursuing B.Tech CSE (IoT) at VNRVJIET.
            </p>
          </div>
          <div>
            <div className="pf-contact-links">
              <a href="mailto:rasalabhuwankumar@gmail.com" className="pf-contact-link"><span>Email</span><span style={{ fontSize: ".8rem", color: "var(--muted)" }}>→</span></a>
              <a href="https://www.linkedin.com/in/bhuwan-kumar-rasala" className="pf-contact-link" target="_blank" rel="noreferrer"><span>LinkedIn</span><span style={{ fontSize: ".8rem", color: "var(--muted)" }}>bhuwan-kumar-rasala →</span></a>
              <a href="https://github.com/bhuwan1321" className="pf-contact-link" target="_blank" rel="noreferrer"><span>GitHub</span><span style={{ fontSize: ".8rem", color: "var(--muted)" }}>bhuwan1321 →</span></a>
              <a href="https://icmacc.org" className="pf-contact-link" target="_blank" rel="noreferrer"><span>ICMACC Project</span><span style={{ fontSize: ".8rem", color: "var(--muted)" }}>icmacc.org →</span></a>
              <a href="https://www.qelectric.in" className="pf-contact-link" target="_blank" rel="noreferrer"><span>QElectric Project</span><span style={{ fontSize: ".8rem", color: "var(--muted)" }}>qelectric.in →</span></a>
            </div>
            <div className="pf-achievements">
              <div className="pf-achievement-label">Achievements &amp; Certifications</div>
              {achievements.map((a) => (
                <div className="pf-achievement-row" key={a.title}>
                  <span>{a.title}</span>
                  <span style={{ color: "var(--accent-ink)", flexShrink: 0 }}>{a.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer className="pf-footer">
        <div className="pf-footer-name">
          Bhuwan Kumar Rasala <span className="pf-dot" /> AI/ML &amp; Web Developer <span className="pf-dot" /> VNRVJIET
        </div>
        <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>B.Tech CSE IoT · 2023–Present</div>
      </footer>
    </>
  );
}