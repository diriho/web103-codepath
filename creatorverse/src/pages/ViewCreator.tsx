import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { Creator } from '../types';
import { platformBadgeClass } from '../lib/platformBadge';
import { PLATFORM_ASSETS } from '../lib/platformAssets';

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function ViewCreator() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!mounted) return;
      setLoading(false);
      if (fetchError) {
        setError(fetchError.message);
        return;
      }
      if (!data) {
        setNotFound(true);
        return;
      }
      setCreator(data as Creator);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!creator) return;
    setDeleting(true);
    const { error: deleteError } = await supabase
      .from('creators')
      .delete()
      .eq('id', creator.id);
    setDeleting(false);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    navigate('/creators');
  };

  if (loading) {
    return (
      <div className="loading-fullscreen">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (notFound || !creator) {
    return (
      <div className="page container">
        <Link to="/creators" className="back-link">
          ← Back to creators
        </Link>
        <div className="empty-state">
          <h2>Creator not found</h2>
          <p>
            This creator doesn't exist, or it lives in someone else's
            Creatorverse.
          </p>
          <Link to="/creators" className="btn btn-primary">
            Back to your creators
          </Link>
        </div>
      </div>
    );
  }

  const platformLinks = Array.isArray(creator.platforms)
    ? creator.platforms
    : [];
  const primaryLink = platformLinks[0]?.url || creator.url || '';

  return (
    <div className="page container">
      <Link to="/creators" className="back-link">
        ← Back to creators
      </Link>

      {error && <div className="form-error" role="alert">{error}</div>}

      <div className="creator-detail">
        <div className="creator-detail-image">
          {creator.image_url ? (
            <img src={creator.image_url} alt={creator.name} />
          ) : (
            <div className="creator-card-placeholder" aria-hidden="true">
              {getInitials(creator.name) || '?'}
            </div>
          )}
        </div>

        <div className="creator-detail-meta">
          {platformLinks.length > 0 ? (
            <div className="creator-platforms">
              {platformLinks.map((link) => (
                <span
                  key={`${link.platform}-${link.username}`}
                  className={`${platformBadgeClass(link.platform)} badge-logo`}
                >
                  <img
                    src={PLATFORM_ASSETS[link.platform].src}
                    alt={PLATFORM_ASSETS[link.platform].label}
                  />
                </span>
              ))}
            </div>
          ) : (
            creator.platform && (
              <span className={`${platformBadgeClass(creator.platform)} badge-logo`}>
                <img
                  src={PLATFORM_ASSETS[creator.platform].src}
                  alt={PLATFORM_ASSETS[creator.platform].label}
                />
              </span>
            )
          )}
          <h1>{creator.name}</h1>
          <p className="creator-detail-desc">{creator.description}</p>

          {platformLinks.length > 0 ? (
            <ul className="platform-link-list">
              {platformLinks.map((link) => (
                <li key={`${link.platform}-${link.username}-link`}>
                  <span className="platform-link-meta">
                    <img
                      src={PLATFORM_ASSETS[link.platform].src}
                      alt={PLATFORM_ASSETS[link.platform].label}
                    />
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{link.username}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            primaryLink && (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Visit channel ↗
              </a>
            )
          )}

          <div className="btn-row">
            <Link to={`/creators/${creator.id}/edit`} className="btn">
              Edit
            </Link>
            {!confirming && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setConfirming(true)}
              >
                Delete
              </button>
            )}
          </div>

          {confirming && (
            <div className="confirm-inline">
              <strong>Delete {creator.name}?</strong>
              <span className="text-muted">
                This will remove the creator from your Creatorverse permanently.
              </span>
              <div className="btn-row">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting…' : 'Yes, delete'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setConfirming(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
