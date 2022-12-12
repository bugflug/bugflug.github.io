import { Frag, el } from '../mod/frag/src/index.js'
import { FragAccounts } from '../frags/accounts.js'
import { FragPages } from '../frags/pages.js'
import { FragTitle } from '../frags/title.js'

export class FragSidebar extends Frag {
    static instances = []
    static show () {
        FragSidebar.instances.forEach(f => 
            el.modify(
                '.sidebar:not(.show)',
                el => el.classList.add('show'),
                f.frag || f.parent
        ))
    }
    static hide () {
        FragSidebar.instances.forEach(f =>
            el.modify(
                '.sidebar.show',
                el => el.classList.remove('show'),
                f.frag || f.parent
        ))
    }

    path = '/frags/sidebar.html'
    frags = {
        'accounts': FragAccounts,
        'pages'   : FragPages,
        'title'   : FragTitle
    }
    hook = {
        mounted (f) {
            FragSidebar.instances.push(f)
        },
        unmounted (f) {
            FragSidebar.instances.splice(this.instances.indexOf(f, 1))
        }
    }
}