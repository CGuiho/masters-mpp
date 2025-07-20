/**
 * @copyright Copyright © 2025 GUIHO Technologies as represented by Cristóvão GUIHO. All Rights Reserved.
 */

import path from 'path'

export { navigateFromRoot }

/**
 * @description This function takes a pathname and returns the absolute path from the root directory.
 * @param {string} pathname - The pathname to navigate from the root directory.
 * @returns {string} - The absolute path from the root directory.
 */
function navigateFromRoot(pathname: string) {
  const currentDirectory = import.meta.dirname
  const rootDirectory = path.resolve(currentDirectory, '../')
  return path.resolve(rootDirectory, pathname)
}
