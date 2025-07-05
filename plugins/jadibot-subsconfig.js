import fs from 'fs'
import path from 'path'
import getSubBotConfig from '../lib/getSubBotConfig.js'

let handler = async (m, { conn }) => {
  const dir = './JadiBots'
  if (!fs.existsSync(dir)) return m.reply('❌ No hay ningún Sub-Bot creado.')

  let subBots = fs.readdirSync(dir).filter(f => fs.existsSync(path.join(dir, f, 'config.json')))
  let personalizados = []

  for (const id of subBots) {
    const config = await getSubBotConfig(id)
    if (config?.name || config?.banner) {
      personalizados.push({
        id,
        name: config?.name || '(Sin nombre)',
        banner: config?.banner || '(Sin banner)',
      })
    }
  }

  if (!personalizados.length) return m.reply('❌ No hay Sub-Bots con nombre o banner personalizado.')

  let list = personalizados.map((b, i) => `╭─ 🧩 Sub-Bot #${i + 1}
│ 📞 Número: wa.me/${b.id}
│ 📝 Nombre: ${b.name}
│ 🖼️ Banner: ${b.banner}
╰───────────────`).join('\n\n')

  await conn.sendMessage(m.chat, { text: `📑 *Sub-Bots con configuración personalizada*\n\n${list}` }, { quoted: m })
}

handler.command = ['subsconfig', 'listconfig']
handler.help = ['subsconfig']
handler.tags = ['owner']
handler.rowner = true

export default handler