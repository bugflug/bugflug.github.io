import { Frag } from '/src/frag.js'
import { el } from '/src/util.js'
import { config } from '/src/config.js'

export class FragAccounts extends Frag {
    path = '/frags/accounts.html'
    hook = {
        build (frag) {
            // loop and append each account
            // as a link with the site as text
            el.modify('.accounts', el => {
                for (let account of config.accounts) {
                    let a = document.createElement('a')
                    a.href = 'https://' + account.url
                    a.appendChild(document.createTextNode(account.site))
                    
                    el.appendChild(a)
                }
            }, frag)
        }
    }
}