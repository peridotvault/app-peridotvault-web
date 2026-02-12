import { create } from "zustand";

export type ModalKey = "profile" | "settings" | "connect";

type UIState = {
    modalStack: ModalKey[];
    openModal: (key: ModalKey) => void;
    closeModal: () => void;
    closeAllModals: () => void;
    isModalOpen: (key: ModalKey) => boolean;
    hasOpenModal: () => boolean;
};

export const useUIStore = create<UIState>((set, get) => ({
    modalStack: [],

    openModal: (key) =>
        set((s) => {
            // optional: cegah duplikasi modal yang sama
            if (s.modalStack.includes(key)) return s;
            return { modalStack: [...s.modalStack, key] };
        }),

    closeModal: () =>
        set((s) => ({
            modalStack: s.modalStack.slice(0, -1),
        })),

    closeAllModals: () => set({ modalStack: [] }),

    isModalOpen: (key) => get().modalStack.includes(key),

    hasOpenModal: () => get().modalStack.length > 0,
}));