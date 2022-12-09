import '/src/config.js'
import '/src/util.js'
import '/src/frag.js'
import '/src/routes.js'
import '/src/router.js'
import '/src/frag.js'

import { FragInfo } from '/frags/info.js'
import { handleLocation } from '/src/router.js'

import { Frag } from '/src/frag.js'

export const init = async () => {
    // make our info bar
    new FragInfo().build().then(f => f.mount('#info-bar'))

    // route to the url
    await handleLocation()

    /*new Frag()
        .build()
        .then(f => { f.test() ; return f })
        .then(f => f.mount('main'))
        .then(f => { f.test() ; return f })
        .then(f => f.unmount())
        .then(f => { f.test() ; window.testfrag = f })*/
}