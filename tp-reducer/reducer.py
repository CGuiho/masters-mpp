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


def calculateIndicatorsVector(signal: np.ndarray) -> list:  
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

def calculateIndicatorsMatrix(signalMatrix: list) -> list:
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
  
  return [calculateIndicatorsVector(signal) for signal in signalMatrix]

# def selectRelevantIndicatorsUsingSBS(matricesOfIndicatorMatrix: list, desiredRelevantIndicatorLength: int) -> list:
#   # initialIndicatorsLength = len(matricesOfIndicatorMatrix[0])
#   # dataLength = len(matricesOfIndicatorMatrix[0][0])

#   # finalIndicatorsLength = desiredRelevantIndicatorLength

#   # for k in range(initialRowLength):
#   #MatlabCode
# # % % définition des variable d’entrée
# # n = 70;
# # M = 3;
# # INDICATEURS_INITIAL= 8;
# # INDICATEURS_FINAL= 3;
# # %% Début du programme
# # SERIE_INDICATEUR = 1: INDICATEURS_INITIAL;
# # for K = INDICATEURS_INITIAL :-1: INDICATEURS_FINAL+1 
# #     for L = 1 : length (SERIE_INDICATEUR)
# #         %% Début de séquence de suppression des indicateurs les moins pertinents
# #         INDICATEUR_SELECT = SERIE_INDICATEUR;
# #         INDICATEUR_SELECT (L) = [];
# #         %% Calcul du critère de qualité J pour l’indicateur supprimé
# #         %% Calcul de la dispersion intra classe
# #         DISP_INTRA= 0;
# #         X={};
# #         for i = 1 : M
# #             X{i} = MATRICE_DONNEE{i}(:,INDICATEUR_SELECT);
# #             gi = mean (X{i});
# #             for j = 1 : n
# #                 Xij = X{i} (j,:);
# #                 DISP_INTRA = DISP_INTRA+(Xij-gi)*(Xij-gi)' ;
# #             end
# #         end
# #         %% Calcul de la dispersion inter classe
# #         g = 0;
# #         DISP_INTER =0;
# #         for i =1:M
# #             gi= mean (X{i});
# #             g = g + (1/M) * gi;
# #         end
# #         for i =1:M
# #             gi= mean (X{i});
# #             DISP_INTER = DISP_INTER + (gi - g)*(gi - g)';
# #         end
# #         %% Calcul du critère J
# #         J (L) = (DISP_INTER/DISP_INTRA);
# #     end
# #     %% Localisation de la positon (POS) de l’indicateur le moins pertinent
# #     POS= find(J==max(J));
# #     SERIE_INDICATEUR (POS(1)) = [];
# # end
#   return   

