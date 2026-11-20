import { describe, expect, it } from 'vitest';
import { chooseNextWord, newCard, reviewCard } from '../core/srs';

const DAY = 86400000;

describe('herhaalsysteem', () => {
  it('zelfstandig goed gaat een bakje omhoog en wacht langer', () => {
    const c = reviewCard(newCard('a', 0), 'zelfstandig', 0);
    expect(c.box).toBe(2);
    expect(c.due).toBe(2 * DAY);
  });
  it('nog niet gaat terug naar bakje 1 en komt snel terug', () => {
    const c = reviewCard({ ...newCard('a', 0), box: 4 }, 'nogNiet', 0);
    expect(c.box).toBe(1);
    expect(c.due).toBeLessThan(DAY);
  });
  it('met hulp blijft in hetzelfde bakje, morgen opnieuw', () => {
    const c = reviewCard({ ...newCard('a', 0), box: 3 }, 'metHulp', 0);
    expect(c.box).toBe(3);
    expect(c.due).toBe(DAY);
  });
  it('kiest eerst woorden die aan de beurt zijn, laagste bakje eerst', () => {
    const cards = {
      a: { ...newCard('a', 0), box: 3, due: 10 },
      b: { ...newCard('b', 0), box: 1, due: 20 },
    };
    expect(chooseNextWord(['a', 'b', 'c'], cards, 100, 0).wordId).toBe('b');
  });
  it('introduceert nieuwe woorden tot het maximum', () => {
    expect(chooseNextWord(['a', 'b'], {}, 0, 0)).toEqual({ wordId: 'a', isNew: true });
    const cards = { a: { ...newCard('a', 0), due: 999 } };
    expect(chooseNextWord(['a', 'b'], cards, 0, 3).wordId).toBe('a');
  });
});
