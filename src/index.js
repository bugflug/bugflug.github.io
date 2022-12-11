import '/src/config.js'
import '/src/util.js'
import '/src/frag.js'
import '/src/routes.js'
import '/src/router.js'
import '/src/frag.js'

import { FragInfo } from '/frags/info.js'
import { routes } from '/src/routes.js'
import { Router } from '/src/router.js'

export const init = () => {
    // make our info bar
    new FragInfo()
        .build()
        .then(f => f.mount('#info-bar'))

    // route to the url
    new Router(routes).mount('main')
}