def selectRelevantIndicators(matricesOfIndicatorMatrix: list, desiredRelevantIndicatorLength: int) -> list:
    """
    Selects relevant indicators from a list of indicator matrices using Sequential Backward Selection (SBS).
    The criterion for removal is low variance: indicators that change the least across all samples
    in all provided matrices are removed first.

    Args:
        matricesOfIndicatorMatrix (list): 
            A list of matrices. Each matrix is expected to be a list of samples (rows), 
            where each sample is a list of numerical indicator values (columns).
            Example: [[[feat1, feat2], [feat1, feat2]], [[feat1, feat2]]]
                     (A list containing two matrices, one with 2 samples, one with 1 sample, both 2 features)
            It's assumed that all inner matrices initially have the same number of indicators (features).
        
        desiredRelevantIndicatorLength (int): 
            The target number of indicators to keep. Must be non-negative.

    Returns:
        list: 
            A list of matrices, structured like the input, but each inner matrix will 
            contain only the 'desiredRelevantIndicatorLength' most relevant indicators (columns).
            Returns empty lists or matrices with zero columns if appropriate (e.g., desired length is 0).

    Raises:
        TypeError: If inputs are not of the expected types.
        ValueError: If input matrices are inconsistent, desired length is negative,
                    or data cannot be processed.
    """


    if not isinstance(matricesOfIndicatorMatrix, list): raise TypeError("Input 'matricesOfIndicatorMatrix' must be a list.")
    if not isinstance(desiredRelevantIndicatorLength, int): raise TypeError("Input 'desiredRelevantIndicatorLength' must be an integer.")
    if desiredRelevantIndicatorLength < 0: raise ValueError("desiredRelevantIndicatorLength cannot be negative.")

    if not matricesOfIndicatorMatrix: return []

    np_matrices = []
    initial_num_indicators = -1

    for i, mat_data in enumerate(matricesOfIndicatorMatrix):
        if not isinstance(mat_data, (list, np.ndarray)): raise TypeError(f"Matrix at index {i} is not a list or NumPy array.")
        
        try:
            # Attempt to convert to float, as variance calculation requires numeric data
            current_mat_np = np.array(mat_data, dtype=float)
        except ValueError as e:
            raise ValueError(
                f"Could not convert matrix at index {i} to a numeric NumPy array. "
                f"Ensure all elements are numbers. Original error: {e}"
            )

        # Standardize shapes:
        # If mat_data was [], np.array([]) gives shape (0,), which is 1D.
        # We want it as (0, num_features) or (0,0) if num_features is unknown yet.
        if current_mat_np.ndim == 1 and current_mat_np.size == 0: # Empty list became np.array([])
            # We'll define its column count based on initial_num_indicators later if possible
            current_mat_np = np.empty((0, 0), dtype=float) # Placeholder, might get updated
        elif current_mat_np.ndim == 1 and current_mat_np.size > 0:
            # This could be a single sample list like [1, 2, 3]
            # Reshape to (1, num_features)
            current_mat_np = current_mat_np.reshape(1, -1)
        elif current_mat_np.ndim != 2 and current_mat_np.size > 0 : # Not 0, 1 or 2D, or 2D but not samples x features
            raise ValueError(f"Matrix at index {i} (shape: {current_mat_np.shape}) is not structured as samples by features.")

        np_matrices.append(current_mat_np)

        # Determine initial_num_indicators from the first matrix with columns, or any matrix
        if initial_num_indicators == -1:
            if current_mat_np.ndim == 2: # Includes (0,N) and (N,M)
                 initial_num_indicators = current_mat_np.shape[1]
            # If it's still -1 after this loop, it means all inputs were like [] or [[]] resulting in (0,0)
        elif current_mat_np.ndim == 2 and current_mat_np.shape[1] != initial_num_indicators:
            # Allow matrices with 0 samples to have a different number of columns if initial_num_indicators is already 0
            if not (current_mat_np.shape[0] == 0 and initial_num_indicators == 0 and current_mat_np.shape[1] > 0):
                 # Allow (0, K) if initial_num_indicators is K
                if not (current_mat_np.shape[0] == 0 and current_mat_np.shape[1] == initial_num_indicators):
                    raise ValueError(
                        f"All matrices must have the same number of initial indicators. "
                        f"Matrix {i} has {current_mat_np.shape[1]} indicators, "
                        f"but expected {initial_num_indicators} based on earlier matrices."
                    )
    
    if initial_num_indicators == -1: # All inputs were empty in a way that shape[1] couldn't be determined (e.g. list of [])
        initial_num_indicators = 0

    # Refine shapes of empty matrices now that initial_num_indicators is known
    for i in range(len(np_matrices)):
        if np_matrices[i].shape == (0,0) and initial_num_indicators > 0 :
            np_matrices[i] = np.empty((0, initial_num_indicators), dtype=float)
        elif np_matrices[i].ndim == 2 and np_matrices[i].shape[1] == 0 and initial_num_indicators > 0 and np_matrices[i].shape[0] > 0:
            # This case means a matrix had (N,0) but others had (M, K) where K > 0. This is an inconsistency.
            raise ValueError(f"Matrix at index {i} has 0 indicators, but expected {initial_num_indicators}.")


    if desiredRelevantIndicatorLength > initial_num_indicators:
        print(f"Warning: desiredRelevantIndicatorLength ({desiredRelevantIndicatorLength}) "
              f"is greater than the available {initial_num_indicators} indicators. "
              f"Selecting all {initial_num_indicators} indicators.")
        desiredRelevantIndicatorLength = initial_num_indicators

    # --- 2. SBS Core Logic ---
    current_indicator_indices = list(range(initial_num_indicators))
    num_indicators_to_remove = initial_num_indicators - desiredRelevantIndicatorLength

    for _ in range(num_indicators_to_remove):
        if len(current_indicator_indices) <= desiredRelevantIndicatorLength:
            break # Already reached or below target
        if not current_indicator_indices:
            break # No indicators left to remove

        indicator_variances = []
        for original_col_idx in current_indicator_indices:
            # Collect all data for this specific indicator column from all matrices
            # Ensure matrix has samples and the column index is valid for that matrix
            all_data_for_this_column = np.concatenate([
                matrix[:, original_col_idx]
                for matrix in np_matrices
                if matrix.ndim == 2 and matrix.shape[0] > 0 and matrix.shape[1] > original_col_idx
            ])

            if all_data_for_this_column.size == 0:
                # This can happen if all matrices are empty or don't have this column
                # (latter shouldn't occur if initial checks are perfect).
                # An indicator with no data "doesn't change"; assign 0 variance.
                variance = 0.0
            else:
                variance = np.var(all_data_for_this_column)
            indicator_variances.append({'original_index': original_col_idx, 'variance': variance})
        
        if not indicator_variances: # No data found for any remaining indicators
            break

        # Sort by variance (ascending). Indicators with lower variance are "less relevant" by this criterion.
        indicator_variances.sort(key=lambda x: x['variance'])
        
        # Identify the indicator to remove (the one with the smallest variance)
        indicator_to_remove_original_idx = indicator_variances[0]['original_index']
        current_indicator_indices.remove(indicator_to_remove_original_idx)

    # --- 3. Prepare Output ---
    final_selected_original_indices = sorted(current_indicator_indices) # Keep original order if possible
    output_matrices = []

    for matrix_np in np_matrices:
        if matrix_np.ndim != 2 : # Should have been standardized to 2D
             output_matrices.append([]) # Should not happen if validation is complete
             continue

        # Handle matrices that were initially empty or had no columns
        if matrix_np.shape[1] == 0: # Input matrix had 0 columns e.g. (N,0) or (0,0)
            # The number of rows should be preserved, columns will be len(final_selected_original_indices)
            # If final_selected_original_indices is also empty (e.g. desired=0), then (N,0)
            num_rows = matrix_np.shape[0]
            selected_cols_for_this_matrix = np.empty((num_rows, len(final_selected_original_indices)), dtype=float)
        else:
            # Select the determined relevant columns for this matrix
            selected_cols_for_this_matrix = matrix_np[:, final_selected_original_indices]
        
        output_matrices.append(selected_cols_for_this_matrix.tolist())
        
    return output_matrices

