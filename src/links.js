import { config } from './config.js'

const linksContainer = document.querySelector('#links')

for (let link in config.links) {
    let a = document.createElement('a')
    a.appendChild(document.createTextNode(link))
    a.href = 'https://' + config.links[link]
    linksContainer.appendChild(a)
}