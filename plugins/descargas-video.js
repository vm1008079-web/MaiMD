import fetch from 'node-fetch'
import ytSearch from 'yt-search'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`> Escribe el nombre del video o link\n\n📌 Ej: *${usedPrefix + command} Messi goles*`)
  }

  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

  try {
    let videoUrl = ''
    let videoInfo = null

    // Si es link directo
    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(text)) {
      let search = await ytSearch({ query: text, pages: 1 })
      videoInfo = search.videos.find(v => v.url.includes('watch')) || search.videos[0]
      if (!videoInfo) return m.reply('😿 No encontré detalles del video')
      videoUrl = videoInfo.url
    } else {
      // Si es búsqueda
      let search = await ytSearch(text)
      if (!search.videos.length) return m.reply('😿 No encontré nada')
      videoInfo = search.videos[0]
      videoUrl = videoInfo.url
    }

    const { title, thumbnail } = videoInfo

    // Usar API para descargar el video
    const api = `https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(videoUrl)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json?.result?.video) return m.reply('⚠️ No se pudo descargar el video')

    const videoDl = json.result.video
    const quality = json.result.quality || 'Desconocida'

    // Miniatura
    let thumbBuffer
    try {
      thumbBuffer = (await conn.getFile(thumbnail))?.data
    } catch {
      thumbBuffer = null
    }

    // Verificar archivo
    let fileData
    try {
      fileData = await conn.getFile(videoDl)
      if (!fileData || fileData.size < 15000) throw 'Video dañado'
    } catch (e) {
      return m.reply('💥 Error: El video está dañado o no se pudo obtener correctamente')
    }

    // Mensaje decorado con detalles de yt-search
    const infoMsg = `
✦  *${title}*
✧  Calidad: *${quality}p*
${videoUrl}`.trim()

    // Enviar info
    await conn.sendMessage(m.chat, {
      image: thumbBuffer,
      caption: infoMsg,
    }, { quoted: m })

    // Enviar video
    await conn.sendMessage(m.chat, {
      video: { url: videoDl },
      mimetype: 'video/mp4',
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    return m.reply('⚠️ Error al descargar el video. Intenta con otro 😿')
  }
}

handler.help = ['ytmp42 <nombre o link>']
handler.tags = ['downloader']
handler.command = ['play2', 'mp4', 'ytmp4']

export default handler