def neuralNetwork2LayersTraining(inputList: list, desiredOutputs: list) -> list:
  """
  Neural network 2 layers.
  No hidden layers.

  Args:
    inputList (list): List of input vectors.
    desiredOutputs (list): List of desired output vectors.
  Returns:
    list: List of weights for the neural network.
    list: List of biases for the neural network.
  """

  observationLength = len(inputList[0])
  outputLength = len(desiredOutputs[0])

  # Initialize weights
  weightsL1 = np.random.rand(observationLength, observationLength)
  biasesL1 = np.random.rand(observationLength)

  weightsL2 = np.random.rand(observationLength, outputLength)
  biasesL2 = np.random.rand(outputLength)

  learningRate = 0.01
  # Training loop
  for epoch in range(1000):
    for i in range(len(inputList)):
      # Forward pass
      inputVector = inputList[i]
      desiredOutput = desiredOutputs[i]

      # Layer 1
      layer1Output = np.dot(inputVector, weightsL1) + biasesL1
      layer1Output = np.tanh(layer1Output)

      # Layer 2
      layer2Output = np.dot(layer1Output, weightsL2) + biasesL2
      layer2Output = np.tanh(layer2Output)

      # Backward pass
      error = desiredOutput - layer2Output

      # Calculate gradients
      dLayer2 = error * (1 - layer2Output ** 2)
      dLayer1 = np.dot(dLayer2, weightsL2.T) * (1 - layer1Output ** 2)

      # Update weights and biases
      weightsL2 += learningRate * np.outer(layer1Output, dLayer2)
      biasesL2 += learningRate * dLayer2

      weightsL1 += learningRate * np.outer(inputVector, dLayer1)
      biasesL1 += learningRate * dLayer1

  return [weightsL1, biasesL1, weightsL2, biasesL2]


def neuralNetwork2LayersProduction(weights: list, inputs: list, numberOfOutputs) -> list:
  """
  Neural network with 3 inputs and 3 outputs.
  No hidden layers.
  """
  pass

def repeat_list_elements(input: list, repetitions: int) -> list:
  output_list = []
  for item in range(repetitions):
    output_list.append(item)
  return output_list


signalMatrix1 = importSignalList("./tp-reducer/data/1-roulement-sain-pignon-sain/")
signalMatrix2 = importSignalList("./tp-reducer/data/2-roulement-defaut-pignon-sain/")
signalMatrix3 = importSignalList("./tp-reducer/data/3-roulement-sain-pignon-defaut/")
signalMatrix4 = importSignalList("./tp-reducer/data/4-roulement-defaut-pignon-defaut/")

