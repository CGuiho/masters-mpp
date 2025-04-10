import numpy as np

"""
  @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved. 
""" 


"""
  This module is responsible for extracting data from a CSV file.
  CSV shape: 
    time, data
"""


def importSignal(file_path):
  """
  Import a signal from a CSV file with columns: time, data
  Returns only the data column as a numpy array.
  
  Args:
    file_path (str): Path to the CSV file.
    
  Returns:
    np.ndarray: The signal data as a numpy array.
  """
  # Load the CSV file and extract only the data column (index 1)
  data = np.genfromtxt(file_path, delimiter=',', usecols=1)
  return data





