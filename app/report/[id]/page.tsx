import { createServerSupabaseClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, FileText, TrendingDown, Wallet, AlertTriangle, Bot, Phone } from 'lucide-react'
import CountUpNumber from '@/app/components/CountUpNumber'
import DeleteReportButton from '@/app/components/DeleteReportButton'

export default async function ReportPage({ params }: { params: { id: string } }) {
    const supabase = await createServerSupabaseClient()

    const { id } = await params

    // Fetch user for auth check
    const { data: { user } } = await supabase.auth.getUser()

    const { data: consultation, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !consultation) {
        notFound()
    }

    const { analysis_result } = consultation
    // Type assertion or safe access
    const report = analysis_result as any

    // Fetch branding profile if available
    let branding = null
    if (consultation.user_id) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', consultation.user_id)
            .single()
        branding = profile
    }

    // Determine display text for case type
    const caseTypeDisplay = consultation.case_type === 'bankruptcy' ? '개인파산' : '개인회생'

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-500 selection:text-white">
            {/* 1. Header Section */}
            <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4 text-center relative overflow-hidden animate-fade-in-up">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="flex flex-col items-center mb-6 relative">
                        {/* Edit and Delete Buttons for Owner */}
                        {consultation.user_id === user?.id && (
                            <div className="absolute top-0 right-0 flex gap-2 md:absolute md:right-[-120px]">
                                <Link
                                    href={`/dashboard/reports/${consultation.id}/edit`}
                                    className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-sm font-semibold text-white border border-white/20 transition-all"
                                >
                                    ✏️ 수정
                                </Link>
                                <DeleteReportButton id={consultation.id} />
                            </div>
                        )}

                        {/* Back Button for Authenticated Users (Admins/Counselors) */}
                        {user && (
                            <div className="absolute top-0 left-0 md:absolute md:left-[-100px]">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-sm font-semibold text-white border border-white/20 transition-all"
                                >
                                    ← 나가기
                                </Link>
                            </div>
                        )}

                        {branding?.logo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={branding.logo_url} alt="Company Logo" className="h-16 w-auto mb-4 bg-white p-2 rounded-lg shadow-lg" />
                        ) : branding?.company_name ? (
                            <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg mb-4 text-sm font-bold tracking-widest text-slate-200 border border-white/20">
                                {branding.company_name}
                            </div>
                        ) : (
                            <div className="inline-block bg-[#F59E0B] p-2 rounded-lg mb-6 shadow-lg shadow-amber-500/20 transform hover:scale-105 transition-transform duration-300">
                                <span className="font-bold text-white text-lg">法</span>
                            </div>
                        )}
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
                            {caseTypeDisplay} 상담 보고서
                        </h1>
                    </div>

                    <p className="text-slate-300 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                        <span className="font-semibold text-white">{consultation.client_name}</span>님을 위한 맞춤형 채무 조정 솔루션을 제안합니다.
                    </p>

                    <div className="inline-flex flex-col md:flex-row items-center md:space-x-8 space-y-2 md:space-y-0 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 px-8 py-3 rounded-full backdrop-blur-md">
                        <span className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                            상담일: {new Date(consultation.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '/').replace('.', '')}
                        </span>
                        <span className="hidden md:block w-px h-4 bg-white/20"></span>
                        <span className="flex items-center">
                            <span className="mr-2">👨‍💼</span>
                            담당자: {consultation.counselor_name || branding?.name || '김상담'} {branding?.job_title && <span className="text-slate-400 ml-1">({branding.job_title})</span>}
                        </span>
                        {branding?.company_phone && (
                            <>
                                <span className="hidden md:block w-px h-4 bg-white/20"></span>
                                <span className="flex items-center">
                                    <span className="mr-2">📞</span>
                                    {branding.company_phone}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-16 space-y-20">

                {/* 2. Current Situation */}
                <section className="animate-fade-in-up delay-100">
                    <div className="flex items-center mb-6">
                        <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-bold text-sm shadow-md">1</div>
                        <h2 className="text-2xl font-bold text-slate-900">{consultation.client_name}님의 현재 상황</h2>
                    </div>
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        {/* Decorative Quote Icon */}
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-slate-900">
                                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                            </svg>
                        </div>

                        <div className="relative z-10">
                            {/* Main Story */}
                            <div className="mb-8">
                                <div className="inline-flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-full mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client's Story</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug tracking-tight mb-8">
                                    "{report.current_situation.suffering}"
                                </h3>
                                <p className="text-md text-slate-600 leading-relaxed font-medium">
                                    {report.current_situation.difficulties}
                                </p>
                            </div>

                            {/* Divider with 'Why' */}
                            <div className="flex items-center space-x-4 mb-6">
                                <span className="h-px bg-slate-200 flex-1"></span>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Analysis</span>
                                <span className="h-px bg-slate-200 flex-1"></span>
                            </div>

                            {/* Cause Section (Bottom) */}
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <div className="flex items-center mb-3">
                                    <div className="bg-white p-1.5 rounded-lg shadow-sm mr-2.5 text-slate-400 border border-slate-100">
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">핵심 채무 원인</p>
                                </div>
                                <p className="font-bold text-slate-900 text-lg leading-relaxed pl-1">
                                    {report.current_situation.cause}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Risk Factors */}
                <section className="animate-fade-in-up delay-200">
                    <div className="flex items-center mb-6">
                        <div className="bg-[#DC2626] text-white w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-bold text-sm shadow-md">2</div>
                        <h2 className="text-2xl font-bold text-[#DC2626]">주요 점검 사항 및 리스크 Check</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {report.risk_factors && report.risk_factors.length > 0 ? (
                            report.risk_factors.map((item: any, idx: number) => (
                                <div key={idx} className="bg-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 transform hover:-translate-x-1">
                                    <div className="flex flex-col">
                                        <div className="flex items-center mb-2">
                                            <div className="bg-red-100 p-1.5 rounded-full mr-3 flex-shrink-0">
                                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                            </div>
                                            <h3 className="font-bold text-red-900 text-lg">{item.risk}</h3>
                                        </div>
                                        <p className="text-slate-700 leading-relaxed font-medium bg-red-50/50 p-3 rounded-lg border border-red-100/50 ml-1">
                                            💡 {item.solution}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl text-green-800 shadow-sm">
                                특별히 발견된 위험 요소가 없습니다. (긍정적)
                            </div>
                        )}
                    </div>
                </section>

                {/* 4. Financial Analysis */}
                <section className="animate-fade-in-up delay-300">
                    <div className="flex items-center mb-6">
                        <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-bold text-sm shadow-md">3</div>
                        <h2 className="text-2xl font-bold text-slate-900">재무 현황 분석</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Total Debt */}
                        <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center h-40 group">
                            <div className="mb-2 bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-100 transition-colors">
                                <Wallet className="w-5 h-5 text-orange-500" />
                            </div>
                            <p className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wide">총 채무액</p>
                            <div className="text-xl md:text-2xl font-extrabold text-slate-900 break-keep leading-tight">
                                <CountUpNumber value={report.financial_status.total_debt || report.financial_status.debt_total || report.financial_status.debt_items || '확인 필요'} />
                            </div>
                        </div>
                        {/* Income */}
                        <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center h-40 group">
                            <div className="mb-2 bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto group-hover:bg-slate-100 transition-colors">
                                <FileText className="w-5 h-5 text-slate-500" />
                            </div>
                            <p className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wide">월 소득</p>
                            <div className="text-xl md:text-2xl font-extrabold text-slate-900 break-keep leading-tight">
                                <CountUpNumber value={report.financial_status.income || '확인 필요'} />
                            </div>
                        </div>
                        {/* Cancellation Rate */}
                        <div className="bg-white rounded-2xl p-6 text-center border border-green-100/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center h-40 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <TrendingDown className="w-16 h-16 text-green-500" />
                            </div>
                            <div className="mb-2 bg-green-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-100 transition-colors relative z-10">
                                <TrendingDown className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-xs text-green-600 font-bold mb-2 uppercase tracking-wide relative z-10">예상 탕감률</p>
                            <div className="text-3xl md:text-4xl font-black text-green-600 tracking-tight relative z-10 flex items-center justify-center">
                                <span className="text-sm font-bold text-green-500 mr-1 mt-2">최대</span>
                                <CountUpNumber value={report.expected_outcome?.cancellation_rate || '?%'} />
                            </div>
                        </div>
                        {/* Monthly Payment */}
                        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 text-center border border-green-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center h-40 group ring-4 ring-green-50/50">
                            <p className="text-xs text-green-700 font-bold mb-2 uppercase tracking-wide">예상 월 변제금</p>
                            <div className="text-3xl md:text-4xl font-black text-green-700 tracking-tight">
                                <CountUpNumber value={report.expected_outcome?.monthly_payment || '?만원'} />
                            </div>
                            <p className="text-[10px] text-green-600/70 mt-1 font-medium">* 변동 가능성 있음</p>
                        </div>
                    </div>

                    {/* Detailed Explanation */}
                    {report.expected_outcome?.detail_explanation && (
                        <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-sm text-slate-600 leading-relaxed shadow-inner">
                            <p className="font-bold text-slate-800 mb-2 flex items-center">
                                <span className="mr-2 text-lg">💡</span> 변제금 산정 상세 코멘트
                            </p>
                            <p>{report.expected_outcome.detail_explanation}</p>
                        </div>
                    )}
                </section>

                {/* 5. VS Comparison (Modern) */}
                <section className="animate-fade-in-up delay-400">
                    <div className="flex items-center mb-8">
                        <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-bold text-sm shadow-md">4</div>
                        <h2 className="text-2xl font-bold text-slate-900">미래 시나리오 비교</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                        {/* VS Badge */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex w-12 h-12 bg-slate-900 text-white font-black text-lg rounded-full items-center justify-center border-4 border-white shadow-xl">
                            VS
                        </div>

                        {/* Current State - Bad */}
                        <div className="bg-white rounded-3xl p-8 border border-red-100 shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-red-400"></div>
                            <h3 className="text-xl font-bold text-red-600 mb-6 text-center">현재 상태 유지 시 😰</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-red-50 pb-4">
                                    <span className="text-slate-500 font-medium">월 상환액</span>
                                    <span className="text-red-600 font-bold">감당 불가 (원리금)</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-red-50 pb-4">
                                    <span className="text-slate-500 font-medium">이자 발생</span>
                                    <span className="text-red-600 font-bold">지속적 증가 📈</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-red-50 pb-4">
                                    <span className="text-slate-500 font-medium">추심 압박</span>
                                    <span className="text-red-600 font-bold">지속 (압류 위험)</span>
                                </div>
                                <div className="bg-red-50 rounded-xl p-4 text-center mt-4">
                                    <p className="text-sm text-red-800 font-bold">3년 후 파산 위기 직면</p>
                                </div>
                            </div>
                        </div>

                        {/* Future State - Good */}
                        <div className="bg-white rounded-3xl p-8 border border-green-200 shadow-xl relative overflow-hidden transform md:scale-105 md:-translate-y-2 z-0">
                            <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                            <h3 className="text-xl font-bold text-green-600 mb-6 text-center flex items-center justify-center">
                                {caseTypeDisplay} 진행 시 🎉
                            </h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-green-50 pb-4">
                                    <span className="text-slate-600 font-medium">월 상환액</span>
                                    <span className="text-green-700 font-extrabold text-lg">{report.expected_outcome?.monthly_payment}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-green-50 pb-4">
                                    <span className="text-slate-600 font-medium">이자 발생</span>
                                    <span className="text-green-600 font-bold">100% 전액 탕감</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-green-50 pb-4">
                                    <span className="text-slate-600 font-medium">추심 압박</span>
                                    <span className="text-green-600 font-bold">즉시 금지 (법적 보호)</span>
                                </div>
                                <div className="bg-green-100 rounded-xl p-4 text-center mt-4 shadow-sm">
                                    <p className="text-sm text-green-800 font-bold">3년 후 채무 '0원' 빚 청산 완료</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Timeline Solutions */}
                <section className="animate-fade-in-up delay-500">
                    <div className="flex items-center mb-8">
                        <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-bold text-sm shadow-md">5</div>
                        <h2 className="text-2xl font-bold text-slate-900">맞춤형 솔루션 및 전략</h2>
                    </div>
                    <div className="pl-6 md:pl-8 border-l-2 border-slate-200 space-y-12">
                        {report.recommended_steps && report.recommended_steps.length > 0 ? (
                            report.recommended_steps.map((step: any, idx: number) => {
                                const colors = ['bg-[#F59E0B]', 'bg-slate-800', 'bg-green-500']
                                const color = colors[idx % colors.length]
                                return (
                                    <div key={idx} className="relative group">
                                        <div className={`absolute -left-[37px] md:-left-[45px] top-0 w-8 h-8 rounded-full ${color} border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-xs ring-1 ring-slate-100`}>
                                            {idx + 1}
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                                            <h3 className="font-bold text-slate-900 text-lg mb-2">{step.step}</h3>
                                            <p className="text-slate-600 leading-relaxed font-medium">{step.description}</p>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            // Fallback content...
                            <>
                                <div className="relative group">
                                    <div className="absolute -left-[37px] md:-left-[45px] top-0 w-8 h-8 rounded-full bg-[#F59E0B] border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-xs ring-1 ring-slate-100">1</div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                                        <h3 className="font-bold text-slate-900 text-lg mb-2">1단계: 신청 및 접수</h3>
                                        <p className="text-slate-600 leading-relaxed font-medium">법원에 신청서를 제출하고 금지명령을 통해 독촉을 방어합니다.</p>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -left-[37px] md:-left-[45px] top-0 w-8 h-8 rounded-full bg-slate-800 border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-xs ring-1 ring-slate-100">2</div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                                        <h3 className="font-bold text-slate-900 text-lg mb-2">2단계: 개시 결정</h3>
                                        <p className="text-slate-600 leading-relaxed font-medium">법원의 심사를 거쳐 회생 절차가 공식적으로 시작됩니다.</p>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -left-[37px] md:-left-[45px] top-0 w-8 h-8 rounded-full bg-green-500 border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-xs ring-1 ring-slate-100">3</div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                                        <h3 className="font-bold text-slate-900 text-lg mb-2">3단계: 인가 및 면책</h3>
                                        <p className="text-slate-600 leading-relaxed font-medium">변제 계획안대로 성실히 상환하면 나머지 채무를 모두 탕감받습니다.</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    {/* Expert Comment */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl mt-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Bot className="w-24 h-24" />
                        </div>
                        <p className="font-bold mb-3 text-amber-400 text-lg">💡 전문가 상세 코멘트</p>
                        <p className="leading-relaxed text-slate-300 relative z-10">{report.recommendation}</p>
                    </div>
                </section>

                {/* 7. Benefits Grid (Modern) */}
                <section className="animate-fade-in-up delay-500">
                    <div className="flex items-center mb-8">
                        <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-bold text-sm shadow-md shrink-0">6</div>
                        <h2 className="text-2xl font-bold text-slate-900">{caseTypeDisplay} 진행 시 {consultation.client_name}님이 얻게 되는 구체적 실익</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {(report.expected_benefits && report.expected_benefits.length > 0 ? report.expected_benefits : [
                            { title: '즉시 추심 중단', desc: '금지명령 결정 시 채권자의 연락 및 방문 추심 즉시 금지' },
                            { title: '이자 전액 면제', desc: '개시 결정 이후 발생하는 이자 및 기존 연체 이자 100% 탕감' },
                            { title: '원금 최대 90% 탕감', desc: '소득 및 재산 상황에 따라 원금의 최대 90%까지 법원 직권 감면' },
                            { title: '자격 유지 가능', desc: '교사, 의사, 임원 등 전문직 자격이 유지되며 정상적인 경제활동 가능' }
                        ]).map((benefit: any, idx: number) => (
                            <div key={idx} className="bg-white border text-left p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-green-500/50 transition-all duration-300 group">
                                <div className="flex items-start">
                                    <div className="bg-green-50 p-3 rounded-xl mr-5 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                                        <CheckCircle2 className="w-6 h-6 text-green-600 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-green-700 transition-colors">{benefit.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{benefit.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* 8. Success Cases (New Section) */}
            <section className="bg-slate-50 py-20 border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4 uppercase tracking-wide">
                            Success Stories
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                            {consultation.client_name}님과 유사한 상황의<br className="hidden md:block" />
                            <span className="text-blue-600">실제 성공 사례</span>입니다.
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            이미 많은 분들이 같은 고민을 해결하고 새로운 삶을 시작했습니다.
                        </p>
                    </div>

                    {/* Fetch Success Cases */}
                    {await (async () => {
                        let query = supabase.from('success_cases').select('*')

                        // 1. Get Counselor's Firm ID
                        const { data: counselorProfile } = await supabase
                            .from('profiles')
                            .select('firm_id')
                            .eq('id', consultation.user_id)
                            .single()

                        if (!counselorProfile?.firm_id) {
                            return (
                                <div className="text-center text-slate-400 py-12">
                                    <p>등록된 소속(법무법인)이 없어 성공사례를 불러올 수 없습니다.</p>
                                </div>
                            )
                        }

                        // Filter by firm
                        query = query.eq('firm_id', counselorProfile.firm_id)

                        // Fetch all candidates for the firm to perform advanced ranking in JS
                        let { data: candidates } = await query

                        if (!candidates || candidates.length === 0) {
                            // Fallback: If no match, fetch latest 3 globally (or just return empty)
                            const { data: fallbackCases } = await supabase
                                .from('success_cases')
                                .select('*')
                                .limit(3)
                            candidates = fallbackCases
                        }

                        if (!candidates || candidates.length === 0) return null

                        // 2. Client Profile for Matching
                        const result = consultation.analysis_result as any
                        const profile = result.client_profile || {}
                        const clientAge = profile.age // e.g., "30대"
                        const clientJob = profile.job // e.g., "급여소득"
                        const clientCauses = profile.cause || [] // e.g., ["코인,주식", "생활비"]

                        // Legacy fallback: use tags if profile mapping missing
                        const legacyTags = (consultation.tags && consultation.tags.length > 0)
                            ? consultation.tags
                            : (result.debt_causes as string[]) || []

                        // 3. Scoring Algorithm
                        const scoredCases = candidates.map((c: any) => {
                            let score = 0
                            const meta = c.metadata || {}

                            // (1) Age Match (High Priority)
                            if (clientAge && meta.age === clientAge) score += 30

                            // (2) Cause Match (Critical Priority)
                            // meta.cause is expected to be an array, e.g. ["코인,주식"]
                            if (clientCauses.length > 0 && meta.cause) {
                                const metaCauses = Array.isArray(meta.cause) ? meta.cause : [meta.cause]
                                const hasOverlap = clientCauses.some((cause: string) => metaCauses.includes(cause))
                                if (hasOverlap) score += 40
                            }

                            // (3) Job Match (Medium Priority)
                            if (clientJob && meta.job === clientJob) score += 20

                            // (4) Legacy Tag Overlap (Fallback)
                            if (legacyTags.length > 0 && c.tags) {
                                const tagOverlap = c.tags.filter((t: string) => legacyTags.includes(t)).length
                                score += tagOverlap * 5
                            }

                            return { ...c, score }
                        })

                        // Sort by score desc, then random/id
                        scoredCases.sort((a, b) => b.score - a.score)

                        // Take top 3
                        const successCases = scoredCases.slice(0, 3)

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {successCases.map((story: any) => {
                                    const linkUrl = story.url || '#'
                                    const isClickable = !!story.url && story.url !== '#'

                                    const CardContent = (
                                        <div className={`bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group ${isClickable ? 'cursor-pointer' : ''}`}>
                                            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                                            <div className="p-8 flex-1 flex flex-col">
                                                {/* Meta Badges */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {/* Age Badge */}
                                                    {story.metadata?.age && (
                                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold border border-blue-100">
                                                            {story.metadata.age}
                                                        </span>
                                                    )}
                                                    {/* Job Badge */}
                                                    {story.metadata?.job && (
                                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                                                            {story.metadata.job}
                                                        </span>
                                                    )}
                                                    {/* First Cause Badge */}
                                                    {story.metadata?.cause && story.metadata.cause[0] && (
                                                        <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold border border-red-100">
                                                            {story.metadata.cause[0]}
                                                        </span>
                                                    )}

                                                    {/* Fallback to Tags if no metadata */}
                                                    {(!story.metadata?.age && !story.metadata?.job) && story.tags?.slice(0, 2).map((tag: string, i: number) => (
                                                        <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                                                            #{tag.replace(/_/g, ' ')}
                                                        </span>
                                                    ))}
                                                </div>

                                                <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                                    {story.title}
                                                </h3>
                                                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                                    {story.contents}
                                                </p>

                                                {/* Metadata Stats */}
                                                {story.metadata && (
                                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-slate-500">탕감률</span>
                                                            <span className="font-bold text-blue-600 text-lg">
                                                                {story.metadata.exemption_rate || story.metadata.cancellation_rate || '?'}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )

                                    return isClickable ? (
                                        <a href={linkUrl} key={story.id} target="_blank" rel="noopener noreferrer" className="block h-full">
                                            {CardContent}
                                        </a>
                                    ) : (
                                        <div key={story.id} className="block h-full">
                                            {CardContent}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })()}
                </div>
            </section>

            {/* 9. Recommended Videos (New Section) */}
            <section className="bg-white py-20 border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold mb-4 uppercase tracking-wide">
                            Must-Watch
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                            {consultation.client_name}님을 위한 <span className="text-red-600">추천 영상</span>
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            비슷한 상황의 해결 방법과 절차를 영상으로 쉽게 확인해보세요.
                        </p>
                    </div>

                    {/* Fetch & Render YouTube Videos */}
                    {await (async () => {
                        // 1. Get Firm ID for videos
                        const { data: counselorProfile } = await supabase
                            .from('profiles')
                            .select('firm_id')
                            .eq('id', consultation.user_id)
                            .single()

                        if (!counselorProfile?.firm_id) return null

                        // 2. Fetch all videos for this firm
                        const { data: allVideos } = await supabase
                            .from('youtube_videos')
                            .select('*')
                            .eq('firm_id', counselorProfile.firm_id)

                        if (!allVideos || allVideos.length === 0) return null

                        // 3. Client Profile & Scoring
                        const result = consultation.analysis_result as any
                        const profile = result.client_profile || {}
                        const clientCauses = profile.cause || [] // [ "주식", "코인" ] etc
                        // const risks = result.risk_factors...? (optional expansion)

                        // Score videos
                        const scoredVideos = allVideos.map((video: any) => {
                            let score = 0
                            const tags = video.tags || []

                            // (A) Cause/Keyword Match (High)
                            if (clientCauses.length > 0) {
                                const hasCauseMatch = clientCauses.some((cause: string) =>
                                    tags.some((tag: string) => cause.includes(tag) || tag.includes(cause))
                                )
                                if (hasCauseMatch) score += 50
                            }

                            // (B) Important General Keywords (Medium)
                            const generalKeywords = ['절차', '자격', '비용', '탕감']
                            if (tags.some((t: string) => generalKeywords.some(k => t.includes(k)))) {
                                score += 20
                            }

                            // (C) Recency (Small boost for new videos)
                            // Simple logic: if within last 30 days
                            const daysOld = (new Date().getTime() - new Date(video.published_at).getTime()) / (1000 * 3600 * 24)
                            if (daysOld < 30) score += 10

                            return { ...video, score }
                        })

                        // Sort desc
                        scoredVideos.sort((a, b) => b.score - a.score)

                        // Take 3
                        const recommendedVideos = scoredVideos.slice(0, 3)

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {recommendedVideos.map((video: any) => (
                                    <a
                                        key={video.id}
                                        href={video.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        {/* Thumbnail Container */}
                                        <div className="relative aspect-video overflow-hidden bg-slate-100">
                                            {video.thumbnail_url ? (
                                                <>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={video.thumbnail_url}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <span>No Thumbnail</span>
                                                </div>
                                            )}
                                            {/* Play Button Overlay */}
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {/* Duration/Label (Optional) */}
                                            {/* <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                                                영상
                                            </div> */}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {video.tags?.slice(0, 3).map((tag: string, i: number) => (
                                                    <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 md:text-lg group-hover:text-red-600 transition-colors">
                                                {video.title}
                                            </h3>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )
                    })()}
                </div>
            </section>


            {/* Footer CTA */}
            <footer className="bg-slate-900 py-24 px-4 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10 space-y-16">
                    {/* 1. Main Call CTA */}
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                            아직 고민하고 계신가요?
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto">
                            혼자 고민하면 빚은 더 늘어날 뿐입니다.<br className="hidden md:block" />
                            지금 바로 전문가와 상의하여 <span className="text-white font-bold">이자 100% 면제</span>와 <span className="text-white font-bold">추심 중단</span>의 기회를 잡으세요.
                        </p>

                        <div className="inline-block relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <a
                                href={`tel:${branding?.company_phone || '02-1234-5678'}`}
                                className="relative flex items-center bg-slate-900 border border-slate-700 hover:border-amber-500/50 rounded-2xl px-10 py-6 transition-all duration-300 transform group-hover:-translate-y-1"
                            >
                                <div className="mr-6 bg-gradient-to-br from-amber-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                                    <Phone className="w-8 h-8 text-white fill-current" />
                                </div>
                                <div className="text-left">
                                    <p className="text-amber-500 font-bold text-sm tracking-widest mb-1 uppercase">무료 상담 문의</p>
                                    <p className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                        {branding?.company_phone || '02-1234-5678'}
                                    </p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* 2. Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

                    {/* 3. Bank Account Info (Secondary) */}
                    {(branding?.bank_name && branding?.account_number) && (
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-3xl mx-auto">
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
                                    <div className="bg-slate-700 p-2 rounded-lg">
                                        <Wallet className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">수임료 입금 계좌 안내</h3>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    반드시 <span className="text-white font-bold underline decoration-slate-500 decoration-1 underline-offset-4">의뢰인 성함</span>으로 입금해주시기 바랍니다.
                                </p>
                            </div>

                            <div className="flex flex-col items-center md:items-end bg-slate-900/80 p-6 rounded-2xl border border-slate-700 w-full md:w-auto min-w-[300px]">
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{branding.bank_name}</span>
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-2xl font-mono font-bold text-white tracking-wider">{branding.account_number}</span>
                                    {/* Copy Button (Optional, purely visual for now) */}
                                    {/* <button className="text-slate-500 hover:text-white transition"><Copy className="w-4 h-4" /></button> */}
                                </div>
                                <span className="text-sm text-slate-400">
                                    예금주: <span className="text-slate-200 font-bold">{branding.company_name || '법무법인'}</span>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Footer Warning / Legal */}
                    <div className="text-center text-slate-600 text-xs leading-relaxed max-w-2xl mx-auto pt-8">
                        <p>본 리포트는 제공된 정보를 바탕으로 AI가 분석한 예상 결과이며, 법적 효력은 없습니다.</p>
                        <p>구체적인 진행 가능 여부는 반드시 변호사/법무사와 상세 상담을 통해 확인하시기 바랍니다.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
