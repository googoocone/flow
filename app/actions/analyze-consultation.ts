'use server'

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { transcribeWithClova } from '@/utils/clova'
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
      console.log('Sending audio to Local Whisper Server...')

      // Determine Whisper Server URL: Use Env Var if available (for Vercel connection to ngrok), else default to localhost
      // Example Env Var: WHISPER_API_URL="https://abcd-1234.ngrok-free.app/transcribe"
      const whisperUrl = process.env.WHISPER_API_URL || 'http://127.0.0.1:8000/transcribe'
      console.log('Target URL:', whisperUrl)

      const whisperFormData = new FormData()
      whisperFormData.append('file', fileBlob, filePath.split('/').pop() || 'audio.mp3')

      const whisperResponse = await fetch(whisperUrl, {
        method: 'POST',
        body: whisperFormData,
        // Next.js might cache fetch by default, ensure we don't cache
        cache: 'no-store'
      })

      if (!whisperResponse.ok) {
        throw new Error(`Local Whisper Server Error: ${whisperResponse.status}`)
      }

      const whisperData = await whisperResponse.json()

      if (whisperData.error) {
        throw new Error(`Whisper Transcription Error: ${whisperData.error}`)
      }

      transcript = whisperData.transcript
      console.log('Local Whisper Success:', transcript.substring(0, 50) + '...')

    } catch (sttError) {
      console.error('STT Failed:', sttError)
      throw new Error('STT Analysis Failed: ' + (sttError as any).message + '. Is whisper_server.py running?')
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
      "risk_factors": [
        { 
          "risk": "주의해야 할 위험 요소 (예: 최근 대출, 도박, 재산 은닉 의심 등)",
          "solution": "이에 대한 대응 방안 또는 준비해야 할 점"
        }
      ],
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
