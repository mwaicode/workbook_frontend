// import { useState } from 'react'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { workbookApi } from '../../api/workbooks'
// import { questionApi } from '../../api/questions'
// import { WorksheetTabs } from '../../components/WorksheetTabs'
// import { Modal } from '../../components/Modal'
// import { Worksheet, Question } from '../../types'
// import { Plus, Pencil, Trash2 } from 'lucide-react'
// import { useAuth } from '../../context/AuthContext'

// export const TeacherWorkbook = () => {
//   const { user } = useAuth()
//   const qc = useQueryClient()
//   const [activeWorkbookId, setActiveWorkbookId] = useState<string | null>(null)
//   const [activeWorksheetId, setActiveWorksheetId] = useState<string | null>(null)
//   const [showAddQ, setShowAddQ] = useState(false)
//   const [editingQ, setEditingQ] = useState<Question | null>(null)
//   const [qForm, setQForm] = useState({ text: '', maxScore: 100 })

//   const { data: workbooks = [] } = useQuery({
//     queryKey: ['workbooks'],
//     queryFn: workbookApi.list,
//     onSuccess: (data: any[]) => { if (data.length && !activeWorkbookId) setActiveWorkbookId(data[0].id) }
//   } as any)

//   const { data: worksheets = [] } = useQuery({
//     queryKey: ['worksheets', activeWorkbookId],
//     queryFn: () => workbookApi.getWorksheets(activeWorkbookId!),
//     enabled: !!activeWorkbookId,
//     onSuccess: (data: any[]) => { if (data.length && !activeWorksheetId) setActiveWorksheetId(data[0].id) }
//   } as any)

//   const activeWs: Worksheet | undefined = worksheets.find((w: any) => w.id === activeWorksheetId)

//   const createQ = useMutation({
//     mutationFn: ({ wsId, data }: any) => questionApi.create(wsId, data),
//     onSuccess: () => { qc.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] }); setShowAddQ(false); setQForm({ text: '', maxScore: 100 }) }
//   })

//   const updateQ = useMutation({
//     mutationFn: ({ id, data }: any) => questionApi.update(id, data),
//     onSuccess: () => { qc.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] }); setEditingQ(null) }
//   })

//   const deleteQ = useMutation({
//     mutationFn: questionApi.delete,
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] })
//   })

//   return (
//     <div>
//       <div className="mb-6">
//         <h1 className="section-title">Workbook</h1>
//         <p className="text-sm text-ink/50 mt-1 font-mono">Add questions to worksheets</p>
//       </div>

//       {workbooks.length > 0 && (
//         <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
//           {workbooks.map((wb: any) => (
//             <button key={wb.id} onClick={() => { setActiveWorkbookId(wb.id); setActiveWorksheetId(null) }}
//               className={`px-4 py-2 text-sm font-mono border whitespace-nowrap transition-colors ${activeWorkbookId === wb.id ? 'tab-active' : 'tab-inactive'}`}>
//               {wb.title}
//             </button>
//           ))}
//         </div>
//       )}

//       {activeWorkbookId && (
//         <div className="border border-rule">
//           <WorksheetTabs worksheets={worksheets} activeId={activeWorksheetId} onSelect={setActiveWorksheetId} />

//           {activeWs ? (
//             <div className="p-6">
//               <h2 className="font-display text-2xl font-bold mb-4">{activeWs.title}</h2>
//               {activeWs.body && (
//                 <div className="bg-paper border border-rule p-4 mb-6">
//                   <pre className="whitespace-pre-wrap font-mono text-sm text-ink/70 leading-relaxed">{activeWs.body}</pre>
//                 </div>
//               )}

//               <div className="flex items-center justify-between mb-4">
//                 <span className="label">Questions ({activeWs.questions?.length || 0})</span>
//                 <button onClick={() => setShowAddQ(true)} className="btn-primary flex items-center gap-2 text-xs">
//                   <Plus size={12} /> Add Question
//                 </button>
//               </div>

