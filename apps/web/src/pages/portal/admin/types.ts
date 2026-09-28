export type AdminSection =
  | 'dashboard'
  | 'students'
  | 'parents'
  | 'teachers'
  | 'classes'
  | 'sections'
  | 'subjects'
  | 'attendance'
  | 'exams'
  | 'results'
  | 'homework'
  | 'timetable'
  | 'admissions'
  | 'notices'
  | 'events'
  | 'gallery'
  | 'documents'
  | 'fees'
  | 'users'
  | 'settings'
  | 'audit-logs';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
