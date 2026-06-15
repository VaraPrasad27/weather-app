import type { ReactNode } from 'react';

type CardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export default function Card({
  title,
  subtitle,
  children,
  className = '',
}: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5 shadow-lg shadow-black/20 ${className}`}
    >
      {(title || subtitle) && (
        <header className="mb-4 flex items-baseline justify-between gap-2">
          {title && (
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              {title}
            </h3>
          )}
          {subtitle && (
            <span className="text-xs text-[var(--color-muted)]">
              {subtitle}
            </span>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
