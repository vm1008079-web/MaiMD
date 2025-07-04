import db from '../lib/database.js'

let handler = async (m, { conn, usedPrefix }) => {
  let who = m.mentionedJid && m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.quoted
    ? m.quoted.sender
    : m.sender

  if (who === conn.user.jid) return m.react('✖️')
  if (!(who in global.db.data.users))
    return m.reply(`❀ ᰔᩚ El usuario no está en mi base de datos, intenta con otro ✧`)

  let user = global.db.data.users[who]
  let total = (user.coin || 0) + (user.bank || 0)

  const texto = `
✦ ᰔᩚ ᥫ᭡ Información Económica ✿

☄︎ Usuario  » *${conn.getName(who)}*
☁︎ Dinero  » *${user.coin} ${moneda}* 💸
☁︎ Banco  » *${user.bank} ${moneda}* 💰
✎ Total   » *${total} ${moneda}* 💎

❐ ¡Para proteger tu dinero, usa #depositar y mantenlo seguro!*`

  await conn.reply(m.chat, texto.trim(), m)
}

handler.help = ['bal']
handler.tags = ['rpg']
handler.command = ['bal', 'balance', 'bank']
handler.register = true
handler.group = true

export default handler