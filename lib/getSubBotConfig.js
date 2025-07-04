import fs from 'fs'
import path from 'path'

const getSubBotConfig = (sender) => {
  const senderNumber = sender.replace(/[^0-9]/g, '')
  const botPath = path.join('./JadiBots', senderNumber)
  const configPath = path.join(botPath, 'config.json')

  if (!fs.existsSync(configPath)) return null

  try {
    const config = JSON.parse(fs.readFileSync(configPath))
    return config
  } catch {
    return null
  }
}

export default getSubBotConfig