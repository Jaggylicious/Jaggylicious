import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
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

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  const reload = useCallback(async () => {
    setProfile(await loadProfile());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (!profile) return;
    setSpeechEnabled(profile.settings.readAloud);
    document.documentElement.classList.toggle('reduce-motion', profile.settings.reduceMotion);
  }, [profile]);

  const update = useCallback(async (fn: (p: Profile) => Profile) => {
    const current = await loadProfile();
    const next = fn(current);
    await saveProfile(next);
    setProfile(next);
  }, []);

  const addStars = useCallback(async (n: number) => {
    const current = await loadProfile();
    const stars = current.stars + n;
    const unlocked = cardsUnlockedBy(stars).map((c) => c.id);
    const fresh = unlocked.filter((id) => !current.unlockedCards.includes(id));
    const next = { ...current, stars, unlockedCards: [...new Set([...current.unlockedCards, ...unlocked])] };
    await saveProfile(next);
    setProfile(next);
    return fresh;
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, update, addStars, reload }}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const c = useContext(ProfileContext);
  if (!c) throw new Error('useProfile buiten ProfileProvider');
  return c;
}
