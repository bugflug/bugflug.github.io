export const appendComponent = async (parent, src) => {
    // getting the text and then creating an html
    // fragment with it allows the use of <script>
    if (!(parent instanceof Element) && typeof parent === 'string') parent = document.querySelector(parent)
    const text = await fetch(src).then(data => data.text())
    const html = document.createRange().createContextualFragment(text)
    parent.append(html)
}
window.appendComponent = appendComponent