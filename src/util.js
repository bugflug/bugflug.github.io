/**
 * fisher-yates array shuffling
 * @param {array} array - array to shuffle
 * @returns 
 */
export const shuffle = (array) => {
    if (array.constructor === Array) {
        for (let i = array.length - 1 ; i > 0 ; i--) {
            const rand = Math.floor(Math.random() * (i + 1))
            const temp = array[i]
            array[i] = array[rand]
            array[rand] = temp
        }
    }
    return array
}

export const el = {
    check: (el) => (el instanceof Element || el instanceof Document),

    /**
     * returns an element if it is a string or Element.
     * throws an error if it is not
     * @param {string|Element|any} el - string, Element, or any
     * @param {Document|DocumentFragment} [doc=document] - document base to use
     * @returns {Element}
     */
    from (el, doc) {
        if (this.check(el)) return el
        if (!doc) doc = document
        if (typeof el === 'string') return doc.querySelector(el)
        throw new Error('not a string nor an element!')
    },

    /**
     * modifies an element with the given callback.
     * applies the 'unmodified' (if not present) class and the 'modified' class.
     * @param {string|Element|any} el - string, Element, or any
     * @param {function} callback - callback to run
     * @param {Document|DocumentFragment} [doc=document] - document base to use
     * @returns {Promise<Element>}
     */
    async modify (el, callback, doc) {
        if (!this.check(el)) throw new Error('not an element! use el.from()')
        if (!doc) doc = document

        let classList = el.classList

        // unmodified
        if (!(classList.contains('unmodified'))) classList.add('unmodified')
        classList.remove('unmodified')
        // ...modifying...
        await callback(el)
        // modified!
        classList.add('modified')
        return el
    }
}