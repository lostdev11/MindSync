export interface Collection {
  id: string
  user_id: string
  name: string
  color: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Note {
  id: string
  user_id: string
  collection_id: string | null
  title: string
  content: string
  tags: string[]
  is_pinned: boolean
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export interface RecallQuery {
  id: string
  user_id: string
  question: string
  answer: string | null
  source_note_ids: string[]
  created_at: string
  deleted_at: string | null
}

