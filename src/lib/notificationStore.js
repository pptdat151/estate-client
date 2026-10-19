import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    try {
      const res = await apiRequest("/users/notification");
      // Only accept a count; anything else (e.g. an object) would break the badge
      set({ number: typeof res.data === "number" ? res.data : 0 });
    } catch (err) {
      console.log(err);
    }
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
