/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

/**
 * File name: model-finished.ts
 * Relative file path: model\source\model-finished.ts
 * The relative path is the file path on workspace or folder.
 */

export { useTrainedModel }
export type { }

import { type Model, type Observation, model as predict } from './model'

/**
 * Uses the trained model to make a prediction on a new observation.
 * @param trainedModel The trained neural network model.
 * @param observation The new observation to make a prediction on.
 * @returns The prediction from the model.
 */
function useTrainedModel(trainedModel: Model, observation: Observation): number[] {
  return predict(trainedModel, observation)
}

// Example of how to use the trained model
async function main() {
  // In a real application, you would load the trained model from a file.
  // For this example, we'll create a placeholder trained model.
  // Replace this with loading your actual trained model.
  const trainedModel: Model = {
    // This is just a placeholder structure.
    // The actual weights and biases would be the result of the training process.
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

  const prediction = useTrainedModel(trainedModel, newObservation)

  console.log(`Prediction for observation ${newObservation.id}:`, prediction)
}

main()
