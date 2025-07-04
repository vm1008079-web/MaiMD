//Hecho por Ado github.com/Ado-rgb
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const senderNumber = m.sender.replace(/[^0-9]/g, '')
  const botPath = path.join('./JadiBots', senderNumber)
  const configPath = path.join(botPath, 'config.json')

  if (!fs.existsSync(botPath) || !fs.existsSync(configPath)) {
    return m.reply('✧ Este comando es sólo para sub-bots con sesión activa.')
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath))
    let txt = `✧ Configuración actual del Sub-Bot ✧\n\n`
    txt += `• Nombre: *${config.name || 'Sin nombre'}*\n`
    txt += `• Banner: ${config.banner || 'Sin banner'}\n\n`
    txt += `Usa *#setname* para cambiar el nombre.\nUsa *#setbanner* para cambiar el banner.`

    await conn.sendMessage(m.chat, {
      image: { url: config.banner || global.banner },
      caption: txt
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Error al leer la configuración.')
  }
}

handler.help = ['myconfig']
handler.tags = ['serbot']
handler.command = ['myconfig']
handler.owner = false

export default handler