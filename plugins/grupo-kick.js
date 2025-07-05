var handler = async (m, { conn, args }) => {
  if (!m.isGroup) return m.reply('❐✦ Este comando solo se usa en grupos.')

  const groupMetadata = await conn.groupMetadata(m.chat)
  const participants = groupMetadata.participants || []
  const senderId = m.sender
  const groupOwner = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'

  // Encontrar al que ejecutó el comando en la lista de participantes
  const participant = participants.find(p => p.id === senderId)

  if (!participant) {
    return m.reply('☁︎✐ No se encontró tu info en el grupo. ¿Seguro estás aquí?')
  }

  const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin'
  const isOwner = senderId === groupOwner

  if (!isAdmin && !isOwner) {
    return m.reply('✧✿ Solo los admins o el dueño del grupo pueden usar este comando.')
  }

  // Obtener usuario a expulsar
  let user
  if (m.mentionedJid && m.mentionedJid[0]) {
    user = m.mentionedJid[0]
  } else if (m.quoted) {
    user = m.quoted.sender
  } else if (args[0]) {
    const number = args[0].replace(/[^0-9]/g, '')
    if (!number) return m.reply('☁︎⚠️ Número inválido.')
    user = number + '@s.whatsapp.net'
  } else {
    return m.reply('✐ Mencioná, respondé o escribí un número para expulsar.')
  }

  // Validar que no expulse al bot, al dueño o al dueño del bot
  const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

  if (user === conn.user.jid) return m.reply(`☄︎ No me puedo sacar a mí misma we`)
  if (user === groupOwner) return m.reply(`✦👑 Ese es el dueño del grupo`)
  if (user === ownerBot) return m.reply(`☁︎💥 Ese es el creador del bot`)

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
    await m.reply(`❀ Usuario eliminado con éxito`)
  } catch (e) {
    console.log('❌ Error al expulsar:', e)
    await m.reply(`✿ No pude expulsar al usuario. ¿El bot es admin? ¿El número existe?`)
  }
}

handler.help = ['kick']
handler.tags = ['group']
handler.command = ['kick','echar','hechar','sacar','ban']
handler.group = true

export default handler