import type { AbstractPowerSyncDatabase } from "@powersync/web"
import { UpdateType } from "@powersync/web"
import { supabase } from "@/lib/supabase/client"

/** Returns true if the JWT is expired or invalid (treat as no credentials). */
function isJwtExpired(token: string, bufferSeconds = 60): boolean {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return true
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    ) as { exp?: number }
    if (typeof payload.exp !== "number") return false
    return payload.exp < Date.now() / 1000 + bufferSeconds
  } catch {
    return true
  }
}

/**
 * Connects PowerSync to Supabase:
 * - fetchCredentials: uses Supabase session JWT for PowerSync Cloud (or dev token).
 * - uploadData: applies local CRUD to Supabase (collections, notes).
 */
export class BackendConnector {
  private powersyncUrl: string | undefined
  private devToken: string | undefined

  constructor() {
    this.powersyncUrl = process.env.NEXT_PUBLIC_POWERSYNC_URL
    this.devToken = process.env.NEXT_PUBLIC_POWERSYNC_TOKEN
  }

  async fetchCredentials() {
    // Prefer Supabase session JWT so PowerSync Cloud can validate user.
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token ?? this.devToken

    if (!this.powersyncUrl || !token) {
      return null
    }

    // Don't use an expired token — returning null prevents WebSocket connection and avoids connection errors.
    if (isJwtExpired(token)) {
      return null
    }

    return {
      endpoint: this.powersyncUrl.replace(/\/$/, ""),
      token,
    }
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await database.getNextCrudTransaction()

    if (!transaction) {
      return
    }

    try {
      for (const op of transaction.crud) {
        const { table, id, op: opType, opData } = op
        const record = opData ? { ...opData, id } : { id }

        switch (table) {
          case "collections":
            await this.uploadCollection(opType, record)
            break
          case "notes":
            await this.uploadNote(opType, record)
            break
          default:
            console.warn(`PowerSync: unknown table "${table}", skipping upload`)
        }
      }
      await transaction.complete()
    } catch (error) {
      console.error("PowerSync upload error", error)
      await transaction.complete()
      throw error
    }
  }

  private async uploadCollection(
    opType: UpdateType,
    record: Record<string, unknown>
  ) {
    const { id, ...rest } = record
    if (typeof id !== "string") return

    switch (opType) {
      case UpdateType.PUT:
        await supabase.from("collections").upsert({ id, ...rest } as never)
        break
      case UpdateType.PATCH:
        await supabase.from("collections").update(rest as never).eq("id", id)
        break
      case UpdateType.DELETE:
        await supabase
          .from("collections")
          .update({ deleted_at: new Date().toISOString() } as never)
          .eq("id", id)
        break
    }
  }

  private async uploadNote(
    opType: UpdateType,
    record: Record<string, unknown>
  ) {
    const { id, ...rest } = record
    if (typeof id !== "string") return

    // Ensure tags is a proper array for Supabase (stored as text/JSON in SQLite)
    const payload = { ...rest }
    if (typeof payload.tags === "string") {
      try {
        payload.tags = JSON.parse(payload.tags as string)
      } catch {
        payload.tags = []
      }
    }

    switch (opType) {
      case UpdateType.PUT:
        await supabase.from("notes").upsert({ id, ...payload } as never)
        break
      case UpdateType.PATCH:
        await supabase.from("notes").update(payload as never).eq("id", id)
        break
      case UpdateType.DELETE:
        await supabase
          .from("notes")
          .update({ deleted_at: new Date().toISOString() } as never)
          .eq("id", id)
        break
    }
  }
}
