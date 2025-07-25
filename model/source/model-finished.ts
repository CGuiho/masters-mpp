/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

/**
 * File name: model-finished.ts
 * Relative file path: model\source\model-finished.ts
 * The relative path is the file path on workspace or folder.
 */

import { type Model, type Observation, predictWithSoftmaxAndTemperature } from './model'

export { }
export type { }

/**
 * Uses the trained model to make a prediction on a new observation.
 * @param trainedModel The trained neural network model.
 * @param observation The new observation to make a prediction on.
 * @returns The prediction from the model.
 */
export function useTrainedModel(trainedModel: Model, observation: Observation): number[] {
  return predictWithSoftmaxAndTemperature(trainedModel, observation, 1.0)
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

}
main()
