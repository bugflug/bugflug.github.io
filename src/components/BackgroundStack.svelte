<!--
@component

Stack of backgrounds that fade in and out on top of each other.
Avoids disrupting router navigation by existing outside of it.
-->

{#each $backgrounds as { b, i } (i)}
    <div
        style={b.style}
        class={`background ${b.clazz}`}
        in:fade={{ duration }}
        out:fade={{ duration }}
    >
        <!-- use smooth image loading if this bg has an image -->
        {#if (b.image !== undefined)}<FadeImage url={b.image} duration={duration} />{/if}
    </div>
{/each}

<style>
    .background {
        /* display */
        position: absolute;
        top: 0;
        left: 0;
        z-index: -99;
        display: flex;
        justify-content: center;
        align-items: center;

        /* background */
        /* TODO! */

        /* size */
        width: 100%;
        height: 100%;
    }

    .background :global(img) {
        /* display */
        object-fit: cover;

        /* size */
        width: 100%;
        height: 100%;
    }
</style>

<script lang="ts" context="module">
    import { writable, type Writable } from 'svelte/store';
    import { fade } from 'svelte/transition';

    // components
    import FadeImage from '$src/components/FadeImage.svelte';

    /** Animation/fade duration in ms. */
    const duration = 1000;

    /**
     * Background object with data like color, img, etc.
     * @typedef {Object} background
     * */
    export type background = {
        /** CSS to apply to this background. */
        style?: string;
        /** HTML class to give to this background. */
        clazz?: string;
        /** CSS color code. */
        color?: string;
        /** URL to an image in `static`. */
        image?: string;
    };

    /**
     * List of backgrounds.
     * Uses a `writable()` store to be reactive from inside a `<script context="module">`.
     * */
    let backgrounds: Writable<{ b: background, i: number }[]> = writable([]);

    /**
     * Add a background.
     * @param [b] {background} Background to add to the stack.
     * */
    let i = 0;
    export const addBackground = (b: background = { color: 'inherit' }) => {
        // add the color and image to the style
        if (b.style === undefined) b.style = '';
        if (b.clazz === undefined) b.clazz = '';
        if (b.color !== undefined) b.style = `${b.style} background-color: ${b.color};`;

        // add the background with key `i` that increments each call
        backgrounds.update((bs) => [...bs, { b, i: i++ }]);
    };
</script>

<script lang="ts">
    import { page } from '$app/stores';

    // clear ALL backgrounds on route change.
    // this fires before `addBackground` can when its called
    // correctly from an `onMount`.
    page.subscribe(() => backgrounds.update((bs) => []));
</script>