'use server'

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signOut() {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        return redirect('/login')
    }

    const name = formData.get('name') as string
    const company_name = formData.get('company_name') as string
    const job_title = formData.get('job_title') as string
    const company_phone = formData.get('company_phone') as string
    const bank_name = formData.get('bank_name') as string
    const account_number = formData.get('account_number') as string
    const logo_file = formData.get('logo_file') as File | null

    let logo_url = formData.get('logo_url') as string

    // Handle file upload if present
    if (logo_file && logo_file.size > 0) {
        const fileExt = logo_file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('company_logos')
            .upload(fileName, logo_file)

        if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
                .from('company_logos')
                .getPublicUrl(fileName)
            logo_url = publicUrlData.publicUrl
        }
    }

    const updates = {
        id: user.id,
        name,
        company_name,
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

    revalidatePath('/mypage')
    revalidatePath('/admin')
    revalidatePath('/')

    return { success: '프로필이 성공적으로 업데이트되었습니다.' }
}
