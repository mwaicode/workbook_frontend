
// import { useState, useEffect } from 'react'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { workbookApi } from '../../api/workbooks'
// import { WorksheetTabs } from '../../components/WorksheetTabs'
// import { Modal } from '../../components/Modal'
// import type { Workbook, Worksheet } from '../../types'
// import { Plus, Pencil, Trash2, Save } from 'lucide-react'

// export const DirectorWorkbook = () => {
//   const qc = useQueryClient()
//   const [activeWorkbookId, setActiveWorkbookId] = useState<string | null>(null)
//   const [activeWorksheetId, setActiveWorksheetId] = useState<string | null>(null)
//   const [showCreateWorkbook, setShowCreateWorkbook] = useState(false)
//   const [showCreateWorksheet, setShowCreateWorksheet] = useState(false)
//   const [editingWorksheet, setEditingWorksheet] = useState<Worksheet | null>(null)
//   const [workbookForm, setWorkbookForm] = useState({ title: '', description: '' })
//   const [worksheetForm, setWorksheetForm] = useState({ title: '', body: '' })
//   const [editBody, setEditBody] = useState('')
//   const [editTitle, setEditTitle] = useState('')
//   const [isEditing, setIsEditing] = useState(false)

//   const { data: workbooks = [], isLoading } = useQuery<Workbook[]>({
//     queryKey: ['workbooks'],
//     queryFn: workbookApi.list,
//   })

//   const { data: worksheets = [] } = useQuery<Worksheet[]>({
//     queryKey: ['worksheets', activeWorkbookId],
//     queryFn: () => workbookApi.getWorksheets(activeWorkbookId!),
//     enabled: !!activeWorkbookId,
//   })

//   useEffect(() => {
//     if (workbooks.length && !activeWorkbookId) setActiveWorkbookId(workbooks[0].id)
//   }, [workbooks])

//   useEffect(() => {
//     if (worksheets.length && !activeWorksheetId) setActiveWorksheetId(worksheets[0].id)
//   }, [worksheets])

//   const activeWorkbook = workbooks.find(w => w.id === activeWorkbookId)
//   const activeWs = worksheets.find(w => w.id === activeWorksheetId)

//   const createWorkbook = useMutation({
//     mutationFn: workbookApi.create,
//     onSuccess: (wb) => {
//       qc.invalidateQueries({ queryKey: ['workbooks'] })
//       setActiveWorkbookId(wb.id)
//       setShowCreateWorkbook(false)
//       setWorkbookForm({ title: '', description: '' })
//     }
//   })

//   const createWorksheet = useMutation({
//     mutationFn: ({ id, data }: any) => workbookApi.createWorksheet(id, data),
//     onSuccess: (ws) => {
//       qc.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] })
//       setActiveWorksheetId(ws.id)
//       setShowCreateWorksheet(false)
//       setWorksheetForm({ title: '', body: '' })
//     }
//   })

//   const updateWorksheet = useMutation({
//     mutationFn: ({ id, data }: any) => workbookApi.updateWorksheet(id, data),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] })
//       setEditingWorksheet(null)
//       setIsEditing(false)
//     }
//   })

//   const deleteWorksheet = useMutation({
//     mutationFn: workbookApi.deleteWorksheet,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] })
//       setActiveWorksheetId(null)
//     }
//   })

//   const startEdit = (ws: Worksheet) => { setEditTitle(ws.title); setEditBody(ws.body); setIsEditing(true) }
//   const saveEdit = () => {
//     if (!activeWs) return
//     updateWorksheet.mutate({ id: activeWs.id, data: { title: editTitle, body: editBody } })
//   }

//   if (isLoading) return <div className="text-ink/40 font-mono text-sm py-8">Loading workbooks...</div>

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="section-title">Workbook Manager</h1>
//           <p className="text-sm text-ink/50 mt-1 font-mono">Create and edit worksheets</p>
//         </div>
//         <button onClick={() => setShowCreateWorkbook(true)} className="btn-primary flex items-center gap-2">
//           <Plus size={14} /> New Workbook
//         </button>
//       </div>

//       {workbooks.length === 0 ? (
//         <div className="card text-center py-16">
//           <p className="text-ink/40 font-mono text-sm mb-4">No workbooks yet</p>
//           <button onClick={() => setShowCreateWorkbook(true)} className="btn-primary">Create First Workbook</button>
//         </div>
//       ) : (
//         <>
//           <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
//             {workbooks.map(wb => (
//               <button key={wb.id} onClick={() => { setActiveWorkbookId(wb.id); setActiveWorksheetId(null) }}
//                 className={`px-4 py-2 text-sm font-mono border whitespace-nowrap transition-colors ${activeWorkbookId === wb.id ? 'tab-active' : 'tab-inactive'}`}>
//                 {wb.title}
//               </button>
//             ))}
//           </div>

