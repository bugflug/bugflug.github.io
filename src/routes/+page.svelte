<div id="splash-wrapper">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div id="splash" on:click={generate}>
        {#each chars as { char, color } , i}
            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <span style="
                animation-delay: {i * 100}ms;
                color: {color};"
            on:mouseenter|stopPropagation={randomColor}
            >{char}</span>
        {/each}
    </div>
</div>

<div id="links-wrapper">
    <div id="links">
        {#each links as { name, href }}
            <a href="https://{href}">{name}</a>
        {/each}
    </div>
</div>

<style>
    :global(#page) {
        /* display */
        display: grid;
        grid: 2fr 3fr / 1fr;
        gap: 4rem;
    }

    #splash-wrapper {
        /* display */
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }

    #splash {
        /* size */
        max-width: 32rem;

        /* font */
        font-size: 3rem;
        font-family: var(--font-serif);
        font-weight: 800;
        text-align: center;
        user-select: none;

        /* display */
        cursor: pointer;

        /* animation */
        animation: rotate 10s ease infinite;
    }

    #splash span {
        /* display */
        position: relative;
        padding: 0 0 0.6em 0;

        /* animation */
        animation: bounce 5s ease infinite, come-in 0s both 1;
        transition: color 0.2s ease;
    }

    #links-wrapper {
        /* display */
        display: flex;
        justify-content: center;
    }

    #links {
        /* size */
        max-width: 24rem;

        /* display */
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1rem 1rem 1rem 1rem;
        gap: 0.5rem 4rem;
    }

    #links a {
        /* display */
        position: relative;

        /* font */
        color: var(--text-2);
        font-weight: 800;

        /* animation */
        transition: color 150ms ease;
    }

    #links a:hover {
        /* font */
        color: var(--text-1);

        /* animation */
        transition: color 0ms;
    }

    #links a::after {
        /* display */
        position: absolute;
        content: '';
        right: calc(100% + 0.5rem);
        top: 0.6em;

        /* background */
        background: var(--text-2);

        /* size */
        height: 0.125rem;
        width: 0;

        /* animation */
        transition: width 200ms ease;
    }

    #links a:hover::after {
        /* size */
        width: 1.5rem;

        /* animation */
        transition: width 100ms ease;
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

<script lang="ts">
    import Card from '../components/Card.svelte';

    import { onMount } from 'svelte';

    const links = [
        { name: 'youtube' , href: 'youtube.com/@bugflug'                              },
        { name: 'twitch'  , href: 'twitch.tv/bugflug'                                 },
        { name: 'steam'   , href: 'steamcommunity.com/id/bugflug'                     },
        { name: 'twitter' , href: 'twitter.com/bugflug'                               },
        { name: 'backpack', href: 'backpack.tf/classifieds?steamid=76561198081991204' }
    ]
    const allColors = [
        '#ff306c',
        '#ad005f',
        '#e04f0b',
        '#ffa200',
        '#ffe74c',
        '#ebffd4',
        '#48ff00',
        '#00cf2d',
        '#31d4e0',
        '#006ec2',
        '#1629f7',
        '#450073',
        '#8e1cc7',
        '#f018f0'
    ];

    let splashes: string[];
    let chars: { char: string, color: string }[] = [];

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
    });

    // generate chars :D
    const generate = () => {
        chars = [];

        let splash: string = splashes[Math.floor(Math.random() * splashes.length)];
        let colors: string[] = [];

        // make sure the new selected splash is not the same as the last

        // ensure we have enough colors for the entire splash
        while (colors.length < splash.length) colors = colors.concat(allColors);

        // fisher-yates array shuffle to randomize all colors
        colors.forEach((color, i) => {
            const rand = Math.floor(Math.random() * (i + 1));
            
            colors[i] = colors[rand];
            colors[rand] = color;
        })

        setTimeout(() => chars = splash.split('').map((char, i) => {
            return {
                char,
                color: colors[i]
            }
        }), 10);
    }

    // grab one random color and set it
    const randomColor = (event: any) => {
        const target = event.relatedTarget;

        // weird ass bug where it sometimes propogates onto other elements.
        // idkw hy this happens but just check this
        if (target.localName === 'span') {
            target.style.color = allColors[Math.floor(Math.random() * allColors.length)];
        }
    }
</script>