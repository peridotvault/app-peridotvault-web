"use client"

import { ReactNode } from "react"
import { create } from "zustand"

type ModalRender = (id: string) => ReactNode

interface ModalEntry {
    id: string
    render: ModalRender
}

interface ModalState {
    stack: ModalEntry[]

    open: (render: ModalRender) => string
    close: (id?: string) => void
    closeAll: () => void
}

export const useModal = create<ModalState>((set) => ({
    stack: [],

    open: (render) => {
        const id = crypto.randomUUID()

        set(s => ({
            stack: [...s.stack, { id, render }]
        }))

        return id
    },

    close: (id) => {
        if (!id) {
            set(s => ({ stack: s.stack.slice(0, -1) }))
            return
        }

        set(s => ({
            stack: s.stack.filter(m => m.id !== id)
        }))
    },

    closeAll: () => set({ stack: [] }),
}))
