"""
  @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved. 
""" 

from importer.importer import importSignal
from indicator import calculateIndicators

signal = importSignal("./tp-equilibrator/data/1-roulement-sain/acc_00001.csv")
print(signal)

indicators = calculateIndicators(signal)
print(signal)


