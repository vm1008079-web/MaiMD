let cooldowns = {}

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let tiempo = 5 * 60 // 5 minutos

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
    const tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
    return conn.reply(m.chat, `${emoji3} Ya trabajaste we, espera ⏳ *${tiempo2}* pa' no explotarte tanto.`, m)
  }

  cooldowns[m.sender] = Date.now()
  let rsl = Math.floor(Math.random() * 500)
  let resultado = `${emoji} ${pickRandom(trabajo)} *${toNum(rsl)}* ( *${rsl}* ) ${moneda} 💸`

  user.coin += rsl
  return conn.reply(m.chat, resultado, m)
}

handler.help = ['trabajar']
handler.tags = ['economy']
handler.command = ['w', 'work', 'chambear', 'chamba', 'trabajar']
handler.group = true
handler.register = true

export default handler

function toNum(number) {
  if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M'
  if (number >= 1000) return (number / 1000).toFixed(1) + 'k'
  return number.toString()
}

function segundosAHMS(segundos) {
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

// Lista rediseñada con más humor y loquesea xd
const trabajo = [
  "💅 Le hiciste manicure a un ogro y te pagó con",
  "💼 Vendiste café en el infierno por 10 min y ganaste",
  "👽 Fuiste abducido y te pagaron por estudiar tu trasero con",
  "🧽 Limpiaste el baño de Shrek y encontraste",
  "🧪 Te hiciste pasar por científico y vendiste jugo de naranja como vacuna, ganaste",
  "💄 Maquillaste a un payaso depresivo y él te dio",
  "🐟 Vendiste pescado podrido en el mercado y sacaste",
  "🕳️ Fuiste plomero y arreglaste una fuga interdimensional por",
  "🎭 Actuaste en una novela de aliens y te dieron",
  "📸 Te hiciste pasar por influencer y estafaste a alguien por",
  "🍗 Freíste pollos en Marte y te pagaron con",
  "🚗 Lavaste carros con champú de gato y ganaste",
  "🧟 Trabajaste de doble en The Walking Dead y ganaste",
  "🐔 Ayudaste a una gallina a cruzar la calle, te dio",
  "🐍 Peleaste con una serpiente en el baño y encontraste",
  "🧼 Le lavaste los calzones a Hulk y te lanzó",
  "🪦 Vendiste lápidas usadas y alguien te pagó con",
  "🍞 Vendiste panes sin gluten falsos y ganaste",
  "🎈 Vendiste globos con helio que daban risa rara y ganaste",
  "🎮 Juegaste al Free Fire en modo God y alguien te donó",
  "📦 Repartiste paquetes pero perdiste 3, igual te dieron",
  "🎲 Jugaste cartas con la muerte y te apostó",
  "🧞‍♂️ Le cumpliste deseos a un genio flojo y te dio",
  "🪿 Fuiste niñero de patos con rabia y cobraste",
  "🍕 Repartiste pizza pero te la comiste y el cliente te pagó igual con",
  "🔫 Sobreviviste a una pelea de almohadas y ganaste",
  "👾 Mataste un bug de código y te pagaron en",
  "🪖 Fuiste a la guerra pero solo a tomar fotos y te dieron",
  "🎢 Fuiste operador de montaña rusa y cobraste por los gritos",
  "💿 Vendiste cumbias satánicas en CD y sacaste"
]