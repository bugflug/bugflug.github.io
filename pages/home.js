import { config } from '/src/config.js'
import { Page } from '/src/frag.js'
import { FragInfo } from '/frags/info.js'

const info = new FragInfo()

export class PageHome extends Page {
    static href = '/'
    static name = 'home'
    //static hidden = true

    path  = '/pages/home.html'
    frags = [ new FragInfo() ]

    hook = {
        mount (parent, frag) {
            // add info to main
            info.build().then(f => f.mount(frag))

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
        },

        unmount () {
            info.unmount()
            document.querySelector('#info-bar').classList.remove('hidden')
        }
    }
}