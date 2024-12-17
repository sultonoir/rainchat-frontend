import { Messages } from "@/types";
import { create } from "zustand";

interface MessageStore {
  message: Messages | undefined;
  setMessage: (message: Messages | undefined) => void;
}

const useMessage = create<MessageStore>((set) => ({
  message: undefined,
  setMessage: (message) => set({ message }),
}));

export default useMessage;