print()
print("signalMatrix1", len(signalMatrix1))
print("signalMatrix2", len(signalMatrix2))
print("signalMatrix3", len(signalMatrix3))
print("signalMatrix4", len(signalMatrix4))

indicatorMatrix1 = [calculateIndicatorsVector(signal) for signal in signalMatrix1]
indicatorMatrix2 = [calculateIndicatorsVector(signal) for signal in signalMatrix2]
indicatorMatrix3 = [calculateIndicatorsVector(signal) for signal in signalMatrix3]
indicatorMatrix4 = [calculateIndicatorsVector(signal) for signal in signalMatrix4]

print()
print("indicatorMatrix1 dimensions", len(indicatorMatrix1), len(indicatorMatrix1[0]))
print("indicatorMatrix2 dimensions", len(indicatorMatrix2), len(indicatorMatrix2[0]))
print("indicatorMatrix3 dimensions", len(indicatorMatrix3), len(indicatorMatrix3[0]))
print("indicatorMatrix4 dimensions", len(indicatorMatrix4), len(indicatorMatrix4[0]))

matrixOfIndicatorMatrices = [
  indicatorMatrix1, # 1-roulement-sain-pignon-sain
  indicatorMatrix2, # 2-roulement-defaut-pignon-sain
  indicatorMatrix3, # 3-roulement-sain-pignon-defaut
  indicatorMatrix4, # 4-roulement-defaut-pignon-defaut
]

relevantIndicatorMatrix = selectRelevantIndicators(matrixOfIndicatorMatrices, 3)

print()
print("relevantIndicatorMatrix dimensions", len(relevantIndicatorMatrix), len(relevantIndicatorMatrix[0]))
print("relevantIndicatorMatrix[0] dimensions", len(relevantIndicatorMatrix[0]), len(relevantIndicatorMatrix[0][0]))
print("relevantIndicatorMatrix[1] dimensions", len(relevantIndicatorMatrix[1]), len(relevantIndicatorMatrix[1][0]))
print("relevantIndicatorMatrix[2] dimensions", len(relevantIndicatorMatrix[2]), len(relevantIndicatorMatrix[2][0]))
print("relevantIndicatorMatrix[3] dimensions", len(relevantIndicatorMatrix[3]), len(relevantIndicatorMatrix[3][0]))

dataLength = len(relevantIndicatorMatrix[0])
splitRatio = 0.7
splitIndex = int(dataLength * splitRatio)

trainingDataMatrix = [
    relevantIndicatorMatrix[0][:splitIndex], # 1-roulement-sain-pignon-sain
    relevantIndicatorMatrix[1][:splitIndex], # 2-roulement-defaut-pignon-sain
    relevantIndicatorMatrix[2][:splitIndex], # 3-roulement-sain-pignon-defaut
    relevantIndicatorMatrix[3][:splitIndex], # 4-roulement-defaut-pignon-defaut
]
desiredOutputsMatrix = [
    repeat_list_elements([1, 0, 0], splitIndex), # 1-roulement-sain-pignon-sain
    repeat_list_elements([0, 1, 0], splitIndex), # 2-roulement-defaut-pignon-sain
    repeat_list_elements([0, 0, 1], splitIndex), # 3-roulement-sain-pignon-defaut
    repeat_list_elements([0, 0, 1], splitIndex), # 4-roulement-defaut-pignon-defaut
]

trainingData = sum(trainingDataMatrix, [])
desiredOutputs = sum(desiredOutputsMatrix, [])

testingDataMatrix = [
  relevantIndicatorMatrix[0][splitIndex:], # 1-roulement-sain-pignon-sain
  relevantIndicatorMatrix[1][splitIndex:], # 2-roulement-defaut-pignon-sain
  relevantIndicatorMatrix[2][splitIndex:], # 3-roulement-sain-pignon-defaut
  relevantIndicatorMatrix[3][splitIndex:], # 4-roulement-defaut-pignon-defaut
]
testingData = sum(testingDataMatrix, [])

print()
print("trainingDataMatrix dimensions", len(trainingDataMatrix), len(trainingDataMatrix[0]))
print("trainingData dimensions", len(trainingData), len(trainingData[0]))

print()
print("desiredOutputsMatrix dimensions", len(desiredOutputsMatrix), len(desiredOutputsMatrix[0]))
print("desiredOutputs dimensions", len(desiredOutputs), len(desiredOutputs[0]))

print()
print("testingDataMatrix dimensions", len(testingDataMatrix), len(testingDataMatrix[0]))
print("testingData dimensions", len(testingData), len(testingData[0]))
