'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/utils/supabase/client'
import { analyzeConsultation } from '@/app/actions/analyze-consultation'
import { Loader2, UploadCloud } from 'lucide-react'

export default function AdminPage() {
    const [loading, setLoading] = useState(false)

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

        const supabase = createSupabaseClient()
        const filename = `${Date.now()}_${crypto.randomUUID()}.mp3`

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
        // Add filePath to formData. We need to create a new FormData or append to existing? 
        // Since analyzeConsultation takes FormData, we can just pass the existing one + append new field.
        // However, the original 'file' is in there, which is fine, server action just ignores it or reads it if needed, but we wanted to pass 'filePath'.

        formData.append('filePath', data.path)

        try {
            await analyzeConsultation(formData)
        } catch (error) {
            console.error('Analysis Error:', error)
            alert('분석 중 오류 발생')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">
                    상담 녹음 분석
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                        <input name="counselorName" required className="w-full border rounded-md p-2" placeholder="김상담" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">고객명</label>
                        <input name="clientName" required className="w-full border rounded-md p-2" placeholder="홍길동" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                        <input name="clientPhone" required className="w-full border rounded-md p-2" placeholder="010-1234-5678" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">상담 유형</label>
                        <select name="caseType" className="w-full border rounded-md p-2">
                            <option value="individual_rehabilitation">개인회생</option>
                            <option value="bankruptcy">개인파산</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">녹음 파일</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <input type="file" name="file" accept=".mp3,.m4a,.wav" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                분석 중...
                            </>
                        ) : (
                            '분석 시작'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
