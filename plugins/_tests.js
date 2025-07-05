import fetch from 'node-fetch'
import ytSearch from 'yt-search'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`📽️ Escribe el nombre del video o link de YouTube\n\nEj: *${usedPrefix + command} Messi mejores goles*`)
  }

  await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

  try {
    // Buscar video si es texto
    let videoUrl = ''
    let title = ''
    let thumbnail = ''
    let videoInfo = null

    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(text)) {
      videoUrl = text
    } else {
      let search = await ytSearch(text)
      if (!search.videos.length) return m.reply('😿 No encontré nada, intenta con otro nombre')
      videoInfo = search.videos[0]
      videoUrl = videoInfo.url
    }

    // Llamar tu API
    const api = `https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(videoUrl)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json?.result?.video) return m.reply(`❌ No se pudo obtener el video`)

    const videoDl = json.result.video
    title = json.result.title || 'Sin título'
    thumbnail = videoInfo?.thumbnail || `https://i.ytimg.com/vi/${json.result.id || ''}/maxresdefault.jpg`

    // Verificar que el video es válido (no de 11kb)
    let fileData
    try {
      fileData = await conn.getFile(videoDl)
      if (!fileData || fileData.size < 15000) throw 'Archivo dañado o muy liviano'
    } catch (e) {
      return m.reply('💥 Error: El video está dañado o no se pudo obtener correctamente.')
    }

    // Armar info decorada
    const infoMsg = `
╭━━━━〔 🎬 *VIDEO ENCONTRADO* 〕━━━━⬣
✦ Título: *${title}*
✧ Calidad: *${json.result.quality}p*
✦ Tamaño: *${(fileData.size / 1024 / 1024).toFixed(2)} MB*
✧ Archivo: *${json.result.filename || 'video.mp4'}*
╰━━━━━━━━━━━━━━━━━━━━⬣`.trim()

    await conn.reply(m.chat, infoMsg, m)

    // Enviar video
    await conn.sendMessage(m.chat, {
      video: { url: videoDl },
      mimetype: 'video/mp4',
      caption: `🎥 *${title}*`,
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    return m.reply('⚠️ Ocurrió un error al descargar el video. Intenta más tarde.')
  }
}

handler.help = ['ytmp42 <nombre o link>']
handler.tags = ['downloader']
handler.command = ['ytmp42']

export default handler