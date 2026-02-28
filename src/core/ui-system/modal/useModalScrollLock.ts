"use client"

import { useEffect } from "react"
import { useModal } from "./modal.store"

function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth
}

export default function useModalScrollLock() {
    const hasModal = useModal(s => s.stack.length > 0)

    useEffect(() => {
        const body = document.body

        if (!hasModal) return

        const prevOverflow = body.style.overflow
        const prevPadding = body.style.paddingRight

        const width = getScrollbarWidth()

        body.style.overflow = "hidden"

        if (width > 0) {
            body.style.paddingRight = `${width}px`
        }

        return () => {
            body.style.overflow = prevOverflow
            body.style.paddingRight = prevPadding
        }
    }, [hasModal])
}
