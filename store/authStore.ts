import { create, createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    email: string;
}

interface AuthStore {
    user: User | null;
    token: string;
    setUser: (user: User | null) => void;
    setToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: "",

            setUser: (user: User | null) => set({ user }),
            setToken: (token: string) => set({ token }),
        }),
        {
            name: "auth",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
