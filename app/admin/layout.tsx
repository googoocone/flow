import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Only check authentication here, detailed role check is in the page but good to have here too
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {children}
        </div>
    )
}
