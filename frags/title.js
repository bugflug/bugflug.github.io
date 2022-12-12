import { Frag, el } from '/mod/frag/index.js'
import { shuffle } from '/src/util.js'

export class FragTitle extends Frag {
    static title  = 'bugflug'.split('')
    static colors = shuffle([
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

    path = '/frags/title.html'

    constructor () {
        // guarantee enough colors
        while (FragTitle.colors.length < FragTitle.title.length) FragTitle.colors = shuffle(FragTitle.colors.concat(FragTitle.colors))
        // prevent back to back repeats
        let last
        FragTitle.colors.filter(c => {
            let t = (!(c === last))
            last = c
            return t
        })

        super()
    }

    hook = {
        build (f) {
            // create a span of colored characters in the title
            el.modify('.title', el => {
                // color loop index
                let index = 0
                // stagger the animations
                let delay = 0

                // append each char as a span
                FragTitle.title.forEach(char => {
                    let span = document.createElement('span')
                    span.appendChild(document.createTextNode(char))
        
                    // apply random colors
                    span.style.color = FragTitle.colors[index]
                    index++
    
                    // stagger the animations
                    span.style.animationDelay = delay + 's'
                    delay += 0.3
        
                    el.appendChild(span)
                })
            }, f.frag)
        }
    }
}