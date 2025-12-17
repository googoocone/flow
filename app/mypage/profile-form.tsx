'use client'

import { useState, useActionState } from 'react'
import { User, Building2, Briefcase, Phone, ImageIcon, Save, Loader2, CreditCard } from 'lucide-react'
import { updateProfile } from './actions'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    저장 중...
                </>
            ) : (
                <>
                    <Save className="w-5 h-5 mr-2" />
                    저장하기
                </>
            )}
        </button>
    )
}

export default function ProfileForm({ profile }: { profile: any }) {
    const [state, formAction] = useActionState(updateProfile, null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.logo_url || null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setPreviewUrl(objectUrl)
        }
    }

    return (
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="logo_url" value={profile?.logo_url || ''} />

            {/* Logo Preview Section (Moved to top for visibility) */}
            <div className="relative -mt-24 mb-8 ml-8">
                <div className="w-32 h-32 bg-white rounded-2xl p-2 shadow-lg inline-block relative group">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Company Logo"
                            className="w-full h-full object-contain rounded-xl bg-slate-50"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                            <Building2 className="w-12 h-12" />
                        </div>
                    )}
                    <label
                        htmlFor="logo_file"
                        className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium text-sm"
                    >
                        변경하기
                    </label>
                    <input
                        type="file"
                        id="logo_file"
                        name="logo_file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
                <p className="mt-2 text-sm text-slate-500 font-medium">회사 로고를 클릭하여 변경하세요</p>
            </div>

            <div className="px-8 pb-8">
                {/* Personal Info Section */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        개인 정보
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="name">
                                이름
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                defaultValue={profile?.name || ''}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="job_title">
                                직급
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="job_title"
                                    id="job_title"
                                    defaultValue={profile?.job_title || ''}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 my-8"></div>

                {/* Company Info Section */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                        회사 정보
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="company_name">
                                회사명
                            </label>
                            <input
                                type="text"
                                name="company_name"
                                id="company_name"
                                defaultValue={profile?.company_name || ''}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="company_phone">
                                대표 전화번호
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="company_phone"
                                    id="company_phone"
                                    defaultValue={profile?.company_phone || ''}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            계좌 정보
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <input
                                    type="text"
                                    name="bank_name"
                                    id="bank_name"
                                    defaultValue={profile?.bank_name || ''}
                                    placeholder="은행명 (예: 국민)"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div className="md:col-span-2 relative">
                                <CreditCard className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="account_number"
                                    id="account_number"
                                    defaultValue={profile?.account_number || ''}
                                    placeholder="계좌번호 (예: 123-456-7890)"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex flex-col items-end gap-4">
                    {state?.error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium w-full text-center">
                            ⚠️ {state.error}
                            <br />
                            <span className="text-xs opacity-75">문제 해결을 위해 SQL 마이그레이션을 다시 실행해보세요.</span>
                        </div>
                    )}
                    {state?.success && (
                        <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-medium w-full text-center">
                            ✅ {state.success}
                        </div>
                    )}
                    <SubmitButton />
                </div>
            </div>
        </form>
    )
}
