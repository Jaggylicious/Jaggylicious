/**
 * Eenvoudige, toegankelijke grafieken (één reeks, één kleur, rustige assen, hover-tooltip,
 * plus altijd een tabelweergave). Geen externe bibliotheek.
 */
import { useState } from 'react';

export function WeekBars({ data, unit, title }: { data: { label: string; value: number }[]; unit: string; title: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(10, ...data.map((d) => d.value));
  const W = 320, H = 160, pad = 24, bw = (W - pad * 2) / data.length;
  return (
    <figure className="w-full">
      <figcaption className="font-extrabold mb-2">{title}</figcaption>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full h-auto" role="img" aria-label={`${title}: ${data.map((d) => `${d.label} ${d.value} ${unit}`).join(', ')}`}>
          <line x1={pad} x2={W - pad} y1={H} y2={H} stroke="currentColor" strokeOpacity=".25" />
          {data.map((d, i) => {
            const h = (d.value / max) * (H - 20);
            const x = pad + i * bw + bw * 0.2;
            const w = bw * 0.6;
            return (
              <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}>
                <rect x={pad + i * bw} y={0} width={bw} height={H} fill="transparent" />
                {h > 0 && <path d={roundedTop(x, H - h, w, h, 4)} fill="var(--color-sea)" opacity={hover === null || hover === i ? 1 : 0.5} />}
                <text x={x + w / 2} y={H + 16} textAnchor="middle" fontSize="11" fill="currentColor" opacity=".7">{d.label}</text>
                {(hover === i || i === data.length - 1) && d.value > 0 && (
                  <text x={x + w / 2} y={H - h - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">{d.value}</text>
                )}
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <div className="absolute top-0 right-0 rounded-lg bg-night-3 border border-white/10 px-3 py-1 text-sm pointer-events-none">
            Week van {data[hover].label}: <strong>{data[hover].value} {unit}</strong>
          </div>
        )}
      </div>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-white/70">Toon als tabel</summary>
        <table className="mt-2 w-full text-left">
          <thead><tr><th className="py-1">Week van</th><th>{unit}</th></tr></thead>
          <tbody>{data.map((d) => <tr key={d.label}><td className="py-1">{d.label}</td><td>{d.value}</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  );
}

function roundedTop(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, h, w / 2);
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
}

/** Horizontale balk 0–100% met label en waarde (één reeks). */
export function PercentRows({ rows, title, note }: { rows: { label: string; value: number; detail?: string }[]; title: string; note?: string }) {
  return (
    <figure>
      <figcaption className="font-extrabold mb-1">{title}</figcaption>
      {note && <p className="text-sm text-white/60 mb-3">{note}</p>}
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.label} title={r.detail}>
            <div className="flex justify-between text-sm mb-1">
              <span>{r.label}</span>
              <span className="font-bold">{Math.round(r.value * 100)}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-sea" style={{ width: `${Math.max(2, r.value * 100)}%` }} />
            </div>
            {r.detail && <p className="text-xs text-white/50 mt-1">{r.detail}</p>}
          </div>
        ))}
      </div>
    </figure>
  );
}
