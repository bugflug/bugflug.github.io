import { config } from '/src/config.js'
import { routes } from '/src/routes.js'
import { asyncModify } from '/src/components.js'
import { shuffle } from '/src/util.js'


export const comInfo = {
    path: '/components/info.html',
    hook: {
        append: () => {
            // random title colors
            // from lospec.com/palette-list/pico-8
            window.textColors = window.textColors || shuffle([
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
        
            // bouncing title animation
            asyncModify('.title', true, async (el) => {
                // check if there are enough colors
                let chars = 'bugflug'.split('')
                while (window.textColors.length < chars.length) window.textColors = window.textColors.concat(window.textColors)
        
                // prevent repeat colors
                let index = 0
                let last = null
        
                // iterate the chars
                for (let char of chars) {
                    let span = document.createElement('span')
                    span.appendChild(document.createTextNode(char))
        
                    // prevent repeat colors
                    while (window.textColors[index] === last) index++
                    last = window.textColors[index]
                    span.style.color = window.textColors[index]
        
                    el.appendChild(span)
                    await new Promise(resolve => setTimeout(resolve, 200))
                }
            })
        
            // gather pages and append them
            asyncModify('.pages', true, async (el) => {
                for (let key in routes) {
                    let route = routes[key]
                    if (!route.hidden) {
                        let a = document.createElement('a')
                        a.appendChild(document.createTextNode(route.name || key))
                        a.href = key
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
}