export interface ClientListItem {
  id: number
  name: string
  email: string | null
  phone: string | null
  gstNumber: string | null
  isActive: boolean
  createdAt: string
}

export interface ClientDetail extends ClientListItem {
  code: string | null
  address: string | null
  updatedAt: string
}

export interface UpsertClientPayload {
  id?: number
  name?: string
  email?: string
  phone?: string
  address?: string
  gstNumber?: string
  code?: string
  isActive?: boolean
}

/** @deprecated Use UpsertClientPayload */
export type CreateClientPayload = Omit<UpsertClientPayload, 'id' | 'isActive'> & { name: string }

/** @deprecated Use UpsertClientPayload */
export type UpdateClientPayload = Omit<UpsertClientPayload, 'id'>
