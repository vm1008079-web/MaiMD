import ytSearch from 'yt-search'
import axios from 'axios'
import crypto from 'crypto'

const ogmp3 = {
  api: {
    base: "https://api3.apiapi.lat",
    endpoints: {
      a: "https://api5.apiapi.lat",
      b: "https://api.apiapi.lat",
      c: "https://api3.apiapi.lat"
    }
  },
  headers: {
    'authority': 'api.apiapi.lat',
    'content-type': 'application/json',
    'origin': 'https://ogmp3.lat',
    'referer': 'https://ogmp3.lat/',
    'user-agent': 'Postify/1.0.0'
  },
  formats: {
    video: ['240', '360', '480', '720', '1080']
  },
  default_fmt: {
    video: '720'
  },
  utils: {
    hash: () => crypto.randomBytes(16).toString('hex'),
    encoded: (str) => [...str].map(c => String.fromCharCode(c.charCodeAt(0) ^ 1)).join(''),
    enc_url: (url, sep = ",") => [...url].map(c => c.charCodeAt(0)).join(sep).split(sep).reverse().join(sep)
  },
  isUrl: str => {
    try {
      const u = new URL(str)
      return [/^(.+\.)?youtube\.com$/, /^youtu\.be$/].some(rx => rx.test(u.hostname)) && !u.searchParams.has("playlist")
    } catch {
      return false
    }
  },
  youtube: url => {
    const rx = [
      /watch\?v=([a-zA-Z0-9_-]{11})/,
      /embed\/([a-zA-Z0-9_-]{11})/,
      /v\/([a-zA-Z0-9_-]{11})/,
      /shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ]
    for (const r of rx) {
      const match = url.match(r)
      if (match) return match[1]
    }
    return null
  },
  request: async (endpoint, data = {}, method = 'post') => {
    try {
      const hosts = Object.values(ogmp3.api.endpoints)
      const base = hosts[Math.floor(Math.random() * hosts.length)]
      const url = endpoint.startsWith('http') ? endpoint : `${base}${endpoint}`
      const { data: res } = await axios({ method, url, data: method === 'post' ? data : undefined, headers: ogmp3.headers })
      return { status: true, code: 200, data: res }
    } catch (error) {
      return { status: false, code: error.response?.status || 500, error: error.message }
    }
  },
  checkStatus: async (id) => {
    const c = ogmp3.utils.hash(), d = ogmp3.utils.hash()
    const endpoint = `/${c}/status/${ogmp3.utils.encoded(id)}/${d}/`
    return await ogmp3.request(endpoint, { data: id })
  },
  checkProgress: async (data) => {
    let tries = 0
    while (tries < 300) {
      tries++
      const res = await ogmp3.checkStatus(data.i)
      if (!res.status) {
        await new Promise(r => setTimeout(r, 2000))
        continue
      }
      const s = res.data
      if (s.s === 'C') return s
      if (s.s === 'P') {
        await new Promise(r => setTimeout(r, 2000))
        continue
      }
      return null
    }
    return null
  },
  download: async (link, format = '720', type = 'video') => {
    if (!link || !ogmp3.isUrl(link)) return { status: false, error: '❌ Link inválido' }

    const id = ogmp3.youtube(link)
    if (!id) return { status: false, error: 'No pude sacar la ID del video' }

    const c = ogmp3.utils.hash(), d = ogmp3.utils.hash()
    const req = {
      data: ogmp3.utils.encoded(link),
      format: "1",
      referer: "https://ogmp3.cc",
      mp4Quality: format,
      userTimeZone: new Date().getTimezoneOffset().toString()
    }

    const res = await ogmp3.request(`/${c}/init/${ogmp3.utils.enc_url(link)}/${d}/`, req)
    if (!res.status) return res

    const data = res.data
    if (data.s === 'C') {
      return {
        status: true,
        result: {
          title: data.t || 'Sin título',
          download: `${ogmp3.api.base}/${ogmp3.utils.hash()}/download/${ogmp3.utils.encoded(data.i)}/${ogmp3.utils.hash()}/`,
          thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          url: link
        }
      }
    }

    const proc = await ogmp3.checkProgress(data)
    if (proc && proc.s === 'C') {
      return {
        status: true,
        result: {
          title: proc.t || 'Sin título',
          download: `${ogmp3.api.base}/${ogmp3.utils.hash()}/download/${ogmp3.utils.encoded(proc.i)}/${ogmp3.utils.hash()}/`,
          thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          url: link
        }
      }
    }

    return { status: false, error: '⛔ Falló la descarga después de varios intentos' }
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🎬 Escribe el nombre de un video\n\n📌 Ej: *${usedPrefix + command} Shakira Loba*`)

  await conn.sendMessage(m.chat, { react: { text: '📥', key: m.key } })

  let search = await ytSearch(text)
  let vid = search.videos[0]
  if (!vid) return m.reply('❌ No encontré nada')

  let res = await ogmp3.download(vid.url, '720', 'video')
  if (!res.status) return m.reply(`💥 Error: ${res.error}`)

  let { title, download, thumbnail, url } = res.result
  let thumb = null

  try {
    thumb = (await conn.getFile(thumbnail)).data
  } catch {}

  const contextInfo = {
    externalAdReply: {
      title: `🎬 ${title}`,
      body: `✦ ${vid.timestamp} | 👁️ ${vid.views.toLocaleString()} | 📅 ${vid.ago}`,
      mediaType: 1,
      previewType: 0,
      mediaUrl: url,
      sourceUrl: url,
      thumbnail: thumb,
      renderLargerThumbnail: true
    }
  }

  await conn.reply(m.chat, `✧ *Título:* ${title}\n✧ *Duración:* ${vid.timestamp}\n✧ *Vistas:* ${vid.views.toLocaleString()}\n✧ *Subido:* ${vid.ago}\n✧ *Canal:* ${vid.author.name}`, m, { contextInfo })

  await conn.sendMessage(m.chat, {
    video: { url: download },
    mimetype: 'video/mp4'
  }, { quoted: m })
}

handler.help = ['play22 <nombre>']
handler.tags = ['downloader']
handler.command = ['play22']

export default handler