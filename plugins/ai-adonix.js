import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🤖 *Adonix IA* 🤖\n\nUsa:\n${usedPrefix + command} [tu pregunta]\n\nEjemplo:\n${usedPrefix + command} háblame para que te conteste en audio o haz un código JS que sume dos números`);
  }

  try {
    await m.react('🕒');

    // Detectar si quiere que le hable en audio
    const quiereAudio = /^(háblame|hablame|voz|audio|dime|cuéntame|pláticame|habla|dame audio)/i.test(text.trim());

    if (quiereAudio) {
      // Quitar la palabra clave para no repetirla en el texto
      let textoAudio = text.replace(/^(háblame|hablame|voz|audio|dime|cuéntame|pláticame|habla|dame audio)/i, '').trim();
      if (!textoAudio) textoAudio = 'Qué pedo we, dime qué quieres que te diga.';

      // Pedir audio a la API Loquendo con voz "Juan"
      const loquendoRes = await fetch(`https://apis-starlights-team.koyeb.app/starlight/loquendo?text=${encodeURIComponent(textoAudio)}&voice=Juan`);
      const loquendoData = await loquendoRes.json();

      if (!loquendoData.audio) {
        await m.react('❌');
        return m.reply('❌ No pude generar el audio, we.');
      }

      // Enviar audio PTT (voice note) en base64 convertido a Buffer
      await conn.sendMessage(m.chat, {
        audio: Buffer.from(loquendoData.audio, 'base64'),
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: m });

      await m.react('✅');
      return;
    }

    // Si no pidió audio, responde con texto normal desde la API Adonix
    const apiURL = `https://theadonix-api.vercel.app/api/adonix?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiURL);
    const data = await res.json();

    // Si devuelve imagen
    if (data.imagen_generada) {
      await conn.sendMessage(m.chat, {
        image: { url: data.imagen_generada },
        caption: `🖼️ *Adonix IA* generó esta imagen:\n\n📌 _${data.pregunta}_\n${data.mensaje || ''}`,
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // Si devuelve respuesta tipo texto
    if (data.respuesta && typeof data.respuesta === 'string') {
      const [mensaje, ...codigo] = data.respuesta.split(/```(?:javascript|js|html|)/i);
      let respuestaFinal = `🌵 *Adonix IA :*\n\n${mensaje.trim()}`;

      if (codigo.length > 0) {
        respuestaFinal += `\n\n💻 *Código:*\n\`\`\`js\n${codigo.join('```').trim().slice(0, 3900)}\n\`\`\``;
      }

      await m.reply(respuestaFinal);
      await m.react('✅');
      return;
    }

    // Si no trae ni imagen ni texto válido
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
