import { routes } from '/src/routes.js'
import { el } from '/src/util.js'

// props to mitch dev
// https://www.youtube.com/watch?v=ZleShIpv5zQ

let container = undefined
let initialized = false
export let page = undefined

/**
 * prevent an 'a' element from traveling to
 * its href if this method is used.
 * @param {Object} event 
 */
export const route = (event) => {
    event = event || window.event
    // prevent the window from routing
    event.preventDefault()

    // only update the url if its new
    if (window.location.pathname !== (event.target.pathname || '/')) {
        // cosmetically make it our location
        window.history.pushState({}, '', event.target.href || '/')
        // update our page
        handleLocation()
    }
}
window.route = route

/**
 * handles the current location
 */
export const handleLocation = async () => {
    page.unmount()
    let route = routes[window.location.pathname] || routes['/404']
    new route()
        .build()
        .then(f =>f.mount(container))
        .then(f => page = f)
}
window.onpopstate = handleLocation

/**
 * initialize the router at the given parent
 * @param {string|Element} [target='<main>'] - container to attach to
 */
export const init = (target) => {
    page = { unmount: () => {} }
    target = (!!target) ? el.from(target) : el.from('main')
    el.modify(target, handleLocation).then(el => container = el)
}