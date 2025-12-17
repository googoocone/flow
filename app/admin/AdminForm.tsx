'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/utils/supabase/client'
import { analyzeConsultation } from '@/app/actions/analyze-consultation'
import {
    Loader2,
    UploadCloud,
    FileAudio,
    User,
    Phone,
    FileText,
    Bot,
    ChevronDown
} from 'lucide-react'

interface AdminFormProps {
    profile: {
        name?: string
        company_name?: string
    } | null
}

export default function AdminForm({ profile }: AdminFormProps) {
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState<string>('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        // 1. File Upload
        const file = formData.get('file') as File
        if (!file || file.size === 0) {
            alert('파일을 선택해주세요.')
            setLoading(false)
            return
        }

        // Check if it's a text file
        if (file.name.endsWith('.txt')) {
            const text = await file.text()
            formData.append('actualTranscript', text)
        }

        const supabase = createSupabaseClient()
        const clientName = formData.get('clientName') as string
        const safeClientName = clientName ? clientName.replace(/[^a-zA-Z0-9]/g, '_') : 'unknown'
        const extension = file.name.split('.').pop()
        const filename = `${Date.now()}_${safeClientName}_${crypto.randomUUID()}.${extension}`

        const { data, error: uploadError } = await supabase
            .storage
            .from('recordings')
            .upload(filename, file, {
                upsert: false
            })

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            alert('파일 업로드 실패: ' + uploadError.message)
            setLoading(false)
            return
        }

        // 2. Server Action Call
        formData.append('filePath', data.path)
        formData.delete('file')

        try {
            await analyzeConsultation(formData)
        } catch (error: any) {
            // Ignore NEXT_REDIRECT error
            if (error.message === 'NEXT_REDIRECT' || error.digest?.includes('NEXT_REDIRECT')) {
                return
            }
            console.error('Analysis Error:', error)
            alert('분석 중 오류 발생: ' + (error.message || '알 수 없는 오류'))
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-10">
                    <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <Bot className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        상담 분석 시스템
                    </h1>
                    <p className="mt-2 text-slate-600">
                        AI를 활용한 심층 상담 분석 및 리포트 생성
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-8 sm:p-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 담당자 정보 */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">담당자</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            name="counselorName"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                            defaultValue={profile?.name || ''}
                                            placeholder="담당자명 입력"
                                        />
                                    </div>
                                </div>

                                {/* 고객명 */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">고객명</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            name="clientName"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                            placeholder="고객명 입력"
                                        />
                                    </div>
                                </div>

                                {/* 연락처 */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">연락처</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            name="clientPhone"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                            placeholder="010-0000-0000"
                                        />
                                    </div>
                                </div>

                                {/* 상담 유형 */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">상담 유형</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FileText className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <select
                                            name="caseType"
                                            className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm appearance-none"
                                        >
                                            <option value="individual_rehabilitation">개인회생</option>
                                            <option value="bankruptcy">개인파산</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <ChevronDown className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 파일 업로드 섹션 */}
                            <div className="pt-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">상담 녹음 파일</label>
                                <div className="relative group">
                                    <div className={`
                                        border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
                                        ${fileName ? 'border-blue-400 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
                                    `}>
                                        <input
                                            type="file"
                                            name="file"
                                            accept=".mp3,.m4a,.wav,.txt"
                                            required
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="space-y-4">
                                            <div className={`
                                                mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300
                                                ${fileName ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}
                                            `}>
                                                {fileName ? <FileAudio className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
                                            </div>
                                            <div className="text-sm">
                                                {fileName ? (
                                                    <div>
                                                        <span className="font-semibold text-blue-600">{fileName}</span>
                                                        <p className="text-blue-400 mt-1">파일이 선택되었습니다</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="font-semibold text-slate-700">
                                                            클릭하여 업로드하거나 파일을 드래그하세요
                                                        </p>
                                                        <p className="text-slate-500 mt-1">
                                                            MP3, M4A, WAV, TXT 지원
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-200
                                    flex items-center justify-center transition-all duration-200 transform
                                    ${loading
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] hover:shadow-blue-300'
                                    }
                                `}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2 h-6 w-6" />
                                        분석 및 리포트 생성 중...
                                    </>
                                ) : (
                                    'AI 분석 시작하기'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-sm mt-8">
                    &copy; 2025 AI Consultation Analysis System. All rights reserved.
                </p>
            </div>
        </div>
    )
}
