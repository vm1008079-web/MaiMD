var handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  let coin = Math.floor(Math.random() * (500 - 100 + 1)) + 100
  let exp = Math.floor(Math.random() * (500 - 100 + 1)) + 100
  let d = Math.floor(Math.random() * (500 - 100 + 1)) + 100

  let time = user.lastclaim + 86400000
  if (new Date() - user.lastclaim < 7200000) {
    return conn.reply(m.chat,
      `☁️ *Ya reclamaste tu recompensa diaria*\n\n` +
      `✐ Vuelve en *${msToTime(time - new Date())}* para recibir más ✨`, m)
  }

  user.exp += exp
  user.coin += coin
  user.diamond += d
  user.lastclaim = Date.now()

  let txt = `❀ 𝙍𝙚𝙘𝙤𝙢𝙥𝙚𝙣𝙨𝙖 𝘿𝙞𝙖𝙧𝙞𝙖 - MaiBot ☁︎\n\n`
  txt += `✨ *Experiencia:* +${exp}\n`
  txt += `💎 *Diamantes:* +${d}\n`
  txt += `💸 *${moneda}:* +${coin}\n\n`
  txt += `✧ ¡Gracias por seguir jugando!`

  conn.reply(m.chat, txt, m, rcanal)
}

handler.help = ['daily', 'claim']
handler.tags = ['rpg']
handler.command = ['daily', 'diario']
handler.group = true
handler.register = true

export default handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds

  return hours + ' Horas ' + minutes + ' Minutos'
}