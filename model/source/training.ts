/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import * as fs from 'fs'
import { calculateFeatureSet, type Feature, type FeatureSet } from './feature/feature'
import { loadSignalFromTextBasedFile } from './loader/loader'
import type { TrainingObservation } from './model'
import { trainModel } from './model-training'
import { sbs } from './sbs/sbs'
import { sbs2 } from './sbs/sbs2'
import { sbs3 } from './sbs/sbs3'
import type { Signal } from './signal/signal'

type DataSource = {
  id: string
  signals: Signal[]
}

console.info('\nStarting model application...\n')
console.info('\nAuthor: Cristóvão GUIHO\n')

/**
 * Démarrage de la temporisation de l'application.
 */
console.time('Temps Totale : Application')
console.time('Temps de chargement des données.')

/**
 * Lecture des données à partir du répertoire spécifié.
 * Le répertoire contient des sous-répertoires, chacun contenant des fichiers CSV de signaux.
 * Chaque fichier CSV est chargé en tant que signal, et les signaux sont regroupés par sous-répertoire.
 * Chaque sous-répertoire constitue un mode de fonctionnement différent.
 */
console.info(`  
/**
 * Lecture des données à partir du répertoire spécifié.
 * Le répertoire contient des sous-répertoires, chacun contenant des fichiers CSV de signaux.
 * Chaque fichier CSV est chargé en tant que signal, et les signaux sont regroupés par sous-répertoire.
 * Chaque sous-répertoire constitue un mode de fonctionnement différent.
 * 
 * data/ 
 *   - mode-de-fonctionnement-1/
 *     - acc_00001.csv
 *     - acc_00002.csv
 *     - ...
 *     - acc_00070.csv
 *   - mode-de-fonctionnement-2/
 *   - mode-de-fonctionnement-3/
 *   - mode-de-fonctionnement-4/
 */
`)


console.info('🔃 Chargement de données dans la mémoire')
console.info('\n\n')
// await sleep(1000)

const rawDataDirectory = import.meta.dirname + '/data'
const dataDirectory = rawDataDirectory.replace(/\\/g, '/')
console.info('Data Directory:', dataDirectory)

const entries = fs.readdirSync(dataDirectory, { withFileTypes: true })
const subdirectories = entries.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)

const OFFSET = 10
const dataSourcesPromise = subdirectories.map(async subdirectory => {
  const subdirectoryPath = `${dataDirectory}/${subdirectory}`
  const files = fs.readdirSync(subdirectoryPath, { withFileTypes: true })
  const signalFiles = files.filter(dirent => dirent.isFile() && dirent.name.endsWith('.csv')).map(dirent => dirent.name)

  const COLUMN_OF_SIGNAL = 1
  const signalsPromise = signalFiles
    .filter((_, i) => i >= OFFSET)
    .map(file => loadSignalFromTextBasedFile(`${subdirectoryPath}/${file}`, COLUMN_OF_SIGNAL, ','))

  const signals = await Promise.all(signalsPromise)
  return { id: subdirectory, signals: signals } satisfies DataSource
})


const dataSources: DataSource[] = await Promise.all(dataSourcesPromise)

console.info(`
Les données ont été chargées dans la mémoire.
Les 10 premiers signaux de chaque mode de fonctionnement n'ont pas été pris en compte pour l'analyse.
  `)

console.timeEnd('Temps de chargement des données.')

type DataWithFeatures = {
  id: string
  features: FeatureSet[]
}

console.info('Nombre de Modes de fonctionnement :', dataSources.length)
console.info('Nombre de Signaux pour chaque mode de fonctionnement :', dataSources[0]?.signals[0]!.length)
// console.log('Data Sources :', dataSources[0]?.signals[0])

console.time('Durée du calcul des indicateurs de chaque signal')
const featuresData: DataWithFeatures[] = dataSources.map(({ id, signals }) => {
  const features = signals.map(signal => calculateFeatureSet(signal))
  return { id, features } satisfies DataWithFeatures
})
console.timeEnd('Durée du calcul des indicateurs de chaque signal')

// console.log('Data With Features:', featuresData[0]?.features.length)

console.info('\n\n')
console.info(`🔃 Calcul des indicateurs pertinents.`)
console.info('\n\n')
// await sleep(1000)

const classes = featuresData.map(({ features }) => features)
// const featuresList = featuresData.map(({ features }) => features).flat()

const NUMBER_OF_RELEVANT_FEATURES = 4

console.time('Indicateur Pertiants - Méthode 0')
const relevantFeatures2 = sbs(classes)
console.info('Indicateur Pertiants - Méthode 0:', relevantFeatures2.slice(0, NUMBER_OF_RELEVANT_FEATURES))
console.timeEnd('Indicateur Pertiants - Méthode 0')
// const relevantFeatures1 = calculateFeatureRelevanceByVarianceOrdered(featuresList)

