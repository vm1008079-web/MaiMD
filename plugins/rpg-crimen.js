let cooldowns = {}

let handler = async (m, { conn }) => {
  let users = global.db.data.users
  let senderId = m.sender
  let senderName = conn.getName(senderId)

  let tiempo = 5 * 60
  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < tiempo * 1000) {
    let restante = segundosAHMS(Math.ceil((cooldowns[senderId] + tiempo * 1000 - Date.now()) / 1000))
    return m.reply(`✿ 𝙀𝙨𝙩𝙖𝙨 𝙘𝙖𝙡𝙞𝙚𝙣𝙙𝙤... ☠️\n✐ Espera *${restante}* antes de volver a delinquir o acabarás en la cárcel XD`)
  }

  cooldowns[senderId] = Date.now()

  let senderCoin = users[senderId].coin || 0
  let randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
  while (randomUserId === senderId) {
    randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
  }

  let randomUserCoin = users[randomUserId].coin || 0
  let min = 25, max = 100
  let amount = Math.floor(Math.random() * (max - min + 1)) + min
  let opcion = Math.floor(Math.random() * 7)

  let monedaIcon = '💸'

  switch (opcion) {
    case 0:
      users[senderId].coin += amount
      users[randomUserId].coin -= amount
      conn.sendMessage(m.chat, {
        text: `☁︎ 𝐂𝐫𝐢𝐦𝐞𝐧 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚𝐝𝐨 ☁︎\n\n❀ *@${randomUserId.split("@")[0]}* bajó la guardia y...\n✦ ${senderName} le vació la billetera como pro\n✧ Ganancia: *+${amount} ${moneda} ${monedaIcon}*`,
        contextInfo: { mentionedJid: [randomUserId] }
      }, { quoted: m })
      break

    case 1:
      let multa = Math.min(Math.floor(Math.random() * (senderCoin - min + 1)) + min, max)
      users[senderId].coin -= multa
      m.reply(`✿ 𝐌𝐚𝐥 𝐞𝐬𝐭𝐞𝐜𝐡𝐨 💀\n✦ Un policía encubierto te atrapó con las manos en la masa\n✧ Multa: *-${multa} ${moneda} ${monedaIcon}*`)
      break

    case 2:
      let quick = Math.min(Math.floor(Math.random() * (randomUserCoin / 2 - min + 1)) + min, max)
      users[senderId].coin += quick
      users[randomUserId].coin -= quick
      conn.sendMessage(m.chat, {
        text: `✐ 𝐑𝐨𝐛𝐨 𝐫𝐚́𝐩𝐢𝐝𝐨 ✐\n\n☁︎ Te colaste por la ventana de *@${randomUserId.split("@")[0]}*\n✦ Solo agarraste lo que había en la mesa\n✧ Ganancia: *+${quick} ${moneda} ${monedaIcon}*`,
        contextInfo: { mentionedJid: [randomUserId] }
      }, { quoted: m })
      break

    case 3:
      let hacker = Math.floor(Math.random() * 120) + 30
      users[senderId].coin += hacker
      m.reply(`✦ 𝐇𝐚𝐜𝐤𝐞𝐨 𝐞𝐱𝐢𝐭𝐨𝐬𝐨 💻\n❀ Ingresaste a un banco suizo con Kali Linux\n✧ Botín: *+${hacker} ${moneda} ${monedaIcon}*`)
      break

    case 4:
      let delatado = Math.floor(Math.random() * 80) + 15
      users[senderId].coin -= delatado
      m.reply(`✿ 𝐂𝐨𝐦𝐩𝐥𝐢𝐜𝐞 𝐭𝐫𝐚𝐢𝐝𝐨𝐫 🐀\n✦ Te vendieron por dos empanadas y 5 lempiras\n✧ Pérdida: *-${delatado} ${moneda} ${monedaIcon}*`)
      break

    case 5:
      let superGolpe = Math.floor(Math.random() * 300) + 150
      users[senderId].coin += superGolpe
      m.reply(`☄︎ 𝐄𝐥 𝐆𝐨𝐥𝐩𝐞 𝐌𝐚𝐞𝐬𝐭𝐫𝐨 ☄︎\n❀ Entraste al banco disfrazado de payaso y saliste con las mochilas llenas\n✧ Botín total: *+${superGolpe} ${moneda} ${monedaIcon}*`)
      break

    case 6:
      let karma = Math.floor(Math.random() * 50) + 20
      users[senderId].coin -= karma
      m.reply(`✿ 𝐂𝐚𝐫𝐦𝐚 𝐢𝐧𝐬𝐭𝐚𝐧𝐭𝐚́𝐧𝐞𝐨 ✦\n✦ Tropezaste al huir y se te cayó toda la feria\n✧ Perdiste: *-${karma} ${moneda} ${monedaIcon}*`)
      break
  }

  global.db.write()
}

handler.tags = ['economy']
handler.help = ['crimen']
handler.command = ['crimen', 'crime']
handler.register = true
handler.group = true

export default handler

function segundosAHMS(segundos) {
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos}m ${segundosRestantes}s`
}