import fs from 'fs'
import http from 'http'

export const isEmptyDir = (dir) => {
  try {
    const files = fs.readdirSync(dir)
    return !files.length
  } catch (e) {
    throw e
  }
}

export const isND = async () => {
  try {
    await http.get({
      hostname: 'git.sdp.nd',
      port: 80,
      path: '/',
      agent: false
    })
    return true
  } catch (error) {
    return false
  }
}
