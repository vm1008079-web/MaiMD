//Hecho por Ado github.com/Ado-rgb
import fs from 'fs'
import path from 'path'
import { promises as fsPromises } from 'fs'
import getSubBotConfig from '../lib/getSubBotConfig.js' // tu archivo que ya hiciste

let handler = async (m, { conn, args }) => {
  const senderNumber = m.sender.replace(/[^0-9]/g, '')
  const isSubBot = fs.existsSync(`./JadiBots/${senderNumber}`)
  let botname = global.botname
  let banner = global.banner

  if (isSubBot) {
    const config = await getSubBotConfig(senderNumber)
    if (config?.name) botname = config.name
    if (config?.banner) banner = config.banner
  }

  const userId = (m.mentionedJid && m.mentionedJid[0]) || m.sender
  const _uptime = process.uptime() * 1000
  const uptime = clockString(_uptime)
  const totalreg = Object.keys(global.db.data.users).length
  const totalCommands = Object.values(global.plugins).filter(v => v.help && v.tags).length

  const txt = `
🌷 𝑯𝒐𝒍𝒂! 𝑺𝒐𝒚 ${botname} ʕ•́ᴥ•̀ʔっ♡

Aquí tienes tu menú actualizado ✧

╭──────────────
│  Cliente » @${userId.split('@')[0]}
│  Sesión » ${isSubBot ? 'Sub-Bot 🅑' : 'Principal 🅥'}
│  Usuarios » ${totalreg}
│  Comandos » ${totalCommands}
│  Uptime » ${uptime}
╰──────────────

Utiliza *#help* o *#comandos* para ver todas las categorías disponibles.
`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: banner },
    caption: txt,
    contextInfo: {
      mentionedJid: [m.sender, userId]
    }
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `${h}h ${m}m ${s}s`
}