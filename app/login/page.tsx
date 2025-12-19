import { login } from './actions'
import { Bot, User, Lock, ArrowRight } from 'lucide-react'
import { SubmitButton } from './submit-button'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message: string }> }) {
    const { message } = await searchParams
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="flex flex-col items-center mb-8 relative z-10">
                    <div className="bg-slate-900 p-4 rounded-2xl shadow-lg mb-6 transform hover:scale-105 transition-transform duration-300">
                        <Bot className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">관리자 로그인</h1>
                    <p className="text-slate-500 mt-2 text-sm text-center">
                        법무법인 채무 조정 솔루션 어드민에 오신 것을 환영합니다.
                    </p>
                </div>

                <form className="space-y-5 relative z-10" action={login}>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">
                            이메일
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
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
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900"
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

                    <SubmitButton />

                    <p className="text-center text-xs text-slate-400 mt-6">
                        계정 문의는 시스템 관리자에게 1:1로 문의해주세요.
                    </p>
                </form>
            </div>
        </div>
    )
}
