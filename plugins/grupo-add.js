let handler = async (m, { conn, text }) => {
  try {
    if (!text) throw '☄︎✐ Por favor escribe el número del usuario sin "+" ni espacios.'

    if (text.includes('+')) throw '✐❀ No uses el signo *+*, solo el número seguido.'

    if (isNaN(text)) throw '❀✧ Solo números sin texto ni símbolos, ejemplo: *50499998888*'

    let group = m.chat
    let code = await conn.groupInviteCode(group)
    let link = 'https://chat.whatsapp.com/' + code
    let jid = text + '@s.whatsapp.net'

    await conn.sendMessage(jid, {
      text: `✧❀ *INVITACIÓN A GRUPO*\n\nUn usuario te invitó a unirte a este grupo:\n${link}`,
      mentions: [m.sender]
    }, { quoted: m })

    await m.reply('✰❀ Enlace de invitación enviado con éxito ☄︎')
  } catch (e) {
    await m.reply(typeof e === 'string' ? e : '☄︎✧ Error al enviar la invitación, asegúrate de que el número sea válido.')
  }
}

handler.help = ['add <número>']
handler.tags = ['group']
handler.command = ['add', 'agregar', 'añadir']
handler.group = true
handler.admin = false
handler.botAdmin = true

export default handler