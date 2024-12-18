import { create } from "zustand";

interface MemberDialogStore {
  openStates: Record<string, boolean>;
  setOpen: (memberId: string, isOpen: boolean) => void;
}

export const useMemberDialog = create<MemberDialogStore>((set) => ({
  openStates: {},
  setOpen: (memberId, isOpen) =>
    set((state) => ({
      openStates: { ...state.openStates, [memberId]: isOpen },
    })),
}));
