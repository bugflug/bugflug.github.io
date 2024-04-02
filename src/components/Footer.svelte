<div id="footer">
    <div id="background"></div>
    <div id="route">
        <img src="{base}/logo 24x.svg" alt="bug logo" />
        {#each routes as { name, href }}<span>/</span><a class={(path === '/' + href) ? 'active fancy' : 'fancy'} href="{base}/{href}">{name}</a>{/each}
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div id="nav" on:mouseleave={() => (showMenu = false)}>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div id="menu" class="card glass" class:show={(!!showMenu)}>
            {#each navs as { name, href }}
                <a class="arrow-left" href="{base}/{href}">{name}</a>
            {/each}
        </div>
        <button on:click={() => (showMenu = !showMenu)} class:flipped={(!!showMenu)}></button>
    </div>
</div>

<style>
    #footer {
        /* display */
        position: fixed;
        bottom: 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;

        /* size */
        height: 5rem;
        width: 100vw;
    }

    #footer #background {
        /* display */
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: -89;
        pointer-events: none;

        /* size */
        width: 100%;
        height: 200%;

        /* colors */
        background: linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
        opacity: 0;

        /* animation */
        transition: opacity 1200ms ease-in-out;
    }

    #footer:hover #background {
        /* colors */
        opacity: 1;
    }

    #footer div {
        /* display */
        position: relative;
        display: flex;
        align-items: center;

        /* colors */
        color: var(--text-4);

        /* animation */
        transition: color 300ms ease;
    }

    #footer div:hover {
        /* colors */
        color: var(--text-3);

        /* animation */
        transition: color 150ms ease;
    }

    a {
        /* colors */
        color: inherit;
    }

    a:hover {
        /* colors */
        color: var(--text-1);
    }

    img {
        /* colors */
        opacity: 0.25;

        /* animation */
        transition: opacity 150ms ease;
    }


    #route {
        /* display */
        justify-content: flex-start;

        /* size */
        padding-left: 2rem;
    }

    #route img {
        /* size */
        width: 24px;

        /* display */
        margin-right: 2rem;
    }

    /* just hides the first span */
    #route span:first-child {
        /* display */
        display: none;
    }

    #route:hover a.active {
        /* font */
        color: var(--text-2);
    }

    #nav {
        /* display */
        justify-content: flex-end;

        /* size */
        padding-right: 2rem;
    }

    #nav button {
        /* display */
        position: relative;
        z-index: 2;
        bottom: 1rem;
        cursor: pointer;
        overflow: show;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: rotate(315deg);
        top: 0.33rem;

        /* border */
        border: 0;
        border-top: 0.125rem solid var(--text-4);
        border-right: 0.125rem solid var(--text-4);

        /* size */
        width: 0.75rem;
        height: 0.75rem;

        /* background */
        background: none;

        /* animation */
        transition: 300ms ease;
    }

    #nav button.flipped {
        /* display */
        top: -0.33rem;
        transform: rotate(135deg);
    }

    #nav:hover button {
        /* border */
        border-top-color: var(--text-3);
        border-right-color: var(--text-3);
    }

    #nav button:hover {
        /* border */
        border-top-color: var(--text-1);
        border-right-color: var(--text-1);

        /* animation */
        transition: 300ms ease, border-color 0ms;
    }

    #nav #menu {
        /* font */
        font-weight: 800;

        /* display */
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-start;
        bottom: calc(-100% - 4.75rem - 1rem - 1rem - 1rem - 1rem);
        right: 0.5rem;

        /* size */
        padding: 1.5rem 5.5rem 0.25rem 1.5rem;

        /* font */
        color: var(--text-3);

        /* border */
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: none;
        box-shadow: none;

        /* animation */
        transition: bottom 700ms ease, background 250ms ease;
    }

    #nav #menu.show {
        /* display */
        bottom: 0;

        /* background */
        /* background: rgba(255,255,255,0.05) */;

        /* animation */
        transition: bottom 500ms ease;
    }

    #nav a {
        /* size */
        height: 2em;
    }

</style>

<script lang="ts" context="module">
    import navs from '$lib/routes';
</script>

<script lang="ts">
    import { base } from '$app/paths';
    import { page } from '$app/stores';

    let showMenu = false;

    let path: string = '';
    let routes: { name: string, href: string }[] = [{ href: '', name: '~' }];

    page.subscribe(page => {
        // split the path string
        const keys = page.route.id?.split('/') || [];
        keys.shift();

        let newRoutes: { name: string, href: string }[] = [];

        // iterate over all the path keys and
        // create routes for all of them until empty
        while (keys.length > 0) {
            newRoutes.push({
                href: keys.join('/'),
                name: keys.pop() || ''
            });
        }

        // fix order
        newRoutes.reverse();

        // fix formatting issues with the home route
        (newRoutes[0].href === '')
            ? newRoutes[0].name = '~'
            : newRoutes.unshift({ href: '', name: '~' });

        if (newRoutes.length >= routes.length) {
            // if the new path is longer than (or as long as) the old one,
            // we keep it.
            // it will be correct regardless.
            //
            // old A /[A]
            // new A / B /[A]
            // ->  A / B /[A]
            //
            // old A /[A]
            // new A / A /[A]
            // ->  A / A /[A]
            routes = newRoutes;
        } else {
            // if the new path is shorter and contained in the old one, 
            // we discard it.
            // if the new path is shorter and NOT contained in the old one, 
            // we keep it.
            //
            // old A / A /[A]
            // new A /[B]
            // ->  A /[B]

            // old A / A /[A]
            // new A /[A]
            // ->  A /[A]/ A

            // if any of the new path does not match the old one,
            // we keep it.
            newRoutes.forEach((route, i) => {
                if (route.href !== routes[i].href && route.name !== routes[i].name) {
                    routes = newRoutes;
                };
            });
        }

        path = page.route.id || '';
    })
</script>