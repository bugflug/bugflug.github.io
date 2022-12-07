// loading the config like this guarantees
// that it'll load even if firefox tries
// to block json module imports
export const config = await fetch('/config.json').then(response => response.json())
window.config = config