import { FragSidebar } from '../frags/sidebar.js'
import { routes } from '../src/routes.js'
import { Router } from '../mod/frag/src/index.js'

const init = () => {
    // if the doc isnt ready yet, just execute when it is
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init)
        return
    }

    // make our info bar
    new FragSidebar()
        .target('body', 'sidebar')
        .build()
        .then(f => {
            f.mount()
            //FragSidebar.show()
        })

    // route to the url
    new Router(routes)
        .target('main', 'view')
        .update()
} ; init()