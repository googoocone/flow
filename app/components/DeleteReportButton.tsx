'use client'

import { deleteConsultation } from '@/app/actions/consultations'
import { Trash2 } from 'lucide-react'
import { useTransition, useState } from 'react'
import ConfirmationModal from './ConfirmationModal'

export default function DeleteReportButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()
    const [showModal, setShowModal] = useState(false)

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setShowModal(true)
    }

    const handleConfirmDelete = () => {
        startTransition(async () => {
            try {
                await deleteConsultation(id)
            } catch (error) {
                console.error(error)
                // Optional: Toast notification here
            }
        })
    }

    return (
        <>
            <button
                onClick={handleDeleteClick}
                disabled={isPending}
                className={`inline-flex items-center px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-all shadow-sm ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <Trash2 className="w-4 h-4 mr-2" />
                {isPending ? '삭제 중...' : '삭제하기'}
            </button>

            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDelete}
                title="리포트 삭제"
                message="정말로 이 리포트를 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다."
                confirmText="삭제하기"
                isDanger={true}
            />
        </>
    )
}
