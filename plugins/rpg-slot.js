import { delay } from "@whiskeysockets/baileys";

const handler = async (m, { args, usedPrefix, command, conn }) => {
  const fa = `${emoji} Wey poné la cantidad que vas a apostar, no seas perezoso.`;
  if (!args[0] || isNaN(args[0]) || parseInt(args[0]) <= 0) throw fa;

  const apuesta = parseInt(args[0]);
  const users = global.db.data.users[m.sender];
  const time = users.lastslot + 10000;

  if (Date.now() < time) throw `${emoji2} Espera un poco crack, vuelve en *${msToTime(time - Date.now())}* para tirar el slot otra vez.`;
  if (apuesta < 100) throw `${emoji2} Mínimo 100 XP pa jugar, no hagas trampa.`;
  if (users.exp < apuesta) throw `${emoji2} No tienes tanta XP, sigue dándole pa juntar.`;

  const emojis = ['💴', '💵', '💶'];
  const getRandomEmojis = () => {
    return Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
  };

  const initialText = `🎰 | *SLOTS* \n────────`;
  let { key } = await conn.sendMessage(m.chat, { text: initialText }, { quoted: m });

  for (let i = 0; i < 5; i++) {
    const x = getRandomEmojis();
    const y = getRandomEmojis();
    const z = getRandomEmojis();

    const animationText = `
🎰 | *SLOTS* 
────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────`;

    await conn.sendMessage(m.chat, { text: animationText, edit: key }, { quoted: m });
    await delay(300);
  }

  // Resultado final
  const x = getRandomEmojis();
  const y = getRandomEmojis();
  const z = getRandomEmojis();

  let end = '';
  if (x[0] === y[0] && y[0] === z[0]) {
    const ganancia = apuesta * 2;
    end = `${emoji} 🎉 ¡PUM! Ganaste *+${ganancia} XP* 🎁\nSos un crack.`;
    users.exp += ganancia;
  } else if (x[0] === y[0] || x[0] === z[0] || y[0] === z[0]) {
    end = `${emoji2} 😬 Casi pero no, te damos un premio consuelo de *+10 XP*.\nNo aflojes.`;
    users.exp += 10;
  } else {
    end = `${emoji4} 💀 Perdiste *-${apuesta} XP*.\nA darle de nuevo que así es la vida.`;
    users.exp -= apuesta;
  }

  users.lastslot = Date.now();

  const finalResult = `
🎰 | *SLOTS* 
────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────
🎰 | ${end}`;

  await conn.sendMessage(m.chat, { text: finalResult, edit: key }, { quoted: m });
};

handler.help = ['slot <apuesta>'];
handler.tags = ['economy'];
handler.group = true;
handler.register = true;
handler.command = ['slot'];

export default handler;

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return `${minutes}m ${seconds}s`;
}