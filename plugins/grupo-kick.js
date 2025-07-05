var handler = async (m, { conn, args }) => {
  if (!m.isGroup) return m.reply('❐✦ Este comando solo se usa en grupos.');

  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants || []
  const senderId = m.sender;

  // Buscar si el usuario que usó el comando es admin
  const isAdmin = participants.some(p =>
    p.id === senderId &&
    (p.admin === 'admin' || p.admin === 'superadmin')
  );

  const isGroupOwner = senderId === groupMetadata.owner;

  if (!isAdmin && !isGroupOwner) {
    return m.reply('✧✿ Solo los admins o el dueño del grupo pueden usar este comando.');
  }

  // Obtener usuario a expulsar
  let user;
  if (m.mentionedJid && m.mentionedJid[0]) {
    user = m.mentionedJid[0];
  } else if (m.quoted) {
    user = m.quoted.sender;
  } else if (args[0]) {
    const number = args[0].replace(/[^0-9]/g, '');
    if (!number) return m.reply('☁︎⚠️ Número inválido.');
    user = number + '@s.whatsapp.net';
  } else {
    return m.reply('✐ Mencioná, respondé o escribí un número para expulsar.');
  }

  const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
  const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

  if (user === conn.user.jid) return m.reply(`☄︎ No me puedo sacar a mí misma we`);
  if (user === ownerGroup) return m.reply(`✦👑 Ese es el dueño del grupo`);
  if (user === ownerBot) return m.reply(`☁︎💥 Ese es el creador del bot`);

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
    await m.reply(`❀ Usuario eliminado con éxito`);
  } catch (e) {
    await m.reply(`✿ No pude expulsar al usuario. Puede que no tenga permisos o no sea válido.`);
  }
};

handler.help = ['kick'];
handler.tags = ['group'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.group = true;


export default handler;