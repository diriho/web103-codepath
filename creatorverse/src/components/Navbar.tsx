import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();

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

  if (location.pathname === '/') return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isAuthed = !!session;
  const brandHref = isAuthed ? '/creators' : '/';

  return (
    <nav className="navbar" aria-label="Primary">
      <Link to={brandHref} className="navbar-brand">
        Creatorverse<span className="dot">.</span>
      </Link>
      <div className="navbar-actions">
        {isAuthed ? (
          <>
            {session?.user.email && (
              <span className="navbar-email" title={session.user.email}>
                {session.user.email}
              </span>
            )}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleSignOut}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">
              Log in
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
