<!--
@component

This file is bloated :D
-->

<div id="page">

    <!-- randomly generated splash text -->
    <div id="splash-wrapper" out:comeinfade={{ duration: 300 }}>
        <Splash />
    </div>

    <!-- social links and page routes -->
    <div id="links-routes-wrapper" transition:slidefade={{ direction: 'up' }}>
        <div id="links">
            <!--<p>links</p>-->
            {#each links as { name, href }}
                <a class="left" href="https://{href}">{name}</a>
            {/each}
        </div>
        <!-- <div id="routes">
            <p>pages</p>
            {#each routes as { name, href, wip }}
                <a class="left" href="{base}/{href}" class:wip={wip}>{name}</a>
            {/each}
        </div> -->
    </div>

</div>

<style>
    #page {
        /* display */
        position: relative;
        display: grid;
        justify-items: center;
        overflow: hidden;
        gap: 2rem;
        grid-template-columns: 1fr;

        /* size */
        width: 100vw;
        height: 100vh;

        /* background */
        background: none;
    }

    @media (orientation: landscape) {
        #page {
            /* display */
            grid-template-rows: 45vh 1fr;

            /* size */
            padding-left: 8rem;
            padding-right: 8rem;
        }
    }

    @media (orientation: portrait) {
        #page {
            /* display */
            gap: 0;
            grid-template-rows: 1fr 1fr;
        }
    }

    :global(.background.clouds-background img) {
        /* display */
        image-rendering: pixelated;

        /* size */
        width: 110%;
        height: 110%;
    }

    #splash-wrapper {
        /* display */
        display: flex;
        justify-content: flex-end;
        align-items: center;

        /* size */
        min-height: 45vh;
        max-height: 45vh;
    }

    #links-routes-wrapper {
        /* display */
        display: grid;
        gap: 2rem;
        justify-items: center;
        align-items: start;

        /* size */
        width: 100%;
    }

    @media (orientation: landscape) {
        #links-routes-wrapper {
            /* display */
            /* grid-template-columns: 8rem 1fr;
            grid-template-rows: 1fr; */
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;

            /* size */
            /* max-width: 36rem; */
            max-width: 100%;
        }
    }

    @media (orientation: portrait) {
        #links-routes-wrapper {
            /* display */
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;

            /* size */
            max-width: 100%;
        }
    }

    #links, #routes {
        /* size */
        max-width: 24rem;

        /* font */
        font-weight: 800;

        /* display */
        display: flex;
        flex-direction: column;
        overflow: visible;
        overflow-inline: visible;
    }

    @media (orientation: landscape) {
        #links {
            /* display */
            justify-content: flex-start;
            justify-self: last;
        }
    }

    @media (orientation: portrait) {
        #links {
            /* display */
            justify-content: flex-end;

            /* size */
            /* padding-right: 33%; */
        }
    }

    @media (orientation: portrait) {
        #routes {
            /* size */
            padding-left: 33%;
        }
    }

    #links-routes-wrapper p {
        /* font */
        font-family: var(--font-serif);
        color: var(--text-4);
    }

    #links-routes-wrapper a {
        /* size */
        height: 1.375em;

        /* font */
        color: var(--text-3);
    }

    #links-routes-wrapper a.wip {
        /* font */
        color: var(--text-4);
    }

    #links-routes-wrapper a:hover {
        /* font */
        color: var(--text-1);
    }

    #links-routes-wrapper a::after {
        /* display */
        top: calc(50% + 0.125em);
    }
</style>

<script lang="ts" context="module">
    import _routes from '$lib/routes';
    import links from '$lib/links';

    /** `$lib/routes` without the home link */
    const routes = _routes.filter((r) => r.href !== '');
</script>

<script lang="ts">
    import { onMount  } from 'svelte';
    import { base } from '$app/paths';

    // transitions
    import { slidefade, comeinfade } from '$lib/transition';

    // components
    import { addBackground } from '$src/components/BackgroundStack.svelte';
    import Splash from '$src/components/Splash.svelte';

    onMount(() => {
        // black background with randomized cloud gif
        addBackground({
            color: 'var(--bg-3)',
            image: `${base}/clouds/clouds-${Math.floor(Math.random() * 3)}.gif`,
            clazz: 'clouds-background'
        });
    });
</script>