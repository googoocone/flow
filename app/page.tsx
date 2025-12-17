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
              <span className="font-bold text-xl text-slate-900 tracking-tight">Flow Law</span>
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

          {/* Feature Verification Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
            {[
              {
                title: '자동 리포트 생성',
                desc: '상담 내용만 입력하면 전문가 수준의 분석 리포트가 즉시 생성됩니다.'
              },
              {
                title: '지능형 위기 분석',
                desc: 'AI가 잠재적 리스크 요인을 사전에 감지하고 대응책을 제안합니다.'
              },
              {
                title: '맞춤형 솔루션',
                desc: '의뢰인의 재무 상태에 따른 최적의 탕감율과 변제 계획을 설계합니다.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/50 backdrop-blur-sm border border-slate-100 p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="bg-slate-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-slate-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
