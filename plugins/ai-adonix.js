import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🌵 *Adonix IA:*\n\n¿Qué pedo maje? Escribe algo para que te responda, por ejemplo:\n${usedPrefix + command} dime un chiste`);
  }

  await m.react('🧠');

  try {
    const apiURL = `https://theadonix-api.vercel.app/api/adonix?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error(`API respondio con status ${res.status}`);

    const contentType = res.headers.get('content-type');

    // AUDIO base64 (tu API manda json con audio_base64)
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();

      // Si trae audio en base64
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

      // Imagen generada
      if (data.imagen_generada || data.result?.image) {
        const imgUrl = data.imagen_generada || data.result.image;
        await conn.sendMessage(m.chat, {
          image: { url: imgUrl },
          caption: `🖼️ *Adonix IA generó esta imagen:*\n\n🗯️ *Pregunta:* ${data.pregunta || text}\n\n📌 ${data.mensaje || 'Aquí está tu imagen, perro'}`,
        }, { quoted: m });
        await m.react('✅');
        return;
      }

      // Respuesta texto (normal o con código)
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

      // Si no sabe qué enviar
      await m.react('❌');
      return m.reply('❌ No pude procesar la respuesta de Adonix IA, prueba otra vez.');
    }

    // En caso raro de que la API mande audio directamente (no base64)
    if (contentType && contentType.includes('audio/mpeg')) {
      const audioBuffer = Buffer.from(await res.arrayBuffer());
      await conn.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // Por si no entra a nada, respuesta fallback
    await m.react('❌');
    return m.reply('❌ Error desconocido con Adonix IA.');

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