console.time('Indicateur Pertiants - Méthode 2')
const relevantFeatures3 = sbs2(classes)
console.info('Indicateur Pertiants - Méthode 2:', relevantFeatures3.slice(0, NUMBER_OF_RELEVANT_FEATURES))
console.timeEnd('Indicateur Pertiants - Méthode 2')

console.time('Indicateur Pertiants - Méthode 3')
const relevantFeatures4 = sbs3(classes)
console.info('Indicateur Pertiants - Méthode 3:', relevantFeatures4.slice(0, NUMBER_OF_RELEVANT_FEATURES))
console.timeEnd('Indicateur Pertiants - Méthode 3')

const relevantFeatures: Feature[] = relevantFeatures4.slice(0, NUMBER_OF_RELEVANT_FEATURES)
console.log('Relevant Features:', relevantFeatures)

const relevantFeaturesFile = Bun.file(import.meta.dirname + '/relevant-features.json')
await relevantFeaturesFile.write(JSON.stringify(relevantFeatures, null, 2))

const expectation = [
  [1, 0, 0, 0], // Mode de fonctionnement 1
  [0, 1, 0, 0], // Mode de fonctionnement 2
  [0, 0, 1, 0], // Mode de fonctionnement 3
  [0, 0, 0, 1], // Mode de fonctionnement 4
]
const expectationLabels: string[] = []

const relevantData: TrainingObservation[][] = featuresData.map(({ id, features }, index) => {
  expectationLabels.push(id)
  const list: TrainingObservation[] = features.map((featureSet, i) => {
    const value: number[] = []
    for (const feature of relevantFeatures) {
      if (featureSet[feature] !== undefined) {
        value.push(featureSet[feature])
      }
    }
    return { id: `o-${index}-${i}`, value, expected: expectation[index]! } satisfies TrainingObservation
  })
  return list
})

const expectationLabelsFile = Bun.file(import.meta.dirname + '/expectation-labels.json')
await expectationLabelsFile.write(JSON.stringify(expectationLabels, null, 2))

console.log('Relevant Data length:', relevantData[0]?.length)
console.log('Relevant Data:', relevantData[0]?.[relevantData[0]?.length - 1])

console.info('\n\n')
console.info(`🔃 Répartitions de données pour entraînement et test`)
console.info('\n\n')
// await sleep(1000)

const SPLIT_RATIO = 0.8
const TOTAL_DATA_SIZE = relevantData[0]?.length!
const TRAINING_DATA_SIZE = Math.floor(TOTAL_DATA_SIZE * SPLIT_RATIO)
const TESTING_DATA_SIZE = TOTAL_DATA_SIZE - TRAINING_DATA_SIZE

const trainingDataMatrix = relevantData.map(list =>  list.slice(0, TRAINING_DATA_SIZE))

const testingDataMatrix = relevantData.map(list => list.slice(TRAINING_DATA_SIZE, TOTAL_DATA_SIZE))

console.info('Taille de données totale:', TOTAL_DATA_SIZE)
console.info('Taille de données d\'entraînement:', TRAINING_DATA_SIZE)
console.info('Taille de données de test:', TESTING_DATA_SIZE)

console.log('Training Data length:', trainingDataMatrix[0]?.length)
console.log('Training Data:', trainingDataMatrix[0]?.[0])

console.log('Testing Data length:', testingDataMatrix[0]?.length)
console.log('Testing Data:', testingDataMatrix[0]?.[0])

console.info('\n\n')
console.info(`🔃 Entraînement`)
console.info('\n\n')
// await sleep(1000)

const trainingData = trainingDataMatrix.flat()

const EPOCHS = 10_000
const LEARNING_RATE = 0.01
console.info(`Entraînement du modèle avec ${trainingData.length} observations, ${EPOCHS} epochs et un taux d'apprentissage de ${LEARNING_RATE}.`)
const model = trainModel(trainingData, EPOCHS, LEARNING_RATE)
console.info('✅ Modèle entraîné avec succès.')

const modelFile = Bun.file(import.meta.dirname + '/model.json')
await modelFile.write(JSON.stringify(model, null, 2))

console.info(`
  Vous pouvez désormais appeler le programme 'model-diagnosis.exe' pour diagnostiquer les données.
  Ce modele va prendre en compte les fichiers suivants : 
    - expectation-labels.json  
    - model.json  
    - relevant-features.json  -- les indicateurs pertinents suivants : ${relevantFeatures.join(', ')}
`)

console.timeEnd('Temps Totale : Application')
