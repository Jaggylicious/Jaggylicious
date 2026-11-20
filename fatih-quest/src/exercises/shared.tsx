import type { ReactNode } from 'react';
import { Button, SpeakButton } from '../components/ui';
import { COLORS } from '../content/objects';

export function Instruction({ text, speakText, children }: { text: string; speakText?: string; children?: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <h2 className="text-2xl md:text-3xl font-extrabold flex-1 leading-snug">{text}</h2>
      {children}
      <SpeakButton text={speakText ?? text} label="Opdracht voorlezen" />
    </div>
  );
}

export function Feedback({
  kind,
  title,
  text,
  onNext,
}: {
  kind: 'goed' | 'uitleg';
  title: string;
  text?: string;
  onNext: () => void;
}) {
  return (
    <div className={`rounded-3xl p-5 pop ${kind === 'goed' ? 'bg-leaf/20 border border-leaf/50' : 'bg-sea/15 border border-sea/40'}`}>
      <p className="text-xl font-extrabold mb-1">{title}</p>
      {text && <p className="text-lg">{text}</p>}
      <Button onClick={onNext} className="mt-4 w-full">
        Verder →
      </Button>
    </div>
  );
}

export function Gentle({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-white/8 p-4 text-lg fade-in">{children}</p>;
}

export function HintBox({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-sun/15 border border-sun/40 p-4 text-lg fade-in">💡 {children}</p>;
}

/** Eenvoudige, originele SVG-vormen in een kleur. */
export function ShapeIcon({ shape, color, size = 72 }: { shape: string; color: string; size?: number }) {
  const fill = COLORS.find((c) => c.id === color)?.fill ?? color;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      {shape === 'planeet' && (
        <>
          <circle cx="50" cy="50" r="28" fill={fill} />
          <ellipse cx="50" cy="52" rx="45" ry="11" fill="none" stroke={fill} strokeWidth="6" opacity=".85" transform="rotate(-15 50 50)" />
        </>
      )}
      {shape === 'ster' && (
        <polygon points="50,6 62,38 96,38 68,58 79,92 50,72 21,92 32,58 4,38 38,38" fill={fill} />
      )}
      {shape === 'raket' && (
        <>
          <path d="M50 6 C68 22 70 50 64 72 H36 C30 50 32 22 50 6Z" fill={fill} />
          <circle cx="50" cy="38" r="8" fill="#0b1d3a" />
          <path d="M36 60 L22 80 L38 74Z M64 60 L78 80 L62 74Z" fill={fill} />
          <path d="M42 74 L50 94 L58 74Z" fill="#facc15" />
        </>
      )}
    </svg>
  );
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
