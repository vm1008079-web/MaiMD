import fs from 'fs'
import path from 'path'

export function getSubBotConfig(senderNumber) {
  const botPath = path.join('./JadiBots', senderNumber)
  const configPath = path.join(botPath, 'config.json')

  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath))
    } catch {
      return {}
    }
  }
  return {}
}