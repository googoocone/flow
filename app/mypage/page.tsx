import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile } from './actions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ProfileForm from './profile-form'

export default async function MyPage() {
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
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link href="/dashboard" className="text-slate-500 hover:text-slate-800 flex items-center text-sm font-medium mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            대시보드로 돌아가기
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">마이 페이지</h1>
                        <p className="mt-2 text-slate-600">내 정보와 회사 정보를 관리하세요.</p>
                    </div>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                    <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900"></div>

                    <ProfileForm profile={profile} />
                </div>
            </div>
        </div>
    )
}
