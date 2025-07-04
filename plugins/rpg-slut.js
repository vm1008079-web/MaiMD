let cooldowns = {}

let handler = async (m, { conn }) => {
  const users = global.db.data.users
  const senderId = m.sender
  const senderName = conn.getName(senderId)

  let tiempo = 5 * 60
  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < tiempo * 1000) {
    let restante = segundosAHMS(Math.ceil((cooldowns[senderId] + tiempo * 1000 - Date.now()) / 1000))
    return m.reply(`✐ 𝙀𝙨𝙥𝙚𝙧𝙖 *${restante}* para usar *#slut* de nuevo ✧`)
  }

  cooldowns[senderId] = Date.now()

  let senderCoin = users[senderId].coin || 0
  let randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
  while (randomUserId === senderId) {
    randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
  }

  let randomUserCoin = users[randomUserId].coin || 0
  let min = 15, max = 50
  let amount = Math.floor(Math.random() * (max - min + 1)) + min
  let opcion = Math.floor(Math.random() * 6)

  switch (opcion) {
    case 0: {
      users[senderId].coin += amount
      users[randomUserId].coin -= amount
      conn.sendMessage(m.chat, {
        text: `❀ 𝙏𝙧𝙖𝙗𝙖𝙟𝙞𝙩𝙤 𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙖𝙙𝙤 ☁︎\n✦ Le diste placer a @${randomUserId.split("@")[0]} y te soltó *+${amount} ${moneda}* 💸\n✐ ${senderName} ahora tiene más cash ✧`,
        contextInfo: { mentionedJid: [randomUserId] }
      }, { quoted: m })
      break
    }

    case 1: {
      let perdida = Math.min(Math.floor(Math.random() * (senderCoin - min + 1)) + min, max)
      users[senderId].coin -= perdida
      m.reply(`✿ Fallaste la misión y tu cliente se quejó ✄\n𖤐 *-${perdida} ${moneda}* fueron descontados por el trauma psicológico 🧠`)
      break
    }

    case 2: {
      let ganancia = Math.min(Math.floor(Math.random() * (randomUserCoin / 2 - min + 1)) + min, max)
      users[senderId].coin += ganancia
      users[randomUserId].coin -= ganancia
      conn.sendMessage(m.chat, {
        text: `✧ Sentones entregados 💃\n❑ @${randomUserId.split("@")[0]} te dejó *+${ganancia} ${moneda}* por el "servicio premium" ☁︎\n✐ ${senderName} gana experiencia de cama 🛏️`,
        contextInfo: { mentionedJid: [randomUserId] }
      }, { quoted: m })
      break
    }

    case 3: {
      let tip = Math.floor(Math.random() * 30) + 10
      users[senderId].coin += tip
      m.reply(`✦ Propina anónima ✧\n☁︎ Recibiste *+${tip} ${moneda}*\n❀ Te dejaron una nota: *"¡Eres adorable! Sigue así Mai-chu~"*`)
      break
    }

    case 4: {
      let multa = Math.floor(Math.random() * 40) + 10
      users[senderId].coin -= multa
      m.reply(`☁︎ Te encontró la poli 🛑\n✐ *-${multa} ${moneda}* fueron cobrados como multa ✄\n❀ ¡Cuídate más la próxima vez!`)
      break
    }

    case 5: {
      let vip = Math.floor(Math.random() * 100) + 50
      users[senderId].coin += vip
      m.reply(`✿ ¡Mai VIP en acción! ☁︎\n✦ Te contrataron para un show privado y te pagaron *+${vip} ${moneda}* ✧`)
      break
    }
  }

  global.db.write()
}

handler.tags = ['rpg']
handler.help = ['slut']
handler.command = ['slut', 'protituirse']
handler.register = true
handler.group = true

export default handler

function segundosAHMS(segundos) {
  let horas = Math.floor(segundos / 3600)
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}