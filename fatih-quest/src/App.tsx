import { useEffect, useState } from 'react';
import { isExerciseAvailable } from './core/availability';
import { useRoute, go } from './core/router';
import { useProfile } from './core/store';
import { EXERCISES } from './core/catalog';
import type { ExerciseId } from './core/types';
import { Home } from './screens/Home';
import { Mission } from './screens/Mission';
import { World } from './screens/World';
import { FreePlay } from './screens/FreePlay';
import { Progress } from './screens/Progress';
import { Onboarding } from './screens/Onboarding';
import { ParentGate, isParentUnlocked } from './screens/ParentGate';
import { ParentDashboard } from './screens/ParentDashboard';
import { Report } from './screens/Report';

export default function App() {
  const { profile } = useProfile();
  const route = useRoute();
  const [, force] = useState(0);
  const [r0, r1, r2] = route;
  const validExercise =
    r0 !== 'oefen' ||
    (Object.hasOwn(EXERCISES, r1) && !!profile && isExerciseAvailable(r1 as ExerciseId, profile.settings.unlockedTopics));
  useEffect(() => {
    if (profile && !validExercise) go('home');
  }, [profile, validExercise]);
  if (!profile) return <div className="min-h-screen sky flex items-center justify-center text-xl">Fatih Quest laden…</div>;
  if (!profile.onboarded) return <Onboarding />;

  switch (r0) {
    case 'missie':
      return <Mission />;
    case 'wereld':
      return <World id={r1} />;
    case 'oefen':
      if (validExercise) return <FreePlay key={`${r1}-${r2 ?? ''}`} id={r1 as ExerciseId} param={r2} />;
      return null;
    case 'voortgang':
      return <Progress />;
    case 'ouder':
      if (!isParentUnlocked()) return <ParentGate onUnlock={() => force((x) => x + 1)} />;
      return r1 === 'rapport' ? <Report /> : <ParentDashboard />;
    default:
      return <Home />;
  }
}
