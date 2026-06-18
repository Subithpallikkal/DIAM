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

export interface CreateClientPayload {
  name: string
  email?: string
  phone?: string
  address?: string
  gstNumber?: string
  code?: string
}

export interface UpdateClientPayload {
  name?: string
  email?: string
  phone?: string
  address?: string
  gstNumber?: string
  code?: string
  isActive?: boolean
}
