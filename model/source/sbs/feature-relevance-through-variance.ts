/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import { variance, type Feature, type FeatureSet } from '../feature/feature'

export { calculateFeatureRelevanceByVariance, calculateFeatureRelevanceByVarianceOrdered }

function calculateFeatureRelevanceByVarianceOrdered(featuresList: FeatureSet[]): Feature[] {
  const scores = calculateFeatureRelevanceByVariance(featuresList)
  const sortedFeatures = Object.entries(scores)
    .filter(([_, score]) => !isNaN(score))
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([feature]) => feature as Feature)
  return sortedFeatures
}

/**
 * Calculates a relevance score (0 to 1) for each feature based on variance.
 */
function calculateFeatureRelevanceByVariance(featuresList: FeatureSet[]): Record<Feature, number> {
  const featureValues: Record<Feature, number[]> = {} as Record<Feature, number[]>
  const features = Object.keys(featuresList[0]!) as Feature[]
  features.forEach(feature => {
    featureValues[feature] = featuresList.map(fs => fs[feature])
  })

  const variances: Record<Feature, number> = {} as Record<Feature, number>
  features.forEach(feature => {
    variances[feature] = variance(featureValues[feature])
  })

  const varianceValues = Object.values(variances).filter(v => !isNaN(v))
  const maxVariance = varianceValues.length === 0 ? 1 : Math.max(...varianceValues)

  const scores: Record<Feature, number> = {} as Record<Feature, number>
  features.forEach(feature => {
    const varValue = variances[feature]
    if (isNaN(varValue) || maxVariance === 0) {
      scores[feature] = 0
    } else {
      scores[feature] = varValue / maxVariance
    }
  })

  return scores
}
