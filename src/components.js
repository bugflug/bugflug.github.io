window.component = {}

/**
 * avoid making new parsers if possible
 */
export const parser = new DOMParser()

/**
 * append a source to a parent.
 * @param {string|Element} parent 
 * @param {Object} src 
 */
export const append = async (parent, src) => {
    if (typeof parent === 'string') parent = document.querySelector(parent)
    if (!src.html) src.html = await fetch(src.path).then(data => data.text())

    // parse our html into a valid nodes list
    src.nodes = parser.parseFromString(src.html, 'text/html').body.childNodes
    src.nodes.forEach(node => {
        parent.appendChild(node)
    })

    if (!!src.hook && typeof src.hook.append === 'function') src.hook.append(src.html)
}
window.component.append = append

/**
 * remove a source from a parent.
 * @param {string|Element} parent 
 * @param {Object} src 
 */
export const remove = async (parent, src) => {
    if (typeof parent === 'string') parent = document.querySelector(parent)
    if (!!src.hook && typeof src.hook.remove === 'function') src.hook.remove(src.html)
    src.nodes.forEach(node => parent.removeChild(node))
}
window.component.remove = remove

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