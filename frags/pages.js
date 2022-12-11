import { Frag } from '/src/frag.js'
import { el } from '/src/util.js'
import { router } from '/src/router.js'
import { routes } from '/src/routes.js'

export class FragPages extends Frag {
    path = '/frags/pages.html'
    hook = {
        build (frag) {
            // loop and append each page
            // as a link with the name as text
            el.modify('.pages', el => {
                routes.forEach(r => {
                    let a = document.createElement('a')
                    a.href = r.href
                    a.appendChild(document.createTextNode(r.name || r.href))
                    a.addEventListener('click', event => router.route(event))
                    
                    el.appendChild(a)
                })
            }, frag)
        }
    }
}