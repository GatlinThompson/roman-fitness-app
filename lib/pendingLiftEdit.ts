type LiftData = {
  exercise: string;
  reps: string;
  tempo: string;
  superSet: { exercise: string; reps: string; tempo: string } | null;
};

// Data passed FROM LiftInputGroup TO the edit page (avoids URL param encoding issues)
let editContext: { index: number; liftData: LiftData } | null = null;

export const setLiftEditContext = (ctx: { index: number; liftData: LiftData }) => {
  editContext = ctx;
};

export const getLiftEditContext = () => editContext;

// Data returned FROM the edit page BACK to LiftInputGroup
let pending: { index: number; liftData: LiftData } | null = null;

export const setPendingLiftEdit = (edit: { index: number; liftData: LiftData }) => {
  pending = edit;
};

export const consumePendingLiftEdit = () => {
  const result = pending;
  pending = null;
  return result;
};
