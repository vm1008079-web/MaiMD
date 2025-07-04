import ws from 'ws'

let handler = async (m, { conn, usedPrefix }) => {
  let _uptime = process.uptime() * 1000
  let totalreg = Object.keys(global.db.data.users).length
  let totalchats = Object.keys(global.db.data.chats).length
  let uptime = clockString(_uptime)

  let users = [...new Set([...global.conns.filter(conn =>
    conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED)])]

  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'))
  const totalUsers = users.length

  let old = performance.now()
  let neww = performance.now()
  let speed = neww - old
  const used = process.memoryUsage()

  // 💌 Mensaje decorado estilo MaiBot
  let info = `❀ 𝙈𝙖𝙞𝘽𝙤𝙩 - Estado Actual ☁︎\n\n`
  info += `✦ 𝙄𝙣𝙛𝙤 𝙙𝙚 𝙨𝙞𝙨𝙩𝙚𝙢𝙖:\n`
  info += `> 👑 Creador: ${etiqueta}\n`
  info += `> 🜸 Prefijo: [ ${usedPrefix} ]\n`
  info += `> ✧ Versión: ${vs}\n\n`
  info += `✿ 𝘾𝙝𝙖𝙩𝙨 & 𝙐𝙨𝙚𝙧𝙨:\n`
  info += `> 📩 Privados: ${chats.length - groupsIn.length}\n`
  info += `> 🏷️ Total de Chats: ${chats.length}\n`
  info += `> 👤 Usuarios Registrados: ${totalreg}\n`
  info += `> 👥 Grupos: ${groupsIn.length}\n`
  info += `> 💖 Sub-Bots activos: ${totalUsers || '0'}\n\n`
  info += `✐ 𝘿𝙚𝙨𝙚𝙢𝙥𝙚𝙣̃𝙤:\n`
  info += `> ⏱️ Uptime: ${uptime}\n`
  info += `> ⚡ Velocidad: ${(speed * 1000).toFixed(0) / 1000} ms`

  await conn.sendFile(m.chat, banner, 'estado.jpg', info, m)
}

handler.help = ['estado']
handler.tags = ['info']
handler.command = ['estado', 'status', 'estate', 'state', 'stado', 'stats']
handler.register = true

export default handler

function clockString(ms) {
  let seconds = Math.floor((ms / 1000) % 60)
  let minutes = Math.floor((ms / (1000 * 60)) % 60)
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  return `${hours}h ${minutes}m ${seconds}s`
}