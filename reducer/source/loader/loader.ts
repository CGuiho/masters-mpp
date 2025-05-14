/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 *
 * @file loader.ts
 * @description This file contains utils to load data from files and return a Signal.
 */

import type { Signal } from '../signal/signal'

export { loadSignalFromTextBasedFile }

async function loadSignalFromTextBasedFile(fullPath: string, column: number, separator: string = ','): Promise<Signal> {
  const csv = Bun.file(fullPath)

  const content = await csv.text()
  const lines = content.split('\n')

  const signal: Signal = []

  for (const line of lines) {
    const values = line.split(separator)
    if (values.length > column) {
      const value = String(values[column])
      if (!isNaN(+value)) signal.push(+value)
    }
  }

  return signal
}
