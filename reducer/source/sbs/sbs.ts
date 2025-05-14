/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import { mean, stdDev, type Feature, type FeatureSet } from '../feature/feature'

export { defaultCriterionMultiClass, getFeatureRelevanceScores, sbs }

/**
 * Sequential Backward Selection (SBS)
 *
 * Iteratively removes features from an initial set. In each step, it removes the feature
 * whose removal leads to the best performance (highest score) of the remaining feature subset,
 * according to the provided criterion function.
 *
 * @param classes An array of classes, where each class is an array of FeatureSet objects.
 * Example: `[[healthySample1, healthySample2], [faultySample1, faultySample2]]`
 * @param criterionFunc Optional: A custom criterion function for multi-class data.
 * If not provided, `defaultCriterionMultiClass` is used.
 * Signature: (subset: Feature[], allClassData: FeatureSet[][]) => number
 * @returns A list of features sorted by relevance (most relevant first).
 */
function sbs(
  classes: FeatureSet[][],
  criterionFunc?: (subset: Feature[], allClassData: FeatureSet[][]) => number,
): Feature[] {
  // Validate input and derive allPossibleFeatures
  if (!classes || classes.length === 0 || !classes[0] || classes[0].length === 0) {
    console.warn("SBS: Input 'classes' is empty or improperly structured. Cannot derive features.")
    return []
  }
  // Use the first sample of the first class to determine the set of all possible features
  const firstSampleFeatureSet = classes[0][0]
  const allPossibleFeatures = Object.keys(firstSampleFeatureSet!) as Feature[]

  if (allPossibleFeatures.length === 0) {
    console.warn('SBS: No features found in the provided data.')
    return []
  }
  // The default criterion requires at least two classes to make comparisons.
  if (classes.length < 2 && !criterionFunc) {
    console.warn('SBS: Default criterion requires at least two classes. Returning all features as is.')
    return [...allPossibleFeatures] // Or handle as an error/empty list
  }

  const effectiveCriterion = criterionFunc || defaultCriterionMultiClass

  let currentFeaturesWorkingSet = [...allPossibleFeatures]
  // Stores features in the order they are removed (from least important to more important)
  const removedFeaturesInOrder: Feature[] = []

  // Loop until only one feature is left (or a different stopping condition if specified)
  while (currentFeaturesWorkingSet.length > 1) {
    let bestScoreAfterRemoval = -Infinity
    let featureToRemoveThisIteration: Feature | null = null

    for (const candidateFeatureToRemove of currentFeaturesWorkingSet) {
      const temporarySubset = currentFeaturesWorkingSet.filter(f => f !== candidateFeatureToRemove)
      // Evaluate the temporary subset using the criterion function with the multi-class data
      const score = effectiveCriterion(temporarySubset, classes)

      if (score > bestScoreAfterRemoval) {
        bestScoreAfterRemoval = score
        featureToRemoveThisIteration = candidateFeatureToRemove
      }
      // Optional: Add tie-breaking logic here if needed
    }

    if (featureToRemoveThisIteration) {
      removedFeaturesInOrder.push(featureToRemoveThisIteration)
      currentFeaturesWorkingSet = currentFeaturesWorkingSet.filter(f => f !== featureToRemoveThisIteration)
    } else {
      // Fallback if no feature could be decisively chosen for removal
      // (e.g., all removals lead to NaN or equally bad scores)
      if (currentFeaturesWorkingSet.length > 0) {
        console.warn(
          'SBS: Could not determine an optimal feature to remove based on scores. Removing the first available feature from the current set.',
        )
        const firstFeatureInSet = currentFeaturesWorkingSet[0]
        if (firstFeatureInSet) removedFeaturesInOrder.push(firstFeatureInSet)
        else throw new Error('No feature to remove _uuid_ 33cb7ae5-8f44-44b0-a027-01724f2da8f6')
        currentFeaturesWorkingSet = currentFeaturesWorkingSet.slice(1)
      } else {
        break // Should not happen if loop condition is `> 1`
      }
    }
  }

  // Construct the final ranked list: most important (remaining) + reversed order of removal
  const finalRankedList = [
    ...currentFeaturesWorkingSet, // The most important feature(s) that were not removed
    ...removedFeaturesInOrder.reverse(), // The rest, now sorted from more to less important
  ]

  return finalRankedList
}