//           {activeWorkbook && (
//             <div className="border border-rule">
//               <WorksheetTabs
//                 worksheets={worksheets}
//                 activeId={activeWorksheetId}
//                 onSelect={setActiveWorksheetId}
//                 onAdd={() => setShowCreateWorksheet(true)}
//                 canAdd
//               />
//               {activeWs ? (
//                 <div className="p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     {isEditing ? (
//                       <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
//                         className="input-field text-xl font-display font-bold max-w-md" />
//                     ) : (
//                       <h2 className="font-display text-2xl font-bold">{activeWs.title}</h2>
//                     )}
//                     <div className="flex gap-2">
//                       {isEditing ? (
//                         <button onClick={saveEdit} className="btn-primary flex items-center gap-2">
//                           <Save size={14} /> Save
//                         </button>
//                       ) : (
//                         <button onClick={() => startEdit(activeWs)} className="btn-ghost flex items-center gap-2">
//                           <Pencil size={14} /> Edit
//                         </button>
//                       )}
//                       <button onClick={() => { if (confirm('Delete this worksheet?')) deleteWorksheet.mutate(activeWs.id) }}
//                         className="btn-ghost flex items-center gap-2 text-red-700 border-red-200">
//                         <Trash2 size={14} /> Delete
//                       </button>
//                     </div>
//                   </div>

//                   {isEditing ? (
//                     <textarea value={editBody} onChange={e => setEditBody(e.target.value)}
//                       className="input-field min-h-[300px] font-mono text-sm"
//                       placeholder="Write the worksheet content here..." />
//                   ) : (
//                     <div className="bg-paper border border-rule p-5 min-h-[200px]">
//                       {activeWs.body ? (
//                         <pre className="whitespace-pre-wrap font-mono text-sm text-ink/80 leading-relaxed">{activeWs.body}</pre>
//                       ) : (
//                         <p className="text-ink/30 font-mono text-sm italic">No content yet — click Edit to add content</p>
//                       )}
//                     </div>
//                   )}

//                   <div className="mt-6 pt-4 border-t border-rule">
//                     <div className="flex items-center gap-2 mb-3">
//                       <span className="label">Questions</span>
//                       <span className="text-xs font-mono text-ink/40">({activeWs.questions?.length || 0} — created by teachers)</span>
//                     </div>
//                     {activeWs.questions?.length === 0 ? (
//                       <p className="text-ink/30 text-sm font-mono italic">No questions yet. Teachers add questions to worksheets.</p>
//                     ) : (
//                       <div className="space-y-2">
//                         {activeWs.questions?.map((q, i) => (
//                           <div key={q.id} className="bg-paper border border-rule p-3 flex items-start gap-3">
//                             <span className="font-mono text-xs text-ink/40 mt-0.5 w-6">{i + 1}.</span>
//                             <div>
//                               <p className="text-sm">{q.text}</p>
//                               <p className="text-xs font-mono text-ink/40 mt-1">by {q.createdBy.name} · max {q.maxScore} pts</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="p-8 text-center text-ink/40 font-mono text-sm">
//                   {worksheets.length === 0 ? 'No worksheets yet — click + to create one' : 'Select a worksheet tab'}
//                 </div>
//               )}
//             </div>
//           )}
//         </>
//       )}

//       {showCreateWorkbook && (
//         <Modal title="New Workbook" onClose={() => setShowCreateWorkbook(false)}>
//           <div className="space-y-4">
//             <div>
//               <label className="label block mb-1.5">Title</label>
//               <input className="input-field" value={workbookForm.title}
//                 onChange={e => setWorkbookForm(f => ({ ...f, title: e.target.value }))}
//                 placeholder="e.g. Introduction to Computer Science" />
//             </div>
//             <div>
//               <label className="label block mb-1.5">Description (optional)</label>
//               <textarea className="input-field" rows={3} value={workbookForm.description}
//                 onChange={e => setWorkbookForm(f => ({ ...f, description: e.target.value }))} />
//             </div>
//             <div className="flex gap-2 justify-end">
//               <button onClick={() => setShowCreateWorkbook(false)} className="btn-ghost">Cancel</button>
//               <button onClick={() => createWorkbook.mutate(workbookForm)} className="btn-primary"
//                 disabled={!workbookForm.title || createWorkbook.isPending}>
//                 {createWorkbook.isPending ? 'Creating...' : 'Create Workbook'}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {showCreateWorksheet && (
//         <Modal title="New Worksheet" onClose={() => setShowCreateWorksheet(false)}>
//           <div className="space-y-4">
//             <div>
//               <label className="label block mb-1.5">Title</label>
//               <input className="input-field" value={worksheetForm.title}
//                 onChange={e => setWorksheetForm(f => ({ ...f, title: e.target.value }))}
//                 placeholder="e.g. Chapter 1: Introduction" />
//             </div>
//             <div>
//               <label className="label block mb-1.5">Content (optional)</label>
//               <textarea className="input-field" rows={5} value={worksheetForm.body}
//                 onChange={e => setWorksheetForm(f => ({ ...f, body: e.target.value }))}
//                 placeholder="Write the worksheet content..." />
//             </div>
//             <div className="flex gap-2 justify-end">
//               <button onClick={() => setShowCreateWorksheet(false)} className="btn-ghost">Cancel</button>
//               <button onClick={() => createWorksheet.mutate({ id: activeWorkbookId, data: worksheetForm })}
//                 className="btn-primary" disabled={!worksheetForm.title || createWorksheet.isPending}>
//                 {createWorksheet.isPending ? 'Creating...' : 'Create Worksheet'}
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
import { WorksheetTabs } from '../../components/WorksheetTabs'
import { Modal } from '../../components/Modal'
import { useSocketEvent } from '../../hooks/useSocket'
import type { Workbook, Worksheet } from '../../types'
import { Plus, Pencil, Trash2, Save } from 'lucide-react'

