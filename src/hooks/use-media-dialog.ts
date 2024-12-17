import { create } from "zustand";

interface ShowStore {
  show: boolean;
  setShow: (value: boolean) => void;
  media: string | undefined;
  setMedia: (media: string | undefined) => void;
}

export const useMediaDialog = create<ShowStore>((set) => ({
  show: false,
  setShow: (value) => set({ show: value }),
  media: undefined,
  setMedia: (media) => set({ media }),
}));
