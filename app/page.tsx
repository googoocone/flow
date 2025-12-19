import Link from 'next/link'
import { ArrowRight, CheckCircle2, Bot, LogOut, LayoutDashboard } from 'lucide-react'
import { createServerSupabaseClient } from '@/utils/supabase/server'
import { signOut } from './login/actions'

export default async function Home() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="bg-slate-900 text-white p-2 rounded-lg">
                <Bot className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">LawFlow</span>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center text-slate-600 hover:text-slate-900 font-medium px-4 py-2 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    대시보드
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="flex items-center bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 transition-colors">
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
                  >
                    시작하기
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-slate-50 to-white -z-10" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-50/50 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1 mb-8">
            <span className="bg-green-500 w-2 h-2 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Beta Access Available</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            개인회생 상담의 <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">새로운 기준을 제시합니다</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            AI 기반 데이터 분석으로 의뢰인에게 최적의 솔루션을 제공하세요.<br />
            상담 리포트 자동 생성부터 고객 관리까지, 모든 과정을 한 번에.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link
              href="/signup"
              className="w-full md:w-auto flex items-center justify-center bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              지금 바로 시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full md:w-auto flex items-center justify-center bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              기존 계정으로 로그인
            </Link>
          </div>

          {/* Vertical Feature Sections (Scroll-telling) */}
          <div className="mt-32 space-y-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section 1: Simple Upload (Image Left, Text Right) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">
              <div className="w-full md:w-1/2 relative group" data-aos="fade-right">
                <div className="absolute inset-0 bg-blue-100/50 rounded-3xl blur-3xl -z-10 transform group-hover:scale-105 transition-transform duration-700" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/30 backdrop-blur-md transform hover:-translate-y-2 transition-transform duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/landing_upload_3d.png" alt="Simple Upload" className="w-full h-auto object-cover" />
                </div>
              </div>
              <div className="w-full md:w-1/2 text-left space-y-6" data-aos="fade-left">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Step 01</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                  초간편 리포트 생성
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  녹음 파일만 업로드하면 끝,<br />
                  복잡한 작업은 필요 없습니다.
                </p>
                <p className="text-slate-500 leading-relaxed">
                  드래그 앤 드롭 한 번으로 모든 준비가 완료됩니다. <br />
                  형식에 구애받지 않고 다양한 오디오 파일을 지원하여 누구나 쉽게 시작할 수 있습니다.
                </p>
              </div>
            </div>

            {/* Section 2: AI Automation (Text Left, Image Right) */}
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-24">
              <div className="w-full md:w-1/2 text-left space-y-6 md:pl-8" data-aos="fade-right">
                <span className="text-purple-600 font-bold tracking-wider uppercase text-sm">Step 02</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                  AI 완전 자동화
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  사람의 개입 없이<br />
                  100% AI가 상담 내용을 분석합니다.
                </p>
                <p className="text-slate-500 leading-relaxed">
                  최신 판례와 법률 데이터를 학습한 AI 엔진이 <br />
                  상담의 맥락을 정확히 파악하여 전문적인 분석 결과를 도출합니다.
                </p>
              </div>
              <div className="w-full md:w-1/2 relative group" data-aos="fade-left">
                <div className="absolute inset-0 bg-purple-100/50 rounded-3xl blur-3xl -z-10 transform group-hover:scale-105 transition-transform duration-700" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/30 backdrop-blur-md transform hover:-translate-y-2 transition-transform duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/landing_ai_3d.png" alt="AI Analysis" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>

            {/* Section 3: Success & Trust (Image Left, Text Right) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">
              <div className="w-full md:w-1/2 relative group" data-aos="fade-right">
                <div className="absolute inset-0 bg-amber-100/50 rounded-3xl blur-3xl -z-10 transform group-hover:scale-105 transition-transform duration-700" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/30 backdrop-blur-md transform hover:-translate-y-2 transition-transform duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/landing_success_3d.png" alt="Success Conversion" className="w-full h-auto object-cover" />
                </div>
              </div>
              <div className="w-full md:w-1/2 text-left space-y-6" data-aos="fade-left">
                <span className="text-amber-600 font-bold tracking-wider uppercase text-sm">Step 03</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                  수임 전환율 상승
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  전문적인 리포트 제공으로<br />
                  의뢰인 신뢰도 및 계약 확률을 극대화합니다.
                </p>
                <p className="text-slate-500 leading-relaxed">
                  단순 상담을 넘어, 눈에 보이는 결과물로 의뢰인을 설득하세요. <br />
                  체계적인 리마인드와 전문적인 자료는 계약 성사의 핵심입니다.
                </p>
                <div className="pt-8">
                  <Link href="/signup" className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                    무료로 시작하기
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
