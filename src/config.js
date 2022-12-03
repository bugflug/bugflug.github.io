export const config = await fetch('./config.json').then(response => response.json())
console.log(config)