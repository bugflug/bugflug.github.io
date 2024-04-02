<div id="page">
    <!--<div id="background" out:fade={{ duration: 350 }}>
        <LazyImage url={backgroundUrl} duration={5000} />
    </div>-->
    <div id="splash-wrapper" out:comeinfade={{ duration: 300 }}>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div id="splash" on:click={generate} bind:this={splashElement}>
            {#each chars as char, i}
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <span style="animation-delay: {i * 100}ms;"on:mouseenter|stopPropagation={randomColor}>{char}</span>
            {/each}
        </div>
    </div>

    <div id="links-routes-wrapper" transition:slidefade={{ direction: 'up' }}>
        <div id="links">
            <p>links</p>
            {#each links as { name, href }}
                <a class="left" href="https://{href}">{name}</a>
            {/each}
        </div>
        <div id="routes">
            <p>pages</p>
            {#each routes as { name, href, wip }}
                <a class="left" href="{base}/{href}" class:wip={wip}>{name}</a>
            {/each}
        </div>
    </div>
</div>

<style>
    #page {
        /* display */
        position: relative;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 45vh 1fr;
        justify-items: center;
        overflow: hidden;

        /* size */
        height: 100vh;

        /* background */
        background: none;
    }

    @media (orientation: landscape) {
        #page {
            /* display */
            gap: 8rem 0;
            grid-template-columns: 1fr;
            grid-template-rows: 45vh 1fr;
        }
    }

    @media (orientation: portrait) {
        #page {
            /* display */
            gap: 0 0;
            grid-template-columns: 1fr;
            grid-template-rows: 45vh 1fr;
        }
    }

    :global(.clouds-background img) {
        /* display */
        image-rendering: pixelated;
    }

    #background {
        /* display */
        position: absolute;
        overflow: hidden;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: -89;

        /* size */
        width: 100%;
        height: 100%;
    }

    #background :global(img) {
        /* display */
        object-fit: cover;
        image-rendering: pixelated;
    }

    @media (orientation: landscape) {
        #background :global(img) {
            /* size */
            width: 100vw;
            max-width: 80vw;
            max-height: 80vw;
        }
    }

    @media (orientation: portrait) {
        #background :global(img) {
            /* size */
            height: 120vh;
        }
    }

    #splash-wrapper {
        /* display */
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }

    #splash {
        /* font */
        font-size: 4rem;
        font-family: var(--font-serif);
        font-weight: 900;
        text-align: center;
        user-select: none;

        /* display */
        cursor: pointer;
        overflow: visible;

        /* animation */
        animation: rotate 10s ease infinite;
    }

    #splash span {
        /* display */
        display: inline;
        position: relative;
        padding: 0 0 0.6em 0;
        top: 0em;

        /* animation */
        animation: bounce 5000ms ease infinite, come-in 100ms both 1;
        transition: color 200ms ease, top 150ms ease, opacity 200ms ease;
    }

    #links-routes-wrapper {
        /* display */
        display: grid;
        gap: 0 4rem;
        justify-items: center;

        /* size */
        width: 100%;
    }

    @media (orientation: landscape) {
        #links-routes-wrapper {
            /* display */
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr;

            /* size */
            max-width: 36rem;
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
            padding-right: 33%;
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

    @keyframes rotate {
        0% {
            transform: rotate(0.005turn);
        }

        50% {
            transform: rotate(-0.005turn);
        }

        100% {
            transform: rotate(0.005turn);
        }
    }

    @keyframes come-in {
        0% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }

    @keyframes bounce {
        0% {
            top: 0em;
        }

        50% {
            top: 0.4em;
        }

        100% {
            top: 0em;
        }
    }
</style>

<script lang="ts" context="module">
    import _routes from '$lib/routes';

    const routes = _routes.filter((route) => route.href !== '');

    const backgroundUrl = base + '/clouds-' + Math.floor(Math.random() * 3) + '.gif';
</script>

<script lang="ts">
    import { backgroundStyle, backgroundOpacity } from '../store/background';
    import { slidefade, comeinfade } from '$lib/transition';
    import { fade } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import { base } from '$app/paths';

    import { addBackground } from '../components/BackgroundStack.svelte';

    import LazyImage from '../components/LazyImage.svelte';

    const links = [
        { name: 'youtube' , href: 'youtube.com/@bugflug'                              },
        { name: 'twitch'  , href: 'twitch.tv/bugflug'                                 },
        { name: 'steam'   , href: 'steamcommunity.com/id/bugflug'                     },
        { name: 'twitter' , href: 'twitter.com/bugflug'                               },
        { name: 'backpack', href: 'backpack.tf/classifieds?steamid=76561198081991204' }
    ]

    const colors = [
        [255, 45, 108],
        [173, 0, 95],
        [224, 79, 11],
        [255, 162, 0],
        [255, 231, 76],
        [235, 255, 212],
        [72, 255, 0],
        [0, 207, 45],
        [49, 212, 224],
        [0, 110, 194],
        [22, 41, 247],
        [69, 0, 115],
        [142, 28, 199],
        [240, 24, 240]
    ]
    let splashes: string[];
    let chars: string[] = [];
    let colorFg = [0, 0, 0];
    let colorBg = [0, 0, 0];
    let splashElement: HTMLDivElement;
    let backgroundElement: HTMLDivElement;

    const onImgLoad = (el: HTMLElement) => {
        el.style.opacity = '1';
    }

    onMount(() => {
        // fetch the splashes
        fetch('splash.txt').then(response => 
            response.text().then(text => {
                // split at new lines
                splashes = text.split(/\r?\n/);
                generate();
            })
        ).catch(() => {
            // default to 'bugflug'
            splashes = ['bugflug'];
            generate();
        });

        // set page backgrounds
        addBackground({ color: 'var(--bg-3)', image: backgroundUrl, clazz: 'clouds-bg' });

        backgroundStyle.set('var(--bg-3)');
        // backgroundStyle.set('white')
        backgroundOpacity.set('1');
    });

    onDestroy(() => {
        backgroundOpacity.set('0');
    });

    // generate chars :D and colors :D
    const generate = () => {
        chars = [];

        // make sure the new selected splash is not the same as the last (by removing it)
        let splash: string;
        if (splashes.length > 0) {
            const rand = Math.floor(Math.random() * splashes.length);
            splash = splashes[rand];
            splashes.splice(rand, 1);
        } else {
            splash = '...'
        }

        // get a fresh color
        colorFg = colors[Math.floor(Math.random() * colors.length)];

        // ensure the second color is not the same
        colorBg = colorFg;
        while (colorBg === colorFg) {
            colorBg = colors[Math.floor(Math.random() * colors.length)];
        }

        splashElement.style.color = 'rgb(' + colorFg.join(',') + ')';

        const count = 9;
        let textShadow = '';
        let interpolatedColors: string[] = [];

        for (let i = 0; i < count; i++) {
            const factor = i / count;
            const r = interpolateNums(colorFg[0], colorBg[0], factor);
            const g = interpolateNums(colorFg[1], colorBg[1], factor);
            const b = interpolateNums(colorFg[2], colorBg[2], factor);

            interpolatedColors.push(r + ',' + g + ',' + b)
        }
    
        splashElement.style.textShadow = `
        ${count}px ${count}px rgba(${colorBg.join(',')},0.3),
        ${interpolatedColors
            .map((color, i) => `${i}px ${i}px rgb(${color})`)
            .join(',')},
        ${count}px ${count}px ${count}px rgba(0,0,0,0.5)
        `;

        setTimeout(() => chars = splash.split(''), 10);
    }

    const interpolateNums = (numA: number, numB: number, factor: number) => {
        return Math.round(numA * (1 - factor) + numB * factor);
    }

    // grab one random color and set it
    const randomColor = (event: any) => {
        const target = event.relatedTarget;

        // weird ass bug where it sometimes propogates onto other elements.
        // idkw hy this happens but just check this
        if (event.relatedTarget !== null) if (target.localName === 'span') {
            target.style.color = colors[Math.floor(Math.random() * colors.length)];
        }
    }
</script>