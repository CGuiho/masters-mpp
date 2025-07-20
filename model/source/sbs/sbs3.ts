/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import type { Feature, FeatureSet } from '../feature/feature'

export { calculateFeatureRelevance3, sbs3 }

/**
 * Sequential Backward Selection (SBS) using class separability metrics.
 * Returns features sorted by relevance (most relevant first).
 */
function sbs3(classes: FeatureSet[][]): Feature[] {
  const scores = calculateFeatureRelevance3(classes)
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([feature]) => feature as Feature)
}

/**
 * Calculates relevance scores (0 to 1) for each feature based on class separability.
 */
function calculateFeatureRelevance3(classes: FeatureSet[][]): Record<Feature, number> {
  const features = Object.keys(classes[0]![0]!) as Feature[]
  const scores: Record<Feature, number> = {} as Record<Feature, number>
  const epsilon = 1e-9 // Avoid division by zero

  features.forEach(feature => {
    // Track class statistics and overall totals
    let totalSum = 0
    let totalCount = 0
    const classStats: Array<{ mean: number; count: number; values: number[] }> = []

    // Compute per-class mean and overall sum
    classes.forEach(classSamples => {
      const values = classSamples.map(fs => fs[feature])
      const sum = values.reduce((a, v) => a + v, 0)
      const count = values.length
      const mean = sum / count
      classStats.push({ mean, count, values })
      totalSum += sum
      totalCount += count
    })

    const overallMean = totalSum / totalCount

    // Calculate Between-Class Sum of Squares (SSB)
    let ssb = 0
    classStats.forEach(({ mean: classMean, count }) => {
      ssb += count * (classMean - overallMean) ** 2
    })

    // Calculate Within-Class Sum of Squares (SSW)
    let ssw = 0
    classStats.forEach(({ values, mean: classMean }) => {
      values.forEach(value => {
        ssw += (value - classMean) ** 2
      })
    })

    // Relevance score: SSB / (SSW + epsilon)
    const score = ssb / (ssw + epsilon)
    scores[feature] = score
  })

  // Normalize scores to 0-1 range
  const maxScore = Math.max(...Object.values(scores))
  if (maxScore === 0) {
    features.forEach(feature => (scores[feature] = 0))
  } else {
    features.forEach(feature => (scores[feature] /= maxScore))
  }

  return scores
}
