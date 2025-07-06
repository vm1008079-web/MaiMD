import fetch from 'node-fetch';
import path from 'path';
import { tmpdir } from 'os';
import { createReadStream } from 'fs';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🌵 *Adonix IA :*\n\nEscribí algo we...\n📌 Usa así:\n${usedPrefix + command} dime un chiste`);
  }

  await m.react('🧠');

  try {
    const apiURL = `https://tu-dominio-o-hosting/api/adonix?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiURL);

    // Si responde audio (content-type: audio/mpeg)
    if (res.headers.get('content-type')?.includes('audio/mpeg')) {
      const audioBuffer = Buffer.from(await res.arrayBuffer());
      await conn.sendMessage(m.chat, {
        audio: audioBuffer,
        ptt: true
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // Si responde JSON
    const data = await res.json();

    // 🖼️ Imagen generada
    if (data.imagen_generada) {
      await conn.sendMessage(m.chat, {
        image: { url: data.imagen_generada },
        caption: `🖼️ *Adonix IA generó esta imagen:*\n\n🗯️ *Pregunta:* ${data.pregunta}\n\n📌 ${data.mensaje || 'aquí tenés tu imagen perri'}`,
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // 💬 Respuesta normal (texto y código)
    if (data.respuesta && typeof data.respuesta === 'string') {
      const [mensaje, ...codigo] = data.respuesta.split(/```(?:javascript|js|html)?/i);
      let respuestaFinal = `🌵 *Adonix IA :*\n\n${mensaje.trim()}`;

      if (codigo.length > 0) {
        respuestaFinal += `\n\n💻 *Código:*\n\`\`\`js\n${codigo.join('```').trim().slice(0, 3900)}\n\`\`\``;
      }

      await m.reply(respuestaFinal);
      await m.react('✅');
      return;
    }

    // ❌ Sin respuesta válida
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
