import Head from "next/head";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found — Bhuwan Kumar Rasala</title>
        <meta name="theme-color" content="#faf9f5" />
      </Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        .nf-wrap {
          min-height: 100vh; min-height: 100dvh;
          background: #faf9f5; color: #17180f;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 2rem; font-family: 'DM Sans', sans-serif;
        }
        .nf-code {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(3.5rem, 12vw, 7rem);
          letter-spacing: -.03em; color: #587a1f; line-height: 1; margin-bottom: 1rem;
        }
        .nf-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.4rem; margin-bottom: .75rem; }
        .nf-desc { color: #726f62; max-width: 40ch; line-height: 1.6; margin-bottom: 2rem; }
        .nf-link {
          display: inline-flex; align-items: center; gap: .5rem; text-decoration: none;
          background: #c8f560; color: #0a0a0a; font-weight: 700; font-size: .9rem;
          padding: .75rem 1.75rem; border-radius: .35rem; box-shadow: 0 10px 30px -12px rgba(60,55,30,.25);
          transition: transform .2s, background .2s;
        }
        .nf-link:hover { background: #a8d940; transform: translateY(-2px); }
        .nf-link:focus-visible { outline: 2px solid #587a1f; outline-offset: 3px; }
      `}</style>
      <div className="nf-wrap">
        <div className="nf-code">404</div>
        <div className="nf-title">This page doesn't exist.</div>
        <p className="nf-desc">
          The page you're looking for isn't here. It may have been moved, or the link might be wrong.
        </p>
        <a className="nf-link" href="/">← Back to portfolio</a>
      </div>
    </>
  );
}