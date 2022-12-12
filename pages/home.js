import { config } from '../config.js'
import { Page } from '../mod/frag/src/index.js'
import { FragAccounts } from '../frags/accounts.js'
import { FragPages } from '../frags/pages.js'
import { FragTitle } from '../frags/title.js'

export class PageHome extends Page {
    static href = '/'
    static name = 'home'
    //static hidden = true

    path  = '/pages/home.html'
    frags = {
        'title'   : FragTitle,
        'accounts': FragAccounts,
        'pages'   : FragPages
    }

    hook = {
        mounted (_) {
            const streamWrapper = document.querySelector('#stream-wrapper')
            const streamContainer = document.querySelector('#stream')
        
            // embed a twitch stream
            const player = new Twitch.Player('stream', {
                channel: config.accounts.twitch.name,
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
    }
}