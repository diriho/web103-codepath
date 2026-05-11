import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Landing() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAuthed = !!session;
  const displayName =
    session?.user.user_metadata?.full_name ||
    session?.user.user_metadata?.name ||
    session?.user.email?.split('@')[0] ||
    'friend';

  return (
    <div className="landing">
      <section className="landing-hero container">
        <span className="eyebrow">A personal creator catalogue</span>
        <h1>
          Creator<span className="accent">verse</span>
        </h1>
        {isAuthed && (
          <p className="landing-welcome">Welcome, {displayName}</p>
        )}
        <p className="lede">
          Curate your personal universe of content creators — the streamers,
          YouTubers, podcasters, and makers who shape your world. Build your
          list, share your taste, discover what others are watching.
        </p>
        <div className="landing-cta">
          <Link to={isAuthed ? '/creators' : '/signup'} className="btn btn-primary">
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
          <h3>Full control</h3>
          <p>
            Add, edit, and delete creators anytime. Tag them by platform, drop
            in a custom thumbnail, write a personal blurb. It's your archive.
          </p>
        </article>
        <article>
          <span className="num">03 ·</span>
          <h3>Secure and private per user</h3>
          <p>
            Your list stays yours! <br />
            Every other Creatorverse user is invisible to you, and
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
