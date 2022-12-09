window.component = {}

// avoid making new parsers if possible
export const parser = new DOMParser()

/**
 * 
 */
export class Frag {
    // path to pull HTML from
    path = '/pages/404.html'
    // DocumentFragment
    #frag
    // parent element
    #parent
    // range
    #range

    /**
     * build before using!
     */
    constructor () {
        this.#frag    = undefined
        this.#parent  = undefined
        this.#range   = undefined
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

        return this
    }

    /**
     * append a frag to a parent
     * @param {string|Element} parent - string identifier or document element
     * @returns
     */
    mount(parent) {
        (typeof parent === 'string') ? this.#parent = document.querySelector(parent) : this.#parent = parent
        let fraglength = this.#frag.childNodes.length

        // [1]
        this.#parent.appendChild(this.#frag)
        
        this.#range = document.createRange()
        // [3]
        this.#range.setStart(
            this.#parent.childNodes[this.#parent.childNodes.length - fraglength], 0)
        this.#range.setEnd(
            this.#parent.childNodes[this.#parent.childNodes.length - 1], 0)

        return this
    }

    test () { console.log('range:', this.#range, 'frag:', this.#frag) }

    /**
     * remove the component from the DOM
     * @returns
     */
    unmount() {
        if (!this.#range) throw new Error('this frag has no range to unmount!')

        this.#frag = this.#range.extractContents()
        //this.#range = undefined

        return this
    }
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