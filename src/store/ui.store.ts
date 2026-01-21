import { create } from 'zustand';

type UIStore = {
  createChecklistOpen: boolean;
  openCreateChecklist: () => void;
  closeCreateChecklist: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  createChecklistOpen: false,
  openCreateChecklist: () => set({ createChecklistOpen: true }),
  closeCreateChecklist: () => set({ createChecklistOpen: false }),
}));
