import fetch from 'node-fetch'
import ytSearch from 'yt-search'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`📽️ Escribe el nombre o link del video\n\nEj: *${usedPrefix + command} Roblox Perdón*`)

  await conn.sendMessage(m.chat, { react: { text: '📡', key: m.key } })

  // Si no es URL, hace búsqueda
  let url = text
  if (!/^https?:\/\//i.test(text)) {
    let search = await ytSearch(text)
    let vid = search.videos[0]
    if (!vid) return m.reply('❌ No encontré ningún video con ese nombre')
    url = vid.url
  }

  try {
    const api = `https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json?.result?.video) return m.reply(`❌ Error: ${json.mensaje || 'No se pudo obtener el video'}`)

    const { title, video, quality, filename } = json.result

    // Miniatura
    let ytId = extractYTID(url)
    let thumb = ytId ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg` : null
    let thumbData = null
    try {
      thumbData = (await conn.getFile(thumb)).data
    } catch {}

    // contextInfo decorado
    const contextInfo = {
      externalAdReply: {
        title: title,
        body: `Calidad: ${quality}p • theadonix-api.vercel.app`,
        mediaType: 1,
        previewType: 0,
        mediaUrl: url,
        sourceUrl: url,
        thumbnail: thumbData,
        renderLargerThumbnail: true
      }
    }

    const info = `
┌─⊷ 🎬 𝙑𝙄𝘿𝙀𝙊 𝙀𝙉 𝙈𝙋𝟰
▢ ✦ Título: *${title}*
▢ ✦ Calidad: *${quality}p*
▢ ✦ Origen: *theadonix-api*
└─────────────
`.trim()

    await conn.sendMessage(m.chat, { text: info, contextInfo }, { quoted: m })

    await conn.sendMessage(m.chat, {
      video: { url: video },
      caption: `📹 *${title}*`,
      mimetype: 'video/mp4'
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    return m.reply('⚠️ Ocurrió un error al intentar obtener el video')
  }
}

function extractYTID(url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
  return match ? match[1] : null
}

handler.help = ['ytmp42 <nombre o link>']
handler.tags = ['downloader']
handler.command = ['ytmp42']

export default handler