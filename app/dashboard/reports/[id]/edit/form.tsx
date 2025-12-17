'use client'

import { useActionState } from 'react' // Next.js 15 / React 19
import { updateReport } from '../../actions'
import { Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EditReportForm({ report, reportId }: { report: any, reportId: string }) {
    const router = useRouter()
    
    // Wrapper to pass reportId
    const updateReportWithId = updateReport.bind(null, reportId)
    
    const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        const result = await updateReportWithId(prev, formData)
        if (result?.success) {
            router.push(`/report/${reportId}`)
            router.refresh()
            return { success: true }
        }
        return result
    }, null)

    const analysis = report.analysis_result || {}

    return (
        <form action={formAction} className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
            <div className="p-8 space-y-8">
                {/* 1. Client Info */}
                <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">기본 정보 수정</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">고객명</label>
                            <input
                                name="clientName"
                                defaultValue={report.client_name}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">연락처</label>
                            <input
                                name="clientPhone"
                                defaultValue={report.client_phone}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                    </div>
                </section>

                {/* 2. Analysis Content */}
                <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">상담 내용 분석 (Story)</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">현재 겪고 있는 고통 (Title)</label>
                            <input
                                name="current_situation.suffering"
                                defaultValue={analysis.current_situation?.suffering}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">상세 어려움 (Description)</label>
                            <textarea
                                name="current_situation.difficulties"
                                defaultValue={analysis.current_situation?.difficulties}
                                rows={4}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">핵심 채무 원인 (Cause)</label>
                            <input
                                name="current_situation.cause"
                                defaultValue={analysis.current_situation?.cause}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                    </div>
                </section>

                {/* 3. Financials */}
                <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">재무 현황</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">월 소득</label>
                            <input
                                name="financial_status.income"
                                defaultValue={analysis.financial_status?.income}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">총 채무액</label>
                            <input
                                name="financial_status.total_debt"
                                defaultValue={analysis.financial_status?.total_debt || analysis.financial_status?.debt_total}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">예상 월 변제금</label>
                            <input
                                name="expected_outcome.monthly_payment"
                                defaultValue={analysis.expected_outcome?.monthly_payment}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-blue-600"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">예상 탕감률</label>
                            <input
                                name="expected_outcome.cancellation_rate"
                                defaultValue={analysis.expected_outcome?.cancellation_rate}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-green-600"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">변제금 산정 코멘트</label>
                            <textarea
                                name="expected_outcome.detail_explanation"
                                defaultValue={analysis.expected_outcome?.detail_explanation}
                                rows={2}
                                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* 4. Risk Factors (Arrray) */}
                <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">리스크 요인 (Risk Factors)</h3>
                    <div className="space-y-4">
                        {(analysis.risk_factors || []).map((item: any, idx: number) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
                                <span className="absolute top-2 right-2 text-xs font-bold text-slate-400">#{idx + 1}</span>
                                <div className="mb-3">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">위험 요소</label>
                                    <input
                                        name="risk_factors.risk"
                                        defaultValue={item.risk}
                                        className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">해결 방안</label>
                                    <input
                                        name="risk_factors.solution"
                                        defaultValue={item.solution}
                                        className="w-full p-2 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                        {/* Always add one empty slot or allow adding? For MVP, just editing existing ones is safer/easier. 
                            Users can clear content to 'remove' it effectively or we keep it simple. */}
                    </div>
                </section>

                {/* 5. Expert Recommendation */}
                <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">전문가 총평</h3>
                    <textarea
                        name="recommendation"
                        defaultValue={analysis.recommendation}
                        rows={5}
                        className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                    />
                </section>

                {state?.error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium animate-pulse">
                        {state.error}
                    </div>
                )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition"
                >
                    취소
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center"
                >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                    저장하기
                </button>
            </div>
        </form>
    )
}
