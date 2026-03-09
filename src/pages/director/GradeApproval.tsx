// import { useState } from 'react'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { answerApi } from '../../api/answer'
// import { GradeBadge } from '../../components/GradeBadge'
// import { Modal } from '../../components/Modal'
// import { CheckCircle, XCircle } from 'lucide-react'
// import type { Grade } from '../../types'

// export const GradeApprovals = () => {
//   const qc = useQueryClient()
//   const [selected, setSelected] = useState<Grade | null>(null)
//   const [comment, setComment] = useState('')
//   const [action, setAction] = useState<'approve' | 'reject' | null>(null)

//   const { data: grades = [], isLoading } = useQuery({
//     queryKey: ['pendingGrades'],
//     queryFn: answerApi.getPendingGrades,
//   })

//   const review = useMutation({
//     mutationFn: ({ gradeId, action, directorComment }: any) =>
//       answerApi.reviewGrade(gradeId, { action, directorComment }),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['pendingGrades'] })
//       setSelected(null); setComment(''); setAction(null)
//     }
//   })

//   if (isLoading) return <div className="text-ink/40 font-mono text-sm py-8">Loading...</div>

//   return (
//     <div>
//       <div className="mb-6">
//         <h1 className="section-title">Grade Approvals</h1>
//         <p className="text-sm text-ink/50 mt-1 font-mono">Review and approve teacher-submitted grades</p>
//       </div>

