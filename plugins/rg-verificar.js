import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let mentionedJid = [who]
  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg')
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)

  if (user.registered === true)
    return m.reply(`『✦』Ya estás registrado.\n\n¿Quieres volver a registrarte?\nUsa *${usedPrefix}unreg* para eliminar tu registro.`)

  if (!Reg.test(text))
    return m.reply(`『✦』Formato incorrecto.\n\nUso: *${usedPrefix + command} nombre.edad*\nEjemplo: *${usedPrefix + command} ${name2}.18*`)

  let [_, name, splitter, age] = text.match(Reg)
  if (!name) return m.reply(`『✦』El nombre no puede estar vacío.`)
  if (!age) return m.reply(`『✦』La edad no puede estar vacía.`)
  if (name.length >= 100) return m.reply(`『✦』El nombre es demasiado largo.`)
  age = parseInt(age)
  if (age > 1000) return m.reply(`『✦』Wow el abuelo quiere jugar al bot.`)
  if (age < 5) return m.reply(`『✦』hay un abuelo bebé jsjsj.`)

  // Registrar datos
  user.name = name + '✓'.trim()
  user.age = age
  user.regTime = +new Date
  user.registered = true
  global.db.data.users[m.sender].coin += 40
  global.db.data.users[m.sender].exp += 300
  global.db.data.users[m.sender].joincount += 20
  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  // Mensaje de registro decorado
  let regbot = `☁︎ *Registro Exitoso ☁︎\n\n`
  regbot += `✿ Nombre: *${name}*\n`
  regbot += `✰ Edad: *${age} años*\n`
  regbot += `✧ ID: *${sn}*\n\n`
  regbot += `❀ Recompensas:\n`
  regbot += `• ⛁ *${moneda}* +40\n`
  regbot += `• ✰ Exp +300\n`
  regbot += `• ❖ Tokens +20\n\n`
  regbot += `✐ Usuario registrado por: ${botname}`

  await m.react('📩')

  // ⬇️ Enviar imagen al chat del usuario
  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: regbot,
    mentions: [m.sender]
  }, { quoted: m })

  // ⬇️ Notificación en el grupo oficial de registros
  let noti = `☁︎ *Nuevo registro ᰔᩚ*\n\n`
  noti += `✎ Usuario: wa.me/${m.sender.split('@')[0]}\n`
  noti += `✿ Nombre: *${name}*\n`
  noti += `✰ Edad: *${age} años*\n`
  noti += `✧ ID: *${sn}*`

  await conn.sendMessage('120363399440277900@g.us', {
    image: { url: pp },
    caption: noti,
    mentions: [m.sender]
  })
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler