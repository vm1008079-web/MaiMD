const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];
  if (!user) throw `${emoji3} Usuario no encontrado`;

  const last = user.lastcofre || 0;
  const cooldown = 86400000;
  const tiempoRestante = last + cooldown - Date.now();

  if (tiempoRestante > 0) {
    const ms = msToTime(tiempoRestante);
    return conn.sendMessage(m.chat, {
      text: `✿ 𝐘𝐚 𝐫𝐞𝐜𝐥𝐚𝐦𝐚𝐬𝐭𝐞 𝐭𝐮 𝐂𝐨𝐟𝐫𝐞 ☁︎\n⏳ 𝐕𝐮𝐞𝐥𝐯𝐞 𝐞𝐧: *${ms}*`,
    }, { quoted: m });
  }

  const img = 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745557947304.jpeg';
  const coin = Math.floor(Math.random() * 100) + 50;
  const diamond = Math.floor(Math.random() * 40) + 10;
  const token = Math.floor(Math.random() * 15) + 5;
  const exp = Math.floor(Math.random() * 5000) + 500;

  user.coin += coin;
  user.diamonds += diamond;
  user.joincount += token;
  user.exp += exp;
  user.lastcofre = Date.now();

  const texto = `
╭━━━❰ ☁︎ 𝐂𝐨𝐟𝐫𝐞 𝐝𝐞 𝐌𝐚𝐢 ☁︎ ❱━━━╮
┃ 📦 ¡Has reclamado tu Cofre diario!
┃ ✦ Recompensas entregadas con éxito
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━❰ ✧ 𝐓𝐔 𝐋𝐎𝐎𝐓 ✧ ❱━━━╮
┃ 💸 Monedas » *+${coin} ${moneda}*
┃ 💎 Diamantes » *+${diamond}*
┃ ⚜️ Tokens » *+${token}*
┃ ✨ Exp » *+${exp}*
╰━━━━━━━━━━━━━━━━━━━━╯

✿ Usa *#inventario* para revisar tus recursos.`;

  await conn.sendFile(m.chat, img, 'cofre.jpg', texto.trim(), m);
};

handler.help = ['cofre'];
handler.tags = ['rpg'];
handler.command = ['cofre'];
handler.level = 4;
handler.group = true;
handler.register = true;

export default handler;

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  return `${hours}h ${minutes}m ${seconds}s`;
}