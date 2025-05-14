/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import * as fs from 'fs'
import { loadSignalFromTextBasedFile } from './loader/loader'
import { navigateFromRoot } from './navigate-from-root'
import type { Signal, Vector } from './signal/signal'

type DataSource = {
  id: string
  signals: Signal[]
}

const OFFSET = 10

const dataDirectory = navigateFromRoot('./data')
const entries = fs.readdirSync(dataDirectory, { withFileTypes: true })
const subdirectories = entries.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)

const dataSourcesPromise = subdirectories.map(async subdirectory => {
  const subdirectoryPath = `${dataDirectory}/${subdirectory}`
  const files = fs.readdirSync(subdirectoryPath, { withFileTypes: true })
  const signalFiles = files.filter(dirent => dirent.isFile() && dirent.name.endsWith('.csv')).map(dirent => dirent.name)

  const signalsPromise = signalFiles.map(file => loadSignalFromTextBasedFile(`${subdirectoryPath}/${file}`, 0, ','))
  const signals = await Promise.all(signalsPromise)
  return { id: subdirectory, signals: signals } satisfies DataSource
})

const dataSources: DataSource[] = await Promise.all(dataSourcesPromise)

console.log('Data sources loaded:', dataSources.length)
