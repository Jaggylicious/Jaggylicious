import type { RoundResult } from '../core/types';

export interface RoundProps {
  level: number;
  support: boolean;
  recentIds: string[];
  unlocked: string[];
  allowDistraction: boolean;
  sessionId: string;
  onDone: (r: RoundResult) => void;
  /** Optionele parameter, bijv. gekozen ontdekonderwerp. */
  param?: string;
}
