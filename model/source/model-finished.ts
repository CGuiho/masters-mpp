/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

/**
 * File name: model-finished.ts
 * Relative file path: model\source\model-finished.ts
 * The relative path is the file path on workspace or folder.
 */

import { type Model, type Observation, predict, predictWithSoftmax, predictWithSoftmaxAndTemperature } from './model'

export { }
export type { }

/**
 * Uses the trained model to make a prediction on a new observation.
 * @param trainedModel The trained neural network model.
 * @param observation The new observation to make a prediction on.
 * @returns The prediction from the model.
 */
export function useTrainedModel(trainedModel: Model, observation: Observation): number[] {
  return predict(trainedModel, observation)
}

// Example of how to use the trained model
async function main() {
  // In a real application, you would load the trained model from a file.
  // For this example, we'll create a placeholder trained model.
  // Replace this with loading your actual trained model.
  const trainedModel: Model = {
    layers: [
      {
        neurons: [
          { weights: [0.1, 0.2, 0.3, 0.4], bias: 0.1 },
          { weights: [0.5, 0.6, 0.7, 0.8], bias: 0.2 },
          { weights: [0.9, 0.1, 0.2, 0.3], bias: 0.3 },
          { weights: [0.4, 0.5, 0.6, 0.7], bias: 0.4 },
        ],
      },
      {
        neurons: [
          { weights: [0.1, 0.2, 0.3, 0.4], bias: 0.1 },
          { weights: [0.5, 0.6, 0.7, 0.8], bias: 0.2 },
          { weights: [0.9, 0.1, 0.2, 0.3], bias: 0.3 },
          { weights: [0.4, 0.5, 0.6, 0.7], bias: 0.4 },
        ],
      },
      {
        neurons: [
          { weights: [0.1, 0.2, 0.3, 0.4], bias: 0.1 },
          { weights: [0.5, 0.6, 0.7, 0.8], bias: 0.2 },
          { weights: [0.9, 0.1, 0.2, 0.3], bias: 0.3 },
          { weights: [0.4, 0.5, 0.6, 0.7], bias: 0.4 },
        ],
      },
    ],
  }

  const newObservation: Observation = {
    id: 'test-123',
    value: [0.5, 0.2, 0.8, 0.1],
  }

  // 1. Standard prediction with sigmoid output
  const standardPrediction = useTrainedModel(trainedModel, newObservation)
  console.log(`Standard Prediction (Sigmoid) for observation ${newObservation.id}:`, standardPrediction)

  // 2. Prediction with Softmax
  const softmaxPrediction = predictWithSoftmax(trainedModel, newObservation)
  const sumSoftmax = softmaxPrediction.reduce((a, b) => a + b, 0)
  console.log(`\nPrediction with Softmax for observation ${newObservation.id}:`, softmaxPrediction)
  console.log(`(Sum of probabilities: ${sumSoftmax.toFixed(2)})`)

  // 3. Prediction with Softmax and Temperature
  console.log('\n--- Predictions with Softmax and Temperature ---')

  // Low temperature: makes the model more confident (less random)
  const lowTemp = 0.5
  const softmaxLowTemp = predictWithSoftmaxAndTemperature(trainedModel, newObservation, lowTemp)
  console.log(`\nPrediction with Temperature ${lowTemp}:`, softmaxLowTemp)
  console.log(`(Sum of probabilities: ${softmaxLowTemp.reduce((a, b) => a + b, 0).toFixed(2)})`)

  // Medium temperature (standard softmax)
  const medTemp = 1.0
  const softmaxMedTemp = predictWithSoftmaxAndTemperature(trainedModel, newObservation, medTemp)
  console.log(`\nPrediction with Temperature ${medTemp}:`, softmaxMedTemp)
  console.log(`(Sum of probabilities: ${softmaxMedTemp.reduce((a, b) => a + b, 0).toFixed(2)})`)

  // High temperature: makes the model less confident (more random)
  const highTemp = 2.0
  const softmaxHighTemp = predictWithSoftmaxAndTemperature(trainedModel, newObservation, highTemp)
  console.log(`\nPrediction with Temperature ${highTemp}:`, softmaxHighTemp)
  console.log(`(Sum of probabilities: ${softmaxHighTemp.reduce((a, b) => a + b, 0).toFixed(2)})`)
}

main()
