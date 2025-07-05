//Usando adonix api. 
import ytSearch from 'yt-search'
import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`> ☄︎ Pon el nombre o enlace de la canción\nEj: *${usedPrefix + command} perreando machin*`)

  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

  let search = await ytSearch(text)
  let vid = search.videos[0]

  if (!vid) return m.reply('⚡︎ No encontré nada, prueba con otro nombre')

  try {
    const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp3?url=${encodeURIComponent(vid.url)}`)
    const json = await res.json()

    if (!json?.result?.audio) return m.reply('⌦ No se pudo obtener el audio')

    const audioUrl = json.result.audio
    const title = json.result.title || vid.title
    const thumbnail = vid.thumbnail || ''

    let thumbData = null
    try {
      thumbData = (await conn.getFile(thumbnail))?.data
    } catch {
      thumbData = null
    }

    const contextInfo = {
      externalAdReply: {
        title,
        body: vid.ago,
        mediaType: 1,
        previewType: 0,
        mediaUrl: vid.url,
        sourceUrl: vid.url,
        thumbnail: thumbData,
        renderLargerThumbnail: true,
      }
    }

    const infoMsg = `
> ☄︎ *Título :* ${title}
> ✎ *Canal :* ${vid.author.name}
> ❀ *Duración :* ${vid.timestamp}
> ✧ *Vistas :* ${vid.views.toLocaleString()}
> ☁︎ *Publicado :* ${vid.ago}
> ✦ *Link :* ${vid.url}

> ✐ *Servidor :* Adonix
`.trim()

    await conn.reply(m.chat, infoMsg, m, { contextInfo })

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        ptt: true
      },
      { quoted: m }
    )
  } catch (e) {
    return m.reply('⚠️ Error al obtener la canción, intenta luego')
  }
}

handler.help = ['play <nombre>']
handler.tags = ['downloader']
handler.command = ['play', 'playaudio']

export default handler