const YEAR = new Date().getFullYear();

const meta = {
  title: "detc.cc",
  description: "My personal site and portfolio.",
};

export default {
  logo: "detc.cc",
  navbar: {
    extraContent: (
      <nav className="topLinks">
        <a href="https://www.linkedin.com/in/dericktc/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="https://github.com/dericko" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="https://ddj-three.vercel.app/" target="_blank" rel="noreferrer">
          Tao Translate
        </a>
        <a href="/work">Projects</a>
        <style jsx>{`
          .topLinks {
            display: flex;
            gap: 1.25rem;
            align-items: center;
            font-size: 0.875rem;
          }
          .topLinks a {
            color: #69778c;
            white-space: nowrap;
          }
          .topLinks a:hover {
            color: #0074de;
          }
        `}</style>
      </nav>
    ),
  },
  head: (
    <>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={meta.description} />
      <meta property="og:site_name" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <style>{`.nextra-search { order: 1; }`}</style>
    </>
  ),
  useNextSeoProps: () => ({ titleTemplate: `%s | ${meta.title}` }),
  footer: {
    component: (
      <footer>
        <small>
          <time>{YEAR}</time> <span className="copyLeft">&copy;</span>{" "}
          <a className="gh" href="https://github.com/dericko/detccc">
            You can have it.
          </a>
        </small>
        <style jsx>{`
          footer {
            margin: 0 2rem;
          }
          a {
            text-decoration: underline;
          }
          .copyLeft {
            display: inline-block;
            transform: rotateY(180deg);
          }
        `}</style>
      </footer>
    ),
  },
  faviconGlyph: "📚",
  gitTimestamp: null,
  search: {
    placeholder: "Search",
  },
  editLink: {
    component: () => null,
  },
  feedback: {
    content: null,
  }
};
