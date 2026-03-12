"use client"

import { AppSchema } from "@/lib/powersync/AppSchema"
import { BackendConnector } from "@/lib/powersync/BackendConnector"
import { PowerSyncContext } from "@powersync/react"
import {
  PowerSyncDatabase,
  WASQLiteOpenFactory,
  createBaseLogger,
  LogLevel,
} from "@powersync/web"
import React, { Suspense } from "react"

const logger = createBaseLogger()
logger.useDefaults()
logger.setLevel(LogLevel.WARN)

const factory = new WASQLiteOpenFactory({
  dbFilename: "mindsync.db",
  worker: "/@powersync/worker/WASQLiteDB.umd.js",
})

export const powersyncDb = new PowerSyncDatabase({
  database: factory,
  schema: AppSchema,
  flags: {
    disableSSRWarning: true,
  },
  sync: {
    worker: "/@powersync/worker/SharedSyncImplementation.umd.js",
  },
})

const connector = new BackendConnector()
powersyncDb.connect(connector)

export function PowerSyncProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <PowerSyncContext.Provider value={powersyncDb}>
        {children}
      </PowerSyncContext.Provider>
    </Suspense>
  )
}
