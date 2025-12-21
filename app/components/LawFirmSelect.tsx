'use client'

import React, { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/utils/supabase/client'

interface LawFirmSelectProps {
    name?: string
    defaultValue?: string
    disabled?: boolean
    className?: string
}

export default function LawFirmSelect({ name, defaultValue, disabled, className }: LawFirmSelectProps) {
    const supabase = createSupabaseClient()
    const [firms, setFirms] = useState<{ id: string, name: string }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFirms = async () => {
            const { data, error } = await supabase
                .from('law_firms')
                .select('*')
                .order('name')

            if (data) {
                setFirms(data)
            }
            setLoading(false)
        }

        fetchFirms()
    }, [supabase])

    if (loading) {
        return <div className={`h-12 bg-slate-100 rounded-lg animate-pulse ${className}`} />
    }

    return (
        <select
            name={name}
            defaultValue={defaultValue || ''}
            disabled={disabled}
            className={`w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white ${className}`}
        >
            <option value="">소속을 선택해주세요</option>
            {firms.map((firm) => (
                <option key={firm.id} value={firm.id}>
                    {firm.name}
                </option>
            ))}
        </select>
    )
}
