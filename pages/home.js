import { config } from '/src/config.js'
import { append, remove } from '/src/components.js'
import { comInfo } from '/components/info.js'

export const pageHome = {
    href: '/',
    hidden: true,
    path: '/pages/home.html',
    hook: {
        append: () => {
            append('main', comInfo)

            const streamWrapper = document.querySelector('#stream-wrapper')
            const streamContainer = document.querySelector('#stream')
        
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
    }
}