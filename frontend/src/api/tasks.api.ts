import { api } from './axios'
import type { ListQueryParams, PaginatedResponse } from '../types/api'
import type {
  CreateTaskCommentPayload,
  CreateTaskPayload,
  TaskDetail,
  TaskListItem,
} from '../types/task'
import type { TaskStatus } from '../types/document'

export async function fetchTasks(
  params?: ListQueryParams & {
    engagementId?: number
    assigneeId?: number
  },
): Promise<PaginatedResponse<TaskListItem>> {
  const { data } = await api.get<PaginatedResponse<TaskListItem>>('/tasks', { params })
  return data
}

export async function fetchTask(taskId: number): Promise<TaskDetail> {
  const { data } = await api.get<TaskDetail>(`/tasks/${taskId}`)
  return data
}

export async function createTask(
  engagementId: number,
  payload: CreateTaskPayload,
): Promise<TaskListItem> {
  const { data } = await api.post<TaskListItem>(
    `/engagements/${engagementId}/tasks`,
    payload,
  )
  return data
}

export async function updateTask(
  taskId: number,
  payload: Partial<CreateTaskPayload> & { status?: TaskStatus },
): Promise<TaskListItem> {
  const { data } = await api.patch<TaskListItem>(`/tasks/${taskId}`, payload)
  return data
}

export async function assignTask(taskId: number, assignedToId: number): Promise<TaskDetail> {
  const { data } = await api.post<TaskDetail>(`/tasks/${taskId}/assign`, { assignedToId })
  return data
}

export async function addTaskComment(
  taskId: number,
  payload: CreateTaskCommentPayload,
): Promise<TaskDetail> {
  const { data } = await api.post<TaskDetail>(`/tasks/${taskId}/comments`, payload)
  return data
}

export async function deleteTask(taskId: number): Promise<void> {
  await api.delete(`/tasks/${taskId}`)
}

export const TASK_STATUS_OPTIONS: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED']
