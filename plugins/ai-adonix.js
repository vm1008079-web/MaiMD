import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🌵 *Adonix IA:*\n\n¿Qué pex? Escribe algo we...\nEjemplo:\n${usedPrefix + command} dime un chiste`);
  }

  await m.react('🧠');

  try {
    const apiURL = `https://theadonix-api.vercel.app/api/adonix?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiURL);
    const contentType = res.headers.get('content-type') || '';

    console.log('[🧠 API STATUS]', res.status);
    console.log('[🧠 API CONTENT-TYPE]', contentType);

    if (!res.ok) throw new Error(`API respondio con status ${res.status}`);

    // Parseamos JSON
    const data = await res.json();
    console.log('[🧠 API RESPONSE JSON]', data);

    // 🔊 Audio base64
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

    // 🖼️ Imagen generada
    if (data.imagen_generada || data.result?.image) {
      const imgUrl = data.imagen_generada || data.result.image;
      await conn.sendMessage(m.chat, {
        image: { url: imgUrl },
        caption: `🖼️ *Adonix IA generó esta imagen:*\n\n🗯️ *Pregunta:* ${data.pregunta || text}\n\n📌 ${data.mensaje || 'Aquí está tu imagen, perro'}`,
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // 📄 Texto o código
    if (data.respuesta && typeof data.respuesta === 'string') {
      const [mensaje, ...codigo] = data.respuesta.split(/```(?:javascript|js|html)?/i);
      let resp = `🌵 *Adonix IA:*\n\n${mensaje.trim()}`;

      if (codigo.length) {
        resp += `\n\n💻 *Código:*\n\`\`\`js\n${codigo.join('```').trim().slice(0, 3900)}\n\`\`\``;
      }

      await m.reply(resp);
      await m.react('✅');
      return;
    }

    // 😵 Si nada funcionó
    await m.react('❌');
    return m.reply('❌ Adonix IA no me devolvió nada entendible, we...');

  } catch (e) {
    console.error('[❌ ERROR ADONIX IA]', e);
    await m.react('❌');
    return m.reply(`❌ Error usando Adonix IA:\n\n${e.message}`);
  }
};

handler.help = ['adonix <pregunta>'];
handler.tags = ['ia'];
handler.command = ['adonix', 'ai', 'adonixia'];

export default handler;
