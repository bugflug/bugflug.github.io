import { FragSidebar } from '/frags/sidebar.js'
import { routes } from '/src/routes.js'
import { Router, Collection } from '/mod/frag/index.js'

export const init = (event) => {
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
}