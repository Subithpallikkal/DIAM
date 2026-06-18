import type { TaskStatus } from './document'

export type { TaskStatus }

export interface TaskListItem {
  id: number
  engagementId: number
  engagementTitle: string
  title: string
  description: string | null
  status: TaskStatus
  assigneeName: string | null
  createdAt: string
}

export interface TaskComment {
  id: number
  authorName: string
  content: string
  createdAt: string
}

export interface TaskDetail extends TaskListItem {
  comments: TaskComment[]
  updatedAt: string
}

export interface CreateTaskPayload {
  title: string
  description?: string
  status?: TaskStatus
}

export interface CreateTaskCommentPayload {
  content: string
}
