import { createServerSupabaseClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Calendar, User, ArrowRight } from 'lucide-react'
import DeleteReportButton from '@/app/components/DeleteReportButton'

export default async function ReportsPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: reports } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">분석 리포트</h1>
                        <p className="mt-2 text-slate-600">이전 상담 분석 결과를 확인하세요.</p>
                    </div>
                    <Link
                        href="/dashboard/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                    >
                        + 새 분석 시작
                    </Link>
                </div>

                <div className="grid gap-4">
                    {reports && reports.length > 0 ? (
                        reports.map((report: any) => (
                            <div
                                key={report.id}
                                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                            >
                                <Link href={`/report/${report.id}`} className="flex-1 flex items-center gap-6">
                                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                            {report.client_name} 고객 상담 분석
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {new Date(report.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-1" />
                                                {report.counselor_name}
                                            </div>
                                            <div className="px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold uppercase">
                                                {report.status}
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex items-center gap-2 pl-4 border-l border-slate-100 ml-4">
                                    <Link
                                        href={`/dashboard/reports/${report.id}/edit`}
                                        className="inline-flex items-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-medium transition-all shadow-sm"
                                        title="수정하기"
                                    >
                                        <span className="mr-2">✏️</span>
                                        수정하기
                                    </Link>
                                    <div className="scale-90">
                                        <DeleteReportButton id={report.id} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">아직 생성된 리포트가 없습니다.</p>
                            <Link href="/dashboard/new" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
                                분석 시작하기
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
