import { Hourglass, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PendingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Hourglass className="w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-3">승인 대기중</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    관리자의 승인을 기다리고 있습니다.<br />
                    승인이 완료되면 서비스를 이용하실 수 있습니다.<br />
                    <span className="text-xs text-slate-400 mt-2 block">(승인 관련 문의: 관리자에게 직접 연락해주세요)</span>
                </p>

                <Link
                    href="/login"
                    className="inline-flex items-center justify-center w-full bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3 rounded-xl transition-all duration-200"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    로그인 페이지로 돌아가기
                </Link>
            </div>
        </div>
    )
}
