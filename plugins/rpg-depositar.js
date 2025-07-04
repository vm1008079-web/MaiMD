import db from '../lib/database.js'

let handler = async (m, { args }) => {
  let user = global.db.data.users[m.sender]
  if (!args[0]) return m.reply(`❀ ᰔᩚ ¡Ey! Ingresa la cantidad de *${moneda}* que quieres depositar ✧`)

  if (args[0].toLowerCase() === 'all') {
    let count = user.coin
    if (count <= 0) return m.reply(`✦ No tienes ni un *${moneda}* pa depositar, ponle ganas ✐`)

    user.coin -= count
    user.bank += count
    return m.reply(`✿ Depositaste *${count} ${moneda}* en el banco, bien seguro y protegido ☄︎`)
  }

  if (isNaN(args[0]) || args[0] < 1) return m.reply(`☁︎ Eso no es válido, mete un número decente.\nEjemplo: *#d 25000* o *#d all*`)

  let count = parseInt(args[0])
  if (!user.coin || user.coin <= 0) return m.reply(`✧ No tienes ni un peso en la cartera, échale ganas ✎`)

  if (user.coin < count) return m.reply(`❐ Solo tienes *${user.coin} ${moneda}* en la cartera, no seas ratero ✐`)

  user.coin -= count
  user.bank += count
  await m.reply(`✦ Listo! Depositaste *${count} ${moneda}* en el banco, bien protegido ✿`)
}

handler.help = ['depositar']
handler.tags = ['rpg']
handler.command = ['deposit', 'depositar', 'd', 'aguardar']
handler.group = true
handler.register = true

export default handler