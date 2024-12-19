import { create } from "zustand";

interface SeacrchStore {
  openStates: Record<string, boolean>;
  setOpen: (chatId: string, isOpen: boolean) => void;
}

export const useSeacrch = create<SeacrchStore>((set) => ({
  openStates: {},
  setOpen: (chatId, isOpen) =>
    set((state) => ({
      openStates: { ...state.openStates, [chatId]: isOpen },
    })),
}));
