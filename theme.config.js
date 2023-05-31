const YEAR = new Date().getFullYear();

export default {
  footer: (
    <footer>
      <small>
        <time>{YEAR}</time> <span className="copyLeft">&copy;</span>
        {' '}<a href="https://github.com/dericko/detccc">You can have it.</a>
        <a className="feed" href="/feed.xml">RSS</a>
      </small>
      <style jsx>{`
        .copyLeft {
          display: inline-block;
          transform: rotateY(180deg);
        }
        footer {
          margin-top: 8rem;
        }
        .feed {
          float: right;
        }
      `}</style>
    </footer>
  ),
};
