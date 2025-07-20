/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import type { Feature, FeatureSet } from '../feature/feature'

export { computeFs, featureCoefficients, sbs2 }

/**
 * Compute ANOVA F-statistic for each feature across k classes.
 */
function computeFs(classes: FeatureSet[][]): Record<Feature, number> {
  const k = classes.length
  const N = classes.reduce((sum, grp) => sum + grp.length, 0)

  // assume at least one instance in at least one class
  const features = Object.keys(classes[0]![0]!) as Feature[]

  // overall means
  const grandMeans: Record<Feature, number> = {} as any
  for (const f of features) {
    let total = 0
    for (const grp of classes) {
      for (const fs of grp) total += fs[f]
    }
    grandMeans[f] = total / N
  }

  // per-class means and sizes
  const classMeans: Record<number, Record<Feature, number>> = {}
  const classSizes: number[] = []
  classes.forEach((grp, j) => {
    classSizes[j] = grp.length
    classMeans[j] = {} as any
    for (const f of features) {
      const sum = grp.reduce((acc, fs) => acc + fs[f], 0)
      classMeans[j]![f]! = sum / grp.length
    }
  })

  const Fs: Record<Feature, number> = {} as any
  for (const f of features) {
    // Between‐group sum of squares
    let ssb = 0
    for (let j = 0; j < k; j++) {
      ssb += classSizes[j]! * (classMeans[j]![f] - grandMeans[f]) ** 2
    }
    const msb = ssb / (k - 1)

    // Within‐group sum of squares
    let ssw = 0
    for (let j = 0; j < k; j++) {
      for (const fs of classes[j]!) {
        ssw += (fs[f] - classMeans[j]![f]) ** 2
      }
    }
    const msw = ssw / (N - k)

    Fs[f] = msw > 0 ? msb / msw : 0
  }

  return Fs
}

/**
 * Sequential Backward Selection → simply rank features by ANOVA F
 * @returns features sorted most → least discriminative
 */
function sbs2(classes: FeatureSet[][]): Feature[] {
  const Fs = computeFs(classes)
  return Object.entries(Fs)
    .sort(([, f1], [, f2]) => f2 - f1)
    .map(([f]) => f as Feature)
}

/**
 * Feature → normalized coefficient in [0,1]
 */
function featureCoefficients(classes: FeatureSet[][]): Record<Feature, number> {
  const Fs = computeFs(classes)
  const vals = Object.values(Fs)
  const minF = Math.min(...vals),
    maxF = Math.max(...vals)
  const coefficients: Record<Feature, number> = {} as any
  for (const [f, val] of Object.entries(Fs) as [Feature, number][]) {
    coefficients[f] = maxF > minF ? (val - minF) / (maxF - minF) : 0
  }
  return coefficients
}
