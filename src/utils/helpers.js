import fs from 'fs'

export const isEmptyDir = (dir) => {
  try {
    const files = fs.readdirSync(dir)
    return !files.length
  } catch (e) {
    throw e
  }
}
