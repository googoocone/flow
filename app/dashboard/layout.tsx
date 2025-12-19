import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createServerSupabaseClient()

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // 2. Fetch Profile Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // 3. Check Approval
    // Note: If profile is missing entirely, it's a critical error or manual entry needed. 
    // They should be caught by onboarding or signup flow.
    if (profile) {
        if (!profile.is_approved) {
            redirect('/pending')
        }

    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar
                isAdmin={profile?.role === 'admin'}
                userName={profile?.name}
                userEmail={user.email}
            />
            <main className="pl-64 min-h-screen">
                {children}
            </main>
        </div>
    )
}
