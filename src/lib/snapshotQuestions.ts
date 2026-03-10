/**
 * Scale Readiness Snapshot — question schema.
 * Edit this file to add/remove questions or change options.
 * Qualification logic in qualification.ts uses q5 and q6 values; update both if you change keys.
 */

export interface SnapshotOption {
  value: string;
  label: string;
}

export interface SnapshotQuestion {
  id: string;
  label: string;
  name: string;
  required: boolean;
  options: SnapshotOption[];
  /** Optional prompt text (e.g. for Q6) */
  prompt?: string;
}

export const SNAPSHOT_QUESTIONS: SnapshotQuestion[] = [
  {
    id: 'q1',
    name: 'companyStage',
    label: 'Company stage',
    required: true,
    options: [
      { value: 'seed', label: 'Seed' },
      { value: 'series-a', label: 'Series A' },
      { value: 'series-b-plus', label: 'Series B+' },
      { value: 'bootstrapped', label: 'Bootstrapped / profitable' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'q2',
    name: 'orgSize',
    label: 'Engineering organization size',
    required: true,
    options: [
      { value: '1-5', label: '1–5' },
      { value: '6-15', label: '6–15' },
      { value: '16-40', label: '16–40' },
      { value: '40-plus', label: '40+' },
    ],
  },
  {
    id: 'q3',
    name: 'hiringPlans',
    label: 'Hiring plans for engineering leadership (next 6 months)',
    required: true,
    options: [
      { value: 'yes-actively', label: 'Yes, actively' },
      { value: 'yes-planning', label: 'Yes, planning' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    id: 'q4',
    name: 'scalingFriction',
    label: 'Current scaling friction',
    required: true,
    options: [
      { value: 'feature-velocity', label: 'Feature velocity slowing' },
      { value: 'cross-team', label: 'Cross-team coordination issues' },
      { value: 'architecture', label: 'Architecture instability under growth' },
      { value: 'hiring-delivery', label: 'Hiring not increasing delivery speed' },
      { value: 'roadmap-market', label: 'Roadmap and market signal misalignment' },
      { value: 'unsure', label: 'Unsure' },
    ],
  },
  {
    id: 'q5',
    name: 'decisionAuthority',
    label: 'Decision authority',
    required: true,
    options: [
      { value: 'yes-primary', label: 'Yes, primary decision-maker' },
      { value: 'shared', label: 'Shared with co-founder / exec team' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    id: 'q6',
    name: 'budgetIntent',
    label: 'Budget intent',
    required: true,
    prompt:
      'If structural scaling risks were identified, would you allocate budget within the next 60 days to address them?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'possibly', label: 'Possibly' },
      { value: 'no', label: 'No' },
    ],
  },
];
