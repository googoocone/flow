'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, User, LogOut, Shield } from 'lucide-react'
import { signOut } from '@/app/mypage/actions'

interface SidebarProps {
    isAdmin?: boolean
    userName?: string
    userEmail?: string
}

export function Sidebar({ isAdmin, userName, userEmail }: SidebarProps) {
    const pathname = usePathname()

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(path + '/')
    }

    const navItems = [
        {
            name: '새 분석 시작',
            href: '/dashboard/new',
            icon: LayoutDashboard
        },
        {
            name: '분석 리포트',
            href: '/dashboard/reports',
            icon: FileText
        },
        {
            name: '내 프로필',
            href: '/dashboard/profile',
            icon: User
        }
    ]

    return (
        <div className="w-64 bg-slate-900 min-h-screen text-white flex flex-col fixed left-0 top-0 bottom-0 z-50">
            <div className="p-6 border-b border-slate-800">
                <Link href="/" className="block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                        AI Consultation
                    </h1>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const active = isActive(item.href)
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-4 py-3 rounded-xl transition-all ${active
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 font-medium'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 mr-3 ${active ? 'text-white' : 'text-slate-500'}`} />
                            {item.name}
                        </Link>
                    )
                })}

                {isAdmin && (
                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <p className="px-4 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                            Administration
                        </p>
                        <Link
                            href="/admin"
                            className="flex items-center px-4 py-3 rounded-xl text-red-300 hover:bg-red-950/30 transition-all font-medium"
                        >
                            <Shield className="w-5 h-5 mr-3" />
                            사용자 승인 관리
                        </Link>
                    </div>
                )}
            </nav>

            <div className="p-4 bg-slate-950 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <div className="min-w-0">
                        <p className="text-sm font-bold truncate text-slate-200">{userName || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                    </div>
                </div>
                <form action={signOut}>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        로그아웃
                    </button>
                </form>
            </div>
        </div>
    )
}
