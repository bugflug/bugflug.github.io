<!--
@component

Randomly generated splash text with an animation; cycles on click.
-->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    bind:this={el}
    on:click={splashme}
>
    {#each chars as char, i}
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <!-- svelte-ignore missing-declaration -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span style="animation-delay: {i * 100}ms;">{char}</span>
    {/each}
</div>

<style>
    div {
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

    div span {
        /* display */
        display: inline;
        position: relative;
        padding: 0 0 0.6em 0;
        top: 0em;

        /* animation */
        animation: bounce 5000ms ease infinite, come-in 100ms both 1;
        transition: color 200ms ease, top 150ms ease, opacity 200ms ease;
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
    /** `[red, green, blue][]` */
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
    ];

    /** Splash messages fetched during `onMount()`. */
    let splashes: string[];

    /** How many layers of colors should the text get? */
    const count = 7;

    /** Interpolates between two numbers with the given bias. */
    const interpolateNums = (numA: number, numB: number, bias: number) => {
        return Math.round(numA * (1 - bias) + numB * bias);
    }
</script>
<script lang="ts">
    import { onMount } from "svelte";

    /** All characters of the splash message. */
    let chars: string[] = [];

    /** Root div element. */
    let el: HTMLDivElement;

    /** Generate a splash! */
    const splashme = () => {
        // clear chars
        chars = [];

        // select a new splash.
        // pop it out so it will not be selected again.
        // default to '...' if none left.
        let splash: string;
        if (splashes.length > 0) {
            splash = splashes.splice(Math.random() * splashes.length, 1)[0];
        } else {
            splash = '...';
        }

        // get colors.
        // B =/= A
        let colorA = colors[Math.floor(Math.random() * colors.length)];
        let colorB = colorA;
        while (colorB === colorA) {
            colorB = colors[Math.floor(Math.random() * colors.length)];
        }

        // get interpolated colors between A and B.
        let cs: number[][] = [];
        for (let i = 0; i < count; i++) {
            const factor = i / count;
            cs.push([
                interpolateNums(colorA[0], colorB[0], factor),
                interpolateNums(colorA[1], colorB[1], factor),
                interpolateNums(colorA[2], colorB[2], factor)
            ])
        }

        // set the splash CSS
        el.style.color = `rgb(${colorA.join(',')})`;
        el.style.textShadow = `
            ${count}px ${count}px rgba(${colorB.join(',')}, 0.3),
            ${cs.map((c, i) => `${i}px ${i}px rgb(${c.join(',')})`)},
            ${count}px ${count}px ${count}px rgba(0,0,0,0.5)
        `;

        // safety timeout. javascript can suck my penis
        setTimeout(() => chars = splash.split(''), 10);
    }

    onMount(() => {
        // fetch the splashes
        fetch('splash.txt').then(response => 
            response.text().then(text => {
                // split at new lines
                splashes = text.split(/\r?\n/);
            })
        ).catch(() => {
            // default to 'bugflug'
            splashes = ['bugflug'];
        }).then(() => splashme());
    });
</script>
