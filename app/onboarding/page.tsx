import { submitOnboarding } from './actions'
import { Briefcase, Building, Phone, ArrowRight } from 'lucide-react'

export default function OnboardingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">추가 정보 입력</h1>
                    <p className="text-slate-500 mt-2">
                        서비스 이용을 위해 회사 및 직급 정보를 입력해주세요.
                    </p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="company_name">
                            소속 법무법인 / 회사명
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900"
                                id="company_name"
                                name="company_name"
                                type="text"
                                placeholder="예: 법무법인 플로우"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="job_title">
                            직급
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Briefcase className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900"
                                id="job_title"
                                name="job_title"
                                type="text"
                                placeholder="예: 실장"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="company_phone">
                            회사 전화번호
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900"
                                id="company_phone"
                                name="company_phone"
                                type="text"
                                placeholder="02-1234-5678"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            formAction={submitOnboarding}
                            className="w-full flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
                        >
                            입력 완료하고 시작하기
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
