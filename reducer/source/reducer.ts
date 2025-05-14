/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import * as fs from 'fs'
import { calculateFeatureSet, type Feature, type FeatureSet } from './feature/feature'
import { loadSignalFromTextBasedFile } from './loader/loader'
import { navigateFromRoot } from './navigate-from-root'
import { calculateFeatureRelevanceByVarianceOrdered } from './sbs/feature-relevance-through-variance'
import { sbs } from './sbs/sbs'
import { sbs2 } from './sbs/sbs2'
import { sbs3 } from './sbs/sbs3'
import type { Signal } from './signal/signal'

type DataSource = {
  id: string
  signals: Signal[]
}

console.time('application')

console.time('data-sources')

const dataDirectory = navigateFromRoot('./data')
const entries = fs.readdirSync(dataDirectory, { withFileTypes: true })
const subdirectories = entries.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)

const OFFSET = 10
const dataSourcesPromise = subdirectories.map(async subdirectory => {
  const subdirectoryPath = `${dataDirectory}/${subdirectory}`
  const files = fs.readdirSync(subdirectoryPath, { withFileTypes: true })
  const signalFiles = files.filter(dirent => dirent.isFile() && dirent.name.endsWith('.csv')).map(dirent => dirent.name)

  const COLUMN_OF_SIGNAL = 1
  const signalsPromise = signalFiles
    .filter((_, i) => i >= OFFSET)
    .map(file => loadSignalFromTextBasedFile(`${subdirectoryPath}/${file}`, COLUMN_OF_SIGNAL, ','))

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
console.log('Data Sources:', dataSources[0]?.signals[0]!.length)
console.log('Data Sources:', dataSources[0]?.signals[0])

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
const relevantFeatures1 = calculateFeatureRelevanceByVarianceOrdered(featuresList)
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

const relevantFeatures: Feature[] = relevantFeatures4.slice(0, 3)
console.log('Relevant Features:', relevantFeatures)

type RelevantData = {
  id: string
  features: Partial<FeatureSet>[]
}


const relevantData = featuresData.map(({ id, features }) => {
  const relevantFeaturesData = features.map(featureSet => {
    const relevantFeatureSet: Partial<FeatureSet> = {}
    for (const feature of relevantFeatures) {
      if (featureSet[feature] !== undefined) {
        relevantFeatureSet[feature] = featureSet[feature]
      }
    }
    return relevantFeatureSet
  })
  return { id, features: relevantFeaturesData } satisfies RelevantData
})

console.log('Relevant Data length:', relevantData[0]?.features.length)
console.log('Relevant Data:', relevantData[0]?.features[0])

const SPLIT_RATIO = 0.8
const TOTAL_DATA_SIZE = relevantData[0]?.features.length!
const TRAINING_DATA_SIZE = Math.floor(TOTAL_DATA_SIZE * SPLIT_RATIO)
const TESTING_DATA_SIZE = TOTAL_DATA_SIZE - TRAINING_DATA_SIZE

const trainingData = relevantData.map(({ id, features }) => {
  const trainingFeatures = features.slice(0, TRAINING_DATA_SIZE)
  return { id, features: trainingFeatures } satisfies RelevantData
})

const testingData = relevantData.map(({ id, features }) => {
  const testingFeatures = features.slice(TRAINING_DATA_SIZE, TRAINING_DATA_SIZE + TESTING_DATA_SIZE)
  return { id, features: testingFeatures } satisfies RelevantData
})

console.log('Training Data length:', trainingData[0]?.features.length)
console.log('Training Data:', trainingData[0]?.features[0])

console.log('Testing Data length:', testingData[0]?.features.length)
console.log('Testing Data:', testingData[0]?.features[0])

console.timeEnd('application')
