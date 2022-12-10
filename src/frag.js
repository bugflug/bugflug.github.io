import { el } from '/src/util.js'

export const hook = {
    constructor () {},
    build () {},
    mount () {},
    unmount () {}
}

/**
 * frag class :D
 * 
 * @prop {string} path - path to pull HTML from
 */
export class Frag {
    path  = '/pages/404.html'
    hook  = hook
    frags = []
    
    // @private
    #frag   = undefined
    #parent = undefined
    #range  = undefined

    /**
     * build before using!
     */
    constructor () {
        this.hook    = { ...hook, ...this.hook }

        // @hook
        this.hook.constructor(this)
    }

    /**
     * build the component
     * @returns
     */
    async build () {
        // create our document fragment
        // document fragments are very fast!
        this.#frag = document
        .createRange()
        .createContextualFragment(
            await fetch(this.path)
            .then(data => data.text()))

        // @hook
        // seems like checking for variables existing
        // is necessary in async methods
        if (this.hook.build) this.hook.build(this)

        return this
    }

    /**
     * append a frag to a parent
     * @param {string|Element} parent - string identifier or document element
     * @returns
     */
    mount(parent) {
        // @update
        this.#parent = el.from(parent)
        this.#range = document.createRange()

        //this.frags.forEach(f => f.mount(this.#frag))

        // @hook
        if (this.hook.mount) this.hook.mount(parent, this.#frag)

        // get the length now before it gets cleared when appended
        let dif = this.#frag.childNodes.length

        // appending a document frag clears it by move
        this.#parent.appendChild(this.#frag)
        this.#range.setStartBefore(
            this.#parent.childNodes[this.#parent.childNodes.length - dif], 0)
        this.#range.setEndAfter(
            this.#parent.childNodes[this.#parent.childNodes.length - 1], 0)


        return this
    }

    /**
     * remove the component from the DOM
     * @returns
     */
    unmount() {
        if (!this.#range)  throw new Error('this frag has no range to unmount!')
        if (!this.#parent) return false

        // handle child frags
        this.frags.forEach(f => f.unmount())

        // @update
        this.#frag = this.#range.extractContents()
        this.#range.detach() ; this.#range = undefined

        // @hook
        if (this.hook.unmount) this.hook.unmount(this.#frag)

        return this
    }
}

/**
 * @extends Frag
 * @prop {string}  href           - the url path this page should be linked to
 * @prop {string}  [name=]        - name of the page
 * @prop {boolean} [hidden=false] - hidden or not when listing pages?
 */
export class Page extends Frag {
    static href   = '/404'
    static name   = undefined
    static hidden = false
}

/**
 * modify an element on an async schedule with the given callback.
 * @param {string|Element} el 
 * @param {boolean} doesModifyClass - should the parent have the 'modified' and 'unmodified' classes handled?
 * @param {function} callback 
 */
export const asyncModify = (el, doesModifyClass, callback) => {
    if (typeof el === 'string') (doesModifyClass) ? el = document.querySelector(el + '.unmodified') : el = document.querySelector(el)
    ;(async () => {
        await callback(el)
        if (doesModifyClass) el.classList.add('modified')
    })()
    if (el.classList.contains('unmodified')) el.classList.remove('unmodified')
}