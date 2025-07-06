import fetch from 'node-fetch';

// Modo voz por chat para que no sea global (podría guardarse en DB o en memoria)
const modoVozChats = new Map();

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🤖 *Adonix IA* 🤖\n\nUsa:\n${usedPrefix + command} [tu pregunta]\n\nEjemplo:\n${usedPrefix + command} haz un código JS que sume dos números`);
  }

  // Detectar comandos para activar o desactivar modo voz
  const activarVoz = /(hablame|habla conmigo|quiero que me hables|de ahora en adelante hablame|solo audio)/i.test(text);
  const desactivarVoz = /(ya no me hables en audio|hablame normal|habla normal|modo texto|quita voz)/i.test(text);

  if (activarVoz) {
    modoVozChats.set(m.chat, true);
    await m.reply('🌵 *Adonix IA* activó modo voz. De ahora en adelante te hablo solo en audio, we 😎');
    return;
  }

  if (desactivarVoz) {
    modoVozChats.delete(m.chat);
    await m.reply('🌵 *Adonix IA* modo voz desactivado. Ahora te hablo normal, compa.');
    return;
  }

  // Construir prompt mega callejero con flow para la IA
  const promptBase = `
Sos Adonix Bot, un compa callejero con flow bien mexicano-hondureño, un chavo buena onda que sabe de JS, Node.js, bots de WhatsApp, APIs, scrapers y programación.

Si te preguntan cosas de la vida, contesta con humor y frases de barrio, “qué pedo we”, “órale pues”, “tas loco”, “JAJA”.

Si te piden plugin, comando o código para bot, solo soltá el código completo, funcional y mamalón en Node.js, con:

- async handler function
- handler.command, handler.tags, handler.help, handler.register si aplica
- comentarios cortos con flow
- recomendaciones de APIs públicas chidas o scrapers (axios + cheerio, puppeteer, ytdl-core, etc)
- nada de explicaciones ni mamadas extra, puro código listo pa pegar y usar.

Buscá info donde sea, Wikipedia, Google, docs, lo que sea, no te hagas pendejo. Responde con estilo rápido y sin tantas comas ni mamadas, puro flow.

Mantén un tono relajado, burlón y sin paja.
`;

  try {
    // Mandamos la pregunta a la API con el prompt
    const response = await fetch('https://luminai.my.id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: text,
        user: 'adonix-api',
        prompt: promptBase,
        webSearchMode: true
      })
    });

    const data = await response.json();
    const replyRaw = data.result?.trim();

    if (!replyRaw) {
      await m.react('❌');
      return m.reply('❌ No pude sacar respuesta de la IA, we.');
    }

    // Si modo voz está activo en este chat
    if (modoVozChats.has(m.chat)) {
      // Primero checamos si piden código, para mandar texto normal aunque esté en modo voz
      if (/plugin|comando|handler|código|scraper|api|script|programa/i.test(text)) {
        await m.reply(replyRaw);
        return;
      }

      // Si no, mandamos audio usando la API Loquendo Juan
      const urlAudio = `https://apis-starlights-team.koyeb.app/starlight/loquendo?text=${encodeURIComponent(replyRaw)}&voice=Juan`;
      const audioRes = await fetch(urlAudio);
      const audioData = await audioRes.json();

      if (!audioData?.audio) {
        await m.reply('❌ No pude generar el audio, pero aquí te dejo la respuesta:\n\n' + replyRaw);
        return;
      }

      // Mandamos el audio en PTT (push to talk)
      await conn.sendMessage(m.chat, {
        audio: Buffer.from(audioData.audio, 'base64'),
        ptt: true
      }, { quoted: m });

      return;
    }

    // Si no está modo voz, mandamos texto normal
    // Separar mensaje y código si hay
    const [mensaje, ...codigo] = replyRaw.split(/```(?:js|javascript)?/i);
    let respuestaFinal = `🌵 *Adonix IA :*\n\n${mensaje.trim()}`;

    if (codigo.length > 0) {
      respuestaFinal += `\n\n💻 *Código:*\n\`\`\`js\n${codigo.join('```').trim().slice(0, 3900)}\n\`\`\``;
    }

    await m.reply(respuestaFinal);
    await m.react('✅');

  } catch (e) {
    console.error('[ERROR ADONIX IA]', e);
    await m.react('❌');
    return m.reply(`❌ Error al usar Adonix IA:\n\n${e.message}`);
  }
};

handler.help = ['adonix <pregunta>', 'adonix voz', 'adonix texto'];
handler.tags = ['ia'];
handler.command = ['adonix', 'ai', 'adonixia'];

export default handler;
