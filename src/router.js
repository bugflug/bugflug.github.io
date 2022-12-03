// props to mitch dev
// https://www.youtube.com/watch?v=ZleShIpv5zQ

const pageContainer = document.querySelector('#page')

const route = (event) => {
    event = event || window.event
    // prevent the window from routing
    event.preventDefault()
    // cosmetically make it our location
    window.history.pushState({}, '', event.target.href)
    // update our page
    handleLocation()
}
window.route = route

const routes = {
    404: '/pages/404.html',
    '/': '/pages/index.html'
}

const handleLocation = async () => {
    pageContainer.innerHTML =
        await fetch(routes[window.location.pathname] || routes[404])
        .then((data) => data.text())
}
window.onpopstate = handleLocation
window.onload = handleLocation