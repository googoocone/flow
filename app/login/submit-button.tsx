'use client'

import { useFormStatus } from 'react-dom'
import { ArrowRight, Loader2 } from 'lucide-react'

export function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    로그인 중...
                </>
            ) : (
                <>
                    로그인하기
                    <ArrowRight className="ml-2 w-4 h-4" />
                </>
            )}
        </button>
    )
}
