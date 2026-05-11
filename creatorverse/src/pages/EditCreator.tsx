import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  buildPlatformLinks,
  extractUsernameFromUrl,
  isValidUrl,
} from '../lib/platformLinks';
import { PLATFORMS } from '../types';
import type {
  Creator,
  CreatorFormData,
  Platform,
  PlatformInput,
  PlatformLink,
} from '../types';

export default function EditCreator() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<CreatorFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      const c = data as Creator;
      const existingPlatforms = Array.isArray(c.platforms)
        ? (c.platforms as PlatformLink[])
        : [];
      const platformInputs: PlatformInput[] = existingPlatforms
        .filter(
          (entry) =>
            entry &&
            typeof entry === 'object' &&
            'platform' in entry &&
            'username' in entry,
        )
        .map((entry) => ({
          platform: entry.platform,
          username:
            entry.username ||
            extractUsernameFromUrl(entry.platform, entry.url) ||
            '',
        }));

      if (platformInputs.length === 0) {
        const fallbackPlatform = c.platform ?? '';
        const fallbackUsername =
          c.platform && c.url
            ? extractUsernameFromUrl(c.platform, c.url) ?? c.url
            : c.url ?? '';
        if (fallbackPlatform || fallbackUsername) {
          platformInputs.push({
            platform: fallbackPlatform,
            username: fallbackUsername,
          });
        }
      }

      if (platformInputs.length === 0) {
        platformInputs.push({ platform: '', username: '' });
      }

      setForm({
        name: c.name,
        description: c.description,
        image_url: c.image_url ?? '',
        platforms: platformInputs,
      });
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const update = <K extends keyof CreatorFormData>(
    key: K,
    value: CreatorFormData[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updatePlatform = <K extends keyof PlatformInput>(
    index: number,
    key: K,
    value: PlatformInput[K],
  ) => {
    setForm((prev) => {
      if (!prev) return prev;
      const nextPlatforms = prev.platforms.map((entry, i) =>
        i === index ? { ...entry, [key]: value } : entry,
      );
      return { ...prev, platforms: nextPlatforms };
    });
  };

  const addPlatform = () => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            platforms: [...prev.platforms, { platform: '', username: '' }],
          }
        : prev,
    );
  };

  const removePlatform = (index: number) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            platforms: prev.platforms.filter((_, i) => i !== index),
          }
        : prev,
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form || !id) return;
    setError(null);

    const name = form.name.trim();
    const description = form.description.trim();
    const imageUrl = form.image_url?.trim() || '';

    const hasIncompletePlatform = form.platforms.some(
      (entry) =>
        (entry.platform && !entry.username.trim()) ||
        (!entry.platform && entry.username.trim()),
    );
    if (hasIncompletePlatform) {
      setError('Each platform row needs both a platform and username.');
      return;
    }

    const platformLinks = buildPlatformLinks(form.platforms);
    if (platformLinks.length === 0) {
      setError('Add at least one platform username.');
      return;
    }

    if (!name || !description) {
      setError('Name and description are required.');
      return;
    }
    if (imageUrl && !isValidUrl(imageUrl)) {
      setError('Image URL must be a valid http(s) URL.');
      return;
    }

    setSubmitting(true);
    const primaryLink = platformLinks[0];
    const { error: updateError } = await supabase
      .from('creators')
      .update({
        name,
        url: primaryLink.url,
        description,
        image_url: imageUrl || null,
        platform: primaryLink.platform,
        platforms: platformLinks,
      })
      .eq('id', id);
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    navigate(`/creators/${id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    const { error: deleteError } = await supabase
      .from('creators')
      .delete()
      .eq('id', id);
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

  if (notFound || !form) {
    return (
      <div className="page container">
        <Link to="/creators" className="back-link">
          ← Back to creators
        </Link>
        <div className="empty-state">
          <h2>Creator not found</h2>
          <p>This creator doesn't exist, or it lives in someone else's Creatorverse.</p>
          <Link to="/creators" className="btn btn-primary">
            Back to your creators
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container-narrow">
      <Link to={`/creators/${id}`} className="back-link">
        ← Back to creator
      </Link>
      <header style={{ marginBottom: 'var(--space-6)' }}>
        <span className="eyebrow">Editing</span>
        <h1>Edit creator</h1>
      </header>

      <form className="form" onSubmit={handleSubmit} noValidate>
        {error && <div className="form-error" role="alert">{error}</div>}

        <div className="form-field">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="image_url">Image URL</label>
          <input
            id="image_url"
            type="url"
            value={form.image_url ?? ''}
            onChange={(e) => update('image_url', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Platforms *</label>
          <small className="text-muted">
            Add the creator username for each platform. We will build the
            profile links for you.
          </small>
          <div className="platform-list">
            {form.platforms.map((entry, index) => (
              <div className="platform-row" key={`${entry.platform}-${index}`}>
                <select
                  aria-label="Platform"
                  value={entry.platform}
                  onChange={(e) =>
                    updatePlatform(
                      index,
                      'platform',
                      (e.target.value as Platform | '') || '',
                    )
                  }
                >
                  <option value="">Platform</option>
                  {PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="@username"
                  value={entry.username}
                  onChange={(e) =>
                    updatePlatform(index, 'username', e.target.value)
                  }
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => removePlatform(index)}
                  disabled={form.platforms.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={addPlatform}
            >
              + Add platform
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || deleting}
          >
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
          <Link to={`/creators/${id}`} className="btn btn-ghost">
            Cancel
          </Link>
          {!confirming && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setConfirming(true)}
              disabled={submitting}
            >
              Delete
            </button>
          )}
        </div>

        {confirming && (
          <div className="confirm-inline">
            <strong>Delete {form.name}?</strong>
            <span className="text-muted">This cannot be undone.</span>
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
      </form>
    </div>
  );
}
