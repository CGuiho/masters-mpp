"""
  @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved. 
""" 

import numpy as np

from importer import importSignal


"""
  Interface Indicator
    mean: number  -  Mean
    std_dev: number  -  Standard Deviation
    variance: number  -  Variance
    rms: number  -  RMS
    peak: number  -  Peak
    energy: number  -  Energie
    power: number  -  Power
    skewness: number  -  Skewness
    kurtosis: number  -  Kurtosis
    crest_factor: number  -  Crest Factor
    k_factor: number  -  K Factor
"""

def calculateIndicators(signal: np.ndarray) -> dict:
  mean = np.mean(signal)
  std_dev = np.std(signal)
  variance = np.var(signal)

  rms = np.sqrt(np.mean(signal**2))
  peak = np.max(np.abs(signal))
  
  energy = np.sum(signal**2)
  power = energy / len(signal)
  
  skewness = np.mean(((signal - mean) / std_dev)**3)
  kurtosis = np.mean(((signal - mean) / std_dev)**4) - 3
  
  crest_factor = peak / rms
  k_factor = peak * rms

  return {
    mean: mean,
    std_dev: std_dev,
    variance: variance,
    rms: rms,
    peak: peak,
    energy: energy,
    power: power,
    skewness: skewness,
    kurtosis: kurtosis,
    crest_factor: crest_factor,
    k_factor: k_factor,
  }
