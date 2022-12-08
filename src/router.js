import { routes } from './routes.js'
import { append, remove } from "./components.js"

// props to mitch dev
// https://www.youtube.com/watch?v=ZleShIpv5zQ

const pageContainer = document.querySelector('main')
let currentPage = null

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
export const handleLocation = () => {
    if (!!currentPage) remove(pageContainer, currentPage)
    console.log(window.location.pathname)
    let src = routes[window.location.pathname] || routes['/404']
    currentPage = src
    append(pageContainer, src)
}
window.onpopstate = handleLocation
window.onload = handleLocation

