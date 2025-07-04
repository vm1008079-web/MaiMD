import { getSubBotConfig } from '../lib/getSubBotConfig.js'

let handler = async (m, { conn, args }) => {
  let userId = (m.mentionedJid && m.mentionedJid[0]) || m.sender
  let user = global.db.data.users[userId]
  let name = await conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let totalCommands = Object.values(global.plugins).filter(v => v.help && v.tags).length

  let senderNumber = m.sender.replace(/[^0-9]/g, '')
  let config = getSubBotConfig(senderNumber)

  // Personalización sub-bot
  let nombreBot = config.name || global.botname
  let imgMenu = config.menuImage || global.banner

  let txt = `
 Hola! Soy *${nombreBot}* (｡•̀ᴗ-)✧
Aquí tienes la lista de comandos
╭┈ ↷
│ᰔᩚ Cliente » @${userId.split('@')[0]}
│❀ Modo » Publico
│✦ Bot » ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Prem Bot 🅑')}
│ⴵ Activada » ${uptime}
│✰ Usuarios » ${totalreg}
│✧ Comandos » ${totalCommands}
│🜸 Baileys » Multi Device
╰─────────────────
... (aquí sigue todo tu texto completo del menú)
`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: imgMenu },
    caption: txt,
    contextInfo: {
      mentionedJid: [m.sender, userId],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: idcanal,
        newsletterName: namecanal,
        serverMessageId: -1,
      },
      forwardingScore: 999
    }
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler

function clockString(ms) {
  let seconds = Math.floor((ms / 1000) % 60)
  let minutes = Math.floor((ms / (1000 * 60)) % 60)
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  return `${hours}h ${minutes}m ${seconds}s`
}