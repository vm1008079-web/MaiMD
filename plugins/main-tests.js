import fs from 'fs'
import path from 'path'
import { promises as fsPromises } from 'fs'
import getSubBotConfig from '../lib/getSubBotConfig.js'

let handler = async (m, { conn, args }) => {
  const botNumber = conn.user.jid.replace(/[^0-9]/g, '') // ahora se usa el número del bot
  const isSubBot = fs.existsSync(`./JadiBots/${botNumber}`) // revisa si el BOT es Sub-Bot
  let botname = global.botname
  let banner = global.banner

  if (isSubBot) {
    const config = await getSubBotConfig(botNumber)
    if (config?.name) botname = config.name
    if (config?.banner) banner = config.banner
  }

  const userId = (m.mentionedJid && m.mentionedJid[0]) || m.sender
  const _uptime = process.uptime() * 1000
  const uptime = clockString(_uptime)
  const totalreg = Object.keys(global.db.data.users).length
  const totalCommands = Object.values(global.plugins).filter(v => v.help && v.tags).length

  const txt = `
✧･ﾟ: *✦ Hola, Soy ${botname} ✦* :･ﾟ✧
╭━━↷ 
│ ᰔᩚ Cliente *»* @${userId.split('@')[0]}
│ ☁︎ Modo *»* Público
│ ❀ Bot *»* ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Prem Bot 🅑')}
│ ✐ Actividad *»* ${uptime}
│ ✿ Usuarios *»* ${totalreg}
│ ✦ Comandos *»* ${totalCommands}
│ ✧ Baileys *»* Multi Device
│ ᰔᩚ Moneda *»* ${global.moneda}
╰──────────────────
❐ Crea tu Sub-Bot con *#qr* o *#code*
`.trim() // corté el mensaje para no repetir el texto completo aquí

  await conn.sendMessage(m.chat, {
    image: { url: banner },
    caption: txt,
    contextInfo: {
      mentionedJid: [m.sender, userId],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: global.idcanal,
        newsletterName: global.namecanal,
        serverMessageId: -1
      }
    }
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menutest']

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `${h}h ${m}m ${s}s`
}