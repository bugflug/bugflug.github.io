import { append } from '/src/components.js'
import { comInfo } from '/components/info.js'
import { handleLocation } from '/src/router.js'

append('#info-bar', comInfo)

document.addEventListener('DOMContentLoaded', () => {
    console.log('test')
    handleLocation()
})