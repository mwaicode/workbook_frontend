import api from './client'
import type { Workbook, Worksheet } from '../types';

export const workbookApi = {
  list: () => api.get<Workbook[]>('/workbooks').then(r => r.data),
  create: (data: { title: string; description?: string }) =>
    api.post<Workbook>('/workbooks', data).then(r => r.data),
  getWorksheets: (workbookId: string) =>
    api.get<Worksheet[]>(`/workbooks/${workbookId}/worksheets`).then(r => r.data),
  createWorksheet: (workbookId: string, data: { title: string; body?: string }) =>
    api.post<Worksheet>(`/workbooks/${workbookId}/worksheets`, data).then(r => r.data),
  updateWorksheet: (id: string, data: { title?: string; body?: string }) =>
    api.put<Worksheet>(`/worksheets/${id}`, data).then(r => r.data),
  deleteWorksheet: (id: string) =>
    api.delete(`/worksheets/${id}`).then(r => r.data),
}