
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workbookApi } from '../../api/workbooks'
import { answerApi } from '../../api/answer'
import { WorksheetTabs } from '../../components/WorksheetTabs'
import { AnswerBadge, GradeBadge } from '../../components/GradeBadge'
import { Modal } from '../../components/Modal'
import { socket } from '../../lib/socket'
import type { Workbook, Worksheet, Answer } from '../../types'
import { MessageSquare, Star, Trash2 } from 'lucide-react'

export const TeacherGrading = () => {
  const qc = useQueryClient()
  const [activeWorkbookId, setActiveWorkbookId] = useState<string | null>(null)
  const [activeWorksheetId, setActiveWorksheetId] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [gradeForm, setGradeForm] = useState({ score: 0, feedback: '' })
  const [annotForm, setAnnotForm] = useState({ originalText: '', suggestedText: '', comment: '', startOffset: 0, endOffset: 0 })
  const [showAnnotModal, setShowAnnotModal] = useState(false)
  const [showGradeModal, setShowGradeModal] = useState(false)

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

  // WebSocket — refresh when grades or annotations change
  useEffect(() => {
    socket.on('grade:updated', ({ answerId }: { answerId: string }) => {
      console.log('📩 Received grade:updated for answer:', answerId)
      qc.invalidateQueries({ queryKey: ['answers', activeWorksheetId] })
      qc.invalidateQueries({ queryKey: ['answer', answerId] })
    })
    socket.on('annotation:added', ({ answerId }: { answerId: string }) => {
      console.log('📩 Received annotation:added for answer:', answerId)
      qc.invalidateQueries({ queryKey: ['answer', answerId] })
      qc.invalidateQueries({ queryKey: ['answers', activeWorksheetId] })
    })
    return () => {
      socket.off('grade:updated')
      socket.off('annotation:added')
    }
  }, [activeWorksheetId])

  const { data: questionsWithAnswers = [] } = useQuery({
    queryKey: ['answers', activeWorksheetId],
    queryFn: () => answerApi.getByWorksheet(activeWorksheetId!),
    enabled: !!activeWorksheetId,
  })

  const { data: fullAnswer } = useQuery<Answer>({
    queryKey: ['answer', selectedAnswer?.id],
    queryFn: () => answerApi.get(selectedAnswer!.id),
    enabled: !!selectedAnswer?.id,
  })

  const addAnnotation = useMutation({
    mutationFn: ({ answerId, data }: any) => answerApi.addAnnotation(answerId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['answer', variables.answerId] })
      qc.invalidateQueries({ queryKey: ['answers', activeWorksheetId] })
      setShowAnnotModal(false)
      setAnnotForm({ originalText: '', suggestedText: '', comment: '', startOffset: 0, endOffset: 0 })
    }
  })

  const deleteAnnotation = useMutation({
    mutationFn: ({ answerId, annotId }: any) => answerApi.deleteAnnotation(answerId, annotId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['answer', variables.answerId] })
      qc.invalidateQueries({ queryKey: ['answers', activeWorksheetId] })
    }
  })

  const submitGrade = useMutation({
    mutationFn: ({ answerId, data }: any) => answerApi.submitGrade(answerId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['answers', activeWorksheetId] })
      qc.invalidateQueries({ queryKey: ['answer', variables.answerId] })
      setShowGradeModal(false)
    }
  })

  const displayAnswer = fullAnswer || selectedAnswer
  const allAnswers: Answer[] = (questionsWithAnswers as any[]).flatMap((q: any) =>
    q.answers.map((a: any) => ({ ...a, question: { id: q.id, text: q.text, maxScore: q.maxScore } }))
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Student Grading</h1>
        <p className="text-sm text-ink/50 mt-1 font-mono">Review answers, add annotations, submit grades</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-rule">
          <WorksheetTabs worksheets={worksheets} activeId={activeWorksheetId}
            onSelect={id => { setActiveWorksheetId(id); setSelectedAnswer(null) }} />
          <div className="p-4">
            {allAnswers.length === 0 ? (
              <p className="text-ink/40 font-mono text-sm text-center py-8">No submitted answers yet</p>
            ) : (
              <div className="space-y-2">
                {allAnswers.map(ans => (
                  <button key={ans.id} onClick={() => setSelectedAnswer(ans)}
                    className={`w-full text-left p-3 border transition-colors ${selectedAnswer?.id === ans.id ? 'border-ink bg-ink text-paper' : 'border-rule bg-paper hover:bg-cream'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${selectedAnswer?.id === ans.id ? 'text-paper' : ''}`}>{ans.student.name}</span>
                      <AnswerBadge status={ans.status} />
                    </div>
                    <p className={`text-xs font-mono truncate ${selectedAnswer?.id === ans.id ? 'text-paper/70' : 'text-ink/50'}`}>
                      {(ans as any).question?.text}
                    </p>
                    {ans.grade && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-mono ${selectedAnswer?.id === ans.id ? 'text-paper/70' : 'text-ink/50'}`}>
                          Score: {ans.grade.score}
                        </span>
                        <GradeBadge status={ans.grade.status} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border border-rule">
          {displayAnswer ? (
            <div className="p-5">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold">{(displayAnswer as any).student?.name}</h3>
                  <AnswerBadge status={displayAnswer.status} />
                </div>
                <p className="text-sm text-ink/60 mb-3">{(displayAnswer as any).question?.text}</p>
                <div className="bg-paper border border-rule p-4 min-h-[120px] font-mono text-sm">
                  {displayAnswer.content || <em className="text-ink/30">Empty answer</em>}
                  {(displayAnswer as any).annotations?.map((a: any) => (
                    <div key={a.id} className="mt-2 p-2 bg-yellow-50 border-l-2 border-yellow-400 text-xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="line-through text-red-600">{a.originalText}</span>
                          {' → '}
                          <span className="text-green-700 font-medium">{a.suggestedText}</span>
                          {a.comment && <p className="text-ink/50 mt-0.5">{a.comment}</p>}
                        </div>
                        <button onClick={() => deleteAnnotation.mutate({ answerId: displayAnswer.id, annotId: a.id })}
                          className="text-ink/30 hover:text-red-700 ml-2"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button onClick={() => setShowAnnotModal(true)} className="btn-ghost flex items-center gap-1.5 text-xs">
                  <MessageSquare size={12} /> Add Annotation
                </button>
                <button onClick={() => { setGradeForm({ score: displayAnswer.grade?.score || 0, feedback: displayAnswer.grade?.feedback || '' }); setShowGradeModal(true) }}
                  className="btn-primary flex items-center gap-1.5 text-xs">
                  <Star size={12} /> {displayAnswer.grade ? 'Update Grade' : 'Submit Grade'}
                </button>
              </div>

              {displayAnswer.grade && (
                <div className="bg-cream border border-rule p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="label">Grade</span>
                    <GradeBadge status={displayAnswer.grade.status} />
                  </div>
                  <p className="font-mono text-sm"><strong>{displayAnswer.grade.score}</strong> / {(displayAnswer as any).question?.maxScore} pts</p>
                  {displayAnswer.grade.feedback && <p className="text-sm text-ink/60 mt-1 italic">"{displayAnswer.grade.feedback}"</p>}
                  {displayAnswer.grade.status === 'REJECTED' && displayAnswer.grade.directorComment && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 text-xs text-red-700">
                      Director: {displayAnswer.grade.directorComment}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-ink/40 font-mono text-sm">Select an answer to review</div>
          )}
        </div>
      </div>

      {showAnnotModal && displayAnswer && (
        <Modal title="Add Annotation" onClose={() => setShowAnnotModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="label block mb-1.5">Original Text</label>
              <input className="input-field" value={annotForm.originalText}
                onChange={e => setAnnotForm(f => ({ ...f, originalText: e.target.value }))} />
            </div>
            <div>
              <label className="label block mb-1.5">Suggested Correction</label>
              <input className="input-field" value={annotForm.suggestedText}
                onChange={e => setAnnotForm(f => ({ ...f, suggestedText: e.target.value }))} />
            </div>
            <div>
              <label className="label block mb-1.5">Comment (optional)</label>
              <input className="input-field" value={annotForm.comment}
                onChange={e => setAnnotForm(f => ({ ...f, comment: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label block mb-1.5">Start Offset</label>
                <input className="input-field" type="number" value={annotForm.startOffset}
                  onChange={e => setAnnotForm(f => ({ ...f, startOffset: Number(e.target.value) }))} min={0} />
              </div>
              <div>
                <label className="label block mb-1.5">End Offset</label>
                <input className="input-field" type="number" value={annotForm.endOffset}
                  onChange={e => setAnnotForm(f => ({ ...f, endOffset: Number(e.target.value) }))} min={0} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAnnotModal(false)} className="btn-ghost">Cancel</button>
              <button onClick={() => addAnnotation.mutate({ answerId: displayAnswer.id, data: annotForm })}
                disabled={!annotForm.originalText || !annotForm.suggestedText || addAnnotation.isPending}
                className="btn-primary">Add Annotation</button>
            </div>
          </div>
        </Modal>
      )}

      {showGradeModal && displayAnswer && (
        <Modal title="Submit Grade" onClose={() => setShowGradeModal(false)}>
          <div className="space-y-4">
            <div className="bg-paper border border-rule p-3 text-sm">
              <p className="font-medium">{(displayAnswer as any).question?.text}</p>
              <p className="text-ink/50 font-mono text-xs mt-1">Max score: {(displayAnswer as any).question?.maxScore} pts</p>
            </div>
            <div>
              <label className="label block mb-1.5">Score</label>
              <input className="input-field" type="number" value={gradeForm.score}
                onChange={e => setGradeForm(f => ({ ...f, score: Number(e.target.value) }))}
                min={0} max={(displayAnswer as any).question?.maxScore} />
            </div>
            <div>
              <label className="label block mb-1.5">Feedback (optional)</label>
              <textarea className="input-field" rows={3} value={gradeForm.feedback}
                onChange={e => setGradeForm(f => ({ ...f, feedback: e.target.value }))} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowGradeModal(false)} className="btn-ghost">Cancel</button>
              <button onClick={() => submitGrade.mutate({ answerId: displayAnswer.id, data: gradeForm })}
                disabled={submitGrade.isPending} className="btn-primary">
                {submitGrade.isPending ? 'Submitting...' : 'Submit Grade'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}