//       {grades.length === 0 ? (
//         <div className="card text-center py-16">
//           <CheckCircle size={32} className="mx-auto text-green-600 mb-3" />
//           <p className="text-ink/60 font-mono text-sm">All grades reviewed — nothing pending</p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {(grades as any[]).map((grade: any) => (
//             <div key={grade.id} className="card">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-3 mb-2 flex-wrap">
//                     <GradeBadge status={grade.status} />
//                     <span className="font-mono text-xs text-ink/50">
//                       Student: <strong className="text-ink">{grade.answer?.student?.name}</strong>
//                     </span>
//                     <span className="font-mono text-xs text-ink/50">
//                       Teacher: <strong className="text-ink">{grade.teacher?.name}</strong>
//                     </span>
//                   </div>
//                   <p className="text-sm font-medium mb-1 line-clamp-2">{grade.answer?.question?.text}</p>
//                   <div className="flex items-center gap-4 mt-2">
//                     <span className="font-mono text-sm">
//                       Score: <strong>{grade.score}</strong> / {grade.answer?.question?.maxScore}
//                     </span>
//                     {grade.feedback && (
//                       <span className="text-xs text-ink/50 font-mono italic truncate max-w-xs">"{grade.feedback}"</span>
//                     )}
//                   </div>
//                   <div className="mt-2 p-3 bg-paper border border-rule text-sm font-mono text-ink/60 max-h-20 overflow-y-auto">
//                     {grade.answer?.content || <em>No answer content</em>}
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-2 ml-4">
//                   <button onClick={() => { setSelected(grade); setAction('approve') }}
//                     className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 text-white text-xs font-mono hover:bg-green-800 transition-colors">
//                     <CheckCircle size={12} /> Approve
//                   </button>
//                   <button onClick={() => { setSelected(grade); setAction('reject') }}
//                     className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 text-white text-xs font-mono hover:bg-red-800 transition-colors">
//                     <XCircle size={12} /> Reject
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {selected && action && (
//         <Modal title={action === 'approve' ? 'Approve Grade' : 'Reject Grade'} onClose={() => { setSelected(null); setAction(null) }}>
//           <div className="space-y-4">
//             <div className="bg-paper border border-rule p-3 text-sm">
//               <p className="font-medium">{selected.answer?.question?.text}</p>
//               <p className="text-ink/50 font-mono text-xs mt-1">
//                 Score: {selected.score} / {selected.answer?.question?.maxScore} · by {selected.teacher?.name}
//               </p>
//             </div>
//             <div>
//               <label className="label block mb-1.5">
//                 {action === 'approve' ? 'Note (optional)' : 'Rejection reason (required)'}
//               </label>
//               <textarea className="input-field" rows={3} value={comment}
//                 onChange={e => setComment(e.target.value)}
//                 placeholder={action === 'approve' ? 'Optional approval note...' : 'Explain why the grade needs revision...'} />
//             </div>
//             <div className="flex gap-2 justify-end">
//               <button onClick={() => { setSelected(null); setAction(null) }} className="btn-ghost">Cancel</button>
//               <button
//                 onClick={() => review.mutate({ gradeId: selected.id, action, directorComment: comment })}
//                 disabled={review.isPending || (action === 'reject' && !comment)}
//                 className={action === 'approve' ? 'btn-primary' : 'btn-danger'}>
//                 {review.isPending ? 'Saving...' : action === 'approve' ? 'Approve Grade' : 'Reject Grade'}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   )
// }






















import { useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { answerApi } from '../../api/answer'
import { GradeBadge } from '../../components/GradeBadge'
import { Modal } from '../../components/Modal'
import { CheckCircle, XCircle } from 'lucide-react'
import { useSocketEvent } from '../../hooks/useSocket'
import { socket } from '../../lib/socket'
import type { Grade } from '../../types'

export const GradeApprovals = () => {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<Grade | null>(null)
  const [comment, setComment] = useState('')
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  const { data: grades = [], isLoading } = useQuery({
    queryKey: ['pendingGrades'],
    queryFn: answerApi.getPendingGrades,
    refetchInterval: 5000, // ← temporary fallback: polls every 5s while we fix socket
  })

  // Debug — remove once working
  useEffect(() => {
    console.log('🔌 socket connected:', socket.connected, '| id:', socket.id)
    socket.on('grade:updated', (data: any) => console.log('✅ grade:updated:', data))
    return () => { socket.off('grade:updated') }
  }, [])

  useSocketEvent('grade:updated', useCallback(() => {
    console.log('🔄 invalidating pendingGrades...')
    qc.invalidateQueries({ queryKey: ['pendingGrades'] })
  }, [qc]))

  const review = useMutation({
    mutationFn: ({ gradeId, action, directorComment }: any) =>
      answerApi.reviewGrade(gradeId, { action, directorComment }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pendingGrades'] })
      setSelected(null); setComment(''); setAction(null)
    }
  })

  if (isLoading) return <div className="text-ink/40 font-mono text-sm py-8">Loading...</div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Grade Approvals</h1>
        <p className="text-sm text-ink/50 mt-1 font-mono">Review and approve teacher-submitted grades</p>
      </div>

      {grades.length === 0 ? (
        <div className="card text-center py-16">
          <CheckCircle size={32} className="mx-auto text-green-600 mb-3" />
          <p className="text-ink/60 font-mono text-sm">All grades reviewed — nothing pending</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(grades as any[]).map((grade: any) => (
            <div key={grade.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <GradeBadge status={grade.status} />
                    <span className="font-mono text-xs text-ink/50">
                      Student: <strong className="text-ink">{grade.answer?.student?.name}</strong>
                    </span>
                    <span className="font-mono text-xs text-ink/50">
                      Teacher: <strong className="text-ink">{grade.teacher?.name}</strong>
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1 line-clamp-2">{grade.answer?.question?.text}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-mono text-sm">
                      Score: <strong>{grade.score}</strong> / {grade.answer?.question?.maxScore}
                    </span>
                    {grade.feedback && (
                      <span className="text-xs text-ink/50 font-mono italic truncate max-w-xs">"{grade.feedback}"</span>
                    )}
                  </div>
                  <div className="mt-2 p-3 bg-paper border border-rule text-sm font-mono text-ink/60 max-h-20 overflow-y-auto">
                    {grade.answer?.content || <em>No answer content</em>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button onClick={() => { setSelected(grade); setAction('approve') }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 text-white text-xs font-mono hover:bg-green-800 transition-colors">
                    <CheckCircle size={12} /> Approve
                  </button>
                  <button onClick={() => { setSelected(grade); setAction('reject') }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 text-white text-xs font-mono hover:bg-red-800 transition-colors">
                    <XCircle size={12} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && action && (
        <Modal title={action === 'approve' ? 'Approve Grade' : 'Reject Grade'} onClose={() => { setSelected(null); setAction(null) }}>
          <div className="space-y-4">
            <div className="bg-paper border border-rule p-3 text-sm">
              <p className="font-medium">{selected.answer?.question?.text}</p>
              <p className="text-ink/50 font-mono text-xs mt-1">
                Score: {selected.score} / {selected.answer?.question?.maxScore} · by {selected.teacher?.name}
              </p>
            </div>
            <div>
              <label className="label block mb-1.5">
                {action === 'approve' ? 'Note (optional)' : 'Rejection reason (required)'}
              </label>
              <textarea className="input-field" rows={3} value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={action === 'approve' ? 'Optional approval note...' : 'Explain why the grade needs revision...'} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setSelected(null); setAction(null) }} className="btn-ghost">Cancel</button>
              <button
                onClick={() => review.mutate({ gradeId: selected.id, action, directorComment: comment })}
                disabled={review.isPending || (action === 'reject' && !comment)}
                className={action === 'approve' ? 'btn-primary' : 'btn-danger'}>
                {review.isPending ? 'Saving...' : action === 'approve' ? 'Approve Grade' : 'Reject Grade'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}