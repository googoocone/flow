'use server'

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteConsultation(id: string) {
    const supabase = await createServerSupabaseClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    // Delete the consultation
    // Ensure the user owns it via RLS, but we can also add an explicit check if needed.
    // Assuming RLS policy "Users can delete own consultations" is set up or we rely on the filter.
    const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Explicitly ensure ownership

    if (error) {
        console.error('Delete Error:', error)
        throw new Error('Failed to delete consultation')
    }

    revalidatePath('/dashboard/reports')
    redirect('/dashboard/reports')
}
