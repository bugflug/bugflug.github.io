import { routes } from './routes.js'

// props to mitch dev
// https://www.youtube.com/watch?v=ZleShIpv5zQ

const pageContainer = document.querySelector('main')
export let page = { unmount: () => {} }

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
    page = new route()
    await page.build()
    page.mount(pageContainer)
}
window.onpopstate = handleLocation