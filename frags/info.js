import { config } from '/src/config.js'
import { routes } from '/src/routes.js'
import { asyncModify } from '/src/frag.js'
import { shuffle } from '/src/util.js'
import { Frag } from '/src/frag.js'

export class FragInfo extends Frag {
    static colors = null
    static title = 'bugflug'.split('')

    path = 'frags/info.html'

    constructor () {
        // title color randomization
        // from lospec.com/palette-list/pico-8
        if (!FragInfo.colors) {
            let colors = [
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
            ]
            while (colors.length < FragInfo.title.length) colors = colors.concat(colors)
            FragInfo.colors = shuffle(colors)
        }

        super()
    }

    mount (parent) {

        super.mount(parent)
    
        // bouncing title animation
        asyncModify('.title', true, async (el) => {
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
                while (FragInfo.colors[index] === last) index++
                last = FragInfo.colors[index]
                span.style.color = FragInfo.colors[index]

                // stagger the animations
                span.style.animationDelay = delay + 's'
                delay += 0.3
    
                el.appendChild(span)
            }
        })
    
        // gather pages and append them
        asyncModify('.pages', true, async (el) => {
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
        })
    
        // gather accounts and append them
        asyncModify('.accounts', true, async (el) => {
            for (let account of config.accounts) {
                let a = document.createElement('a')
                a.appendChild(document.createTextNode(account.site))
                a.href = 'https://' + account.url
                el.appendChild(a)
            }
        })
    }
}