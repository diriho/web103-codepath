import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { Creator } from '../types';
import CreatorCard from '../components/CreatorCard';

export default function ShowCreators() {
  const [creators, setCreators] = useState<Creator[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data, error: fetchError } = await supabase
        .from('creators')
        .select('*')
        .order('created_at', { ascending: false });

      if (!mounted) return;
      if (fetchError) {
        setError(fetchError.message);
        setCreators([]);
        return;
      }
      setCreators((data ?? []) as Creator[]);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    const previous = creators;
    setCreators((current) => current?.filter((c) => c.id !== id) ?? []);

    const { error: deleteError } = await supabase
      .from('creators')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      setCreators(previous);
    }
  };

  return (
    <div className="page container">
      <header className="page-header">
        <div>
          <span className="eyebrow">Your Creatorverse</span>
          <h1>Creators</h1>
        </div>
        <Link to="/creators/add" className="btn btn-primary">
          + Add creator
        </Link>
      </header>

      {error && <div className="form-error" role="alert">{error}</div>}

      {creators === null ? (
        <div className="creators-grid" aria-busy="true">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <div className="skeleton-card" key={n}>
              <div className="skeleton-thumb" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      ) : creators.length === 0 ? (
        <div className="empty-state">
          <h2>Your Creatorverse is empty.</h2>
          <p>
            Start your archive — drop in the first creator who shapes your
            taste. They'll live here, on a list that's only yours.
          </p>
          <Link to="/creators/add" className="btn btn-primary">
            Add your first creator
          </Link>
        </div>
      ) : (
        <div className="creators-grid">
          {creators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
