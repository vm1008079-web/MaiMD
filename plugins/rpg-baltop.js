let handler = async (m, { conn, args, participants }) => {
  let users = Object.entries(global.db.data.users).map(([key, value]) => {
    return { ...value, jid: key };
  });

  let sortedLim = users.sort((a, b) => (b.coin || 0) + (b.bank || 0) - (a.coin || 0) - (a.bank || 0));
  let len = args[0] && args[0].length > 0 ? Math.min(10, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedLim.length);

  let text = `☁︎ 𝙏𝙊𝙋 *${len}* — 𝙈𝙄𝙇𝙇𝙊𝙉𝘼𝙍𝙄𝙊𝙎 𝘿𝙀 ${moneda} ✧\n`;
  text += `✦ Los más millonetas alv\n`;
  text += `✿ Datos combinando bolsillo + banco 🏦\n\n`;

  text += sortedLim.slice(0, len).map(({ jid, coin, bank }, i) => {
    let total = (coin || 0) + (bank || 0);
    let rankEmoji = ['🥇', '🥈', '🥉'][i] || '✧';
    let name = participants.some(p => jid === p.jid) ? conn.getName(jid) : `@${jid.split('@')[0]}`;
    return `${rankEmoji} *${i + 1}.* ${name}\n✧ Total: ¥${total} ${moneda}`;
  }).join(`\n\n❀─────────────────────❀\n`);

  await conn.reply(m.chat, text.trim(), m, { mentions: conn.parseMention(text) });
};

handler.help = ['baltop'];
handler.tags = ['rpg'];
handler.command = ['baltop', 'eboard'];
handler.group = true;
handler.register = true;
handler.fail = null;
handler.exp = 0;

export default handler;