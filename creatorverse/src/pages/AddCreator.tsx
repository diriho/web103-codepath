import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { buildPlatformLinks, isValidUrl } from '../lib/platformLinks';
import { PLATFORMS } from '../types';
import type { CreatorFormData, Platform, PlatformInput } from '../types';

export default function AddCreator() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreatorFormData>({
    name: '',
    description: '',
    image_url: '',
    platforms: [{ platform: '', username: '' }],
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof CreatorFormData>(
    key: K,
    value: CreatorFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updatePlatform = <K extends keyof PlatformInput>(
    index: number,
    key: K,
    value: PlatformInput[K],
  ) => {
    setForm((prev) => {
      const nextPlatforms = prev.platforms.map((entry, i) =>
        i === index ? { ...entry, [key]: value } : entry,
      );
      return { ...prev, platforms: nextPlatforms };
    });
  };

  const addPlatform = () => {
    setForm((prev) => ({
      ...prev,
      platforms: [...prev.platforms, { platform: '', username: '' }],
    }));
  };

  const removePlatform = (index: number) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      setError('You must be logged in to add a creator.');
      return;
    }

    setSubmitting(true);
    const primaryLink = platformLinks[0];
    const { error: insertError } = await supabase.from('creators').insert([
      {
        user_id: userId,
        name,
        url: primaryLink.url,
        description,
        image_url: imageUrl || null,
        platform: primaryLink.platform,
        platforms: platformLinks,
      },
    ]);
    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    navigate('/creators');
  };

  return (
    <div className="page container-narrow">
      <Link to="/creators" className="back-link">
        ← Back to creators
      </Link>
      <header style={{ marginBottom: 'var(--space-6)' }}>
        <span className="eyebrow">New entry</span>
        <h1>Add a creator</h1>
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
            placeholder="https://"
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
            disabled={submitting}
          >
            {submitting ? 'Saving…' : 'Add creator'}
          </button>
          <Link to="/creators" className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
