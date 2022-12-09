import { config } from '/src/config.js'
import { Frag } from '/src/frag.js'
import { FragInfo } from '/frags/info.js'

export class PageHome extends Frag {
    static href = '/'
    static name = 'home'
    static hidden = true
    path = '/pages/home.html'

    mount (parent) {
        // add info to main
        new FragInfo().build().then(f => f.mount(parent))

        super.mount(parent)

        // hide the sidebar info-bar
        document.querySelector('#info-bar').classList.add('hidden')

        const streamWrapper = document.querySelector('#stream-wrapper')
        const streamContainer = document.querySelector('#stream')
    
        // embed a twitch stream
        const player = new Twitch.Player('stream', {
            channel: config.accountNames.twitch,
            width: 1280,
            height: 720,
            muted: 'true'
        })
    
        // wait for the proper responses to show/hide
        player.addEventListener(Twitch.Player.READY, () => {
            player.addEventListener(Twitch.Player.ONLINE, () => {
                player.addEventListener(Twitch.Player.PLAYING, () => {
                    player.setVolume(0.2)
                    player.setMuted(false)
                    streamWrapper.classList.remove('hidden')
                    streamWrapper.classList.add('show')
                })
            })
            player.addEventListener(Twitch.Player.OFFLINE, () => {
                streamContainer.innerHTML = ''
            })
        })
    }

    unmount () {
        document.querySelector('#info-bar').classList.remove('hidden')
        super.unmount()
    }
}