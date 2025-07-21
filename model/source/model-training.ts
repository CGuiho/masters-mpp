/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

/**
 * File name: model-training.ts
 * Relative file path: model\source\model-training.ts
 * The relative path is the file path on workspace or folder.
 */

import { type Model, type Observation, initializeModel, model as predict } from './model'
import { HIDDEN_LAYER_SIZES, OUTPUT_SIZE } from './model-constant'

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
function trainModel(trainingData: Observation[], epochs: number, learningRate: number): Model {
  if (trainingData.length === 0) {
    throw new Error('Training data cannot be empty. eb6a5e7d')
  }
  const inputSize = trainingData[0]!.value.length
  const outputSize = OUTPUT_SIZE // As per the requirement
  const hiddenLayers = HIDDEN_LAYER_SIZES // As per the requirement

  let trainedModel = initializeModel(inputSize, hiddenLayers, outputSize)

  for (let epoch = 0; epoch < epochs; epoch++) {
    for (const observation of trainingData) {
      // Forward pass
      const outputs = predict(trainedModel, observation)
      const expected = observation.value // Assuming the target is the same as the input for this example

      if (expected.length !== outputSize) {
        throw new Error(
          `Expected output size ${outputSize} does not match the length of expected values ${expected.length}.`,
        )
      }
      // Backward pass
      let errors = expected.map((exp, i) => exp - outputs[i]!)

      for (let i = trainedModel.layers.length - 1; i >= 0; i--) {
        const layer = trainedModel.layers[i]

        if (!layer) throw new Error(`Layer ${i} is undefined in the model.`)
        if (trainedModel.layers[i - 1] === undefined)
          throw new Error(`Layer ${i} does not have a previous layer to connect to.`)

        const prevLayerOutputs = i === 0 ? observation.value : trainedModel.layers[i - 1]!.neurons.map(n => n.output!)
        const currentErrors: number[] = []

        for (let j = 0; j < layer.neurons.length; j++) {
          const neuron = layer.neurons[j]
          const error = errors[j]

          if (error === undefined) throw new Error(`Error for neuron ${j} in layer ${i} is undefined.`)
          if (neuron === undefined) throw new Error(`Neuron ${j} in layer ${i} is undefined.`)

          neuron.delta = error * sigmoidDerivative(neuron.output!)

          // Calculate errors for the previous layer
          for (let k = 0; k < neuron.weights.length; k++) {
            if (i > 0) {
              if (currentErrors[k] === undefined) {
                currentErrors[k] = 0
              }
              if (neuron.weights[k] === undefined)
                throw new Error(`Weight ${k} for neuron ${j} in layer ${i} is undefined.`)
              if (neuron.weights[k] === undefined)
                throw new Error(`Weight ${k} for neuron ${j} in layer ${i} is undefined.`)

              currentErrors[k]! += neuron.weights[k]! * neuron.delta
            }
          }

          // Update weights and bias
          for (let k = 0; k < neuron.weights.length; k++) {
            if (neuron.weights[k] === undefined) throw new Error(`Weight ${k} for neuron ${j} in layer ${i} is undefined.`)
            if (prevLayerOutputs[k] === undefined) throw new Error(`Previous layer output ${k} for neuron ${j} in layer ${i} is undefined.`)

              neuron.weights[k]! += learningRate * neuron.delta * prevLayerOutputs[k]!
          }
          neuron.bias += learningRate * neuron.delta
        }
        errors = currentErrors
      }
    }
  }

  return trainedModel
}
