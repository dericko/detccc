const YEAR = new Date().getFullYear();

export default {
  logo: "detc.cc",
  footer: {
    component: (
      <footer>
        <small>
          <time>{YEAR}</time> <span className="copyLeft">&copy;</span>{" "}
          <a className="gh" href="https://github.com/dericko/detccc">You can have it.</a>
          <a className="thx" href="https://github.com/shuding/nextra">built w/ nextra</a>
        </small>
        <style jsx>{`
          footer {
            margin-top: 8rem;
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
  gitTimestamp: false,
  search: {
    placeholder: "Search"
  }
};
