import { create } from "zustand";

interface ShowStore {
  show: boolean;
  setShow: () => void;
}

const useShow = create<ShowStore>((set) => ({
  show: false,
  setShow: () => set((state) => ({ show: !state.show })),
}));

export default useShow;
