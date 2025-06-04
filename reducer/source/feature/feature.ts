/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import type { Signal } from '../signal/signal'

export { calculateFeatureSet, energy, kurtosis, mean, peak, power, rms, skewness, stdDev, variance }
export type { FeatureSet, Feature }

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

type Feature = keyof FeatureSet

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
function variance(signal: number[]): number {
  const n = signal.length
  if (n === 0) {
    return NaN
  }
  const signalMean = mean(signal)
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
function stdDev(signal: number[]): number {
  const signalVariance = variance(signal)
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


/* 
/**
 * Calculates the crest factor of a signal.
 * The crest factor is the ratio of the peak value of the signal to its root mean square (RMS) value.
 *
 * @param signal - An array of numbers representing the input signal.
 * @returns The crest factor of the signal.
 */
function crestFactor(signal: number[]): number {
  const peakValue = peak(signal)
  const rmsValue = rms(signal)
  return peakValue / rmsValue
}

/**
 * Calculates the k-factor of a signal.
 * The k-factor is the product of the peak value and the RMS value of the signal.
 *
 * @param signal - An array of numbers representing the input signal.
 * @returns The k-factor of the signal.
 */
function kFactor(signal: number[]): number {
  const peakValue = peak(signal)
  const rmsValue = rms(signal)
  return peakValue * rmsValue
}

/**
 * Calculates the median of a signal.
 * @param signal An array of numbers.
 * @returns The median of the signal, or NaN if the signal is empty.
 */
function min(signal: number[]): number {
  if (signal.length === 0) return NaN
  return Math.min(...signal)
}

/**
 * Calculates the maximum value of a signal.
 * @param signal An array of numbers.
 * @returns The maximum value of the signal, or NaN if the signal is empty.
 */
function max(signal: number[]): number {
  if (signal.length === 0) return NaN
  return Math.max(...signal)
}

/**
 * Calculates the median of a signal.
 * @param signal An array of numbers.
 * @returns The median of the signal, or NaN if the signal is empty.
 */
function median(signal: number[]): number {
  if (signal.length === 0) return NaN
  const sorted = [...signal].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}


*/
