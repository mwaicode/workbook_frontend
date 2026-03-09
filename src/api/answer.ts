import api from './client'
import type { Answer, Grade } from '../types';

export const answerApi = {
  getMyAnswer: (questionId: string) =>
    api.get<Answer | null>(`/questions/${questionId}/answers/mine`).then(r => r.data),
  save: (questionId: string, data: { content: string; submit?: boolean }) =>
    api.post<Answer>(`/questions/${questionId}/answers`, data).then(r => r.data),
  get: (id: string) =>
    api.get<Answer>(`/answers/${id}`).then(r => r.data),
  getByWorksheet: (worksheetId: string) =>
    api.get(`/worksheets/${worksheetId}/answers`).then(r => r.data),
  addAnnotation: (answerId: string, data: { originalText: string; suggestedText: string; comment?: string; startOffset: number; endOffset: number }) =>
    api.post(`/answers/${answerId}/annotations`, data).then(r => r.data),
  deleteAnnotation: (answerId: string, annotationId: string) =>
    api.delete(`/answers/${answerId}/annotations/${annotationId}`).then(r => r.data),
  submitGrade: (answerId: string, data: { score: number; feedback?: string }) =>
    api.post<Grade>(`/answers/${answerId}/grade`, data).then(r => r.data),
  getPendingGrades: () =>
    api.get<Grade[]>('/grades/pending').then(r => r.data),
  reviewGrade: (gradeId: string, data: { action: 'approve' | 'reject'; directorComment?: string }) =>
    api.put<Grade>(`/grades/${gradeId}/review`, data).then(r => r.data),
}