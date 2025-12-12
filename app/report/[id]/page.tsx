import { createServerSupabaseClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { CheckCircle2, FileText, TrendingDown, Wallet, AlertTriangle } from 'lucide-react'

export default async function ReportPage({ params }: { params: { id: string } }) {
    const supabase = createServerSupabaseClient()

    const { data: consultation, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !consultation) {
        notFound()
    }

    const { analysis_result } = consultation
    // Type assertion or safe access
    const report = analysis_result as any

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">상담 분석 리포트</h1>
                        <p className="text-gray-500 mt-1">
                            {new Date(consultation.created_at).toLocaleString('ko-KR')} | {consultation.client_name} 고객님
                        </p>
                    </div>
                    <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${consultation.case_type === 'individual_rehabilitation' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {consultation.case_type === 'individual_rehabilitation' ? '개인회생' : '개인파산'}
                        </span>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center mb-4 text-blue-600">
                        <FileText className="w-6 h-6 mr-2" />
                        <h2 className="text-xl font-bold">상담 요약</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        {report.summary}
                    </p>
                </div>

                {/* Financial Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-2 text-gray-500">
                            <Wallet className="w-5 h-5 mr-2" />
                            <span className="font-medium">월 소득</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{report.financial_status.income}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-2 text-gray-500">
                            <TrendingDown className="w-5 h-5 mr-2" />
                            <span className="font-medium">총 채무액</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600">{report.financial_status.debt_total}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-2 text-gray-500">
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            <span className="font-medium">자산</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{report.financial_status.assets}</p>
                    </div>
                </div>

                {/* Recommendation */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                    <div className="flex items-start">
                        <AlertTriangle className="w-6 h-6 text-blue-500 mr-3 mt-1" />
                        <div>
                            <h3 className="text-lg font-bold text-blue-900 mb-2">전문가 소견</h3>
                            <p className="text-blue-800 font-medium">
                                {report.recommendation}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Items */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">준비 서류 및 다음 단계</h2>
                    <ul className="space-y-3">
                        {report.action_items && report.action_items.map((item: string, index: number) => (
                            <li key={index} className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                                    {index + 1}
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    )
}
