/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

/**
 * File name: model.ts
 * Relative file path: model\source\model.ts
 * The relative path is the file path on workspace or folder.
 */

export { initializeModel, model, predictWithSoftmax, predictWithSoftmaxAndTemperature }
export type { Model, Observation }

/**
 * Represents a single neuron in a layer.
 */
interface Neuron {
  weights: number[]
  bias: number
  output?: number
  delta?: number
}

/**
 * Represents a layer of neurons.
 */
interface Layer {
  neurons: Neuron[]
}

/**
 * Represents the entire neural network model.
 */
interface Model {
  layers: Layer[]
}

/**
 * Observation data structure for model input.
 */
interface Observation {
  id: string
  value: number[]
}

/**
 * Initializes the weights and biases of the model with random values.
 * @param inputSize The number of input features.
 * @param hiddenLayers The number of neurons in each hidden layer.
 * @param outputSize The number of output neurons.
 * @returns The initialized model.
 */
function initializeModel(inputSize: number, hiddenLayers: number[], outputSize: number): Model {
  const layers: Layer[] = []
  let prevLayerSize = inputSize

  // Initialize hidden layers
  for (const layerSize of hiddenLayers) {
    const neurons: Neuron[] = []
    for (let i = 0; i < layerSize; i++) {
      neurons.push({
        weights: Array.from({ length: prevLayerSize }, () => Math.random() * 2 - 1),
        bias: Math.random() * 2 - 1,
      })
    }
    layers.push({ neurons })
    prevLayerSize = layerSize
  }

  // Initialize output layer
  const outputLayer: Layer = { neurons: [] }
  for (let i = 0; i < outputSize; i++) {
    outputLayer.neurons.push({
      weights: Array.from({ length: prevLayerSize }, () => Math.random() * 2 - 1),
      bias: Math.random() * 2 - 1,
    })
  }
  layers.push(outputLayer)

  return { layers }
}

/**
 * The sigmoid activation function.
 * @param x The input value.
 * @returns The sigmoid of x.
 */
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

/**
 * Performs a forward pass through the network to make a prediction.
 * @param model The neural network model.
 * @param observation The input observation.
 * @returns The output values from the output layer.
 */
function model(model: Model, observation: Observation): number[] {
  let inputs = observation.value

  for (const layer of model.layers) {
    const newInputs: number[] = []
    for (const neuron of layer.neurons) {
      const activation = neuron.weights.reduce((acc, weight, i) => acc + weight * inputs[i]!, 0) + neuron.bias
      neuron.output = sigmoid(activation)
      newInputs.push(neuron.output)
    }
    inputs = newInputs
  }

  return inputs
}

/**
 * The softmax activation function.
 * @param logits The raw output values (activations) from the output layer.
 * @param temperature A parameter to control the randomness of the prediction.
 * @returns The softmax probabilities.
 */
function softmax(logits: number[], temperature: number = 1.0): number[] {
  const adjustedLogits = logits.map(logit => logit / temperature)
  const maxLogit = Math.max(...adjustedLogits)
  const exps = adjustedLogits.map(logit => Math.exp(logit - maxLogit))
  const sumExps = exps.reduce((a, b) => a + b)
  return exps.map(e => e / sumExps)
}

/**
 * Performs a forward pass and applies softmax to the output.
 * @param model The neural network model.
 * @param observation The input observation.
 * @returns A probability distribution over the output classes.
 */
function predictWithSoftmax(model: Model, observation: Observation): number[] {
  let inputs = observation.value
  let rawOutput: number[] = []

  for (let i = 0; i < model.layers.length; i++) {
    const layer = model.layers[i]
    const newInputs: number[] = []
    const isOutputLayer = i === model.layers.length - 1

    if (!layer) throw new Error(`Layer ${i} is undefined in the model.`)
    for (const neuron of layer.neurons) {
      const activation = neuron.weights.reduce((acc, weight, j) => acc + weight * inputs[j]!, 0) + neuron.bias

      if (isOutputLayer) {
        rawOutput.push(activation) // Keep raw activation for softmax
      } else {
        neuron.output = sigmoid(activation)
        newInputs.push(neuron.output)
      }
    }

    if (isOutputLayer) {
      inputs = softmax(rawOutput)
    } else {
      inputs = newInputs
    }
  }
  return inputs
}

/**
 * Performs a forward pass and applies softmax with temperature to the output.
 * @param model The neural network model.
 * @param observation The input observation.
 * @param temperature Controls the randomness of the prediction. Higher values lead to more random predictions.
 * @returns A probability distribution over the output classes.
 */

function predictWithSoftmaxAndTemperature(model: Model, observation: Observation, temperature: number): number[] {
  if (temperature <= 0) {
    throw new Error('Temperature must be a positive number.')
  }
  let inputs = observation.value
  let rawOutput: number[] = []

  for (let i = 0; i < model.layers.length; i++) {
    const layer = model.layers[i]
    const newInputs: number[] = []
    const isOutputLayer = i === model.layers.length - 1

    if (!layer) throw new Error(`Layer ${i} is undefined in the model.`)

    for (const neuron of layer.neurons) {
      const activation = neuron.weights.reduce((acc, weight, j) => acc + weight * inputs[j]!, 0) + neuron.bias

      if (isOutputLayer) {
        rawOutput.push(activation)
      } else {
        neuron.output = sigmoid(activation)
        newInputs.push(neuron.output)
      }
    }
    if (isOutputLayer) {
      inputs = softmax(rawOutput, temperature)
    } else {
      inputs = newInputs
    }
  }
  return inputs
}