//               <div className="space-y-3">
//                 {activeWs.questions?.length === 0 && (
//                   <div className="bg-paper border border-dashed border-rule p-8 text-center">
//                     <p className="text-ink/30 font-mono text-sm">No questions yet — add the first one</p>
//                   </div>
//                 )}
//                 {activeWs.questions?.map((q, i) => (
//                   <div key={q.id} className="bg-paper border border-rule p-4">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex gap-3 flex-1">
//                         <span className="font-mono text-sm text-ink/40 mt-0.5 w-5 flex-shrink-0">{i + 1}.</span>
//                         <div>
//                           <p className="text-sm leading-relaxed">{q.text}</p>
//                           <div className="flex items-center gap-3 mt-2">
//                             <span className="text-xs font-mono text-ink/40">Max score: {q.maxScore} pts</span>
//                             {q.createdBy.id === user?.id && (
//                               <span className="text-xs font-mono text-teacher/70">your question</span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                       {q.createdBy.id === user?.id && (
//                         <div className="flex gap-1">
//                           <button onClick={() => { setEditingQ(q); setQForm({ text: q.text, maxScore: q.maxScore }) }}
//                             className="p-1.5 text-ink/40 hover:text-ink border border-transparent hover:border-rule transition-colors">
//                             <Pencil size={13} />
//                           </button>
//                           <button onClick={() => { if (confirm('Delete this question?')) deleteQ.mutate(q.id) }}
//                             className="p-1.5 text-ink/40 hover:text-red-700 border border-transparent hover:border-red-200 transition-colors">
//                             <Trash2 size={13} />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="p-8 text-center text-ink/40 font-mono text-sm">Select a worksheet</div>
//           )}
//         </div>
//       )}

//       {showAddQ && (
//         <Modal title="Add Question" onClose={() => setShowAddQ(false)}>
//           <div className="space-y-4">
//             <div>
//               <label className="label block mb-1.5">Question Text</label>
//               <textarea className="input-field" rows={4} value={qForm.text}
//                 onChange={e => setQForm(f => ({ ...f, text: e.target.value }))}
//                 placeholder="Write your question here..." />
//             </div>
//             <div>
//               <label className="label block mb-1.5">Max Score</label>
//               <input className="input-field" type="number" value={qForm.maxScore}
//                 onChange={e => setQForm(f => ({ ...f, maxScore: Number(e.target.value) }))} min={1} />
//             </div>
//             <div className="flex gap-2 justify-end">
//               <button onClick={() => setShowAddQ(false)} className="btn-ghost">Cancel</button>
//               <button onClick={() => createQ.mutate({ wsId: activeWorksheetId, data: qForm })}
//                 disabled={!qForm.text || createQ.isPending} className="btn-primary">
//                 {createQ.isPending ? 'Adding...' : 'Add Question'}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {editingQ && (
//         <Modal title="Edit Question" onClose={() => setEditingQ(null)}>
//           <div className="space-y-4">
//             <div>
//               <label className="label block mb-1.5">Question Text</label>
//               <textarea className="input-field" rows={4} value={qForm.text}
//                 onChange={e => setQForm(f => ({ ...f, text: e.target.value }))} />
//             </div>
//             <div>
//               <label className="label block mb-1.5">Max Score</label>
//               <input className="input-field" type="number" value={qForm.maxScore}
//                 onChange={e => setQForm(f => ({ ...f, maxScore: Number(e.target.value) }))} />
//             </div>
//             <div className="flex gap-2 justify-end">
//               <button onClick={() => setEditingQ(null)} className="btn-ghost">Cancel</button>
//               <button onClick={() => updateQ.mutate({ id: editingQ.id, data: qForm })}
//                 disabled={!qForm.text || updateQ.isPending} className="btn-primary">
//                 {updateQ.isPending ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   )
// }





























