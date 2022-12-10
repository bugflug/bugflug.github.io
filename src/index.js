import '/src/config.js'
import '/src/util.js'
import '/src/frag.js'
import '/src/routes.js'
import '/src/router.js'
import '/src/frag.js'

import { FragInfo } from '/frags/info.js'
import { init as routerInit } from '/src/router.js'

import { Frag } from '/src/frag.js'

export const init = () => {
    // make our info bar
    new FragInfo()
        .build()
        .then(f => f.mount('#info-bar'))

    // route to the url
    routerInit()
}