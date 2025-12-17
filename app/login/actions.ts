'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createServerSupabaseClient()

    // Type-casting here for convenience
    // In a production app, you might want to validate this properly (e.g. Zod)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/login?message=Could not authenticate user')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signOut() {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
