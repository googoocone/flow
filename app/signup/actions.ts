'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/utils/supabase/server'
import { getURL } from '@/utils/get-url'

export async function signup(formData: FormData) {
    const supabase = await createServerSupabaseClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            },
            emailRedirectTo: `${getURL()}auth/callback`,
        },
    })

    if (authError || !authData.user) {
        return redirect('/signup?message=' + encodeURIComponent(authError?.message || 'Signup failed'))
    }

    // 2. Explicitly create profile to ensure sync
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: authData.user.id,
            name: name,
            email: email, // Assuming we want to store email in profile too for easier access
        })

    // Note: If profile already exists (trigger raced us), this might fail if we don't use upsert or ignore conflict.
    // Better to use upsert to be safe.
    if (profileError) {
        // Fallback: try upserting just in case trigger created it but empty
        await supabase
            .from('profiles')
            .upsert({
                id: authData.user.id,
                name: name,
                email: email,
                updated_at: new Date().toISOString()
            })
    }

    revalidatePath('/', 'layout')
    redirect('/pending')
}
