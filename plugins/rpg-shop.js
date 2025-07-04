const xppercoin = 350;
const handler = async (m, {conn, command, args}) => {
  let count = command.replace(/^buy/i, '');
  count = count 
    ? /all/i.test(count) 
      ? Math.floor(global.db.data.users[m.sender].exp / xppercoin) 
      : parseInt(count) 
    : args[0] 
      ? parseInt(args[0]) 
      : 1;
  count = Math.max(1, count);

  if (global.db.data.users[m.sender].exp >= xppercoin * count) {
    global.db.data.users[m.sender].exp -= xppercoin * count;
    global.db.data.users[m.sender].coin += count;

    let msg = `
✦════════════════════✦
   𝗣𝗮𝗴𝗼 𝗿𝗲𝗮𝗹𝗶𝘇𝗮𝗱𝗼
✦════════════════════✦

💸 Compra exitosa: + *${count}* ${moneda}
🔥 XP gastada: - *${xppercoin * count}*

╭───────────────╮
┃  Sigue así 👑
╰───────────────╯
`.trim();

    return conn.reply(m.chat, msg, m);
  } else {
    return conn.reply(m.chat, `${emoji2} No tienes suficiente XP para comprar *${count}* ${moneda} 💸\nSigue dándole al grind! 💪`, m);
  }
};

handler.help = ['buy', 'buyall'];
handler.tags = ['economy'];
handler.command = ['buy', 'buyall'];
handler.group = true;
handler.register = true;

export default handler;