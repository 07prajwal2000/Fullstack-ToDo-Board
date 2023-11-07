import { create } from "zustand";

export type GlobalStoreType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
};

const useGlobalStore = create<GlobalStoreType>((set) => ({
  loading: false,
  setLoading(loading) {
    set((state) => ({...state, loading}));
  },
}));

export default useGlobalStore;