//Hecho por Ado github.com/Ado-rgb
import axios from 'axios'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`❀ ᰔᩚ 𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧, 𝙞𝙣𝙜𝙧𝙚𝙨𝙖 𝙡𝙤 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖𝙨 𝙗𝙪𝙨𝙘𝙖𝙧 𝙚𝙣 𝑷𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 ✧`)

  try {
    await m.react('🕒')
    let results = await pins(text)

    if (!results.length) return conn.reply(m.chat, `☁︎ 𝙉𝙤 𝙨𝙚 𝙚𝙣𝙘𝙤𝙣𝙩𝙧𝙖𝙧𝙤𝙣 𝙧𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨 𝙥𝙖𝙧𝙖 «${text}»`, m)

    const max = 5 // Cambialo si querés más o menos resultados
    for (let i = 0; i < max && i < results.length; i++) {
      await conn.sendMessage(m.chat, {
        image: { url: results[i].hd },
        caption: `✧ 𝙋𝙞𝙣 𝙣𝙪́𝙢𝙚𝙧𝙤 ${i + 1} 𝙙𝙚 ${results.length}\n❐ 𝘉𝘶𝘴𝘲𝘶𝘦𝘥𝘢: ${text}`
      }, { quoted: m })
      await new Promise(res => setTimeout(res, 1000)) // Delay de 1 segundo entre envíos
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (error) {
    console.error(error)
    conn.reply(m.chat, `☄︎ 𝙀𝙧𝙧𝙤𝙧 𝙖𝙡 𝙗𝙪𝙨𝙘𝙖𝙧 𝙚𝙣 𝙋𝙞𝙣𝙩𝙚𝙧𝙚𝙨𝙩:\n\n${error.message}`, m)
  }
}

handler.help = ['pinterest']
handler.command = ['pinterest', 'pin']
handler.tags = ['dl']
handler.register = true

export default handler

const pins = async (query) => {
  try {
    const { data } = await axios.get(`https://api.stellarwa.xyz/search/pinterest?query=${query}`)
    if (data?.status && data?.data?.length) {
      return data.data.map(item => ({
        hd: item.hd,
        mini: item.mini
      }))
    }
    return []
  } catch (error) {
    console.error("☄︎ Error al obtener imágenes de Pinterest:", error)
    return []
  }
}