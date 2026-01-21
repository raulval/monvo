import { create } from 'zustand';

type ChecklistUIStore = {
  // Estado para controlar a abertura do BottomSheet em diferentes telas
  isCreateSheetOpen: boolean;
  setCreateSheetOpen: (isOpen: boolean) => void;
  
  // Exemplo: Se precisar guardar filtros ou buscas
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const useChecklistUIStore = create<ChecklistUIStore>((set) => ({
  isCreateSheetOpen: false,
  setCreateSheetOpen: (isOpen) => set({ isCreateSheetOpen: isOpen }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));