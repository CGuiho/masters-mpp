"""
  @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved. 
""" 

import numpy as np

from importer import importSignal


"""
  Interface Indicator
    Mean
    Standard Deviation
    Variance
    RMS
    Peak
    Energie
    Power
    Skewness
    Kurtosis
    Crest Factor
    K Factor
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
    "Mean": mean,
    "Standard Deviation": std_dev,
    "Variance": variance,
    "RMS": rms,
    "Peak": peak,
    "Energy": energy,
    "Power": power,
    "Skewness": skewness,
    "Kurtosis": kurtosis,
    "Crest Factor": crest_factor,
    "K Factor": k_factor
  }