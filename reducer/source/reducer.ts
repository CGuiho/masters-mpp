/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import * as fs from 'fs'
import { calculateFeatureSet, type FeatureSet } from './feature/feature'
import { loadSignalFromTextBasedFile } from './loader/loader'
import { navigateFromRoot } from './navigate-from-root'
import { calculateFeatureRelevanceByVariance } from './sbs/feature-relevance-through-variance'
import { sbs } from './sbs/sbs'
import { sbs2 } from './sbs/sbs2'
import { sbs3 } from './sbs/sbs3'
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

type DataWithFeatures = {
  id: string
  features: FeatureSet[]
}
console.log('Data Sources:', dataSources[0]?.signals.length)

console.time('features-calculation')
const featuresData: DataWithFeatures[] = dataSources.map(({ id, signals }) => {
  const features = signals.map(signal => calculateFeatureSet(signal))
  return { id, features } satisfies DataWithFeatures
})
console.timeEnd('features-calculation')

console.log('Data With Features:', featuresData[0]?.features.length)


const classes = featuresData.map(({ features }) => features)
const featuresList = featuresData.map(({ features }) => features).flat()

console.time('features-variance-0')
const relevantFeatures2 = sbs(classes)
console.log('Relevant Features 0:', relevantFeatures2)
console.timeEnd('features-variance-0')

console.time('features-variance-1')
const relevantFeatures1 = calculateFeatureRelevanceByVariance(featuresList)
console.log('Relevant Features 1:', relevantFeatures1)
console.timeEnd('features-variance-1')

console.time('features-variance-2')
const relevantFeatures3 = sbs2(classes)
console.log('Relevant Features 2:', relevantFeatures3)
console.timeEnd('features-variance-2')

console.time('features-variance-3')
const relevantFeatures4 = sbs3(classes)
console.log('Relevant Features 3:', relevantFeatures4)
console.timeEnd('features-variance-3')
