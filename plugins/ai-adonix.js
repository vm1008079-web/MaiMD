import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🌵 *Adonix IA:*\n\nEscribe algo, maje...\nEjemplo:\n${usedPrefix + command} dime un chiste`);
  }

  await m.react('🧠');

  try {
    const apiURL = `https://theadonix-api.vercel.app/api/adonix?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiURL);

    if (res.headers.get('content-type')?.includes('audio/mpeg')) {
      const bufferAudio = Buffer.from(await res.arrayBuffer());

      await conn.sendMessage(m.chat, {
        audio: bufferAudio,
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: m });

      await m.react('✅');
      return;
    }

    const data = await res.json();

    if (data.imagen_generada) {
      await conn.sendMessage(m.chat, {
        image: { url: data.imagen_generada },
        caption: `🖼️ *Adonix IA generó esta imagen:*\n\n🗯️ *Pregunta:* ${data.pregunta}\n\n📌 ${data.mensaje || 'Aquí tienes tu imagen, perri'}`,
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    if (data.respuesta && typeof data.respuesta === 'string') {
      const [mensaje, ...codigo] = data.respuesta.split(/```(?:javascript|js|html)?/i);
      let respuestaFinal = `🌵 *Adonix IA:*\n\n${mensaje.trim()}`;

      if (codigo.length > 0) {
        respuestaFinal += `\n\n💻 *Código:*\n\`\`\`js\n${codigo.join('```').trim().slice(0, 3900)}\n\`\`\``;
      }

      await m.reply(respuestaFinal);
      await m.react('✅');
      return;
    }

    await m.react('❌');
    return m.reply('❌ No se pudo procesar la respuesta de Adonix IA.');

  } catch (e) {
    console.error('[ERROR ADONIX IA]', e);
    await m.react('❌');
    return m.reply(`❌ Error al usar Adonix IA:\n\n${e.message}`);
  }
};

handler.help = ['adonix <pregunta>'];
handler.tags = ['ia'];
handler.command = ['adonix', 'ai', 'adonixia'];

export default handler;
