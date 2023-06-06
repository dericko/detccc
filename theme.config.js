const YEAR = new Date().getFullYear();

const meta = {
  title: "detc.cc",
  description: "My personal site and portfolio.",
};

export default {
  logo: "detc.cc",
  head: (
    <>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={meta.description} />
      <meta property="og:site_name" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
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
          <a className="thx" href="https://github.com/shuding/nextra">
            built w/ nextra
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
          .thx {
            float: right;
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
