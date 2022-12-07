export const appendComponent = async (parent, src) => {
    // getting the text and then creating an html
    // fragment with it allows the use of <script>
    if (!(parent instanceof Element) && typeof parent === 'string') parent = document.querySelector(parent)
    const text = await fetch(src).then(data => data.text())
    const html = document.createRange().createContextualFragment(text)
    parent.append(html)
}
window.appendComponent = appendComponent

// modify an element on an async schedule
export const asyncModify = (el, doesModifyClass, callback) => {
    if (typeof el === 'string') (doesModifyClass) ? el = document.querySelector(el + '.unmodified') : el = document.querySelector(el)
    ;(async () => {
        await callback(el)
        if (doesModifyClass) el.classList.add('modified')
    })()
    if (el.classList.contains('unmodified')) el.classList.remove('unmodified')
}