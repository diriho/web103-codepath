import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing">
      <section className="landing-hero container">
        <span className="eyebrow">A personal creator zine</span>
        <h1>
          Creator<span className="accent">verse</span>
        </h1>
        <p className="lede">
          Curate your personal universe of content creators — the streamers,
          YouTubers, podcasters, and makers who shape your world. Build your
          list, share your taste, discover what others are watching.
        </p>
        <div className="landing-cta">
          <Link to="/signup" className="btn btn-primary">
            Get started
          </Link>
          <Link to="/login" className="btn btn-ghost">
            Log in →
          </Link>
        </div>
      </section>

      <section className="landing-features container">
        <article>
          <span className="num">01 ·</span>
          <h3>Your creators, your rules</h3>
          <p>
            A private list of every voice you actually care about. No
            algorithms, no recommendations, no noise — just the people you
            choose to follow.
          </p>
        </article>
        <article>
          <span className="num">02 ·</span>
          <h3>Full CRUD control</h3>
          <p>
            Add, edit, and delete creators anytime. Tag them by platform, drop
            in a custom thumbnail, write a personal blurb. It's your archive.
          </p>
        </article>
        <article>
          <span className="num">03 ·</span>
          <h3>Secure & private per user</h3>
          <p>
            Auth-backed accounts with row-level security. Your list stays
            yours — every other Creatorverse user is invisible to you, and
            vice versa.
          </p>
        </article>
      </section>

      <footer className="landing-footer container">
        <span>Creatorverse · {new Date().getFullYear()}</span>
        <span>Built for the people who curate.</span>
      </footer>
    </div>
  );
}