/**
 * Calculates relevance scores for features based on their ranking from SBS.
 * The most relevant feature gets a score of 1.0, the next (N-1)/N, ...,
 * and the least relevant feature gets a score of 1/N.
 *
 * @param rankedFeatures A list of features, sorted from most relevant to least relevant.
 * @returns A Partial Record mapping each Feature to its relevance score (0 to 1).
 */
function getFeatureRelevanceScores(rankedFeatures: Feature[]): Partial<Record<Feature, number>> {
  const scores: Partial<Record<Feature, number>> = {}
  const numFeatures = rankedFeatures.length

  if (numFeatures === 0) {
    return scores
  }

  rankedFeatures.forEach((feature, index) => {
    scores[feature] = (numFeatures - index) / numFeatures
  })

  return scores
}

/**
 * An example criterion function for multi-class separability.
 * It calculates the average pairwise class separability for a given subset of features.
 * For each pair of classes, and for each feature in the subset, it computes:
 * |mean_classA - mean_classB| / (std_classA + std_classB)
 * These scores are averaged. Higher scores indicate better overall separability.
 *
 * @param subset The subset of features to evaluate.
 * @param allClassData An array of classes, where each class is an array of FeatureSet.
 * @returns A score indicating the quality of the feature subset for multi-class separation.
 */
function defaultCriterionMultiClass(subset: Feature[], allClassData: FeatureSet[][]): number {
  if (subset.length === 0) return 0
  if (!allClassData || allClassData.length < 2) {
    // Need at least two classes to compare for separability
    return 0
  }

  let totalAveragePairwiseSeparability = 0
  let numValidPairs = 0

  for (let i = 0; i < allClassData.length; i++) {
    for (let j = i + 1; j < allClassData.length; j++) {
      const classA_Samples: FeatureSet[] = allClassData[i]!
      const classB_Samples: FeatureSet[] = allClassData[j]!

      // Ensure both classes in the pair have samples
      if (classA_Samples.length === 0 || classB_Samples.length === 0) {
        continue
      }

      let currentPairFeatureSeparabilitySum = 0
      let featuresCountInPairCalculation = 0

      for (const feature of subset) {
        const a_values = classA_Samples.map(fs => fs[feature]).filter(v => typeof v === 'number' && !isNaN(v))
        const b_values = classB_Samples.map(fs => fs[feature]).filter(v => typeof v === 'number' && !isNaN(v))

        // Need at least 2 data points in each class for the feature to reliably calculate mean and stdDev
        if (a_values.length < 2 || b_values.length < 2) {
          continue // This feature doesn't contribute to separability for this pair with current data
        }

        const mean_a = mean(a_values)
        const std_a = stdDev(a_values)
        const mean_b = mean(b_values)
        const std_b = stdDev(b_values)

        if (isNaN(mean_a) || isNaN(std_a) || isNaN(mean_b) || isNaN(std_b)) {
          continue // Problem calculating stats for this feature for this pair
        }

        const denominator = std_a + std_b
        if (denominator < 1e-9) {
          // Avoid division by zero; if stds are effectively zero
          currentPairFeatureSeparabilitySum += Math.abs(mean_a - mean_b) > 1e-9 ? 1e9 : 0 // Assign large score for perfect separation
        } else {
          currentPairFeatureSeparabilitySum += Math.abs(mean_a - mean_b) / denominator
        }
        featuresCountInPairCalculation++
      }

      if (featuresCountInPairCalculation > 0) {
        totalAveragePairwiseSeparability += currentPairFeatureSeparabilitySum / featuresCountInPairCalculation
        numValidPairs++
      }
    }
  }

  if (numValidPairs === 0) return 0 // No valid pairs found or no features yielded valid separability
  return totalAveragePairwiseSeparability / numValidPairs // Average separability score over all valid pairs
}
