import { create } from "zustand";

interface ImagesStore {
  images: File[];
  setImages: (values: File[]) => void;
}

const useImages = create<ImagesStore>((set) => ({
  images: [],
  setImages: (values: File[]) => set({ images: values }),
}));

export default useImages;
