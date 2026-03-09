import type { GradeStatus, AnswerStatus } from '../types'

export const GradeBadge = ({ status }: { status: GradeStatus }) => {
  const cls = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected' }
  return <span className={cls[status]}>{status}</span>
}

export const AnswerBadge = ({ status }: { status: AnswerStatus }) => {
  const cls = { DRAFT: 'badge-draft', SUBMITTED: 'badge-submitted', GRADED: 'badge-graded' }
  return <span className={cls[status]}>{status}</span>
}