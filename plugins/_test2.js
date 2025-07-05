import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  // Frases random que se van a copiar al tocar el botón
  let frases = [
    '✨ Cree en ti o te parto el hocico xd',
    '🌸 El mundo es tuyo si no te rindes we',
    '🔥 El que no arriesga no gana y el que gana... gana',
    '🧠 El conocimiento es poder, pero la práctica es clave',
    '🚀 Hoy es un buen día pa romperla'
  ]
  
  // Escoge una random
  let secret = frases[Math.floor(Math.random() * frases.length)]
  let rtx2 = `📜 Aquí tienes tu frase:\n\n${secret}`

  // Armar mensaje con botón de copiar
  const msg = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    interactiveMessage: {
      body: { text: rtx2 },
      footer: { text: 'Mai By Wirk' }, // Footer kawaii
      header: { hasMediaAttachment: false },
      nativeFlowMessage: {
        buttons: [
          {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
              display_text: ' Copiar código para vincular a subbot...              .',
              copy_code: secret
            })
          }
        ]
      }
    }
  }), { quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.help = ['frasecopy']
handler.tags = ['fun']
handler.command = ['frasecopy', 'frasecode']
handler.register = true

export default handler