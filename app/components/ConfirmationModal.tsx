'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    isDanger?: boolean
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = '확인',
    cancelText = '취소',
    isDanger = false
}: ConfirmationModalProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!isOpen || !mounted) return null

    // Prevent scrolling when modal is open
    if (typeof document !== 'undefined') {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 transform transition-all scale-100 animate-scale-in border border-slate-100 mx-4">
                <h3 className={`text-xl font-bold mb-3 ${isDanger ? 'text-red-600' : 'text-slate-900'}`}>
                    {title}
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-base">
                    {message}
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors text-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                        className={`px-5 py-2.5 rounded-lg text-white font-bold transition-colors shadow-md text-sm ${isDanger
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
