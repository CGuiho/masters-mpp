/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import type { Signal } from '../signal/signal'

export { calculateFeatureSet, energy, kurtosis, mean, peak, power, rms, skewness, stdDev, variance }
export type { FeatureSet }

type FeatureSet = {
  mean: number
  stdDev: number
  variance: number
  rms: number
  peak: number
  energy: number
  power: number
  skewness: number
  kurtosis: number
  crestFactor: number
  kFactor: number
}

function calculateFeatureSet(signal: Signal): FeatureSet {
  const meanValue = mean(signal)
  const stdDevValue = stdDev(signal)
  const varianceValue = variance(signal)
  const rmsValue = rms(signal)
  const peakValue = peak(signal)
  const energyValue = energy(signal)
  const powerValue = power(signal)
  const skewnessValue = skewness(signal)
  const kurtosisValue = kurtosis(signal)

  return {
    mean: meanValue,
    stdDev: stdDevValue,
    variance: varianceValue,
    rms: rmsValue,
    peak: peakValue,
    energy: energyValue,
    power: powerValue,
    skewness: skewnessValue,
    kurtosis: kurtosisValue,
    crestFactor: peakValue / rmsValue,
    kFactor: peakValue * rmsValue,
  }
}

/**
 * Calculates the mean (average) of a signal.
 * @param signal An array of numbers.
 * @returns The mean of the signal, or NaN if the signal is empty.
 */
function mean(signal: number[]): number {
  const n = signal.length
  if (n === 0) {
    return NaN
  }
  const sum = signal.reduce((acc, val) => acc + val, 0)
  return sum / n
}

/**
 * Calculates the variance of a signal.
 * This is the sample variance (division by N).
 * @param signal An array of numbers.
 * @returns The variance of the signal, or NaN if the signal is empty.
 */
function variance(signal: number[], meanValue?: number): number {
  const n = signal.length
  if (n === 0) {
    return NaN
  }
  const signalMean = meanValue || mean(signal)
  if (isNaN(signalMean)) {
    return NaN
  }
  const squaredDifferences = signal.map(val => (val - signalMean) ** 2)
  const sumOfSquaredDifferences = squaredDifferences.reduce((acc, val) => acc + val, 0)
  return sumOfSquaredDifferences / n
}

/**
 * Calculates the standard deviation of a signal.
 * This is the sample standard deviation (based on variance divided by N).
 * @param signal An array of numbers.
 * @returns The standard deviation of the signal, or NaN if the signal is empty.
 */
function stdDev(signal: number[], varianceValue?: number): number {
  const signalVariance = varianceValue || variance(signal)
  if (isNaN(signalVariance)) {
    return NaN
  }
  return Math.sqrt(signalVariance)
}

/**
 * Calculates the Root Mean Square (RMS) of a signal.
 * @param signal An array of numbers.
 * @returns The RMS of the signal, or NaN if the signal is empty.
 */
function rms(signal: number[]): number {
  const n = signal.length
  if (n === 0) {
    return NaN
  }
  const sumOfSquares = signal.reduce((acc, val) => acc + val ** 2, 0)
  return Math.sqrt(sumOfSquares / n)
}

/**
 * Calculates the peak (maximum absolute value) of a signal.
 * @param signal An array of numbers.
 * @returns The peak value of the signal. Returns 0 for an empty signal
 * (as there's no value greater than 0 in magnitude).
 * Alternatively, could return NaN or throw an error.
 */
function peak(signal: number[]): number {
  if (signal.length === 0) {
    return 0 // Or NaN, depending on desired behavior for empty signal
  }
  return signal.reduce((max, val) => Math.max(max, Math.abs(val)), 0)
}

/**
 * Calculates the energy of a signal (sum of squares).
 * @param signal An array of numbers.
 * @returns The energy of the signal. Returns 0 for an empty signal.
 */
function energy(signal: number[]): number {
  if (signal.length === 0) {
    return 0
  }
  return signal.reduce((acc, val) => acc + val ** 2, 0)
}

/**
 * Calculates the power of a signal (average energy or mean of squares).
 * @param signal An array of numbers.
 * @returns The power of the signal, or NaN if the signal is empty.
 */
function power(signal: number[]): number {
  const n = signal.length
  if (n === 0) {
    return NaN
  }
  const signalEnergy = energy(signal) // Uses the energy function defined above
  return signalEnergy / n
}

/**
 * Calculates the skewness of a signal.
 * This is the sample skewness.
 * @param signal An array of numbers.
 * @returns The skewness of the signal. Returns 0 if standard deviation is 0 (e.g. constant signal),
 * NaN if the signal is empty.
 */
function skewness(signal: number[]): number {
  const n = signal.length
  if (n === 0) {
    return NaN
  }
  const signalMean = mean(signal)
  const signalStdDev = stdDev(signal)

  if (signalStdDev === 0) {
    return 0 // No deviation, so no skewness
  }
  if (isNaN(signalMean) || isNaN(signalStdDev)) {
    return NaN
  }

  const sumOfCubedDifferences = signal.reduce((acc, val) => acc + (val - signalMean) ** 3, 0)
  const m3 = sumOfCubedDifferences / n
  return m3 / signalStdDev ** 3
}

/**
 * Calculates the kurtosis of a signal.
 * This is the sample kurtosis (not excess kurtosis).
 * A normal distribution has a kurtosis of 3.
 * @param signal An array of numbers.
 * @returns The kurtosis of the signal. Returns 0 if standard deviation is 0 (e.g. constant signal),
 * NaN if the signal is empty.
 */
function kurtosis(signal: number[]): number {
  const n = signal.length
  if (n === 0) {
    return NaN
  }
  const signalMean = mean(signal)
  const signalStdDev = stdDev(signal)

  if (signalStdDev === 0) {
    // For a constant signal, kurtosis can be considered undefined or 0 depending on convention.
    // Some definitions might give 3 or specific values based on number of elements.
    // Fisher's definition (m4 / m2^2) would lead to 0/0 if stdDev is 0.
    // If all values are the same, m4 will be 0.
    // Let's return 0 for simplicity, as there are no "tails".
    return 0
  }
  if (isNaN(signalMean) || isNaN(signalStdDev)) {
    return NaN
  }

  const sumOfQuarticDifferences = signal.reduce((acc, val) => acc + (val - signalMean) ** 4, 0)
  const m4 = sumOfQuarticDifferences / n
  return m4 / signalStdDev ** 4
}
