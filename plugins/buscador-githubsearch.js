//Hecho por Ado github.com/Ado-rgb
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {

if (!text) return conn.reply(m.chat, `✐ᰔᩚ Por favor ingresa un nombre de un repositorio GitHub.`, m)

try {
let api = `https://dark-core-api.vercel.app/api/search/github?key=api&text=${text}`
let response = await fetch(api)
let json = await response.json()
let result = json.results[0]

let txt = `❐✦ ᰔᩚ *Resultado de búsqueda GitHub*\n\n` +
`✿ *Nombre:* ${result.name}\n` +
`❀ *Owner:* ${result.creator}\n` +
`☁︎ *Estrellas:* ${result.stars}\n` +
`✎ *Forks:* ${result.forks}\n` +
`✧ *Descripción:* ${result.description}\n` +
`✧ *Creado:* ${result.createdAt}\n` +
`☄︎ *Clonar:* ${result.cloneUrl}`

let img = 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745610598914.jpeg'

conn.sendMessage(m.chat, {
  image: { url: img },
  caption: txt
}, { quoted: fkontak })

} catch (error) {
  console.error(error)
  m.reply(`☄︎ Error al buscar en GitHub: ${error.message}`)
  m.react('✖️')
}}

handler.command = ['githubsearch', 'gbsearch']
handler.help = ['githubsearch <nombre>']
handler.tags = ['internet']
handler.register = true

export default handler