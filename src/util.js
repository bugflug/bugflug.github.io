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