export const DirectorWorkbook = () => {
  const qc = useQueryClient()
  const [activeWorkbookId, setActiveWorkbookId] = useState<string | null>(null)
  const [activeWorksheetId, setActiveWorksheetId] = useState<string | null>(null)
  const [showCreateWorkbook, setShowCreateWorkbook] = useState(false)
  const [showCreateWorksheet, setShowCreateWorksheet] = useState(false)
  const [, setEditingWorksheet] = useState<Worksheet | null>(null)
  const [workbookForm, setWorkbookForm] = useState({ title: '', description: '' })
  const [worksheetForm, setWorksheetForm] = useState({ title: '', body: '' })
  const [editBody, setEditBody] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const { data: workbooks = [], isLoading } = useQuery<Workbook[]>({
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

  // ── Sockets ──────────────────────────────────────────────────────────────
  useSocketEvent('workbook:created', () => {
    qc.invalidateQueries({ queryKey: ['workbooks'] })
  })

  useSocketEvent('worksheet:created', ({ workbookId }: { workbookId: string }) => {
    qc.invalidateQueries({ queryKey: ['worksheets', workbookId] })
    qc.invalidateQueries({ queryKey: ['workbooks'] })
  })

  useSocketEvent('question:added', () => {
    qc.invalidateQueries({ queryKey: ['worksheets'], exact: false })
  })
  // ─────────────────────────────────────────────────────────────────────────

  const activeWorkbook = workbooks.find(w => w.id === activeWorkbookId)
  const activeWs = worksheets.find(w => w.id === activeWorksheetId)

  const createWorkbook = useMutation({
    mutationFn: workbookApi.create,
    onSuccess: (wb) => {
      qc.invalidateQueries({ queryKey: ['workbooks'] })
      setActiveWorkbookId(wb.id)
      setShowCreateWorkbook(false)
      setWorkbookForm({ title: '', description: '' })
    }
  })

  const createWorksheet = useMutation({
    mutationFn: ({ id, data }: any) => workbookApi.createWorksheet(id, data),
    onSuccess: (ws) => {
      qc.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] })
      setActiveWorksheetId(ws.id)
      setShowCreateWorksheet(false)
      setWorksheetForm({ title: '', body: '' })
    }
  })

  const updateWorksheet = useMutation({
    mutationFn: ({ id, data }: any) => workbookApi.updateWorksheet(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] })
      setEditingWorksheet(null)
      setIsEditing(false)
    }
  })

  const deleteWorksheet = useMutation({
    mutationFn: workbookApi.deleteWorksheet,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['worksheets', activeWorkbookId] })
      setActiveWorksheetId(null)
    }
  })

  const startEdit = (ws: Worksheet) => { setEditTitle(ws.title); setEditBody(ws.body); setIsEditing(true) }
  const saveEdit = () => {
    if (!activeWs) return
    updateWorksheet.mutate({ id: activeWs.id, data: { title: editTitle, body: editBody } })
  }

  if (isLoading) return <div className="text-ink/40 font-mono text-sm py-8">Loading workbooks...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Workbook Manager</h1>
          <p className="text-sm text-ink/50 mt-1 font-mono">Create and edit worksheets</p>
        </div>
        <button onClick={() => setShowCreateWorkbook(true)} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> New Workbook
        </button>
      </div>

      {workbooks.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-ink/40 font-mono text-sm mb-4">No workbooks yet</p>
          <button onClick={() => setShowCreateWorkbook(true)} className="btn-primary">Create First Workbook</button>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {workbooks.map(wb => (
              <button key={wb.id} onClick={() => { setActiveWorkbookId(wb.id); setActiveWorksheetId(null) }}
                className={`px-4 py-2 text-sm font-mono border whitespace-nowrap transition-colors ${activeWorkbookId === wb.id ? 'tab-active' : 'tab-inactive'}`}>
                {wb.title}
              </button>
            ))}
          </div>

          {activeWorkbook && (
            <div className="border border-rule">
              <WorksheetTabs
                worksheets={worksheets}
                activeId={activeWorksheetId}
                onSelect={setActiveWorksheetId}
                onAdd={() => setShowCreateWorksheet(true)}
                canAdd
              />
              {activeWs ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {isEditing ? (
                      <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                        className="input-field text-xl font-display font-bold max-w-md" />
                    ) : (
                      <h2 className="font-display text-2xl font-bold">{activeWs.title}</h2>
                    )}
                    <div className="flex gap-2">
                      {isEditing ? (
                        <button onClick={saveEdit} className="btn-primary flex items-center gap-2">
                          <Save size={14} /> Save
                        </button>
                      ) : (
                        <button onClick={() => startEdit(activeWs)} className="btn-ghost flex items-center gap-2">
                          <Pencil size={14} /> Edit
                        </button>
                      )}
                      <button onClick={() => { if (confirm('Delete this worksheet?')) deleteWorksheet.mutate(activeWs.id) }}
                        className="btn-ghost flex items-center gap-2 text-red-700 border-red-200">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <textarea value={editBody} onChange={e => setEditBody(e.target.value)}
                      className="input-field min-h-[300px] font-mono text-sm"
                      placeholder="Write the worksheet content here..." />
                  ) : (
                    <div className="bg-paper border border-rule p-5 min-h-[200px]">
                      {activeWs.body ? (
                        <pre className="whitespace-pre-wrap font-mono text-sm text-ink/80 leading-relaxed">{activeWs.body}</pre>
                      ) : (
                        <p className="text-ink/30 font-mono text-sm italic">No content yet — click Edit to add content</p>
                      )}
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-rule">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="label">Questions</span>
                      <span className="text-xs font-mono text-ink/40">({activeWs.questions?.length || 0} — created by teachers)</span>
                    </div>
                    {activeWs.questions?.length === 0 ? (
                      <p className="text-ink/30 text-sm font-mono italic">No questions yet. Teachers add questions to worksheets.</p>
                    ) : (
                      <div className="space-y-2">
                        {activeWs.questions?.map((q, i) => (
                          <div key={q.id} className="bg-paper border border-rule p-3 flex items-start gap-3">
                            <span className="font-mono text-xs text-ink/40 mt-0.5 w-6">{i + 1}.</span>
                            <div>
                              <p className="text-sm">{q.text}</p>
                              <p className="text-xs font-mono text-ink/40 mt-1">by {q.createdBy.name} · max {q.maxScore} pts</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-ink/40 font-mono text-sm">
                  {worksheets.length === 0 ? 'No worksheets yet — click + to create one' : 'Select a worksheet tab'}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {showCreateWorkbook && (
        <Modal title="New Workbook" onClose={() => setShowCreateWorkbook(false)}>
          <div className="space-y-4">
            <div>
              <label className="label block mb-1.5">Title</label>
              <input className="input-field" value={workbookForm.title}
                onChange={e => setWorkbookForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Introduction to Computer Science" />
            </div>
            <div>
              <label className="label block mb-1.5">Description (optional)</label>
              <textarea className="input-field" rows={3} value={workbookForm.description}
                onChange={e => setWorkbookForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowCreateWorkbook(false)} className="btn-ghost">Cancel</button>
              <button onClick={() => createWorkbook.mutate(workbookForm)} className="btn-primary"
                disabled={!workbookForm.title || createWorkbook.isPending}>
                {createWorkbook.isPending ? 'Creating...' : 'Create Workbook'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showCreateWorksheet && (
        <Modal title="New Worksheet" onClose={() => setShowCreateWorksheet(false)}>
          <div className="space-y-4">
            <div>
              <label className="label block mb-1.5">Title</label>
              <input className="input-field" value={worksheetForm.title}
                onChange={e => setWorksheetForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Chapter 1: Introduction" />
            </div>
            <div>
              <label className="label block mb-1.5">Content (optional)</label>
              <textarea className="input-field" rows={5} value={worksheetForm.body}
                onChange={e => setWorksheetForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Write the worksheet content..." />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowCreateWorksheet(false)} className="btn-ghost">Cancel</button>
              <button onClick={() => createWorksheet.mutate({ id: activeWorkbookId, data: worksheetForm })}
                className="btn-primary" disabled={!worksheetForm.title || createWorksheet.isPending}>
                {createWorksheet.isPending ? 'Creating...' : 'Create Worksheet'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}