'use server'

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { transcribeWithClova } from '@/utils/clova'
import { redirect } from 'next/navigation'


export async function analyzeConsultation(formData: FormData) {
  console.log('--- Analyze Consultation Started (AI Studio) ---')

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
  const actualTranscript = formData.get('actualTranscript') as string | null

  console.log('Received parameters:', { filePath, counselorName, clientName, hasTranscript: !!actualTranscript })

  if (!filePath || !counselorName || !clientName) {
    throw new Error('Missing required fields')
  }

  // ... (imports remain)

  // ... (imports remain)

  // ... (inside function)
  // 1. STT: Download from Supabase and transcribe via Clova
  console.log('Step 1: STT (Clova Speech)')
  let transcript = ''

  if (actualTranscript) {
    console.log('Using provided transcript (skipping Clova)')
    transcript = actualTranscript
  } else {
    // Download file from Supabase to send to Local Whisper
    // The 'filePath' usually comes as full path "folder/filename.ext"
    const { data: fileBlob, error: downloadError } = await (await createServerSupabaseClient())
      .storage
      .from('recordings')
      .download(filePath)

    if (downloadError || !fileBlob) {
      console.error('File Download Error:', downloadError)
      throw new Error('Failed to download recording for transcription')
    }

    try {
      console.log('Sending audio to Clova Speech...')

      // Use the utility function to call Clova Speech API
      const filename = filePath.split('/').pop() || 'audio.mp3'
      transcript = await transcribeWithClova(fileBlob as Blob, filename)

      console.log('Clova Transcription Success:', transcript.substring(0, 50) + '...')
    } catch (sttError) {
      console.error('STT Failed:', sttError)
      throw new Error('STT Analysis Failed: ' + (sttError as any).message)
    }

    // Use transcript in prompt
    console.log('Transcription Length:', transcript.length)
  }



  // 2. Gemini Analysis
  console.log('Step 2: Gemini Analysis')
  const genAI = new GoogleGenerativeAI(geminiKey)
  // const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' })
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

  const prompt = `
    다음은 개인회생/파산 관련 상담 녹취록입니다. 
    이 내용을 분석하여 다음 JSON 형식으로 출력해주세요. 
    응답은 오직 JSON만 포함해야 합니다. (마크다운 코드 블록 제외)

    형식:
    {
      "current_situation": {
        "difficulties": "현재 겪고 계신 어려움 (상담 내용을 바탕으로 구체적인 상황과 어려움을 상세하고 공감대 있게 서술)",
        "cause": "채무 발생 원인 (구체적인 배경과 스토리를 포함하여 상세히 서술)",
        "suffering": "현재 겪고 있는 고통/심정 (고객의 절박한 심정을 반영하여 감성적으로 서술)"
      },
      "financial_status": {
        "income": "월 소득 (금액만 딱 떨어지게, 예: 300만원)",
        "total_debt": "총 채무액 (금액만 딱 떨어지게, 예: 8,500만원)",
        "debt_items": "채무 항목만 나열 (예: 대출, 카드값 등)",
        "total_assets": "총 자산액 (금액만 딱 떨어지게, 예: 500만원)",
        "asset_items": "자산 항목만 나열 (예: 보증금, 없음 등)"
      },
      "expected_outcome": {
        "cancellation_rate": "예상 탕감률 (핵심 수치만 'XX%' 형태로 단답형 출력. 부가 설명 절대 금지)",
        "monthly_payment": "예상 월 변제금 (핵심 금액만 'XX만원' 형태로 단답형 출력. 부가 설명 절대 금지)",
        "detail_explanation": "변제금이나 탕감률이 변동될 수 있는 조건이나 시나리오가 있다면 여기에 서술. 없으면 빈 문자열"
      },
      "debt_causes": [
        "채무 발생 원인을 다음 태그 중에서만 선택하여 1~2개 포함 (없으면 빈 배열): ['생활비', '병원비', '학자금', '개인채무', '상속채무', '코인,주식', '사기피해', '투자실패', '사업운영실패', '세금 미납금', '사치', '도박']"
      ],
      "risk_factors": [
        { 
          "risk": "주의해야 할 위험 요소 (예: 최근 대출, 도박, 재산 은닉 의심 등)",
          "solution": "이에 대한 대응 방안 또는 준비해야 할 점"
        }
      ],
      "client_profile": {
        "age": "연령대 (예: 20대, 30대, 40대, 50대, 60대이상)",
        "job": "직업군 (다음 중 하나 선택: [무직, 급여소득, 공무원, 영업소득, 아르바이트, 기타])",
        "cause": [
          "채무 발생 원인 (다음 중 선택: [생활비, 병원비, 학자금, 개인채무, 상속채무, 코인,주식, 사기피해, 투자실패, 사업운영실패, 세금 미납금, 사치, 도박])"
        ]
      },
      "recommended_steps": [
        { "step": "1단계: [단계명]", "description": "의뢰인의 상황에 맞춘 구체적인 1단계 대응 전략 (일반적인 절차 설명이 아닌, 이 의뢰인의 리스크를 어떻게 방어할 것인지)" },
        { "step": "2단계: [단계명]", "description": "의뢰인의 상황에 맞춘 2단계 진행 전략" },
        { "step": "3단계: [단계명]", "description": "의뢰인의 상황에 맞춘 3단계 마무리 및 면책 전략" }
      ],
      "expected_benefits": [
        { "title": "[실익 제목]", "desc": "의뢰인의 상황(직업, 가족, 재산 등)에 맞춰 구체적으로 얻게 될 이익" },
        { "title": "[실익 제목]", "desc": "의뢰인의 상황에 맞춘 구체적인 이익" },
        { "title": "[실익 제목]", "desc": "의뢰인의 상황에 맞춘 구체적인 이익" },
        { "title": "[실익 제목]", "desc": "의뢰인의 상황에 맞춘 구체적인 이익" }
      ],
      "recommendation": "권장 해결책 및 총평 (전문가의 말투로 상세하게)",
      "action_items": ["필요 서류 1", "필요 서류 2", ...]
    }

    녹취록:
    ${transcript}
  `

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' }
  })

  // const maxDuration = 60; // Config not supported in simple export for actions in some setups

  const response = await result.response
  let analysisText = response.text()

  // Remove markdown code blocks if present
  analysisText = analysisText.replace(/```json/g, '').replace(/```/g, '').trim()

  console.log('Gemini Raw Response:', analysisText)

  let analysisJson
  try {
    analysisJson = JSON.parse(analysisText)
  } catch (e) {
    console.error('JSON Parse Error:', e)
    console.error('Failed Text:', analysisText)
    // Fallback or re-throw
    throw new Error('Failed to parse analysis result')
  }

  // Get current user to link consultation
  const { data: { user } } = await (await createServerSupabaseClient()).auth.getUser()
  const userId = user?.id

  // 3. Save to Supabase
  console.log('Step 3: Save to Supabase')
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('consultations')
    .insert({
      user_id: userId,
      counselor_name: counselorName,
      client_name: clientName,
      client_phone: clientPhone,
      case_type: caseType,
      record_file_path: filePath,
      transcript: transcript, // We save the transcript
      analysis_result: analysisJson,
      tags: analysisJson.debt_causes || [], // Save debt causes as tags
      status: 'completed'
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
