var handler = async (m, { conn, args }) => {
  if (!m.isGroup) return m.reply('❐✦ Este comando solo se usa en grupos.')

  const groupMetadata = await conn.groupMetadata(m.chat)
  const participants = groupMetadata.participants || []
  const senderJid = m.sender

  // Buscar participante usando JID o comparando el número
  const participant = participants.find(p => {
    if (p.id && p.id === senderJid) return true
    if (p.lid && senderJid.includes('@')) {
      const senderNum = senderJid.split('@')[0]
      return p.lid.includes(senderNum) // 🔥 Trampa sucia pero útil
    }
    return false
  })

  if (!participant) {
    console.log('🧪 DEBUG >> PARTICIPANTS:', participants)
    console.log('🧪 DEBUG >> SENDER:', senderJid)
    return m.reply('☁︎✐ No se encontró tu info en el grupo. WhatsApp privado detectado 🥷')
  }

  const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin'
  const isOwner = senderJid === groupMetadata.owner

  if (!isAdmin && !isOwner) {
    return m.reply('✧✿ Solo los admins o el dueño del grupo pueden usar este comando.')
  }

  // Obtener usuario a expulsar
  let user
  if (m.mentionedJid?.[0]) {
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

  const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
  const ownerBot = global.owner?.[0]?.[0] + '@s.whatsapp.net'

  if (user === conn.user.jid) return m.reply(`☄︎ No me puedo sacar a mí misma we`)
  if (user === ownerGroup) return m.reply(`✦👑 Ese es el dueño del grupo`)
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
handler.botAdmin = true

export default handler