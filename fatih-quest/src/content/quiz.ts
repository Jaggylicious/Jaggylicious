/** Generiek meerkeuze-item, gebruikt door taal, verhalen en rekenen. */
export interface QuizItem {
  id: string;
  level: number;
  topic?: string;
  /** Korte opdracht bovenaan (één primaire opdracht). */
  prompt: string;
  /** Tekst die voorgelezen wordt (standaard = prompt + body). */
  speak?: string;
  /** Hoofdinhoud, bijv. de zin of de som. Woorden tussen [ ] worden gemarkeerd. */
  body?: string;
  visual?: string; // emoji of korte visuele ondersteuning
  options: string[];
  answer: string;
  hint: string;
  /** Uitleg na het antwoord – kort en positief. */
  explain: string;
  /** Optionele afbeelding-component sleutel (klok, geld, blokjes). */
  render?: { kind: 'klok'; h: number; m: number } | { kind: 'geld'; coins: number[] } | { kind: 'blokjes'; tens: number; ones: number };
}
