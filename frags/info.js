import { config } from '/src/config.js'
import { routes } from '/src/routes.js'
import { asyncModify } from '/src/frag.js'
import { el } from '/src/util.js'
import { shuffle } from '/src/util.js'
import { Frag } from '/src/frag.js'

export const colors = shuffle([
    '#ff306c',
    '#ad005f',
    '#e04f0b',
    '#ffa200',
    '#ffe74c',
    '#ebffd4',
    '#48ff00',
    '#00cf2d',
    '#31d4e0',
    '#006ec2',
    '#1629f7',
    '#450073',
    '#8e1cc7',
    '#f018f0'
])

export class FragInfo extends Frag {
    static colors = null
    static title = 'bugflug'.split('')

    path = 'frags/info.html'
    hook = {
        constructor () {
            // title color randomization
            // from lospec.com/palette-list/pico-8
            while (colors.length < FragInfo.title.length) colors = colors.concat(colors)
            colors = shuffle(colors)
        },

        mount (parent, frag) {
            // bouncing title animation
            el.modify(el.from('.title', frag), async (el) => {
                // prevent repeat colors
                let index = 0
                let last = null
    
                // stagger the animations
                let delay = 0
        
                // iterate the chars
                for (let char of FragInfo.title) {
                    let span = document.createElement('span')
                    span.appendChild(document.createTextNode(char))
        
                    // prevent repeat colors
                    while (colors[index] === last) index++
                    last = colors[index]
                    span.style.color = colors[index]
    
                    // stagger the animations
                    span.style.animationDelay = delay + 's'
                    delay += 0.3
        
                    el.appendChild(span)
                }
            }, frag)

            // pages list
            el.modify(el.from('.pages', frag), async (el) => {
                for (let href in routes) {
                    let route = routes[href]
                    if (!route.hidden) {
                        let a = document.createElement('a')
                        a.appendChild(document.createTextNode(route.name || href))
                        a.href = href
                        a.setAttribute('onclick', 'route()')
                        el.appendChild(a)
                    }
                }
            }, frag)

            // accounts list
            el.modify(el.from('.accounts', frag), async (el) => {
                for (let account of config.accounts) {
                    let a = document.createElement('a')
                    a.appendChild(document.createTextNode(account.site))
                    a.href = 'https://' + account.url
                    el.appendChild(a)
                }
            }, frag)
        }
    }
}