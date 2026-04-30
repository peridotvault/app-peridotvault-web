"use client"

import { ReactNode } from "react"
import { create } from "zustand"

type ModalRender = (id: string) => ReactNode
type ModalOptions = {
    lockScroll?: boolean
}

interface ModalEntry {
    id: string
    render: ModalRender
    options?: ModalOptions
}

interface ModalState {
    stack: ModalEntry[]

    open: (render: ModalRender, options?: ModalOptions) => string
    update: (id: string, render: ModalRender, options?: ModalOptions) => void
    close: (id?: string) => void
    closeAll: () => void
}

export const useModal = create<ModalState>((set) => ({
    stack: [],

    open: (render, options) => {
        const id = crypto.randomUUID()

        set(s => ({
            stack: [...s.stack, { id, render, options }]
        }))

        return id
    },

    update: (id, render, options) => {
        set(s => ({
            stack: s.stack.map(m =>
                m.id === id
                    ? {
                        ...m,
                        render,
                        options: options ?? m.options
                    }
                    : m
            )
        }))
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
