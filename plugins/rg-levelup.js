import { canLevelUp, xpRange } from '../lib/levelling.js'
import db from '../lib/database.js'

let handler = async (m, { conn }) => {
  let mentionedUser = m.mentionedJid ? m.mentionedJid[0] : null
  let citedMessage = m.quoted ? m.quoted.sender : null
  let who = mentionedUser || citedMessage || m.sender
  let name = conn.getName(who) || 'Usuario'
  let user = global.db.data.users[who]

  if (!user) {
    await conn.sendMessage(m.chat, '❐ Usuario no encontrado en la base de datos.', { quoted: m })
    return
  }

  let { min, xp } = xpRange(user.level, global.multiplier)

  let before = user.level * 1
  while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++

  if (before !== user.level) {
    let txt = `✦✰❀ᥫ᭡ *Felicidades ${name}* has subido de nivel! ✨❐✎\n\n`
    txt += `✧ *Nivel anterior:* ${before}\n`
    txt += `✧ *Nuevo nivel:* ${user.level}\n`
    txt += `✧ *Rango:* ${user.role}\n\n`
    txt += `☄︎ Sigue interactuando para subir más rápido! ☄︎`
    await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
  } else {
    let users = Object.entries(global.db.data.users).map(([key, value]) => ({ ...value, jid: key }))
    let sortedLevel = users.sort((a, b) => (b.level || 0) - (a.level || 0))
    let rank = sortedLevel.findIndex(u => u.jid === who) + 1

    let txt = `✎✐☁︎ *Info del Usuario* ᰔᩚ\n`
    txt += `✧ Nombre: *${name}*\n`
    txt += `✧ Nivel: *${user.level}*\n`
    txt += `✧ Experiencia: *${user.exp}*\n`
    txt += `✧ Rango: *${user.role}*\n`
    txt += `✧ Progreso: *${user.exp - min} / ${xp}* (${Math.floor(((user.exp - min) / xp) * 100)}%)\n`
    txt += `✧ Puesto: *#${rank}* de *${sortedLevel.length}*\n`
    txt += `✧ Comandos usados: *${user.commands || 0}*\n`
    txt += `❀ Sigue así para llegar más lejos!`

    await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
  }
}

handler.help = ['levelup', 'lvl @user']
handler.tags = ['rpg']
handler.command = ['nivel', 'lvl', 'level', 'levelup']
handler.register = true
handler.group = true

export default handler