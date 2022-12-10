import { Page404 } from '/pages/404.js'
import { PageHome } from '/pages/home.js'

export let routes = {}
;[
    Page404,
    PageHome
].forEach(page => { routes[page.href] = page })