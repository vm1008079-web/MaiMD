//Hecho por Ado github.com/Ado-rgb
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`✧ Usa así: *${usedPrefix + command} url-del-banner*`)

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

  config.banner = args[0]

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    m.reply(`✅ Banner actualizado correctamente.`)
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al guardar el banner.')
  }
}

handler.help = ['setbanner']
handler.tags = ['serbot']
handler.command = /^setbanner$/i
handler.owner = false

export default handler