'use server'

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateReport(reportId: string, prevState: any, formData: FormData) {
    const supabase = await createServerSupabaseClient()

    // 1. Verify User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: '로그인이 필요합니다.' }
    }

    // 2. Prepare Updates
    const clientName = formData.get('clientName') as string
    const clientPhone = formData.get('clientPhone') as string
    
    // Construct valid JSON for analysis_result from form data
    // We need to parse nested fields. This approach assumes we name inputs like 'current_situation.difficulties'
    // but FormData key access is flat. We will manually reconstruct the object.

    const get = (key: string) => formData.get(key) as string

    const updatedAnalysis = {
        current_situation: {
            difficulties: get('current_situation.difficulties'),
            cause: get('current_situation.cause'),
            suffering: get('current_situation.suffering'),
        },
        financial_status: {
            income: get('financial_status.income'),
            total_debt: get('financial_status.total_debt'),
            debt_items: get('financial_status.debt_items'), // Kept simple
        },
        expected_outcome: {
            cancellation_rate: get('expected_outcome.cancellation_rate'),
            monthly_payment: get('expected_outcome.monthly_payment'),
            detail_explanation: get('expected_outcome.detail_explanation'),
        },
        recommendation: get('recommendation'),
        // Risk factors and others: parsing dynamic counts or using JSON string if simplified
        // For now, let's assume we preserve the original arrays if not edited, 
        // OR we can implement a simple "JSON string" edit for complex arrays if UI is too hard.
        // Let's try to grab specific inputs if they exist, or fallback to parsing a hidden JSON field?
        // Better: Let's read the OLD data first to merge arrays if we don't edit them? 
        // Actually, let's strictly update what we offer to edit.
        // If we want to edit risks, we need to extract them.
    }

    // RISK FACTORS HANDLING (Simplified: We will rely on a hidden JSON input or assume we aren't editing arrays deep structure yet?)
    // User requested "Risk Factors & Solutions". 
    // Let's grab them from form arrays.
    
    const riskRisks = formData.getAll('risk_factors.risk')
    const riskSolutions = formData.getAll('risk_factors.solution')
    const riskFactors = riskRisks.map((risk, i) => ({
        risk: risk as string,
        solution: (riskSolutions[i] as string) || ''
    }))

    // Merge into analysis
    const fullAnalysisResult = {
        ...updatedAnalysis,
        risk_factors: riskFactors,
        // We might lose 'recommended_steps' or 'expected_benefits' if we don't include them in the form!
        // So we MUST fetch original and merge, OR include them in the form.
        // Strategy: Fetch original first.
    }

    // 3. Update Database
    // Fetch original first to merge unedited fields
    const { data: original } = await supabase.from('consultations').select('analysis_result').eq('id', reportId).single()
    const mergedAnalysis = {
        ...original?.analysis_result,
        ...fullAnalysisResult,
        // Ensure arrays we gathered are used
        risk_factors: riskFactors.length > 0 ? riskFactors : original?.analysis_result?.risk_factors
    }

    const { error } = await supabase
        .from('consultations')
        .update({
            client_name: clientName,
            client_phone: clientPhone,
            analysis_result: mergedAnalysis
        })
        .eq('id', reportId)
        .eq('user_id', user.id) // Security check

    if (error) {
        console.error('Update Report Error:', error)
        return { error: '리포트 수정 실패: ' + error.message }
    }

    revalidatePath(`/report/${reportId}`)
    revalidatePath('/dashboard/reports')
    
    // We can't redirect inside try/catch block if we used one, but here we can.
    // Return success to component to trigger redirect or toast.
    return { success: true }
}
