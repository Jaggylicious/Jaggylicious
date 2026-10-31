import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type VacatureProps = {
  hook: string;
  functie: string;
  locatie: string;
  uren: string;
  salaris: string;
  pluspunten: string[];
  cta: string;
  // Huisstijl: vervang door de echte Boom-kleuren en het logo in public/.
  kleurPrimair?: string;
  kleurAccent?: string;
  kleurAchtergrond?: string;
  kleurTekst?: string;
  lettertype?: string;
  logo?: string; // bestandsnaam in public/, leeg = tekstlogo
  merknaam?: string;
};

export const standaardProps: VacatureProps = {
  hook: "Elke dag beloond voor je belwerk?",
  functie: "Binnendienst Sales",
  locatie: "Utrecht",
  uren: "32–40 uur",
  salaris: "€3.200 – €3.900",
  pluspunten: ["Leaseauto na proeftijd", "Vast contract na 1 jaar", "Bonus op elke deal"],
  cta: "Solliciteer via de link in bio",
};

// Tijdlijn in frames (30 fps): hook 0–3s, functie 3–6s, pluspunten 6–11s, voorwaarden 11–13s, CTA 13–16s.
const HOOK = 90;
const FUNCTIE = 90;
const PLUS = 150;
const VOORWAARDEN = 60;
const CTA = 90;
export const DUUR = HOOK + FUNCTIE + PLUS + VOORWAARDEN + CTA;

// Lengte hangt af van wat is ingevuld: lege onderdelen vallen weg.
export const berekenDuur = (p: VacatureProps) =>
  HOOK +
  FUNCTIE +
  ((p.pluspunten ?? []).filter(Boolean).length ? PLUS : 0) +
  (p.salaris || p.uren ? VOORWAARDEN : 0) +
  CTA;

type Stijl = Required<Pick<VacatureProps, "kleurPrimair" | "kleurAccent" | "kleurAchtergrond" | "kleurTekst" | "lettertype">>;

