'use server'

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveUser(userId: string) {
    const supabase = await createServerSupabaseClient()

    // Check if current user is admin
    // For MVP, if we don't have a robust role system, we might just allow it if they can access this page (protected by layout?)
    // But better to be safe.
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Verify admin role
    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (currentUserProfile?.role !== 'admin') {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', userId)

    if (error) throw error

    revalidatePath('/manage')
}
