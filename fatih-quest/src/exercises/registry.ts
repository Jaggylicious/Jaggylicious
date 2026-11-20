import type { ComponentType } from 'react';
import type { ExerciseId } from '../core/types';
import type { RoundProps } from './types';
import { LuisterExercise, MissieExercise, WachtExercise, ZoekExercise } from './concentratie';
import { DierenExercise, EerstLaatstExercise, RouteExercise } from './geheugen';
import { RuimteMissieExercise } from './RuimteMissieExercise';
import { WoordenExercise } from './WoordenExercise';
import { DeHetExercise, KlokGeldExercise, RekenExercise, WoordsoortExercise, ZinsdeelExercise } from './quizExercises';
import { VerhaalsomExercise } from './VerhaalsomExercise';
import { EmotieExercise } from './EmotieExercise';
import { OntdekExercise } from './OntdekExercise';

export const ROUND_COMPONENTS: Record<ExerciseId, ComponentType<RoundProps>> = {
  zoek: ZoekExercise,
  luister: LuisterExercise,
  wacht: WachtExercise,
  missie: MissieExercise,
  dieren: DierenExercise,
  ruimtemissie: RuimteMissieExercise,
  eerstlaatst: EerstLaatstExercise,
  route: RouteExercise,
  woorden: WoordenExercise,
  dehet: DeHetExercise,
  woordsoort: WoordsoortExercise,
  zinsdeel: ZinsdeelExercise,
  rekenen: RekenExercise,
  verhaalsom: VerhaalsomExercise,
  klokgeld: KlokGeldExercise,
  emotie: EmotieExercise,
  ontdek: OntdekExercise,
};