const useIn = (vertraging = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - vertraging, fps, config: { damping: 200 } });
  return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px)` };
};

const Uitfaden: React.FC<{ duur: number; children: React.ReactNode }> = ({ duur, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [duur - 10, duur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const Midden: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90, textAlign: "center" }}>
    {children}
  </AbsoluteFill>
);

const Hook: React.FC<{ tekst: string; s: Stijl }> = ({ tekst, s }) => {
  const frame = useCurrentFrame();
  const schaal = interpolate(frame, [0, 12], [0.85, 1], { extrapolateRight: "clamp" });
  return (
    <Midden>
      <div style={{ fontSize: 112, fontWeight: 800, lineHeight: 1.1, color: s.kleurTekst, transform: `scale(${schaal})` }}>
        {tekst}
      </div>
    </Midden>
  );
};

const Functie: React.FC<{ functie: string; locatie: string; s: Stijl }> = ({ functie, locatie, s }) => {
  const a = useIn(0);
  const b = useIn(10);
  return (
    <Midden>
      <div style={{ ...a, fontSize: 48, fontWeight: 700, letterSpacing: 6, color: s.kleurAccent, marginBottom: 30 }}>VACATURE</div>
      <div style={{ ...a, fontSize: 104, fontWeight: 800, lineHeight: 1.1, color: s.kleurTekst }}>{functie}</div>
      {locatie && <div style={{ ...b, fontSize: 64, marginTop: 40, color: s.kleurTekst }}>📍 {locatie}</div>}
    </Midden>
  );
};

const Pluspunt: React.FC<{ tekst: string; vertraging: number; s: Stijl }> = ({ tekst, vertraging, s }) => {
  const stijl = useIn(vertraging);
  return (
    <div
      style={{
        ...stijl,
        display: "flex",
        alignItems: "center",
        gap: 30,
        background: s.kleurPrimair,
        color: "#fff",
        borderRadius: 28,
        padding: "36px 44px",
        fontSize: 58,
        fontWeight: 700,
        width: "100%",
        textAlign: "left",
      }}
    >
      <span style={{ color: s.kleurAccent }}>✓</span>
      {tekst}
    </div>
  );
};

const Pluspunten: React.FC<{ punten: string[]; s: Stijl }> = ({ punten, s }) => (
  <Midden>
    <div style={{ display: "flex", flexDirection: "column", gap: 40, width: "100%" }}>
      {punten.slice(0, 3).map((p, i) => (
        <Pluspunt key={i} tekst={p} vertraging={i * 30} s={s} />
      ))}
    </div>
  </Midden>
);

const Voorwaarden: React.FC<{ salaris: string; uren: string; s: Stijl }> = ({ salaris, uren, s }) => {
  const a = useIn(0);
  const b = useIn(8);
  return (
    <Midden>
      {salaris && <div style={{ ...a, fontSize: 96, fontWeight: 800, color: s.kleurTekst }}>{salaris}</div>}
      {salaris && <div style={{ ...a, fontSize: 48, color: s.kleurTekst, opacity: 0.7 }}>bruto per maand</div>}
      {uren && <div style={{ ...b, fontSize: 64, fontWeight: 700, marginTop: 50, color: s.kleurAccent }}>{uren}</div>}
    </Midden>
  );
};

const Cta: React.FC<{ cta: string; logo?: string; merknaam: string; s: Stijl }> = ({ cta, logo, merknaam, s }) => {
  const a = useIn(0);
  const b = useIn(15);
  return (
    <Midden>
      <div
        style={{ ...a, background: s.kleurAccent, color: s.kleurPrimair, borderRadius: 999, padding: "44px 64px", fontSize: 64, fontWeight: 800 }}
      >
        {cta}
      </div>
      <div style={{ ...b, marginTop: 120 }}>
        {logo ? (
          <Img src={staticFile(logo)} style={{ height: 160 }} />
        ) : (
          <div style={{ fontSize: 80, fontWeight: 900, letterSpacing: 4, color: s.kleurTekst }}>{merknaam}</div>
        )}
      </div>
    </Midden>
  );
};

export const VacatureReel: React.FC<VacatureProps> = (p) => {
  const s: Stijl = {
    kleurPrimair: p.kleurPrimair ?? "#14213D",
    kleurAccent: p.kleurAccent ?? "#FCA311",
    kleurAchtergrond: p.kleurAchtergrond ?? "#F5F1E8",
    kleurTekst: p.kleurTekst ?? "#14213D",
    lettertype: p.lettertype ?? "Inter, Helvetica, Arial, sans-serif",
  };
  const merknaam = p.merknaam ?? "BOOM RECRUITMENT";
  const punten = (p.pluspunten ?? []).filter(Boolean);
  const heeftVoorwaarden = Boolean(p.salaris || p.uren);

  // Lege onderdelen overslaan, zodat er geen lege schermen in de reel komen.
  const scenes: { duur: number; inhoud: React.ReactNode }[] = [
    { duur: HOOK, inhoud: <Hook tekst={p.hook} s={s} /> },
    { duur: FUNCTIE, inhoud: <Functie functie={p.functie} locatie={p.locatie} s={s} /> },
    ...(punten.length ? [{ duur: PLUS, inhoud: <Pluspunten punten={punten} s={s} /> }] : []),
    ...(heeftVoorwaarden ? [{ duur: VOORWAARDEN, inhoud: <Voorwaarden salaris={p.salaris} uren={p.uren} s={s} /> }] : []),
  ];
  scenes.push({ duur: CTA, inhoud: <Cta cta={p.cta} logo={p.logo} merknaam={merknaam} s={s} /> });

  let start = 0;
  return (
    <AbsoluteFill style={{ background: s.kleurAchtergrond, fontFamily: s.lettertype }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 24, background: s.kleurPrimair }} />
      {scenes.map((sc, i) => {
        const van = start;
        start += sc.duur;
        const laatste = i === scenes.length - 1;
        return (
          <Sequence key={i} from={van} durationInFrames={sc.duur}>
            {laatste ? sc.inhoud : <Uitfaden duur={sc.duur}>{sc.inhoud}</Uitfaden>}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
