import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { speak } from '../core/speech';

type Variant = 'primary' | 'secondary' | 'ghost' | 'choice' | 'danger';

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    'rounded-2xl font-bold transition active:scale-[.98] disabled:opacity-40 disabled:active:scale-100 min-h-14 px-5 py-3 text-lg select-none';
  const v: Record<Variant, string> = {
    primary: 'bg-sun text-night hover:brightness-105 shadow-lg shadow-black/20',
    secondary: 'bg-sea/90 text-night hover:brightness-105',
    ghost: 'bg-white/8 text-slate-100 hover:bg-white/12 border border-white/10',
    choice: 'bg-night-3 text-white border-2 border-white/10 hover:border-sea/70',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
  };
  return (
    <button className={`${base} ${v[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function SpeakButton({ text, label = 'Lees voor' }: { text: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => speak(text, true)}
      className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 w-12 h-12 text-2xl shrink-0"
      aria-label={label}
      title={label}
    >
      🔊
    </button>
  );
}

export function TopBar({
  title,
  onBack,
  right,
}: {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="flex items-center gap-3 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-2 no-print">
      {onBack ? (
        <button
          onClick={onBack}
          className="rounded-full bg-white/10 hover:bg-white/20 h-12 px-4 text-lg font-bold"
          aria-label="Terug"
        >
          ← Terug
        </button>
      ) : (
        <div className="w-2" />
      )}
      <h1 className="flex-1 text-xl font-extrabold truncate">{title}</h1>
      {right}
    </header>
  );
}

export function Stars({ n }: { n: number }) {
  return (
    <div className="rounded-full bg-white/10 px-3 h-11 flex items-center gap-1 font-bold" aria-label={`${n} sterren`}>
      <span aria-hidden>⭐</span>
      {n}
    </div>
  );
}

export function Page({ children, nature = false }: { children: ReactNode; nature?: boolean }) {
  return <div className={`min-h-screen ${nature ? 'sky-nature' : 'sky'} flex flex-col`}>{children}</div>;
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={`w-full max-w-3xl mx-auto px-4 pb-10 flex-1 ${className}`}>{children}</main>;
}

/** Toont tekst met [gemarkeerde] woorden. */
export function Marked({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('[') ? (
          <mark key={i} className="bg-sun/90 text-night rounded px-1">
            {p.slice(1, -1)}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function Tile({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card rounded-3xl p-5 ${className}`}>{children}</div>;
}
