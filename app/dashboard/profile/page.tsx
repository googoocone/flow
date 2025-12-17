import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './form'

export default async function DashboardProfilePage() {
    const supabase = await createServerSupabaseClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">내 프로필</h1>
                    <p className="mt-2 text-slate-600">내 정보와 회사 정보를 관리하세요.</p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                    <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900"></div>

                    <ProfileForm profile={profile} />
                </div>
            </div>
        </div>
    )
}
