'use client';

import {
  type CSSProperties,
  type FormEventHandler,
  type ReactNode,
  useEffect,
} from 'react';
import { X, Trash } from 'lucide-react';

import '@/styles/modalLayout.css';

interface ModalLayoutProps {
  isOpen: boolean;
  title: string;
  description: string;
  titleId: string;
  icon: ReactNode;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  saving?: boolean;
  submitButton: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  maxWidth?: number;
  actionType?: 'save' | 'delete';
}

export default function ModalLayout({
  isOpen,
  title,
  description,
  titleId,
  icon,
  onClose,
  onSubmit,
  saving = false,
  submitButton,
  children,
  footer,
  maxWidth = 635,
  actionType = 'save',
}: ModalLayoutProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !saving) {
        onClose();
      }
    }

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  const isDeleteAction = actionType === 'delete';

  return (
    <div
      className="app-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        className="app-modal"
        style={
          {
            '--modal-max-width': `${maxWidth}px`,
          } as CSSProperties
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="app-modal-header">
          <div className="app-modal-heading">
            <span className="app-modal-icon">{icon}</span>

            <div>
              <h2 id={titleId}>{title}</h2>
              <p>{description}</p>
            </div>
          </div>

          <button
            type="button"
            className="app-modal-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
          >
            <X size={21} />
          </button>
        </header>

        <form onSubmit={onSubmit}>
          {children}

          <footer className="app-modal-footer">
            {footer}

            {isDeleteAction ? (
              <button
                type="submit"
                className="app-modal-delete"
                disabled={saving}
              >
                <Trash size={18} />
                {submitButton}
              </button>
            ) : (
              <button
                type="submit"
                className="app-modal-submit"
                disabled={saving}
              >
                {submitButton}
              </button>
            )}
          </footer>
        </form>
      </section>
    </div>
  );
}
