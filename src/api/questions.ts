import api from './client'
import type { Question } from '../types';

export const questionApi = {
  list: (worksheetId: string) =>
    api.get<Question[]>(`/worksheets/${worksheetId}/questions`).then(r => r.data),
  create: (worksheetId: string, data: { text: string; maxScore?: number }) =>
    api.post<Question>(`/worksheets/${worksheetId}/questions`, data).then(r => r.data),
  update: (id: string, data: { text?: string; maxScore?: number }) =>
    api.put<Question>(`/questions/${id}`, data).then(r => r.data),
  delete: (id: string) =>
    api.delete(`/questions/${id}`).then(r => r.data),
}