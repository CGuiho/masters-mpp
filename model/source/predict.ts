/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import * as fs from 'fs'
import { calculateFeatureSet, type FeatureSet } from './feature/feature'
import { loadSignalFromTextBasedFile } from './loader/loader'
import { predictWithSoftmax, type Model, type Observation } from './model'

const relevantFeaturesFile = Bun.file(import.meta.dirname + '/relevant-features.json')
const expectationLabelsFile = Bun.file(import.meta.dirname + '/expectation-labels.json')
const modelFile = Bun.file(import.meta.dirname + '/model.json')

const relevantFeatures: string[] = await relevantFeaturesFile.json()
const expectationLabels: string[] = await expectationLabelsFile.json()
const trainedModel: Model = await modelFile.json()

console.info('Relevant Features:', relevantFeatures)
console.info('Expectation Labels:', expectationLabels)
// console.info('Model:', trainedModel)

/**
 * Read the new observation from the user input or a predefined set.
 * ./input/
 *   file.csv
 *   file2.csv
 */

const rawInputDirectory = import.meta.dirname + '/input'
const inputDirectory = rawInputDirectory.replace(/\\/g, '/')
console.info('Input Directory:', inputDirectory)

const files = fs.readdirSync(inputDirectory, { withFileTypes: true })
const signalFiles = files.filter(dirent => dirent.isFile() && dirent.name.endsWith('.csv')).map(dirent => dirent.name)

console.info('Signal Files:', signalFiles)

const COLUMN_OF_SIGNAL = 1
const signalsPromise = signalFiles.map(file =>
  loadSignalFromTextBasedFile(`${inputDirectory}/${file}`, COLUMN_OF_SIGNAL, ','),
)

const signals = await Promise.all(signalsPromise)

/**
 * Calcul des indicateurs.
 */
const features = signals.map(signal => calculateFeatureSet(signal))

/**
 * Indicateurs pertinents.
 * relevantFeaturesFile if string[]
 */

const observations: Observation[] = features.map((featureSet, index) => {
  const value: number[] = []

  relevantFeatures.map((feature, index) => {
    const key: keyof FeatureSet = feature as any
    if (featureSet[key] !== undefined) {
      value[index] = featureSet[key]!
    } else {
      console.warn(`Feature "${feature}" not found in feature set. Setting to 0.`)
      value[index] = 0
    }
  })

  return {
    id: `${index}`,
    value: value,
  }
})

console.info('Observations:', observations)

// Forward pass
const outputs = observations.map(observation => predictWithSoftmax(trainedModel, observation))

const maxIndex = outputs.map(output => output.indexOf(Math.max(...output)))
const maxLabels = maxIndex.map(index => expectationLabels[index])

console.info('Outputs:', outputs)
console.info('Max Indices:', maxIndex)
console.info('Max Labels:', maxLabels)
