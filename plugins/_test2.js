import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  let frases = [
    '🌟 Nunca dejes de brillar we',
    '😼 Hoy es un buen día pa flojear',
    '🚀 A darle que la vida es corta',
    '🍕 Si la vida te da queso... ¡haz pizza!',
    '🧠 Usa la cabeza, no solo el Wi-Fi xd'
  ]
  let frase = frases[Math.floor(Math.random() * frases.length)]

  const messageContent = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: frase
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '✨ Frase motivacional random'
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: '🔥 Sigue el canal',
                  url: 'https://whatsapp.com/channel/0029VbArz9fAO7RGy2915k3O',
                  merchant_url: 'https://whatsapp.com/channel/0029VbArz9fAO7RGy2915k3O'
                })
              }
            ]
          })
        })
      }
    }
  }

  const msg = generateWAMessageFromContent(m.chat, messageContent, {})
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.help = ['frase']
handler.tags = ['fun']
handler.command = ['fras']
handler.register = true

export default handler