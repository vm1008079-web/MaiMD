// code by github.com/Ado-rgb
import fetch from 'node-fetch'
import ytSearch from 'yt-search'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`> ☄︎ Pon el nombre o enlace del video\n\n📌 Ej: *${usedPrefix + command} Messi goles*`)
  }

  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

  try {
    let videoUrl = ''
    let videoInfo = null

    
    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(text)) {
      let search = await ytSearch({ query: text, pages: 1 })
      videoInfo = search.videos.find(v => v.url.includes('watch')) || search.videos[0]
      if (!videoInfo) return m.reply('😿 No encontré detalles del video')
      videoUrl = videoInfo.url
    } else {
      let search = await ytSearch(text)
      if (!search.videos.length) return m.reply('😿 No encontré nada')
      videoInfo = search.videos[0]
      videoUrl = videoInfo.url
    }

    const { title, thumbnail, timestamp } = videoInfo
    const duration = timestamp || 'Desconocida'

    
    const api = `https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(videoUrl)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json?.result?.video) return m.reply('⚠️ No se pudo descargar el video')

    const videoDl = json.result.video
    const quality = json.result.quality || 'Desconocida'

    
    let thumbBuffer
    try {
      thumbBuffer = (await conn.getFile(thumbnail))?.data
    } catch {
      thumbBuffer = null
    }

    
    let fileData
    try {
      fileData = await conn.getFile(videoDl)
      if (!fileData || fileData.size < 15000) throw 'Video dañado'
    } catch (e) {
      return m.reply('💥 Error: El video está dañado o no se pudo obtener correctamente')
    }

    
    const infoMsg = `
✦  *${title}*
✧  Duración: *${duration}*
${videoUrl}`.trim()

    
    const idcanal = global.idcanal || '123456789@newsletter'
    const namecanal = global.namecanal || 'Canal Oficial'

    
    await conn.sendMessage(m.chat, {
      image: thumbBuffer,
      caption: infoMsg,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 200,
        forwardedNewsletterMessageInfo: {
          newsletterJid: idcanal,
          serverMessageId: 100,
          newsletterName: namecanal
        }
      }
    }, { quoted: m })

    
    await conn.sendMessage(m.chat, {
      video: { url: videoDl },
      mimetype: 'video/mp4',
      caption: '',
      contextInfo: {
        isForwarded: true,
        forwardingScore: 200,
        forwardedNewsletterMessageInfo: {
          newsletterJid: idcanal,
          serverMessageId: 100,
          newsletterName: namecanal
        }
      }
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
