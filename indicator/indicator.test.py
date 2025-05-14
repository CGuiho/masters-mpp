"""
  @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved. 
""" 

from indicator import calculateIndicators
from importer.importer import importSignal

signal = importSignal("./tp-equilibrator/data/1-roulement-sain/acc_00001.csv")
print(signal)

indicators = calculateIndicators(signal)
print(signal)


