'use server'

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        return redirect('/login')
    }

    const name = formData.get('name') as string
    const firm_id = formData.get('firm') as string // Get selected firm ID

    // We can fetch the firm name if we still want to save company_name as text, 
    // or just let company_name be outdated/null. 
    // For now, let's keep company_name as-is if user didn't change it, or update if we fetch it.
    // Simplifying: Just save firm_id. company_name is legacy.
    const company_name = formData.get('company_name') as string

    const job_title = formData.get('job_title') as string
    const company_phone = formData.get('company_phone') as string
    const bank_name = formData.get('bank_name') as string
    const account_number = formData.get('account_number') as string
    const logo_file = formData.get('logo_file') as File | null

    let logo_url = formData.get('logo_url') as string

    // ... (file upload logic) ...

    const updates = {
        id: user.id,
        name,
        company_name,
        firm_id,      // Update firm_id column
        // firm: null, // Optionally clear old text column
        job_title,
        company_phone,
        bank_name,
        account_number,
        logo_url,
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
        .from('profiles')
        .upsert(updates)

    if (error) {
        console.error('Supabase Update Error:', error)
        return { error: '프로필 업데이트에 실패했습니다: ' + error.message }
    }

    revalidatePath('/dashboard/profile')
    revalidatePath('/admin')
    revalidatePath('/')

    return { success: '프로필이 성공적으로 업데이트되었습니다.' }
}
