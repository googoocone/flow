import { signup } from './actions'
import { UserPlus, User, Lock, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ message: string }> }) {
    const { message } = await searchParams
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="flex flex-col items-center mb-8 relative z-10">
                    <div className="bg-slate-900 p-4 rounded-2xl shadow-lg mb-6 transform hover:scale-105 transition-transform duration-300">
                        <UserPlus className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">회원가입 요청</h1>
                    <p className="text-slate-500 mt-2 text-sm text-center">
                        관리자 승인 후 서비스를 이용하실 수 있습니다.
                    </p>
                </div>

                <form className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="name">
                            이름
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                id="name"
                                name="name"
                                type="text"
                                placeholder="홍길동"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">
                            이메일
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="password">
                            비밀번호
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium text-slate-900"
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center animate-shake">
                            <span className="mr-2">⚠️</span> {message}
                        </div>
                    )}

                    <button
                        formAction={signup}
                        className="w-full flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                        가입 요청하기
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </button>

                    <div className="text-center mt-4">
                        <Link href="/login" className="text-sm text-slate-500 hover:text-slate-800 font-medium inline-flex items-center">
                            <ArrowLeft className="w-3 h-3 mr-1" /> 이미 계정이 있으신가요?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
