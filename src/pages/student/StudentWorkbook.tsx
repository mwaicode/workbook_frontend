import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workbookApi } from '../../api/workbooks'
import { answerApi } from '../../api/answer'
import { WorksheetTabs } from '../../components/WorksheetTabs'
import { AnswerBadge } from '../../components/GradeBadge'
import { useSocketEvent } from '../../hooks/useSocket'   // ← your hook
import type { Workbook, Worksheet, Answer } from '../../types'
import { Save, Send } from 'lucide-react'

const QuestionBlock = ({ question }: { question: any }) => {
  const qc = useQueryClient()
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(false)

  const { data: answer, isLoading } = useQuery<Answer | null>({
    queryKey: ['myAnswer', question.id],
    queryFn: () => answerApi.getMyAnswer(question.id),
  })

  useEffect(() => {
    if (answer) setContent(answer.content)
  }, [answer])

  const save = useMutation({
    mutationFn: (submit: boolean) => answerApi.save(question.id, { content, submit }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myAnswer', question.id] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  })

  // Refetch this answer when teacher annotates it
  useSocketEvent('annotation:added', useCallback(({ answerId }: { answerId: string }) => {
    if (answer?.id === answerId) {
      qc.invalidateQueries({ queryKey: ['myAnswer', question.id] })
    }
  }, [answer?.id, question.id, qc]))

  // Refetch when grade is reviewed (approved/rejected) — student sees updated status
  useSocketEvent('grade:updated', useCallback(({ answerId }: { answerId: string }) => {
    if (answer?.id === answerId) {
      qc.invalidateQueries({ queryKey: ['myAnswer', question.id] })
    }
  }, [answer?.id, question.id, qc]))

  const isSubmitted = answer?.status === 'SUBMITTED' || answer?.status === 'GRADED'

  if (isLoading) return <div className="h-20 bg-paper border border-rule animate-pulse" />

  return (
    <div className="bg-paper border border-rule p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm font-medium leading-relaxed">{question.text}</p>
        <div className="flex items-center gap-2 flex-shrink-0">
          {answer && <AnswerBadge status={answer.status} />}
          <span className="text-xs font-mono text-ink/40">{question.maxScore} pts</span>
        </div>
      </div>

      {isSubmitted ? (
        <div>
          <div className="bg-cream border border-rule p-4 font-mono text-sm text-ink/70 min-h-[80px] whitespace-pre-wrap">
            {content || <em className="text-ink/30">Empty answer</em>}
          </div>
          {answer?.annotations && answer.annotations.length > 0 && (
            <div className="mt-3">
              <p className="label mb-2">Teacher Annotations</p>
              {answer.annotations.map(a => (
                <div key={a.id} className="p-2 bg-yellow-50 border-l-2 border-yellow-400 text-xs mb-1">
                  <span className="line-through text-red-600">{a.originalText}</span>
                  {' → '}
                  <span className="text-green-700 font-medium">{a.suggestedText}</span>
                  {a.comment && <p className="text-ink/50 mt-0.5">{a.comment}</p>}
                  <p className="text-ink/40 mt-0.5">— {a.teacher.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <textarea value={content} onChange={e => setContent(e.target.value)}
            className="input-field font-mono text-sm min-h-[120px] resize-y"
            placeholder="Write your answer here..." />
          <div className="flex gap-2 mt-2">
            <button onClick={() => save.mutate(false)} disabled={save.isPending}
              className="btn-ghost flex items-center gap-1.5 text-xs">
              <Save size={12} /> {saved ? 'Saved!' : 'Save Draft'}
            </button>
            <button onClick={() => { if (confirm('Submit this answer? You cannot edit it after submission.')) save.mutate(true) }}
              disabled={!content.trim() || save.isPending}
              className="btn-primary flex items-center gap-1.5 text-xs">
              <Send size={12} /> Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export const StudentWorkbook = () => {
  const [activeWorkbookId, setActiveWorkbookId] = useState<string | null>(null)
  const [activeWorksheetId, setActiveWorksheetId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: workbooks = [] } = useQuery<Workbook[]>({
    queryKey: ['workbooks'],
    queryFn: workbookApi.list,
  })

  const { data: worksheets = [] } = useQuery<Worksheet[]>({
    queryKey: ['worksheets', activeWorkbookId],
    queryFn: () => workbookApi.getWorksheets(activeWorkbookId!),
    enabled: !!activeWorkbookId,
  })

  // New question added by teacher → refresh worksheet
  useSocketEvent('question:added', useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] })
  }, [activeWorkbookId, queryClient]))

  useEffect(() => {
    if (workbooks.length && !activeWorkbookId) setActiveWorkbookId(workbooks[0].id)
  }, [workbooks])

  useEffect(() => {
    if (worksheets.length && !activeWorksheetId) setActiveWorksheetId(worksheets[0].id)
  }, [worksheets])

  const activeWs = worksheets.find(w => w.id === activeWorksheetId)

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">My Workbook</h1>
        <p className="text-sm text-ink/50 mt-1 font-mono">Answer questions and submit your work</p>
      </div>

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

      {activeWorkbookId && (
        <div className="border border-rule">
          <WorksheetTabs worksheets={worksheets} activeId={activeWorksheetId} onSelect={setActiveWorksheetId} />
          {activeWs ? (
            <div className="p-6">
              <h2 className="font-display text-2xl font-bold mb-4">{activeWs.title}</h2>
              {activeWs.body && (
                <div className="bg-paper border border-rule p-5 mb-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-ink/70 leading-relaxed">{activeWs.body}</pre>
                </div>
              )}
              {activeWs.questions?.length === 0 ? (
                <p className="text-ink/40 font-mono text-sm text-center py-8">No questions yet</p>
              ) : (
                <div className="space-y-4">
                  <p className="label">Questions ({activeWs.questions?.length})</p>
                  {activeWs.questions?.map(q => (
                    <QuestionBlock key={q.id} question={q} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-ink/40 font-mono text-sm">Select a worksheet</div>
          )}
        </div>
      )}
    </div>
  )
}