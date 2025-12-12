'use server'

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { redirect } from 'next/navigation'

const DUMMY_TRANSCRIPT = `
상담자: 안녕하세요, 오늘 어떤 문제로 방문하셨나요?
고객: 네, 빚이 너무 많아서 감당이 안 돼서 찾아왔습니다.
상담자: 현재 소득 활동은 하고 계신가요?
고객: 네, 편의점 아르바이트를 하고 있고 월 150만원 정도 법니다.
상담자: 채무 총액은 어느 정도 되시나요?
고객: 대출이랑 카드값 합쳐서 약 8천만원 정도 됩니다. 주식 투자를 좀 실패해서요.
상담자: 재산은 따로 없으신가요?
고객: 보증금 500만원 있는 월세방에 살고 있고, 그 외에는 없습니다.
상담자: 알겠습니다. 개인회생을 진행하면 월 소득에서 최저생계비를 제외한 금액을 3년에서 5년 동안 변제하게 됩니다. 선생님 같은 경우 1인 최저생계비를 제외하면 월 변제금이...
`

export async function analyzeConsultation(formData: FormData) {
  console.log('--- Analyze Consultation Started ---')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const geminiKey = process.env.GOOGLE_GEMINI_API_KEY

  if (!supabaseUrl || !supabaseKey || !geminiKey) {
    console.error('Missing Environment Variables:', {
      hasUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasGeminiKey: !!geminiKey
    })
    throw new Error('Server environment variables are missing. Please check .env.local and restart the server.')
  }

  const filePath = formData.get('filePath') as string
  const counselorName = formData.get('counselorName') as string
  const clientName = formData.get('clientName') as string
  const clientPhone = formData.get('clientPhone') as string
  const caseType = formData.get('caseType') as string

  console.log('Received parameters:', { filePath, counselorName, clientName })

  if (!filePath || !counselorName || !clientName) {
    throw new Error('Missing required fields')
  }

  // 1. Mock STT (In reality, we would send audio to STT API)
  console.log('Step 1: Mock STT')
  const transcript = DUMMY_TRANSCRIPT

  // 2. Gemini Analysis
  console.log('Step 2: Gemini Analysis')
  const genAI = new GoogleGenerativeAI(geminiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

  const prompt = `
    다음은 개인회생/파산 관련 상담 녹취록입니다. 
    이 내용을 분석하여 다음 JSON 형식으로 출력해주세요. 
    응답은 오직 JSON만 포함해야 합니다.

    형식:
    {
      "summary": "상담 내용 요약",
      "financial_status": {
        "income": "소득 관련 내용",
        "debt_total": "총 채무액",
        "assets": "자산 현황"
      },
      "recommendation": "권장 해결책 (개인회생 또는 파산 및 이유)",
      "action_items": ["필요 서류 1", "필요 서류 2", ...]
    }

    녹취록:
    ${transcript}
  `

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' }
  })

  const analysisText = result.response.text()
  const analysisJson = JSON.parse(analysisText)

  // 3. Save to Supabase
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('consultations')
    .insert({
      counselor_name: counselorName,
      client_name: clientName,
      client_phone: clientPhone,
      case_type: caseType,
      audio_url: filePath,
      transcript: transcript,
      analysis_result: analysisJson
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase Insert Error:', error)
    throw new Error('Failed to save consultation')
  }

  // 4. Redirect
  redirect(`/report/${data.id}`)
}
