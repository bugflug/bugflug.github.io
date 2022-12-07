import { appendComponent } from "./components.js"

// props to mitch dev
// https://www.youtube.com/watch?v=ZleShIpv5zQ

const pageContainer = document.querySelector('main')

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

// master route list
export const routes = {
    '/404':   { src: '/pages/404.html', hidden: true},
    '/':      { src: '/pages/index.html', hidden: true },
    '/items': { src: '/pages/itemcollection.html', name: 'item collection'}
}

const handleLocation = () => {
    console.log('traveling to ' + window.location.pathname)
    pageContainer.innerHTML = ''
    appendComponent(pageContainer, (routes[window.location.pathname] || routes['/404']).src)
}
window.onpopstate = handleLocation
window.onload = handleLocation