import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workbookApi } from '../../api/workbooks'
import { questionApi } from '../../api/questions'
import { WorksheetTabs } from '../../components/WorksheetTabs'
import { Modal } from '../../components/Modal'
import type { Workbook, Worksheet, Question } from '../../types'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const TeacherWorkbook = () => {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [activeWorkbookId, setActiveWorkbookId] = useState<string | null>(null)
  const [activeWorksheetId, setActiveWorksheetId] = useState<string | null>(null)
  const [showAddQ, setShowAddQ] = useState(false)
  const [editingQ, setEditingQ] = useState<Question | null>(null)
  const [qForm, setQForm] = useState({ text: '', maxScore: 100 })

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

  const createQ = useMutation({
    mutationFn: ({ wsId, data }: any) => questionApi.create(wsId, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] }); setShowAddQ(false); setQForm({ text: '', maxScore: 100 }) }
  })

  const updateQ = useMutation({
    mutationFn: ({ id, data }: any) => questionApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] }); setEditingQ(null) }
  })

  const deleteQ = useMutation({
    mutationFn: questionApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] })
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">Workbook</h1>
        <p className="text-sm text-ink/50 mt-1 font-mono">Add questions to worksheets</p>
      </div>

      {workbooks.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {workbooks.map(wb => (
            <button key={wb.id} onClick={() => { setActiveWorkbookId(wb.id); setActiveWorksheetId(null) }}
              className={`px-4 py-2 text-sm font-mono border whitespace-nowrap transition-colors ${activeWorkbookId === wb.id ? 'tab-active' : 'tab-inactive'}`}>
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
                <div className="bg-paper border border-rule p-4 mb-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-ink/70 leading-relaxed">{activeWs.body}</pre>
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <span className="label">Questions ({activeWs.questions?.length || 0})</span>
                <button onClick={() => setShowAddQ(true)} className="btn-primary flex items-center gap-2 text-xs">
                  <Plus size={12} /> Add Question
                </button>
              </div>
              <div className="space-y-3">
                {activeWs.questions?.length === 0 && (
                  <div className="bg-paper border border-dashed border-rule p-8 text-center">
                    <p className="text-ink/30 font-mono text-sm">No questions yet — add the first one</p>
                  </div>
                )}
                {activeWs.questions?.map((q, i) => (
                  <div key={q.id} className="bg-paper border border-rule p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 flex-1">
                        <span className="font-mono text-sm text-ink/40 mt-0.5 w-5 flex-shrink-0">{i + 1}.</span>
                        <div>
                          <p className="text-sm leading-relaxed">{q.text}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs font-mono text-ink/40">Max score: {q.maxScore} pts</span>
                            {q.createdBy.id === user?.id && (
                              <span className="text-xs font-mono text-teacher/70">your question</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {q.createdBy.id === user?.id && (
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingQ(q); setQForm({ text: q.text, maxScore: q.maxScore }) }}
                            className="p-1.5 text-ink/40 hover:text-ink border border-transparent hover:border-rule transition-colors">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => { if (confirm('Delete this question?')) deleteQ.mutate(q.id) }}
                            className="p-1.5 text-ink/40 hover:text-red-700 border border-transparent hover:border-red-200 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-ink/40 font-mono text-sm">Select a worksheet</div>
          )}
        </div>
      )}

      {showAddQ && (
        <Modal title="Add Question" onClose={() => setShowAddQ(false)}>
          <div className="space-y-4">
            <div>
              <label className="label block mb-1.5">Question Text</label>
              <textarea className="input-field" rows={4} value={qForm.text}
                onChange={e => setQForm(f => ({ ...f, text: e.target.value }))}
                placeholder="Write your question here..." />
            </div>
            <div>
              <label className="label block mb-1.5">Max Score</label>
              <input className="input-field" type="number" value={qForm.maxScore}
                onChange={e => setQForm(f => ({ ...f, maxScore: Number(e.target.value) }))} min={1} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAddQ(false)} className="btn-ghost">Cancel</button>
              <button onClick={() => createQ.mutate({ wsId: activeWorksheetId, data: qForm })}
                disabled={!qForm.text || createQ.isPending} className="btn-primary">
                {createQ.isPending ? 'Adding...' : 'Add Question'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {editingQ && (
        <Modal title="Edit Question" onClose={() => setEditingQ(null)}>
          <div className="space-y-4">
            <div>
              <label className="label block mb-1.5">Question Text</label>
              <textarea className="input-field" rows={4} value={qForm.text}
                onChange={e => setQForm(f => ({ ...f, text: e.target.value }))} />
            </div>
            <div>
              <label className="label block mb-1.5">Max Score</label>
              <input className="input-field" type="number" value={qForm.maxScore}
                onChange={e => setQForm(f => ({ ...f, maxScore: Number(e.target.value) }))} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditingQ(null)} className="btn-ghost">Cancel</button>
              <button onClick={() => updateQ.mutate({ id: editingQ.id, data: qForm })}
                disabled={!qForm.text || updateQ.isPending} className="btn-primary">
                {updateQ.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}