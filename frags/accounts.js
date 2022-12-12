import { Frag, el } from '../mod/frag/src/index.js'
import { config } from '../config.js'

export class FragAccounts extends Frag {
    path = '/frags/accounts.html'
    hook = {
        build (f) {
            // loop and append each account
            // as a link with the site as text
            el.modify('.accounts', el => {
                for (let site in config.accounts) {
                    let a = document.createElement('a')
                    a.href = 'https://' + config.accounts[site].url
                    a.appendChild(document.createTextNode(site))
                    
                    el.appendChild(a)
                }
            }, f.frag)
        }
    }
}