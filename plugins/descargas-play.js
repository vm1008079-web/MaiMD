import fetch from "node-fetch"
import yts from 'yt-search'

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text || !text.trim()) {
      return conn.reply(m.chat, `✦ *Pon el nombre o enlace de la canción para descargar.*`, m, rcanal)
    }

    const videoIdMatch = text.match(youtubeRegexID)
    const searchQuery = videoIdMatch ? `https://youtu.be/${videoIdMatch[1]}` : text

    let searchResult = await yts(searchQuery)

    if (videoIdMatch) {
      const videoId = videoIdMatch[1]
      searchResult = searchResult.all.find(v => v.videoId === videoId) || searchResult.videos.find(v => v.videoId === videoId)
    }

    const video = searchResult.all?.[0] || searchResult.videos?.[0] || searchResult

    if (!video) {
      return conn.reply(m.chat, '*✧ No encontré resultados para esa búsqueda.*', m)
    }

    const {
      title = 'Desconocido',
      thumbnail = '',
      timestamp = 'Desconocido',
      views = 0,
      ago = 'Desconocido',
      url = '',
      author = { name: 'Desconocido' }
    } = video

    const formattedViews = formatViews(views)
    const canal = author.name || 'Desconocido'

    const infoMessage = 
`> ✧ *Canal :* ${canal}
> ✰ *Vistas :* ${formattedViews}
> ⴵ *Duración :* ${timestamp}
> ✐ *Publicado :* ${ago}
> ☁︎ *Link :* ${url}`

    let thumbData
    try {
      thumbData = (await conn.getFile(thumbnail))?.data
    } catch {
      thumbData = null
    }

    const contextInfo = {
      externalAdReply: {
        title: title,
        body: ago,
        mediaType: 1,
        previewType: 0,
        mediaUrl: url,
        sourceUrl: url,
        thumbnail: thumbData,
        renderLargerThumbnail: true,
      }
    }

    await conn.reply(m.chat, infoMessage, m, { contextInfo }, rcanal)

    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      try {
        const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`)
        const json = await res.json()
        const audioUrl = json?.result?.audio
        const audioTitle = json?.result?.title || title

        if (!audioUrl) throw new Error('No se generó enlace de audio')

        await conn.sendFile(
          m.chat,
          audioUrl,
          `${audioTitle}.mp3`,
          null,
          m,
          false,
          { mimetype: 'audio/mpeg', ptt: true }
        )
      } catch {
        return conn.reply(m.chat, '⚠️ *No pude enviar el audio, puede ser peso o error en la URL. Intenta luego.*', m)
      }
    } else if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      try {
        const res = await fetch(`https://api.stellarwa.xyz/dow/ytmp4?url=${encodeURIComponent(url)}`)
        const json = await res.json()
        const videoUrl = json?.data?.dl
        const videoTitle = json?.data?.title || title

        if (!videoUrl) throw new Error('No se generó enlace de video')

        await conn.sendFile(m.chat, videoUrl, `${videoTitle}.mp4`, title, m)
      } catch {
        return conn.reply(m.chat, '⚠️ *No pude enviar el video, puede ser peso o error en la URL. Intenta luego.*', m)
      }
    } else {
      return conn.reply(m.chat, '*✧ Comando no válido.*', m)
    }
  } catch (error) {
    return conn.reply(m.chat, `⚠️ *Error inesperado:* ${error.message || error}`, m)
  }
}

handler.command = handler.help = ['yta', 'ytmp3', 'play2', 'ytv', 'ytmp4', 'playaudio', 'mp4']
handler.tags = ['descargas']

export default handler

function formatViews(views) {
  if (typeof views !== 'number') return 'No disponible'
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}