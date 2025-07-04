//Hecho por Ado github.com/Ado-rgb
import axios from 'axios'
import baileys from '@whiskeysockets/baileys'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`❀ ᰔᩚ 𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧, 𝙞𝙣𝙜𝙧𝙚𝙨𝙖 𝙡𝙤 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖𝙨 𝙗𝙪𝙨𝙘𝙖𝙧 𝙚𝙣 𝑷𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 ✧`)

  try {
    m.react('🕒')

    let results = await pins(text)
    if (!results.length) return conn.reply(m.chat, `☁︎ 𝙉𝙤 𝙨𝙚 𝙚𝙣𝙘𝙤𝙣𝙩𝙧𝙖𝙧𝙤𝙣 𝙧𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨 𝙥𝙖𝙧𝙖 «${text}»`, m)

    const medias = results.slice(0, 10).map(img => ({
      type: 'image',
      data: { url: img.hd }
    }))

    await conn.sendSylphy(m.chat, medias, {
      caption: `❀ 𝑷𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 𝑹𝒆𝒔𝒖𝒍𝒕𝒔 ❀\n\n✎ 𝘉𝘶𝘴𝘲𝘶𝘦𝘥𝘢 » 『 ${text} 』\n✧ 𝘙𝘦𝘴𝘶𝘭𝘵𝘢𝘥𝘰𝘴 » ${medias.length}\n\n❐ 𝘋𝘪𝘴𝘧𝘳𝘶𝘵𝘢 𝘭𝘢𝘴 𝘪𝘮𝘢́𝘨𝘦𝘯𝘦𝘴`,
      quoted: m
    })

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

  } catch (error) {
    conn.reply(m.chat, `☄︎ 𝙀𝙧𝙧𝙤𝙧:\n\n${error.message}`, m)
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