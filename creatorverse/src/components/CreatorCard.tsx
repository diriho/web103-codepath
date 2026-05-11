import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Creator } from '../types';
import { platformBadgeClass } from '../lib/platformBadge';

interface CreatorCardProps {
  creator: Creator;
  onDelete: (id: number) => Promise<void> | void;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function CreatorCard({ creator, onDelete }: CreatorCardProps) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const platformLinks = Array.isArray(creator.platforms)
    ? creator.platforms
    : [];
  const primaryLink = platformLinks[0]?.url || creator.url || '';

  const stop = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const handleConfirmDelete = async (event: MouseEvent) => {
    event.stopPropagation();
    setDeleting(true);
    await onDelete(creator.id);
    setDeleting(false);
  };

  const handleCardClick = () => {
    if (confirming) return;
    navigate(`/creators/${creator.id}`);
  };

  return (
    <article
      className="creator-card"
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/creators/${creator.id}`);
      }}
    >
      <div className="creator-card-thumb">
        {creator.image_url ? (
          <img src={creator.image_url} alt={`${creator.name} thumbnail`} />
        ) : (
          <div className="creator-card-placeholder" aria-hidden="true">
            {getInitials(creator.name) || '?'}
          </div>
        )}
      </div>

      <div className="creator-card-body">
        {platformLinks.length > 0 ? (
          <div className="creator-platforms">
            {platformLinks.map((link) => (
              <span
                key={`${link.platform}-${link.username}`}
                className={platformBadgeClass(link.platform)}
              >
                {link.platform}
              </span>
            ))}
          </div>
        ) : (
          creator.platform && (
            <span className={platformBadgeClass(creator.platform)}>
              {creator.platform}
            </span>
          )
        )}
        <h3>{creator.name}</h3>
        <p className="creator-card-desc">{creator.description}</p>

        {confirming ? (
          <div className="creator-card-confirm" onClick={stop}>
            <span>Delete {creator.name}?</span>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                stop(e);
                setConfirming(false);
              }}
              disabled={deleting}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="creator-card-actions" onClick={stop}>
            {primaryLink && (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm"
                onClick={stop}
              >
                Visit ↗
              </a>
            )}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                stop(e);
                navigate(`/creators/${creator.id}`);
              }}
            >
              View
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                stop(e);
                navigate(`/creators/${creator.id}/edit`);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={(e) => {
                stop(e);
                setConfirming(true);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
