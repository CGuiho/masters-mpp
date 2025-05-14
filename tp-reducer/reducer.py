"""
  @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved. 
""" 

import numpy as np


def importSignal(file_path):
  """
  Import a signal from a CSV file with columns: time, data
  Returns only the data column as a numpy array.
  
  Args:
    file_path (str): Path to the CSV file.
    
  Returns:
    np.ndarray: The signal data as a numpy array.
  """

  data = np.genfromtxt(file_path, delimiter=',', usecols=1)
  return data

def calculateIndicators(signal: np.ndarray) -> dict:  
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


signal = importSignal("./tp-equilibrator/data/1-roulement-sain/acc_00001.csv")
print(signal)

indicator = calculateIndicators(signal)
print()

