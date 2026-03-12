import { column, Schema, Table } from "@powersync/web"

/**
 * Local SQLite schema synced by PowerSync.
 * Must match the Supabase tables: collections, notes.
 */
const collections = new Table({
  id: column.text,
  user_id: column.text,
  name: column.text,
  color: column.text,
  created_at: column.text,
  updated_at: column.text,
  deleted_at: column.text,
})

const notes = new Table(
  {
    id: column.text,
    user_id: column.text,
    collection_id: column.text,
    title: column.text,
    content: column.text,
    tags: column.text, // JSON array string
    is_pinned: column.integer,
    created_at: column.text,
    updated_at: column.text,
    deleted_at: column.text,
  },
  { indexes: { list: ["collection_id"], user: ["user_id"] } }
)

export const AppSchema = new Schema({
  collections,
  notes,
})

export type Database = (typeof AppSchema)["types"]
export type CollectionRecord = Database["collections"]
export type NoteRecord = Database["notes"]
