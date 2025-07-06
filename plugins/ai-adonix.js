import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🌵 *Adonix IA:*\n\nEscribí algo we\nEjemplo:\n${usedPrefix + command} dime un chiste`);
  }

  await m.react('🧠');

  try {
    const apiURL = `https://theadonix-api.vercel.app/api/adonix?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiURL);
    const contentType = res.headers.get('content-type') || '';

    const data = await res.json();
    console.log('[🧠 API RESPONSE]', data);

    // 🔊 AUDIO BASE64
    if (data.audio_base64) {
      const audioBuffer = Buffer.from(data.audio_base64, 'base64');

      await conn.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: m });

      await m.react('✅');
      return;
    }

    // 🖼️ IMAGEN
    if (data.imagen_generada || data.result?.image) {
      const imgUrl = data.imagen_generada || data.result.image;
      await conn.sendMessage(m.chat, {
        image: { url: imgUrl },
        caption: `🖼️ *Adonix IA generó esta imagen:*\n\n🗯️ *Pregunta:* ${data.pregunta || text}\n\n📌 ${data.mensaje || 'Aquí está tu imagen perrito'}`,
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // 💬 TEXTO
    if (data.respuesta && typeof data.respuesta === 'string') {
      const [mensaje, ...codigo] = data.respuesta.split(/```(?:javascript|js|html)?/i);
      let textoFinal = `🌵 *Adonix IA:*\n\n${mensaje.trim()}`;

      if (codigo.length) {
        textoFinal += `\n\n💻 *Código:*\n\`\`\`js\n${codigo.join('```').trim().slice(0, 3900)}\n\`\`\``;
      }

      await m.reply(textoFinal);
      await m.react('✅');
      return;
    }

    // Si nada cuadra...
    await m.react('❌');
    return m.reply('❌ No entendí qué devolver... 😿');

  } catch (e) {
    console.error('[❌ ERROR ADONIX IA]', e);
    await m.react('❌');
    return m.reply(`❌ Error usando Adonix IA:\n\n${e.message}`);
  }
};

handler.help = ['adonix <texto>'];
handler.tags = ['ia'];
handler.command = ['adonix', 'ai', 'adonixia'];

export default handler;
