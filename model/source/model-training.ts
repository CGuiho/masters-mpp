/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

/**
 * File name: model-training.ts
 * Relative file path: model\source\model-training.ts
 * The relative path is the file path on workspace or folder.
 */

import { type Model, type TrainingObservation, initializeModel, predictWithSoftmaxAndTemperature } from './model'

export { trainModel }

/**
 * The derivative of the sigmoid function.
 * @param x The input value.
 * @returns The derivative of the sigmoid of x.
 */
function sigmoidDerivative(x: number): number {
  return x * (1 - x)
}

/**
 * Trains the neural network model using the provided training data.
 * @param trainingData A list of observations for training.
 * @param epochs The number of training iterations.
 * @param learningRate The learning rate for weight and bias updates.
 * @returns The trained model with updated weights and biases.
 */
function trainModel(trainingData: TrainingObservation[], epochs: number, learningRate: number): Model {
  // Ensure there is data to train on
  if (trainingData.length === 0) {
    throw new Error('Training data cannot be empty.')
  }

  if (!trainingData[0]!.value || !trainingData[0]!.expected) throw new Error('Invalid training data format.')

  const inputSize = trainingData[0]!.value.length
  const outputSize = trainingData[0]!.expected.length
  const hiddenLayers = [4, 4] // As per the requirement

  let trainedModel = initializeModel(inputSize, hiddenLayers, outputSize)

  for (let epoch = 0; epoch < epochs; epoch++) {
    for (const observation of trainingData) {
      // Forward pass
      const outputs = predictWithSoftmaxAndTemperature(trainedModel, observation, 1)

      // *** CRITICAL CHANGE HERE ***
      // Calculate error based on the 'expected' output, not the input.
      const expected = observation.expected
      let errors = expected.map((exp, i) => exp - outputs[i]!)

      // Backward pass (Backpropagation)
      for (let i = trainedModel.layers.length - 1; i >= 0; i--) {
        const layer = trainedModel.layers[i]!
        const prevLayerOutputs = i === 0 ? observation.value : trainedModel.layers[i - 1]!.neurons.map(n => n.output!)
        const currentErrors: number[] = []

        for (let j = 0; j < layer.neurons.length; j++) {
          const neuron = layer.neurons[j]!
          const error = errors[j]!
          neuron.delta = error * sigmoidDerivative(neuron.output!)

          // Propagate errors to the previous layer
          if (i > 0) {
            for (let k = 0; k < neuron.weights.length; k++) {
              if (currentErrors[k] === undefined) {
                currentErrors[k] = 0
              }
              currentErrors[k]! += neuron.weights[k]! * neuron.delta
            }
          }

          // Update weights and bias
          for (let k = 0; k < neuron.weights.length; k++) {
            neuron.weights[k]! += learningRate * neuron.delta * (prevLayerOutputs[k] ?? 0)
          }
          neuron.bias += learningRate * neuron.delta
        }
        errors = currentErrors
      }
    }
  }

  return trainedModel
}
