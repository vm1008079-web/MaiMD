//Hecho por Ado github.com/Ado-rgb
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`✧ Usa así: *${usedPrefix + command} nuevo nombre*`)

  const senderNumber = m.sender.replace(/[^0-9]/g, '')
  const botPath = path.join('./JadiBots', senderNumber)
  const configPath = path.join(botPath, 'config.json')

  if (!fs.existsSync(botPath)) return m.reply('✧ Este comando es sólo para sub-bots.')

  let config = {}
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath))
    } catch {
      return m.reply('⚠️ Error al leer el config.json.')
    }
  }

  config.name = text.trim()

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    m.reply(`✅ Nombre del sub-bot cambiado a: *${text.trim()}*`)
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al guardar el nombre.')
  }
}

handler.help = ['setname']
handler.tags = ['serbot']
handler.command = /^setname$/i
handler.owner = false

export default handler