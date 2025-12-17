import { createServerSupabaseClient } from '@/utils/supabase/server'
import { approveUser } from './actions'
import { Check, Shield, UserX, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ManageUsersPage() {
    const supabase = await createServerSupabaseClient()

    // Check admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (currentUserProfile?.role !== 'admin') {
        return (
            <div className="p-8 text-center text-red-600">
                <Shield className="w-12 h-12 mx-auto mb-4" />
                <h1 className="text-xl font-bold">접근 권한이 없습니다</h1>
                <p className="mt-2">관리자만 접근할 수 있는 페이지입니다.</p>
                <Link href="/admin" className="mt-4 inline-block text-blue-600 hover:underline">
                    돌아가기
                </Link>
            </div>
        )
    }

    // Fetch unapproved users
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/admin" className="flex items-center text-slate-500 hover:text-slate-900 mb-2 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" /> 대시보드로 돌아가기
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">사용자 승인 관리</h1>
                        <p className="text-slate-500">새로 가입한 사용자들의 승인을 관리합니다.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {users && users.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {users.map((profile) => (
                                <div key={profile.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                            {profile.name?.[0] || '?'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{profile.name || '이름 없음'}</h3>
                                            <p className="text-sm text-slate-500">{profile.email || 'Email missing (Auth mismatch?)'}</p>
                                            <p className="text-xs text-slate-400 mt-1">가입일: {new Date(profile.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <form action={approveUser.bind(null, profile.id)}>
                                        <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                                            <Check className="w-4 h-4 mr-2" />
                                            승인하기
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-500">
                            <UserX className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p>현재 승인 대기 중인 사용자가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
