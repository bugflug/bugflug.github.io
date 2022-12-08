import { pageHome } from '/pages/home.js'

export let routes = {
    [pageHome.href]: pageHome
}
let register = {}
;[
    pageHome
].forEach(r => register[r.href] = r)
console.log(routes)