export interface Exercise {
  id: number;
  title: string;
  scenario: string;
  correctAnswer: number;
  hint: string;
  explanation: string;
  type: 'fv' | 'pv' | 'series_fv';
}

export type ExerciseStatus = 'idle' | 'correct' | 'incorrect';

export interface InteractiveParams {
  amount: number;
  rate: number;
  years: number;
  mode: 'single' | 'series';
}
