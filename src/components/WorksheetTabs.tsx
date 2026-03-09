import type { Worksheet } from '../types'
import { Plus } from 'lucide-react'

interface Props {
  worksheets: Worksheet[]
  activeId: string | null
  onSelect: (id: string) => void
  onAdd?: () => void
  canAdd?: boolean
}

export const WorksheetTabs = ({ worksheets, activeId, onSelect, onAdd, canAdd }: Props) => (
  <div className="flex items-center gap-0 border-b border-rule overflow-x-auto">
    {worksheets.map((ws) => (
      <button
        key={ws.id}
        onClick={() => onSelect(ws.id)}
        className={`px-4 py-2.5 text-sm font-mono border-r border-rule whitespace-nowrap transition-colors ${
          activeId === ws.id ? 'bg-ink text-paper' : 'bg-paper text-ink/60 hover:bg-cream hover:text-ink'
        }`}
      >
        {ws.title}
      </button>
    ))}
    {canAdd && (
      <button
        onClick={onAdd}
        className="px-3 py-2.5 text-ink/40 hover:text-ink hover:bg-cream transition-colors"
        title="Add Worksheet"
      >
        <Plus size={16} />
      </button>
    )}
  </div>
)