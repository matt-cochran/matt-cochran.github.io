/**
 * Scale Readiness Snapshot — deterministic qualification logic.
 * Uses only Q5 (decision authority) and Q6 (budget intent).
 * Change thresholds or rules here; keep snapshotQuestions.ts option values in sync.
 */

export type QualificationOutcome = 'qualified' | 'manual_review' | 'disqualified';

export interface SnapshotAnswers {
  decisionAuthority?: string;
  budgetIntent?: string;
}

/**
 * Deterministic qualification rules:
 * - Disqualified: Q5 = "No" OR Q6 = "No"
 * - Qualified: Q5 = "Yes, primary decision-maker" OR (Q5 = "Shared" AND Q6 = "Yes")
 * - Manual review: Q5 = "Shared" AND Q6 = "Possibly"
 */
export function qualify(answers: SnapshotAnswers): QualificationOutcome {
  const q5 = answers.decisionAuthority ?? '';
  const q6 = answers.budgetIntent ?? '';

  // Disqualified: no decision authority or no budget intent
  if (q5 === 'no' || q6 === 'no') {
    return 'disqualified';
  }

  // Qualified: primary decision-maker (regardless of Q6 Yes/Possibly)
  if (q5 === 'yes-primary') {
    return 'qualified';
  }

  // Q5 = shared
  if (q5 === 'shared') {
    if (q6 === 'yes') return 'qualified';
    if (q6 === 'possibly') return 'manual_review';
  }

  // Fallback: missing or unexpected values → disqualified (strict)
  return 'disqualified';
}
