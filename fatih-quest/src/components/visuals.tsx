import { formatEuro } from '../content/rekenen';

export function Clock({ h, m, size = 180 }: { h: number; m: number; size?: number }) {
  const minuteAngle = (m / 60) * 360;
  const hourAngle = (((h % 12) + m / 60) / 12) * 360;
  const hand = (angle: number, len: number, w: number, color: string) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return (
      <line x1="100" y1="100" x2={100 + Math.cos(rad) * len} y2={100 + Math.sin(rad) * len} stroke={color} strokeWidth={w} strokeLinecap="round" />
    );
  };
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="Klok">
      <circle cx="100" cy="100" r="94" fill="#fff7e0" stroke="#2dd4bf" strokeWidth="6" />
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const rad = ((n * 30 - 90) * Math.PI) / 180;
        return (
          <text key={n} x={100 + Math.cos(rad) * 74} y={100 + Math.sin(rad) * 74 + 7} textAnchor="middle" fontSize="20" fontWeight="700" fill="#0b1d3a">
            {n}
          </text>
        );
      })}
      {hand(hourAngle, 44, 8, '#0b1d3a')}
      {hand(minuteAngle, 66, 5, '#0f766e')}
      <circle cx="100" cy="100" r="6" fill="#0b1d3a" />
    </svg>
  );
}

export function Coins({ coins }: { coins: number[] }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center" aria-label={`Munten: ${coins.map(formatEuro).join(', ')}`}>
      {coins.map((c, i) => {
        const euro = c >= 100;
        const size = euro ? 76 : c >= 20 ? 64 : 54;
        return (
          <div
            key={i}
            style={{ width: size, height: size }}
            className={`rounded-full flex items-center justify-center font-extrabold text-night border-4 ${
              euro ? 'bg-amber-200 border-slate-300' : 'bg-amber-400 border-amber-600'
            }`}
          >
            {euro ? `€${c / 100}` : `${c}c`}
          </div>
        );
      })}
    </div>
  );
}

export function Blocks({ tens, ones }: { tens: number; ones: number }) {
  return (
    <div className="flex items-end gap-2 justify-center flex-wrap" aria-label={`${tens} tientallen en ${ones} eenheden`}>
      {Array.from({ length: tens }, (_, i) => (
        <div key={`t${i}`} className="w-4 h-24 rounded bg-sea/80 grid grid-rows-10 overflow-hidden">
          {Array.from({ length: 10 }, (_, j) => (
            <div key={j} className="border-b border-night/30" />
          ))}
        </div>
      ))}
      <div className="flex flex-wrap w-12 gap-1">
        {Array.from({ length: ones }, (_, i) => (
          <div key={`o${i}`} className="w-4 h-4 rounded-sm bg-sun" />
        ))}
      </div>
    </div>
  );
}
