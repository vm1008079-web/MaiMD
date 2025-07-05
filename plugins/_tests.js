import fetch from 'node-fetch'
import ytSearch from 'yt-search'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`📽️ Escribe el nombre del video o link\n\nEj: *${usedPrefix + command} Messi goles*`)
  }

  await conn.sendMessage(m.chat, { react: { text: '📥', key: m.key } })

  try {
    let videoUrl = ''
    let title = ''
    let thumbnail = ''
    let videoInfo = null

    // Detectar si es enlace o búsqueda
    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(text)) {
      videoUrl = text
    } else {
      let search = await ytSearch(text)
      if (!search.videos.length) return m.reply('😿 No encontré nada')
      videoInfo = search.videos[0]
      videoUrl = videoInfo.url
    }

    // Llamar a tu API
    const api = `https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(videoUrl)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json?.result?.video) return m.reply('❌ No se pudo obtener el video')

    const videoDl = json.result.video
    title = json.result.title || 'Sin título'
    thumbnail = videoInfo?.thumbnail || `https://i.ytimg.com/vi/${json.result.id || ''}/hqdefault.jpg`

    // Descargar miniatura
    let thumbBuffer = null
    try {
      thumbBuffer = (await conn.getFile(thumbnail))?.data
    } catch {
      thumbBuffer = null
    }

    // Verificar tamaño del video
    let fileData
    try {
      fileData = await conn.getFile(videoDl)
      if (!fileData || fileData.size < 15000) throw 'Video inválido'
    } catch (e) {
      return m.reply('💥 Error: El video está dañado o no se pudo obtener correctamente')
    }

    // Enviar mensaje decorado con miniatura
    const infoMsg = `
✦  *${title}*
✧  Calidad: *${json.result.quality}p*
✦  Tamaño: *${(fileData.size / 1024 / 1024).toFixed(1)} MB*
🔗  ${videoUrl}`.trim()

    await conn.sendMessage(m.chat, {
      image: thumbBuffer,
      caption: infoMsg
    }, { quoted: m })

    // Enviar video
    await conn.sendMessage(m.chat, {
      video: { url: videoDl },
      mimetype: 'video/mp4',
      caption: `🎬 *${title}*`,
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    return m.reply('⚠️ Error al descargar el video. Intenta más tarde.')
  }
}

handler.help = ['ytmp42 <nombre o link>']
handler.tags = ['downloader']
handler.command = ['ytmp42']

export default handler