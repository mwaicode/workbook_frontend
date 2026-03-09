export type Role = 'DIRECTOR' | 'TEACHER' | 'STUDENT'
export type GradeStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type AnswerStatus = 'DRAFT' | 'SUBMITTED' | 'GRADED'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  createdAt: string
}

export interface WorksheetSummary {
  id: string
  title: string
  orderIndex: number
}

export interface Workbook {
  id: string
  title: string
  description?: string
  worksheets: WorksheetSummary[]
  createdAt: string
}

export interface Question {
  id: string
  worksheetId: string
  text: string
  orderIndex: number
  maxScore: number
  createdBy: Pick<User, 'id' | 'name'>
  createdAt: string
}

export interface Worksheet {
  id: string
  workbookId: string
  title: string
  body: string
  orderIndex: number
  createdBy: Pick<User, 'id' | 'name' | 'role'>
  questions: Question[]
  createdAt: string
  updatedAt: string
}

export interface AnswerAnnotation {
  id: string
  answerId: string
  teacher: Pick<User, 'id' | 'name'>
  originalText: string
  suggestedText: string
  comment?: string
  startOffset: number
  endOffset: number
  createdAt: string
}

export interface Answer {
  id: string
  questionId: string
  student: Pick<User, 'id' | 'name' | 'email'>
  content: string
  status: AnswerStatus
  submittedAt?: string
  createdAt: string
  updatedAt: string
  annotations: AnswerAnnotation[]
  grade?: Grade
  question?: Question
}

export interface Grade {
  id: string
  answerId: string
  teacher: Pick<User, 'id' | 'name'>
  score: number
  feedback?: string
  status: GradeStatus
  director?: Pick<User, 'id' | 'name'>
  directorComment?: string
  reviewedAt?: string
  createdAt: string
  answer?: Answer
}