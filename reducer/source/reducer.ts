/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import * as fs from 'fs'
import { loadSignalFromTextBasedFile } from './loader/loader'
import { navigateFromRoot } from './navigate-from-root'
import type { Signal } from './signal/signal'

type DataSource = {
  id: string
  signals: Signal[]
}

console.time('data-sources')

const dataDirectory = navigateFromRoot('./data')
const entries = fs.readdirSync(dataDirectory, { withFileTypes: true })
const subdirectories = entries.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)

const OFFSET = 10
const dataSourcesPromise = subdirectories.map(async subdirectory => {
  const subdirectoryPath = `${dataDirectory}/${subdirectory}`
  const files = fs.readdirSync(subdirectoryPath, { withFileTypes: true })
  const signalFiles = files.filter(dirent => dirent.isFile() && dirent.name.endsWith('.csv')).map(dirent => dirent.name)

  const signalsPromise = signalFiles
    .filter((_, i) => i >= OFFSET)
    .map(file => loadSignalFromTextBasedFile(`${subdirectoryPath}/${file}`, 0, ','))

  const signals = await Promise.all(signalsPromise)
  return { id: subdirectory, signals: signals } satisfies DataSource
})

const dataSources: DataSource[] = await Promise.all(dataSourcesPromise)

console.timeEnd('data-sources')

type FeatureSet = 

type DataFeatures = {
  id: string
  features: FeatureSet[]
}

const featuresData = 