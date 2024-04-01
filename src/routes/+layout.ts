// fixes build error with @svelteks/adapter-static
export const prerender = true;

// simplest way to subscribe to page transitions
// export const load = ({ url }) => {
//     return { url: url.pathname }
// }