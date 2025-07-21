/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import { predictWithSoftmaxAndTemperature, type Model } from './model'

const relevantFeaturesFile = Bun.file(import.meta.dirname + '/relevant-features.json')
const expectationLabelsFile = Bun.file(import.meta.dirname + '/expectation-labels.json')
const modelFile = Bun.file(import.meta.dirname + '/model.json')

const relevantFeatures: string[] = await relevantFeaturesFile.json()
const expectationLabels: string[] = await expectationLabelsFile.json()
const trainedModel: Model = await modelFile.json()

console.info('Relevant Features:', relevantFeatures)
console.info('Expectation Labels:', expectationLabels)
console.info('Model:', trainedModel)

// Forward pass
const outputs = predictWithSoftmaxAndTemperature(trainedModel, observation, 1)
