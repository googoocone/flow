'use client'

import { useActionState } from 'react' // Next.js 15
import { updateProfile } from './actions'
import { Loader2, Save, Building2, User, Phone, Wallet, CreditCard, Camera } from 'lucide-react'

export default function ProfileForm({ profile }: { profile: any }) {
    const [state, formAction, isPending] = useActionState(updateProfile, null)

    return (
        <form action={formAction} className="p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Logo Section */}
                <div className="flex-shrink-0 flex flex-col items-center space-y-4">
                    <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-lg bg-slate-50 flex items-center justify-center">
                        {profile?.logo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={profile.logo_url} alt="Company Logo" className="w-full h-full object-cover" />
                        ) : (
                            <Building2 className="w-12 h-12 text-slate-300" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <input
                            type="file"
                            name="logo_file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">회사 로고 변경</p>
                    <input type="hidden" name="logo_url" value={profile?.logo_url || ''} />
                </div>

                {/* Main Info */}
                <div className="flex-grow space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                                <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                                회사명
                            </label>
                            <input
                                name="company_name"
                                defaultValue={profile?.company_name || ''}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white"
                                placeholder="예: 법무법인 플로우"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-slate-400" />
                                대표 전화번호
                            </label>
                            <input
                                name="company_phone"
                                defaultValue={profile?.company_phone || ''}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white"
                                placeholder="예: 02-1234-5678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                                <User className="w-4 h-4 mr-2 text-slate-400" />
                                담당자 성함
                            </label>
                            <input
                                name="name"
                                defaultValue={profile?.name || ''}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white"
                                placeholder="예: 홍길동"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                                <CreditCard className="w-4 h-4 mr-2 text-slate-400" />
                                직함
                            </label>
                            <input
                                name="job_title"
                                defaultValue={profile?.job_title || ''}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white"
                                placeholder="예: 실장"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-8 mt-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">입금 계좌 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                            <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                            은행명
                        </label>
                        <input
                            name="bank_name"
                            defaultValue={profile?.bank_name || ''}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white"
                            placeholder="예: 신한은행"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                            <Wallet className="w-4 h-4 mr-2 text-slate-400" />
                            계좌번호
                        </label>
                        <input
                            name="account_number"
                            defaultValue={profile?.account_number || ''}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white"
                            placeholder="예: 110-123-456789"
                        />
                    </div>
                </div>
            </div>

            {state?.error && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium animate-pulse border border-red-100">
                    ⚠️ {state.error}
                </div>
            )}
            {state?.success && (
                <div className="mt-6 p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium animate-pulse border border-green-100">
                    ✅ {state.success}
                </div>
            )}

            <div className="mt-8 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                    저장하기
                </button>
            </div>
        </form>
    )
}
