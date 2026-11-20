import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { allAttempts, allSessions, deleteAll, exportAll, getState, loadProfile, putSession, saveProfile } from '../core/db';
import { recordRound } from '../core/session';

beforeEach(async () => {
  await deleteAll(false);
});

describe('voortgangsregistratie (IndexedDB)', () => {
  it('slaat rondes op en werkt niveau bij', async () => {
    for (let i = 0; i < 5; i++) {
      await recordRound('zoek', 1, { correct: true, attempts: 1, hintsUsed: 0, replays: 0, itemId: `i${i}` }, 's1');
    }
    expect((await allAttempts()).length).toBe(5);
    expect((await getState('zoek')).level).toBe(2);
  });
  it('emotie-oefening wordt niet gescoord en verandert geen niveau', async () => {
    const r = await recordRound('emotie', 1, { correct: true, attempts: 1, hintsUsed: 0, replays: 0, unscored: true }, 's1');
    expect(r.change).toBeNull();
    const a = await allAttempts();
    expect(a[0].unscored).toBe(true);
    expect(JSON.stringify(a[0])).not.toMatch(/boos|blij|verdrietig/);
  });
  it('profiel opslaan en laden', async () => {
    const p = await loadProfile();
    await saveProfile({ ...p, stars: 7, onboarded: true });
    expect((await loadProfile()).stars).toBe(7);
  });
  it('export bevat geen pincode-hash', async () => {
    const p = await loadProfile();
    await saveProfile({ ...p, parentPinHash: 'geheim', parentPinSalt: 'zout' });
    const e = await exportAll();
    expect(JSON.stringify(e)).not.toContain('geheim');
  });
  it('wissen met behoud van instellingen', async () => {
    const p = await loadProfile();
    await saveProfile({ ...p, stars: 9, onboarded: true, settings: { ...p.settings, missionMinutes: 8 } });
    await putSession({ id: 'x', kind: 'vrij', startedAt: 1, activeSeconds: 60, exercises: [], pauses: 0, completed: true, stoppedEarly: false });
    await deleteAll(true);
    expect(await allSessions()).toEqual([]);
    const after = await loadProfile();
    expect(after.settings.missionMinutes).toBe(8);
    expect(after.stars).toBe(0);
    expect(after.onboarded).toBe(true);
  });
  it('alles wissen herstelt standaardprofiel', async () => {
    const p = await loadProfile();
    await saveProfile({ ...p, onboarded: true });
    await deleteAll(false);
    expect((await loadProfile()).onboarded).toBe(false);
  });
});
