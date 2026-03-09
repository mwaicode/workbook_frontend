import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { workbookApi } from '../../api/workbooks'
import { answerApi } from '../../api/answer'
import { WorksheetTabs } from '../../components/WorksheetTabs'
import { GradeBadge, AnswerBadge } from '../../components/GradeBadge'
import { useAuth } from '../../context/AuthContext'
import type { Workbook, Worksheet } from '../../types'
import { Award } from 'lucide-react'

export const StudentGrades = () => {
  const { user } = useAuth()
  const [activeWorkbookId, setActiveWorkbookId] = useState<string | null>(null)
  const [activeWorksheetId, setActiveWorksheetId] = useState<string | null>(null)

  const { data: workbooks = [] } = useQuery<Workbook[]>({
    queryKey: ['workbooks'],
    queryFn: workbookApi.list,
  })

  const { data: worksheets = [] } = useQuery<Worksheet[]>({
    queryKey: ['worksheets', activeWorkbookId],
    queryFn: () => workbookApi.getWorksheets(activeWorkbookId!),
    enabled: !!activeWorkbookId,
  })

  useEffect(() => {
    if (workbooks.length && !activeWorkbookId) setActiveWorkbookId(workbooks[0].id)
  }, [workbooks])

  useEffect(() => {
    if (worksheets.length && !activeWorksheetId) setActiveWorksheetId(worksheets[0].id)
  }, [worksheets])

  const activeWs = worksheets.find(w => w.id === activeWorksheetId)

  const myAnswersQuery = useQuery({
    queryKey: ['myGrades', activeWorksheetId, user?.id],
    queryFn: async () => {
      if (!activeWs) return []
      const results = await Promise.all(
        activeWs.questions.map((q: any) => answerApi.getMyAnswer(q.id).catch(() => null))
      )
      
return results.filter(Boolean).map((a: any, i: number) => ({ ...a, question: activeWs.questions[i] }))
    },
    enabled: !!activeWs,
  })

  const myAnswers = myAnswersQuery.data || []
  const gradedAnswers = myAnswers.filter((a: any) => a?.grade?.status === 'APPROVED')
  const totalScore = gradedAnswers.reduce((sum: number, a: any) => sum + (a.grade?.score || 0), 0)
  const maxPossible = gradedAnswers.reduce((sum: number, a: any) => sum + (a.question?.maxScore || 0), 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">My Grades</h1>
        <p className="text-sm text-ink/50 mt-1 font-mono">View approved grades for your answers</p>
      </div>

      {gradedAnswers.length > 0 && (
        <div className="card mb-6 flex items-center gap-5">
          <div className="p-3 bg-ink"><Award size={24} className="text-paper" /></div>
          <div>
            <p className="label mb-0.5">Current Score</p>
            <p className="font-display text-3xl font-bold">{totalScore} <span className="text-ink/40 text-xl">/ {maxPossible}</span></p>
            <p className="text-xs font-mono text-ink/50 mt-0.5">{gradedAnswers.length} approved grade{gradedAnswers.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      {workbooks.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {workbooks.map(wb => (
            <button key={wb.id} onClick={() => { setActiveWorkbookId(wb.id); setActiveWorksheetId(null) }}
              className={`px-4 py-2 text-sm font-mono border whitespace-nowrap ${activeWorkbookId === wb.id ? 'tab-active' : 'tab-inactive'}`}>
              {wb.title}
            </button>
          ))}
        </div>
      )}

      <div className="border border-rule">
        <WorksheetTabs worksheets={worksheets} activeId={activeWorksheetId} onSelect={setActiveWorksheetId} />
        <div className="p-5">
          {myAnswersQuery.isLoading ? (
            <p className="text-ink/40 font-mono text-sm">Loading grades...</p>
          ) : myAnswers.length === 0 ? (
            <p className="text-ink/40 font-mono text-sm text-center py-8">No answers submitted yet</p>
          ) : (
            <div className="space-y-4">
              {myAnswers.map((ans: any) => (
                <div key={ans?.id} className="bg-paper border border-rule p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-medium">{ans?.question?.text}</p>
                    <AnswerBadge status={ans?.status} />
                  </div>
                  <div className="bg-cream border border-rule p-3 font-mono text-xs text-ink/60 mb-3 max-h-24 overflow-y-auto">
                    {ans?.content || <em>Empty</em>}
                  </div>
                  {ans?.grade ? (
                    ans.grade.status === 'APPROVED' ? (
                      <div className="p-3 bg-green-50 border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <GradeBadge status="APPROVED" />
                          <span className="font-mono text-sm font-bold">{ans.grade.score} / {ans.question?.maxScore} pts</span>
                        </div>
                        {ans.grade.feedback && <p className="text-sm text-ink/60 italic">"{ans.grade.feedback}"</p>}
                        <p className="text-xs font-mono text-ink/40 mt-1">Graded by {ans.grade.teacher?.name}</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 text-xs font-mono text-amber-700">
                        <GradeBadge status={ans.grade.status} />
                        <span className="ml-2">Grade pending director approval</span>
                      </div>
                    )
                  ) : (
                    <p className="text-xs font-mono text-ink/40 italic">Not graded yet</p>
                  )}
                  {ans?.annotations?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-rule">
                      <p className="label mb-2">Teacher Feedback ({ans.annotations.length})</p>
                      {ans.annotations.map((a: any) => (
                        <div key={a.id} className="p-2 bg-yellow-50 border-l-2 border-yellow-400 text-xs mb-1">
                          <span className="line-through text-red-600">{a.originalText}</span>
                          {' → '}
                          <span className="text-green-700 font-medium">{a.suggestedText}</span>
                          {a.comment && <p className="text-ink/50 mt-0.5">{a.comment}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}