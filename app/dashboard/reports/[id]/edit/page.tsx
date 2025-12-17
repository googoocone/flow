import { createServerSupabaseClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import EditReportForm from './form'

export default async function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient()
    const { id } = await params

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: report, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !report) {
        notFound()
    }

    // Authorization Check: Only creator can edit
    if (report.user_id !== user.id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">권한이 없습니다.</h1>
                    <p className="text-slate-500">본인이 생성한 리포트만 수정할 수 있습니다.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">리포트 수정</h1>
                    <p className="mt-2 text-slate-600">
                        {report.client_name} 고객님의 상담 리포트 내용을 수정합니다.
                    </p>
                </div>
                
                <EditReportForm report={report} reportId={id} />
            </div>
        </div>
    )
}
