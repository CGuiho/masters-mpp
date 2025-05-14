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

def importSignalList(dir_path):
  prefix = "acc_"

  signals = []
  for i in range(11, 70 + 1):
    file_name = f"{prefix}{i:05d}.csv"
    full_file_path = f"{dir_path}/{file_name}"
    
    data = importSignal(full_file_path)
    signals.append(data)
  return signals

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
    "mean": mean,
    "std_dev": std_dev,
    "variance": variance,
    "rms": rms,
    "peak": peak,
    "energy": energy,
    "power": power,
    "skewness": skewness,
    "kurtosis": kurtosis,
    "crest_factor": crest_factor,
    "k_factor": k_factor,
  }


def calculateIndicatorsVector(signal: np.ndarray) -> dict:  
  indicator_dict = calculateIndicators(signal)

  return [
    indicator_dict["energy"],
    indicator_dict["power"],
    indicator_dict["peak"],
    indicator_dict["mean"],

    indicator_dict["rms"],
    indicator_dict["kurtosis"],
    indicator_dict["crest_factor"],
    indicator_dict["k_factor"],
    # indicator_dict["std_dev"],
    # indicator_dict["variance"],
    # indicator_dict["skewness"],
  ]

signalMatrix1 = importSignalList("./tp-reducer/data/1-roulement-sain-pignon-sain/")
signalMatrix2 = importSignalList("./tp-reducer/data/2-roulement-defaut-pignon-sain/")
signalMatrix3 = importSignalList("./tp-reducer/data/3-roulement-sain-pignon-defaut/")
signalMatrix4 = importSignalList("./tp-reducer/data/4-roulement-defaut-pignon-defaut/")



print("signalMatrix1", len(signalMatrix1))
print("signalMatrix2", len(signalMatrix2))
print("signalMatrix3", len(signalMatrix3))
print("signalMatrix4", len(signalMatrix4))

# print("s1(t)", s1)
# print("s2(t)", s2)
# print("s3(t)", s3)
# print("s4(t)", s4)

# indicator1 = calculateIndicators(s1)
# indicator2 = calculateIndicators(s2)
# indicator3 = calculateIndicators(s3)
# indicator4 = calculateIndicators(s4)


# print(f"Mean: {indicator1['mean']}")
# print(f"Kurtosis: {indicator1['kurtosis']}")

# print(f"Mean: {indicator2['mean']}")
# print(f"Kurtosis: {indicator2['kurtosis']}")

# print(f"Mean: {indicator3['mean']}")
# print(f"Kurtosis: {indicator3['kurtosis']}")

# print(f"Mean: {indicator4['mean']}")
# print(f"Kurtosis: {indicator4['kurtosis']}")

