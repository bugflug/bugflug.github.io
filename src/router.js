// props to mitch dev
// https://www.youtube.com/watch?v=ZleShIpv5zQ

const pageContainer = document.querySelector('main')

const route = (event) => {
    event = event || window.event
    // prevent the window from routing
    event.preventDefault()

    // only update the url if its new
    if (window.location.pathname === event.target.href) {
        // cosmetically make it our location
        window.history.pushState({}, '', event.target.href)
        // update our page
        handleLocation()
    }
}
window.route = route

const routes = {
    404: '/pages/404.html',
    '/': '/pages/index.html'
}

const handleLocation = async () => {
    pageContainer.innerHTML = ''
    // getting the text and then creating and html
    // fragment with it allows the use of <script>
    const text = await fetch(routes[window.location.pathname] || routes[404]).then(data => data.text())
    const html = document.createRange().createContextualFragment(text)
    pageContainer.append(html)
}
window.onpopstate = handleLocation
window.onload = handleLocation