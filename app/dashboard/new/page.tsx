import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminForm from '../AdminForm' // Import from parent dashboard directory

export default async function NewAnalysisPage() {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return <AdminForm profile={profile} />
}
