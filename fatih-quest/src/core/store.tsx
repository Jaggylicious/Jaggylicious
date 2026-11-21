import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Profile } from './types';
import { loadProfile, saveProfile } from './db';
import { setSpeechEnabled } from './speech';
import { cardsUnlockedBy } from '../content/kaarten';

interface Ctx {
  profile: Profile | null;
  update: (fn: (p: Profile) => Profile) => Promise<void>;
  addStars: (n: number) => Promise<string[]>; // geeft nieuw vrijgespeelde kaart-ids terug
  reload: () => Promise<void>;
}

const ProfileContext = createContext<Ctx | null>(null);

/**
 * Profiel in geheugen + IndexedDB. Wijzigingen worden direct (optimistisch) in de UI
 * doorgevoerd en daarna in volgorde opgeslagen, zodat snelle wijzigingen elkaar niet overschrijven.
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const ref = useRef<Profile | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());

  const reload = useCallback(async () => {
    await queue.current;
    const p = await loadProfile();
    ref.current = p;
    setProfile(p);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (!profile) return;
    setSpeechEnabled(profile.settings.readAloud);
    document.documentElement.classList.toggle('reduce-motion', profile.settings.reduceMotion);
  }, [profile]);

  const apply = useCallback((fn: (p: Profile) => Profile) => {
    const base = ref.current;
    if (!base) return Promise.resolve();
    const next = fn(base);
    ref.current = next;
    setProfile(next);
    queue.current = queue.current.then(() => saveProfile(next)).catch(() => undefined);
    return queue.current;
  }, []);

  const update = useCallback(async (fn: (p: Profile) => Profile) => {
    if (!ref.current) await reload();
    await apply(fn);
  }, [apply, reload]);

  const addStars = useCallback(async (n: number) => {
    if (!ref.current) await reload();
    let fresh: string[] = [];
    await apply((current) => {
      const stars = current.stars + n;
      const unlocked = cardsUnlockedBy(stars).map((c) => c.id);
      fresh = unlocked.filter((id) => !current.unlockedCards.includes(id));
      return { ...current, stars, unlockedCards: [...new Set([...current.unlockedCards, ...unlocked])] };
    });
    return fresh;
  }, [apply, reload]);

  return (
    <ProfileContext.Provider value={{ profile, update, addStars, reload }}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const c = useContext(ProfileContext);
  if (!c) throw new Error('useProfile buiten ProfileProvider');
  return c;
}
