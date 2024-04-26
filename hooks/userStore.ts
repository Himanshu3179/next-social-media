import create from "zustand";

type UserState = {
  userId: string | null;
  setUserId: (userId: string) => void;
};

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  setUserId: (userId) => set({ userId }),
}));
