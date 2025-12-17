'use server'

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveUser(userId: string) {
    const supabase = await createServerSupabaseClient()

    // 1. Verify caller is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: callerProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (callerProfile?.role !== 'admin') {
        return // Or throw error
    }

    // 2. Approve target user
    await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', userId)

    revalidatePath('/admin')
}
