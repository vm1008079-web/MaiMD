import ytSearch from 'yt-search'
import axios from 'axios'
import crypto from 'crypto'

const delay = ms => new Promise(r => setTimeout(r, ms))

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
    video: ['240', '360', '480', '720', '1080'],
    audio: ['64', '96', '128', '192', '256', '320']
  },

  default_fmt: {
    video: '720',
    audio: '320'
  },

  utils: {
    hash: () => {
      const array = new Uint8Array(16)
      crypto.getRandomValues(array)
      return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("")
    },

    encoded: (str) => {
      let result = ""
      for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ 1)
      }
      return result
    },

    enc_url: (url, separator = ",") => {
      const codes = []
      for (let i = 0; i < url.length; i++) {
        codes.push(url.charCodeAt(i))
      }
      return codes.join(separator).split(separator).reverse().join(separator)
    }
  },

  isUrl: str => {
    try {
      const url = new URL(str)
      const hostname = url.hostname.toLowerCase()
      const b = [/^(.+\.)?youtube\.com$/, /^(.+\.)?youtube-nocookie\.com$/, /^youtu\.be$/]
      return b.some(a => a.test(hostname)) && !url.searchParams.has("playlist")
    } catch (_) {
      return false
    }
  },

  youtube: url => {
    if (!url) return null
    const b = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ]
    for (let a of b) {
      if (a.test(url)) return url.match(a)[1]
    }
    return null
  },

  request: async (endpoint, data = {}, method = 'post') => {
    try {
      const ae = Object.values(ogmp3.api.endpoints)
      const be = ae[Math.floor(Math.random() * ae.length)]
      const fe = endpoint.startsWith('http') ? endpoint : `${be}${endpoint}`
      const { data: response } = await axios({
        method,
        url: fe,
        data: method === 'post' ? data : undefined,
        headers: ogmp3.headers
      })
      return { status: true, code: 200, data: response }
    } catch (error) {
      return { status: false, code: error.response?.status || 500, error: error.message }
    }
  },

  async checkStatus(id) {
    try {
      const c = this.utils.hash()
      const d = this.utils.hash()
      const endpoint = `/${c}/status/${this.utils.encoded(id)}/${d}/`
      const response = await this.request(endpoint, { data: id })
      return response
    } catch (error) {
      return { status: false, code: 500, error: error.message }
    }
  },

  async checkProgress(data) {
    try {
      let attempts = 0
      let maxAttempts = 300
      while (attempts < maxAttempts) {
        attempts++
        const res = await this.checkStatus(data.i)
        if (!res.status) {
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
        const stat = res.data
        if (stat.s === "C") return stat
        if (stat.s === "P") {
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
        return null
      }
      return null
    } catch (_) {
      return null
    }
  },

  download: async (link, format, type = 'video') => {
    if (!link) return { status: false, code: 400, error: "¿Dónde está el link we?" }
    if (!ogmp3.isUrl(link)) return { status: false, code: 400, error: "Eso no es un link de YouTube válido pa" }
    if (!['video', 'audio'].includes(type)) return { status: false, code: 400, error: "¿Querés audio o video loco?" }
    if (!format) format = type === 'audio' ? ogmp3.default_fmt.audio : ogmp3.default_fmt.video
    const valid_fmt = type === 'audio' ? ogmp3.formats.audio : ogmp3.formats.video
    if (!valid_fmt.includes(format)) return { status: false, code: 400, error: `Formato inválido. Opciones: ${valid_fmt.join(', ')}` }
    const id = ogmp3.youtube(link)
    if (!id) return { status: false, code: 400, error: "No pude extraer la ID del video 😿" }

    try {
      let retries = 0
      const maxRetries = 20
      while (retries < maxRetries) {
        retries++
        const c = ogmp3.utils.hash()
        const d = ogmp3.utils.hash()
        const req = {
          data: ogmp3.utils.encoded(link),
          format: type === 'audio' ? "0" : "1",
          referer: "https://ogmp3.cc",
          mp3Quality: type === 'audio' ? format : null,
          mp4Quality: type === 'video' ? format : null,
          userTimeZone: new Date().getTimezoneOffset().toString()
        }
        const resx = await ogmp3.request(`/${c}/init/${ogmp3.utils.enc_url(link)}/${d}/`, req)
        if (!resx.status) {
          if (retries === maxRetries) return resx
          continue
        }

        const data = resx.data
        if (data.le) return { status: false, code: 400, error: "Demasiado largo el video bro máx 3 horas" }
        if (data.i === "blacklisted") return { status: false, code: 429, error: "Alcanzaste el límite diario 😿" }
        if (data.e || data.i === "invalid") return { status: false, code: 400, error: "El video fue borrado o está restringido" }

        if (data.s === "C") return {
          status: true,
          code: 200,
          result: {
            title: data.t || "Sin título",
            type,
            format,
            thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
            download: `${ogmp3.api.base}/${ogmp3.utils.hash()}/download/${ogmp3.utils.encoded(data.i)}/${ogmp3.utils.hash()}/`,
            id,
            quality: format
          }
        }

        const prod = await ogmp3.checkProgress(data)
        if (prod && prod.s === "C") return {
          status: true,
          code: 200,
          result: {
            title: prod.t || "Sin título",
            type,
            format,
            thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
            download: `${ogmp3.api.base}/${ogmp3.utils.hash()}/download/${ogmp3.utils.encoded(prod.i)}/${ogmp3.utils.hash()}/`,
            id,
            quality: format
          }
        }
      }
      return { status: false, code: 500, error: "Demasiados intentos fallidos 😩" }
    } catch (error) {
      return { status: false, code: 500, error: error.message }
    }
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🎬 Escribe el nombre de un video\n\n📌 Ej: *${usedPrefix + command} Bizarrap Villano Antillano*`)

  await conn.sendMessage(m.chat, { react: { text: '🎞️', key: m.key } })

  let search = await ytSearch(text)
  let vid = search.videos[0]
  if (!vid) return m.reply('❌ No encontré nada we')

  let res = await ogmp3.download(vid.url, '720', 'video')
  if (!res.status) return m.reply(`💥 Error: ${res.error}`)

  const { title, download, thumbnail, url } = res.result

  let success = false
  let attempts = 0
  while (!success && attempts < 10) {
    try {
      const head = await axios.head(download)
      const size = parseInt(head.headers['content-length'] || '0')
      if (size > 100000) success = true
      else await delay(2000)
    } catch { await delay(2000) }
    attempts++
  }

  if (!success) return m.reply('⛔ El video no terminó de procesarse, intenta de nuevo')

  let thumb
  try {
    thumb = (await conn.getFile(thumbnail)).data
  } catch {}

  const contextInfo = {
    externalAdReply: {
      title: `🎬 ${title}`,
      body: `✦ ${vid.timestamp} | 👁️ ${vid.views.toLocaleString()} | 📅 ${vid.ago}`,
      mediaType: 1,
      previewType: 0,
      mediaUrl: vid.url,
      sourceUrl: vid.url,
      thumbnail: thumb,
      renderLargerThumbnail: true
    }
  }

  await conn.reply(m.chat, `✧ *Título:* ${title}\n✧ *Duración:* ${vid.timestamp}\n✧ *Vistas:* ${vid.views.toLocaleString()}\n✧ *Publicado:* ${vid.ago}\n✧ *Canal:* ${vid.author.name}`, m, { contextInfo })

  await conn.sendMessage(m.chat, {
    video: { url: download },
    mimetype: 'video/mp4'
  }, { quoted: m })
}

handler.help = ['play22 <nombre>']
handler.tags = ['downloader']
handler.command = ['play22']

export default handler