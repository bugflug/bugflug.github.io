import { Page404 } from '/pages/404.js'
import { PageHome } from '/pages/home.js'

let ro = {}
;[
    Page404,
    PageHome
].forEach(page => { if (!page.hidden) ro[page.href] = page })

export const routes = ro